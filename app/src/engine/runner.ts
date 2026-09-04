import type { PeticionCorrer, Respuesta, SalidaCaso } from "./pyRunner.worker";

/**
 * El limite duro de operaciones ya corta los bucles infinitos dentro de Python;
 * estos relojes son la red de seguridad para cuando el worker se cuelga por otra
 * razon. Arrancar incluye descargar ~10 MB de interprete, asi que tiene su
 * propio margen.
 */
const ESPERA_INIT_MS = 60000;
const ESPERA_CORRER_MS = 20000;

/** Un runner destruido no debe emitir nada mas: su peticion en vuelo se cancela. */
export const CANCELADO = "CANCELADO";

export type Progreso = (texto: string) => void;

export class Runner {
  private worker: Worker | null = null;
  private cancelarPendiente: (() => void) | null = null;

  private asegurar(): Worker {
    if (!this.worker) {
      this.worker = new Worker(new URL("./pyRunner.worker.ts", import.meta.url), {
        type: "module",
      });
    }
    return this.worker;
  }

  /** Mata el worker y aborta lo que hubiera en vuelo. El siguiente uso levanta otro. */
  reiniciar() {
    this.cancelarPendiente?.();
    this.cancelarPendiente = null;
    this.worker?.terminate();
    this.worker = null;
  }

  destruir() {
    this.reiniciar();
  }

  precargar(onProgreso?: Progreso): Promise<void> {
    return this.pedir({ tipo: "init" }, ESPERA_INIT_MS, onProgreso).then(() => undefined);
  }

  correr(
    peticion: Omit<PeticionCorrer, "tipo">,
    onProgreso?: Progreso,
  ): Promise<{ nodos: string[]; casos: SalidaCaso[] }> {
    return this.pedir({ tipo: "correr", ...peticion }, ESPERA_CORRER_MS, onProgreso).then((r) => {
      if (r.tipo !== "resultado") throw new Error("respuesta inesperada del worker");
      return { nodos: r.nodos, casos: r.casos };
    });
  }

  private pedir(
    mensaje: { tipo: "init" } | PeticionCorrer,
    esperaMs: number,
    onProgreso?: Progreso,
  ): Promise<Respuesta> {
    if (this.cancelarPendiente) {
      return Promise.reject(new Error("ya hay una ejecucion en curso"));
    }
    const worker = this.asegurar();

    return new Promise<Respuesta>((resolver, rechazar) => {
      const reloj = setTimeout(() => {
        limpiar();
        this.reiniciar();
        rechazar(new Error("TIMEOUT"));
      }, esperaMs);

      const limpiar = () => {
        clearTimeout(reloj);
        worker.removeEventListener("message", alMensaje);
        worker.removeEventListener("error", alError);
        this.cancelarPendiente = null;
      };

      const alMensaje = (ev: MessageEvent<Respuesta>) => {
        const r = ev.data;
        if (r.tipo === "progreso") {
          onProgreso?.(r.texto);
          return;
        }
        limpiar();
        if (r.tipo === "fallo") rechazar(new Error(r.mensaje));
        else resolver(r);
      };

      const alError = (ev: ErrorEvent) => {
        limpiar();
        this.reiniciar();
        rechazar(new Error(ev.message || "el worker fallo"));
      };

      this.cancelarPendiente = () => {
        limpiar();
        rechazar(new Error(CANCELADO));
      };

      worker.addEventListener("message", alMensaje);
      worker.addEventListener("error", alError);
      worker.postMessage(mensaje);
    });
  }
}
