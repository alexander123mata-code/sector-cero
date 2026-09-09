import { existsSync, readFileSync, writeFileSync } from "node:fs";

/**
 * Andamiaje de una mision nueva: crea el archivo y lo registra en el indice.
 *
 * Deja huecos marcados con TODO, pero el archivo que genera SIEMPRE cumple el
 * esquema. Es la diferencia entre que `npm run validar` te diga que falta y
 * que el juego entero no arranque: el indice valida al importar, asi que una
 * mision que ni siquiera parsea tumba tambien `npm run dev`.
 *
 * Lo que falta se detecta con las reglas del validador, no con un volcado de
 * Zod: una solucion que no resuelve, un 'porque' vacio, una comprobacion que
 * el CLI no conoce.
 *
 *   npm run mision:nueva -- s03-m06 "Contar hacia atras"
 *   npm run mision:nueva -- s01-m07 "Trazar a mano" --logica
 *   npm run mision:nueva -- s00-m07 "Instalar algo" --entorno
 */
const args = process.argv.slice(2);
const tipo = args.includes("--logica")
  ? "logica"
  : args.includes("--entorno")
    ? "entorno"
    : "codigo";
const [id, ...resto] = args.filter((a) => !a.startsWith("--"));
const titulo = resto.join(" ");

if (!id || !titulo) {
  console.error('\nUso: npm run mision:nueva -- <id> "<titulo>" [--logica|--entorno]\n');
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
const j = JSON.stringify;

// Con saltos reales: JSON.stringify produce los escapes del literal TS.
const plantillaPy = `resultado = 0

# tu codigo aqui
`;
const solucionPy = `resultado = 0
`;

/** Comun a los tres tipos. */
const cabecera = `  tipo: ${j(tipo)},
  id: ${j(id)},
  sector: ${Number(m[1])},
  titulo: ${j(titulo)},
  concepto: ["TODO"],
  requiere: [${previa ? j(previa) : ""}],
  minutos: 10,
  xp: 100,
  enunciado: "TODO: que tiene que conseguir el jugador y donde deja el resultado.",`;

const ejemplo = `  // Obligatorio cuando la mision estrena un concepto: es la primera vez que
  // alguien ve como se hace. Se cuenta por tipo de mision, asi que una de
  // codigo lo necesita aunque una de logica ya usara ese mismo concepto.
  ejemplo: {
    situacion: "TODO: un problema parecido, no este.",
    codigo: "TODO",
    comentario: "TODO: que hace cada pieza del ejemplo.",
  },`;

const repaso = `  // Se muestra solo al superar. Es lo que queda cuando se apaga la pantalla.
  repaso: {
    resumen: "TODO: que acaba de construir el jugador, en una frase.",
    piezas: [{ parte: "TODO", hace: "TODO: que hace esta pieza." }],
  },`;

const cuerpos: Record<string, string> = {
  codigo: `  plantilla: ${j(plantillaPy)},
  // El validador ejecuta esta solucion contra las pruebas de abajo. Tal cual
  // esta no las pasa, y por eso la mision se rechaza hasta que la escribas.
  solucion: ${j(solucionPy)},
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
${repaso}
  // Mensajes para los errores que de verdad comete la gente. Escribelos
  // mirando los intentos fallidos reales, no imaginandolos: 'npm run informe'
  // dice cuales se repiten y todavia no tienen mensaje.
  fallosPrevistos: [],`,

  logica: `  // Los 'porque' vacios hacen que el validador rechace la mision: son lo que
  // el jugador se lleva, acierte o falle, asi que no son opcionales.
  ejercicios: [
    {
      forma: "eleccion",
      pregunta: "TODO",
      opciones: ["TODO: la correcta", "TODO: un error que la gente comete"],
      correcta: 0,
      porque: "",
    },
    {
      forma: "orden",
      pregunta: "TODO",
      // En el orden CORRECTO: la pantalla las baraja sola.
      piezas: ["TODO: primero", "TODO: despues"],
      porque: "",
    },
    {
      forma: "tabla",
      pregunta: "TODO",
      columnas: ["TODO dato", "TODO pregunta"],
      opciones: ["verdadero", "falso"],
      // Si todas las filas se contestan igual, pulsar siempre lo mismo aprueba
      // la tabla entera. El validador lo rechaza.
      filas: [
        { celdas: ["TODO"], respuesta: "verdadero" },
        { celdas: ["TODO"], respuesta: "falso" },
      ],
      porque: "",
    },
  ],
${repaso}`,

  entorno: `  // Claves que tiene que traer la ficha de 'sector verify'. El validador
  // rechaza las que el CLI no comprueba: mira cli/src/sector_cero/.
  exige: ["TODO"],
  pasos: [
    { texto: "TODO: que hace el jugador en su maquina.", orden: "TODO" },
    { texto: "Vuelve a ejecutar el comprobador.", orden: "sector verify" },
  ],`,
};

const pistas = `  pistas: [
    "TODO: una pregunta que oriente sin resolver.",
    "TODO: el paso que falta, en palabras.",
    "TODO: la respuesta, para quien ya se atasco de verdad.",
  ],`;

const codigo = `import type { Mision } from "../types/mission";

export const ${variable}: Mision = {
${cabecera}
${tipo === "entorno" ? "" : `${ejemplo}\n`}${cuerpos[tipo]}
${pistas}
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
Creada ${archivo} (mision de ${tipo})${ultima ? " y registrada en el indice" : ""}.

Siguiente:
  1. Rellena los TODO.
  2. npm run validar   -- no pasara hasta que la mision sea coherente.
  3. npm run dev       -- para jugarla.
`);
