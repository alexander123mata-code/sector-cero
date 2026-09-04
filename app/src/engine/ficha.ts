/**
 * Lee la ficha que emite `sector verify`. Es el espejo exacto de
 * cli/src/sector_cero/ficha.py: si cambia uno, cambia el otro.
 */

const VERSION = 1;
const SAL = "sector-cero";

export type Ficha = { v: number; ts: number; ok: string[] };

/** Nombres legibles de las comprobaciones, para los mensajes al jugador. */
export const ETIQUETAS: Record<string, string> = {
  python_version: "Python instalado",
  python_en_path: "Python accesible desde la terminal",
  pip: "pip disponible",
  venv: "un entorno virtual activo",
  git_instalado: "Git instalado",
  git_identidad: "Git configurado con tu nombre y correo",
  repo_git: "estar dentro de un repositorio",
  commit: "al menos un commit",
  vscode: "VS Code accesible desde la terminal",
};

/** FNV-1a de 32 bits, identico al del CLI. Detecta pegados a medias. */
function suma(bytes: Uint8Array): string {
  let h = 2166136261;
  for (const b of bytes) h = Math.imul(h ^ b, 16777619) >>> 0;
  return h.toString(16).padStart(8, "0");
}

function desdeBase64Url(texto: string): Uint8Array | null {
  const relleno = texto.replace(/-/g, "+").replace(/_/g, "/");
  try {
    const bin = atob(relleno + "=".repeat((4 - (relleno.length % 4)) % 4));
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

export function leerFicha(texto: string): Ficha | null {
  const partes = texto.trim().split(".");
  if (partes.length !== 2) return null;

  const cuerpo = desdeBase64Url(partes[0]);
  if (!cuerpo) return null;

  const conSal = new Uint8Array(SAL.length + cuerpo.length);
  conSal.set(Uint8Array.from(SAL, (c) => c.charCodeAt(0)));
  conSal.set(cuerpo, SAL.length);
  if (suma(conSal) !== partes[1]) return null;

  try {
    const datos = JSON.parse(new TextDecoder().decode(cuerpo)) as Ficha;
    if (datos?.v !== VERSION || !Array.isArray(datos.ok)) return null;
    return datos;
  } catch {
    return null;
  }
}

/** Que le falta a la ficha para desbloquear una mision. */
export function faltantes(exige: string[], listas: string[]): string[] {
  const set = new Set(listas);
  return exige.filter((e) => !set.has(e));
}
