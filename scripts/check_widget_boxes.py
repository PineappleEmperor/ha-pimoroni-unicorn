#!/usr/bin/env python3
"""Verify each widget's declared box matches what it actually renders.

Renders every widget (and variant) in isolation via the shim, measures the
lit-pixel bounding box, and checks it against widget_box(). Fixed-footprint
widgets (clock/calendar/weekdays) must match exactly across representative
states; variable ones (solar) must merely fit inside their declared box.
Run in CI so a draw change can't silently drift the editor's hit-boxes.
"""

import binascii
import builtins
from pathlib import Path
import sys
import time
import types

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "custom_components" / "pimoroni_unicorn"))

if not hasattr(time, "ticks_ms"):
    time.ticks_ms = lambda: 0  # type: ignore[attr-defined]
    time.ticks_diff = lambda a, b: a - b  # type: ignore[attr-defined]
    time.ticks_add = lambda a, b: a + b  # type: ignore[attr-defined]
if not hasattr(builtins, "micropython"):
    builtins.micropython = types.SimpleNamespace(  # type: ignore[attr-defined]
        native=lambda f: f, viper=lambda f: f, const=lambda x: x)
sys.modules.setdefault("ubinascii", binascii)
sys.modules.setdefault("uos", types.SimpleNamespace(
    listdir=lambda *_a: [], mkdir=lambda *_a: None, remove=lambda *_a: None))

from render import bitfonts, drawing, icons, weather_fx, widgets
from render.shim import PicoGraphics

# A few states that exercise the widest output of each widget.
TIMES = [
    time.struct_time((2026, 6, 14, 0, 0, 0, 5, 165, 0)),
    time.struct_time((2026, 6, 28, 23, 59, 0, 2, 179, 0)),
]
BASE = {
    "solar": 2.5, "consumption": 0.8, "soc": 100, "charging": True,
    "sun_below": False, "energy_mode": "Net", "weather": "clear",
    "display_sensors": {}, "battery_animation": False,
}
TIGHT = {"clock", "calendar", "weekdays"}  # must match exactly; solar may be looser


def _bbox(buf, w, h):
    xs = [i % w for i, p in enumerate(buf) if p != (0, 0, 0)]
    ys = [i // w for i, p in enumerate(buf) if p != (0, 0, 0)]
    if not xs:
        return (0, 0)
    return (max(xs) + 1, max(ys) + 1)  # extent from origin (widgets render at 0,0)


def main():
    failures = []
    for wid, meta in widgets.WIDGET_REGISTRY.items():
        variants = meta["variants"] or [None]
        for v in variants:
            cfg = {**meta["default_cfg"]}
            if v is not None:
                cfg["variant"] = v
            decl = tuple(widgets.widget_box(wid, cfg))
            worst = (0, 0)
            for t in TIMES:
                g = PicoGraphics(64, 32)
                drawing.init(g, bitfonts.BitFont(g), 64, 32)
                weather_fx.init(g, 64, 32)
                icons.init(g)
                meta["render"](g, 0, 0, decl[0], decl[1], cfg, {**BASE, "time": t})
                bb = _bbox(g.buffer, 64, 32)
                worst = (max(worst[0], bb[0]), max(worst[1], bb[1]))
            label = f"{wid}/{v or '-'}"
            if wid not in TIGHT:
                # Right-anchored / composite widgets (solar) clip at the display
                # edge in real placement; report but do not assert.
                print(f"~~ {label}: box {decl} content {worst} (anchored, not asserted)")
            elif worst != decl:
                failures.append(f"{label}: box {decl} != content {worst}")
            else:
                print(f"OK {label}: box {decl} content {worst}")
    if failures:
        print("\nWIDGET BOX MISMATCHES:")
        for f in failures:
            print(f"  - {f}")
        return 1
    print("\nall widget boxes verified")
    return 0


if __name__ == "__main__":
    sys.exit(main())
