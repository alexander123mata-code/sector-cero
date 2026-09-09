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

/**
 * Un problema parecido, ya resuelto y explicado. No es la solucion de la
 * mision: es la primera vez que alguien ve como se escribe el concepto.
 * Entender que hay que hacer y saber escribirlo son dos cosas distintas.
 */
export const EjemploSchema = z.object({
  situacion: z.string(),
  codigo: z.string(),
  comentario: z.string(),
});

/**
 * Lo que se explica al superar la mision, nunca antes.
 *
 * Pasar la mision y haber aprendido no son lo mismo: con las tres pistas se
 * llega a la solucion copiandola. Este repaso desmonta la solucion pieza a
 * pieza para que quede algo cuando se apaga la pantalla.
 */
export const RepasoSchema = z.object({
  resumen: z.string(),
  piezas: z.array(z.object({ parte: z.string(), hace: z.string() })).min(1),
  ojo: z.string().optional(),
});

/** Se resuelve escribiendo Python en el editor. */
export const MisionCodigoSchema = BaseSchema.extend({
  tipo: z.literal("codigo"),
  plantilla: z.string(),
  // Obligatorio cuando la mision estrena un concepto; el validador lo exige.
  ejemplo: EjemploSchema.optional(),
  // Se muestra solo al superar. El validador lo exige en toda mision de codigo.
  repaso: RepasoSchema,
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

/**
 * Un ejercicio del Sector 01. Todos comparten la pregunta, un bloque opcional
 * en monoespaciado (pseudocodigo, una lista de pasos, unos datos) y el
 * `porque`: la explicacion que se muestra al contestar, se acierte o no.
 *
 * El `porque` no es un premio por acertar. Es la mision entera: acertar por
 * intuicion y no saber por que es exactamente lo que este sector viene a
 * arreglar.
 */
const EjercicioBase = z.object({
  pregunta: z.string(),
  muestra: z.string().optional(),
  porque: z.string(),
});

/** Elegir una respuesta entre varias. */
export const EjercicioEleccionSchema = EjercicioBase.extend({
  forma: z.literal("eleccion"),
  opciones: z.array(z.string()).min(2),
  correcta: z.number().int().nonnegative(),
});

/** Poner unos pasos en orden. `piezas` va en el orden correcto; la pantalla las baraja. */
export const EjercicioOrdenSchema = EjercicioBase.extend({
  forma: z.literal("orden"),
  piezas: z.array(z.string()).min(2),
});

/**
 * Rellenar la ultima columna de una tabla fila a fila. Sirve para una tabla de
 * verdad y para seguir el rastro de un valor paso a paso, que son el mismo
 * ejercicio con otra ropa.
 */
export const EjercicioTablaSchema = EjercicioBase.extend({
  forma: z.literal("tabla"),
  columnas: z.array(z.string()).min(2),
  opciones: z.array(z.string()).min(2),
  filas: z.array(z.object({ celdas: z.array(z.string()).min(1), respuesta: z.string() })).min(1),
});

export const EjercicioSchema = z.discriminatedUnion("forma", [
  EjercicioEleccionSchema,
  EjercicioOrdenSchema,
  EjercicioTablaSchema,
]);

/**
 * Se resuelve pensando, no escribiendo. El Sector 01 va antes de la primera
 * linea de Python a proposito: la logica y el idioma en que se escribe son dos
 * cosas distintas, y mezclarlas es lo que hace que alguien crea que no sabe
 * programar cuando lo que no sabe es la sintaxis.
 *
 * Por eso aqui no hay editor, ni interprete, ni pruebas: hay preguntas sobre
 * mecanismo. Nada de lo que aparece en estos ejercicios esta escrito en
 * Python.
 */
export const MisionLogicaSchema = BaseSchema.extend({
  tipo: z.literal("logica"),
  ejemplo: EjemploSchema.optional(),
  repaso: RepasoSchema,
  ejercicios: z.array(EjercicioSchema).min(1),
});

export const MisionSchema = z.discriminatedUnion("tipo", [
  MisionCodigoSchema,
  MisionEntornoSchema,
  MisionLogicaSchema,
]);

export type Prueba = z.infer<typeof PruebaSchema>;
export type Sensor = z.infer<typeof SensorSchema>;
export type Restricciones = z.infer<typeof RestriccionesSchema>;
export type FalloPrevisto = z.infer<typeof FalloPrevistoSchema>;
export type Ejemplo = z.infer<typeof EjemploSchema>;
export type Repaso = z.infer<typeof RepasoSchema>;
export type Paso = z.infer<typeof PasoSchema>;
export type MisionCodigo = z.infer<typeof MisionCodigoSchema>;
export type MisionEntorno = z.infer<typeof MisionEntornoSchema>;
export type Ejercicio = z.infer<typeof EjercicioSchema>;
export type EjercicioEleccion = z.infer<typeof EjercicioEleccionSchema>;
export type EjercicioOrden = z.infer<typeof EjercicioOrdenSchema>;
export type EjercicioTabla = z.infer<typeof EjercicioTablaSchema>;
export type MisionLogica = z.infer<typeof MisionLogicaSchema>;
export type Mision = z.infer<typeof MisionSchema>;

export const esCodigo = (m: Mision): m is MisionCodigo => m.tipo === "codigo";
export const esEntorno = (m: Mision): m is MisionEntorno => m.tipo === "entorno";
export const esLogica = (m: Mision): m is MisionLogica => m.tipo === "logica";

/** Resultado de un caso de prueba tras correr el codigo del jugador. */
export type ResultadoPrueba = {
  indice: number;
  oculta: boolean;
  entrada: Record<string, unknown>;
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
