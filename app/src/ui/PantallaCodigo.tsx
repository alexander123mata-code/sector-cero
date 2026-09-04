import { useCallback, useEffect, useRef, useState } from "react";
import type { Evaluacion, MisionCodigo } from "../types/mission";
import { CANCELADO, type Runner } from "../engine/runner";
import { evaluar } from "../engine/evaluate";
import { usarProgreso } from "../store/progress";
import { registrar } from "../telemetria/registro";
import { Briefing } from "./Briefing";
import { Resultado } from "./Resultado";
import { Editor, type EditorHandle } from "./Editor";

const LISTO = "Interprete listo. Escribe tu solucion y pulsa ENVIAR.";

/** Lo ejecutado pertenece a una mision concreta; al cambiar de mision se descarta. */
type Sesion = { id: string; estado: string; ev: Evaluacion | null };

type Props = { mision: MisionCodigo; runner: Runner; listo: boolean; arranque: string };

export function PantallaCodigo({ mision, runner, listo, arranque }: Props) {
  const editor = useRef<EditorHandle>(null);
  const [corriendo, setCorriendo] = useState(false);
  const [sesion, setSesion] = useState<Sesion | null>(null);

  useEffect(() => {
    registrar({ tipo: "abre", mision: mision.id, t: Date.now() });
  }, [mision.id]);

  const est = usarProgreso((s) => s.porMision[mision.id]);
  const escribir = usarProgreso((s) => s.escribir);
  const pedirPista = usarProgreso((s) => s.pedirPista);
  const anotar = usarProgreso((s) => s.registrar);

  // Se deriva en el render en lugar de resetearse con un efecto.
  const vista: Sesion =
    sesion?.id === mision.id
      ? sesion
      : { id: mision.id, estado: listo ? LISTO : arranque, ev: null };

  const enviar = useCallback(async () => {
    if (corriendo) return;
    setCorriendo(true);
    setSesion({ id: mision.id, estado: "Ejecutando contra las pruebas...", ev: null });
    try {
      const { nodos, asignados, casos } = await runner.correr({
        codigo: est.codigo,
        salida: mision.salida,
        sensor: mision.sensor ? JSON.stringify(mision.sensor) : null,
        casos: mision.pruebas.map((p) => JSON.stringify(p.entrada)),
      });
      const ev = evaluar(mision, nodos, asignados, casos);
      registrar({
        tipo: "envia",
        mision: mision.id,
        t: Date.now(),
        intento: est.intentos + 1,
        codigo: est.codigo,
        superada: ev.superada,
        estrellas: ev.estrellas,
        ops: ev.ops,
        nodos,
        fallos: ev.pruebas
          .filter((p) => !p.paso)
          .map((p) => ({
            prueba: p.indice,
            oculta: p.oculta,
            esperado: p.esperado,
            obtenido: p.obtenido,
            error: p.error,
            timeout: p.timeout,
          })),
      });
      anotar(mision.id, ev.estrellas, ev.superada);
      const impreso = casos.map((c) => c.impreso ?? "").join("").trim();
      setSesion({
        id: mision.id,
        ev,
        estado:
          (ev.superada ? `Superada con ${ev.estrellas} de 3 estrellas.` : "Aun no.") +
          (impreso ? `\n\n${impreso}` : ""),
      });
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      if (m === CANCELADO) return;
      setSesion({
        id: mision.id,
        ev: null,
        estado:
          m === "TIMEOUT"
            ? "El interprete dejo de responder. Se reinicio: vuelve a enviar."
            : `Fallo la ejecucion: ${m}`,
      });
    } finally {
      setCorriendo(false);
    }
  }, [corriendo, est.codigo, est.intentos, mision, anotar, runner]);

  const reponer = useCallback(() => {
    registrar({ tipo: "repone", mision: mision.id, t: Date.now(), intento: est.intentos });
    editor.current?.reponer(mision.plantilla);
    escribir(mision.id, mision.plantilla);
  }, [escribir, est.intentos, mision.id, mision.plantilla]);

  const quedanPistas = est.pistasUsadas < mision.pistas.length;
  const tocado = est.codigo !== mision.plantilla;

  return (
    <div style={{ flexGrow: 1, display: "flex", minHeight: 0 }}>
        <Briefing mision={mision} pistasUsadas={est.pistasUsadas} />
        <main style={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ flexGrow: 1, minHeight: 0 }}>
            <Editor ref={editor} clave={mision.id} valor={est.codigo} onCambio={(v) => escribir(mision.id, v)} />
          </div>
          <div
            style={{
              height: 76, flexShrink: 0, borderTop: "2px solid var(--line)",
              background: "var(--panel)", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "0 20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button className="principal" onClick={enviar} disabled={!listo || corriendo}>
                {corriendo ? "EJECUTANDO" : "ENVIAR"}
              </button>
              <button
                onClick={reponer}
                disabled={!tocado || corriendo}
                title="Devuelve el editor a como estaba al empezar. Si te arrepientes, Ctrl+Z lo deshace."
                style={{ minHeight: 44, padding: "0 14px", fontSize: 10, gap: 8 }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12a8 8 0 1 1 2.5 5.8" /><path d="M4 18v-5h5" />
                </svg>
                EMPEZAR DE NUEVO
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="mono" style={{ fontSize: 11.5, color: "var(--dim)" }}>
                intento {est.intentos}
              </span>
              <button
                className="aviso"
                onClick={() => {
                  registrar({ tipo: "pista", mision: mision.id, t: Date.now(), numero: est.pistasUsadas + 1 });
                  pedirPista(mision.id);
                }}
                disabled={!quedanPistas}
              >
                {quedanPistas
                  ? `PISTA ${est.pistasUsadas + 1} / ${mision.pistas.length}  −20 XP`
                  : "SIN MAS PISTAS"}
              </button>
            </div>
          </div>
        </main>
      <Resultado mision={mision} ev={vista.ev} estado={vista.estado} />
    </div>
  );
}
