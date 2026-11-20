"""Builds art/dhd/dhd.blend: a 3D DHD extruded from art/dhd/dhd-layout.svg, for render_dhd_layers.py.

Run inside Blender:
    $BLENDER -b -P scripts/blender/build_dhd_scene.py -- --svg art/dhd/dhd-layout.svg --out art/dhd/dhd.blend [--force]

The .blend is the hand-editable source of the DHD look. This script refuses to overwrite it unless --force is given.

Coordinates: 1 artwork unit = 1 mm. Artwork (x, y) (SVG, y down) maps to Blender (x, 900 - y) mm, so the 900×900
artwork spans 0…0.9 m on x and y, viewed from above by the orthographic RenderCam.
"""

import argparse
import math
import random
import sys
from pathlib import Path

import bmesh
import bpy
from mathutils import Euler, Matrix, Vector

ARTWORK_SIZE = 0.9  # metres: 900 artwork units at 1 mm each
MM = 0.001


def parse_args() -> argparse.Namespace:
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    parser = argparse.ArgumentParser()
    parser.add_argument("--svg", required=True, type=Path)
    parser.add_argument("--out", required=True, type=Path)
    parser.add_argument("--force", action="store_true")
    return parser.parse_args(argv)


# --- Materials -------------------------------------------------------------------------------------------------------
# Photo-based CC0 texture sets (scripts/blender/fetch_assets.py) projected from all six sides in object space, so the
# extruded curves need no UVs. Each object gets its own patch of texture (Object Info › Random), shape-driven edge wear
# (Bevel vs. true normal) and cavity grime (Ambient Occlusion), which is what makes metal read as cast and handled.

ASSETS = Path(__file__).resolve().parent.parent.parent / "art/dhd/assets"


class Graph:
    """Small helper for building a node tree in a material."""

    def __init__(self, material):
        self.nodes, self.links = material.node_tree.nodes, material.node_tree.links
        self.bsdf = self.nodes["Principled BSDF"]

    def node(self, kind: str, **inputs):
        node = self.nodes.new(kind)
        for name, value in inputs.items():
            node.inputs[name].default_value = value
        return node

    def link(self, output, input) -> None:
        self.links.new(output, input)

    def math(self, operation: str, a, b=None):
        node = self.nodes.new("ShaderNodeMath")
        node.operation = operation
        for index, value in enumerate((a, b)):
            if value is None:
                continue
            if isinstance(value, (int, float)):
                node.inputs[index].default_value = value
            else:
                self.link(value, node.inputs[index])
        return node.outputs[0]

    def map_range(self, value, from_range, to_range):
        node = self.node("ShaderNodeMapRange")
        node.clamp = True
        node.inputs["From Min"].default_value, node.inputs["From Max"].default_value = from_range
        node.inputs["To Min"].default_value, node.inputs["To Max"].default_value = to_range
        self.link(value, node.inputs["Value"])
        return node.outputs["Result"]

    def mix_color(self, factor, a, b):
        node = self.nodes.new("ShaderNodeMix")
        node.data_type = "RGBA"
        if isinstance(factor, (int, float)):
            node.inputs["Factor"].default_value = factor
        else:
            self.link(factor, node.inputs["Factor"])
        for socket, value in ((node.inputs[6], a), (node.inputs[7], b)):
            if isinstance(value, tuple):
                socket.default_value = (*value, 1)
            else:
                self.link(value, socket)
        return node.outputs[2]


def image(graph: Graph, path: Path, vector, color: bool):
    node = graph.nodes.new("ShaderNodeTexImage")
    node.image = bpy.data.images.load(str(path), check_existing=True)
    node.image.colorspace_settings.name = "sRGB" if color else "Non-Color"
    node.projection = "BOX"
    node.projection_blend = 0.25
    graph.link(vector, node.inputs["Vector"])
    return node


