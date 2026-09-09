import type { Ejercicio as Ej } from "../types/mission";
import type { Respuesta } from "../engine/logica";
import { barajarPiezas, filasFalladas } from "../engine/logica";

export type Fase = "respondiendo" | "acertado" | "fallado";

type Props = {
  ejercicio: Ej;
  semilla: string;
  valor: Respuesta;
  fase: Fase;
  onCambio: (r: Respuesta) => void;
};

const LETRAS = "ABCDEFGH";

const celda: React.CSSProperties = {
  border: "1px solid var(--line)",
  padding: "9px 11px",
  fontSize: 13.5,
  lineHeight: 1.5,
  textAlign: "left",
};

/** Colores del borde segun como quedo la respuesta. */
function marco(estado: "neutro" | "elegido" | "bien" | "mal"): React.CSSProperties {
  if (estado === "bien") {
    return { borderColor: "var(--fosforo)", background: "var(--fosforo-fondo)", color: "var(--ink-alto)" };
  }
  if (estado === "mal") {
    return { borderColor: "var(--marquee)", background: "var(--marquee-fondo)", color: "var(--ink-alto)" };
  }
  if (estado === "elegido") {
    return { borderColor: "var(--ambar)", background: "var(--ambar-fondo)", color: "var(--ink-alto)" };
  }
  return { borderColor: "var(--line)", background: "var(--panel)", color: "var(--ink)" };
}

export function Ejercicio({ ejercicio, semilla, valor, fase, onCambio }: Props) {
  const cerrado = fase !== "respondiendo";

  if (ejercicio.forma === "eleccion" && valor.forma === "eleccion") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {ejercicio.opciones.map((op, i) => {
          const estado =
            cerrado && i === ejercicio.correcta
              ? "bien"
              : cerrado && i === valor.elegida
                ? "mal"
                : i === valor.elegida
                  ? "elegido"
                  : "neutro";
          return (
            <button
              key={i}
              disabled={cerrado}
              onClick={() => onCambio({ forma: "eleccion", elegida: i })}
              style={{
                ...celda, ...marco(estado), display: "flex", gap: 12,
                alignItems: "baseline", minHeight: 44, width: "100%",
              }}
            >
              <span className="mono" style={{ fontSize: 12, color: "var(--dim)", flexShrink: 0 }}>
                {LETRAS[i]}
              </span>
              <span style={{ whiteSpace: "pre-wrap" }}>{op}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (ejercicio.forma === "orden" && valor.forma === "orden") {
    const barajadas = barajarPiezas(ejercicio.piezas, semilla);
    const sueltas = barajadas.filter(
      (p) => barajadas.filter((x) => x === p).length > valor.montado.filter((x) => x === p).length,
    );
    const quitar = (i: number) =>
      onCambio({ forma: "orden", montado: valor.montado.filter((_, k) => k !== i) });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="etiqueta">TU ORDEN · PULSA PARA QUITAR</span>
          {valor.montado.length === 0 && (
            <p style={{ margin: 0, fontSize: 13, color: "var(--tenue)", fontStyle: "italic" }}>
              Todavia no has puesto ningun paso.
            </p>
          )}
          {valor.montado.map((p, i) => {
            const estado = !cerrado ? "elegido" : p === ejercicio.piezas[i] ? "bien" : "mal";
            return (
              <button
                key={`${p}-${i}`}
                disabled={cerrado}
                onClick={() => quitar(i)}
                style={{ ...celda, ...marco(estado), display: "flex", gap: 12, minHeight: 44, width: "100%" }}
              >
                <span className="mono" style={{ fontSize: 12, color: "var(--dim)", flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ whiteSpace: "pre-wrap" }}>{p}</span>
              </button>
            );
          })}
        </div>
        {!cerrado && sueltas.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="etiqueta">PASOS SUELTOS · PULSA PARA ANADIR</span>
            {sueltas.map((p, i) => (
              <button
                key={`${p}-${i}`}
                onClick={() => onCambio({ forma: "orden", montado: [...valor.montado, p] })}
                style={{ ...celda, ...marco("neutro"), minHeight: 44, width: "100%", whiteSpace: "pre-wrap" }}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (ejercicio.forma === "tabla" && valor.forma === "tabla") {
    const malas = new Set(cerrado ? filasFalladas(ejercicio, valor) : []);
    return (
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 320 }}>
          <thead>
            <tr>
              {ejercicio.columnas.map((c) => (
                <th
                  key={c}
                  className="etiqueta"
                  style={{ ...celda, borderColor: "var(--line)", background: "#0c0e16", whiteSpace: "nowrap" }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ejercicio.filas.map((f, i) => (
              <tr key={i}>
                {f.celdas.map((c, k) => (
                  <td
                    key={k}
                    className="mono"
                    style={{ ...celda, background: malas.has(i) ? "var(--marquee-fondo)" : "var(--panel)" }}
                  >
                    {c}
                  </td>
                ))}
                <td style={{ ...celda, background: "var(--panel)" }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {ejercicio.opciones.map((op) => {
                      const elegida = valor.celdas[i] === op;
                      const estado = !cerrado
                        ? elegida
                          ? "elegido"
                          : "neutro"
                        : op === f.respuesta
                          ? "bien"
                          : elegida
                            ? "mal"
                            : "neutro";
                      return (
                        <button
                          key={op}
                          disabled={cerrado}
                          onClick={() =>
                            onCambio({
                              forma: "tabla",
                              celdas: valor.celdas.map((v, k) => (k === i ? op : v)),
                            })
                          }
                          style={{ ...marco(estado), minHeight: 36, padding: "0 12px", fontSize: 11.5 }}
                        >
                          {op}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}
