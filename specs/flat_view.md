# Spec: Flat View of the Void — Redesign (Final)

## Context
The site has two views: the **void view** (interactive, where all images/videos/links live as clickable objects) and the **flat view** (this page — a linear scroll). This spec covers the flat view only. The retired Kid A / Get Lost! episode sections are being removed *from the flat view*; they still exist in the void view along with everything else.

---

## Typography

**Display:** Eskapade Fraktur (regular) — already in the `day4ecd` Typekit. Used for major headings ("Mercy Land," "Termites," and the red/green display text throughout).

**Body / UI:** Keep current mono/typewriter font.

```html
<link rel="stylesheet" href="https://use.typekit.net/day4ecd.css">
```

```css
h1, h2, .display {
  font-family: "eskapade-fraktur", serif;
  font-weight: 400;
}
```

---

## Smart Link

**Odesli (song.link)** for the EP stream link. Free, no account needed, routes listeners to their preferred streaming service automatically. Generate one link for the Termites EP at [song.link](https://song.link/) and use it for the LISTEN TO THE EP button.

---

## Layout (top → bottom)

1. **Header / nav** — unchanged (INFO | LISTEN | WATCH 'TERMITES' | ENTER THE VOID)
2. **Intro bio paragraph** — centered body text, short
3. **Atmospheric background image + "Mercy Land" title overlay** — large red Fraktur on bayou/landscape image
4. **Handwritten "Dear L.J." letter** — centered image
5. **Influences block** — two columns: duo portrait left, influences paragraph right
6. **"Currently based in Los Angeles..." overlay** — couple image with red Fraktur text layered on top
7. **Termites section** — "Termites" in red Fraktur, "2026" ghosted behind, two CTAs:
   - **LISTEN TO THE EP** → Odesli smart link
   - **WATCH THE FILM** → single YouTube video URL (TBD)
   - 3-up grid of single art below (replaces blue square placeholders; pull covers from current Music section)
8. **Press drop block** — short text left, office magazine cover right (links to an article — URL TBD)
9. **Footer** — centered stack: Spotify | Instagram | TikTok (open in new tab)

---

## Removed from flat view

- Kid A episode section (pink block)
- Get Lost! episode section (pink block)

These assets continue to live in the void view as clickable objects.

---

## Assets Needed

- Bayou/landscape hero image
- Final-res "Dear L.J." letter scan
- Duo formal-wear portrait
- "Currently based in LA" couple image
- Termites hero image
- 3 single art covers (pull from current Music section)
- Office magazine cover image

## Copy (placeholder, subject to change)

- Intro bio paragraph
- Influences paragraph
- "Currently based in Los Angeles..." overlay line
- Press drop / info drop block
- Single/section subtitles

## Links to fill in later

- YouTube URL for WATCH THE FILM
- Odesli smart link for the Termites EP (generate after finalizing)
- Article URL for press drop block