def textured(name: str, asset: str, tile: float, tint, saturation: float, value: float, metallic: float,
             roughness: tuple[float, float], normal_strength: float, edge_wear: float, grime: float):
    """A PBR material from the `asset` texture set, tiled every `tile` metres.

    Base color = texture desaturated to `saturation`, scaled by `value` and multiplied by `tint`. `edge_wear` (0…1) mixes
    a brighter, smoother worn metal onto convex edges; `grime` (0…1) darkens and roughens cavities.
    """
    material = bpy.data.materials.new(name)
    material.use_fake_user = True  # lit variants have no users until render time; keep them in the saved file
    material.use_nodes = True
    g = Graph(material)
    folder = ASSETS / asset

    coords = g.node("ShaderNodeTexCoord")
    info = g.node("ShaderNodeObjectInfo")
    offset = g.node("ShaderNodeVectorMath", Vector=(0, 0, 0))
    offset.operation = "SCALE"
    g.link(info.outputs["Random"], offset.inputs["Scale"])
    offset.inputs[0].default_value = (13.7, 7.3, 3.1)
    shifted = g.node("ShaderNodeVectorMath")
    shifted.operation = "ADD"
    g.link(coords.outputs["Object"], shifted.inputs[0])
    g.link(offset.outputs["Vector"], shifted.inputs[1])
    mapping = g.node("ShaderNodeMapping")
    mapping.inputs["Scale"].default_value = (1 / tile,) * 3
    g.link(shifted.outputs["Vector"], mapping.inputs["Vector"])
    vector = mapping.outputs["Vector"]

    diffuse = image(g, folder / "diff.jpg", vector, color=True)
    rough = image(g, folder / "rough.jpg", vector, color=False)
    normal = image(g, folder / "nor_gl.jpg", vector, color=False)
    height = image(g, folder / "disp.jpg", vector, color=False)

    graded = g.node("ShaderNodeHueSaturation", Saturation=saturation, Value=value)
    g.link(diffuse.outputs["Color"], graded.inputs["Color"])
    base = g.mix_color(1.0, graded.outputs["Color"], tint)
    base.node.blend_type = "MULTIPLY"

    # Edge wear: where the bevel-rounded normal leaves the true normal, the surface is a convex edge.
    geometry = g.node("ShaderNodeNewGeometry")
    bevel = g.node("ShaderNodeBevel")
    bevel.samples = 8
    bevel.inputs["Radius"].default_value = 1.2 * MM
    facing = g.node("ShaderNodeVectorMath")
    facing.operation = "DOT_PRODUCT"
    g.link(geometry.outputs["Normal"], facing.inputs[0])
    g.link(bevel.outputs["Normal"], facing.inputs[1])
    edge = g.map_range(facing.outputs["Value"], (0.995, 0.93), (0, 1))
    breakup = g.node("ShaderNodeTexNoise", Scale=180.0, Detail=8.0)
    g.link(coords.outputs["Object"], breakup.inputs["Vector"])
    edge = g.math("MULTIPLY", edge, g.map_range(breakup.outputs["Fac"], (0.35, 0.65), (0, 1)))
    edge = g.math("MULTIPLY", edge, edge_wear)

    # Grime: occluded cavities (gaps between keys, around the glyphs) collect dark dust.
    occlusion = g.node("ShaderNodeAmbientOcclusion")
    occlusion.samples = 16
    occlusion.only_local = False
    occlusion.inputs["Distance"].default_value = 6 * MM
    cavity = g.math("MULTIPLY", g.map_range(occlusion.outputs["AO"], (0.85, 0.35), (0, 1)), grime)

    worn = g.mix_color(edge, base, (0.42, 0.42, 0.41))
    dirty = g.mix_color(cavity, worn, (0.012, 0.011, 0.01))
    g.link(dirty, g.bsdf.inputs["Base Color"])

    roughness_value = g.map_range(rough.outputs["Color"], (0, 1), roughness)
    roughness_value = g.math("ADD", roughness_value, g.math("MULTIPLY", edge, -0.25))
    roughness_value = g.math("ADD", roughness_value, g.math("MULTIPLY", cavity, 0.3))
    g.link(roughness_value, g.bsdf.inputs["Roughness"])
    g.link(g.math("ADD", g.math("MULTIPLY", edge, 1 - metallic), metallic), g.bsdf.inputs["Metallic"])

    normal_map = g.node("ShaderNodeNormalMap", Strength=normal_strength)
    g.link(normal.outputs["Color"], normal_map.inputs["Color"])
    bump = g.node("ShaderNodeBump", Strength=0.5, Distance=0.6 * MM)
    g.link(height.outputs["Color"], bump.inputs["Height"])
    g.link(normal_map.outputs["Normal"], bump.inputs["Normal"])
    g.link(bump.outputs["Normal"], g.bsdf.inputs["Normal"])
    return material


