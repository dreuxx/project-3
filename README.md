# Project 3: Project 2 Enhancement

## Goal

This project starts from **Project 2**. The only planned change is to adapt that project so it satisfies the **Project 3** requirements, while preserving its existing React structure, content, and design.

## Project 2 change required for Project 3

The Project 2 application will be updated to:

1. **Use a real public API:** fetch data from a public API that does not require an OAuth flow.
2. **Implement the three-states pattern everywhere:** every fetch will show a visible loading state, a human-readable error state with a retry option, and a data state. The app must never show a blank screen while a request is pending or has failed.
3. **Use `useEffect` correctly:** requests will use correct dependency arrays, avoid infinite loops, and will not run on every keystroke unless a deliberate trigger or debounce is used.
4. **Add a custom hook:** include a hook such as `useFetch(url)` that returns `data`, `loading`, and `error`.
5. **Add search or filtering:** allow users to narrow the already-fetched data on the client.
6. **Make the error state demonstrable:** include a development-only broken URL toggle, or otherwise make graceful network-error handling easy to test.
7. **Deploy on Netlify:** keep the Netlify deployment configured with `npm run build` as the build command and `dist` as the publish directory.

The existing Project 2 requirements remain in place:

1. **Vite + React:** use a Vite-scaffolded project. Both the development server and the production build must work correctly.
2. **Components:** create at least five components in separate files and organize them into a sensible component tree. At least two components must receive and use `props`.
3. **State:** implement at least three independent pieces of `useState` that produce visible changes on screen.
4. **Lists and keys:** render at least one collection with `map` and use a stable, appropriate `key`, rather than the array index when items can be reordered.
5. **Conditional rendering:** show, hide, or change part of the interface based on application state.
6. **Controlled input:** include at least one form field whose value lives in React state and updates through `onChange`.
7. **Lifted state:** share at least one piece of state between two components through a common parent.
8. **Netlify:** deploy the application to Netlify with the following configuration:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

## Existing Project 2 foundation

- Migrate the existing HTML entry point and logic into a React application structure.
- Configure `package.json` and Vite with the `dev`, `build`, and `preview` scripts.
- Separate the interface into five or more reusable components in their own files.
- Convert the existing interactions to React state with `useState`, including a controlled input and conditional views.
- Preserve the content and responsive design from Project 1 while adapting the styles to work with React components.
- Verify the production build and deploy the application to Netlify using `dist` as the publish directory.

## Local development

Install the dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

To check the production build:

```bash
npm run build
npm run preview
```

The application will be available at the local URL shown by Vite, usually `http://localhost:5173/`.

## Deployment

The project is deployed on Netlify with:

```text
Build command: npm run build
Publish directory: dist
```

**Public URL:** https://project2-react1.netlify.app/
