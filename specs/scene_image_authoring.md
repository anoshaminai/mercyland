# Scene image authoring — `mobileZoom`, `focal`, and `imageTall`

How mobile framing works, read off the implementation (`src/components/world/scene.tsx`).

**Headline:** mobile panning no longer needs a bespoke portrait crop. Any source photo is scaled up
until it fills the phone stage, and the overflow *becomes* the pan travel. `imageTall` is now an
optional upgrade. `focal` and `mobileZoom` are the knobs you actually tune.

## The two fits

| where | fit | pans? |
|---|---|---|
| desktop (any layout) | **contain** — whole photo, centred | no |
| mobile, `layout: 'static'` | **contain** | no |
| mobile, `layout: 'pannable'` | **cover × `mobileZoom`** | yes, if wider than the stage |

The stage is full viewport width × `100dvh - 56px` (`world.css:10`). On a 390×844 phone that's
**390 × 788**.

## `mobileZoom`

A multiple of cover-fit. Default `1`.

- **`1` = cover** — the photo exactly fills the stage. No letterbox bands, maximum detail, maximum
  pan travel.
- **`< 1`** — pulls back. Less pan travel, but black bands appear top and bottom.
- **`> 1`** — pushes in. More pan travel, and the photo is now taller than the stage so it gets
  cropped vertically — which is when `focal.y` starts doing something.

Clamped so a bad value can never shrink the photo below contain-fit.

### What that means for a 16:9 source

Your existing scene photos are 1920×1080. On a 390×788 stage, cover-fit renders them **1401px
wide** — 3.6 screens, so **2.6 screens of pan travel**.

| `mobileZoom` | rendered | pan travel | letterbox bands |
|---|---|---|---|
| 1.0 (cover) | 1401 × 788 | 2.6 screens | none |
| 0.75 | 1051 × 591 | 1.7 screens | 98px each |
| 0.55 | 771 × 434 | 1.0 screens | 177px each |
| 0.42 | 585 × 329 | 0.5 screens | 230px each |
| 0.28 | 390 × 219 | none | 285px each |

There's a hard trade here and no way around it: a wide photo in a tall frame either fills the frame
(and is very wide) or shows bands. Pick per scene by how spread out the hotspots are. A scene with
one centred hotspot wants a lower zoom; a scene with hotspots at x=0.06 and x=0.94 wants cover.

Current values: `start_house` 1, `summertime_house` 1, `desert_house` 0.75.

## `focal`

The point held at the **centre of the mobile viewport**. Both components are 0–1 fractions of the
rendered image.

- **`focal.x`** — where the pan starts. `0.5` centres; `0.25` starts on the left quarter with most
  travel to the right; `0`/`1` pin to an edge. Clamped to the image, so you can't pan off into
  empty space. Not a crop — everything else is still reachable by dragging.
- **`focal.y`** — vertical framing, and it **only has an effect when `mobileZoom > 1`** (below that
  the photo is not taller than the stage, so there's nothing to choose). Otherwise it's inert.

On `static` scenes `focal` does nothing at all.

## `imageTall` (optional)

If you *can* supply a taller crop for a scene, mobile will prefer it automatically — no code
change, just drop the file in `src/assets/images/scenes/` under the filename already declared
(`start_house_tall.png`, `desert_house_tall.png`, `blue_house_tall.png`).

Why bother: a taller source composes better on a phone and wastes fewer pixels. A 4:5 crop
(e.g. 1920×2400) cover-fits to 630px wide — 0.6 screens of travel with no bands, which is a
gentler mobile experience than 2.6 screens.

**The catch if you do:** each hotspot has a single `anchor` shared by both crops
(`world.types.ts:47`), interpreted as a percentage of whichever image is rendering. So a tall crop
that reframes the scene puts the hotspots in the wrong place on mobile. Keeping the **same
left-to-right extent** and extending vertically preserves `anchor.x` exactly (which is what panning,
edge indicators and focus-panning key off); only `anchor.y` drifts, which is cosmetic. If that drift
becomes visible, the fix is an optional `anchorTall?: Vec2` on `Hotspot` falling back to `anchor`.

## Checking your work

Open `/` in devtools at 390px wide. You should be able to drag the photo horizontally, and hotspots
outside the viewport should appear as chevron edge indicators at the frame. Tapping an indicator
pans to that hotspot without activating it.

`reportWorld` runs at dev boot and warns if `mobileZoom` is set on a non-pannable scene (where it
does nothing).

## Note on `static` scenes

They contain-fit on mobile too, and some sources are extreme: `lj_chat_world.jpg` is 4512×3008
(landscape) and will render as a ~260px-tall strip in a 788px stage. If that reads badly, those
scenes want either the same cover treatment or a different crop — not addressed here.
