import type { Mision } from "../types/mission";

export const s00m02: Mision = {
  tipo: "entorno",
  id: "s00-m02-pip",
  sector: 0,
  titulo: "La tienda de piezas",
  concepto: [
    "pip",
    "paquetes"
  ],
  requiere: [
    "s00-m01-python"
  ],
  minutos: 10,
  xp: 100,
  enunciado: "Casi nada se escribe desde cero: se usa codigo que otros ya escribieron. pip es lo que trae ese codigo a tu maquina. Comprueba que responde.",
  exige: [
    "pip"
  ],
  pasos: [
    {
      "texto": "Pregunta a pip que version tiene.",
      "orden": "python -m pip --version"
    },
    {
      "texto": "Si no responde, pidele a Python que lo instale por ti.",
      "orden": "python -m ensurepip --upgrade"
    },
    {
      "texto": "Vuelve a ejecutar el comprobador.",
      "orden": "sector verify"
    }
  ],
  pistas: [
    "Escribe 'python -m pip' en vez de 'pip' a secas: asi usas el pip del Python que acabas de instalar.",
    "Si tienes varios Python instalados, cada uno trae su propio pip. Por eso importa cual llamas."
  ],
};
