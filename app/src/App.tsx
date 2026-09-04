import "./ui/tokens.css";
import { misionPorId, misiones } from "./content";
import { usarProgreso } from "./store/progress";
import { MissionScreen } from "./ui/MissionScreen";

export default function App() {
  const actual = usarProgreso((s) => s.actual);
  const mision = misionPorId(actual) ?? misiones[0];
  return <MissionScreen key={mision.id} mision={mision} />;
}
