# Mercy Land — House World: Scene & Hotspot System (Spec v4)

**Purpose.** The landing is a navigable world of photographic scenes (the house, the
neighborhood, the computer room, the void, future locations). Users travel between scenes and
click features anchored to the photo to enter experiences, open overlays, or link out to
streaming.

**Speccing principle (unchanged).** Lock *structure, behavior, and consistency contracts* now.
Every visual decision is a **named token slot** with a placeholder default, filled by the
designer later without touching component code. New scenes are added by editing **data**.

---

## Core model

Four primitives:

1. **Scene** — one navigable location (photo + anchored hotspots + optional content panel + nav
   controls + frame).
2. **Hotspot** — a clickable label anchored to a feature in the scene photo.
3. **Nav** — per-scene **exits**, two universal returns (**back**, **return to start**), and the
   separate **header** utility layer.
4. **Content registry** — a lookup of named content components (§4). Consumed by two hosts: the
   **overlay shell** (transient) and the **scene panel** (persistent). Content never knows which
   host it is in.

Scenes and hotspots are **data**. `Scene`, `Hotspot`, `Header`, and `OverlayShell` are generic
components.

---

## 1. Scene

**Contract (locked):**

- Renders one background photo inside the decorative frame.
- Ships **two crops per scene**: landscape (desktop) and portrait (mobile).
- **The portrait asset is authored wider than the portrait viewport** so there is room to pan
  (§5). The declared **focal point** sets the *initial* viewport position, not a hard crop.
- Holds an ordered list of hotspots in **normalized coordinates** relative to the **full scene
  image** (not the visible viewport) — so a hotspot's anchor is stable whether it is currently
  on-screen, off-crop, or panned into view.
- **May declare an optional `panel`** — a `ContentId` from the registry (§4), rendered as
  persistent in-scene content rather than behind a click. This is how a scene holds something
  that is not a hotspot: the mailbox scene's signup form, a lore scene's text. Scenes without a
  `panel` behave exactly as before.
- Always renders the two universal returns and the frame chrome in the same place.
- A scene connects to other scenes **only through its own hotspots** (its exits). There is no
  global prev/next. Shape:
  `{ id, title, imageWide, imageTall, focal, hotspots[], panel? }`.

**Designer fills:** photo treatment/filter, frame color + corner-dot style, title typeface
(blackletter) + its scrim, scene-panel styling.

---

## 2. Hotspot — the key consistent primitive

Anchored to a photo feature (for ex: a window = a song, the door = chat world, the mailbox = the
email scene).

**Anchoring (locked):**

- Position stored as **normalized coordinates** (`x`, `y` in 0–1) on the **full scene image**,
  so it stays pinned to its feature at every viewport size and pan offset.
- Anchor point + label. Default: label on the anchor. Optional `offset` + connector line if it
  must clear a busy area. Same rule for all — no per-hotspot improvisation.
- **Minimum tap/click target: 44×44px** regardless of label size (invisible padding counts).

**States (locked — behavior, not look):**

| State | Trigger | Behavior contract |
|---|---|---|
| Idle | default | Consistent **scrim** behind text — the legibility guarantee, readable on any photo. |
| Hover / Focus | mouse or keyboard | Identical for both. Panel brightens, gains a directional cue, lifts slightly. The "clickable" signal. |
| Active | press | Brief press feedback, then the target fires. |
| **Edge** | hotspot is outside the current viewport (mobile) | Renders as an **edge indicator** (§5) instead of in place. Same scrim + label vocabulary, parked against the frame with a chevron pointing off-screen. |
| Visited | *(reserved)* | Data slot present; wired later for the lit/dark idea. Default no-op. |
| Locked | *(reserved)* | For future gating. Default: nothing locked. |

**Legibility guarantee (locked, non-negotiable):** every hotspot carries the same scrim at rest,
including in edge state. No label ever renders bare on the photo.

**Accessibility (locked):** real focusable DOM (`<button>`/`<a>`), `aria-label`, keyboard tab
order, hover == focus. **Every hotspot in a scene is present in the DOM and in tab order
regardless of whether it is currently in the viewport** (see §5). Titles and the `well` word are
real text (SEO + the uncategorized-domain / school-filter issue — a pure-image page reads as
empty to crawlers).

**Target types (locked) — every hotspot does exactly one:**

- `travel` → transition to another **scene** (stays in the world). This is a scene *exit*.
  Includes the **mailbox** → email scene (§8).
- `enter` → route to an on-site **experience** (`/termites`, `/void`, `/chat`).
- `overlay` → expand registry content **in place**, over the current scene, without leaving.
- `external` → open an **off-site** URL (streaming / Odesli smart link).

