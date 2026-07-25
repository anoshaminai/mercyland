# Mercy Land — House World: build brief

Hand this folder to Claude Code alongside the site spec (v4). **Spec v4 = how things behave;
these files = what exists.** `scenes.data.ts` is the source of truth and the surface you iterate
from — change data, change the world.

## Files

| File | Role |
|---|---|
| `world.types.ts` | Schema. `SceneId` union makes broken `travel` links a compile error. |
| `scenes.data.ts` | The 8 launch scenes as data. **Iterate here.** |
| `content-registry.tsx` | `ContentId` → component. Stubs to implement + band-authored text/messages. |
| `validate-world.ts` | Dev-time checks (orphans, broken links, reachability, missing crops). |

Suggested placement: `src/world/`. Wire `reportWorld(world)` in `main.tsx` behind
`import.meta.env.DEV` so the checklist runs on every dev boot.

## Build order

1. **Types + data** (provided). Confirm `scenes.data.ts` typechecks.
2. **Asset loader.** Scene images are referenced by filename. Resolve with Vite glob so missing
   assets don't break the build:
   ```ts
   const urls = import.meta.glob('../assets/images/scenes/*', { eager: true, query: '?url', import: 'default' });
   const resolve = (name: string) => urls[`../assets/images/scenes/${name}`] as string | undefined;
   ```
   Rename two assets to match the data (no spaces): `house monster.png → house_monster.png`,
   `LJ chat world.jpg → lj_chat_world.jpg`.
3. **Generic components**, per spec:
   - `Hotspot` — states incl. edge; scrim legibility guarantee; 44px tap floor; real focusable
     DOM; hover == focus (spec §2).
   - `Scene` — renders photo in the frame; `pannable` vs `static` (spec §1, §5, graph Issue 6);
     pannable = cover-fit (`mobileZoom` × cover) + edge indicators + **focus-driven panning**
     (focusing an off-viewport hotspot auto-pans to it — this is the accessibility floor, spec §5).
   - `OverlayShell` — one shell, reused; open/close/focus-trap/Esc+backdrop identical for all
     content; **embedded-media contract** (unmount iframes on close, lazy-mount, aspect ratio,
     youtube-nocookie, ~2 embed cap — spec §4).
   - `ScenePanel` — persistent host for the same registry content (spec §4).
   - `Header` — own component; `termites · listen · merch`; collapses to a toggle on mobile (spec §3).
   - Universal returns — `back` (pop history, degrade to start) + `return to start`; same position
     every scene; two-item thumb zone on mobile (spec §3, §5).
4. **Content components** — implement the `content-registry.tsx` stubs (spec §4). `emailSignup`
   goes through a single Formspree integration module so a provider swap touches no UI (spec §8).
5. **Routes** — `/void`, `/chat` (hotspot `enter` targets), `/termites` (header "termites" — this is
   the old landing; it lived at `/flat` for a while and `/flat` now redirects here). Ensure the **Render rewrite** `/*` → `/index.html` (Rewrite)
   is set, or deep links 404 (Render ignores `public/_redirects`).
6. **Design tokens** — spec §6. Ship CSS custom properties with placeholder defaults; the designer
   fills values. Component code never changes for styling.

## Resolved in this pass (folded into the data)

- **Issue 1** — `computer_room_void` links to `computer_room_chat_world` (orphan fixed).
- **Issue 3** — old landing is `/termites` (was `/flat`; that path now redirects).
- **Issue 4** — desert "trespass" `external`, summertime "party" `overlay` — intentional, kept.
- **Issue 5** — `ljConversation` is one shared component; scenes pass `props.messageKey`.
- **Issue 6** — interior/void scenes are `layout:'static'` (no panning).

## Data still to fill (all marked `TODO` in the files)

- **Anchors** — every hotspot `anchor` is a placeholder estimate; tune against the real images.
- **Portrait crops** — `imageTall` is OPTIONAL now: mobile cover-fits `imageWide` and pans over the
  overflow. Tune `focal.x` + `mobileZoom` per pannable scene instead (`scene_image_authoring.md`).
- **Streaming** — `song01` URL. (Header "listen" resolved: Bandcamp `/music`.)
- **Summertime** — YouTube id (`summertimeVideo`) + BTS images (`summertimeBTS`).
- **LJ messages** — `ljMessages.void` / `.chat`.
- **Titles** — `computer_room_void`, `computer_room_chat_world`, `flag_void`.
- **Mailbox photo** — pull from stills.
- **Flag statement** — two producer names.
- **flag.gif** — animated; loop + `prefers-reduced-motion` fallback.


## What's left (data + deploy, not architecture)

  - Data TODOs in scenes.data.ts / content-registry.tsx: focal.x + mobileZoom tuning per pannable scene (mobile panning is
  LIVE off imageWide; imageTall is an optional upgrade), real hotspot anchors, song01 URL, scene titles, mailbox photo, LJ messages, summertime
  YouTube id + BTS images, flag producer names.
  - Deploy: if you're on Render, it needs a /* → /index.html Rewrite rule or deep links (/termites, /void) 404 — Render ignores
  public/_redirects (BUILD.md step 5).
  - Worth a real browser pass now that / is the world — especially a live email submit through the mailbox, and eyeballing
  the header float over scenes. I still can't drive a browser here (Chrome extension isn't connected).

  Want me to start filling data TODOs, tune the hotspot anchors against the real scene images, or leave it here for you to
  review in the browser?

## Parked (not in this build — from graph §7/§8)

Chat World seeding + visibility; secret-code / points→merch system; games tied to email login.
These wait on email-identity work; the `visited` / `locked` hotspot slots are reserved for them.
