# Mercyland

## Project Overview
A website for the band **Mercy Land**, built around two core experiences:
1. **The Void** — a 3D space where objects (images, 3D models) float in and out. Objects are clickable, leading to videos, music, links. Also has a "flat" traditional 2D view.
2. **Chat World** — a similar 3D floating-object space, but the objects are messages from the band to visitors. Requires login (email) to access. Objects open to reveal images, video embeds, or text messages.

Both experiences share the same 3D engine but serve different content types. The Void is public-facing. Chat World is gated.

This is a personal/creative project. Prioritize interesting design, experimentation, and novel UI over convention. Move fast. The site should feel like the band, not a template.

## Milestones
1. **Void + Flat View + Deploy** — the public-facing site is live with both view modes
2. **Chat World** — the gated messaging experience, added to the live site

## Current State
The project already has a working React + TS + Vite + Tailwind v4 codebase with:
- **Routing**: React Router with `/` (info), `/listen`, `/watch` pages
- **Email collection**: Working via Formspree (form ID `mldnjygq`)
- **Embeds**: Spotify, SoundCloud, Bandcamp, YouTube already integrated
- **Styling**: Tailwind v4 via `@tailwindcss/vite` plugin (NOT the old config-file approach)
- **Fonts**: Roboto Mono (primary), MedievalSharp (secondary) via Google Fonts
- **Framer Motion**: Installed but lightly used
- **Deployment**: Netlify-ready (`public/_redirects` exists)
- **Real content**: Band logo, album art, band photos, embedded players, YouTube video

### Existing color palette (defined in `src/styles/index.css` as `@theme` values):
```
--color-mercy-red: #FF0000
--color-mercy-green: #16fd05
--color-mercy-black: #000000
--color-mercy-white: #FFFFFF
--color-mercy-blue: #071bf9
--color-mercy-pink: #ff00ff
```

### What does NOT exist yet:
- Three.js / React Three Fiber (not installed)
- Any 3D rendering
- Backend / API
- Auth system
- Database
- Admin/content management

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite 6
- **3D Engine**: React Three Fiber (R3F) + @react-three/drei *(to be added)*
- **Styling**: Tailwind CSS v4 (via `@tailwindcss/vite` plugin) + CSS files for complex styles
- **Routing**: React Router v7
- **Animation**: Framer Motion (already installed)
- **Email Collection**: Formspree (already working)
- **Deployment**: Netlify for frontend *(already configured)*
- **Backend** *(Milestone 2)*: Node.js + Express, separate project
- **Database** *(Milestone 2)*: TBD — SQLite/Postgres/Turso
- **Auth** *(Milestone 2)*: Email magic link
- **File Storage** *(Milestone 2)*: TBD — local disk / S3 / Cloudflare R2

## Architecture

### Frontend Structure
```
src/
  components/
    void/              # Void-specific components
      floating-object.tsx    # Single floating object in 3D space
      void-scene.tsx         # R3F Canvas + scene setup for Void
      object-detail.tsx      # Modal/overlay when object is clicked
    chat-world/        # Chat World-specific components (Milestone 2)
      chat-scene.tsx
      message-object.tsx
      message-detail.tsx
    shared/            # Shared between Void and Chat World
      floating-engine.tsx    # Core 3D floating/drifting physics
      scene-controls.tsx     # Camera, lighting, fog, common scene setup
      clickable-object.tsx   # Wrapper for raycast click detection
    flat/              # Flat view components
      flat-layout.tsx        # Traditional 2D band page layout
      section-nav.tsx        # Jump-to-section navigation
    auth/              # Auth flow components (Milestone 2)
      login-gate.tsx
    ui/                # Generic UI primitives + existing components
      modal.tsx
      video-embed.tsx
      nav-bar.tsx
      EmailSignup.tsx        # EXISTING — Formspree email form
      Logo.tsx               # EXISTING — band logo display
  pages/
    void-page.tsx            # /void or / (depending on default toggle)
    flat-page.tsx            # /flat
    chat-world-page.tsx      # /chat-world (Milestone 2, gated)
  hooks/
    use-floating-physics.ts  # Animation loop for drifting objects
    use-viewport-toggle.ts   # 3D ↔ flat view switching
    use-auth.ts              # Auth state management (Milestone 2)
  data/
    void-objects.ts          # Hardcoded void content (before backend exists)
    media.ts                 # Song/video data extracted from current pages
  lib/
    api.ts                   # Backend API client (Milestone 2)
    config.ts                # View defaults, feature flags
  types/
    void.ts                  # VoidObject, ObjectType, etc.
    chat.ts                  # Message, ChatSession, etc. (Milestone 2)
  assets/
    images/                  # EXISTING — temp_logo.png, touching.jpg, Kid A cover art.jpg
    models/                  # .glb/.gltf 3D models (to be added)
    fonts/
  styles/
    index.css                # EXISTING — Tailwind imports, @theme colors/fonts
    Header.css               # EXISTING — nav styles
    App.css                  # EXISTING — minimal app styles
```

