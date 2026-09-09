import { useEffect, useState } from "react";
import type { MisionLogica } from "../types/mission";
import type { Respuesta } from "../engine/logica";
import { acierta, completa, estrellasLogica, respuestaVacia } from "../engine/logica";
import { usarProgreso } from "../store/progress";
import { registrar } from "../telemetria/registro";
import { Ejercicio, type Fase } from "./Ejercicio";
import { Estrellas } from "./Estrellas";

/** Lo que el jugador contesto, en una linea, para el registro. */
function describe(r: Respuesta): string {
  if (r.forma === "eleccion") return r.elegida === null ? "" : String(r.elegida);
  if (r.forma === "orden") return r.montado.join(" | ");
  return r.celdas.map((c) => c ?? "?").join(" | ");
}

const panel: React.CSSProperties = {
  border: "2px solid var(--line)",
  background: "var(--panel)",
  padding: "18px 20px",
};

/**
 * El Sector 01 se juega contestando, no escribiendo. Cada ejercicio se corrige
 * en el sitio y explica el porque antes de dejar pasar al siguiente: fallar y
 * enterarte de por que es el recorrido, no un castigo que se salta.
 */
export function PantallaLogica({ mision }: { mision: MisionLogica }) {
  const est = usarProgreso((s) => s.porMision[mision.id]);
  const anotar = usarProgreso((s) => s.registrar);
  const pedirPista = usarProgreso((s) => s.pedirPista);

  const [paso, setPaso] = useState(0);
  const [fase, setFase] = useState<Fase>("respondiendo");
  const [intento, setIntento] = useState(1);
  const [aLaPrimera, setALaPrimera] = useState(0);
  const [respuesta, setRespuesta] = useState<Respuesta>(() => respuestaVacia(mision.ejercicios[0]));

  const total = mision.ejercicios.length;
  const terminada = paso >= total;
  const quedanPistas = est.pistasUsadas < mision.pistas.length;

  useEffect(() => {
    registrar({ tipo: "abre", mision: mision.id, t: Date.now() });
  }, [mision.id]);

  // Cambiar de mision remonta esta pantalla, porque MissionScreen la usa con
  // key: el recorrido nace limpio sin tener que reiniciarlo desde un efecto.
  const reiniciar = () => {
    setPaso(0);
    setFase("respondiendo");
    setIntento(1);
    setALaPrimera(0);
    setRespuesta(respuestaVacia(mision.ejercicios[0]));
  };

  const comprobar = () => {
    const ejercicio = mision.ejercicios[paso];
    const bien = acierta(ejercicio, respuesta);
    registrar({
      tipo: "responde",
      mision: mision.id,
      t: Date.now(),
      ejercicio: paso,
      forma: ejercicio.forma,
      intento,
      acierta: bien,
      dado: describe(respuesta),
    });
    if (bien && intento === 1) setALaPrimera((n) => n + 1);
    setFase(bien ? "acertado" : "fallado");
  };

  const seguir = () => {
    if (fase === "fallado") {
      // Fallar no salta el ejercicio: se vuelve a intentar, ya con el porque
      // delante. Lo unico que se pierde es la estrella.
      setIntento((n) => n + 1);
      setFase("respondiendo");
      setRespuesta(respuestaVacia(mision.ejercicios[paso]));
      return;
    }
    const siguiente = paso + 1;
    setPaso(siguiente);
    setIntento(1);
    setFase("respondiendo");
    if (siguiente < total) setRespuesta(respuestaVacia(mision.ejercicios[siguiente]));
    else anotar(mision.id, estrellasLogica(total, aLaPrimera), true);
  };

  const estrellas = estrellasLogica(total, aLaPrimera);

  return (
    <div style={{ flexGrow: 1, display: "flex", minHeight: 0 }}>
      <aside
        style={{
          width: 372, flexShrink: 0, borderRight: "2px solid var(--line)",
          background: "#0e101a", padding: 22, display: "flex",
          flexDirection: "column", gap: 18, overflowY: "auto",
        }}
      >
        <span className="etiqueta">SIN CODIGO · SOLO PENSAR</span>
        <h1 style={{ margin: 0, fontFamily: "var(--px)", fontSize: 13, fontWeight: 400, color: "#fff", lineHeight: 1.65 }}>
          {mision.titulo}
        </h1>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65 }}>{mision.enunciado}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {mision.concepto.map((c) => (
            <span key={c} className="mono" style={{ border: "1px solid var(--line)", background: "var(--panel)", padding: "4px 8px", fontSize: 11.5, color: "#9ba3be" }}>
              {c}
            </span>
          ))}
        </div>

        {mision.ejemplo && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <span className="etiqueta" style={{ color: "var(--fosforo)" }}>UNO RESUELTO</span>
            <div style={{ border: "2px solid var(--fosforo-borde)", borderLeft: "5px solid var(--fosforo)", background: "var(--fosforo-fondo)", padding: "14px 15px", display: "flex", flexDirection: "column", gap: 11 }}>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-alto)" }}>
                {mision.ejemplo.situacion}
              </p>
              <pre className="mono" style={{ margin: 0, background: "#08090f", border: "1px solid var(--line)", padding: "12px 13px", fontSize: 12, lineHeight: "21px", color: "var(--ink)", overflowX: "auto", whiteSpace: "pre-wrap" }}>
                {mision.ejemplo.codigo}
              </pre>
              <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--ink)" }}>
                {mision.ejemplo.comentario}
              </p>
            </div>
          </div>
        )}

        {est.pistasUsadas > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="etiqueta" style={{ color: "var(--ambar)" }}>PISTAS</span>
            {mision.pistas.slice(0, est.pistasUsadas).map((p, i) => (
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

      <main style={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {terminada ? (
          <Cierre mision={mision} estrellas={estrellas} aLaPrimera={aLaPrimera} total={total} onReiniciar={reiniciar} />
        ) : (
          <Ronda
            mision={mision}
            paso={paso}
            total={total}
            fase={fase}
            intento={intento}
            respuesta={respuesta}
            quedanPistas={quedanPistas}
            pistasUsadas={est.pistasUsadas}
            onRespuesta={setRespuesta}
            onComprobar={comprobar}
            onSeguir={seguir}
            onPista={() => {
              registrar({ tipo: "pista", mision: mision.id, t: Date.now(), numero: est.pistasUsadas + 1 });
              pedirPista(mision.id);
            }}
          />
        )}
      </main>
    </div>
  );
}

type CierreProps = {
  mision: MisionLogica;
  estrellas: 0 | 1 | 2 | 3;
  aLaPrimera: number;
  total: number;
  onReiniciar: () => void;
};

function Cierre({ mision, estrellas, aLaPrimera, total, onReiniciar }: CierreProps) {
  return (
    <div style={{ flexGrow: 1, overflowY: "auto", padding: 28, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0, fontFamily: "var(--px)", fontSize: 16, fontWeight: 400, color: "var(--fosforo)" }}>
          SECTOR DESPEJADO
        </h2>
        <Estrellas cuantas={estrellas} tam={22} />
      </div>
      <p className="mono" style={{ margin: 0, fontSize: 12.5, color: "var(--dim)", lineHeight: 1.6 }}>
        {aLaPrimera} de {total} a la primera
        {estrellas < 3 && " · las tres estrellas se ganan acertandolos todos a la primera"}
      </p>

      <div style={{ ...panel, borderLeft: "5px solid var(--fosforo)", display: "flex", flexDirection: "column", gap: 14 }}>
        <span className="etiqueta" style={{ color: "var(--fosforo)" }}>LO QUE ACABAS DE HACER</span>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--ink-alto)" }}>
          {mision.repaso.resumen}
        </p>
        {mision.repaso.piezas.map((z, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <pre className="mono" style={{ margin: 0, background: "#08090f", border: "1px solid var(--line)", padding: "8px 10px", fontSize: 12, lineHeight: "19px", color: "var(--fosforo)", overflowX: "auto", whiteSpace: "pre-wrap" }}>
              {z.parte}
            </pre>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55 }}>{z.hace}</p>
          </div>
        ))}
        {mision.repaso.ojo && (
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, borderTop: "1px dashed var(--fosforo-borde)", paddingTop: 11 }}>
            {mision.repaso.ojo}
          </p>
        )}
      </div>

      <button onClick={onReiniciar} style={{ minHeight: 44, padding: "0 16px", alignSelf: "flex-start" }}>
        REPETIR LA MISION
      </button>
    </div>
  );
}

