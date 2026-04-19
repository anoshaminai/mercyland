# Spec: Flat View of the Void — Redesign (v3)

## Context
The site has two views: the **void view** (interactive, where all images/videos/links live as clickable objects) and the **flat view** (this page — a linear scroll). This spec covers the flat view only. The retired Kid A / Get Lost! episode sections exist in the void view, not here.

---

## Color System

Add these to the existing styling system as CSS variables:

```css
:root {
  --nav-bg: #758e91;          /* nav bar — slate blue-gray */
  --nav-text: #000000;        /* nav text — black */
  --influences-bg: #022b01;   /* influences section — dark green */
  --influences-text: #848f56; /* influences text — muted olive */
  --termites-bg: #32262c;     /* termites section — dark maroon */
}
```

All other colors in the page (display red, nav accent green, body black, body white) stay as they are.

---

## Typography

**Display:** Eskapade Fraktur — in the `day4ecd` Typekit.
- Regular weight: major headings ("Mercy Land," "Termites," "Currently based in Los Angeles")
- Italic: nav bar text

**Body / UI:** Keep current mono/typewriter font.

### Typekit setup

The kit must include **both** Eskapade Fraktur Regular and Eskapade Fraktur Italic. To activate:

1. Sign in to [fonts.adobe.com](https://fonts.adobe.com) with the account that owns the `day4ecd` kit
2. Go to **My Adobe Fonts → Web Projects** and open the kit
3. Search for "Eskapade Fraktur"
4. Add **Regular (400)** and **Italic (400)** to the kit
5. Save/publish — changes propagate to the CDN within a minute
6. Verify by loading `https://use.typekit.net/day4ecd.css` in a browser; both `font-style: normal` and `font-style: italic` `@font-face` rules should appear

### Markup + CSS

```html
<link rel="stylesheet" href="https://use.typekit.net/day4ecd.css">
```

```css
h1, h2, .display {
  font-family: "eskapade-fraktur", serif;
  font-weight: 400;
  font-style: normal;
}
.nav {
  font-family: "eskapade-fraktur", serif;
  font-weight: 400;
  font-style: italic;
}
```

---

## Smart Link

**Odesli (song.link)** for the EP stream link. Free, no account, routes to listener's preferred service. Generate one link for Termites EP at [song.link](https://song.link/) and use for LISTEN TO THE EP.

---

## Layout (top → bottom)

### 1. Header / Nav
- Background: `--nav-bg` (#758e91)
- Text: `--nav-text` (black), Eskapade Fraktur italic
- Reduce vertical height (less tall than current)
- Items unchanged: INFO | LISTEN | WATCH 'TERMITES' | ENTER THE VOID

### 2. Intro bio paragraph
Centered body text on black. "Mercy Land is a duo making music from somewhere between the bayou and the freeway. Loud, soft, and full of teeth." (placeholder, subject to change)

### 3. Bayou image + "Mercy Land" title overlay
Full-bleed landscape image, large red Fraktur "Mercy Land" overlaid.

### 4. Handwritten "Dear L.J." letter
Centered image on black.

### 5. Influences block
- Background: `--influences-bg` (#022b01 — dark green)
- Text color: `--influences-text` (#848f56 — muted olive)
- Two columns: duo "touching" portrait left, influences paragraph right
- **Red border on the portrait image:** double/offset effect — a thin magenta/pink outer line with a red inner line, slightly offset. Can be done with a layered approach (e.g. `border` + `outline` with offset, or an SVG/inline wrapper) — match the reference asset.

### 6. Wide landscape image
New asset: **`parking-lot-wide-run`**. Full-bleed, same treatment as the bayou image in section 3 (edge-to-edge, no container padding). No text overlay unless specified later.

### 7. "Currently based in Los Angeles..." overlay
- Couple image with red Fraktur text layered on top
- **Fix:** remove the text bleed-through currently visible behind the heading — looks like the influences paragraph is overflowing into this section. Isolate this block so nothing from the previous section leaks through (likely needs a `position: relative` container with `overflow: hidden`, or a clean section break).

### 8. Termites section
- Background: `--termites-bg` (#32262c — dark maroon)
- Two-column asymmetric grid layout:

```
┌─────────────────┬──────────────────────┐
│                 │  Termites 2025       │
│   Single Art    │  (title + year ghost)│
│                 │                      │
│                 │  [INFO TEXT]         │
│                 │                      │
│                 │  [LISTEN TO THE EP]  │
│                 │  [WATCH THE FILM]    │
├─────────────────┼──────────────────────┤
│                 │                      │
│   Single Art    │   Single Art (wide)  │
│                 │                      │
├─────────────────┼──────────────────────┤
│                 │                      │
│   Single Art    │   Single Art         │
│                 │                      │
└─────────────────┴──────────────────────┘
```

- **Title:** "Termites" in red Fraktur, with "2025" ghosted behind
- **INFO TEXT block:** new space under the title for a short description (copy TBD — will be written)
- **Buttons:** LISTEN TO THE EP → Odesli smart link | WATCH THE FILM → YouTube URL
- **Single art grid:** fills remaining cells with actual cover images (pulled from current Music section)

### 9. Press drop block
Short text left, office magazine cover right (article link — URL TBD).

### 10. Footer
Centered stack: Spotify | Instagram | TikTok (open in new tab).

---

## Removed from flat view
- Kid A episode section (pink block)
- Get Lost! episode section (pink block)

These assets continue to live in the void view as clickable objects.

---

## Assets Needed
- Bayou/landscape hero image ✓
- Final-res "Dear L.J." letter scan
- Duo "touching" portrait (w/ double red border) ✓
- **`parking-lot-wide-run`** — new wide landscape image (full-bleed)
- "Currently based in LA" couple image
- Termites hero image
- Single art covers (pull from current Music section)
- Office magazine cover image

## Copy (placeholder, subject to change)
- Intro bio paragraph
- Influences paragraph
- "Currently based in Los Angeles..." overlay line
- **Termites INFO TEXT** (new — description under the title)
- Press drop / info drop block

## Links to fill in later
- YouTube URL for WATCH THE FILM
- Odesli smart link for the Termites EP
- Article URL for press drop block

---

## Changelog

**v3 (2026-04-19)**
- Typekit: added explicit activation instructions for Eskapade Fraktur Regular + Italic
- Red border on touching image: confirmed double/offset magenta+red effect
- `parking-lot-wide-run`: confirmed full-bleed treatment matching bayou image
- INFO TEXT under Termites: confirmed as new copy (TBD)

**v2 (2026-04-19)**
- Added color system variables (nav, influences section, termites section)
- Nav: new bg/text color, Eskapade italic, reduced height
- Influences section: bg/text colors, red border on touching image
- New `parking-lot-wide-run` image after influences
- Fix text bleed-through in "Currently based in LA" section
- Termites section: bg color, restructured grid layout, added INFO TEXT block