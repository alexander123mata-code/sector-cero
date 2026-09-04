import { test } from "node:test";
import assert from "node:assert/strict";
import { esRepeticion, type Registro, type Suceso } from "../src/telemetria/registro";
import { analizar } from "./analisis";

const T0 = 1_700_000_000_000;

function envio(mision: string, min: number, superada: boolean, obtenido: unknown): Suceso {
  return {
    tipo: "envia",
    mision,
    t: T0 + min * 60000,
    intento: 1,
    codigo: "total = 0",
    superada,
    estrellas: superada ? 3 : 0,
    ops: 10,
    nodos: ["While"],
    fallos: superada
      ? []
      : [{ prueba: 0, oculta: false, esperado: 25, obtenido, error: null, timeout: false }],
  };
}

const reg = (sesion: string, sucesos: Suceso[]): Registro => ({ version: 1, sesion, sucesos });

test("la tasa de acierto cuenta jugadores, no envios", () => {
  const a = reg("a", [{ tipo: "abre", mision: "m1", t: T0 }, envio("m1", 1, true, null)]);
  const b = reg("b", [
    { tipo: "abre", mision: "m1", t: T0 },
    envio("m1", 1, false, 24),
    envio("m1", 2, false, 24),
  ]);
  const [m] = analizar([a, b]);
  assert.equal(m.jugadores, 2);
  assert.equal(m.superada, 1);
  assert.equal(m.tasaAcierto, 50);
  assert.equal(m.envios, 3);
});

test("agrupa los valores equivocados que se repiten", () => {
  const rs = [
    reg("a", [envio("m1", 1, false, 24), envio("m1", 2, false, 24)]),
    reg("b", [envio("m1", 1, false, 24), envio("m1", 2, false, 10)]),
  ];
  const [m] = analizar(rs);
  assert.deepEqual(m.erroresFrecuentes[0], { obtenido: "24", veces: 3 });
  assert.deepEqual(m.erroresFrecuentes[1], { obtenido: "10", veces: 1 });
});

test("cuenta como abandono a quien lo intento y nunca lo consiguio", () => {
  const rs = [
    reg("a", [{ tipo: "abre", mision: "m1", t: T0 }, envio("m1", 1, false, 24)]),
    reg("b", [{ tipo: "abre", mision: "m1", t: T0 }, envio("m1", 1, true, null)]),
  ];
  const [m] = analizar(rs);
  assert.equal(m.abandonos, 1);
});

test("abrir una mision sin intentarla no cuenta como abandono", () => {
  const [m] = analizar([reg("a", [{ tipo: "abre", mision: "m1", t: T0 }])]);
  assert.equal(m.abandonos, 0);
  assert.equal(m.aperturas, 1);
});

test("mide intentos y minutos hasta el primer acierto", () => {
  const r = reg("a", [
    { tipo: "abre", mision: "m1", t: T0 },
    envio("m1", 2, false, 24),
    envio("m1", 8, true, null),
    envio("m1", 20, true, null),
  ]);
  const [m] = analizar([r]);
  assert.equal(m.intentosHastaAcertar, 2);
  assert.equal(m.minutosHastaAcertar, 8);
});

test("resume las fichas de una mision de entorno", () => {
  const rs = [
    reg("a", [
      { tipo: "abre", mision: "s00", t: T0 },
      { tipo: "ficha", mision: "s00", t: T0 + 1000, resultado: "ilegible", faltan: [] },
      { tipo: "ficha", mision: "s00", t: T0 + 2000, resultado: "incompleta", faltan: ["venv"] },
      { tipo: "ficha", mision: "s00", t: T0 + 3000, resultado: "ok", faltan: [] },
    ]),
    reg("b", [
      { tipo: "abre", mision: "s00", t: T0 },
      { tipo: "ficha", mision: "s00", t: T0 + 1000, resultado: "incompleta", faltan: ["venv"] },
    ]),
  ];
  const [m] = analizar(rs);
  assert.equal(m.fichasIlegibles, 1);
  assert.deepEqual(m.faltasFrecuentes[0], { falta: "venv", veces: 2 });
  assert.equal(m.tasaAcierto, 50);
});

test("ordena las misiones de peor a mejor tasa de acierto", () => {
  const rs = [
    reg("a", [envio("facil", 1, true, null), envio("dificil", 1, false, 1)]),
    reg("b", [envio("facil", 1, true, null), envio("dificil", 1, false, 1)]),
  ];
  assert.deepEqual(analizar(rs).map((m) => m.mision), ["dificil", "facil"]);
});

test("las pistas se cuentan por mision", () => {
  const r = reg("a", [
    { tipo: "pista", mision: "m1", t: T0, numero: 1 },
    { tipo: "pista", mision: "m1", t: T0 + 60000, numero: 2 },
    { tipo: "pista", mision: "m2", t: T0, numero: 1 },
  ]);
  const porMision = Object.fromEntries(analizar([r]).map((m) => [m.mision, m.pistas]));
  assert.deepEqual(porMision, { m1: 2, m2: 1 });
});

test("dos aperturas seguidas de la misma mision son una sola", () => {
  const a: Suceso = { tipo: "abre", mision: "m1", t: T0 };
  assert.equal(esRepeticion(a, { tipo: "abre", mision: "m1", t: T0 + 1 }), true);
  assert.equal(esRepeticion(a, { tipo: "abre", mision: "m2", t: T0 + 1 }), false);
  assert.equal(esRepeticion(a, { tipo: "abre", mision: "m1", t: T0 + 5000 }), false);
  assert.equal(esRepeticion(undefined, a), false);
  assert.equal(esRepeticion(a, envio("m1", 1, true, null)), false);
});
