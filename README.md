# Nonograms Game

Este proyecto es una implementación del clásico juego de Nonograms, también conocido como Picross o Griddlers. El juego consiste en llenar una cuadrícula de acuerdo con pistas numéricas que indican cuántas celdas deben ser llenadas en cada fila y columna.

## Estructura del Proyecto

El proyecto tiene la siguiente estructura de archivos:

```
nonograms-game
├── src
│   ├── main.js       # Punto de entrada de la aplicación
│   ├── game.js       # Lógica del juego
│   └── utils.js      # Funciones utilitarias
├── index.html        # Estructura básica del documento HTML
├── style.css         # Estilos para el juego
└── README.md         # Documentación del proyecto
```

## Instrucciones para Jugar

1. Abre el archivo `index.html` en un navegador web.
2. La cuadrícula del Nonogram se generará automáticamente.
3. Haz clic en las celdas para llenarlas. Las celdas llenas se marcarán visualmente.
4. Utiliza las pistas en los bordes para resolver el rompecabezas.
5. El juego finalizará cuando todas las celdas correctas estén llenas.

## Requisitos

- Un navegador web moderno que soporte JavaScript.
- Conexión a Internet para cargar fuentes y estilos desde Google Fonts.

## Detalles de Implementación

- **main.js**: Inicializa el juego y maneja los eventos de clic.
- **game.js**: Contiene la clase `Game` que gestiona la lógica del juego, incluyendo la verificación de la solución.
- **utils.js**: Proporciona funciones para crear la cuadrícula y generar pistas.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el juego o agregar nuevas características, siéntete libre de hacer un fork del repositorio y enviar un pull request.