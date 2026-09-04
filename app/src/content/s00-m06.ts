import type { Mision } from "../types/mission";

export const s00m06: Mision = {
  tipo: "entorno",
  id: "s00-m06-commit",
  sector: 0,
  titulo: "El primer punto de guardado",
  concepto: [
    "repositorio",
    "commit",
    "historial"
  ],
  requiere: [
    "s00-m05-git"
  ],
  minutos: 15,
  xp: 200,
  enunciado: "Git ya sabe quien eres, pero todavia no vigila nada. Convierte la carpeta de tu proyecto en un repositorio y guarda tu primer punto de control.",
  exige: [
    "repo_git",
    "commit"
  ],
  pasos: [
    {
      "texto": "Entra en la carpeta de tu proyecto y dile a Git que empiece a vigilarla.",
      "orden": "git init"
    },
    {
      "texto": "Crea un archivo cualquiera para tener algo que guardar.",
      "orden": "echo \"# Mi proyecto\" > README.md"
    },
    {
      "texto": "Marca lo que quieres guardar y guardalo con un mensaje que explique que hiciste.",
      "orden": "git add .\ngit commit -m \"Mi primer commit\""
    },
    {
      "texto": "Mira tu historial: ahi esta tu primer punto de guardado.",
      "orden": "git log --oneline"
    },
    {
      "texto": "Ejecuta el comprobador por ultima vez.",
      "orden": "sector verify"
    }
  ],
  pistas: [
    "'git add' elige que entra en el guardado; 'git commit' lo guarda de verdad. Son dos pasos a proposito.",
    "El mensaje del commit lo vas a leer tu dentro de seis meses. Escribe que cambiaste, no 'cambios'.",
    "Si git init falla, comprueba que estas en la carpeta correcta con 'pwd' (o 'cd' a secas en Windows)."
  ],
};
