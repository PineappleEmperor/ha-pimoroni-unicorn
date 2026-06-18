"""Device-faithful layout rendering for the editor panel.

Renders a layout with the same code the firmware runs (the render/ package),
against the CPython shim, and returns a base64 PNG. Pixel-accurate because it
is the device's own render path — no JS re-implementation.
"""

import base64
import binascii
import builtins
import io
import sys
import time
import types

MODEL_DIMS = {
    "galactic": (53, 11),
    "cosmic":   (32, 32),
    "stellar":  (16, 16),
}

SAMPLE_STATE = {
    "solar": 2.5, "consumption": 0.8, "soc": 75, "charging": True,
    "sun_below": False, "energy_mode": "Net", "weather": "clear", "temp": 18.5,
    "display_sensors": {}, "battery_animation": False,
}

_loaded = None


def _install_mocks() -> None:
    if not hasattr(time, "ticks_ms"):
        time.ticks_ms   = lambda: int(time.monotonic() * 1000)  # type: ignore[attr-defined]
        time.ticks_diff = lambda a, b: a - b  # type: ignore[attr-defined]
        time.ticks_add  = lambda a, b: a + b  # type: ignore[attr-defined]
    if not hasattr(builtins, "micropython"):
        builtins.micropython = types.SimpleNamespace(  # type: ignore[attr-defined]
            native=lambda f: f, viper=lambda f: f, const=lambda x: x
        )
    # icons.py imports uos/ubinascii at module top; neither is touched when
    # drawing built-in icons, so a thin shim is enough for the preview.
    sys.modules.setdefault("ubinascii", binascii)  # type: ignore[arg-type]
    sys.modules.setdefault("uos", types.SimpleNamespace(  # type: ignore[arg-type]
        listdir=lambda *_a: [], mkdir=lambda *_a: None, remove=lambda *_a: None))


def _modules():
    global _loaded
    if _loaded is None:
        _install_mocks()
        from .render import (
            bitfonts,
            declarative,
            drawing,
            icons,
            layouts,
            weather_fx,
            widgets,
        )
        from .render.shim import PicoGraphics
        _loaded = types.SimpleNamespace(
            PicoGraphics=PicoGraphics, bitfonts=bitfonts, drawing=drawing, icons=icons,
            weather_fx=weather_fx, widgets=widgets, layouts=layouts, declarative=declarative)
    return _loaded


def default_layout(model: str) -> dict:
    """Return the firmware default layout for a model."""
    return _modules().layouts.default_layout(model)


def layout_capabilities() -> dict:
    """Return the widget catalogue from the render package."""
    return _modules().widgets.LAYOUT_CAPABILITIES


def builtin_icon_names() -> list[str]:
    """Names of the icons that ship with the engine."""
    return sorted(_modules().icons.STATIC_ICONS.keys())


def render_icon_thumb(icon: dict, size: int = 8) -> str | None:
    """First frame of a stored icon (raw size×size RGB) as a base64 PNG."""
    frames = (icon or {}).get("frames") or []
    if not frames:
        return None
    try:
        raw = base64.b64decode(frames[0])
    except (ValueError, binascii.Error):
        return None
    if len(raw) < size * size * 3:
        return None
    from PIL import Image

    img = Image.frombytes("RGB", (size, size), raw[: size * size * 3])
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


def layout_boxes(layout: dict) -> list:
    """Per-widget [w, h] boxes for the layout, computed by the real widget_box."""
    widgets = _modules().widgets
    out = []
    for entry in layout.get("widgets", []):
        wid = entry.get("type", entry.get("id"))
        meta = widgets.WIDGET_REGISTRY.get(wid)
        if meta is None:
            out.append([0, 0])
            continue
        cfg = {**meta["default_cfg"], **entry.get("cfg", {})}
        out.append(list(widgets.widget_box(wid, cfg)))
    return out


def _new_graphics(model: str):
    m = _modules()
    width, height = MODEL_DIMS.get(model, MODEL_DIMS["galactic"])
    g = m.PicoGraphics(width, height)
    m.drawing.init(g, m.bitfonts.BitFont(g), width, height)
    m.weather_fx.init(g, width, height)
    m.icons.init(g)
    g.set_pen(g.create_pen(0, 0, 0))
    g.clear()
    return m, g, width, height


def _encode(g, width, height) -> str:
    from PIL import Image

    img = Image.new("RGB", (width, height))
    img.putdata(g.buffer)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