Asset hotspots use `overlay` or `external` only — no internal per-asset pages for now.

**Prop shape (illustrative):**

```ts
interface Hotspot {
  id: string;
  label: string;
  labelShort?: string;                 // optional mobile / edge-state reflow
  anchor: { x: number; y: number };    // normalized 0–1 on the FULL scene image
  offset?: { x: number; y: number };
  priority?: number;                   // density cap ordering (§5); lower = kept in view
  target:
    | { type: 'travel'; sceneId: string }
    | { type: 'enter'; route: string }
    | { type: 'overlay'; content: ContentId }
    | { type: 'external'; url: string };
  visited?: boolean;                    // reserved
  locked?: boolean;                     // reserved
}
```

**Designer fills:** scrim color/opacity, hover panel color, label typeface/size/tracking, corner
radius, lift distance, connector-line style, edge-indicator shape, external-link cue.

---

## 3. Navigation — branching graph

The world is a **graph of scenes**. A scene's `travel` hotspots are its **exits**. Movement is
free-form; loops are allowed. Three distinct returns exist and must never be conflated:

| Concept | What it does | Where it lives |
|---|---|---|
| **Exit** | Travel to a connected scene | A `travel` hotspot in the scene |
| **Back** | Pop the scene you *came from* (one hop) | Universal control, every scene. Degrades to "return to start" when there's no history (e.g. deep-link entry). |
| **Return to start** | Jump to the landing house | Universal control, every scene. The safety anchor. |

"Go home" is **not** a return — it is an ordinary `travel` hotspot to the lore scene. Keep the
in-world label; do not let it behave like back/start.

**Why branching is safe:** the guaranteed return-to-start removes the only catastrophic failure
of a graph (getting trapped). Remaining consequences:

- **Orientation** ("where am I?"): scene titles carry it for now; a map / "places found" count is
  a **deferred** slot.
- **Coverage**: users can miss whole areas. Intentional for lore/mystery — but it means
  **essential/utility content must live in the header**, never be discoverable-only. Note that
  moving email capture into its own scene (§8) makes it *more* missable than an overlay on the
  landing house; see the open decision on giving it a header entry point.

**Header (separate component — locked structure, immersive skin TBD):** `info · listen · merch`.
Present on every scene as the out-of-world utility layer. Its own component so restyling never
touches scene logic. Locked: the three items, always-reachable, **collapses to a single toggle
on mobile**. Open: the immersive visual treatment.

**Universal-return placement (locked):** `back` and `return to start` render in the same
on-screen position on every scene; on mobile they occupy the bottom thumb zone (two controls
only — see §5).

**Scene transitions (locked motion contract):** all scene-to-scene moves use one shared
transition (pan/dissolve via Framer Motion). Distinct from *intra-scene panning* (§5), which has
its own timing tokens. Designer fills duration + easing.

**SPA routing reminder:** every `enter` target is a real route; the Render rewrite
(`/*` → `/index.html`, Rewrite) must be in place or deep links 404. Render ignores
`public/_redirects`.

---

## 4. Content registry, overlay shell, and scene panels

**There is one overlay, not several.** `ContentId` is a **content key**, not a behavior variant.
The shell — how it opens, animates, traps focus, dismisses, locks scroll, where it sits — is
**identical for every overlay in the system**. Only what renders inside differs.

**Registry (open, grows over time):** `ContentId` maps to a content component in a registry.
Adding new expandable content = registering a component under a new id. **Never fork the shell.**

**Two hosts (locked):**

| Host | Nature | Used for |
|---|---|---|
| **Overlay shell** | Transient, opens over the current scene, dismissible | Asset expansion: video, listening links, photos, lore text |
| **Scene panel** | Persistent, part of a scene, not dismissible | A scene's own content: the mailbox form (§8), lore scene text |

A content component is written once and works in either host. It must not assume it is
dismissible, or that it is the only thing on screen.

**Shell consistency contract (locked):** all overlays open, close, trap focus, and dismiss
(Esc + backdrop) identically, whatever the content. Content-level state — a form's
idle/submitting/success/error, a gallery's current image — lives **inside** the content
component. The shell neither knows nor cares.

### Embedded media contract (locked)

Registry content routinely contains third-party embeds (YouTube, Bandcamp, images). These rules
apply wherever that content is hosted, and exist because embeds break in specific, predictable
ways:

1. **Unmount on close — never hide.** A closed overlay must *remove* its iframes from the DOM,
   not set `display:none`. A hidden-but-mounted YouTube or Bandcamp player keeps playing audio
   behind a dismissed overlay. This is the single most important rule here.
