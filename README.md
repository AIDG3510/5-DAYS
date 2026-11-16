# 5 DAYS

**Una historia sobre lo que se queda.**

Videojuego narrativo de exploración, gestión del tiempo y resolución de acertijos desarrollado con **HTML5 Canvas**, **CSS3** y **JavaScript nativo (ES Modules)**, aplicando control de versiones distribuido con **Git** y **GitHub**.

---

## Historia

> *"Ya está decidido. Nos vamos en cinco días."*

Tras anunciar su madre que deben mudarse de casa en cinco días, el protagonista descubre que a su libro favorito —el que ella le leía antes de dormir— le faltan **10 hojas**. A lo largo de cinco días dentro de la casa, deberá explorar las habitaciones, vigilar el paso del tiempo y combinar objetos cotidianos para recuperar cada página perdida antes de que llegue el momento de partir.

---

## Características Principales

* **Exploración en 4 habitaciones conectadas:** Sala, Cocina, Habitación y Baño con gráficos pixel art dibujados mediante HTML5 Canvas y sistema de colisiones.
* **Sistema de tiempo de 5 días:** Inicia el Día 1 a las `09:00` con avance continuo (`3 minutos` de juego por cada segundo real), ciclo dinámico de día y noche, manipulación del reloj de péndulo y descanso en la cama.
* **Inventario y combinaciones:** Recolección de objetos de la casa y 4 recetas de fabricación (`Cable reparado`, `Imán con cuerda`, `Linterna encendida` y `Pértiga de luz`).
* **10 hojas coleccionables:** Cada hoja requiere cumplir condiciones específicas de exploración, horarios del día o herramientas combinadas.
* **Narrativa y finales múltiples:** Introducción de 9 líneas, comentarios matutinos según el progreso, audio sintetizado con Web Audio API, final bueno al completar el libro y final malo si se agota el quinto día.

---

## Controles

| Tecla | Acción |
| :--- | :--- |
| **`W` `A` `S` `D`** o **Flechas** | Mover al personaje por la casa |
| **`E`** o **`Enter`** | Interactuar con objetos, puertas, personajes y avanzar diálogos |
| **`1` – `9`** | Seleccionar dos objetos del inventario para combinarlos |

---

## Estructura del Proyecto

```text
5_DAYS/
├── index.html          # Estructura principal y pantalla de título
├── styles.css          # Estilos retro pixel art y diseño de interfaz
├── README.md           # Documentación del proyecto
├── .gitignore          # Exclusión de archivos temporales y del sistema
└── JS/
    ├── main.js         # Punto de entrada y transición de pantallas
    ├── game.js         # Bucle principal (requestAnimationFrame) y estados
    ├── player.js       # Movimiento, colisiones y sprite del protagonista
    ├── world.js        # Gestión de habitaciones y renderizado del entorno
    ├── rooms.js        # Diseño pixel art y obstáculos de las 4 habitaciones
    ├── clock.js        # Reloj de 5 días, ciclo día/noche y descanso
    ├── inventory.js    # Gestión de ítems, hojas y recetas de combinación
    ├── interactions.js # Lógica de los 10 acertijos y puntos de interés
    ├── dialogue.js     # Sistema de narrativa, introducción y finales
    └── audio.js        # Efectos de sonido generados con Web Audio API
```

---

## Cómo Ejecutar el Proyecto

1. Clona o descarga este repositorio en tu equipo:
   ```bash
   git clone https://github.com
   ```
2. Abre la carpeta del proyecto en **Visual Studio Code**.
3. Ejecuta `index.html` utilizando la extensión **Live Server** (clic derecho en `index.html` → *Open with Live Server*).
   *(Es necesario ejecutarlo desde un servidor local debido al uso de módulos nativos `type="module"`).*