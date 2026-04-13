# TASKS.md — Mercyland Website

## How to use this file
Each phase is one or two Claude Code sessions. Work top to bottom.
Check off tasks as you complete them. Commit after each phase.

**Milestone 1**: Phases 0–5 → Void + Flat View live on the internet
**Milestone 2**: Phases 6–8 → Chat World added to the live site

---

# MILESTONE 1: The Void (public site)

## Phase 0: Code Cleanup + Data Extraction
**Goal**: Clean up the existing codebase. Extract content into data files.
**Estimate**: 2-3 hours

### 0A: Cleanup
- [ ] Delete dead files:
  - `src/pages/WatchPage_vid under.tsx` (unused alternate layout)
  - `src/prompts/screenshot-to-code.md` (empty)
  - `src/assets/react.svg` (Vite template leftover)
  - `public/vite.svg` (Vite template favicon)
  - `tailwind.config.js` (entirely commented out, Tailwind v4 uses `@tailwindcss/vite`)
- [ ] Clean `src/styles/App.css` — delete all Vite boilerplate rules (`#root`, `.logo`, `.card`, `.read-the-docs`, `@keyframes logo-spin`), keep only `.app`
- [ ] Remove `declare global { interface Window { LayloSDK: any; } }` from `src/components/Home.tsx`
- [ ] Remove or replace broken favicon link in `index.html` (points to deleted `vite.svg`)
- [ ] Remove commented-out code:
  - Duplicate font import in `src/styles/index.css`
  - Font feature/variation settings block in `src/styles/index.css`
  - NavLink stubs in `src/components/Header.tsx`
  - `<h2>About Us</h2>` in `src/pages/InfoPage.tsx`
  - Apple Music iframe block in `src/pages/ListenPage.tsx`
  - CSS comments in `src/styles/Header.css`
