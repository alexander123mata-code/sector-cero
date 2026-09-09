import type { Mision } from "../types/mission";
import { esEntorno, esLogica } from "../types/mission";
import type { Runner } from "../engine/runner";
import { Cabecera } from "./Cabecera";
import { PantallaCodigo } from "./PantallaCodigo";
import { PantallaEntorno } from "./PantallaEntorno";
import { PantallaLogica } from "./PantallaLogica";

type Props = { mision: Mision; runner: Runner; listo: boolean; arranque: string };

/** Elige la pantalla segun como se resuelve la mision. */
export function MissionScreen({ mision, runner, listo, arranque }: Props) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Cabecera mision={mision} />
      {esEntorno(mision) ? (
        <PantallaEntorno mision={mision} />
      ) : esLogica(mision) ? (
        <PantallaLogica key={mision.id} mision={mision} />
      ) : (
        <PantallaCodigo mision={mision} runner={runner} listo={listo} arranque={arranque} />
      )}
    </div>
  );
}
