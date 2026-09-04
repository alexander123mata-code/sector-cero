import type { Mision } from "../types/mission";

export const s00m01: Mision = {
  tipo: "entorno",
  id: "s00-m01-python",
  sector: 0,
  titulo: "La primera senal de vida",
  concepto: [
    "instalacion",
    "terminal",
    "PATH"
  ],
  requiere: [],
  minutos: 20,
  xp: 150,
  enunciado: "Todavia no hay nada en tu maquina que ejecute codigo. Instala Python y consigue que la terminal lo encuentre cuando lo llamas por su nombre.",
  exige: [
    "python_version",
    "python_en_path"
  ],
  pasos: [
    {
      "texto": "Descarga Python desde python.org. Al instalarlo en Windows, marca la casilla 'Add python.exe to PATH': es la que hace que la terminal lo encuentre despues."
    },
    {
      "texto": "Abre una terminal NUEVA. Las que ya estaban abiertas no se enteran de lo que acabas de instalar."
    },
    {
      "texto": "Pregunta a Python que version tiene. Si responde, esta vivo.",
      "orden": "python --version"
    },
    {
      "texto": "Instala el comprobador de Sector Cero.",
      "orden": "pip install sector-cero"
    },
    {
      "texto": "Ejecutalo y copia la ficha que imprime al final.",
      "orden": "sector verify"
    }
  ],
  pistas: [
    "Si la terminal dice que no conoce 'python', casi siempre es la casilla del PATH sin marcar.",
    "En Mac y en Linux el comando suele ser 'python3', no 'python'.",
    "En Windows puedes repararlo sin desinstalar: lanza otra vez el instalador, elige Modify y marca la casilla del PATH."
  ],
};