- [ ] Remove unnecessary `import React from 'react'` in files that only use JSX (React 19 doesn't need it)
- [ ] Run `npm run build` to confirm nothing breaks
- [ ] Commit: `"cleanup: remove dead files and boilerplate"`

### 0B: Extract content into data files
- [x] Create `src/data/media.ts` — extract all song/album data from ListenPage into a typed array:
  ```ts
  type Song = { id: string; title: string; albumArt?: string; spotifyEmbed?: string; soundcloudEmbed?: string; bandcampEmbed?: string; appleMusicEmbed?: string; }
  ```
- [x] Create `src/data/videos.ts` — extract video data from WatchPage into a typed array:
  ```ts
  type Video = { id: string; title: string; description: string; youtubeId: string; }
  ```
- [x] Update ListenPage and WatchPage to render from these data files instead of hardcoded JSX
- [x] Verify adding a new song/video is now just adding an object to the array
- [x] Commit: `"extract media content into data files"`

---

## Phase 1: Floating Engine
**Goal**: Objects float in 3D space. You can look around. Clicking does nothing yet.
**Estimate**: 6-10 hours (mostly iteration on feel)

- [ ] Install 3D deps: `@react-three/fiber`, `@react-three/drei`, `three`, `@types/three`
- [ ] Build `src/components/shared/floating-engine.tsx` — the R3F scene that renders objects drifting in space
  - Sinusoidal drift motion with randomized offsets per object
  - Objects fade in/out based on distance from camera
  - Fog or depth-of-field to create depth
- [ ] Build `src/components/shared/clickable-object.tsx` — wrapper with hover highlight + raycasting
- [ ] Build `src/components/shared/scene-controls.tsx` — OrbitControls, lighting, background
- [ ] Test with 15-20 placeholder cubes/spheres floating around
- [ ] Get camera orbit (drag) and zoom (scroll) feeling good
- [ ] Test on mobile — touch drag for orbit, pinch for zoom
- [ ] **[ITERATE IN CLAUDE CODE]**: Experiment with motion feel:
  - "The objects are moving too fast / too uniform / too predictable. Make the motion feel more [organic / dreamy / unsettling]. Add slight rotation drift."
  - Iterate until the vibe is right.
- [ ] Commit: `"floating engine v1"`

---

## Phase 2: The Void — Static Content
**Goal**: The Void page renders real content. Clicking objects does something.
**Estimate**: 3-4 hours

- [ ] Define `VoidObject` type in `src/types/void.ts`
- [ ] Create `src/data/void-objects.ts` — hardcoded array of void objects, pulling from existing media data. Mix of:
  - Band images (already have `touching.jpg`, `temp_logo.png`, `Kid A cover art.jpg`)
  - Music links (Spotify/Bandcamp/SoundCloud embeds from `src/data/media.ts`)
  - Video (YouTube embed from `src/data/videos.ts`)
  - Placeholder 3D models (simple geometries if no .glb files yet)
- [ ] Build `src/components/void/floating-object.tsx` — renders a VoidObject as either:
  - A plane with an image texture (for 2D images)
  - A loaded .glb model (for 3D objects)
  - A stylized shape with a label (for links)
- [ ] Build `src/components/void/object-detail.tsx` — modal/overlay when an object is clicked:
  - Type "video" → embedded video player
  - Type "link" → external link
  - Type "music" → embedded Spotify/Bandcamp/SoundCloud player
  - Type "image" → full-screen image view
- [ ] Build `src/pages/void-page.tsx` at route `/void`
- [ ] Wire up click: object → detail overlay
- [ ] Add at least 5 real objects with real content
- [ ] Commit: `"void with static content"`

---

## Phase 3: The Flat View + View Toggle
**Goal**: Same content as the Void, but as a traditional 2D page. Toggle between views.
**Estimate**: 3-4 hours

- [ ] Build `src/components/flat/flat-layout.tsx` — single scrollable page with sections:
  - Music (embed players — reuse existing embed patterns from ListenPage)
  - Videos (YouTube embeds — reuse from WatchPage)
  - About / Bio (content from InfoPage)
  - Shows / Tour dates (placeholder section for now)
  - Links / Socials (placeholder section for now)
  - Email signup (reuse existing `EmailSignup` component)
- [ ] Build `src/components/flat/section-nav.tsx` — sticky nav that jumps between sections
- [ ] The flat view reads from the same data sources as the Void (`src/data/media.ts`, `src/data/videos.ts`, `src/data/void-objects.ts`)
- [ ] Build view toggle:
  - Button in header: "Enter the Void" ↔ "Flat View"
  - Stores preference in localStorage
  - `/` routes to whichever is the current default
  - `/void` always goes to 3D, `/flat` always goes to 2D
- [ ] Update routing in `App.tsx`:
  - Remove old `/listen`, `/watch` routes (content lives in flat view sections now)
  - Add `/void`, `/flat` routes
  - `/` redirects based on stored preference
- [ ] Remove old page files once flat view replaces them: `InfoPage.tsx`, `ListenPage.tsx`, `WatchPage.tsx`
- [ ] **[ITERATE IN CLAUDE CODE]**: Style the flat view:
  - "Make this flat page feel cohesive with the void aesthetic. Same colors (mercy-red, mercy-green, mercy-black, mercy-pink), same fonts (Roboto Mono, MedievalSharp), but laid out traditionally."
- [ ] Commit: `"flat view + view toggle"`

---

## Phase 4: Polish
**Goal**: Both views are solid, performant, and mobile-ready.
**Estimate**: 3-4 hours

- [ ] Performance: lazy load 3D models, texture compression, instancing if needed
- [ ] Mobile: verify touch controls for 3D (pinch zoom, swipe orbit), responsive flat view
- [ ] Loading states: what does the void look like while objects are loading? (spinner? fade-in? particles?)
- [ ] Transitions: animate between void ↔ flat view, use Framer Motion (already installed)
- [ ] SEO / meta tags (especially for the flat view — Open Graph, Twitter card)
- [ ] Custom band favicon
- [ ] Error states: what happens if an embed fails to load?
- [ ] Update `public/_redirects` for new routes (Netlify SPA catch-all)
- [ ] Commit: `"polish: performance, mobile, loading states"`

---

## Phase 5: Deploy Milestone 1
**Goal**: The Void + Flat View are live on the internet.
**Estimate**: 1-2 hours

- [ ] Run `npm run build` — fix any build errors
- [ ] Test production build locally: `npm run preview`
- [ ] Verify all routes work with Netlify's SPA redirect (`/* → /index.html 200`)
- [ ] Push to GitHub
- [ ] Deploy to Netlify (already configured — should auto-deploy from push)
- [ ] Test live site: both views, all embeds, mobile, view toggle persistence
- [ ] Fix anything broken in production that worked locally
- [ ] Commit any fixes: `"deploy fixes"`
- [ ] **🎉 Milestone 1 complete — Void is live**

---

# MILESTONE 2: Chat World

## Phase 6: Backend + Auth
**Goal**: Node backend runs. Email magic link auth works. Visitors table exists.
**Estimate**: 4-6 hours

- [ ] **[DECIDE]** Database choice: SQLite (simplest), Turso (SQLite but hosted), or Postgres
- [ ] **[DECIDE]** File storage: local disk for now, or S3/R2 from the start?
- [ ] **[DECIDE]** Email provider for magic links: Resend, SendGrid, or Mailgun
- [ ] Set up Express server in a separate project/directory inside the VM
- [ ] Create DB schema: visitors table (id, email, first_seen, last_seen)
- [ ] Build auth flow:
  - POST /auth/send-link — takes email, sends magic link
  - GET /auth/verify — verifies token from magic link, creates session
- [ ] Build `src/components/auth/login-gate.tsx` on frontend — email input, "send me a link" flow
- [ ] Build `src/hooks/use-auth.ts` hook — manages session state, protected routes
- [ ] Test end to end: enter email → get link → click link → authenticated
- [ ] Commit: `"backend + magic link auth"`

---

## Phase 7: Chat World
**Goal**: Authenticated visitors see floating messages. Clicking reveals content.
**Estimate**: 3-4 hours

- [ ] Create DB schema: chat_messages table (id, type, content, title, media_url, active, created_at)
- [ ] Build admin API routes:
  - POST /messages — create message (admin only)
  - GET /messages — list active messages (authenticated visitors)
  - PUT /messages/:id — update message
  - DELETE /messages/:id — soft delete
- [ ] Build `src/components/chat-world/message-object.tsx` — renders a ChatMessage as a floating object
  - Text messages: floating text label or stylized card
  - Image messages: floating image plane
  - Video messages: floating thumbnail with play icon
- [ ] Build `src/components/chat-world/message-detail.tsx` — opened message view
- [ ] Build `src/components/chat-world/chat-scene.tsx` — uses shared floating engine with message data
- [ ] Build `src/pages/chat-world-page.tsx` at route `/chat-world`
- [ ] Wire up auth gate: `/chat-world` requires login, redirects to login-gate if not authed
- [ ] Add link to Chat World from the Void (a special floating object? a nav link? both?)
- [ ] Add 3-5 real messages to test with
- [ ] Commit: `"chat world v1"`

---

## Phase 8: Content Management + Deploy Milestone 2
**Goal**: You can manage content without touching code. Chat World is live.
**Estimate**: 4-6 hours

- [ ] Build admin API routes for void objects:
  - POST /void-objects — create (with file upload for images/models)
  - GET /void-objects — list all
  - PUT /void-objects/:id — update
  - DELETE /void-objects/:id — soft delete
- [ ] **[DECIDE]** Admin interface approach:
  - Option A: Simple admin page at `/admin` (password protected)
  - Option B: CLI tool that hits the API
  - Option C: Just use curl / Postman for now, build UI later
- [ ] Migrate Void from hardcoded `src/data/void-objects.ts` to API-fetched data
- [ ] File upload: images and .glb models upload to storage, URL saved to DB
- [ ] Deploy backend: Railway, Fly.io, or Render
- [ ] Update frontend to point to production backend URL
- [ ] Redeploy frontend to Netlify
- [ ] Test end to end on production: auth flow, Chat World, content management
- [ ] Commit: `"content management + chat world deploy"`
- [ ] **🎉 Milestone 2 complete — Chat World is live**

---

## Parking Lot (do whenever, or never)
- [ ] Audio visualizer reacting to music
- [ ] Void objects that pulse with audio frequency
- [ ] Particle effects / star field background
- [ ] Cursor trail effects
- [ ] Easter eggs / hidden objects
- [ ] Ambient sound in the void
- [ ] Object physics — objects gently repel each other or the cursor
- [ ] Chat World: let visitors leave reactions on messages
- [ ] Analytics: which objects get clicked most
- [ ] Shows / tour dates integration (Bandsintown, Songkick, or manual)
- [ ] Merch links section
- [ ] Quiz on the void
