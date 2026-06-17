#!/usr/bin/env python3
"""CI guard: every firmware engine module is in OTA_SOURCE_FILES (excl. secrets/__init__)."""

import ast
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parent.parent
EXCLUDE = {"secrets.py", "secrets.example.py", "__init__.py"}


def _manifest_sources() -> set[str]:
    tree = ast.parse((ROOT / "custom_components" / "pimoroni_unicorn" / "const.py").read_text())
    for node in ast.walk(tree):
        if (isinstance(node, ast.Assign) and isinstance(node.value, ast.Dict)
                and any(isinstance(t, ast.Name) and t.id == "OTA_SOURCE_FILES" for t in node.targets)):
            return {ast.literal_eval(v.elts[0]) for v in node.value.values
                    if isinstance(v, ast.Tuple) and v.elts}
    return set()


def main() -> int:
    # Foldered device tree: root (boot/main) + /engine + /widgets + /assets/fonts.
    fw = ROOT / "firmware"
    src_dirs = [fw, fw / "engine", fw / "widgets", fw / "assets" / "fonts"]
    on_disk = {p.name for d in src_dirs for p in d.glob("*.py")} - EXCLUDE
    shipped = _manifest_sources()
    missing = sorted(on_disk - shipped)
    if missing:
        print("firmware modules missing from OTA_SOURCE_FILES (const.py):")
        for m in missing:
            print(f"  - {m}")
        return 1
    print(f"engine manifest complete ({len(shipped)} files)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