def _prime_icons(m, installed: dict | None) -> None:
    """Load installed (LaMetric/custom) icon frames into the icon cache for preview."""
    if installed is None:
        return
    m.icons._user_cache.clear()  # noqa: SLF001 — reflect the current registry, drop removed icons
    for name, data in installed.items():
        frames = data.get("frames") or []
        try:
            decoded = [base64.b64decode(fr) for fr in frames]
        except (ValueError, binascii.Error):
            continue
        # Prime the engine icon module's caches directly — preview-only, no on-device
        # filesystem to install into; the icons module has no public prime API.
        m.icons._user_cache[name] = (decoded, [int(d) for d in (data.get("durations") or [])])  # noqa: SLF001
        if data.get("code") is not None:
            m.icons._code_alias[str(data["code"])] = name  # noqa: SLF001


def render_layout_png(model: str, layout: dict, installed_icons: dict | None = None,
                      elapsed_ms: int = 0) -> str:
    """Render a layout for a model at a point in time; return a base64 PNG."""
    m, g, width, height = _new_graphics(model)
    _prime_icons(m, installed_icons)
    state = {**SAMPLE_STATE, "time": time.localtime(), "elapsed_ms": elapsed_ms}
    ds = dict(state.get("display_sensors") or {})
    for entry in layout.get("widgets", []):
        ent = (entry.get("cfg") or {}).get("entity")
        if ent:
            ds.setdefault(ent, {"state": True})  # mock 'on' so sensor widgets preview
    state["display_sensors"] = ds
    m.widgets.render_layout(g, layout, state)
    return _encode(g, width, height)


def render_layout_frames(model: str, layout: dict, installed_icons: dict | None = None,
                         n: int = 8, step_ms: int = 200) -> list[str]:
    """N base64 PNG frames stepped through time, so the panel can animate the preview."""
    return [render_layout_png(model, layout, installed_icons, i * step_ms) for i in range(n)]


def render_unit_thumb(model: str, unit_id: str, installed_icons: dict | None = None) -> str | None:
    """Render a single catalogue widget (at its box) or overlay (at model size) for a thumbnail."""
    m = _modules()
    widgets = m.widgets
    if unit_id in widgets.WIDGET_REGISTRY:
        meta = widgets.WIDGET_REGISTRY[unit_id]
        cfg = meta.get("default_cfg", {})
        w, h = widgets.widget_box(unit_id, cfg)
        if not w or not h:
            w, h = meta.get("w", 8), meta.get("h", 8)
        g = m.PicoGraphics(w, h)
        m.drawing.init(g, m.bitfonts.BitFont(g), w, h)
        m.weather_fx.init(g, w, h)
        m.icons.init(g)
        _prime_icons(m, installed_icons)
        g.set_pen(g.create_pen(0, 0, 0))
        g.clear()
        meta["render"](g, 0, 0, w, h, cfg, {**SAMPLE_STATE, "time": time.localtime(), "display_sensors": {}})
        return _encode(g, w, h)
    if unit_id in widgets.OVERLAY_REGISTRY:
        width, height = MODEL_DIMS.get(model, MODEL_DIMS["galactic"])
        m2, g, width, height = _new_graphics(model)
        m2.widgets.OVERLAY_REGISTRY[unit_id]["render"](g, {**SAMPLE_STATE, "time": time.localtime()})
        return _encode(g, width, height)
    return None


def render_widget_png(model: str, spec: dict, cfg=None, state=None, elapsed_ms: int = 0) -> str:
    """Render a single declarative widget spec to a base64 PNG for authoring preview."""
    m, g, width, height = _new_graphics(model)
    full = {**SAMPLE_STATE, "time": time.localtime(), "elapsed_ms": elapsed_ms, **(state or {})}
    full["display_sensors"] = dict(full.get("display_sensors") or {})
    for op in spec.get("draw", []):
        bind = op.get("bind")
        if not bind:
            continue
        if op.get("op") == "dot":
            full["display_sensors"].setdefault(bind, {"state": True})  # sample 'on' for preview
        elif bind not in full:
            full[bind] = 123  # sample value so unknown bindings still preview
    cfg = {**spec.get("default_cfg", {}), **(cfg or {})}
    m.declarative.render(g, spec, 0, 0, spec.get("w", width), spec.get("h", height), cfg, full)
    return _encode(g, width, height)


