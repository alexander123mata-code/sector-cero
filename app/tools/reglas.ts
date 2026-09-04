import type { Mision } from "../src/types/mission";

export type Hallazgo = {
  mision: string;
  nivel: "error" | "aviso";
  regla: string;
  texto: string;
};

const j = (v: unknown) => JSON.stringify(v);
const claveEntrada = (e: Record<string, unknown>) => j(Object.entries(e).sort());

/** Comprobaciones que no necesitan ejecutar Python. */
export function comprobarEstatico(misiones: Mision[]): Hallazgo[] {
  const h: Hallazgo[] = [];
  const error = (m: string, regla: string, texto: string) =>
    h.push({ mision: m, nivel: "error", regla, texto });
  const aviso = (m: string, regla: string, texto: string) =>
    h.push({ mision: m, nivel: "aviso", regla, texto });

  const ids = new Set<string>();
  for (const m of misiones) {
    if (ids.has(m.id)) error(m.id, "id-duplicado", "hay dos misiones con este id");
    ids.add(m.id);
  }

  for (const m of misiones) {
    for (const r of m.requiere) {
      if (!ids.has(r)) error(m.id, "requiere-inexistente", `requiere '${r}', que no existe`);
    }

    // La misma entrada no puede esperar dos salidas distintas.
    const vistas = new Map<string, unknown>();
    for (const p of m.pruebas) {
      const k = claveEntrada(p.entrada);
      const previa = vistas.get(k);
      if (vistas.has(k) && j(previa) !== j(p.salida)) {
        error(
          m.id,
          "pruebas-contradictorias",
          `la entrada ${k} espera ${j(previa)} en una prueba y ${j(p.salida)} en otra`,
        );
      }
      vistas.set(k, p.salida);
    }

    // Si todas las pruebas esperan lo mismo, no distinguen una solucion correcta
    // de una que devuelve esa constante.
    const salidas = new Set(m.pruebas.map((p) => j(p.salida)));
    if (m.pruebas.length > 1 && salidas.size === 1) {
      error(
        m.id,
        "pruebas-no-discriminan",
        `las ${m.pruebas.length} pruebas esperan siempre ${[...salidas][0]}: devolver esa constante las aprueba todas`,
      );
    }

    // Un fallo previsto que coincide con una salida correcta se dispararia
    // contra una solucion valida.
    for (const f of m.fallosPrevistos) {
      if (f.cuando.tipo !== "salida") continue;
      const v = j(f.cuando.valor);
      if (m.pruebas.some((p) => j(p.salida) === v)) {
        error(
          m.id,
          "fallo-previsto-choca",
          `el fallo previsto para ${v} coincide con la salida correcta de una prueba`,
        );
      }
    }

    if (!m.pruebas.some((p) => p.oculta)) {
      aviso(m.id, "sin-prueba-oculta", "no hay ninguna prueba oculta");
    }

    if (!m.plantilla.includes(m.salida)) {
      aviso(
        m.id,
        "salida-fuera-de-plantilla",
        `la plantilla no menciona '${m.salida}', la variable que se evalua`,
      );
    }

    if (m.sensor) {
      for (const [i, p] of m.pruebas.entries()) {
        if (!(m.sensor.desde in p.entrada)) {
          error(
            m.id,
            "sensor-sin-datos",
            `la prueba ${i + 1} no trae '${m.sensor.desde}', que alimenta al sensor`,
          );
        }
      }
      if (!m.plantilla.includes(m.sensor.nombre)) {
        aviso(m.id, "sensor-fuera-de-plantilla", `la plantilla no usa '${m.sensor.nombre}()'`);
      }
    }

    if (!m.solucion.trim()) error(m.id, "sin-solucion", "no hay solucion de referencia");
    if (m.pistas.some((p) => !p.trim())) error(m.id, "pista-vacia", "hay una pista vacia");
  }

  for (const ciclo of buscarCiclos(misiones)) {
    error(ciclo[0], "ciclo-de-prerrequisitos", `ciclo: ${ciclo.join(" -> ")}`);
  }

  return h;
}

/** Un ciclo en `requiere` dejaria misiones imposibles de desbloquear. */
function buscarCiclos(misiones: Mision[]): string[][] {
  const grafo = new Map(misiones.map((m) => [m.id, m.requiere]));
  const estado = new Map<string, 0 | 1 | 2>();
  const ciclos: string[][] = [];

  const visitar = (id: string, camino: string[]) => {
    if (estado.get(id) === 1) {
      ciclos.push([...camino.slice(camino.indexOf(id)), id]);
      return;
    }
    if (estado.get(id) === 2) return;
    estado.set(id, 1);
    for (const s of grafo.get(id) ?? []) visitar(s, [...camino, id]);
    estado.set(id, 2);
  };

  for (const m of misiones) visitar(m.id, []);
  return ciclos;
}
