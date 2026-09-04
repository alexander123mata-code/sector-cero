# sector-cero

El puente entre el navegador y tu maquina.

El Sector 00 de [Sector Cero](https://github.com/alexander123mata-code/sector-cero)
no se juega en una pestana: se juega montando tu entorno de verdad. Este
comando mira que tienes ya listo y te da una ficha para pegar en el juego.

```bash
pip install sector-cero
sector verify
```

No hace falta que todo pase. La ficha recoge lo que si esta listo, y cada
mision del Sector 00 pide solo lo suyo.

## Que mira

Python y su version, que la terminal lo encuentre, pip, si tienes un entorno
virtual activo, Git y su identidad, si estas dentro de un repositorio, si has
hecho algun commit, y si VS Code responde desde la terminal.

Cuando algo falta, te dice como arreglarlo.

## Sobre la ficha

No es un mecanismo antifraude, y no pretende serlo: el juego no tiene
servidor, asi que la ficha se puede fabricar a mano. La suma de control solo
comprueba que el pegado llego entero. Saltarse el Sector 00 es facil; el unico
perjudicado es quien lo haga.
