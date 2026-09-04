import { readFileSync } from "node:fs";
import type { Registro } from "../src/telemetria/registro";
import { analizar } from "./analisis";
import { misiones } from "../src/content";
import { esCodigo } from "../src/types/mission";

/**
 * Lee los registros que exportan los jugadores y dice que reescribir.
 *
 *   npm run informe -- registros/*.json
 */
const rutas = process.argv.slice(2);
if (!rutas.length) {
  console.error("\nUso: npm run informe -- <archivos .json exportados desde el juego>\n");
  process.exit(1);
}

const registros: Registro[] = [];
for (const ruta of rutas) {
  try {
    const r = JSON.parse(readFileSync(ruta, "utf8")) as Registro;
    if (r?.version !== 1 || !Array.isArray(r.sucesos)) {
      console.error(`  ${ruta}: no parece un registro de Sector Cero, se ignora`);
      continue;
    }
    registros.push(r);
  } catch (e) {
    console.error(`  ${ruta}: no se pudo leer (${e instanceof Error ? e.message : e})`);
  }
}

if (!registros.length) {
  console.error("\nNo se pudo leer ningun registro.\n");
  process.exit(1);
}

const filas = analizar(registros);

console.log(`\n${registros.length} jugador(es) · ${filas.length} misiones con actividad\n`);
console.log(
  "  " +
    "mision".padEnd(22) +
    "acierto".padStart(8) +
    "intentos".padStart(10) +
    "minutos".padStart(9) +
    "pistas".padStart(8) +
    "  abandonos",
);
console.log("  " + "-".repeat(72));

for (const f of filas) {
  console.log(
    "  " +
      f.mision.padEnd(22) +
      `${f.tasaAcierto}%`.padStart(8) +
      String(f.intentosHastaAcertar ?? "-").padStart(10) +
      String(f.minutosHastaAcertar ?? "-").padStart(9) +
      String(f.pistas).padStart(8) +
      String(f.abandonos).padStart(11),
  );
}

console.log("\n\nQue reescribir\n");

for (const f of filas) {
  const notas: string[] = [];
  if (f.tasaAcierto < 60 && f.jugadores > 1) {
    notas.push(`solo la supera el ${f.tasaAcierto}% de quienes la abren`);
  }
  if (f.minutosHastaAcertar !== null && f.minutosHastaAcertar > 15) {
    notas.push(`se tarda ${f.minutosHastaAcertar} min de media (el objetivo son 15)`);
  }
  if (f.fichasIlegibles > 0) {
    notas.push(`${f.fichasIlegibles} ficha(s) pegadas mal: revisa las instrucciones de copiado`);
  }
  // Lo util no es "aqui hay errores" sino "aqui hay errores que no tienes
  // cubiertos": los que ya tienen mensaje propio no hay que reescribirlos.
  const mision = misiones.find((m) => m.id === f.mision);
  const cubiertos = new Set(
    mision && esCodigo(mision)
      ? mision.fallosPrevistos
          .filter((x) => x.cuando.tipo === "salida")
          .map((x) => JSON.stringify((x.cuando as { valor: unknown }).valor))
      : [],
  );
  const repetidos = f.erroresFrecuentes.filter((e) => e.veces > 1);
  const sinCubrir = repetidos.filter((e) => !cubiertos.has(e.obtenido));
  const yaCubiertos = repetidos.filter((e) => cubiertos.has(e.obtenido));

  if (sinCubrir.length) {
    notas.push(
      "SIN MENSAJE: valores equivocados que se repiten y no tienen fallosPrevistos: " +
        sinCubrir.map((e) => `${e.obtenido} (x${e.veces})`).join(", "),
    );
  }
  if (yaCubiertos.length) {
    notas.push(
      "ya cubiertos por fallosPrevistos (el mensaje se esta usando): " +
        yaCubiertos.map((e) => `${e.obtenido} (x${e.veces})`).join(", "),
    );
  }
  if (f.faltasFrecuentes.length) {
    notas.push(
      "lo que mas falta en las fichas: " +
        f.faltasFrecuentes.map((x) => `${x.falta} (x${x.veces})`).join(", "),
    );
  }
  if (!notas.length) continue;
  console.log(`  ${f.mision}`);
  for (const n of notas) console.log(`    - ${n}`);
  console.log();
}
