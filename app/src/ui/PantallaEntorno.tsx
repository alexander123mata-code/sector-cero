import { useCallback, useEffect, useState } from "react";
import type { MisionEntorno } from "../types/mission";
import { leerFicha, faltantes, ETIQUETAS } from "../engine/ficha";
import { usarProgreso } from "../store/progress";
import { registrar } from "../telemetria/registro";

const panel: React.CSSProperties = {
  border: "2px solid var(--line)",
  background: "var(--panel)",
  padding: "18px 20px",
};

/**
 * El Sector 00 no se juega aqui: se juega en la terminal del jugador. Esta
 * pantalla explica los pasos y recoge la ficha que emite `sector verify`.
 */
export function PantallaEntorno({ mision }: { mision: MisionEntorno }) {
  const est = usarProgreso((s) => s.porMision[mision.id]);
  const escribir = usarProgreso((s) => s.escribir);
  const anotar = usarProgreso((s) => s.registrar);
  const [aviso, setAviso] = useState<string | null>(null);

  useEffect(() => {
    registrar({ tipo: "abre", mision: mision.id, t: Date.now() });
  }, [mision.id]);

  const comprobar = useCallback(() => {
    const t = Date.now();
    const datos = leerFicha(est.codigo);
    if (!datos) {
      registrar({ tipo: "ficha", mision: mision.id, t, resultado: "ilegible", faltan: [] });
      setAviso(
        "Esa ficha no se entiende. Copiala entera, desde el principio hasta el final, sin espacios de mas.",
      );
      return;
    }
    const faltan = faltantes(mision.exige, datos.ok);
    if (faltan.length) {
      registrar({ tipo: "ficha", mision: mision.id, t, resultado: "incompleta", faltan });
      setAviso(
        `Tu ficha es correcta, pero todavia falta: ${faltan.map((f) => ETIQUETAS[f] ?? f).join(", ")}. Arreglalo y vuelve a ejecutar 'sector verify'.`,
      );
      anotar(mision.id, 0, false);
      return;
    }
    registrar({ tipo: "ficha", mision: mision.id, t, resultado: "ok", faltan: [] });
    setAviso(null);
    anotar(mision.id, 3, true);
  }, [anotar, est.codigo, mision.exige, mision.id]);

  return (
    <div style={{ flexGrow: 1, display: "flex", minHeight: 0 }}>
      <aside
        style={{
          width: 420, flexShrink: 0, borderRight: "2px solid var(--line)",
          background: "#0e101a", padding: 24, display: "flex",
          flexDirection: "column", gap: 18, overflowY: "auto",
        }}
      >
        <span className="etiqueta">FUERA DEL NAVEGADOR</span>
        <h1 style={{ margin: 0, fontFamily: "var(--px)", fontSize: 13, fontWeight: 400, color: "#fff", lineHeight: 1.65 }}>
          {mision.titulo}
        </h1>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65 }}>{mision.enunciado}</p>
        <div style={{ marginTop: "auto", borderTop: "2px solid var(--line-soft)", paddingTop: 14 }}>
          <span className="mono" style={{ fontSize: 11.5, color: "var(--dim)" }}>
            {mision.minutos} min estimados · {mision.xp} XP
          </span>
        </div>
      </aside>

      <main style={{ flexGrow: 1, padding: 28, display: "flex", flexDirection: "column", gap: 22, overflowY: "auto", minWidth: 0 }}>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 14 }}>
          {mision.pasos.map((paso, i) => (
            <li key={i} style={{ ...panel, display: "flex", gap: 16 }}>
              <span style={{ fontFamily: "var(--px)", fontSize: 14, color: "var(--marquee)", flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0, flexGrow: 1 }}>
                <span style={{ fontSize: 14, lineHeight: 1.6 }}>{paso.texto}</span>
                {paso.orden && (
                  <pre className="mono" style={{ margin: 0, background: "#08090f", border: "1px solid var(--line)", padding: "10px 12px", fontSize: 12.5, color: "var(--fosforo)", overflowX: "auto" }}>
                    {paso.orden}
                  </pre>
                )}
              </div>
            </li>
          ))}
        </ol>

        <div style={{ ...panel, display: "flex", flexDirection: "column", gap: 14 }}>
          <span className="etiqueta" style={{ color: "var(--ambar)" }}>PEGA TU FICHA</span>
          <textarea
            value={est.codigo}
            onChange={(e) => { escribir(mision.id, e.target.value); setAviso(null); }}
            placeholder="Pega aqui la ficha que imprime 'sector verify'"
            spellCheck={false}
            rows={3}
            style={{
              width: "100%", resize: "vertical", background: "#08090f",
              border: "1px solid var(--line)", color: "var(--ink)",
              fontFamily: "var(--mono)", fontSize: 12.5, padding: 12, lineHeight: 1.6,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button className="principal" onClick={comprobar} disabled={!est.codigo.trim()}>
              COMPROBAR
            </button>
            {est.superada && !aviso && (
              <span className="mono" style={{ fontSize: 12.5, color: "var(--fosforo)" }}>
                Entorno listo. Sector desbloqueado.
              </span>
            )}
          </div>
          {aviso && (
            <div style={{ borderLeft: "5px solid var(--marquee)", background: "var(--marquee-fondo)", padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--ink-alto)" }}>{aviso}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
