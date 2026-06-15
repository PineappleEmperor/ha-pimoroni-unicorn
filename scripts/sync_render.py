#!/usr/bin/env python3
"""Copy firmware render modules into the integration's render/ package.

The integration cannot import firmware/ at runtime (HACS ships only
custom_components/), so a CPython-runnable copy lives in
custom_components/pimoroni_unicorn/render/. The firmware modules use flat
absolute imports (import drawing); inside the render package those are
rewritten to package-relative form (from . import drawing) so they don't
collide with other modules in the Home Assistant process.

`sync` writes the transformed copies; `check` recomputes the transform and
asserts the committed copies match (CI guard against drift).
"""

import argparse
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
RENDER_DIR = ROOT / "custom_components" / "pimoroni_unicorn" / "render"

# Synced firmware render modules -> render/ (transformed).
FIRMWARE_MODULES = [
    "widgets.py", "drawing.py", "layouts.py", "bitfonts.py",
    "weather_fx.py", "monospace_digits.py", "monospace_big_digits.py",
    "monospace_blocky.py", "monospace_tall.py", "monospace_humanist.py",
    "widget_clock.py", "widget_calendar.py", "widget_weekdays.py",
    "widget_energy.py", "widget_sun_moon.py",
]

_LOCAL = ("drawing|weather_fx|bitfonts|layouts|widgets|icons|sounds|"
          "monospace_digits|monospace_big_digits|monospace_blocky|monospace_tall|monospace_humanist|"
          "widget_clock|widget_calendar|widget_weekdays|widget_energy|widget_sun_moon")
_TRANSFORMS = [
    (re.compile(rf"^import ({_LOCAL})$", re.MULTILINE), r"from . import \1"),
    (re.compile(rf"^import ({_LOCAL}) as (\w+)$", re.MULTILINE), r"from . import \1 as \2"),
    (re.compile(rf"^from ({_LOCAL}) import ", re.MULTILINE), r"from .\1 import "),
]

_HEADER = "# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.\n"


def transform(source: str) -> str:
    """Rewrite flat firmware imports to render-package-relative imports."""
    for pattern, repl in _TRANSFORMS:
        source = pattern.sub(repl, source)
    return _HEADER + source


def _pairs():
    for name in FIRMWARE_MODULES:
        yield ROOT / "firmware" / name, RENDER_DIR / name


def do_sync() -> None:
    RENDER_DIR.mkdir(parents=True, exist_ok=True)
    for src, dst in _pairs():
        dst.write_text(transform(src.read_text()))
        print(f"synced {dst.relative_to(ROOT)}")


def do_check() -> int:
    stale = []
    for src, dst in _pairs():
        expected = transform(src.read_text())
        if not dst.is_file() or dst.read_text() != expected:
            stale.append(str(dst.relative_to(ROOT)))
    if stale:
        print("render/ out of sync with firmware/ (run scripts/sync_render.py sync):")
        for s in stale:
            print(f"  - {s}")
        return 1
    print("render/ in sync with firmware/")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("action", choices=["sync", "check"], nargs="?", default="sync")
    args = ap.parse_args()
    if args.action == "check":
        return do_check()
    do_sync()
    return 0


if __name__ == "__main__":
    sys.exit(main())