def add_glow(material, color, strength: float, modulate_with_texture: bool = False) -> None:
    """Emission for the lit variants. `modulate_with_texture` makes the glow mottled, like light through stone."""
    g = Graph(material)
    g.bsdf.inputs["Emission Color"].default_value = (*color, 1)
    if modulate_with_texture:
        diffuse = next(n for n in g.nodes if n.type == "TEX_IMAGE" and n.image.name.startswith("diff"))
        luminance = g.node("ShaderNodeRGBToBW")
        g.link(diffuse.outputs["Color"], luminance.inputs["Color"])
        g.link(g.map_range(luminance.outputs["Val"], (0.05, 0.6), (0.35 * strength, 1.4 * strength)),
               g.bsdf.inputs["Emission Strength"])
    else:
        g.bsdf.inputs["Emission Strength"].default_value = strength


def crystal(name: str, glow: float):
    """Red crystal: clear glass surface with faceted (Voronoi) bumps over a red absorbing volume, so the dome reads as
    deep and translucent. `glow` adds a mottled red emission inside the volume (the lit dome)."""
    material = bpy.data.materials.new(name)
    material.use_fake_user = True
    material.use_nodes = True
    g = Graph(material)
    g.bsdf.inputs["Base Color"].default_value = (1.0, 0.06, 0.04, 1)
    g.bsdf.inputs["Transmission Weight"].default_value = 1.0
    g.bsdf.inputs["Roughness"].default_value = 0.06
    g.bsdf.inputs["IOR"].default_value = 1.55

    coords = g.node("ShaderNodeTexCoord")
    facets = g.node("ShaderNodeTexVoronoi", Scale=6.0)
    g.link(coords.outputs["Object"], facets.inputs["Vector"])
    bump = g.node("ShaderNodeBump", Strength=0.3, Distance=1 * MM)
    g.link(facets.outputs["Distance"], bump.inputs["Height"])
    g.link(bump.outputs["Normal"], g.bsdf.inputs["Normal"])

    volume = g.node("ShaderNodeVolumePrincipled", Density=18.0)
    volume.inputs["Color"].default_value = (0.9, 0.05, 0.03, 1)
    volume.inputs["Absorption Color"].default_value = (0.75, 0.02, 0.01, 1)
    if glow:
        volume.inputs["Emission Color"].default_value = (1.0, 0.03, 0.01, 1)
        cloud = g.node("ShaderNodeTexNoise", Scale=6.0, Detail=6.0)
        g.link(coords.outputs["Object"], cloud.inputs["Vector"])
        g.link(g.map_range(cloud.outputs["Fac"], (0.3, 0.7), (0.4 * glow, 1.3 * glow)), volume.inputs["Emission Strength"])
    output = next(n for n in g.nodes if n.type == "OUTPUT_MATERIAL")
    g.link(volume.outputs["Volume"], output.inputs["Volume"])
    return material


def flat(name: str, color, roughness: float, emission=None, strength: float = 0.0, metallic: float = 0.0):
    material = bpy.data.materials.new(name)
    material.use_fake_user = True
    material.use_nodes = True
    bsdf = material.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = strength
    return material


