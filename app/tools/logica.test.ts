import { test } from "node:test";
import assert from "node:assert/strict";
import { MisionSchema, esLogica, type Mision } from "../src/types/mission";
import { comprobarEstatico } from "./reglas";
import {
  acierta,
  barajarPiezas,
  completa,
  estrellasLogica,
  respuestaVacia,
} from "../src/engine/logica";

/** Mision de logica minima valida; cada prueba rompe solo lo que comprueba. */
function base(parches: Record<string, unknown> = {}): Mision {
  return MisionSchema.parse({
    tipo: "logica",
    id: "s99-m01-logica",
    sector: 99,
    titulo: "Prueba",
    concepto: ["pensar"],
    requiere: [],
    minutos: 5,
    xp: 10,
    enunciado: "Contesta.",
    ejemplo: { situacion: "Un caso parecido.", codigo: "paso 1", comentario: "Asi se lee." },
    repaso: {
      resumen: "Lo que acabas de hacer.",
      piezas: [{ parte: "el orden", hace: "Manda." }],
    },
    ejercicios: [
      {
        forma: "eleccion",
        pregunta: "Cual?",
        opciones: ["esta", "la otra"],
        correcta: 0,
        porque: "Porque si.",
      },
    ],
    pistas: ["una pista"],
    ...parches,
  });
}

const reglas = (m: Mision[]) => comprobarEstatico(m).map((h) => h.regla);

const tabla = (filas: { celdas: string[]; respuesta: string }[]) => ({
  forma: "tabla",
  pregunta: "Rellena.",
  columnas: ["dato", "resultado"],
  opciones: ["si", "no"],
  filas,
  porque: "Porque si.",
});

/** Saca el primer ejercicio ya validado por el esquema. */
function primero(m: Mision) {
  if (!esLogica(m)) throw new Error("no es una mision de logica");
  return m.ejercicios[0];
}

test("acepta una mision de logica sana", () => {
  assert.deepEqual(reglas([base()]), []);
});

test("rechaza una correcta que apunta fuera de las opciones", () => {
  const m = base({
    ejercicios: [
      { forma: "eleccion", pregunta: "Cual?", opciones: ["a", "b"], correcta: 5, porque: "eso" },
    ],
  });
  assert.ok(reglas([m]).includes("correcta-fuera-de-rango"));
});

test("rechaza dos opciones identicas", () => {
  const m = base({
    ejercicios: [
      { forma: "eleccion", pregunta: "Cual?", opciones: ["a", "a"], correcta: 0, porque: "eso" },
    ],
  });
  assert.ok(reglas([m]).includes("opciones-repetidas"));
});

test("rechaza un ejercicio sin porque", () => {
  const m = base({
    ejercicios: [
      { forma: "eleccion", pregunta: "Cual?", opciones: ["a", "b"], correcta: 0, porque: "  " },
    ],
  });
  assert.ok(reglas([m]).includes("porque-vacio"));
});

test("rechaza piezas repetidas: el orden correcto seria ambiguo", () => {
  const m = base({
    ejercicios: [{ forma: "orden", pregunta: "Ordena.", piezas: ["abre", "abre"], porque: "eso" }],
  });
  assert.ok(reglas([m]).includes("piezas-repetidas"));
});

/**
 * Hermana de 'pruebas-no-discriminan'. Existe por lo mismo: una tabla que se
 * contesta igual en todas sus filas la aprueba quien pulse siempre el mismo
 * boton, sin leer nada.
 */
test("rechaza una tabla que se contesta siempre igual", () => {
  const m = base({
    ejercicios: [
      tabla([
        { celdas: ["1"], respuesta: "si" },
        { celdas: ["2"], respuesta: "si" },
      ]),
    ],
  });
  assert.ok(reglas([m]).includes("tabla-no-discrimina"));
});

test("acepta una tabla que si discrimina", () => {
  const m = base({
    ejercicios: [
      tabla([
        { celdas: ["1"], respuesta: "si" },
        { celdas: ["2"], respuesta: "no" },
      ]),
    ],
  });
  assert.deepEqual(reglas([m]), []);
});

test("rechaza una respuesta que no esta entre las opciones", () => {
  const m = base({
    ejercicios: [
      tabla([
        { celdas: ["1"], respuesta: "quiza" },
        { celdas: ["2"], respuesta: "no" },
      ]),
    ],
  });
  assert.ok(reglas([m]).includes("respuesta-fuera-de-opciones"));
});

test("rechaza una fila con mas celdas que columnas", () => {
  const m = base({
    ejercicios: [
      tabla([
        { celdas: ["1", "de mas"], respuesta: "si" },
        { celdas: ["2"], respuesta: "no" },
      ]),
    ],
  });
  assert.ok(reglas([m]).includes("fila-descuadrada"));
});

test("avisa si la correcta cae siempre en la misma posicion", () => {
  const uno = (p: string) => ({
    forma: "eleccion",
    pregunta: p,
    opciones: ["a", "b"],
    correcta: 0,
    porque: "eso",
  });
  const m = base({ ejercicios: [uno("una"), uno("dos"), uno("tres")] });
  assert.ok(reglas([m]).includes("correcta-siempre-igual"));
});

