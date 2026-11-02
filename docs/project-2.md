# Understanding Project 2

## The screen depends on state

`useState(0)` creates the current angle and the function that changes it. When `setRotation(30)` updates that state, React recalculates the interface: the slider, the drawing, and the summary all show `30°`.

The page no longer needs to change `innerHTML`, add classes manually, or write to `textContent`. JSX describes what should appear using the current values.

## Components and props

A component is a function that returns JSX. `App` organizes `Header`, `Hero`, `MolecularLab`, `Essentials`, `RnaTypes`, `Sources`, and `Footer`.

`MolecularLab` contains `MoleculeViewer`, `ViewerControls`, `ModelNotes`, `ObservationForm`, and `ObservationList`. `ConceptCard` is repeated inside `Essentials`, and `RnaTypePanel` is repeated inside `RnaTypes`.

A prop gives information to a child component: `rotation={rotation}` passes the angle. Functions can also be passed as props: `onRotationChange={setRotation}` allows the control to request a change from the parent. The child uses the function, but the parent keeps the state.

## Lifted state

Rotation and highlighting live in `MolecularLab` because several components need them. Keeping them separately in the viewer and the slider could cause them to display different values.

`ModelNotes` shows the same angle, and `ObservationForm` indicates which view will be saved. A single source for this data keeps all those parts synchronized.

## Controlled inputs

The textarea receives `value={note}`. Each keystroke triggers `onChange`, which calls `setNote`; the new value then returns to the textarea from React.

The slider works in the same way, but converts the event text into a number with `Number`. Its range is from `-180` to `180` and it supports keyboard changes.

## Saving, filtering, sorting, and deleting

When an observation is saved, the application creates an object with a UUID, trimmed text, the rotation, and the highlighting state at that moment. The saved angle is a copy of the value, so rotating the molecule later does not change the earlier note.

`setObservations((current) => [...current, observation])` creates a new array. React detects that update; using `current.push()` would mutate the previous array and would not express the state change correctly.

`map` creates one list item for each observation. `key={observation.id}` preserves each item's identity even when the order changes; an array index could represent a different note after filtering, deleting, or reversing the list.

The filter calculates a derived list without deleting data. `[...filtered].reverse()` reverses a copy, and `filter()` makes it possible to remove a note without modifying the original array.

Restoring an observation changes the parent's rotation and highlighting state. Deleting a note moves focus to the notebook heading because the button that was pressed disappears.

Notes only live in memory. After a reload, `useState([])` initializes the notebook as empty again; the interface explains this limitation.

## Conditional rendering

When there are no notes, an explanation appears instead of an empty list. When notes exist, sorting and filtering tools appear.

The tabs use `hidden={!active}` to hide panels that are not selected. The menu button and its links also use `hidden` according to the viewport width and the menu state.

## Menu and keyboard support

`menuOpen` indicates whether the mobile links are open, and `isMobile` indicates whether the viewport is 640 pixels wide or less. `matchMedia` reports when the viewport crosses that limit.

Before updating visibility, the event records whether focus was on a link or on the button. After React updates the screen, an effect moves focus to the control that remains visible. This prevents focus from being lost when the previous element is hidden.

`useRef` keeps references to elements so the application can call `focus()`. These references do not replace the state that controls the screen. The effect also removes the listener when the component unmounts.

In the tabs, only the selected tab has `tabIndex={0}`. The others use `-1`; the arrow keys change the selection and focus, while Home and End move to the first or last type. Tab enters the tab group and then continues to the panel.

## The molecule is still from Project 1

The 76 points come from C4' carbons in chain A of `1EHZ.pdb`. `projectStructure` applies the same rotation around the Y axis: it changes `x` and `z`, keeps `y`, centers the result at `320` and `250`, and converts the scale to pixels.

The lines are sorted using the average depth of their endpoints; points use their depth plus `0.1`. Elements in front are drawn later so they appear on top. React renders each line and circle through JSX with a stable key.
