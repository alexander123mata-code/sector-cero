/**
 * Registro local de lo que hace el jugador.
 *
 * Existe por una razon concreta: los mensajes de `fallosPrevistos` son la
 * pieza que distingue este juego de un cuestionario, y hoy estan escritos a
 * ojo. Para acertarlos hace falta ver los intentos fallidos de verdad.
 *
 * No sale de la maquina del jugador. No hay servidor y no se envia nada: se
 * acumula en localStorage y se exporta a mano cuando alguien quiere
 * compartirlo. Tampoco se guarda nada que identifique a nadie, solo un id de
 * sesion aleatorio para poder seguir un recorrido de principio a fin.
 */

const CLAVE = "sector-cero-registro-v1";
const TOPE = 3000;

export type Fallo = {
  prueba: number;
  oculta: boolean;
  esperado: unknown;
  obtenido: unknown;
  error: string | null;
  timeout: boolean;
};

export type Suceso =
  | { tipo: "abre"; mision: string; t: number }
  | {
      tipo: "envia";
      mision: string;
      t: number;
      intento: number;
      codigo: string;
      superada: boolean;
      estrellas: number;
      ops: number;
      nodos: string[];
      fallos: Fallo[];
    }
  | { tipo: "pista"; mision: string; t: number; numero: number }
  | { tipo: "repone"; mision: string; t: number; intento: number }
  | {
      tipo: "ficha";
      mision: string;
      t: number;
      resultado: "ilegible" | "incompleta" | "ok";
      faltan: string[];
    };

export type Registro = { version: 1; sesion: string; sucesos: Suceso[] };

function nuevaSesion(): string {
  const b = new Uint8Array(8);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function leer(): Registro {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (crudo) {
      const r = JSON.parse(crudo) as Registro;
      if (r?.version === 1 && Array.isArray(r.sucesos)) return r;
    }
  } catch {
    // localStorage puede estar bloqueado o traer basura: se empieza de cero.
  }
  return { version: 1, sesion: nuevaSesion(), sucesos: [] };
}

let memoria: Registro | null = null;

function actual(): Registro {
  if (!memoria) memoria = leer();
  return memoria;
}

/**
 * Abrir la misma mision dos veces en el mismo instante es un artefacto, no
 * algo que haga un jugador: en desarrollo lo provoca StrictMode, que ejecuta
 * los efectos por duplicado. Como `aperturas` es una metrica, se filtra.
 */
export function esRepeticion(ultimo: Suceso | undefined, nuevo: Suceso): boolean {
  return (
    nuevo.tipo === "abre" &&
    ultimo?.tipo === "abre" &&
    ultimo.mision === nuevo.mision &&
    nuevo.t - ultimo.t < 2000
  );
}

export function registrar(s: Suceso): void {
  const r = actual();
  if (esRepeticion(r.sucesos.at(-1), s)) return;
  r.sucesos.push(s);
  // Se descartan los mas antiguos: un recorrido reciente completo vale mas
  // que un historial incompleto de hace semanas.
  if (r.sucesos.length > TOPE) r.sucesos.splice(0, r.sucesos.length - TOPE);
  try {
    localStorage.setItem(CLAVE, JSON.stringify(r));
  } catch {
    // Si no cabe o esta bloqueado, se sigue jugando: esto nunca debe
    // interrumpir una partida.
  }
}

export function registro(): Registro {
  return actual();
}

export function cuantos(): number {
  return actual().sucesos.length;
}

export function limpiar(): void {
  memoria = { version: 1, sesion: nuevaSesion(), sucesos: [] };
  try {
    localStorage.removeItem(CLAVE);
  } catch {
    // nada que hacer
  }
}

/** Vuelca el registro a un archivo que el jugador puede compartir. */
export function descargar(): void {
  const r = actual();
  const blob = new Blob([JSON.stringify(r, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `sector-cero-${r.sesion}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
