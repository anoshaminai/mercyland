# Mercy Land — Analytics Spec (v1, Umami)

**Companion to** `v2-site.md`, `scenes.data.ts`, and `nav_header.md`. Goal: understand the
journey through the world — **where visitors click and how far they get** — without a cookie
banner and without touching the scene components more than a handful of times.

**Tool: Umami (cloud).** Cookieless and privacy-first by default (no consent banner — which would
wreck the immersive landing), free tier ~100K events/month across 3 sites, with basic custom
events, user-path, funnel, and retention reports. Enough for a launch; upgrade path exists if a
release spikes traffic (see Budget).

---

## Core principle — one choke point, four events

Every meaningful action already routes through the data model, so instrumentation lives at ~4
call sites, not sprinkled across the UI. Because scene ids (`SceneId`), hotspot ids
(`Hotspot.id`), and content ids (`ContentId`) are already stable and meaningful, **they are the
event payload** — no separate naming scheme to maintain.

Four events capture the whole world:

| Event | Fires when | Answers |
|---|---|---|
| `scene_view` | a scene mounts | coverage / how far they get |
| `hotspot_click` | any hotspot is activated (all target types) | where they click |
| `overlay_open` | an overlay opens | which media gets opened |
| `email_submit` | the mailbox form submits successfully | signup conversion |

`external` clicks (streaming, the desert YouTube link) need no separate event — they arrive as a
`hotspot_click` with `target_type: 'external'`. For that to be true, `Hotspot` calls `onActivate`
for external targets too — *without* `preventDefault`, so its `<a>` still opens the new tab itself
and the host does no navigating. That is what keeps `handleActivate` a genuine single choke point
rather than three-quarters of one.

---

## Integration boundary (locked)

All provider calls live behind **one wrapper**, same pattern as the Formspree boundary (spec §8).
Swapping analytics tools later changes one file and touches no components.

```ts
// src/lib/analytics.ts
type Props = Record<string, string | number | boolean>;

export const track = (event: string, props: Props = {}): void => {
  // the ONLY place the provider is named:
  window.umami?.track(event, props);
};
```

Components import `track` and nothing else. They never reference `umami` directly.

---

## Umami setup (Render static site)

1. Create the site in Umami and copy the snippet values from the dashboard. **They are configured
   by environment, not hardcoded** — Vite substitutes `%VITE_*%` into `index.html` at build:
   ```html
   <!-- index.html, before </head> -->
   <script defer src="%VITE_UMAMI_SRC%" data-website-id="%VITE_UMAMI_ID%"></script>
   ```
   `VITE_UMAMI_SRC` (e.g. `https://cloud.umami.is/script.js`) and `VITE_UMAMI_ID` are set in the
   Render dashboard for the `mercyland` static site, and documented in `.env.example`. **Leave both
   unset locally:** the script then fails to load, `window.umami` is undefined, and `track()`
   degrades to a `console.debug` — which is how you verify instrumentation without polluting
   production numbers. (The id is public in the shipped HTML either way; env vars are for
   environment separation, not secrecy.)
2. **Do not rely on Umami's automatic pageview tracking for scenes.** Scene travel is in-app state
   and does not change the URL, so scenes are tracked with explicit `scene_view` events (below).
   Auto pageviews for real route changes (`/termites`, `/void`, `/chat-world`, `/gate`) are fine to
   leave on — Umami patches the History API, so SPA navigation is picked up without a custom route
   listener.
3. Cookieless is the default — confirm no cookie/consent code is added anywhere.
4. If a CSP is set, allow the Umami script host and its `/api/send` endpoint. (There is no CSP
   today — `render.yaml` sets no headers.)

---

## Event schema (locked names + props)

Names and prop keys are `snake_case`; values are primitives; ids come straight from the data.

**`scene_view`** — fired once when a scene mounts.
```
{ scene: SceneId }
```

**`hotspot_click`** — fired for every hotspot activation, whatever the target.
```
{
  from: SceneId,            // scene the click happened in
  hotspot: string,          // Hotspot.id
  label: string,            // Hotspot.label
  target_type: 'travel' | 'enter' | 'overlay' | 'external',
  target: string            // sceneId | route | content id | url
}
```

**`overlay_open`** — fired when the overlay shell opens.
```
{ scene: SceneId, content: ContentId }
```
Note: `OverlayShell` hosts only `summertimeVideo`, `summertimeBTS`, and `monsterDenied`. The other
content ids (`emailSignup`, `flagStatement`, `ljConversation`) are `scene.panel` content rendered
by `ScenePanel`, which is persistent, not an overlay — and since each is 1:1 with its scene, the
scene's `scene_view` already measures it. No separate `panel_view` event is needed.

**`email_submit`** — fired on successful signup. **No email address in props** (no PII).
```
{ source: 'mailbox' | 'flat' | 'gate' }
```
All three signup forms are instrumented, not just the mailbox: `mailbox` is the world panel,
`flat` the `/termites` landing form, and `gate` the chat-world unlock — which is the last step of
the chat-world funnel below, and the only way to tell whether anyone actually gets in.