2. **Lazy-mount on open.** Iframes are created only when the content is opened. A scene must
   never pay the network/CPU cost of embeds nobody has opened.
3. **Reserve aspect ratio before load.** Every embed sits in a fixed aspect-ratio container so
   nothing reflows or jumps when the iframe resolves.
4. **Internal scrolling.** Content taller than the viewport scrolls *within* the shell; the scene
   behind never scrolls. Scroll position resets on each open.
5. **Focus trap must account for iframes.** Focus can enter an embed and escape the trap,
   which silently breaks Esc-to-dismiss. Keep a reachable, non-iframe dismiss control at all
   times.
6. **Privacy + CSP.** Prefer `youtube-nocookie` and equivalent privacy-mode embed URLs. Third-
   party frame sources must be allowed in CSP explicitly rather than wildcarded.
7. **Embed budget.** Cap the number of simultaneous embeds per content component (suggested: 2).
   Beyond that, use click-to-load placeholders — also the better mobile-data behavior.

**Designer fills:** overlay max width, media corner radius, embed placeholder/poster treatment,
scene-panel styling.

---

## 5. Mobile — pannable viewport

The mobile scene is a **window onto a wider image**, not a fixed crop.

**Viewport + panning (locked):**

- Below the breakpoint, the scene renders the portrait asset in a **pannable viewport**. The
  focal point sets the initial position.
- Panning is available by **drag/swipe** and by **tapping an edge indicator**.
- Tapping an edge indicator **pans the viewport** until that hotspot is comfortably in view
  (not flush to the frame), then leaves it in normal idle state. **Panning does not activate
  the hotspot** — bringing it into view and tapping it are two separate actions. This keeps
  "move the camera" and "open the thing" from ever being the same gesture.
- Panning is **bounded** to the image extent; no empty space, no infinite scroll.
- Intra-scene panning uses its own duration/easing tokens, distinct from scene transitions.

**Asset requirement (locked):** each scene's portrait asset must be authored **wider than the
portrait viewport** so panning has somewhere to go. If a scene has no off-crop content, it may
be viewport-width and panning simply no-ops.

**Edge indicators (locked):**

- Any hotspot outside the current viewport renders as an **edge indicator**: parked against the
  left or right frame edge, at the vertical position closest to its true anchor, with a chevron
  pointing off-screen.
- Uses the **same scrim + label vocabulary** as an in-scene hotspot so it reads as the same kind
  of object, just parked at the boundary. May use `labelShort`.
- Indicators update live as the viewport pans: a hotspot entering view leaves edge state and
  takes its anchored position; one leaving view becomes an edge indicator.
- Stack vertically per side if multiple hotspots sit off the same edge, ordered by anchor
  position; respect the density cap below.

**Hotspot density cap (locked):** a scene defines a maximum number of **simultaneously visible
anchored labels**; hotspots beyond that (by `priority`) remain reachable via panning and edge
state rather than crowding the viewport. Prevents a busy scene from ringing itself with labels.

**Scene panels on mobile (locked):** a scene `panel` is **not** part of the pannable layer. It
renders in the fixed foreground above the photo so it can never be panned off-screen, and it
must not overlap the thumb-zone returns.

**Accessibility contract:**

Accessibility happens via these rules, which must be implemented together or off-crop hotspots
become unreachable for keyboard and screen-reader users:

1. **Every hotspot in a scene is rendered in the DOM and present in tab order at all times**,
   regardless of viewport position or edge state. Nothing is conditionally unmounted for being
   off-crop.
2. **Focus drives the viewport**: focusing a hotspot that is outside the viewport
   **auto-pans the scene to bring it into view.** Keyboard traversal is therefore a complete
   tour of the scene — the pan follows focus, never the reverse.
3. Tab order follows the scene's hotspot list order (authored, meaningful), not visual position.
4. Edge indicators are the *visual* affordance for the same underlying elements — they are not
   separate controls and must not duplicate them in the accessibility tree.
5. Panning must never be the only way to *know* a hotspot exists: an off-crop hotspot always has
   either an edge indicator or a focusable presence, and normally both.

**Other mobile rules (locked):**

- Tap targets clear 44px; labels may reflow to `labelShort`.
- Frame chrome **thins** (corners kept, border reduced).
- **Thumb zone holds two controls only: `back` and `start`.**
- Header collapses to a single toggle.

**Designer fills:** breakpoint, frame reduction, edge-indicator styling, pan timing values.

---

