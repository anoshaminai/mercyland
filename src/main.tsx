import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import './lib/gltf-setup'

// Dev-only: run the world validator (orphans, broken links, reachability, missing crops)
// on every dev boot so scenes.data.ts stays honest. Never ships to production. (BUILD.md §1)
if (import.meta.env.DEV) {
  Promise.all([
    import('./data/scenes.data'),
    import('./lib/validate-world'),
  ]).then(([{ world }, { reportWorld }]) => reportWorld(world))
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
