/// <reference lib="webworker" />
import { ARNES_PY } from "./harness";

const PYODIDE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.mjs";

export type PeticionCorrer = {
  tipo: "correr";
  codigo: string;
  salida: string;
  sensor: string | null;
  casos: string[];
};
export type Peticion = { tipo: "init" } | PeticionCorrer;

export type SalidaCaso = {
  ok: boolean;
  timeout: boolean;
  ops: number;
  traza: unknown[];
  valor_json?: string;
  impreso?: string;
  error: string | null;
};
export type Respuesta =
  | { tipo: "progreso"; texto: string }
  | { tipo: "listo" }
  | { tipo: "resultado"; nodos: string[]; casos: SalidaCaso[] }
  | { tipo: "fallo"; mensaje: string };

type Piodide = {
  runPython: (src: string) => unknown;
  globals: { get: (n: string) => (...a: unknown[]) => string };
};

let py: Piodide | null = null;

const responder = (r: Respuesta) => (self as DedicatedWorkerGlobalScope).postMessage(r);

async function arrancar(): Promise<Piodide> {
  if (py) return py;
  responder({ tipo: "progreso", texto: "descargando el interprete" });
  const mod = await import(/* @vite-ignore */ PYODIDE);
  responder({ tipo: "progreso", texto: "montando python" });
  const instancia = (await mod.loadPyodide({ indexURL: PYODIDE.replace("pyodide.mjs", "") })) as Piodide;
  instancia.runPython(ARNES_PY);
  py = instancia;
  return instancia;
}

self.onmessage = async (ev: MessageEvent<Peticion>) => {
  const msg = ev.data;
  try {
    const p = await arrancar();
    if (msg.tipo === "init") {
      responder({ tipo: "listo" });
      return;
    }

    const analizar = p.globals.get("sc_nodos");
    const analisis = JSON.parse(analizar(msg.codigo)) as
      | { ok: true; nodos: string[] }
      | { ok: false; error: string };

    if (!analisis.ok) {
      responder({
        tipo: "resultado",
        nodos: [],
        casos: msg.casos.map(() => ({
          ok: false, timeout: false, ops: 0, traza: [], error: analisis.error,
        })),
      });
      return;
    }

    const correr = p.globals.get("sc_correr");
    const casos: SalidaCaso[] = msg.casos.map(
      (entrada) => JSON.parse(correr(msg.codigo, entrada, msg.salida, msg.sensor)) as SalidaCaso,
    );
    responder({ tipo: "resultado", nodos: analisis.nodos, casos });
  } catch (e) {
    responder({ tipo: "fallo", mensaje: e instanceof Error ? e.message : String(e) });
  }
};
