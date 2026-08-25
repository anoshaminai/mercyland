import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Analytics script injection (specs/analytics.md). Kept out of index.html: an `%VITE_UMAMI_SRC%`
// placeholder that never gets substituted ships to the browser verbatim, which requests the
// literal path `/%VITE_UMAMI_SRC%` and makes the dev server throw "URI malformed" on decodeURI.
// Injecting from here means "unset" is simply "no tag", which is what local dev wants.
function umamiScript(env: Record<string, string>): Plugin {
  const src = env.VITE_UMAMI_SRC
  const id = env.VITE_UMAMI_ID
  return {
    name: 'umami-script',
    transformIndexHtml() {
      if (!src || !id) return []
      return [{
        tag: 'script',
        attrs: { defer: true, src, 'data-website-id': id },
        injectTo: 'head' as const,
      }]
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // loadEnv reads .env files AND prefixed vars already on process.env — so Render's
  // dashboard-set VITE_UMAMI_* are picked up the same way a local .env.local would be.
  // ('.' rather than process.cwd(): same directory, no @types/node needed for one call.)
  plugins: [react(), tailwindcss(), umamiScript(loadEnv(mode, '.', 'VITE_'))],
}))