---

## Call sites (locked)

Both mount-time events share one guard: **`useTrackOnce(event, props, dedupeKey)`**
(`src/hooks/use-track-once.ts`). It fires only when `dedupeKey` changes, which covers StrictMode's
double-invoked effects in dev, incidental re-renders, and the case where a host stops remounting
per id. One entry = one event.

**`scene_view`** — in `Scene` (`src/components/world/scene.tsx`), keyed on the scene id.
```ts
useTrackOnce('scene_view', { scene: scene.id }, scene.id);
```

**`hotspot_click`** — in `handleActivate` (`src/pages/world-page.tsx`), the single activation
handler, before the switch runs. Firing first means the event survives an `external` target and
covers every target type in one call. `from` is load-bearing: `Hotspot.id` is unique only *within*
a scene (`gohome` appears in three, `void` in two), so `from` + `hotspot` is the real key.
```ts
const target =
  t.type === 'travel'  ? t.sceneId :
  t.type === 'enter'   ? t.route   :
  t.type === 'overlay' ? t.content : t.url;
track('hotspot_click', {
  from: current, hotspot: h.id, label: h.label, target_type: t.type, target,
});
// …then the existing switch, with `case 'external': break;` (the <a> already navigated)
```

**`overlay_open`** — in `OverlayShell` (`src/components/world/overlay-shell.tsx`), which is mounted
only while open, so mount == open. It takes `scene` and `content` as required props; `content`
doubles as the dialog's `aria-label`.
```ts
useTrackOnce('overlay_open', { scene, content }, `${scene}:${content}`);
```

**`email_submit`** — success branch only, in all three forms:
- `src/components/world/content/email-signup.tsx` — after `submitEmailSignup` resolves ok
  (`source: 'mailbox'`).
- `src/components/EmailSignup.tsx` — effect on `state.succeeded` (`source: 'flat'`).
- `src/pages/gate-page.tsx` — in the existing `state.succeeded` effect, alongside `grantAccess`
  (`source: 'gate'`).

The two Formspree-SDK forms need a local `useRef` fired-guard: their effects re-run on unrelated
identity changes and StrictMode double-invokes them. Never send the address.

That's the whole surface. Scene returns (`back`, `return to start`) and header nav are optional
adds later; the four events above already show the journey.

---

## Insights to build in Umami — "how far do they get"

Your world is a **graph, not a linear funnel**, so lead with coverage and paths; use funnels only
for specific intended trips.

1. **Scene coverage (headline metric).** Unique visitors per `scene_view` value. The dropoff from
   `start_house` outward *is* "how far they get," and it shows which rooms nobody finds. Build as a
   breakdown of `scene_view` by `scene`.
2. **User paths / journeys.** Umami's path report over `scene_view` — the real routes people walk
   through the house. This is where you learn whether anyone reaches `computer_room_chat_world`.
3. **Funnel — signup:** `scene_view: start_house` → `scene_view: mailbox` →
   `email_submit` where `source = mailbox`. Conversion to the list, in-world.
4. **Funnel — chat world:** `scene_view: start_house` → `scene_view: computer_room_void` →
   `scene_view: computer_room_chat_world` → `hotspot_click` where `target = /chat-world` →
   `email_submit` where `source = gate`. Whether the intended path to the headline feature
   actually lands — and, with the last step, whether anyone clears the gate.
5. **Where clicks go (optional).** Breakdown of `hotspot_click` by `hotspot` or `target` — which
   doors people choose, which songs get clicked.

---

## Privacy (locked)

- Cookieless; no consent banner.
- **No PII in any event** — never send the email address, and no free-text user input as props.
- Event props are ids and enums only, all derived from the data model.

---

## Budget

A curious visitor fires roughly 10–30 events exploring. Umami free (~100K/month) covers on the
order of 3–5K such sessions. Fine for normal traffic; watch a release-day spike. If exceeded, the
paid tier (~$20/month for ~1M events) is the upgrade — and the integration boundary means no code
changes to move.

---

## TODO / open

- **Set `VITE_UMAMI_SRC` + `VITE_UMAMI_ID` in the Render dashboard.** Until then the code is live
  but inert: the script 404s and every `track()` call no-ops. This is the one remaining step
  between here and real data.
- Decide cloud vs self-host (self-host needs Postgres/MySQL; cloud free tier is simplest).
- Optional later: `overlay_close` (for dwell time on videos), and sub-events inside `/void` and
  `/chat-world` — out of scope here; those are separate experiences with their own instrumentation.
  Scene returns (`back`, `return to start`) and header nav are likewise optional adds.

---

## Validation checklist

Code-level (verified at implementation):
- [x] `track` is the only place `umami` is referenced (`src/lib/analytics.ts`, incl. the
      `declare global`).
- [x] Every hotspot activation routes through `handleActivate` — all four target types, including
      `external`, which previously bypassed it entirely.
- [x] `scene_view` / `overlay_open` are StrictMode-guarded via `useTrackOnce`.
- [x] `email_submit` fires in success branches only and carries no address.
- [x] No cookie or consent code anywhere; `npm run build` and `npm run lint` clean.

