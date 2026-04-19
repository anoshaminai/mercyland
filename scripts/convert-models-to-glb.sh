#!/usr/bin/env bash
# Convert all .obj files in src/assets/models/ to compressed .glb.
#
# Four-step pipeline:
#   1. obj2gltf           — OBJ → uncompressed GLB
#   2. gltf-transform     — resize textures to max 2048×2048
#   3. gltf-transform     — re-encode textures as WebP
#   4. gltf-pipeline      — apply Draco mesh compression
#
# obj2gltf's own --draco flag silently no-ops without a peer draco3d
# install, so we keep concerns separate. Resize must run before webp
# (resize decodes source format); both must run before draco (they
# decode mesh if Draco is already present).
#
# Prerequisite (one-time):  npm install -g obj2gltf
#                           (gltf-transform and gltf-pipeline via npx)
#
# Usage:                    ./scripts/convert-models-to-glb.sh
#
# After verifying the .glb files load correctly in the app, remove the
# originals:                rm src/assets/models/*.obj

set -euo pipefail

MODELS_DIR="src/assets/models"

if ! command -v obj2gltf >/dev/null 2>&1; then
  echo "Error: obj2gltf not found. Install with: npm install -g obj2gltf" >&2
  exit 1
fi

shopt -s nullglob
objs=("$MODELS_DIR"/*.obj)
if [ ${#objs[@]} -eq 0 ]; then
  echo "No .obj files found in $MODELS_DIR"
  exit 0
fi

for obj in "${objs[@]}"; do
  name="$(basename "$obj" .obj)"
  raw="$MODELS_DIR/$name.raw.glb"
  sized="$MODELS_DIR/$name.sized.glb"
  webp="$MODELS_DIR/$name.webp.glb"
  out="$MODELS_DIR/$name.glb"
  echo "→ $obj → $out"
  obj2gltf -i "$obj" -o "$raw"
  npx -y @gltf-transform/cli resize "$raw" "$sized" --width 2048 --height 2048
  npx -y @gltf-transform/cli webp "$sized" "$webp"
  npx -y gltf-pipeline -i "$webp" -o "$out" --draco.compressMeshes
  rm "$raw" "$sized" "$webp"
done

echo ""
echo "Converted ${#objs[@]} files. Sizes:"
ls -lh "$MODELS_DIR"/*.glb | awk '{print "  " $5 "  " $9}'
echo ""
echo "Next: verify in the app, then rm $MODELS_DIR/*.obj"
