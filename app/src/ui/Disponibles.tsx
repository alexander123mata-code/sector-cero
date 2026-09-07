import type { MisionCodigo } from "../types/mission";

/**
 * Que variables existen ya es el dato que mas falta hace para escribir la
 * primera linea, y estaba al final del panel de la izquierda, lo mas lejos
 * posible del editor. Aqui va justo encima de donde se escribe.
 */
function tipoDe(v: unknown): string {
  if (typeof v === "string") return "texto";
  if (typeof v === "boolean") return "si/no";
  if (Array.isArray(v)) return v.every(Array.isArray) ? "lista de listas" : "lista";
  if (typeof v === "number") return Number.isInteger(v) ? "numero" : "numero con decimales";
  return "dato";
}

const ficha: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 7,
  border: "1px solid var(--line)",
  background: "#0e101a",
  padding: "4px 9px",
};

export function Disponibles({ mision }: { mision: MisionCodigo }) {
  const primera = mision.pruebas[0]?.entrada ?? {};
  const entradas = Object.entries(primera).map(([nombre, valor]) => ({
    nombre,
    tipo: tipoDe(valor),
  }));

  return (
    <div
      style={{
        flexShrink: 0,
        borderBottom: "2px solid var(--line)",
        background: "var(--panel)",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <span className="etiqueta" style={{ color: "var(--fosforo)", flexShrink: 0 }}>
        YA TIENES
      </span>

      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", flexGrow: 1 }}>
        {entradas.map((e) => (
          <span key={e.nombre} style={ficha}>
            <span className="mono" style={{ fontSize: 12.5, color: "var(--ink-alto)" }}>
              {e.nombre}
            </span>
            <span className="mono" style={{ fontSize: 11, color: "var(--dim)" }}>
              {e.tipo}
            </span>
          </span>
        ))}
        {mision.sensor && (
          <span style={ficha}>
            <span className="mono" style={{ fontSize: 12.5, color: "var(--ink-alto)" }}>
              {mision.sensor.nombre}()
            </span>
            <span className="mono" style={{ fontSize: 11, color: "var(--dim)" }}>
              funcion
            </span>
          </span>
        )}
      </div>

      <span
        className="mono"
        style={{ fontSize: 11.5, color: "var(--dim)", flexShrink: 0, whiteSpace: "nowrap" }}
      >
        deja el resultado en{" "}
        <span style={{ color: "var(--ambar)" }}>{mision.salida}</span>
      </span>
    </div>
  );
}
