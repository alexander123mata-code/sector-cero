import type { Registro, Suceso } from "../src/telemetria/registro";

export type ResumenMision = {
  mision: string;
  jugadores: number;
  aperturas: number;
  envios: number;
  superada: number;
  tasaAcierto: number;
  intentosHastaAcertar: number | null;
  minutosHastaAcertar: number | null;
  pistas: number;
  abandonos: number;
  erroresFrecuentes: { obtenido: string; veces: number }[];
  fichasIlegibles: number;
  faltasFrecuentes: { falta: string; veces: number }[];
};

const media = (xs: number[]) =>
  xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null;

function masFrecuentes<T extends string>(xs: T[], tope = 5) {
  const cuenta = new Map<T, number>();
  for (const x of xs) cuenta.set(x, (cuenta.get(x) ?? 0) + 1);
  return [...cuenta.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, tope)
    .map(([k, v]) => [k, v] as [T, number]);
}

/**
 * Junta varios registros (uno por jugador) y saca, por mision, lo que hace
 * falta para decidir que reescribir: si la gente la supera, cuanto le cuesta,
 * y sobre todo que valores equivocados devuelve.
 */
export function analizar(registros: Registro[]): ResumenMision[] {
  const ids = new Set<string>();
  for (const r of registros) for (const s of r.sucesos) ids.add(s.mision);

  return [...ids]
    .sort()
    .map((mision) => {
      const porJugador = registros.map((r) => r.sucesos.filter((s) => s.mision === mision));
      const conActividad = porJugador.filter((ss) => ss.length > 0);

      const envios: Extract<Suceso, { tipo: "envia" }>[] = [];
      const fichas: Extract<Suceso, { tipo: "ficha" }>[] = [];
      let aperturas = 0;
      let pistas = 0;

      for (const ss of conActividad) {
        for (const s of ss) {
          if (s.tipo === "abre") aperturas++;
          else if (s.tipo === "pista") pistas++;
          else if (s.tipo === "envia") envios.push(s);
          else fichas.push(s);
        }
      }

      const intentosHasta: number[] = [];
      const minutosHasta: number[] = [];
      let superada = 0;
      let abandonos = 0;

      for (const ss of conActividad) {
        const abre = ss.find((s) => s.tipo === "abre");
        const acierto = ss.find(
          (s) => (s.tipo === "envia" && s.superada) || (s.tipo === "ficha" && s.resultado === "ok"),
        );
        if (!acierto) {
          if (ss.some((s) => s.tipo === "envia" || s.tipo === "ficha")) abandonos++;
          continue;
        }
        superada++;
        const previos = ss
          .slice(0, ss.indexOf(acierto) + 1)
          .filter((s) => s.tipo === "envia" || s.tipo === "ficha").length;
        intentosHasta.push(previos);
        if (abre) minutosHasta.push((acierto.t - abre.t) / 60000);
      }

      const intentos = envios.length + fichas.length;

      return {
        mision,
        jugadores: conActividad.length,
        aperturas,
        envios: intentos,
        superada,
        tasaAcierto: conActividad.length
          ? Math.round((superada / conActividad.length) * 100)
          : 0,
        intentosHastaAcertar: media(intentosHasta),
        minutosHastaAcertar: minutosHasta.length
          ? Math.round(media(minutosHasta)! * 10) / 10
          : null,
        pistas,
        abandonos,
        erroresFrecuentes: masFrecuentes(
          envios
            .flatMap((e) => e.fallos)
            .filter((f) => !f.timeout && !f.error)
            .map((f) => JSON.stringify(f.obtenido)),
        ).map(([obtenido, veces]) => ({ obtenido, veces })),
        fichasIlegibles: fichas.filter((f) => f.resultado === "ilegible").length,
        faltasFrecuentes: masFrecuentes(fichas.flatMap((f) => f.faltan)).map(
          ([falta, veces]) => ({ falta, veces }),
        ),
      };
    })
    .sort((a, b) => a.tasaAcierto - b.tasaAcierto);
}
