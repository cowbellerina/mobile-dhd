"""Renders the chevron tile atlases from art/chevrons/chevron-layout.svg into the app's asset catalog.

Run inside Blender (or use scripts/render_dhd.sh, which runs this after the DHD layers):
    $BLENDER -b --python-exit-code 1 -P scripts/blender/render_chevrons.py -- \
        --svg art/chevrons/chevron-layout.svg --assets DHD/Resources/Assets.xcassets [--samples 128] [--scale 3]

Each tile is a small cast-metal plate in the DHD's materials: a dark recessed well, a raised square rim and the glyph
embossed in the well. Two atlases, both from the same orthographic camera so tiles line up with
`ChevronArtwork.atlasOrder`:
- ChevronAtlasBase: every tile unlit (saved addresses in the Cartouche)
- ChevronAtlasLit:  every tile lit, rim and glyph glowing amber (a locked chevron on the DHD screen)

The scene is built in memory from the SVG on every run; nothing is saved.
"""

import argparse
import json
import math
import sys
from pathlib import Path

import bpy
from mathutils import Matrix, Vector

sys.dont_write_bytecode = True  # no __pycache__ in scripts/blender
sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_dhd_scene as dhd  # noqa: E402  (materials and mesh helpers shared with the DHD)

MM = 0.001

# Per part: (bottom z, top z, bevel) in mm, 1 chevron unit = 1 mm (a tile is 72 mm).
SHAPES = {
    "well": (0, 2.5, 0.5),
    "frame": (0, 5.0, 0.7),
    "glyph": (2.5, 4.2, 0.4),
}
UNLIT = {"well": "ChevronWell", "frame": "KeyMetal", "glyph": "GlyphInlay"}
# A dialed chevron glows white, frame and glyph, like the Expo app's chevron display.
LIT = {"well": "ChevronWell", "frame": "FrameWhite", "glyph": "GlyphInlayWhite"}


def parse_args() -> argparse.Namespace:
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--svg", required=True, type=Path)
    parser.add_argument("--assets", required=True, type=Path)
    parser.add_argument("--samples", type=int, default=128)
    parser.add_argument("--scale", type=float, default=3, help="pixels per chevron unit")
    return parser.parse_args(argv)


def part(name: str) -> str:
    """`tile-<slug>-frame` → frame, `tile-<slug>-glyph[-n]` → glyph."""
    return "frame" if name.endswith("-frame") else "glyph"


def import_layout(svg: Path) -> tuple[float, float]:
    """Imports the layout, scaled so 1 SVG unit = 1 mm with the atlas spanning (0, 0)…(width, height) mm, y up.
    Returns the atlas size in metres."""
    bpy.ops.import_curve.svg(filepath=str(svg))
    frame = bpy.data.objects["frame"]
    corners = [frame.matrix_world @ Vector(c) for c in frame.bound_box]
    low = Vector((min(c.x for c in corners), min(c.y for c in corners), 0))
    high = Vector((max(c.x for c in corners), max(c.y for c in corners), 0))
    width_units = float(svg.read_text().split('viewBox="0 0 ', 1)[1].split()[0])
    scale = width_units * MM / (high.x - low.x)
    transform = Matrix.Scale(scale, 4) @ Matrix.Translation(-low)
    curves = [o for o in bpy.data.objects if o.type == "CURVE"]
    for obj in curves:
        obj.data.transform(transform @ obj.matrix_world)
        obj.matrix_world = Matrix.Identity(4)
        for spline in obj.data.splines:
            for point in spline.bezier_points:
                point.radius = 1
            for point in spline.points:
                point.radius = 1
    size = ((high.x - low.x) * scale, (high.y - low.y) * scale)
    curves = [o for o in curves if o is not frame]
    bpy.data.objects.remove(frame)
    tiles = bpy.data.collections.new("Tiles")
    bpy.context.scene.collection.children.link(tiles)
    for obj in curves:
        tiles.objects.link(obj)
    for collection in list(bpy.data.collections):
        if collection.name.endswith(".svg"):
            bpy.data.collections.remove(collection)
    return size


def tile_bounds(obj) -> tuple[Vector, Vector]:
    points = dhd.spline_points(obj)
    return (Vector((min(p.x for p in points), min(p.y for p in points), 0)),
            Vector((max(p.x for p in points), max(p.y for p in points), 0)))


def build_tiles(materials: dict) -> dict[str, list]:
    """Shapes the imported curves and adds a well under each frame. Returns objects by part."""
    parts = {"well": [], "frame": [], "glyph": []}
    for obj in [o for o in bpy.data.objects if o.type == "CURVE"]:
        kind = part(obj.name)
        obj.data.materials.clear()
        obj.data.materials.append(materials[UNLIT[kind]])
        dhd.shape(obj, *SHAPES[kind])
        parts[kind].append(obj)

    for frame in parts["frame"]:
        low, high = tile_bounds(frame)
        center = (low + high) / 2
        bottom, top, bevel = SHAPES["well"]
        bpy.ops.mesh.primitive_cube_add(size=1, location=(center.x, center.y, (bottom + top) / 2 * MM))
        well = bpy.context.active_object
        well.name = frame.name.replace("-frame", "-well")
        well.scale = ((high.x - low.x) - 2 * MM, (high.y - low.y) - 2 * MM, (top - bottom) * MM)
        modifier = well.modifiers.new("Bevel", "BEVEL")
        modifier.width = bevel * MM
        modifier.segments = 3
        well.data.materials.append(materials[UNLIT["well"]])
        parts["well"].append(well)

    curves = parts["frame"] + parts["glyph"]
    dhd.convert_to_meshes(curves)
    return parts


