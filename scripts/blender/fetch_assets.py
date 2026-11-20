#!/usr/bin/env python3
"""Downloads the CC0 textures and HDRI the DHD scene uses into art/dhd/assets/ (git-ignored).

All assets are from Poly Haven (https://polyhaven.com, CC0): rust_coarse_01 (cast metal), rock_05 (dome),
concrete_floor_damaged_01 (pedestal), studio_small_08 (HDRI). URLs and MD5s are pinned; existing files with the right
checksum are skipped.

Usage:
    scripts/blender/fetch_assets.py
"""

import hashlib
import sys
import urllib.request
from pathlib import Path

ASSETS = Path(__file__).resolve().parent.parent.parent / "art/dhd/assets"

FILES = {
    "rust_coarse_01/diff.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rust_coarse_01/rust_coarse_01_diff_2k.jpg",
        "c1f3d0f3e8ea08bfed17bd27a5bb4a45",
    ),
    "rust_coarse_01/rough.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rust_coarse_01/rust_coarse_01_rough_2k.jpg",
        "10a240a8a6e841e9667497377df90f72",
    ),
    "rust_coarse_01/nor_gl.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rust_coarse_01/rust_coarse_01_nor_gl_2k.jpg",
        "70e8ba5a8244cffb052b9ba194610867",
    ),
    "rust_coarse_01/disp.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rust_coarse_01/rust_coarse_01_disp_2k.jpg",
        "155d9c9170c394a3fdc87014f12860d4",
    ),
    "rock_05/diff.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rock_05/rock_05_diff_2k.jpg",
        "9e9398175c503701571b19d727aa3532",
    ),
    "rock_05/rough.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rock_05/rock_05_rough_2k.jpg",
        "379116c46ff044e1cea039ecbecf8fc4",
    ),
    "rock_05/nor_gl.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rock_05/rock_05_nor_gl_2k.jpg",
        "861ed1876f0bdca9465226f229f5ebbf",
    ),
    "rock_05/disp.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/rock_05/rock_05_disp_2k.jpg",
        "5be6836e0c7b65736387411ba2ef35dc",
    ),
    "concrete_floor_damaged_01/diff.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/concrete_floor_damaged_01/concrete_floor_damaged_01_diff_2k.jpg",
        "ec7046a93962a6e6d6846f5f13352bf5",
    ),
    "concrete_floor_damaged_01/rough.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/concrete_floor_damaged_01/concrete_floor_damaged_01_rough_2k.jpg",
        "b84cf5d23cd1de46c2f2f819abe0fea2",
    ),
    "concrete_floor_damaged_01/nor_gl.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/concrete_floor_damaged_01/concrete_floor_damaged_01_nor_gl_2k.jpg",
        "1d2d8ad59f5f9f43980a45612f1e54c1",
    ),
    "concrete_floor_damaged_01/disp.jpg": (
        "https://dl.polyhaven.org/file/ph-assets/Textures/jpg/2k/concrete_floor_damaged_01/concrete_floor_damaged_01_disp_2k.jpg",
        "bc195a38adbcebfaa8f9be877fa1c694",
    ),
    "studio_small_08/hdri.exr": (
        "https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/2k/studio_small_08_2k.exr",
        "848c5313b410ac47bdab013b7aa0deec",
    ),
}


def md5(path: Path) -> str:
    return hashlib.md5(path.read_bytes()).hexdigest()


def main() -> None:
    for name, (url, checksum) in FILES.items():
        target = ASSETS / name
        if target.exists() and md5(target) == checksum:
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        request = urllib.request.Request(url, headers={"User-Agent": "dhd-artwork-script"})
        with urllib.request.urlopen(request) as response:
            target.write_bytes(response.read())
        if md5(target) != checksum:
            target.unlink()
            sys.exit(f"Checksum mismatch for {name} from {url}")
        print(f"Fetched {name}")


if __name__ == "__main__":
    main()