## 6. Design token slots (fill-in-later)

Ship as CSS custom properties with placeholder defaults; the designer overrides values only.
Map to existing `mercy-*` vars or new values — component code never changes.

| Token | Controls | Placeholder default |
|---|---|---|
| `--hotspot-scrim` | idle scrim behind label | `rgba(13,11,18,0.64)` |
| `--hotspot-scrim-blur` | idle scrim blur | `2px` |
| `--hotspot-radius` | label corner radius | `6px` |
| `--hotspot-label-font` | label typeface | `var(--font-mono)` |
| `--hotspot-label-size` | label size | `12px` |
| `--hotspot-label-tracking` | letter-spacing | `1px` |
| `--hotspot-label-color` | idle text color | `mercy-white` |
| `--hotspot-hover-bg` | hover panel color | `mercy-*` accent |
| `--hotspot-hover-color` | hover text color | dark (pass contrast) |
| `--hotspot-hover-lift` | hover translate-Y | `2px` |
| `--hotspot-external-cue` | "leaving site" indicator | small ↗ |
| `--hotspot-tap-min` | min target size | `44px` (do not lower) |
| `--edge-indicator-radius` | edge tab corner rounding | `9px` (outer corners only) |
| `--edge-indicator-bg` | edge tab background | `rgba(13,11,18,0.72)` |
| `--edge-indicator-size` | edge tab label size | `10px` |
| `--pan-duration` | intra-scene pan duration | `420ms` |
| `--pan-ease` | intra-scene pan easing | `easeOutCubic` |
| `--frame-color` | decorative border | `#5b9bd5` |
| `--frame-width` | border thickness | `3px` (thins on mobile) |
| `--frame-corner` | corner-dot treatment | dot, 14px |
| `--scene-title-font` | the `well` blackletter | Eskapade Fraktur |
| `--scene-title-scrim` | title legibility scrim | soft dark gradient |
| `--nav-transition-dur` | scene→scene transition | `320ms` |
| `--nav-transition-ease` | scene→scene easing | `easeOutCubic` |
| `--nav-return-*` | back / start controls | inherit hotspot label style |
| `--overlay-max-width` | shell content width cap | `640px` |
| `--overlay-media-radius` | embed corner radius | `8px` |
| `--overlay-placeholder-bg` | click-to-load embed poster | `rgba(13,11,18,0.72)` |
| `--scene-panel-bg` | scene panel surface | inherit hotspot scrim |
| `--scene-panel-radius` | scene panel corner radius | `10px` |
| `--overlay-*` | inherit from existing overlay | — (reuse) |

---

## 7. Scene data schema (add a scene without code)

```ts
const houseScene: Scene = {
  id: 'house',
  title: 'well',
  imageWide: '/scenes/house-wide.webp',
  imageTall: '/scenes/house-tall.webp',   // authored wider than the portrait viewport
  focal: { x: 0.5, y: 0.55 },             // initial viewport position on mobile
  maxVisibleLabels: 4,                    // density cap
  hotspots: [
    { id: 'door',    label: 'knock · chat world', anchor: { x: 0.53, y: 0.72 }, priority: 1,
      target: { type: 'enter', route: '/chat' } },
    { id: 'attic',   label: 'the void', anchor: { x: 0.50, y: 0.30 }, priority: 2,
      target: { type: 'travel', sceneId: 'void' } },
    { id: 'mailbox', label: 'join the list', labelShort: 'join list',
      anchor: { x: 0.12, y: 0.80 }, priority: 3,
      target: { type: 'travel', sceneId: 'mailbox' } },
    { id: 'porch',   label: 'go home', anchor: { x: 0.60, y: 0.66 }, priority: 4,
      target: { type: 'travel', sceneId: 'lore' } },
    { id: 'cellar',  label: 'termites', anchor: { x: 0.06, y: 0.86 }, priority: 5,
      target: { type: 'enter', route: '/termites' } },
    { id: 'window1', label: 'song 01', anchor: { x: 0.88, y: 0.44 }, priority: 6,
      target: { type: 'external', url: 'https://song.link/...' } },
  ],
};

const mailboxScene: Scene = {
  id: 'mailbox',
  title: 'the mailbox',
  imageWide: '/scenes/mailbox-wide.webp',
  imageTall: '/scenes/mailbox-tall.webp',
  focal: { x: 0.5, y: 0.5 },
  panel: 'emailSignup',                   // persistent scene content, from the registry
  hotspots: [],                           // returns handle navigation; no exits required
};
```

