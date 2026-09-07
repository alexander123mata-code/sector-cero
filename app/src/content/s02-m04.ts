import type { Mision } from "../types/mission";

export const s02m04: Mision = {
  tipo: "codigo",
  id: "s02-m04-tipos",
  sector: 2,
  titulo: "Cambiar de forma",
  concepto: [
    "tipos",
    "conversion"
  ],
  requiere: [
    "s02-m03-saludo"
  ],
  minutos: 8,
  xp: 80,
  enunciado: "`texto` contiene un numero, pero guardado como texto: para Python el \"5\" escrito y el 5 contado son cosas distintas. Conviertelo a numero, sumale 10 y guardalo en `resultado`.",
  plantilla: "# texto ya existe: cada prueba le pone su valor.\n# Deja el resultado en una variable llamada: resultado\n\n# tu codigo aqui\n",
  solucion: "resultado = int(texto) + 10\n",
  salida: "resultado",
  ejemplo: {
    "situacion": "Un formulario devuelve la edad como texto y hay que sumarle un ano.",
    "codigo": "escrito = \"30\"\nedad = int(escrito)\nano_que_viene = edad + 1\n\n# ano_que_viene vale 31",
    "comentario": "int() convierte un texto que contiene un numero en un numero de verdad. Hace falta porque los operadores se comportan distinto segun el tipo: \"30\" + \"1\" pega los textos y da \"301\", mientras que 30 + 1 suma y da 31."
  },
  repaso: {
    "resumen": "Acabas de convertir entre tipos, que es de donde salen muchos errores raros cuando se empieza.",
    "piezas": [
      {
        "parte": "int(texto)",
        "hace": "Toma el texto y devuelve el numero que representa. No cambia la variable original: devuelve un valor nuevo."
      },
      {
        "parte": "int(texto) + 10",
        "hace": "La conversion se hace primero, y sobre el numero resultante se suma. Sin convertir, el + intentaria pegar textos."
      }
    ],
    "ojo": "El tipo de un dato decide que significan los operadores. El mismo simbolo + suma numeros y pega textos, y ese es el origen de muchos errores que parecen no tener sentido."
  },
  pruebas: [
    {
      "entrada": {
        "texto": "5"
      },
      "salida": 15,
      "oculta": false
    },
    {
      "entrada": {
        "texto": "0"
      },
      "salida": 10,
      "oculta": false
    },
    {
      "entrada": {
        "texto": "-3"
      },
      "salida": 7,
      "oculta": true
    }
  ],
  restricciones: {
    "exigeNodo": [],
    "prohibeNodo": [],
    "presupuestoOps": 3
  },
  pistas: [
    "Si sumas directamente, Python intentara pegar textos en vez de sumar numeros.",
    "int(algo) convierte ese algo en numero.",
    "resultado = int(texto) + 10"
  ],
  fallosPrevistos: [
    {
      "cuando": {
        "tipo": "error",
        "contiene": "TypeError"
      },
      "dice": "Estas sumando un numero a un texto sin convertirlo. Python no sabe si quieres sumar o pegar, asi que se planta: convierte el texto con int() primero."
    }
  ],
};
