# summertime — behind-the-scenes photos

Drop photos in this folder. They show up automatically in the "spy on them" overlay on the
`summertime_house` scene — no code change needed (`src/lib/bts-assets.ts` globs this folder).

- **Formats:** `.jpg` `.jpeg` `.png` `.webp` `.gif` `.avif`. Anything else is ignored.
- **Order:** filename order, natural-sorted (`02` before `10`). Prefix to control it: `01-x.jpg`,
  `02-y.jpg`.
- **Size:** these get bundled, so resize before committing — ~2000px on the long edge, under
  ~500KB each. Straight-off-the-camera 8MB files will bloat the build.
- Portrait and landscape both work; the gallery letterboxes rather than crops.
- **Captions** are optional and live in `btsCaptions` in `src/data/content-registry.tsx`, keyed
  by the exact filename (extension included, case-sensitive). No entry, or an empty string, means
  no caption. If you rename a file here, rename its key there too — a key pointing at a file that
  no longer exists is ignored silently.
- **Recompress before committing:** `./scripts/optimize-photos.sh`. It caps the long edge at
  2048px, re-encodes at ~q85, and parks the originals in `../summertime_bts.originals/`.

This README is only here to keep the folder in git and explain itself. It is not bundled.