def render_widget_frames(model: str, spec: dict, cfg=None, n: int = 8, step_ms: int = 200) -> list[str]:
    """N base64 PNG frames of a widget spec stepped through time, for an animated preview."""
    return [render_widget_png(model, spec, cfg, None, i * step_ms) for i in range(n)]


# Marketplace font catalog. alpha fonts are bitmask dicts in the engine's bitfonts.py
# (always shipped); digit fonts are installable monospace_* units. Each previews
# through the device font code so the gallery is byte-faithful.
FONT_SPECS = [
    {"name": "font3x5",    "label": "Mini 3×5",     "kind": "alpha",  "w": 3, "h": 5,
     "builtin": True, "upper": True, "sample": "HELLO 2026"},
    {"name": "font4x5",    "label": "Mini 4×5",     "kind": "alpha",  "w": 4, "h": 5,
     "builtin": True, "upper": True, "sample": "HELLO 2026"},
    {"name": "font5x9",    "label": "Tall 5×9",     "kind": "alpha",  "w": 5, "h": 9,
     "builtin": True, "upper": False, "sample": "Hello 2026"},
    {"name": "digits",     "label": "Digits 3×5",   "kind": "digits", "w": 3, "h": 5,
     "device_file": "monospace_digits.py",     "sample": "012345"},
    {"name": "big_digits", "label": "Big 5×7",      "kind": "digits", "w": 5, "h": 7,
     "device_file": "monospace_big_digits.py", "sample": "012345"},
    {"name": "blocky",     "label": "Blocky 4×5",   "kind": "digits", "w": 4, "h": 5,
     "device_file": "monospace_blocky.py",     "sample": "012345"},
    {"name": "tall",       "label": "Tall 3×7",     "kind": "digits", "w": 3, "h": 7,
     "device_file": "monospace_tall.py",       "sample": "012345"},
    {"name": "humanist",   "label": "Humanist 4×7", "kind": "digits", "w": 4, "h": 7,
     "device_file": "monospace_humanist.py",   "sample": "012345"},
]

_ALPHA_FONTS = {"font3x5": True, "font4x5": True, "font5x9": False}  # name -> force-uppercase
_DIGIT_FONTS = {
    "digits":     ("monospace_digits",     "DIGITS",     3, 5),
    "big_digits": ("monospace_big_digits", "BIG_DIGITS", 5, 7),
    "blocky":     ("monospace_blocky",     "BLOCKY",     4, 5),
    "tall":       ("monospace_tall",       "TALL",       3, 7),
    "humanist":   ("monospace_humanist",   "HUMANIST",   4, 7),
}


def font_specs() -> list[dict]:
    """Marketplace font catalog metadata (no install state)."""
    return [dict(s) for s in FONT_SPECS]


def render_text_png(font_name: str, text: str, color=(255, 255, 255)) -> str:
    """Render a text strip in the named device font; base64 PNG sized to content."""
    m = _modules()
    text = str(text)
    if font_name in _ALPHA_FONTS:
        font = getattr(m.bitfonts, font_name)
        s = "".join(c for c in (text.upper() if _ALPHA_FONTS[font_name] else text) if c in font)
        gh = font[s[0]]["h"] if s else 5
        width = sum(font[c]["w"] + font[c]["s"] for c in s) - (font[s[-1]]["s"] if s else 0)
        width = max(1, width)
        g = m.PicoGraphics(width, gh)
        g.set_pen(g.create_pen(0, 0, 0))
        g.clear()
        g.set_pen(g.create_pen(*color))
        m.bitfonts.BitFont(g).draw_text(s, 0, 0, font, d=1)
        return _encode(g, width, gh)
    if font_name in _DIGIT_FONTS:
        from importlib import import_module

        modname, attr, gw, gh = _DIGIT_FONTS[font_name]
        table = getattr(import_module(f"{__package__}.render.{modname}"), attr)
        digits = [int(c) for c in text if c.isdigit()]
        width = max(1, len(digits) * (gw + 1) - 1) if digits else 1
        g = m.PicoGraphics(width, gh)
        g.set_pen(g.create_pen(0, 0, 0))
        g.clear()
        g.set_pen(g.create_pen(*color))
        x = 0
        for d in digits:
            row = table[d]
            for i in range(gh):
                for j in range(gw):
                    if row[i * gw + j]:
                        g.pixel(x + j, i)
            x += gw + 1
        return _encode(g, width, gh)
    raise ValueError(f"unknown font {font_name}")
