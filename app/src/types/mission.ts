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

/** Lo que toda mision tiene, se resuelva escribiendo codigo o montando el entorno. */
const BaseSchema = z.object({
  id: z.string(),
  sector: z.number().int().nonnegative(),
  titulo: z.string(),
  concepto: z.array(z.string()).min(1),
  requiere: z.array(z.string()).default([]),
  minutos: z.number().int().positive(),
  xp: z.number().int().positive(),
  enunciado: z.string(),
  pistas: z.array(z.string()).min(1),
});

/** Se resuelve escribiendo Python en el editor. */
export const MisionCodigoSchema = BaseSchema.extend({
  tipo: z.literal("codigo"),
  plantilla: z.string(),
  // Solucion de referencia. El validador la ejecuta contra las pruebas de la
  // propia mision: es lo que permite detectar pruebas contradictorias,
  // restricciones imposibles de cumplir y presupuestos de ops irreales.
  solucion: z.string(),
  salida: z.string(),
  sensor: SensorSchema.optional(),
  pruebas: z.array(PruebaSchema).min(1),
  restricciones: RestriccionesSchema,
  fallosPrevistos: z.array(FalloPrevistoSchema).default([]),
});

/** Un paso que el jugador ejecuta en su propia terminal. */
export const PasoSchema = z.object({
  texto: z.string(),
  orden: z.string().optional(),
});

/**
 * Se resuelve fuera del navegador: el jugador monta algo en su maquina, corre
 * `sector verify` y pega la ficha. `exige` nombra las claves de comprobacion
 * que esa ficha tiene que traer.
 */
export const MisionEntornoSchema = BaseSchema.extend({
  tipo: z.literal("entorno"),
  exige: z.array(z.string()).min(1),
  pasos: z.array(PasoSchema).min(1),
});

export const MisionSchema = z.discriminatedUnion("tipo", [
  MisionCodigoSchema,
  MisionEntornoSchema,
]);

export type Prueba = z.infer<typeof PruebaSchema>;
export type Sensor = z.infer<typeof SensorSchema>;
export type Restricciones = z.infer<typeof RestriccionesSchema>;
export type FalloPrevisto = z.infer<typeof FalloPrevistoSchema>;
export type Paso = z.infer<typeof PasoSchema>;
export type MisionCodigo = z.infer<typeof MisionCodigoSchema>;
export type MisionEntorno = z.infer<typeof MisionEntornoSchema>;
export type Mision = z.infer<typeof MisionSchema>;

export const esCodigo = (m: Mision): m is MisionCodigo => m.tipo === "codigo";
export const esEntorno = (m: Mision): m is MisionEntorno => m.tipo === "entorno";

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
