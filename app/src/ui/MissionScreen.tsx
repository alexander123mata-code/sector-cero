import { useCallback, useEffect, useRef, useState } from "react";
import type { Evaluacion, Mision } from "../types/mission";
import { CANCELADO, Runner } from "../engine/runner";
import { evaluar } from "../engine/evaluate";
import { usarProgreso } from "../store/progress";
import { Briefing } from "./Briefing";
import { Resultado } from "./Resultado";
import { Editor } from "./Editor";
import { Cabecera } from "./Cabecera";

const LISTO = "Interprete listo. Escribe tu solucion y pulsa ENVIAR.";

export function MissionScreen({ mision }: { mision: Mision }) {
  const runner = useRef<Runner | null>(null);
  const [estado, setEstado] = useState("Arrancando el interprete...");
  const [listo, setListo] = useState(false);
  const [corriendo, setCorriendo] = useState(false);
  const [ev, setEv] = useState<Evaluacion | null>(null);

  const est = usarProgreso((s) => s.porMision[mision.id]);
  const escribir = usarProgreso((s) => s.escribir);
  const pedirPista = usarProgreso((s) => s.pedirPista);
  const registrar = usarProgreso((s) => s.registrar);

  useEffect(() => {
    // StrictMode monta el efecto dos veces: el runner descartado no debe poder
    // escribir en el estado del que sigue vivo.
    let vivo = true;
    const r = new Runner();
    runner.current = r;
    r.precargar((t) => vivo && setEstado(`${t}...`))
      .then(() => {
        if (!vivo) return;
        setListo(true);
        setEstado(LISTO);
      })
      .catch((e: Error) => {
        if (!vivo || e.message === CANCELADO) return;
        setEstado(`No se pudo arrancar el interprete: ${e.message}`);
      });
    return () => {
      vivo = false;
      r.destruir();
    };
  }, []);

  useEffect(() => {
    setEv(null);
    if (listo) setEstado(LISTO);
  }, [mision.id, listo]);

  const enviar = useCallback(async () => {
    const r = runner.current;
    if (!r || corriendo) return;
    setCorriendo(true);
    setEstado("Ejecutando contra las pruebas...");
    try {
      const { nodos, casos } = await r.correr({
        codigo: est.codigo,
        salida: mision.salida,
        sensor: mision.sensor ? JSON.stringify(mision.sensor) : null,
        casos: mision.pruebas.map((p) => JSON.stringify(p.entrada)),
      });
      const resultado = evaluar(mision, nodos, casos);
      setEv(resultado);
      registrar(mision.id, resultado.estrellas, resultado.superada);
      const impreso = casos.map((c) => c.impreso ?? "").join("").trim();
      setEstado(
        resultado.superada
          ? `Superada con ${resultado.estrellas} de 3 estrellas.${impreso ? `\n\n${impreso}` : ""}`
          : `Aun no.${impreso ? `\n\n${impreso}` : ""}`,
      );
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e);
      if (m === CANCELADO) return;
      setEstado(
        m === "TIMEOUT"
          ? "El interprete dejo de responder. Se reinicio: vuelve a enviar."
          : `Fallo la ejecucion: ${m}`,
      );
      setEv(null);
    } finally {
      setCorriendo(false);
    }
  }, [corriendo, est.codigo, mision, registrar]);

  const quedanPistas = est.pistasUsadas < mision.pistas.length;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Cabecera mision={mision} />
      <div style={{ flexGrow: 1, display: "flex", minHeight: 0 }}>
        <Briefing mision={mision} pistasUsadas={est.pistasUsadas} />
        <main style={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <div style={{ flexGrow: 1, minHeight: 0 }}>
            <Editor clave={mision.id} valor={est.codigo} onCambio={(v) => escribir(mision.id, v)} />
          </div>
          <div
            style={{
              height: 76, flexShrink: 0, borderTop: "2px solid var(--line)",
              background: "var(--panel)", display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "0 20px",
            }}
          >
            <button className="principal" onClick={enviar} disabled={!listo || corriendo}>
              {corriendo ? "EJECUTANDO" : "ENVIAR"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span className="mono" style={{ fontSize: 11.5, color: "var(--dim)" }}>
                intento {est.intentos}
              </span>
              <button className="aviso" onClick={() => pedirPista(mision.id)} disabled={!quedanPistas}>
                {quedanPistas
                  ? `PISTA ${est.pistasUsadas + 1} / ${mision.pistas.length}  −20 XP`
                  : "SIN MAS PISTAS"}
              </button>
            </div>
          </div>
        </main>
        <Resultado mision={mision} ev={ev} estado={estado} />
      </div>
    </div>
  );
}
