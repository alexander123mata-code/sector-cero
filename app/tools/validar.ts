import { loadPyodide } from "pyodide";
import { ARNES_PY } from "../src/engine/harness";
import { esCodigo, type Mision } from "../src/types/mission";
import { comprobarEstatico, type Hallazgo } from "./reglas";

const j = (v: unknown) => JSON.stringify(v);

type SalidaCaso = {
  ok: boolean; timeout: boolean; ops: number;
  valor_json?: string; error: string | null;
};

/**
 * Ejecuta la solucion de referencia de cada mision contra sus propias pruebas.
 * Es lo que distingue este validador de un simple chequeo de esquema: prueba
 * que la mision es resoluble tal y como esta escrita.
 */
async function comprobarEjecutando(misiones: Mision[]): Promise<Hallazgo[]> {
  const h: Hallazgo[] = [];
  const error = (m: string, regla: string, texto: string) =>
    h.push({ mision: m, nivel: "error", regla, texto });
  const aviso = (m: string, regla: string, texto: string) =>
    h.push({ mision: m, nivel: "aviso", regla, texto });

  const py = await loadPyodide();
  py.runPython(ARNES_PY);
  const scNodos = py.globals.get("sc_nodos") as (c: string) => string;
  const scCorrer = py.globals.get("sc_correr") as (
    c: string, e: string, s: string, sen: string | null,
  ) => string;

  for (const m of misiones) {
    if (!esCodigo(m)) continue;
    const analisis = JSON.parse(scNodos(m.solucion)) as
      | { ok: true; nodos: string[] }
      | { ok: false; error: string };

    if (!analisis.ok) {
      error(m.id, "solucion-no-compila", analisis.error);
      continue;
    }

    const set = new Set(analisis.nodos);
    for (const n of m.restricciones.exigeNodo) {
      if (!set.has(n)) {
        error(m.id, "solucion-incumple-restricciones", `la solucion no usa '${n}', que la mision exige`);
      }
    }
    for (const n of m.restricciones.prohibeNodo) {
      if (set.has(n)) {
        error(m.id, "solucion-incumple-restricciones", `la solucion usa '${n}', que la mision prohibe`);
      }
    }

    const sensor = m.sensor ? j(m.sensor) : null;
    let opsMax = 0;

    for (const [i, p] of m.pruebas.entries()) {
      const r = JSON.parse(scCorrer(m.solucion, j(p.entrada), m.salida, sensor)) as SalidaCaso;
      const etiqueta = `prueba ${i + 1}${p.oculta ? " (oculta)" : ""}`;

      if (!r.ok) {
        error(m.id, "solucion-no-pasa", `${etiqueta}: ${r.error ?? "fallo sin mensaje"}`);
        continue;
      }
      opsMax = Math.max(opsMax, r.ops);

      const obtenido = JSON.parse(r.valor_json!);
      if (j(obtenido) !== j(p.salida)) {
        error(
          m.id, "solucion-no-pasa",
          `${etiqueta}: la mision espera ${j(p.salida)} pero la solucion devuelve ${j(obtenido)}`,
        );
      }

      for (const f of m.fallosPrevistos) {
        if (f.cuando.tipo === "salida" && j(f.cuando.valor) === j(obtenido)) {
          error(
            m.id, "fallo-previsto-choca",
            `${etiqueta}: el fallo previsto para ${j(obtenido)} se disparia con la solucion correcta`,
          );
        }
      }
    }

    const presupuesto = m.restricciones.presupuestoOps;
    if (opsMax > presupuesto) {
      error(
        m.id, "presupuesto-imposible",
        `la solucion de referencia gasta ${opsMax} ops y el presupuesto es ${presupuesto}: nadie puede sacar la tercera estrella`,
      );
    } else if (opsMax > 0 && presupuesto > opsMax * 3) {
      aviso(
        m.id, "presupuesto-flojo",
        `la solucion gasta ${opsMax} ops sobre un presupuesto de ${presupuesto}: el Nivel 3 no distingue casi nada`,
      );
    }
  }

  return h;
}

async function principal() {
  let misiones: Mision[];
  try {
    ({ misiones } = await import("../src/content"));
  } catch (e) {
    console.error(`\nEl contenido no cumple el esquema:\n${e instanceof Error ? e.message : e}\n`);
    process.exit(1);
  }

  const hallazgos = [
    ...comprobarEstatico(misiones),
    ...(await comprobarEjecutando(misiones)),
  ];

  informar(misiones, hallazgos);
  process.exit(hallazgos.some((x) => x.nivel === "error") ? 1 : 0);
}

function informar(misiones: Mision[], hallazgos: Hallazgo[]) {
  const errores = hallazgos.filter((h) => h.nivel === "error");
  const avisos = hallazgos.filter((h) => h.nivel === "aviso");

  console.log(`\nValidando ${misiones.length} misiones\n`);
  for (const m of misiones) {
    const mios = hallazgos.filter((h) => h.mision === m.id);
    const marca = mios.some((x) => x.nivel === "error") ? "FALLA" : mios.length ? "aviso" : "  ok ";
    console.log(`  ${marca}  ${m.id}`);
    for (const x of mios) console.log(`         ${x.nivel === "error" ? "!" : "-"} [${x.regla}] ${x.texto}`);
  }
  console.log(
    `\n${errores.length} error(es), ${avisos.length} aviso(s)\n` +
      (errores.length ? "El contenido no puede publicarse.\n" : "Contenido valido.\n"),
  );
}

principal();
