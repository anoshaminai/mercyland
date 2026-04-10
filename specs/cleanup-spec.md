# Mercy Land Website — Code Cleanup Spec

## Context
This is a React + TypeScript + Vite + Tailwind v4 band website. The codebase has accumulated dead files, unused code, and leftover boilerplate from the Vite template. Clean it up without changing any visible behavior.

## Tasks

### 1. Delete dead files
- `src/pages/WatchPage_vid under.tsx` — unused alternate layout, not imported anywhere
- `src/prompts/screenshot-to-code.md` — empty file, no purpose
- `src/assets/react.svg` — default Vite/React template asset, unused
- `public/vite.svg` — default Vite favicon, replace usage in `index.html` or remove
- `tailwind.config.js` — entirely commented out; project uses Tailwind v4 via `@tailwindcss/vite` plugin, this file does nothing

### 2. Clean up `src/styles/App.css`
- The `#root`, `.logo`, `.logo.react`, `@keyframes logo-spin`, `.card`, `.read-the-docs` rules are all leftover Vite boilerplate — delete them
- Keep only the `.app` rule (used by `App.tsx`)

### 3. Remove unused global type declaration in `src/components/Home.tsx`
- Delete the `declare global { interface Window { LayloSDK: any; } }` block — `LayloSDK` is never referenced anywhere in the project

### 4. Clean up `index.html`
- The favicon link points to `/vite.svg`.
  - Remove the `<link rel="icon">` line entirely so no broken reference remains
- Title is already "Mercy Land" — that's correct, leave it

### 5. Clean up `src/styles/index.css`
- Remove the commented-out duplicate font import: `/* @import url('https://fonts.googleapis.com/css2?family=MedievalSharp&display=swap'); */`
- Remove the commented-out font feature/variation settings block inside the first `@theme` rule

### 6. Remove commented-out JSX in components
- `src/components/Header.tsx` — remove the commented-out `<NavLink to="/shows">` and `<NavLink to="/shop">` lines
- `src/pages/InfoPage.tsx` — remove the commented-out `<h2>About Us</h2>` line
- `src/pages/ListenPage.tsx` — remove the entire commented-out Apple Music `<iframe>` block
- `src/styles/Header.css` — remove the commented-out `/* text-decoration: none; font-size: 1.2rem; font-weight: 500; USE THESE TO MAKE THE FONT BIGGER */` block

### 7. Simplify unused imports
- `src/components/Home.tsx` imports `React` — not needed in React 19 with the `react-jsx` transform. Remove the import if no other React API (e.g., `useState`) is used in the file. Apply the same to any other files that import `React` only for JSX (check `Header.tsx`, `Logo.tsx`, `EmailSignup.tsx`, `InfoPage.tsx`, `ListenPage.tsx`, `WatchPage.tsx`).

## Rules
- Do NOT change any visible UI behavior
- Do NOT restructure components or move files around (that's a separate task)
- Do NOT modify `package.json` dependencies
- Run `npm run build` after changes to confirm nothing breaks
- If `public/vite.svg` is deleted, make sure nothing still references it
