# Project 3: RNA in 3D · Molecular Notebook

This project preserves the **Project 2** application and will only make the changes required to meet the **Project 3** requirements. The existing content, illustrations, styling, and React structure will remain in place.

## Planned change to Project 2

The application will be updated to meet these requirements:

1. **Real API:** fetch from a public API that does not require OAuth.
2. **Three states for every request:** show a visible loading state, a human-readable error with a retry option, and the received data. The app must never show a blank screen.
3. **Correct `useEffect` usage:** use appropriate dependency arrays, avoid infinite loops, and do not fetch on every keystroke without debouncing or an intentional trigger.
4. **Custom hook:** add a hook such as `useFetch(url)` that returns `data`, `loading`, and `error`.
5. **Search or filtering:** allow users to narrow the already-fetched data from the interface.
6. **Demonstrable error state:** make the error state testable with a broken URL in development or graceful network-error handling.
7. **Netlify:** deploy the application with `npm run build` and `dist`.

A React and Vite application for exploring a real tRNA structure and saving observations about different views. It continues the content, illustrations, and styling from Project 1.

You can rotate the molecule, highlight the anticodon, write a note, save its angle, and restore it later. The notebook also lets you filter, sort, and delete observations. Notes last for the current session; reloading the page clears them.

## Local development

Use Node.js 24 LTS. The project requires at least Node.js 22.12.

```bash
npm ci
npm run dev
```

To create a production build, run `npm run build`. To preview it, run `npm run preview`.

The project was created with `npm create vite@latest -- --template react`.
To verify the molecule formulas and data, run `npm test`.

## Components and state

`App` composes the page. `MolecularLab` coordinates the viewer, controls, model notes, and notebook; each component has its own file.

| Requirement                 | Implementation                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Vite and React              | `src/main.jsx`, `src/App.jsx`, `vite.config.js`, and development and production scripts                               |
| Five components and props   | 14 components in `src/components/`, plus `App`; `MoleculeViewer`, `ViewerControls`, and `ModelNotes` receive props |
| Three independent states    | `rotation`, `highlighted`, and `observations` in `MolecularLab`; other local state handles the menu, tabs, and form  |
| Lists with keys             | Concepts and types use their IDs; notes use a UUID preserved when sorting or filtering                              |
| Conditional rendering       | Empty notes, filtering tools, error messages, hidden tabs, and the responsive menu                                   |
| Controlled input            | The slider, textarea, and filter receive `value` from state and update through `onChange`                            |
| Lifted state                | `MolecularLab` shares the angle and highlight state between the viewer, controls, summary, and form                  |
| Netlify                     | `netlify.toml` configures `npm run build`, `dist`, and Node 24; deployment and the real URL are still pending        |

## Data and files

- `src/components/`: interface components.
- `src/data/`: text and the model's 76 C4′ points.
- `src/utils/projectStructure.js`: projection and depth ordering.
- `src/styles.css`: Project 1 styling, Flexbox, Grid, and small-screen adjustments.
- `public/assets/`: original illustrations and PDB file.
- `tools/build_structure.py`: optional data and SVG regeneration.
- `tests/structure.test.js`: model tests using the Node runner.
- `docs/EXPLICACION.md`: guide for understanding the code.
- `docs/VERIFICACION.md`: results and checks completed before submission.

Python is not required to run or build the application. To regenerate the data, run `python3 tools/build_structure.py`.

## Sources

- [PDB 1EHZ: estructura experimental de tRNA](https://www.rcsb.org/structure/1EHZ)
- [RNA: NHGRI](https://www.genome.gov/genetics-glossary/RNA-Ribonucleic-Acid)
- [From RNA to Protein: NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/NBK26829/)

## Deployment

**Public URL: https://apirea.netlify.app/**
