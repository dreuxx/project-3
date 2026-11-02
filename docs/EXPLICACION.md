# Entender el proyecto 2

## La pantalla depende del estado

`useState(0)` crea el ángulo actual y la función que lo cambia. Cuando `setRotation(30)` actualiza ese estado, React vuelve a calcular la interfaz: el slider, el dibujo y el resumen muestran 30°.

La página ya no necesita cambiar `innerHTML`, añadir clases manualmente o escribir en `textContent`. El JSX describe qué debe aparecer con los valores actuales.

## Componentes y props

Un componente es una función que devuelve JSX. `App` organiza `Header`, `Hero`, `MolecularLab`, `Essentials`, `RnaTypes`, `Sources` y `Footer`.

Dentro de `MolecularLab` están `MoleculeViewer`, `ViewerControls`, `ModelNotes`, `ObservationForm` y `ObservationList`. `ConceptCard` se repite en `Essentials`; `RnaTypePanel` se repite en `RnaTypes`.

Una prop entrega información a un hijo: `rotation={rotation}` le pasa el ángulo. También se pasan funciones: `onRotationChange={setRotation}` permite que el control pida un cambio al padre. El hijo utiliza la función, pero el padre conserva el estado.

## Estado elevado

La rotación y el resaltado viven en `MolecularLab` porque los necesitan varios componentes. Guardarlos por separado en el visor y en el slider podría hacer que mostraran valores diferentes.

`ModelNotes` muestra el mismo ángulo, y `ObservationForm` indica qué vista guardará. Una única fuente de esos datos mantiene sincronizadas todas esas partes.

## Inputs controlados

El textarea recibe `value={note}`. Cada escritura dispara `onChange`, que llama a `setNote`; el nuevo valor vuelve al textarea desde React.

El slider funciona de la misma manera, pero convierte el texto del evento a número con `Number`. Su rango va de −180 a 180 y permite cambios con el teclado.

## Guardar, filtrar, ordenar y eliminar

Al guardar se crea una observación con un UUID, el texto sin espacios extremos, la rotación y el resaltado de ese momento. El ángulo guardado es una copia del valor, por lo que girar después no cambia la nota anterior.

`setObservations((current) => [...current, observation])` crea un array nuevo. React detecta esa actualización; usar `current.push()` mutaría el anterior y no expresa correctamente el cambio de estado.

`map` crea un elemento de lista por observación. `key={observation.id}` conserva la identidad aunque cambie el orden; un índice podría representar otra nota después de filtrar, eliminar o invertir la lista.

El filtro calcula una lista derivada sin borrar datos. `[...filtered].reverse()` invierte una copia; `filter()` permite eliminar una nota sin modificar el array original.

Restaurar una observación cambia la rotación y el resaltado del padre. Borrar una nota mueve el foco al título del cuaderno porque el botón pulsado desaparece.

Las notas solo viven en memoria. Al recargar, `useState([])` vuelve a iniciar el cuaderno vacío; la interfaz explica esta limitación.

## Renderizado condicional

Si no hay notas aparece una explicación en lugar de una lista vacía. Si hay notas aparecen las herramientas de orden y filtro.

Las pestañas tienen `hidden={!active}` para ocultar los paneles no seleccionados. El botón del menú y sus enlaces también usan `hidden` según el ancho y el estado del menú.

## Menú y teclado

`menuOpen` indica si los enlaces móviles están abiertos e `isMobile` indica si el ancho es de 640 px o menos. `matchMedia` avisa cuando se cruza ese límite.

Antes de actualizar la visibilidad, el evento recuerda si el foco estaba en un enlace o en el botón. Después de que React actualiza la pantalla, un efecto mueve el foco al control que sigue visible; esto evita perderlo cuando el elemento anterior se oculta.

`useRef` conserva referencias a elementos para llamar a `focus()`. Estas referencias no sustituyen el estado que controla la pantalla. El efecto también retira el listener cuando el componente se desmonta.

En las pestañas solo la seleccionada tiene `tabIndex={0}`. Las demás usan −1, las flechas cambian la selección y el foco, y Home/End van al primer o último tipo; Tab entra al grupo y después continúa hacia el panel.

## La molécula sigue siendo la del proyecto 1

Los 76 puntos proceden de carbonos C4′ de la cadena A de `1EHZ.pdb`. `projectStructure` aplica la misma rotación alrededor de Y: cambia `x` y `z`, conserva `y`, centra con 320 y 250 y convierte la escala a píxeles.

Las líneas se ordenan por el promedio de la profundidad de sus extremos; los puntos usan su profundidad más 0.1. Los elementos del frente se dibujan después para que queden encima; React representa cada línea y círculo mediante JSX con una clave estable.

Referencias para estudiar:

- [Compartir estado entre componentes](https://react.dev/learn/sharing-state-between-components)
- [Estado: memoria de un componente](https://react.dev/learn/state-a-components-memory)
- [Listas en React](https://react.dev/learn/rendering-lists)
- [Inicio con Vite](https://vite.dev/guide/)