Runtime (walk it with the dev console open — `track` logs `[analytics]` when Umami is unloaded):
- [ ] `scene_view` exactly once per entry, across all 8 scenes; refires on re-entry.
- [ ] `hotspot_click` once per activation for all four target types — check `start_house:song01`
      and `desert_house:trespass` (external; the new tab must still open), `start_house:mail`
      (travel), `computer_room_void:void` (enter), `house_monster:gohome` (overlay).
- [ ] Mobile (≤640px) two-step reveal: first tap on a collapsed marker fires **nothing**, second
      fires exactly one `hotspot_click`.
- [ ] `overlay_open` for `summertimeVideo`, `summertimeBTS`, `monsterDenied`; refires on reopen.
- [ ] `email_submit` from all three sources; nothing on validation failure or network error.

Live (after the env vars are set):
- [ ] Events arrive in Umami realtime; no cookies set by the Umami host.
- [ ] Auto pageviews land for `/termites`, `/void`, `/chat-world`, `/gate`.
- [ ] Scene coverage + path reports populate after a walkthrough of every scene.
- [ ] Both funnels resolve (signup, chat world).

---

## How to test

Instrumentation is invisible when it works, so it needs a deliberate walkthrough. The whole point
of the console fallback in `track()` is that you can do this locally, for free, without sending a
single event to production.

### Setup

```bash
npm run dev          # http://localhost:5173
```

Keep `VITE_UMAMI_SRC` / `VITE_UMAMI_ID` **unset** in `.env.local`. With no script loaded,
`window.umami` is undefined and every event prints instead of sending. Two startup warnings
(`%VITE_UMAMI_SRC% is not defined in env variables`) are expected here and confirm the setup is
correct — they are the substitution working, not failing.

Open DevTools → Console and:
1. **Set the log level to include Verbose.** `track()` uses `console.debug`, which Chrome hides at
   the default level. If you see nothing at all, this is why.
2. Filter on `[analytics]`.

Every event prints as `[analytics] <event> { …props }`.

### The walkthrough

This route touches all 8 scenes, all four hotspot target types, and all three overlays. Expected
events are in the right column — anything extra, missing, or doubled is a bug.

| # | Do this | Expect |
|---|---|---|
| 1 | Load `/` | `scene_view {scene: start_house}` — **once**, not twice |
| 2 | Click `song 01` | `hotspot_click {from: start_house, hotspot: song01, target_type: external, target: <spotify url>}` **and a new tab opens** |
| 3 | Click `check mail` | `hotspot_click {… target_type: travel}` then `scene_view {scene: mailbox}` |
| 4 | Submit the mailbox form | `email_submit {source: mailbox}` — **and no email address in the props** |
| 5 | `back` | `scene_view {scene: start_house}` (refiring on re-entry is correct) |
| 6 | `explore the neighborhood` → `trespass` | travel, then `scene_view {desert_house}`, then an `external` click + new tab |
| 7 | `back`, then `visit parents' friends` | `scene_view {summertime_house}` |
| 8 | `enter the party` | `hotspot_click {target_type: overlay}` + `overlay_open {scene: summertime_house, content: summertimeVideo}` |
| 9 | Close it, reopen it | `overlay_open` fires **again** (per open, not per session) |
| 10 | `spy` | `overlay_open {… content: summertimeBTS}` |
| 11 | `go home` | `scene_view {house_monster}` |
| 12 | `go home` (the joke one) | `overlay_open {… content: monsterDenied}` |
| 13 | `stay here` → `steal the flag` | `scene_view {start_house}`, then `scene_view {flag_void}` |
| 14 | `back` → `use computer room` | `scene_view {computer_room_void}` |
| 15 | `sit in chair` | `scene_view {computer_room_chat_world}` |
| 16 | `open chat world` | `hotspot_click {target_type: enter, target: /chat-world}` |
| 17 | Submit the gate form | `email_submit {source: gate}` |
| 18 | Visit `/termites`, submit that form | `email_submit {source: flat}` |

### Mobile two-step

Resize to ≤640px (or use device emulation) and revisit `start_house` or `summertime_house`, where
hotspots collapse to bare markers:

- **First tap** on a marker reveals its label and must fire **nothing**. A reveal is not an
  activation — if it logs a `hotspot_click`, the two-step guard has regressed and every accidental
  tap is being counted as intent.
- **Second tap** fires exactly one `hotspot_click`.

### Negative cases

Just as important as the positive ones — these must produce **silence**:

- Submitting any signup form with an invalid address (validation failure).
- A signup that fails at the network layer (throttle to offline in DevTools).
- Tabbing through hotspots without activating them.
- Panning or dragging a scene.

### Once live

After setting the env vars in Render and deploying, hard-reload the site and confirm in DevTools:
`window.umami` is defined, requests to `/api/send` return 2xx, and **Application → Cookies shows
nothing** from the Umami host. Then walk a few scenes and watch them land in Umami's realtime view
before trusting the reports.