type RondaProps = {
  mision: MisionLogica;
  paso: number;
  total: number;
  fase: Fase;
  intento: number;
  respuesta: Respuesta;
  quedanPistas: boolean;
  pistasUsadas: number;
  onRespuesta: (r: Respuesta) => void;
  onComprobar: () => void;
  onSeguir: () => void;
  onPista: () => void;
};

function Ronda(p: RondaProps) {
  const ejercicio = p.mision.ejercicios[p.paso];
  const verde = p.fase === "acertado";

  return (
    <>
      <div style={{ flexGrow: 1, overflowY: "auto", padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <span className="etiqueta">EJERCICIO {p.paso + 1} DE {p.total}</span>
          {p.intento > 1 && (
            <span className="mono" style={{ fontSize: 11.5, color: "var(--ambar)" }}>
              intento {p.intento}
            </span>
          )}
        </div>

        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: "var(--ink-alto)" }}>
          {ejercicio.pregunta}
        </p>

        {ejercicio.muestra && (
          <pre className="mono" style={{ margin: 0, background: "#08090f", border: "1px solid var(--line)", padding: "14px 15px", fontSize: 12.5, lineHeight: "22px", color: "var(--ink)", overflowX: "auto" }}>
            {ejercicio.muestra}
          </pre>
        )}

        <Ejercicio
          ejercicio={ejercicio}
          semilla={`${p.mision.id}#${p.paso}`}
          valor={p.respuesta}
          fase={p.fase}
          onCambio={p.onRespuesta}
        />

        {p.fase !== "respondiendo" && (
          <div
            style={{
              border: "2px solid var(--line)",
              borderLeft: `5px solid ${verde ? "var(--fosforo)" : "var(--marquee)"}`,
              background: verde ? "var(--fosforo-fondo)" : "var(--marquee-fondo)",
              padding: "15px 16px", display: "flex", flexDirection: "column", gap: 8,
            }}
          >
            <span className="etiqueta" style={{ color: verde ? "var(--fosforo)" : "var(--marquee)" }}>
              {verde ? "CORRECTO" : "NO ES ESO"}
            </span>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--ink-alto)" }}>
              {ejercicio.porque}
            </p>
          </div>
        )}
      </div>

      <div
        style={{
          flexShrink: 0, borderTop: "2px solid var(--line)", background: "var(--panel)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 20px", gap: 12, flexWrap: "wrap",
        }}
      >
        {p.fase === "respondiendo" ? (
          <button className="principal" onClick={p.onComprobar} disabled={!completa(ejercicio, p.respuesta)}>
            COMPROBAR
          </button>
        ) : (
          <button className="principal" onClick={p.onSeguir}>
            {p.fase === "fallado"
              ? "VOLVER A INTENTARLO"
              : p.paso + 1 === p.total
                ? "TERMINAR"
                : "SIGUIENTE"}
          </button>
        )}
        <button className="aviso" onClick={p.onPista} disabled={!p.quedanPistas}>
          {p.quedanPistas
            ? `PISTA ${p.pistasUsadas + 1} / ${p.mision.pistas.length}  −20 XP`
            : "SIN MAS PISTAS"}
        </button>
      </div>
    </>
  );
}
