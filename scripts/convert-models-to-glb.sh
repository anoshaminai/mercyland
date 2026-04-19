#!/usr/bin/env bash
# Convert all .obj files in src/assets/models/ to Draco-compressed .glb.
#
# Two-step pipeline: obj2gltf (OBJ→GLB) then gltf-pipeline (Draco mesh
# compression). obj2gltf's own --draco flag silently no-ops without a
# peer draco3d install, so we keep the two concerns separate.
#
# Prerequisite (one-time):  npm install -g obj2gltf
#                           (gltf-pipeline is fetched via npx)
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
  tmp="$MODELS_DIR/$name.tmp.glb"
  out="$MODELS_DIR/$name.glb"
  echo "→ $obj → $out"
  obj2gltf -i "$obj" -o "$tmp"
  npx -y gltf-pipeline -i "$tmp" -o "$out" --draco.compressMeshes
  rm "$tmp"
done

echo ""
echo "Converted ${#objs[@]} files. Sizes:"
ls -lh "$MODELS_DIR"/*.glb | awk '{print "  " $5 "  " $9}'
echo ""
echo "Next: verify in the app, then rm $MODELS_DIR/*.obj"
