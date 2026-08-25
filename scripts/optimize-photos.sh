#!/usr/bin/env bash
# Recompress web photos (BTS gallery, band shots) so they aren't shipping
# camera-quality JPEGs to phones.
#
# Two steps per file, both via ffmpeg (no ImageMagick on this machine):
#   1. cap the long edge at MAX_EDGE, never upscaling a smaller source
#   2. re-encode at QUALITY and drop all metadata
#
# Originals are MOVED to <dir>.originals/ — a sibling of the target dir, so
# the gallery's `summertime_bts/*` glob can't see it and it never reaches the
# build. Nothing is deleted; check the output, then delete that folder.
#
# EXIF caveat: -map_metadata -1 strips the orientation flag, and ffmpeg does
# not bake rotation into the pixels. A source with orientation 3/6/8 would
# come out visibly rotated, so the script refuses those files instead of
# silently mangling them. (Orientation 1 / no-EXIF are safe and the norm for
# AirDropped iPhone photos.)
#
# Usage:   ./scripts/optimize-photos.sh [dir] [max-edge] [quality]
# Default: ./scripts/optimize-photos.sh src/assets/images/summertime_bts 2048 4
#
# QUALITY is ffmpeg -q:v: 2 = near-lossless/large, 31 = tiny/ugly. 4 ≈ JPEG
# q85, which is invisible in a gallery box that is ~900 CSS px at its widest.

set -euo pipefail

DIR="${1:-src/assets/images/summertime_bts}"
MAX_EDGE="${2:-2048}"
QUALITY="${3:-4}"
BACKUP="${DIR%/}.originals"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg not found." >&2
  exit 1
fi

shopt -s nullglob nocaseglob
photos=("$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.png)
shopt -u nocaseglob
if [ ${#photos[@]} -eq 0 ]; then
  echo "No photos found in $DIR"
  exit 0
fi

# Refuse rotated sources rather than silently flipping them (see EXIF caveat).
rotated=()
for p in "${photos[@]}"; do
  o="$(python3 "$(dirname "$0")/exif-orientation.py" "$p")"
  [ "$o" = "1" ] || [ "$o" = "none" ] || rotated+=("$(basename "$p") (orientation $o)")
done
if [ ${#rotated[@]} -gt 0 ]; then
  echo "Error: these files carry a rotating EXIF orientation and would be" >&2
  echo "re-encoded sideways. Rotate them in an editor first, then re-run:" >&2
  printf '  %s\n' "${rotated[@]}" >&2
  exit 1
fi

mkdir -p "$BACKUP"
before=$(du -sk "$DIR" | cut -f1)

for p in "${photos[@]}"; do
  name="$(basename "$p")"
  tmp="$DIR/.opt-$name"
  # Long edge to MAX_EDGE, short edge auto (-2 keeps it even, required by
  # yuvj420p); min() so an already-small photo is never blown up.
  ffmpeg -nostdin -v error -y -i "$p" \
    -vf "scale='if(gt(iw,ih),min($MAX_EDGE,iw),-2)':'if(gt(iw,ih),-2,min($MAX_EDGE,ih))':flags=lanczos" \
    -q:v "$QUALITY" -pix_fmt yuvj420p -map_metadata -1 \
    "$tmp"
  old=$(stat -c%s "$p"); new=$(stat -c%s "$tmp")
  mv "$p" "$BACKUP/$name"
  mv "$tmp" "$p"
  printf '  %-22s %6s KB → %5s KB  (-%d%%)\n' \
    "$name" "$((old / 1024))" "$((new / 1024))" "$(((old - new) * 100 / old))"
done

after=$(du -sk "$DIR" | cut -f1)
echo ""
echo "${#photos[@]} photos: $((before / 1024)) MB → $((after / 1024)) MB"
echo "Originals moved to $BACKUP/ — verify the gallery, then delete that folder."
