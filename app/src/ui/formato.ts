/**
 * `objetivo = 5` en vez de `5`.
 *
 * El nombre es lo que conecta la prueba con el codigo: sin el, un jugador ve
 * un numero suelto y no sabe que variable tiene que usar. Un jugador real
 * escribio una condicion con el numero fijo por esto mismo.
 */
export function describeEntrada(entrada: Record<string, unknown>): string {
  return Object.entries(entrada)
    .map(([nombre, valor]) => `${nombre} = ${JSON.stringify(valor)}`)
    .join(", ");
}
