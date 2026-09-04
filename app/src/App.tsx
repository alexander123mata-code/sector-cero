import { useEffect, useState } from "react";
import "./ui/tokens.css";
import { misionPorId, misiones } from "./content";
import { CANCELADO, Runner } from "./engine/runner";
import { usarProgreso } from "./store/progress";
import { MissionScreen } from "./ui/MissionScreen";

/**
 * El interprete vive aqui, no en la pantalla de mision: montar Pyodide cuesta
 * varios segundos y cambiar de mision no debe pagarlo otra vez.
 */
export default function App() {
  const actual = usarProgreso((s) => s.actual);
  const mision = misionPorId(actual) ?? misiones[0];

  // Un Runner destruido levanta un worker nuevo en su siguiente uso, asi que
  // basta con crearlo una vez.
  const [runner] = useState(() => new Runner());
  const [listo, setListo] = useState(false);
  const [arranque, setArranque] = useState("Arrancando el interprete...");

  useEffect(() => {
    // StrictMode monta el efecto dos veces: el ciclo descartado no debe poder
    // escribir en el estado del que sigue vivo.
    let vivo = true;
    runner
      .precargar((t) => vivo && setArranque(`${t}...`))
      .then(() => vivo && setListo(true))
      .catch((e: Error) => {
        if (!vivo || e.message === CANCELADO) return;
        setArranque(`No se pudo arrancar el interprete: ${e.message}`);
      });
    return () => {
      vivo = false;
      runner.destruir();
    };
  }, [runner]);

  return (
    <MissionScreen mision={mision} runner={runner} listo={listo} arranque={arranque} />
  );
}
