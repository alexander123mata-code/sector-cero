import { test } from "node:test";
import assert from "node:assert/strict";
import { MisionSchema, type Mision } from "../src/types/mission";
import { comprobarEstatico } from "./reglas";

/** Mision minima valida; cada prueba rompe solo lo que quiere comprobar. */
function base(parches: Partial<Mision> = {}): Mision {
  return MisionSchema.parse({
    tipo: "codigo",
    id: "s99-m01-prueba",
    sector: 99,
    titulo: "Prueba",
    concepto: ["while"],
    requiere: [],
    minutos: 5,
    xp: 10,
    enunciado: "Guarda algo en total.",
    plantilla: "total = 0\n",
    solucion: "total = 1\n",
    salida: "total",
    pruebas: [
      { entrada: { a: 1 }, salida: 1, oculta: false },
      { entrada: { a: 2 }, salida: 2, oculta: true },
    ],
    restricciones: { exigeNodo: [], prohibeNodo: [], presupuestoOps: 10 },
    pistas: ["una pista"],
    fallosPrevistos: [],
    ...parches,
  });
}

const reglas = (m: Mision[]) => comprobarEstatico(m).map((h) => h.regla);

test("acepta una mision sana", () => {
  assert.deepEqual(reglas([base()]), []);
});

test("rechaza dos pruebas con la misma entrada y distinta salida", () => {
  const m = base({
    pruebas: [
      { entrada: { a: 1 }, salida: 1, oculta: false },
      { entrada: { a: 1 }, salida: 99, oculta: true },
    ],
  });
  assert.ok(reglas([m]).includes("pruebas-contradictorias"));
});

test("rechaza pruebas que no discriminan", () => {
  const m = base({
    pruebas: [
      { entrada: { a: 1 }, salida: 7, oculta: false },
      { entrada: { a: 2 }, salida: 7, oculta: true },
    ],
  });
  assert.ok(reglas([m]).includes("pruebas-no-discriminan"));
});

test("rechaza un fallo previsto que coincide con una salida correcta", () => {
  const m = base({
    fallosPrevistos: [{ cuando: { tipo: "salida", valor: 1 }, dice: "te equivocas" }],
  });
  assert.ok(reglas([m]).includes("fallo-previsto-choca"));
});

test("rechaza un prerrequisito inexistente", () => {
  assert.ok(reglas([base({ requiere: ["no-existe"] })]).includes("requiere-inexistente"));
});

test("rechaza un ciclo de prerrequisitos", () => {
  const a = base({ id: "a", requiere: ["b"] });
  const b = base({ id: "b", requiere: ["a"] });
  assert.ok(reglas([a, b]).includes("ciclo-de-prerrequisitos"));
});

test("rechaza ids duplicados", () => {
  assert.ok(reglas([base(), base()]).includes("id-duplicado"));
});

test("rechaza una mision sin solucion de referencia", () => {
  assert.ok(reglas([base({ solucion: "   " })]).includes("sin-solucion"));
});

test("avisa si el sensor no recibe datos en alguna prueba", () => {
  const m = base({
    sensor: { nombre: "leer_sensor", desde: "lecturas", agotado: -1 },
    plantilla: "total = 0\nleer_sensor()\n",
  });
  assert.ok(reglas([m]).includes("sensor-sin-datos"));
});

test("avisa si no hay ninguna prueba oculta", () => {
  const m = base({ pruebas: [{ entrada: { a: 1 }, salida: 1, oculta: false }] });
  assert.ok(reglas([m]).includes("sin-prueba-oculta"));
});

test("rechaza un caracter de control colado en un texto", () => {
  const m = base({ enunciado: `Activalo con .venv\u0007ctivate` });
  assert.ok(reglas([m]).includes("caracter-de-control"));
});

test("una mision de entorno sana no genera hallazgos", () => {
  const m = MisionSchema.parse({
    tipo: "entorno",
    id: "s99-e01",
    sector: 99,
    titulo: "Entorno",
    concepto: ["instalacion"],
    requiere: [],
    minutos: 10,
    xp: 100,
    enunciado: "Instala algo.",
    exige: ["python_version"],
    pasos: [{ texto: "Instala Python.", orden: "python --version" }],
    pistas: ["una pista"],
  });
  assert.deepEqual(comprobarEstatico([m]), []);
});

test("rechaza una comprobacion que el CLI no conoce", () => {
  const m = MisionSchema.parse({
    tipo: "entorno",
    id: "s99-e02",
    sector: 99,
    titulo: "Entorno",
    concepto: ["instalacion"],
    requiere: [],
    minutos: 10,
    xp: 100,
    enunciado: "Instala algo.",
    exige: ["rust_instalado"],
    pasos: [{ texto: "Instala Rust." }],
    pistas: ["una pista"],
  });
  assert.ok(reglas([m]).includes("comprobacion-desconocida"));
});

test("avisa de un salto de sector en el grafo", () => {
  const a = base({ id: "a", sector: 0, requiere: [] });
  const b = base({ id: "b", sector: 3, requiere: ["a"] });
  assert.ok(reglas([a, b]).includes("salto-de-sector"));
});

test("no avisa cuando los sectores son consecutivos", () => {
  const a = base({ id: "a", sector: 2, requiere: [] });
  const b = base({ id: "b", sector: 3, requiere: ["a"] });
  assert.ok(!reglas([a, b]).includes("salto-de-sector"));
});

test("no avisa entre misiones del mismo sector", () => {
  const a = base({ id: "a", sector: 3, requiere: [] });
  const b = base({ id: "b", sector: 3, requiere: ["a"] });
  assert.ok(!reglas([a, b]).includes("salto-de-sector"));
});
