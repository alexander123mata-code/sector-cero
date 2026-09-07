export type Pestana = "briefing" | "resultado";

/** Solo aparece cuando no caben los tres paneles: briefing y resultado comparten sitio. */
export function Pestanas({
  activa,
  onCambio,
  hayResultado,
}: {
  activa: Pestana;
  onCambio: (p: Pestana) => void;
  hayResultado: boolean;
}) {
  const boton = (p: Pestana, texto: string, marca: boolean) => (
    <button
      onClick={() => onCambio(p)}
      aria-current={activa === p ? "true" : undefined}
      style={{
        flexGrow: 1, minHeight: 38, padding: "0 12px", fontSize: 10, gap: 7,
        borderColor: activa === p ? "var(--marquee)" : "var(--line)",
        background: activa === p ? "var(--marquee-fondo)" : "var(--panel-2)",
        color: activa === p ? "var(--marquee)" : "var(--dim)",
        boxShadow: "none",
      }}
    >
      {texto}
      {marca && <span style={{ width: 6, height: 6, background: "var(--fosforo)" }} />}
    </button>
  );

  return (
    <div style={{ display: "flex", gap: 6, padding: 10, borderBottom: "2px solid var(--line)", background: "var(--panel)" }}>
      {boton("briefing", "BRIEFING", false)}
      {boton("resultado", "RESULTADO", hayResultado && activa !== "resultado")}
    </div>
  );
}
