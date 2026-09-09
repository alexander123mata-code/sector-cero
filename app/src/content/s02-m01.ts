import type { Mision } from "../types/mission";

export const s02m01: Mision = {
  tipo: "codigo",
  id: "s02-m01-eco",
  sector: 2,
  titulo: "Tu primera linea",
  concepto: [
    "variable",
    "asignacion"
  ],
  requiere: [
    "s01-m06-repeticion"
  ],
  minutos: 5,
  xp: 60,
  enunciado: "Una variable es una caja con nombre donde guardas algo. Aqui ya existe una llamada `mensaje`. Copia lo que hay dentro a otra caja llamada `respuesta`.",
  plantilla: "# mensaje ya existe: cada prueba le pone su valor. No la declares tu.\n# Deja el resultado en una variable llamada: respuesta\n\n# tu codigo aqui\n",
  solucion: "respuesta = mensaje\n",
  salida: "respuesta",
  ejemplo: {
    "situacion": "Guardar un numero y luego copiarlo a otra variable.",
    "codigo": "edad = 30\notra = edad\n\n# ahora otra tambien vale 30",
    "comentario": "El signo = no significa 'es igual a', significa 'guarda esto aqui'. Se lee de derecha a izquierda: toma lo que hay a la derecha y metelo en la caja de la izquierda. El nombre de la caja lo eliges tu, pero tiene que ser el que pide la mision."
  },
  repaso: {
    "resumen": "Acabas de hacer lo mas basico que hace un programa: mover un dato de un sitio a otro.",
    "piezas": [
      {
        "parte": "respuesta = mensaje",
        "hace": "Toma lo que hay guardado en `mensaje` y lo guarda en `respuesta`. No copia el nombre, copia el contenido."
      }
    ],
    "ojo": "El orden importa: `respuesta = mensaje` guarda en respuesta. Al reves, `mensaje = respuesta`, guardaria en mensaje, que no es lo que se evalua."
  },
  pruebas: [
    {
      "entrada": {
        "mensaje": "hola"
      },
      "salida": "hola",
      "oculta": false
    },
    {
      "entrada": {
        "mensaje": "adios"
      },
      "salida": "adios",
      "oculta": false
    },
    {
      "entrada": {
        "mensaje": "sector cero"
      },
      "salida": "sector cero",
      "oculta": true
    }
  ],
  restricciones: {
    "exigeNodo": [],
    "prohibeNodo": [],
    "presupuestoOps": 3
  },
  pistas: [
    "Necesitas una sola linea, con un signo = en medio.",
    "A la izquierda del = va el nombre de la caja donde guardas; a la derecha, lo que quieres guardar.",
    "respuesta = mensaje"
  ],
  fallosPrevistos: [],
};
