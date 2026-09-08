/**
 * De donde sale el comprobador que se instala en el Sector 00.
 *
 * El paquete no esta en PyPI, asi que `pip install sector-cero` no funciona
 * todavia. En vez de mandar al jugador a clonar el repositorio -- que en la
 * mision 01 es imposible, porque Git no se instala hasta la 05 -- publicamos
 * la rueda junto al sitio: es un archivo mas dentro de app/dist, y pip sabe
 * instalar desde una URL https sin ninguna herramienta extra.
 *
 * VERSION tiene que coincidir con la de cli/pyproject.toml. No es un deseo:
 * instalacion.test.ts lee el pyproject y falla si se separan, porque una URL
 * desfasada apunta a un archivo que ya no existe y rompe la primera mision
 * del juego.
 */
export const VERSION_CLI = "0.1.0";

/** El nombre que hatchling le da a la rueda. */
export const RUEDA_CLI = `sector_cero-${VERSION_CLI}-py3-none-any.whl`;

export const URL_RUEDA_CLI = `https://alexander123mata-code.github.io/sector-cero/${RUEDA_CLI}`;

export const ORDEN_INSTALAR_CLI = `pip install ${URL_RUEDA_CLI}`;
