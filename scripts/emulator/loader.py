"""Load firmware modules under CPython with MicroPython mocks.

Mirrors the device environment closely enough to run notify_animations,
icons, and animations/*.py unmodified. Device-absolute paths
(/animations, /icons) are translated onto the repo firmware dir and a
local writable icons dir.
"""

import base64
import builtins
import os
import sys
import time
import types

FIRMWARE_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "firmware")
)
ICONS_DIR = os.path.join(os.path.dirname(__file__), ".device_icons")

_DEVICE_ROOTS = {
    "/animations": os.path.join(FIRMWARE_DIR, "animations"),
    "/icons":      ICONS_DIR,
}

_orig_open = builtins.open


def _translate(path):
    if isinstance(path, str):
        for prefix, real in _DEVICE_ROOTS.items():
            if path == prefix or path.startswith(prefix + "/"):
                return real + path[len(prefix):]
    return path


def install_mocks():
    """Register MicroPython module mocks and device-path translation."""
    sys.modules["ubinascii"] = types.SimpleNamespace(
        a2b_base64=base64.b64decode, b2a_base64=base64.b64encode
    )
    sys.modules["uos"] = types.SimpleNamespace(
        listdir=lambda p=".": os.listdir(_translate(p)),
        mkdir=lambda p: os.mkdir(_translate(p)),
        remove=lambda p: os.remove(_translate(p)),
        rename=lambda a, b: os.rename(_translate(a), _translate(b)),
    )
    micropython_mock = types.SimpleNamespace(
        native=lambda f: f, viper=lambda f: f, const=lambda x: x
    )
    sys.modules["micropython"] = micropython_mock
    builtins.micropython = micropython_mock
    sys.modules["sounds"] = types.SimpleNamespace(
        NOTIFY_SOUNDS={"beep": [], "chime": [], "alert": []},
        _start_sound=lambda *a: None,
        _tick_sound=lambda *a: None,
    )
    builtins.open = lambda path, *a, **k: _orig_open(_translate(path), *a, **k)
    if not hasattr(time, "ticks_ms"):
        time.ticks_ms   = lambda: int(time.monotonic() * 1000)
        time.ticks_diff = lambda a, b: a - b
        time.ticks_add  = lambda a, b: a + b
    os.makedirs(ICONS_DIR, exist_ok=True)
    if FIRMWARE_DIR not in sys.path:
        sys.path.insert(0, FIRMWARE_DIR)


def load_notify(graphics, width, height):
    """Import firmware notify_animations + icons against the shim graphics."""
    import icons
    import notify_animations

    notify_animations.init(graphics, width, height)
    return notify_animations, icons


def reload_notify(graphics, width, height):
    """Drop cached firmware modules and re-import (hot reload)."""
    for mod in ("notify_animations", "icons"):
        sys.modules.pop(mod, None)
    return load_notify(graphics, width, height)


def load_display(graphics, width, height):
    """Import firmware drawing + weather_fx against the shim graphics."""
    import bitfonts
    import drawing
    import weather_fx

    bitfont = bitfonts.BitFont(graphics)
    drawing.init(graphics, bitfont, width, height)
    weather_fx.init(graphics, width, height)
    return drawing, weather_fx


def reload_display(graphics, width, height):
    """Drop cached display modules and re-import (hot reload)."""
    for mod in ("drawing", "weather_fx", "bitfonts", "monospace_digits", "monospace_big_digits"):
        sys.modules.pop(mod, None)
    return load_display(graphics, width, height)


def load_layout(graphics, width, height):
    """Import firmware widgets + layouts (and their drawing deps) against the shim."""
    load_display(graphics, width, height)
    import layouts
    import widgets
    return widgets, layouts


def reload_layout(graphics, width, height):
    """Drop cached layout modules and re-import (hot reload)."""
    for mod in ("widgets", "layouts", "drawing", "weather_fx", "bitfonts",
                "monospace_digits", "monospace_big_digits"):
        sys.modules.pop(mod, None)
    return load_layout(graphics, width, height)


def watched_mtimes():
    """Snapshot of watched firmware file mtimes for change detection."""
    snapshot = {}
    for name in ("notify_animations.py", "icons.py", "drawing.py",
                 "weather_fx.py", "bitfonts.py"):
        path = os.path.join(FIRMWARE_DIR, name)
        snapshot[path] = os.path.getmtime(path)
    anim_dir = _DEVICE_ROOTS["/animations"]
    if os.path.isdir(anim_dir):
        for name in os.listdir(anim_dir):
            if name.endswith(".py"):
                path = os.path.join(anim_dir, name)
                snapshot[path] = os.path.getmtime(path)
    return snapshot