/** Prueba que textosDe recorre tambien los ejercicios, no solo el enunciado. */
test("detecta un caracter de control dentro de un ejercicio", () => {
  const m = base({
    ejercicios: [
      {
        forma: "eleccion",
        pregunta: `pulsa ${String.fromCharCode(7)} aqui`,
        opciones: ["a", "b"],
        correcta: 0,
        porque: "eso",
      },
    ],
  });
  assert.ok(reglas([m]).includes("caracter-de-control"));
});

test("exige ejemplo a la mision de logica que estrena concepto", () => {
  const m = base({ ejemplo: undefined });
  assert.ok(reglas([m]).includes("concepto-sin-ejemplo"));
});

test("barajar es determinista", () => {
  const piezas = ["uno", "dos", "tres", "cuatro"];
  assert.deepEqual(barajarPiezas(piezas, "s01#0"), barajarPiezas(piezas, "s01#0"));
});

/** Si el barajado devolviese el orden original, la respuesta vendria hecha. */
test("barajar nunca devuelve el orden correcto", () => {
  for (let n = 2; n <= 6; n++) {
    const piezas = Array.from({ length: n }, (_, i) => `paso ${i}`);
    for (let s = 0; s < 200; s++) {
      const salida = barajarPiezas(piezas, `semilla ${n} ${s}`);
      assert.deepEqual([...salida].sort(), [...piezas].sort());
      assert.ok(
        salida.some((p, i) => p !== piezas[i]),
        `con ${n} piezas y semilla ${s} salio el orden original`,
      );
    }
  }
});

test("una eleccion acierta solo con la opcion marcada", () => {
  const e = primero(base());
  assert.ok(acierta(e, { forma: "eleccion", elegida: 0 }));
  assert.ok(!acierta(e, { forma: "eleccion", elegida: 1 }));
});

test("un orden acierta solo con la secuencia completa y exacta", () => {
  const e = primero(
    base({ ejercicios: [{ forma: "orden", pregunta: "p", piezas: ["a", "b", "c"], porque: "x" }] }),
  );
  assert.ok(acierta(e, { forma: "orden", montado: ["a", "b", "c"] }));
  assert.ok(!acierta(e, { forma: "orden", montado: ["a", "c", "b"] }));
  assert.ok(!acierta(e, { forma: "orden", montado: ["a", "b"] }));
});

test("una tabla a medias no se puede comprobar todavia", () => {
  const e = primero(
    base({
      ejercicios: [
        tabla([
          { celdas: ["1"], respuesta: "si" },
          { celdas: ["2"], respuesta: "no" },
        ]),
      ],
    }),
  );
  assert.ok(!completa(e, respuestaVacia(e)));
  assert.ok(!completa(e, { forma: "tabla", celdas: ["si", null] }));
  assert.ok(completa(e, { forma: "tabla", celdas: ["si", "no"] }));
  assert.ok(acierta(e, { forma: "tabla", celdas: ["si", "no"] }));
  assert.ok(!acierta(e, { forma: "tabla", celdas: ["no", "no"] }));
});

test("las tres estrellas se ganan acertandolo todo a la primera", () => {
  assert.equal(estrellasLogica(4, 4), 3);
  assert.equal(estrellasLogica(4, 3), 2);
  assert.equal(estrellasLogica(4, 2), 2);
  assert.equal(estrellasLogica(4, 1), 1);
  assert.equal(estrellasLogica(4, 0), 1);
  assert.equal(estrellasLogica(0, 0), 0);
});

/**
 * El fallo que motivo separar el vocabulario por tipo: el Sector 01 usaba
 * 'variable' antes que el 02, asi que la mision de codigo que ensena a
 * escribirla dejaba de necesitar ejemplo. Ver una caja dibujada no ensena a
 * teclear `respuesta = mensaje`.
 */
test("una mision de codigo estrena su concepto aunque una de logica ya lo usara", () => {
  const conceptoCompartido = ["variable"];
  const logica = base({ id: "s99-m01-logica", concepto: conceptoCompartido });
  const codigo = MisionSchema.parse({
    tipo: "codigo",
    id: "s99-m02-codigo",
    sector: 99,
    titulo: "Prueba",
    concepto: conceptoCompartido,
    requiere: [],
    minutos: 5,
    xp: 10,
    enunciado: "Guarda algo en total.",
    plantilla: "total = 0\n",
    solucion: "total = 1\n",
    repaso: { resumen: "Lo hecho.", piezas: [{ parte: "x = 1", hace: "Guarda un uno." }] },
    salida: "total",
    pruebas: [
      { entrada: { a: 1 }, salida: 1, oculta: false },
      { entrada: { a: 2 }, salida: 2, oculta: true },
    ],
    restricciones: { exigeNodo: [], prohibeNodo: [], presupuestoOps: 10 },
    pistas: ["una pista"],
    fallosPrevistos: [],
  });
  assert.ok(reglas([logica, codigo]).includes("concepto-sin-ejemplo"));
});
