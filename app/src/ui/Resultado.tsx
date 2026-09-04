import type { Evaluacion, MisionCodigo } from "../types/mission";
import { Estrellas } from "./Estrellas";

type Props = { mision: MisionCodigo; ev: Evaluacion | null; estado: string };

const panel: React.CSSProperties = {
  border: "2px solid var(--line)",
  background: "var(--panel)",
  padding: "13px 15px",
};

export function Resultado({ mision, ev, estado }: Props) {
  return (
    <section
      style={{
        width: 380, flexShrink: 0, borderLeft: "2px solid var(--line)",
        background: "#0e101a", padding: 22, display: "flex",
        flexDirection: "column", gap: 18, overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="etiqueta">CONSOLA</span>
        <pre
          className="mono"
          style={{
            ...panel, background: "#08090f", margin: 0, fontSize: 12,
            lineHeight: "21px", whiteSpace: "pre-wrap", minHeight: 84,
            color: ev ? "var(--ink)" : "var(--tenue)",
          }}
        >
          {estado}
        </pre>
      </div>

      {ev && (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="etiqueta">EVALUACION</span>
              <Estrellas cuantas={ev.estrellas} tam={16} />
            </div>
            {ev.niveles.map((n) => (
              <div
                key={n.numero}
                style={{
                  ...panel, borderWidth: 1, display: "flex", gap: 10, alignItems: "center",
                  borderColor: n.conseguido ? "var(--fosforo-borde)" : "var(--line)",
                  background: n.conseguido ? "var(--fosforo-fondo)" : "var(--panel)",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 11, color: n.conseguido ? "var(--fosforo)" : "var(--dim)", width: 54, flexShrink: 0 }}
                >
                  NIVEL {n.numero}
                </span>
                <div style={{ flexGrow: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--ink-alto)" }}>{n.nombre}</div>
                  <div className="mono" style={{ fontSize: 11.5, color: "var(--dim)" }}>{n.detalle}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="etiqueta">PRUEBAS</span>
            {ev.pruebas.map((p) => (
              <div
                key={p.indice}
                className="mono"
                style={{
                  ...panel, borderWidth: 1, fontSize: 11.5, display: "flex", gap: 10,
                  borderColor: p.paso ? "var(--fosforo-borde)" : "var(--marquee-borde)",
                  background: p.paso ? "var(--fosforo-fondo)" : "var(--marquee-fondo)",
                }}
              >
                <span style={{ color: p.paso ? "var(--fosforo)" : "var(--marquee)" }}>
                  {p.paso ? "OK" : "NO"}
                </span>
                <span style={{ flexGrow: 1, color: "var(--ink)" }}>
                  {p.oculta ? "oculta" : `prueba ${p.indice + 1}`}
                  {p.error
                    ? ` · ${p.error}`
                    : ` · esperaba ${JSON.stringify(p.esperado)} · obtuvo ${JSON.stringify(p.obtenido)}`}
                </span>
              </div>
            ))}
          </div>

          {ev.mensaje && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span className="etiqueta" style={{ color: "var(--marquee)" }}>EL EVALUADOR DICE</span>
              <div
                style={{
                  border: "2px solid var(--marquee-borde)",
                  borderLeft: "5px solid var(--marquee)",
                  background: "var(--marquee-fondo)", padding: "15px 16px",
                }}
              >
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--ink-alto)" }}>
                  {ev.mensaje}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ marginTop: "auto", borderTop: "2px solid var(--line-soft)", paddingTop: 14 }}>
        <span className="mono" style={{ fontSize: 11.5, color: "var(--dim)" }}>
          presupuesto {mision.restricciones.presupuestoOps} ops
        </span>
      </div>
    </section>
  );
}
