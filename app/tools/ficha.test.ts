import { test } from "node:test";
import assert from "node:assert/strict";
import { ETIQUETAS, faltantes, leerFicha } from "../src/engine/ficha";

/**
 * Fichas reales emitidas por `cli/src/sector_cero/ficha.py`. Los dos lados
 * calculan la misma suma FNV-1a; si alguien toca uno, estos vectores fallan.
 */
const DOS =
  "eyJvayI6WyJnaXRfaW5zdGFsYWRvIiwicHl0aG9uX3ZlcnNpb24iXSwidHMiOjE3ODg1NDk5NjMsInYiOjF9.87d66784";
const VACIA = "eyJvayI6W10sInRzIjoxNzg4NTQ5OTYzLCJ2IjoxfQ.f11b0b19";
const TODAS =
  "eyJvayI6WyJjb21taXQiLCJnaXRfaWRlbnRpZGFkIiwiZ2l0X2luc3RhbGFkbyIsInBpcCIsInB5dGhvbl9lbl9wYXRoIiwicHl0aG9uX3ZlcnNpb24iLCJyZXBvX2dpdCIsInZlbnYiLCJ2c2NvZGUiXSwidHMiOjE3ODg1NDk5NjMsInYiOjF9.c673c76d";

test("lee una ficha emitida por el CLI", () => {
  assert.deepEqual(leerFicha(DOS)?.ok, ["git_instalado", "python_version"]);
});

test("lee una ficha sin nada listo", () => {
  assert.deepEqual(leerFicha(VACIA)?.ok, []);
});

test("lee una ficha con el entorno completo", () => {
  assert.equal(leerFicha(TODAS)?.ok.length, 9);
});

test("toda clave de una ficha completa tiene etiqueta legible", () => {
  for (const clave of leerFicha(TODAS)!.ok) {
    assert.ok(ETIQUETAS[clave], `falta etiqueta para '${clave}'`);
  }
});

test("tolera espacios y saltos al pegar", () => {
  assert.ok(leerFicha(`\n  ${DOS}  \n`));
});

test("rechaza una ficha con un caracter cambiado", () => {
  const otro = DOS.endsWith("0") ? "1" : "0";
  assert.equal(leerFicha(DOS.slice(0, -1) + otro), null);
});

test("rechaza una ficha truncada al copiar", () => {
  assert.equal(leerFicha(DOS.slice(0, 40)), null);
});

test("rechaza texto que no es una ficha", () => {
  for (const basura of ["", "hola", "a.b.c", "...", "!!!.87d66784"]) {
    assert.equal(leerFicha(basura), null, basura);
  }
});

test("faltantes nombra solo lo que la ficha no trae", () => {
  const ok = leerFicha(DOS)!.ok;
  assert.deepEqual(faltantes(["python_version", "vscode", "venv"], ok), ["vscode", "venv"]);
  assert.deepEqual(faltantes(["python_version"], ok), []);
});