def build_materials() -> dict:
    # Cast iron: the rust texture desaturated almost to grey, so it reads as dark weathered metal, not brown rust.
    cast = dict(asset="rust_coarse_01", tile=0.22, saturation=0.1, metallic=0.55, normal_strength=0.9)
    materials = {
        "Stone": textured("Stone", "concrete_floor_damaged_01", tile=0.5, tint=(0.72, 0.72, 0.72), saturation=0.12,
                          value=0.22, metallic=0.0, roughness=(0.75, 0.95), normal_strength=1.0, edge_wear=0.2,
                          grime=0.6),
        "KeyMetal": textured("KeyMetal", tint=(0.74, 0.74, 0.74), value=0.38, roughness=(0.45, 0.85), edge_wear=0.8,
                             grime=0.9, **cast),
        # The raised panel inside each key's rim. Never swapped: a dialed key lights its rim and glyph only.
        "KeyPanel": textured("KeyPanel", tint=(0.74, 0.74, 0.74), value=0.38, roughness=(0.45, 0.85), edge_wear=0.8,
                             grime=0.9, **cast),
        # Lit rim: warm gold metal with an amber glow, like the Expo app's gold key plate.
        "KeyMetalLit": textured("KeyMetalLit", tint=(1.0, 0.62, 0.18), value=0.5, roughness=(0.35, 0.7),
                                edge_wear=0.8, grime=0.5, **cast),
        "RingDark": textured("RingDark", tint=(0.58, 0.58, 0.58), value=0.4, roughness=(0.5, 0.9), edge_wear=0.7,
                             grime=0.9, **cast),
        "RingDarker": textured("RingDarker", tint=(0.42, 0.42, 0.42), value=0.3, roughness=(0.6, 0.95),
                               edge_wear=0.4, grime=1.0, **cast),
        # Embossed glyphs: raised cast metal, a touch darker than the panel, with worn bright bevel edges.
        "GlyphInlay": textured("GlyphInlay", tint=(0.74, 0.74, 0.74), value=0.3, roughness=(0.4, 0.8),
                               edge_wear=1.0, grime=0.6, **cast),
        # Dark base so only the emission shows: a lit base colour catches the key light and AgX washes it to peach.
        "GlyphInlayLit": flat("GlyphInlayLit", (0.04, 0.015, 0.0), roughness=0.6, emission=(1.0, 0.3, 0.0),
                              strength=0.6),
        "DomeCrystal": crystal("DomeCrystal", glow=0.0),
        # Polished floor under the crystal: light passing through the red volume bounces back up, so the dome reads
        # as glowing red glass instead of black.
        "DomeFloor": flat("DomeFloor", (0.95, 0.22, 0.16), roughness=0.3, metallic=1.0),
        "DomeCrystalLit": crystal("DomeCrystalLit", glow=18.0),
    }
    add_glow(materials["KeyMetalLit"], (1.0, 0.36, 0.02), strength=0.7)
    return materials


# --- Geometry --------------------------------------------------------------------------------------------------------

# Per role: (bottom z, top z, bevel) in mm. Keys sit on the pedestal. Symbols are embossed: they rise ~1.8 mm above the
# raised "bevel" panel (its top is ~32.3 mm with the bevel), with bevelled edges that catch the light.
SHAPES = {
    "background": (0, 20, 2.0),
    "plate": (20, 30, 1.5),
    "bevel": (30, 31.5, 0.8),
    "symbol": (31.8, 33.6, 0.45),
    "metal": (20, 28, 1.0),
    "dark": (20, 26, 0.6),
    "darker": (20, 25, 0.4),
}


def role(name: str) -> str:
    """The SHAPES role of an imported object, from its layout SVG id."""
    if name.startswith("background-"):
        return "background"
    if name.startswith("key-"):
        part = name.rsplit("-", 1)[-1]
        if part.isdigit():  # key-<slug>-symbol-2
            return "symbol"
        return part
    return name.rsplit("-", 1)[-1]  # dome-<i>-<role>, domering-<i>-<role>


