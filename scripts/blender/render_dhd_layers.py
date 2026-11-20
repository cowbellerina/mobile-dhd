"""Renders the DHD layers from art/dhd/dhd.blend into the app's asset catalog. Never saves the .blend.

Run inside Blender (or use scripts/render_dhd.sh):
    $BLENDER -b --python-exit-code 1 -P scripts/blender/render_dhd_layers.py -- \
        --blend art/dhd/dhd.blend --assets DHD/Resources/Assets.xcassets [--samples 256] [--resolution 2048]

Layers, all from the same orthographic RenderCam so they stay pixel-aligned with DHDArtwork's paths:
- DHDBase:    everything unlit
- DHDKeysLit: every key lit and pressed in, panels held out (transparent) so the app's unlit panels show through
             instead of panels brightened by the glow of all 38 keys; the app clips it to each dialed key's path
- DHDDomeLit: the dome lit; the app clips it to the dome path
"""

import argparse
import json
import sys
from pathlib import Path

import bpy

MM = 0.001
PRESS_DEPTH = 1.5 * MM

# Unlit material → lit material, per state.
KEY_SWAPS = {"KeyMetal": "KeyMetalLit", "GlyphInlay": "GlyphInlayLit"}
DOME_SWAPS = {"DomeCrystal": "DomeCrystalLit"}


def parse_args() -> argparse.Namespace:
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--blend", required=True, type=Path)
    parser.add_argument("--assets", required=True, type=Path)
    parser.add_argument("--samples", type=int, default=256)
    parser.add_argument("--resolution", type=int, default=2048)
    return parser.parse_args(argv)


def swap_materials(objects, swaps: dict[str, str]) -> None:
    for obj in objects:
        for slot in obj.material_slots:
            if slot.material and slot.material.name in swaps:
                slot.material = bpy.data.materials[swaps[slot.material.name]]


def render(name: str, assets: Path) -> None:
    imageset = assets / f"{name}.imageset"
    imageset.mkdir(parents=True, exist_ok=True)
    scene = bpy.context.scene
    scene.render.filepath = str((imageset / f"{name}.png").resolve())
    bpy.ops.render.render(write_still=True)
    contents = {"images": [{"filename": f"{name}.png", "idiom": "universal"}], "info": {"author": "xcode", "version": 1}}
    (imageset / "Contents.json").write_text(json.dumps(contents, indent=2) + "\n")
    print(f"RENDERED {name}")


def open_scene(args: argparse.Namespace) -> None:
    """(Re)loads the .blend, discarding any material swaps, and applies the render settings."""
    bpy.ops.wm.open_mainfile(filepath=str(args.blend.resolve()))
    scene = bpy.context.scene
    scene.cycles.samples = args.samples
    scene.render.resolution_x = scene.render.resolution_y = args.resolution
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.compression = 100
    # No render metadata in the PNGs: it would embed the local .blend path and render date.
    for flag in [name for name in dir(scene.render) if name.startswith("use_stamp")]:
        setattr(scene.render, flag, False)
    use_metal(scene)


def use_metal(scene) -> None:
    """Device choice lives in user preferences, not the .blend; without this, headless runs render on the CPU."""
    preferences = bpy.context.preferences.addons["cycles"].preferences
    preferences.compute_device_type = "METAL"
    preferences.get_devices()
    gpus = [device for device in preferences.devices if device.type == "METAL"]
    for device in preferences.devices:
        device.use = device in gpus
    scene.cycles.device = "GPU" if gpus else "CPU"
    print(f"DEVICE {scene.cycles.device}: {', '.join(d.name for d in gpus) or 'no Metal GPU'}")


def main() -> None:
    args = parse_args()

    open_scene(args)
    render("DHDBase", args.assets)

    keys = list(bpy.data.collections["Keys"].objects)
    for obj in keys:
        obj.is_holdout = any(slot.material and slot.material.name == "KeyPanel" for slot in obj.material_slots)
    swap_materials(keys, KEY_SWAPS)
    for obj in keys:
        obj.location.z -= PRESS_DEPTH
    render("DHDKeysLit", args.assets)

    open_scene(args)
    swap_materials(list(bpy.data.collections["Dome"].objects), DOME_SWAPS)
    render("DHDDomeLit", args.assets)


main()
