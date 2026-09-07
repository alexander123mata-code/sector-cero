import { useEffect, useRef } from "react";
import type { Mision } from "../types/mission";
import { misiones } from "../content";
import { usarProgreso, xpTotal, estrellasTotales, desbloqueada } from "../store/progress";
import { Estrellas } from "./Estrellas";
import { descargar } from "../telemetria/registro";

/** Corta la lista en tramos por sector, en el orden en que se juegan. */
function porSectores(lista: Mision[]) {
  const tramos: { sector: number; misiones: { m: Mision; numero: number }[] }[] = [];
  lista.forEach((m, i) => {
    const ultimo = tramos.at(-1);
    const entrada = { m, numero: i + 1 };
    if (ultimo && ultimo.sector === m.sector) ultimo.misiones.push(entrada);
    else tramos.push({ sector: m.sector, misiones: [entrada] });
  });
  return tramos;
}

export function Cabecera({ mision }: { mision: Mision }) {
  const porMision = usarProgreso((s) => s.porMision);
  const irA = usarProgreso((s) => s.irA);
  const activo = useRef<HTMLButtonElement>(null);

  // Con muchas misiones la activa puede quedar fuera de vista al cargar.
  useEffect(() => {
    activo.current?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [mision.id]);

  return (
    <header
      style={{
        height: 56, flexShrink: 0, borderBottom: "2px solid var(--line)",
        background: "var(--panel)", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 20px", gap: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 0, flexGrow: 1 }}>
        <span style={{ fontFamily: "var(--px)", fontSize: 14, color: "#fff", flexShrink: 0 }}>
          SECTOR<span style={{ color: "var(--marquee)" }}>·</span>CERO
        </span>
        <span style={{ width: 2, height: 20, background: "var(--line)", flexShrink: 0 }} />

        <nav
          className="tira"
          style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", minWidth: 0 }}
          aria-label="Misiones"
        >
          {porSectores(misiones).map((tramo, t) => (
            <div key={tramo.sector} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {t > 0 && <span style={{ width: 2, height: 18, background: "var(--line)" }} />}
              <span
                className="mono"
                style={{ fontSize: 10, color: "var(--dim)", letterSpacing: "0.06em", flexShrink: 0 }}
              >
                S{String(tramo.sector).padStart(2, "0")}
              </span>
              {tramo.misiones.map(({ m, numero }) => {
                const e = porMision[m.id];
                const abierta = desbloqueada(m.id, porMision);
                const activa = m.id === mision.id;
                return (
                  <button
                    key={m.id}
                    ref={activa ? activo : undefined}
                    onClick={() => irA(m.id)}
                    disabled={!abierta}
                    title={abierta ? m.titulo : "Todavia bloqueada"}
                    aria-current={activa ? "page" : undefined}
                    style={{
                      minHeight: 34, padding: "0 11px", gap: 7, fontSize: 10, flexShrink: 0,
                      borderColor: activa ? "var(--marquee)" : "var(--line)",
                      background: activa ? "var(--marquee-fondo)" : "var(--panel-2)",
                      color: activa ? "var(--marquee)" : "var(--ink)",
                      boxShadow: "none",
                    }}
                  >
                    {String(numero).padStart(2, "0")}
                    {e?.superada && <Estrellas cuantas={e.estrellas} tam={9} />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
        <span className="mono" style={{ fontSize: 12, color: "var(--ambar)", whiteSpace: "nowrap" }}>
          {xpTotal(porMision)} XP
        </span>
        <span className="mono" style={{ fontSize: 12, color: "var(--dim)", whiteSpace: "nowrap" }}>
          {estrellasTotales(porMision)} / {misiones.length * 3}
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
