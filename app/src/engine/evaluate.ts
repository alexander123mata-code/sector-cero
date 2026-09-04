import type {
  Evaluacion, MisionCodigo, Nivel, ResultadoPrueba,
} from "../types/mission";
import type { SalidaCaso } from "./pyRunner.worker";

/** Compara por JSON: cubre enteros y listas, que es todo lo que produce el Sector 03. */
function coincide(valorJson: string | undefined, esperado: unknown): boolean {
  if (valorJson === undefined) return false;
  try {
    return JSON.stringify(JSON.parse(valorJson)) === JSON.stringify(esperado);
  } catch {
    return false;
  }
}

function leerValor(c: SalidaCaso): unknown {
  if (c.valor_json === undefined) return undefined;
  try {
    return JSON.parse(c.valor_json);
  } catch {
    return undefined;
  }
}

/** El primer fallo previsto que encaja gana: el orden del autor es la prioridad. */
function mensajeDe(mision: MisionCodigo, fallo: ResultadoPrueba | undefined): string | null {
  if (!fallo) return null;
  for (const f of mision.fallosPrevistos) {
    const c = f.cuando;
    if (c.tipo === "timeout" && fallo.timeout) return f.dice;
    if (c.tipo === "error" && fallo.error?.includes(c.contiene)) return f.dice;
    if (
      c.tipo === "salida" &&
      !fallo.timeout &&
      !fallo.error &&
      JSON.stringify(fallo.obtenido) === JSON.stringify(c.valor)
    ) {
      return f.dice;
    }
  }
  return null;
}

/**
 * Las variables de entrada ya existen cuando el codigo del jugador arranca.
 * Si las declara, su valor pisa el de la prueba y fallan todas a la vez, sin
 * ninguna pista de por que. Un jugador real escribio `objetivo = 15` creyendo
 * que tenia que crearla.
 */
function pisaLaEntrada(mision: MisionCodigo, asignados: string[]): string[] {
  const entradas = new Set(mision.pruebas.flatMap((p) => Object.keys(p.entrada)));
  if (mision.sensor) entradas.add(mision.sensor.nombre);
  return asignados.filter((a) => entradas.has(a));
}

export function evaluar(
  mision: MisionCodigo,
  nodos: string[],
  asignados: string[],
  casos: SalidaCaso[],
): Evaluacion {
  const set = new Set(nodos);

  const pruebas: ResultadoPrueba[] = mision.pruebas.map((p, i) => {
    const c = casos[i];
    const obtenido = leerValor(c);
    return {
      indice: i,
      oculta: p.oculta,
      entrada: p.entrada,
      paso: c.ok && coincide(c.valor_json, p.salida),
      esperado: p.salida,
      obtenido,
      traza: (c.traza ?? []).join(" "),
      error: c.error,
      timeout: c.timeout,
    };
  });

  const n1 = pruebas.every((p) => p.paso);

  const faltan = mision.restricciones.exigeNodo.filter((n) => !set.has(n));
  const sobran = mision.restricciones.prohibeNodo.filter((n) => set.has(n));
  const n2 = n1 && faltan.length === 0 && sobran.length === 0;

  const ops = casos.reduce((mx, c) => Math.max(mx, c.ops ?? 0), 0);
  const n3 = n2 && ops <= mision.restricciones.presupuestoOps;

  const detalle2 = !n1
    ? "se comprueba al pasar las pruebas"
    : faltan.length
      ? `falta usar: ${faltan.join(", ")}`
      : sobran.length
        ? `no puedes usar: ${sobran.join(", ")}`
        : "cumple todas las restricciones";

  const niveles: [Nivel, Nivel, Nivel] = [
    {
      numero: 1,
      nombre: "Correctitud",
      conseguido: n1,
      detalle: `${pruebas.filter((p) => p.paso).length} de ${pruebas.length} pruebas`,
    },
    { numero: 2, nombre: "Restricciones", conseguido: n2, detalle: detalle2 },
    {
      numero: 3,
      nombre: "Oficio",
      conseguido: n3,
      detalle: `${ops} ops · presupuesto ${mision.restricciones.presupuestoOps}`,
    },
  ];

  const estrellas = ((n1 ? 1 : 0) + (n2 ? 1 : 0) + (n3 ? 1 : 0)) as 0 | 1 | 2 | 3;
  const primerFallo = pruebas.find((p) => !p.paso);

  // Pisar la entrada explica cualquier otro sintoma, asi que va antes que los
  // fallos previstos: sin esto el jugador persigue el error equivocado.
  const pisadas = pisaLaEntrada(mision, asignados);
  const mensaje =
    !n1 && pisadas.length
      ? `${pisadas.map((v) => `\`${v}\``).join(" y ")} ${pisadas.length > 1 ? "ya existen" : "ya existe"} cuando tu codigo empieza: ${pisadas.length > 1 ? "los pone" : "lo pone"} cada prueba con su propio valor. Al ${pisadas.length > 1 ? "declararlos" : "declararlo"} tu, tu valor pisa el de la prueba y fallan todas. Borra esa linea y usa ${pisadas.length > 1 ? "esas variables" : "esa variable"} tal cual.`
      : mensajeDe(mision, primerFallo);

  return {
    pruebas,
    niveles,
    estrellas,
    ops,
    mensaje,
    superada: n1,
  };
}