def build_stage(size: tuple[float, float], scale: float) -> None:
    scene = bpy.context.scene
    width, height = size

    camera = bpy.data.objects.new("RenderCam", bpy.data.cameras.new("RenderCam"))
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = max(width, height)
    camera.data.clip_end = 10
    camera.location = (width / 2, height / 2, 2)
    scene.collection.objects.link(camera)
    scene.camera = camera

    # Same direction as the DHD's key light (upper-left, low and raking) but a sun, so every tile is lit alike.
    key = bpy.data.objects.new("KeyLight", bpy.data.lights.new("KeyLight", "SUN"))
    key.data.energy = 3.2
    key.data.color = (1.0, 0.97, 0.94)
    key.data.angle = math.radians(4)
    direction = Vector((0.45, -0.95, -0.85))  # pointing from upper-left down onto the tiles
    key.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(key)

    fill = bpy.data.objects.new("FillLight", bpy.data.lights.new("FillLight", "SUN"))
    fill.data.energy = 0.25
    fill.data.color = (0.8, 0.86, 1.0)
    fill.rotation_euler = Vector((-0.8, 0.3, -0.9)).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(fill)

    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    nodes, links = world.node_tree.nodes, world.node_tree.links
    environment = nodes.new("ShaderNodeTexEnvironment")
    environment.image = bpy.data.images.load(str(dhd.ASSETS / "studio_small_08/hdri.exr"), check_existing=True)
    links.new(environment.outputs["Color"], nodes["Background"].inputs["Color"])
    nodes["Background"].inputs["Strength"].default_value = 0.08
    scene.world = world

    scene.render.engine = "CYCLES"
    scene.render.resolution_x = round(width / MM * scale)
    scene.render.resolution_y = round(height / MM * scale)
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.compression = 100
    # No render metadata in the PNGs: it would embed the local .blend path and render date.
    for flag in [name for name in dir(scene.render) if name.startswith("use_stamp")]:
        setattr(scene.render, flag, False)
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.cycles.use_denoising = True
    preferences = bpy.context.preferences.addons["cycles"].preferences
    preferences.compute_device_type = "METAL"
    preferences.get_devices()
    gpus = [device for device in preferences.devices if device.type == "METAL"]
    for device in preferences.devices:
        device.use = device in gpus
    scene.cycles.device = "GPU" if gpus else "CPU"


def apply(parts: dict, materials: dict, mapping: dict[str, str]) -> None:
    for kind, objects in parts.items():
        for obj in objects:
            obj.material_slots[0].material = materials[mapping[kind]]


def render(name: str, assets: Path) -> None:
    imageset = assets / f"{name}.imageset"
    imageset.mkdir(parents=True, exist_ok=True)
    bpy.context.scene.render.filepath = str((imageset / f"{name}.png").resolve())
    bpy.ops.render.render(write_still=True)
    contents = {"images": [{"filename": f"{name}.png", "idiom": "universal"}], "info": {"author": "xcode", "version": 1}}
    (imageset / "Contents.json").write_text(json.dumps(contents, indent=2) + "\n")
    print(f"RENDERED {name}")


def main() -> None:
    args = parse_args()
    bpy.ops.wm.read_factory_settings(use_empty=True)
    materials = dhd.build_materials()
    # The lit chevron: pale cast metal with a white glow on the frame, and a white glowing glyph. Moderate emission
    # keeps the metal texture visible instead of blowing out to a flat shape under AgX.
    materials["FrameWhite"] = dhd.textured("FrameWhite", "rust_coarse_01", tile=0.22, tint=(0.95, 0.95, 0.95),
                                           saturation=0.0, value=0.6, metallic=0.55, roughness=(0.35, 0.7),
                                           normal_strength=0.9, edge_wear=0.8, grime=0.4)
    dhd.add_glow(materials["FrameWhite"], (1.0, 1.0, 1.0), strength=0.9)
    materials["GlyphInlayWhite"] = dhd.flat("GlyphInlayWhite", (0.8, 0.8, 0.8), roughness=0.5,
                                            emission=(1.0, 1.0, 1.0), strength=0.9)
    # Plain dark metal: the rust texture's streaks read as lines across an empty well at chevron size.
    materials["ChevronWell"] = dhd.flat("ChevronWell", (0.025, 0.025, 0.025), roughness=0.8, metallic=0.5)
    size = import_layout(args.svg)
    parts = build_tiles(materials)
    print(f"TILES {len(parts['frame'])} GLYPHS {len(parts['glyph'])}")
    build_stage(size, args.scale)
    bpy.context.scene.cycles.samples = args.samples

    apply(parts, materials, UNLIT)
    render("ChevronAtlasBase", args.assets)
    apply(parts, materials, LIT)
    render("ChevronAtlasLit", args.assets)


main()
