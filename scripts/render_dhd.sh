#!/bin/sh
# Renders the DHD artwork layers and the chevron atlases into DHD/Resources/Assets.xcassets.
#   scripts/render_dhd.sh [--samples N] [--resolution PX]   (options apply to the DHD layers only)
# Builds art/dhd/dhd.blend from the committed art/dhd/dhd-layout.svg only when it's missing; an existing .blend
# (possibly hand-edited) is rendered as is. Geometry changes must also go into DHD/Artwork/DHDArtwork+Paths.swift,
# the touch surface; DHDRenderAlignmentTests catches drift.
set -eu
cd "$(dirname "$0")/.."
BLENDER=${BLENDER:-/Applications/Blender.app/Contents/MacOS/Blender}

scripts/blender/fetch_assets.py  # CC0 textures/HDRI the .blend references; skips files already present

if [ ! -f art/dhd/dhd.blend ]; then
    # Neutral HOME: Blender saves its file-browser default (the home directory) into the .blend.
    HOME=/var/empty "$BLENDER" -b --python-exit-code 1 -P scripts/blender/build_dhd_scene.py -- \
        --svg art/dhd/dhd-layout.svg --out art/dhd/dhd.blend
fi
"$BLENDER" -b --python-exit-code 1 -P scripts/blender/render_dhd_layers.py -- \
    --blend art/dhd/dhd.blend --assets DHD/Resources/Assets.xcassets "$@"
"$BLENDER" -b --python-exit-code 1 -P scripts/blender/render_chevrons.py -- \
    --svg art/chevrons/chevron-layout.svg --assets DHD/Resources/Assets.xcassets
