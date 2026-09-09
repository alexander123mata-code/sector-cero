import type { Ejercicio, EjercicioTabla } from "../types/mission";

/**
 * El Sector 01 no ejecuta nada: no hay interprete, no hay pruebas, no hay AST.
 * Lo unico que hace falta es comparar respuestas y decidir cuantas estrellas
 * merece el recorrido. Todo aqui es puro y se puede probar sin navegador.
 */

/**
 * Barajar tiene que ser determinista. Si el orden cambiase en cada render, un
 * jugador que recarga la pagina se encontraria otras piezas, y peor: React
 * volveria a barajar entre que eliges y compruebas.
 */
function semillaDe(texto: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h || 1;
}

export function barajar<T>(xs: readonly T[], semilla: string): T[] {
  const out = [...xs];
  let s = semillaDe(semilla);
  const siguiente = () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5;
    s >>>= 0;
    return s;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = siguiente() % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Un barajado que devuelve el orden original le regala la respuesta al
 * jugador. Con dos piezas pasa una de cada dos veces, asi que no es un caso
 * raro: se rota hasta que se mueva algo.
 */
export function barajarPiezas(piezas: readonly string[], semilla: string): string[] {
  const distintas = new Set(piezas).size > 1;
  let out = barajar(piezas, semilla);
  if (!distintas) return out;
  let intento = 0;
  while (out.every((p, i) => p === piezas[i]) && intento < 8) {
    intento++;
    out = barajar(piezas, `${semilla}#${intento}`);
  }
  if (out.every((p, i) => p === piezas[i])) out = [...out.slice(1), out[0]];
  return out;
}

/** Una respuesta por ejercicio. El orden se guarda como la lista ya montada. */
export type Respuesta =
  | { forma: "eleccion"; elegida: number | null }
  | { forma: "orden"; montado: string[] }
  | { forma: "tabla"; celdas: (string | null)[] };

export function respuestaVacia(e: Ejercicio): Respuesta {
  if (e.forma === "eleccion") return { forma: "eleccion", elegida: null };
  if (e.forma === "orden") return { forma: "orden", montado: [] };
  return { forma: "tabla", celdas: e.filas.map(() => null) };
}

/** Si esta a medias no se puede comprobar todavia. */
export function completa(e: Ejercicio, r: Respuesta): boolean {
  if (e.forma === "eleccion" && r.forma === "eleccion") return r.elegida !== null;
  if (e.forma === "orden" && r.forma === "orden") return r.montado.length === e.piezas.length;
  if (e.forma === "tabla" && r.forma === "tabla") return r.celdas.every((c) => c !== null);
  return false;
}

export function acierta(e: Ejercicio, r: Respuesta): boolean {
  if (e.forma === "eleccion" && r.forma === "eleccion") return r.elegida === e.correcta;
  if (e.forma === "orden" && r.forma === "orden") {
    return r.montado.length === e.piezas.length && r.montado.every((p, i) => p === e.piezas[i]);
  }
  if (e.forma === "tabla" && r.forma === "tabla") {
    return e.filas.every((f, i) => f.respuesta === r.celdas[i]);
  }
  return false;
}

/** Que filas de una tabla estan mal, para senalarlas en vez de dar un no seco. */
export function filasFalladas(e: EjercicioTabla, r: Respuesta): number[] {
  if (r.forma !== "tabla") return [];
  return e.filas.flatMap((f, i) => (f.respuesta === r.celdas[i] ? [] : [i]));
}

/**
 * Las tres estrellas se ganan acertando todo a la primera.
 *
 * Es deliberado que probar opciones hasta acertar te deje en una estrella: en
 * una mision de codigo la tercera estrella mide oficio, y aqui lo equivalente
 * es haberlo pensado antes de contestar. Se puede repetir la mision entera
 * para subir, igual que en las de codigo.
 */
export function estrellasLogica(total: number, aLaPrimera: number): 0 | 1 | 2 | 3 {
  if (total <= 0) return 0;
  if (aLaPrimera >= total) return 3;
  if (aLaPrimera * 2 >= total) return 2;
  return 1;
}
