import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * Andamiaje de una mision nueva: crea el archivo y lo registra en el indice.
 * Deja huecos marcados con TODO y una solucion que no resuelve nada, para que
 * el validador rechace la mision hasta que este de verdad escrita.
 *
 *   npm run mision:nueva -- s03-m06 "Contar hacia atras"
 */
const [id, ...resto] = process.argv.slice(2);
const titulo = resto.join(" ");

if (!id || !titulo) {
  console.error('\nUso: npm run mision:nueva -- <id> "<titulo>"\n');
  process.exit(1);
}

const m = id.match(/^s(\d{2})-m(\d{2})/);
if (!m) {
  console.error(`\nEl id '${id}' no sigue el patron sNN-mNN (ej. s03-m06).\n`);
  process.exit(1);
}

const archivo = `src/content/${id}.ts`;
if (existsSync(archivo)) {
  console.error(`\nYa existe ${archivo}.\n`);
  process.exit(1);
}

const variable = id.replace(/[^a-zA-Z0-9]/g, "");
const indice = "src/content/index.ts";
const idx = readFileSync(indice, "utf8");
const importes = [...idx.matchAll(/^import \{ (\w+) \} from "\.\/(.+)";$/gm)];
const ultima = importes.at(-1);

/** El prerrequisito es el id de la mision anterior, no el nombre de su archivo. */
function idDeArchivo(nombre: string): string | null {
  const ruta = `src/content/${nombre}.ts`;
  if (!existsSync(ruta)) return null;
  return readFileSync(ruta, "utf8").match(/^\s*id:\s*"([^"]+)"/m)?.[1] ?? null;
}

const previa = ultima ? idDeArchivo(ultima[2]) : null;

// Con saltos reales: JSON.stringify produce los escapes del literal TS.
const plantillaPy = `resultado = 0

# tu codigo aqui
`;
const solucionPy = `resultado = 0
`;

const codigo = `import type { Mision } from "../types/mission";

export const ${variable}: Mision = {
  id: ${JSON.stringify(id)},
  sector: ${Number(m[1])},
  titulo: ${JSON.stringify(titulo)},
  concepto: ["TODO"],
  requiere: [${previa ? JSON.stringify(previa) : ""}],
  minutos: 10,
  xp: 100,
  enunciado: "TODO: que tiene que conseguir el jugador y donde deja el resultado.",
  plantilla: ${JSON.stringify(plantillaPy)},
  // El validador ejecuta esta solucion contra las pruebas de abajo.
  solucion: ${JSON.stringify(solucionPy)},
  salida: "resultado",
  pruebas: [
    { entrada: { TODO: 0 }, salida: 0, oculta: false },
    { entrada: { TODO: 1 }, salida: 1, oculta: false },
    { entrada: { TODO: 2 }, salida: 2, oculta: true },
  ],
  restricciones: {
    exigeNodo: [],
    prohibeNodo: [],
    presupuestoOps: 40,
  },
  pistas: [
    "TODO: una pregunta que oriente sin resolver.",
    "TODO: el paso que falta, en palabras.",
    "TODO: el codigo del paso que falta.",
  ],
  // Mensajes para los errores que de verdad comete la gente. Escribelos
  // mirando los intentos fallidos reales, no imaginandolos.
  fallosPrevistos: [],
};
`;

writeFileSync(archivo, codigo);

if (ultima) {
  const linea = `import { ${ultima[1]} } from "./${ultima[2]}";`;
  const nuevo = idx
    .replace(linea, `${linea}\nimport { ${variable} } from "./${id}";`)
    .replace(/(const crudas = \[)([^\]]*)\]/, (_, a, b) => `${a}${b.trimEnd()}, ${variable}]`);
  writeFileSync(indice, nuevo);
}

console.log(`
Creada ${archivo}${ultima ? " y registrada en el indice" : ""}.

Siguiente:
  1. Rellena los TODO (enunciado, pruebas, solucion, pistas).
  2. npm run validar   -- no pasara hasta que la mision sea coherente.
  3. npm run dev       -- para jugarla.
`);
