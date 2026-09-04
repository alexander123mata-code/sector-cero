import { MisionSchema, type Mision } from "../types/mission";
import { s00m01 } from "./s00-m01";
import { s00m02 } from "./s00-m02";
import { s00m03 } from "./s00-m03";
import { s00m04 } from "./s00-m04";
import { s00m05 } from "./s00-m05";
import { s00m06 } from "./s00-m06";
import { s03m01 } from "./s03-m01";
import { s03m02 } from "./s03-m02";
import { s03m03 } from "./s03-m03";
import { s03m04 } from "./s03-m04";
import { s03m05 } from "./s03-m05";

const crudas = [s00m01, s00m02, s00m03, s00m04, s00m05, s00m06, s03m01, s03m02, s03m03, s03m04, s03m05];

/**
 * El esquema se valida al arrancar, no durante la partida: una mision mal
 * formada tiene que romper el arranque, no la partida de alguien.
 */
export const misiones: Mision[] = crudas.map((m, i) => {
  const r = MisionSchema.safeParse(m);
  if (!r.success) {
    throw new Error(`Mision invalida en la posicion ${i}: ${r.error.message}`);
  }
  return r.data;
});

export function misionPorId(id: string): Mision | undefined {
  return misiones.find((m) => m.id === id);
}

export function indiceDe(id: string): number {
  return misiones.findIndex((m) => m.id === id);
}

export function siguienteMision(id: string): Mision | undefined {
  const i = indiceDe(id);
  return i >= 0 ? misiones[i + 1] : undefined;
}