The world graph emerges from the `travel` targets — no separate ordering to maintain. Hotspots
with anchors outside the initial mobile viewport (e.g. `x: 0.06`, `x: 0.88`) surface as edge
indicators automatically; nothing extra to author.

---

## 8. Email capture — the mailbox scene

Email capture is **a scene, not an overlay**. Clicking the mailbox hotspot travels to a dedicated
mailbox scene (a photograph of the mailbox) whose `panel` renders the signup form. It stays
in-world, gets its own URL, and the form has room to breathe.

**Contract (locked):**

- The mailbox scene follows every normal scene rule: frame, title, universal returns, mobile
  panning. Nothing about it is special-cased.
- The signup form is a **registry content component** (`emailSignup`), hosted as a scene panel.
  Because it is registry content, it could later be hosted in an overlay instead with no rewrite.
- The form owns its own states — idle, submitting, success, error — inside the component. The
  scene does not manage them.
- **Success state stays in-world.** Confirmation renders in the panel; it does not navigate away
  or throw an alert.
- Form is real accessible markup: labeled input, real submit button, `type="email"`, inline
  validation, errors announced to assistive tech.

**Provider integration (locked as a boundary, open as a choice):**

- **Currently: Formspree** (`mldnjygq`). Unchanged for now.
- All provider communication lives behind a **single integration module** — one function that
  takes an email address and returns success/error. The form component calls only that. Swapping
  providers later changes one file and touches **no UI**.
- Do not scatter provider IDs, endpoints, or response-shape assumptions through components.

**Consent + compliance (locked):** the form must state plainly what someone is signing up for.
Addresses collected without clear consent language are not safely mailable later, whatever the
provider. Any eventual sending platform also requires an unsubscribe link and a physical address
in every campaign, and domain authentication (SPF/DKIM on `thankgodformercyland.com`) to avoid
spam foldering.

**Deferred:** Formspree collects addresses but cannot *send* campaigns — a sending platform is a
separate future decision (see Future expansions). The integration boundary above exists
specifically so that decision costs nothing today.

---

## Locked vs. open vs. deferred

**Locked now:** four primitives; normalized anchoring on the full image; hotspot states incl.
**edge**; scrim legibility guarantee; 44px tap floor; four target types; branching graph via
per-scene exits; two universal returns + "go home" as an ordinary scene; header as its own
component collapsing to a mobile toggle; single shared scene transition; **one overlay shell +
content registry**; **the embedded media contract**; **scene panels**; mailbox as a scene with a
single provider integration boundary; mobile **pannable viewport + edge indicators + density
cap**; the **focus-driven panning accessibility contract**; token-slot mechanism.

**Designer fills (values only):** all colors, fonts, sizes, blur, radius, lift, motion timing,
frame + title treatment, immersive header skin, edge-indicator styling, external-link cue,
overlay + scene-panel surfaces, embed placeholder treatment.

**Deferred (slots reserved, no rewrite needed):** `visited` progression (lit/dark); `locked`
gating; orientation map / "places found" count; the eventual game; community + self-insertion
features; sending platform migration.

---

## Open decisions

1. **Desktop panning:** does the wide view pan too, or is desktop always the full scene at once?
   (Simplest: desktop shows everything, panning is mobile-only. But if scenes get very wide,
   desktop inherits the same model.)
2. **Header entry point for email.** Now that signup is a scene deeper in the world, it is more
   missable than an overlay on the landing house. Does the header get a fourth item, or does
   "join the list" live under `info`? The coverage rule in §3 says essential utility content
   should not be discoverable-only.
3. **Immersive header treatment** — its own small spec.
4. **Launch scene graph** — which scenes exist at launch and how they connect.

---

## Future expansions

- Shopify site?
- **Sending platform.** Formspree collects but does not send. Free tiers surveyed (mid-2026):
  **Kit** ~10,000 subscribers free (broadcasts + landing pages; no visual automations on free) —
  best fit for audience-building with an API for later Chat World use. **Sender** ~2,500 subs /
  15,000 emails per month. **EmailOctopus** ~2,500 subs / 10,000 emails. **MailerLite** ~500 subs
  / 12,000 emails, strongest free feature set. **Brevo** unlimited contacts / 300 emails per day.
  Avoid Mailchimp (free tier shrunk to ~500) and beehiiv (no free automations, forced branding,
  $49/mo next tier). **Laylo** is the musician-native option — captures email + SMS + DM opt-in
  per signup and is built around release "drops," free tier limited, ~$25/mo plus messaging for
  premium; worth revisiting once drops are regular. Verify all limits before committing.
- Magic-link auth for Chat World (desired for the *feeling of exclusivity*, not security).