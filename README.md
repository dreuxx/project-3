# Project 3: RNA in 3D · Molecular Notebook

Este proyecto conserva la aplicación de **Project 2** y solo realizará los cambios necesarios para cumplir los requisitos de **Project 3**. Se mantendrán el contenido, las ilustraciones, el estilo y la estructura actual de React.

## Cambio previsto sobre Project 2

La aplicación se actualizará para cumplir estos requisitos:

1. **API real:** consultar una API pública que no requiera OAuth.
2. **Tres estados en cada consulta:** mostrar una carga visible, un error entendible con opción de reintentar y los datos recibidos. Nunca debe quedar una pantalla en blanco.
3. **`useEffect` correcto:** usar arrays de dependencias adecuados, evitar bucles infinitos y no consultar en cada pulsación sin debounce o una acción intencional.
4. **Hook personalizado:** incorporar un hook como `useFetch(url)` que devuelva `data`, `loading` y `error`.
5. **Búsqueda o filtro:** permitir reducir los datos ya cargados desde la interfaz.
6. **Error demostrable:** permitir probar el estado de error con una URL rota en desarrollo o mediante el manejo de una caída de red.
7. **Netlify:** publicar la aplicación con `npm run build` y `dist`.

Aplicación de React y Vite para explorar una estructura real de tRNA y guardar observaciones sobre distintas vistas. Continúa el contenido, las ilustraciones y el estilo del proyecto 1.

Puedes rotar la molécula, resaltar el anticodón, escribir una nota, guardar su ángulo y restaurarlo después. El cuaderno también permite filtrar, ordenar y eliminar las observaciones. Las notas duran durante la sesión: recargar la página las borra.

## Desarrollo local

Usa Node.js 24 LTS. El mínimo del proyecto es Node.js 22.12.

```bash
npm ci
npm run dev
```

Para generar producción: `npm run build`. Para verla: `npm run preview`.

La base se creó con `npm create vite@latest -- --template react`.
Para comprobar las fórmulas y los datos de la molécula: `npm test`.

## Componentes y estado

`App` compone la página. `MolecularLab` coordina el visor, los controles, las notas del modelo y el cuaderno; cada componente tiene su propio archivo.

| Requisito                   | Implementación                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Vite y React                | `src/main.jsx`, `src/App.jsx`, `vite.config.js` y scripts de desarrollo y producción                                  |
| Cinco componentes y props   | 14 componentes en `src/components/`, además de `App`; `MoleculeViewer`, `ViewerControls` y `ModelNotes` reciben props |
| Tres estados independientes | `rotation`, `highlighted` y `observations` en `MolecularLab`; otros estados locales para menú, pestañas y formulario  |
| Listas con claves           | Conceptos y tipos usan sus IDs; las notas usan un UUID que se conserva al ordenar o filtrar                           |
| Renderizado condicional     | Notas vacías, herramientas de filtrado, mensajes de error, pestañas ocultas y menú adaptable                          |
| Input controlado            | Slider, textarea y filtro reciben `value` desde estado y actualizan mediante `onChange`                               |
| Estado elevado              | `MolecularLab` comparte ángulo y resaltado entre visor, controles, resumen y formulario                               |
| Netlify                     | `netlify.toml` configura `npm run build`, `dist` y Node 24; falta publicar y añadir la URL real                       |

## Datos y archivos

- `src/components/`: piezas de la interfaz.
- `src/data/`: textos y los 76 puntos C4′ del modelo.
- `src/utils/projectStructure.js`: proyección y orden de profundidad.
- `src/styles.css`: estilo del proyecto 1, Flexbox, Grid y ajustes para pantallas pequeñas.
- `public/assets/`: ilustraciones originales y archivo PDB.
- `tools/build_structure.py`: regeneración opcional de los datos y SVG.
- `tests/structure.test.js`: pruebas del modelo con el runner de Node.
- `docs/EXPLICACION.md`: guía en español para entender el código.
- `docs/VERIFICACION.md`: resultados y comprobaciones antes de entregar.

Python no es necesario para ejecutar ni compilar la aplicación. Para regenerar los datos: `python3 tools/build_structure.py`.

## Fuentes

- [PDB 1EHZ: estructura experimental de tRNA](https://www.rcsb.org/structure/1EHZ)
- [RNA: NHGRI](https://www.genome.gov/genetics-glossary/RNA-Ribonucleic-Acid)
- [From RNA to Protein: NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/NBK26829/)

## Publicación

**URL pública: pendiente.**