def normalize(objects, frame) -> None:
    """Maps the imported SVG (frame spans 0…0.254 m) onto 0…0.9 m, baking the transform into each curve."""
    corners = [frame.matrix_world @ Vector(c) for c in frame.bound_box]
    origin = Vector((min(c.x for c in corners), min(c.y for c in corners), 0))
    scale = ARTWORK_SIZE / (max(c.x for c in corners) - origin.x)
    transform = Matrix.Scale(scale, 4) @ Matrix.Translation(-origin)
    for obj in objects:
        obj.data.transform(transform @ obj.matrix_world)
        obj.matrix_world = Matrix.Identity(4)
        for spline in obj.data.splines:  # transform() also scales point radii, which would multiply the bevel
            for point in spline.bezier_points:
                point.radius = 1
            for point in spline.points:
                point.radius = 1


def shape(obj, bottom: float, top: float, bevel: float) -> None:
    curve = obj.data
    curve.dimensions = "2D"
    curve.fill_mode = "BOTH"
    curve.extrude = (top - bottom) / 2 * MM
    curve.bevel_depth = bevel * MM
    curve.bevel_resolution = 3
    curve.offset = -bevel * MM / 2  # keep the silhouette close to the 2D path the app hit-tests
    obj.location.z = (bottom + top) / 2 * MM



def spline_points(obj) -> list[Vector]:
    """Control points in world space. `bound_box` is stale after `curve.transform`, so bounds come from here."""
    points = []
    for spline in obj.data.splines:
        points += [obj.matrix_world @ p.co for p in spline.bezier_points]
        points += [obj.matrix_world @ p.co.xyz for p in spline.points]
    return points


def footprint(obj) -> tuple[Vector, float]:
    """Center and radius (half the x extent) of a roughly circular path."""
    points = spline_points(obj)
    low = Vector((min(p.x for p in points), min(p.y for p in points), 0))
    high = Vector((max(p.x for p in points), max(p.y for p in points), 0))
    return (low + high) / 2, (high.x - low.x) / 2


def add_pedestal(material, keys) -> None:
    """Stone disc under the keys, centered on the dome. Replaces the layout's background discs, which are off-center
    (the Expo app draws them in the page color, so they never showed)."""
    center, _ = footprint(bpy.data.objects["dome-0-crystal"])
    radius = max((p - center).xy.length for o in keys for p in spline_points(o)) + 14 * MM
    bpy.ops.mesh.primitive_cylinder_add(vertices=256, radius=radius, depth=20 * MM,
                                        location=(center.x, center.y, 10 * MM))
    pedestal = bpy.context.active_object
    pedestal.name = "pedestal"
    bevel = pedestal.modifiers.new("Bevel", "BEVEL")
    bevel.width = 4 * MM
    bevel.segments = 4
    pedestal.data.materials.append(material)
    move_to(pedestal, bpy.data.collections["Background"])


def move_to(obj, collection) -> None:
    for current in list(obj.users_collection):
        current.objects.unlink(obj)
    collection.objects.link(obj)


def add_dome(crystal, material) -> None:
    """Replaces the flat dome path with a crystal half-sphere of the same footprint."""
    center, radius = footprint(crystal)
    bpy.ops.mesh.primitive_uv_sphere_add(segments=96, ring_count=48, radius=1,
                                         location=(center.x, center.y, 20 * MM))
    dome = bpy.context.active_object
    dome.name = "dome-crystal"
    dome.scale = (radius, radius, radius * 0.32)
    bpy.ops.object.shade_smooth()
    dome.data.materials.append(material)
    move_to(dome, crystal.users_collection[0])

    bpy.ops.mesh.primitive_cylinder_add(vertices=128, radius=radius * 0.98, depth=0.4 * MM,
                                        location=(center.x, center.y, 20.3 * MM))
    floor = bpy.context.active_object
    floor.name = "dome-floor"
    floor.data.materials.append(bpy.data.materials["DomeFloor"])
    move_to(floor, crystal.users_collection[0])
    bpy.data.objects.remove(crystal)


