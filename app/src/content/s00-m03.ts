import type { Mision } from "../types/mission";

export const s00m03: Mision = {
  tipo: "entorno",
  id: "s00-m03-venv",
  sector: 0,
  titulo: "Una caja para cada proyecto",
  concepto: [
    "entorno virtual",
    "aislamiento",
    "dependencias"
  ],
  requiere: [
    "s00-m02-pip"
  ],
  minutos: 15,
  xp: 150,
  enunciado: "Si instalas todo en el mismo sitio, dos proyectos que necesiten versiones distintas de la misma pieza acaban peleandose. Un entorno virtual le da a cada proyecto su propia caja. Crea uno y activalo.",
  exige: [
    "venv"
  ],
  pasos: [
    {
      "texto": "Entra en la carpeta de tu proyecto y crea el entorno. Aparecera una carpeta .venv.",
      "orden": "python -m venv .venv"
    },
    {
      "texto": "Activalo. En Windows:",
      "orden": ".venv\\Scripts\\activate"
    },
    {
      "texto": "En Mac o Linux:",
      "orden": "source .venv/bin/activate"
    },
    {
      "texto": "Sabras que funciono porque el nombre del entorno aparece al principio de la linea. Instala el comprobador dentro y ejecutalo.",
      "orden": "pip install sector-cero\nsector verify"
    }
  ],
  pistas: [
    "El entorno se activa por terminal: si abres una ventana nueva, hay que volver a activarlo.",
    "Si Windows se queja de permisos al activar, prueba: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass",
    "La carpeta .venv no se sube a git, igual que node_modules."
  ],
};
