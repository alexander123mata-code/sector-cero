import type { MisionCodigo } from "../types/mission";

type Props = {
  mision: MisionCodigo;
  pistasUsadas: number;
};

const caja: React.CSSProperties = {
  border: "1px solid var(--line)",
  background: "var(--panel)",
  padding: "10px 12px",
};

export function Briefing({ mision, pistasUsadas }: Props) {
  const visibles = mision.pruebas.filter((p) => !p.oculta);
  const ocultas = mision.pruebas.length - visibles.length;

  return (
    <aside
      style={{
        width: 372, flexShrink: 0, borderRight: "2px solid var(--line)",
        background: "#0e101a", padding: 22, display: "flex",
        flexDirection: "column", gap: 20, overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <span className="etiqueta">BRIEFING</span>
        <h1 style={{ margin: 0, fontFamily: "var(--px)", fontSize: 13, fontWeight: 400, color: "#fff", lineHeight: 1.65 }}>
          {mision.titulo}
        </h1>
      </div>

      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65 }}>{mision.enunciado}</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {mision.concepto.map((c) => (
          <span key={c} className="mono" style={{ ...caja, fontSize: 11.5, color: "#9ba3be", padding: "4px 8px" }}>
            {c}
          </span>
        ))}
      </div>

      {mision.ejemplo && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="etiqueta" style={{ color: "var(--fosforo)" }}>ASI SE ESCRIBE</span>
          <div
            style={{
              border: "2px solid var(--fosforo-borde)",
              borderLeft: "5px solid var(--fosforo)",
              background: "var(--fosforo-fondo)",
              padding: "14px 15px",
              display: "flex",
              flexDirection: "column",
              gap: 11,
            }}
          >
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-alto)" }}>
              {mision.ejemplo.situacion}
            </p>
            <pre
              className="mono"
              style={{
                margin: 0, background: "#08090f", border: "1px solid var(--line)",
                padding: "12px 13px", fontSize: 12, lineHeight: "21px",
                color: "var(--ink)", overflowX: "auto",
              }}
            >
              {mision.ejemplo.codigo}
            </pre>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--ink)" }}>
              {mision.ejemplo.comentario}
            </p>
          </div>
        </div>
      )}

      <div style={{ height: 2, background: "var(--line-soft)" }} />

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span className="etiqueta">PRUEBAS VISIBLES</span>
        {visibles.map((p, i) => (
          <div key={i} className="mono" style={{ ...caja, fontSize: 12.5, display: "flex", gap: 12 }}>
            <span style={{ flexGrow: 1, overflowX: "auto" }}>
              {Object.values(p.entrada).map((v) => JSON.stringify(v)).join(", ")}
            </span>
            <span style={{ color: "var(--tenue)" }}>→</span>
            <span style={{ color: "var(--fosforo)" }}>{JSON.stringify(p.salida)}</span>
          </div>
        ))}
        {ocultas > 0 && (
          <div className="mono" style={{ ...caja, fontSize: 12.5, color: "var(--tenue)", borderStyle: "dashed", background: "#0c0e16" }}>
            {ocultas} prueba{ocultas > 1 ? "s" : ""} oculta{ocultas > 1 ? "s" : ""} · tras las visibles
          </div>
        )}
      </div>

      {pistasUsadas > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="etiqueta" style={{ color: "var(--ambar)" }}>PISTAS</span>
          {mision.pistas.slice(0, pistasUsadas).map((p, i) => (
            <div key={i} style={{ border: "1px solid var(--ambar-borde)", background: "var(--ambar-fondo)", padding: "11px 13px" }}>
              <pre className="mono" style={{ margin: 0, fontSize: 12.5, color: "var(--ink)", whiteSpace: "pre-wrap", lineHeight: 1.55 }}>
                {p}
              </pre>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "auto", borderTop: "2px solid var(--line-soft)", paddingTop: 14 }}>
        <span className="mono" style={{ fontSize: 11.5, color: "var(--dim)" }}>
          {mision.minutos} min estimados · {mision.xp} XP
        </span>
      </div>
    </aside>
  );
}