def material_for(name: str, materials: dict):
    r = role(name)
    return {
        "background": materials["Stone"],
        "plate": materials["KeyMetal"],
        "bevel": materials["KeyPanel"],
        "symbol": materials["GlyphInlay"],
        "metal": materials["KeyMetal"],
        "dark": materials["RingDark"],
        "darker": materials["RingDarker"],
        "crystal": materials["DomeCrystal"],
    }[r]


def build_geometry(svg: Path, materials: dict) -> None:
    bpy.ops.import_curve.svg(filepath=str(svg))
    imported = [o for o in bpy.data.objects if o.type == "CURVE"]
    frame = bpy.data.objects["frame"]
    normalize(imported, frame)
    bpy.data.objects.remove(frame)
    for collection in list(bpy.data.collections):
        if collection.name.endswith(".svg"):
            bpy.data.collections.remove(collection)

    scene_root = bpy.context.scene.collection
    groups = {name: bpy.data.collections.new(name) for name in ("Background", "Keys", "Dome")}
    for collection in groups.values():
        scene_root.children.link(collection)

    for obj in (o for o in bpy.data.objects if o.type == "CURVE"):
        if obj.name.startswith("background-"):
            bpy.data.objects.remove(obj)
            continue
        group = "Keys" if obj.name.startswith("key-") else "Dome"
        groups[group].objects.link(obj)
        obj.data.materials.clear()
        obj.data.materials.append(material_for(obj.name, materials))
        if role(obj.name) != "crystal":
            shape(obj, *SHAPES[role(obj.name)])

    plates = [o for o in groups["Keys"].objects if o.name.endswith("-plate")]
    add_pedestal(materials["Stone"], plates)
    add_dome(bpy.data.objects["dome-0-crystal"], materials["DomeCrystal"])
    convert_to_meshes([o for o in bpy.data.objects if o.type == "CURVE"])
    tilt_keys(groups["Keys"])


def convert_to_meshes(objects) -> None:
    """Bakes the curve shapes into meshes (auto smooth, per-key tilt)."""
    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.convert(target="MESH")
    for obj in objects:
        weld(obj)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.shade_auto_smooth(angle=math.radians(35))


def weld(obj) -> None:
    """Converted extruded curves have unwelded caps and sides; welding gives clean shading along the bevels."""
    mesh = bmesh.new()
    mesh.from_mesh(obj.data)
    bmesh.ops.remove_doubles(mesh, verts=mesh.verts, dist=0.002 * MM)
    bmesh.ops.recalc_face_normals(mesh, faces=mesh.faces)
    mesh.to_mesh(obj.data)
    mesh.free()


def tilt_keys(keys, seed: int = 9) -> None:
    """Hand-set look: each key sits slightly askew (±0.35° tilt, ±0.3 mm height). Tilting about the key's own center
    keeps its outline, seen from above, within a fraction of a millimetre of the path the app hit-tests."""
    rng = random.Random(seed)
    slugs = sorted({o.name[len("key-"):-len("-plate")] for o in keys.objects if o.name.endswith("-plate")})
    for slug in slugs:
        parts = [o for o in keys.objects if o.name.startswith(f"key-{slug}-")]
        plate = bpy.data.objects[f"key-{slug}-plate"]
        corners = [plate.matrix_world @ v.co for v in plate.data.vertices]
        pivot = sum(corners, Vector()) / len(corners)
        rotation = Euler((math.radians(rng.uniform(-0.35, 0.35)), math.radians(rng.uniform(-0.35, 0.35)), 0))
        lift = Vector((0, 0, rng.uniform(-0.3, 0.3) * MM))
        transform = Matrix.Translation(pivot + lift) @ rotation.to_matrix().to_4x4() @ Matrix.Translation(-pivot)
        for obj in parts:
            obj.matrix_world = transform @ obj.matrix_world


