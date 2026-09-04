import { z } from "zod";

/** Un caso de prueba: globals que se inyectan y el valor esperado de la variable de salida. */
export const PruebaSchema = z.object({
  entrada: z.record(z.string(), z.unknown()),
  salida: z.unknown(),
  oculta: z.boolean().default(false),
});

/**
 * Algunas misiones no reciben los datos como variable sino a traves de una
 * funcion que los va entregando de uno en uno (el patron centinela). El arnes
 * convierte `desde` en un iterador y define `nombre()` en los globals.
 */
export const SensorSchema = z.object({
  nombre: z.string(),
  desde: z.string(),
  agotado: z.unknown(),
});

/** Nivel 2 del evaluador: se comprueban contra el AST, no contra la salida. */
export const RestriccionesSchema = z.object({
  exigeNodo: z.array(z.string()).default([]),
  prohibeNodo: z.array(z.string()).default([]),
  presupuestoOps: z.number().int().positive(),
});

/**
 * Feedback especifico. `salida` compara con el valor devuelto; `timeout` y
 * `error` se disparan por el tipo de fallo. El primero que coincide gana.
 */
export const FalloPrevistoSchema = z.object({
  cuando: z.discriminatedUnion("tipo", [
    z.object({ tipo: z.literal("salida"), valor: z.unknown() }),
    z.object({ tipo: z.literal("timeout") }),
    z.object({ tipo: z.literal("error"), contiene: z.string() }),
  ]),
  dice: z.string(),
});

export const MisionSchema = z.object({
  id: z.string(),
  sector: z.number().int().nonnegative(),
  titulo: z.string(),
  concepto: z.array(z.string()).min(1),
  requiere: z.array(z.string()).default([]),
  minutos: z.number().int().positive(),
  xp: z.number().int().positive(),
  enunciado: z.string(),
  plantilla: z.string(),
  salida: z.string(),
  sensor: SensorSchema.optional(),
  pruebas: z.array(PruebaSchema).min(1),
  restricciones: RestriccionesSchema,
  pistas: z.array(z.string()).min(1),
  fallosPrevistos: z.array(FalloPrevistoSchema).default([]),
});

export type Prueba = z.infer<typeof PruebaSchema>;
export type Sensor = z.infer<typeof SensorSchema>;
export type Restricciones = z.infer<typeof RestriccionesSchema>;
export type FalloPrevisto = z.infer<typeof FalloPrevistoSchema>;
export type Mision = z.infer<typeof MisionSchema>;

/** Resultado de un caso de prueba tras correr el codigo del jugador. */
export type ResultadoPrueba = {
  indice: number;
  oculta: boolean;
  paso: boolean;
  esperado: unknown;
  obtenido: unknown;
  traza: string;
  error: string | null;
  timeout: boolean;
};

export type Nivel = {
  numero: 1 | 2 | 3;
  nombre: string;
  conseguido: boolean;
  detalle: string;
};

export type Evaluacion = {
  pruebas: ResultadoPrueba[];
  niveles: [Nivel, Nivel, Nivel];
  estrellas: 0 | 1 | 2 | 3;
  ops: number;
  mensaje: string | null;
  superada: boolean;
};
