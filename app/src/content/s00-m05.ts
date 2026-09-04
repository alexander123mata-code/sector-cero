import type { Mision } from "../types/mission";

export const s00m05: Mision = {
  tipo: "entorno",
  id: "s00-m05-git",
  sector: 0,
  titulo: "La maquina del tiempo",
  concepto: [
    "git",
    "control de versiones",
    "identidad"
  ],
  requiere: [
    "s00-m04-editor"
  ],
  minutos: 15,
  xp: 150,
  enunciado: "Antes o despues vas a romper algo que funcionaba y vas a querer volver atras. Git guarda ese historial. Instalalo y dile quien eres, porque firma con tu nombre cada cambio que guardas.",
  exige: [
    "git_instalado",
    "git_identidad"
  ],
  pasos: [
    {
      "texto": "Instala Git desde git-scm.com y comprueba que responde.",
      "orden": "git --version"
    },
    {
      "texto": "Dile tu nombre y tu correo. Apareceran en cada cambio que guardes.",
      "orden": "git config --global user.name \"Tu Nombre\"\ngit config --global user.email \"tu@correo.com\""
    },
    {
      "texto": "Comprueba que se guardo.",
      "orden": "git config --get user.name"
    },
    {
      "texto": "Vuelve a ejecutar el comprobador.",
      "orden": "sector verify"
    }
  ],
  pistas: [
    "El correo no se verifica y no te va a llegar nada: solo etiqueta tus cambios.",
    "'--global' significa 'para todos mis proyectos'. Sin esa palabra vale solo para la carpeta en la que estas.",
    "Si te equivocas, repite el mismo comando con el valor correcto: sobrescribe el anterior."
  ],
};
