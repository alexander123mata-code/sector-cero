import type { Mision } from "../types/mission";
import { misiones } from "../content";
import { usarProgreso, xpTotal, estrellasTotales, desbloqueada } from "../store/progress";
import { Estrellas } from "./Estrellas";
import { descargar } from "../telemetria/registro";

export function Cabecera({ mision }: { mision: Mision }) {
  const porMision = usarProgreso((s) => s.porMision);
  const irA = usarProgreso((s) => s.irA);

  return (
    <header
      style={{
        height: 56, flexShrink: 0, borderBottom: "2px solid var(--line)",
        background: "var(--panel)", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 20px", gap: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0 }}>
        <span style={{ fontFamily: "var(--px)", fontSize: 14, color: "#fff" }}>
          SECTOR<span style={{ color: "var(--marquee)" }}>·</span>CERO
        </span>
        <span style={{ width: 2, height: 20, background: "var(--line)" }} />
        <nav style={{ display: "flex", gap: 6 }} aria-label="Misiones del sector 03">
          {misiones.map((m, i) => {
            const e = porMision[m.id];
            const abierta = desbloqueada(m.id, porMision);
            const activa = m.id === mision.id;
            return (
              <button
                key={m.id}
                onClick={() => irA(m.id)}
                disabled={!abierta}
                title={abierta ? m.titulo : `Requiere superar la mision ${i}`}
                aria-current={activa ? "page" : undefined}
                style={{
                  minHeight: 34, padding: "0 11px", gap: 7, fontSize: 10,
                  borderColor: activa ? "var(--marquee)" : "var(--line)",
                  background: activa ? "var(--marquee-fondo)" : "var(--panel-2)",
                  color: activa ? "var(--marquee)" : "var(--ink)",
                  boxShadow: "none",
                }}
              >
                {String(i + 1).padStart(2, "0")}
                {e.superada && <Estrellas cuantas={e.estrellas} tam={9} />}
              </button>
            );
          })}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--ambar)" }}>
          {xpTotal(porMision)} XP
        </span>
        <span className="mono" style={{ fontSize: 12, color: "var(--dim)" }}>
          {estrellasTotales(porMision)} / {misiones.length * 3} estrellas
        </span>
        <button
          onClick={descargar}
          title="Descarga tus intentos como archivo. Se guardan solo en este navegador y no se envian a ninguna parte; sirven para saber que misiones estan mal escritas."
          style={{
            minHeight: 30, padding: "0 11px", fontSize: 9, gap: 7,
            borderColor: "var(--line)", background: "var(--panel-2)", color: "var(--dim)",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4v11" /><path d="M7 11l5 5 5-5" /><path d="M4 20h16" />
          </svg>
          REGISTRO
        </button>
      </div>
    </header>
  );
}
