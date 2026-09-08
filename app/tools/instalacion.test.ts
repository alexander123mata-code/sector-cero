import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { misiones } from "../src/content";
import { esCodigo } from "../src/types/mission";
import { ORDEN_INSTALAR_CLI, RUEDA_CLI, VERSION_CLI } from "../src/content/instalacion";

const PYPROJECT = fileURLToPath(new URL("../../cli/pyproject.toml", import.meta.url));

function versionDelPaquete(): string {
  const texto = readFileSync(PYPROJECT, "utf8");
  const m = texto.match(/^version\s*=\s*"([^"]+)"/m);
  assert.ok(m, "cli/pyproject.toml no declara version");
  return m![1];
}

/**
 * La rueda se publica junto al sitio con el nombre que lleva la version
 * dentro. Si alguien sube la version del CLI y no toca instalacion.ts, la
 * primera mision del juego manda al jugador a una URL que da 404.
 */
test("la version del instalador coincide con la del paquete", () => {
  assert.equal(VERSION_CLI, versionDelPaquete());
});

test("el nombre de la rueda es el que produce hatchling", () => {
  assert.equal(RUEDA_CLI, `sector_cero-${VERSION_CLI}-py3-none-any.whl`);
});

/**
 * Nadie debe volver a escribir el comando a mano: la unica fuente es
 * instalacion.ts. Un `pip install sector-cero` suelto en una mision es un
 * comando que falla, porque el paquete no esta en PyPI.
 */
test("ninguna mision instala el CLI por su cuenta", () => {
  for (const m of misiones) {
    const textos = esCodigo(m)
      ? [m.enunciado, ...m.pistas]
      : [m.enunciado, ...m.pistas, ...m.pasos.flatMap((p) => [p.texto, p.orden ?? ""])];
    for (const t of textos) {
      assert.ok(
        !/pip install sector-cero(?!\S)/.test(t),
        `${m.id} instala el CLI desde PyPI, que no existe`,
      );
    }
  }
});

test("el Sector 00 instala el CLI antes de pedir la ficha", () => {
  const conOrden = misiones.filter(
    (m) => !esCodigo(m) && m.pasos.some((p) => p.orden?.includes(ORDEN_INSTALAR_CLI)),
  );
  assert.ok(conOrden.length > 0, "ninguna mision instala el comprobador");
});
