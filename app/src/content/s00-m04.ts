import type { Mision } from "../types/mission";

export const s00m04: Mision = {
  tipo: "entorno",
  id: "s00-m04-editor",
  sector: 0,
  titulo: "Tu banco de trabajo",
  concepto: [
    "editor",
    "VS Code"
  ],
  requiere: [
    "s00-m03-venv"
  ],
  minutos: 10,
  xp: 100,
  enunciado: "El bloc de notas sirve para escribir codigo igual que un tenedor sirve para comer sopa. Instala VS Code y consigue que responda desde la terminal.",
  exige: [
    "vscode"
  ],
  pasos: [
    {
      "texto": "Descarga VS Code desde code.visualstudio.com e instalalo."
    },
    {
      "texto": "Instala la extension oficial de Python: abre el panel de extensiones y busca 'Python' de Microsoft."
    },
    {
      "texto": "Comprueba que la terminal lo encuentra.",
      "orden": "code --version"
    },
    {
      "texto": "Si no responde, abre la paleta con Ctrl+Shift+P (Cmd+Shift+P en Mac) y ejecuta 'Shell Command: Install code command in PATH'."
    },
    {
      "texto": "Vuelve a ejecutar el comprobador.",
      "orden": "sector verify"
    }
  ],
  pistas: [
    "El comando se llama 'code', no 'vscode'.",
    "Igual que con Python: despues de tocar el PATH hace falta una terminal nueva.",
    "Desde la terminal, 'code .' abre la carpeta actual en el editor. Lo vas a usar mucho."
  ],
};