# --- Camera, lights, render settings ---------------------------------------------------------------------------------


def build_stage() -> None:
    scene = bpy.context.scene
    center = ARTWORK_SIZE / 2

    camera = bpy.data.objects.new("RenderCam", bpy.data.cameras.new("RenderCam"))
    camera.data.type = "ORTHO"
    camera.data.ortho_scale = ARTWORK_SIZE
    camera.data.clip_end = 10
    camera.location = (center, center, 2)  # looking straight down -Z, +Y up = artwork top
    scene.collection.objects.link(camera)
    scene.camera = camera

    def aim(obj, location) -> None:
        obj.location = location
        direction = Vector((center, center, 0)) - Vector(location)
        obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        scene.collection.objects.link(obj)

    # Low, raking key light from the upper-left (≈30° elevation): pits, edges and engravings throw shadows, and its cone
    # falls off toward the rim like the photographed prop.
    key = bpy.data.objects.new("KeyLight", bpy.data.lights.new("KeyLight", "SPOT"))
    key.data.energy = 450
    key.data.color = (1.0, 0.97, 0.94)
    key.data.spot_size = math.radians(55)
    key.data.spot_blend = 1.0
    key.data.shadow_soft_size = 0.06
    aim(key, (-0.45, 1.45, 0.85))

    fill = bpy.data.objects.new("FillLight", bpy.data.lights.new("FillLight", "AREA"))
    fill.data.energy = 3
    fill.data.size = 1.5
    fill.data.color = (0.8, 0.86, 1.0)
    aim(fill, (1.5, -0.4, 1.2))

    # Dim studio HDRI for believable reflections on the worn metal edges.
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    nodes, links = world.node_tree.nodes, world.node_tree.links
    environment = nodes.new("ShaderNodeTexEnvironment")
    environment.image = bpy.data.images.load(str(ASSETS / "studio_small_08/hdri.exr"), check_existing=True)
    links.new(environment.outputs["Color"], nodes["Background"].inputs["Color"])
    nodes["Background"].inputs["Strength"].default_value = 0.08
    scene.world = world

    scene.render.engine = "CYCLES"
    scene.render.resolution_x = scene.render.resolution_y = 2048
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Medium High Contrast"
    scene.cycles.samples = 256
    scene.cycles.use_denoising = True
    scene.cycles.device = "GPU"
    preferences = bpy.context.preferences.addons["cycles"].preferences
    preferences.compute_device_type = "METAL"
    preferences.get_devices()
    for device in preferences.devices:
        device.use = device.type == "METAL"


def main() -> None:
    args = parse_args()
    if args.out.exists() and not args.force:
        sys.exit(f"{args.out} exists; it may hold hand edits. Pass --force to rebuild it.")

    bpy.ops.wm.read_factory_settings(use_empty=True)
    materials = build_materials()
    build_geometry(args.svg, materials)
    build_stage()

    keys = [o for o in bpy.data.collections["Keys"].objects]
    count = lambda part: sum(1 for o in keys if o.name.endswith(f"-{part}"))
    slugs = {o.name[len("key-"):-len("-plate")] for o in keys if o.name.endswith("-plate")}
    print(f"KEYS {len(slugs)} PLATES {count('plate')} SYMBOLS {count('symbol')}")

    args.out.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(args.out.resolve()), compress=True)


if __name__ == "__main__":
    try:
        main()
    except SystemExit as error:
        if error.code not in (None, 0):
            print(error.code if isinstance(error.code, str) else f"exit {error.code}", file=sys.stderr)
            sys.stdout.flush()
            import os

            os._exit(1)  # Blender swallows SystemExit from -P scripts; make the failure reach the shell
        raise
