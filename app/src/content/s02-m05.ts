import type { Mision } from "../types/mission";

export const s02m05: Mision = {
  tipo: "codigo",
  id: "s02-m05-decision",
  sector: 2,
  titulo: "La primera decision",
  concepto: [
    "if",
    "else",
    "comparacion"
  ],
  requiere: [
    "s02-m04-tipos"
  ],
  minutos: 10,
  xp: 100,
  enunciado: "Hasta ahora tu codigo hacia siempre lo mismo. Segun la `edad` que te den, guarda en `puede` el texto \"si\" cuando sea 18 o mas, y \"no\" cuando sea menos.",
  plantilla: "# edad ya existe: cada prueba le pone su valor.\n# Deja el resultado en una variable llamada: puede\n\n# tu codigo aqui\n",
  solucion: "if edad >= 18:\n    puede = \"si\"\nelse:\n    puede = \"no\"\n",
  salida: "puede",
  ejemplo: {
    "situacion": "Decidir si hace falta paraguas segun los litros de lluvia.",
    "codigo": "lluvia = 5\n\nif lluvia > 0:\n    paraguas = \"lo llevo\"\nelse:\n    paraguas = \"lo dejo\"\n\n# paraguas vale: lo llevo",
    "comentario": "El if comprueba algo que solo puede ser cierto o falso. Si es cierto se ejecutan las lineas sangradas debajo de el; si no, las de debajo del else. Solo se ejecuta uno de los dos caminos, nunca los dos. Los operadores de comparacion son >, <, >=, <= y == para ver si dos cosas son iguales."
  },
  repaso: {
    "resumen": "Acabas de escribir codigo que se comporta distinto segun los datos. Es el primer paso de todo lo demas.",
    "piezas": [
      {
        "parte": "edad >= 18",
        "hace": "Una comparacion. No guarda nada: solo vale cierto o falso, y es lo que el if usa para decidir."
      },
      {
        "parte": "if ...:",
        "hace": "Si la comparacion es cierta, ejecuta las lineas sangradas debajo y se salta el else."
      },
      {
        "parte": "else:",
        "hace": "El otro camino. Se ejecuta solo cuando la comparacion es falsa."
      },
      {
        "parte": "puede = \"si\"",
        "hace": "Esta sangrado dentro del if, asi que solo ocurre en ese camino."
      }
    ],
    "ojo": "Ojo a >= frente a >: con > los de 18 anos exactos se quedarian fuera. Ese detalle de un solo caracter es el error mas comun al comparar."
  },
  pruebas: [
    {
      "entrada": {
        "edad": 25
      },
      "salida": "si",
      "oculta": false
    },
    {
      "entrada": {
        "edad": 10
      },
      "salida": "no",
      "oculta": false
    },
    {
      "entrada": {
        "edad": 18
      },
      "salida": "si",
      "oculta": true
    }
  ],
  restricciones: {
    "exigeNodo": [
      "If"
    ],
    "prohibeNodo": [],
    "presupuestoOps": 6
  },
  pistas: [
    "Necesitas dos caminos: uno cuando la edad llega a 18 y otro cuando no.",
    "La comparacion tiene que incluir el propio 18, no dejarlo fuera.",
    "if edad >= 18:\n    puede = \"si\"\nelse:\n    puede = \"no\""
  ],
  fallosPrevistos: [],
};