### Backend Structure (Milestone 2 — separate Node project)
```
src/
  routes/
    auth.ts           # Magic link send + verify
    void-objects.ts    # CRUD for void objects (admin)
    messages.ts        # CRUD for chat world messages (admin)
  middleware/
    auth.ts            # JWT/session verification
    admin.ts           # Admin-only routes
  db/
    schema.ts
    migrations/
```

### Key Data Models
```
VoidObject {
  id, type (image|model|link),
  content_url, click_action (navigate|embed|external),
  click_target, label,
  position_hint (loose zone preference, not exact coords),
  scale, active (boolean)
}

ChatMessage {
  id, type (text|image|video),
  content (text body or media url),
  title, created_at, active
}

Visitor {
  id, email, first_seen, last_seen
}
```

### Shared 3D Engine Concept
The Void and Chat World both use the same floating physics engine:
- Objects spawn at random positions within a defined volume
- They drift slowly (sinusoidal motion + slight randomness)
- Objects fade in when entering a "near zone" and fade out when drifting far
- Click detection via R3F raycasting
- Camera can orbit (drag) and zoom (scroll)
- Performance: instancing for many objects, LOD if needed, frustum culling

The difference is content source (void objects vs chat messages) and access control (public vs gated).

## View Modes
- **3D View (default or alternate)**: The floating objects experience. Used for both Void and Chat World.
- **Flat View**: Traditional 2D single-page layout. Sections: Music, Videos, Shows, About, Links. Sticky section nav for jumping between sections. Only applies to the Void content — Chat World is 3D only.
- **Default toggle**: A config value (stored in localStorage) determines whether `/` routes to Void-3D or Void-Flat. The other is always accessible via a toggle button in the nav.

## Code Conventions
- Functional components only, no class components
- Named exports for components
- Co-locate component-specific types with their components
- Shared types in `src/types/`
- File naming: kebab-case for files, PascalCase for components
- Keep R3F components separate from DOM components — don't mix Canvas children with HTML
- Use drei helpers (Html, Float, OrbitControls) before writing custom equivalents
- Tailwind v4 uses `@theme` in CSS for config — NOT `tailwind.config.js`
- `React` import not needed for JSX (React 19 + react-jsx transform)

## Session Guidelines
- **One feature per session.** Don't try to build the whole Void + Chat World in one go.
- **Commit working code** before moving to the next feature.
- **Start with visuals.** Get something on screen fast, then refine.
- **Use subagents** (Task tool) for contained subtasks: researching a Three.js technique, generating a utility function, writing types. Keep the main session focused on integration.
- **When context gets heavy** (long session, lots of back-and-forth): wrap up, commit, start fresh.
- **Don't over-plan.** Build → look at it → iterate. The 3D feel will come from experimentation, not specs.
- **Check your work.** Write code, then verify it against specs. Simplify code, then verify it against specs.

## Design Direction
- **Band**: Mercy Land — dark, intense, experimental
- **Color palette**: Already established — black base, vivid red, neon green, electric blue, hot pink. High contrast, no subtlety.
- **Typography**: Roboto Mono (technical/cold) + MedievalSharp (archaic/mystical). Keep this pairing.
- **Void feel**: TBD — establish during Phase 1 experimentation
- **Reference points**: TBD — add during design session

## Ideas / Parking Lot
- Audio visualizer that reacts to playing music
- Void objects that respond to audio frequency
- Particle effects in the void background
- Cursor trail effects
- Easter eggs / hidden objects in the void
- Mobile: touch gestures for 3D navigation
- Ambient sound in the void
- Object physics — objects gently repel each other or the cursor
- Chat World: let visitors leave reactions on messages
- Analytics: which objects get clicked most
- Quiz on the void (band trivia? personality quiz? absurdist?)
