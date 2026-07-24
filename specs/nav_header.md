# Mercy Land — Nav / Header Spec (v1)

**Companion to** `v2-site.md` (§3 defines the header as the out-of-world utility layer) and
`flat_view.md`. This spec makes the header **one shared component, identical on every route**,
and retires the flat view's own nav.

**Goal (from this task):** the same nav functionality across the entire app. The flat view no
longer needs — or keeps — its existing nav; it uses the shared header like everything else.

---

## Core principle — mount once, not per-page

The header is rendered **once in an app-level layout wrapper** that wraps every route, not
imported into individual views. This single decision is what guarantees consistency and what
makes removing flat's bespoke nav the correct move: flat stops owning a header and inherits the
shared one for free.

```tsx
// App shell (illustrative)
<Layout>          {/* renders <Header/> once, above the routed outlet */}
  <Routes>
    <Route path="/"          element={<World/>} />   {/* house world / scenes */}
    <Route path="/flat"      element={<Flat/>} />     {/* was the old landing; info → here */}
    <Route path="/void"      element={<Void/>} />
    <Route path="/chat"      element={<Chat/>} />
  </Routes>
</Layout>
```

No view renders its own nav. If a view currently does (flat), that nav is deleted.

---

## Header structure

`[ Mercy Land wordmark ]  ······  [ info ]  [ listen ]  [ merch ]`

- **Wordmark → world root (`/`).** This is the utility layer's way back into the world. On
  non-scene routes (`/flat`, `/void`, `/chat`) it is the **only** guaranteed return, so it must
  always be present. On scene routes it coexists with the diegetic returns and resolves to the
  same start scene — a mild, acceptable redundancy that keeps the header identical everywhere.
- **info · listen · merch** — the three utility items.

---

## Nav items (locked structure, targets partly TBD)

| Item | Target | Kind | New tab? | Notes |
|---|---|---|---|---|
| *(wordmark)* Mercy Land | `/` (world root) | internal | no | return to the world |
| info | `/flat` | internal | no | the former landing; `/termites` retired |
| listen | TBD | TBD | TBD | internal `/listen` page **or** external streaming — open decision |
| merch | Bandcamp URL | external | yes | existing link |

**Item kinds (locked):**

```ts
type NavItem =
  | { label: string; kind: 'internal'; route: string }   // React Router <Link>
  | { label: string; kind: 'external'; url: string };     // <a target="_blank" rel="noopener noreferrer">

const navItems: NavItem[] = [
  { label: 'info',   kind: 'internal', route: '/flat' },
  { label: 'listen', kind: 'internal', route: '/listen' },   // TODO confirm internal vs external
  { label: 'merch',  kind: 'external', url: 'https://TODO.bandcamp.com' }, // TODO exact URL
];
// wordmark is handled separately (always → '/'), not part of navItems
```

---

## Behavior (locked)

- **Identical on every route.** Same component, same items, same behavior on the house world,
  `/flat`, `/void`, `/chat`. Only the *skin* is designer-fill (tokens); structure never varies.
- **Always reachable.**
- **Active state.** The item matching the current route gets active styling (e.g. `info` is
  active on `/flat`). External items never show active.
- **Mobile.** Collapses to a single toggle; opening it reveals the wordmark + three items. (Matches
  `v2-site.md` §3: header collapses to one toggle on mobile.)
- **Out-of-world utility layer.** Distinct from the diegetic scene returns (`back`,
  `return to start`), which live in the scene thumb zone. The header is the escape hatch and the
  transactional layer; the returns are in-world navigation.

---

## Relationship to the scene world

- **On scenes:** the header sits above the diegetic hotspots and universal returns. It's the
  utility escape hatch — streaming, merch, info — that never has to compromise the scene's mood.
- **On non-scene routes (`/flat`, `/void`, `/chat`):** the header is the only persistent chrome.
  Do not ship a utility route without it, and the wordmark is the sole guaranteed way back to the
  world. This is the reason the header is mounted app-level rather than per-scene.
- **Coverage rule (`v2-site.md` §3):** streaming and merch must be reachable from the header on
  *every* route, never discoverable-only. App-level mounting satisfies this automatically.

---

## Flat view migration

The flat view's existing, separate nav is removed; it inherits the shared header.

- [ ] Delete the flat view's own header/nav component and its imports.
- [ ] Remove the now-dead nav markup, links, and styles specific to flat.
- [ ] Confirm the shared header renders on `/flat` via the layout (nothing flat-specific added).
- [ ] Verify the wordmark returns to the world from `/flat` (no dead end).
- [ ] Confirm `info` shows active state while on `/flat`.
- [ ] Check nothing in the flat redesign spec (`flat_view.md`) still assumes the old nav exists.

> Content changes to the flat view itself (section retirement, etc.) live in `flat_view.md` — out
> of scope here. This spec only swaps the nav.

---

## Design tokens (fill-in-later)

Ship as CSS custom properties with placeholder defaults; the designer fills values. Immersive
skin is TBD — structure and behavior above are locked regardless.

| Token | Controls | Placeholder default |
|---|---|---|
| `--header-bg` | header surface / scrim | transparent → scrim over scenes |
| `--header-height` | bar height | `56px` |
| `--header-item-font` | item typeface | `var(--font-mono)` |
| `--header-item-size` | item size | `13px` |
| `--header-item-color` | idle item color | `mercy-white` |
| `--header-item-active` | active/current item color | `mercy-*` accent |
| `--header-wordmark-font` | wordmark typeface | Eskapade Fraktur / MedievalSharp |
| `--header-toggle-icon` | mobile toggle glyph | menu |
| `--header-menu-surface` | mobile open-menu background | `rgba(13,11,18,0.92)` |

---

## Open decisions

1. **`listen` destination** — an internal `/listen` page (embeds, per-song links) or a single
   external streaming link? Changes its `kind`. Ties to the still-open per-song streaming work.
2. **Email in the header?** — signup is currently one hop from start (mailbox scene). Does the
   header also get a 4th item / put "join the list" under `info`, or stay wordmark + three?
   (Carried over from `v2-site.md` §3.)
3. **Header visibility on immersive scene routes** — always visible, or a toggle even on desktop
   so it doesn't compete with the `well` title and the photo? Likely always-visible but minimal;
   a skin decision for the designer.
4. **World root route** — confirm `/` renders the house world start scene so the wordmark target
   is correct.
