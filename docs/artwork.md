# Artwork

## Geometry

The DHD and chevron glyphs are SVG path data, originally taken from the Expo app (tag `v1.1.0`). The same shapes
live in two places, edited by hand:

- `DHD/Artwork/DHDArtwork+Paths.swift` and `DHD/Artwork/ChevronArtwork+Paths.swift`: what the app uses.
- `art/dhd/dhd-layout.svg` and `art/chevrons/chevron-layout.svg`: the input for the Blender scenes.

Changing only the look (materials, lights, textures) needs neither. When you move or reshape a key or the dome, update
both, then rebuild the scene and re-render (below).

The paths, in the artwork's 900×900 coordinate space, are the DHD's touch surface: taps are hit-tested against the key
and dome paths (`DHDArtwork.target(at:)`), and VoiceOver elements use their bounds. The chevron paths are the source
of the rendered chevron tiles (below).

## Rendered DHD

The DHD itself is drawn from three pre-rendered, pixel-aligned images in the asset catalog: `DHDBase` (unlit),
`DHDKeysLit` (every key lit and pressed) and `DHDDomeLit`. `DialHomeDeviceView` shows the base, then the lit keys
clipped to each dialed key's path, then the lit dome clipped to the dome path.

The images are rendered with [Blender](https://www.blender.org) 5.2+ (`brew install --cask blender`):

| Step | File |
|---|---|
| Layout SVG | `art/dhd/dhd-layout.svg` |
| CC0 textures and HDRI from [Poly Haven](https://polyhaven.com), pinned by checksum, git-ignored | `art/dhd/assets/` (`scripts/blender/fetch_assets.py`) |
| 3D scene: cast-metal keys with embossed glyphs, textured materials, lights, orthographic top-down camera | `art/dhd/dhd.blend` (`scripts/blender/build_dhd_scene.py`) |
| Renders into `DHD/Resources/Assets.xcassets` | `scripts/blender/render_dhd_layers.py` |

`art/dhd/dhd.blend` is the hand-editable source of the look: open it in Blender, tweak materials, lights or modelling,
save, then re-render. The cast metal comes from a photo texture (`rust_coarse_01`, graded almost to grey) plus edge
wear and cavity grime driven by the shape; the pedestal uses `concrete_floor_damaged_01`. Glyphs are embossed: each
`key-<slug>-symbol` object rises ~1.8 mm above its key's panel with bevelled edges. A dialed key lights its
rim (the plate, `KeyMetal` → `KeyMetalLit`) and glyph only; the raised panel (`KeyPanel`) is never swapped. The dome is
red glass over a red volume (`DomeCrystal`) on a polished floor; lit, the volume glows.
Keep the `RenderCam` camera and the object and material names (`KeyMetal`/`KeyMetalLit`,
`GlyphInlay`/`GlyphInlayLit`, `DomeCrystal`/`DomeCrystalLit`), which the render script swaps between states.

```bash
scripts/render_dhd.sh                                # 2048 px, 256 samples, ~11 min on an M1 Pro GPU
scripts/render_dhd.sh --resolution 1024 --samples 64 # quick draft
```

`render_dhd.sh` builds the scene only if `art/dhd/dhd.blend` is missing. After changing the layout SVG, rebuild the
scene so renders and touch surface match again. To rebuild it from the script (this discards hand edits):

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b --python-exit-code 1 -P scripts/blender/build_dhd_scene.py -- \
    --svg art/dhd/dhd-layout.svg --out art/dhd/dhd.blend --force
```

`DHDRenderAlignmentTests` checks that the lit layers only change pixels inside the key and dome paths, and that every
key visibly lights up. Run it after every re-render; if it fails, the renders have drifted from the touch surface
(usually a camera or modelling change).

## App icon

`DHD/Resources/AppIcon.icon` is an Icon Composer document: the keystone frame and the point-of-origin glyph as two
white SVG layers (`Assets/frame.svg`, `Assets/glyph.svg`) over black, so iOS 26 renders them as Liquid Glass and
derives the dark, clear and tinted variants. Xcode also generates flat fallback icons for older iOS from it. Open it in
Icon Composer (in Xcode's Developer Tools) to tweak the glass, or preview a variant from the command line:

```bash
"/Applications/Xcode.app/Contents/Applications/Icon Composer.app/Contents/Executables/ictool" \
    DHD/Resources/AppIcon.icon --export-image --output-file icon.png --platform iOS --rendition ClearDark \
    --width 1024 --height 1024 --scale 1
```

## Colours

Colours live in `DHD/Resources/Assets.xcassets` as named colours, used through Xcode's generated symbols
(`Color(.stageLight)`, `UIColor(resource: .barBackground)`). `AccentColor` is the amber of a lit chevron and the app's
global accent; `Stage*` are the stops of the `StageBackground` gradient; `Bar*` style
the tab bar.

## Rendered chevrons

The chevron display draws each slot from one of two atlases, also rendered in Blender: `ChevronAtlasBase` (unlit
tiles; its placeholder fills empty slots) and `ChevronAtlasLit` (rim and glyph glowing white, a locked chevron).
Each tile is a 72 mm cast-metal plate in the DHD's materials: a dark well, a raised square rim and the glyph embossed
in the well. `art/chevrons/chevron-layout.svg` lays every tile out in a grid, in the order of
`ChevronArtwork.atlasOrder`, which `ChevronArtwork.atlasTile(for:)` uses to cut a tile from an atlas. Keep the two in
sync. The layout's path data uses absolute commands with spaced numbers, because Blender's SVG importer misreads
minified path data.

`scripts/blender/render_chevrons.py` builds the tile scene in memory (no `.blend`) and renders both atlases;
`render_dhd.sh` runs it after the DHD layers. To render only the chevrons:

```bash
/Applications/Blender.app/Contents/MacOS/Blender -b --python-exit-code 1 -P scripts/blender/render_chevrons.py -- \
    --svg art/chevrons/chevron-layout.svg --assets DHD/Resources/Assets.xcassets   # ~1 min
```

## Effects

Around the renders, `DialHomeDeviceView` adds what a photo can't: a contact shadow, a bloom over lit keys and the
dome, keys that sink while pressed, a dome that breathes while it waits, and the kawoosh (`DHD/Effects/WormholeEffect.swift`) when a wormhole
forms. `DHDScreen` puts it all on a dim stage lit from the upper left; on a device, the light and shadow drift a few
points with the tilt (`DeviceTilt`). Reduce Motion turns off the tilt, the breathing, the lock-in spring and the
kawoosh motion.
