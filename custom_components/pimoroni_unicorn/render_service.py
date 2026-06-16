"""Device-faithful layout rendering for the editor panel.

Renders a layout with the same code the firmware runs (the render/ package),
against the CPython shim, and returns a base64 PNG. Pixel-accurate because it
is the device's own render path — no JS re-implementation.
"""

import base64
import builtins
import io
import time
import types

MODEL_DIMS = {
    "galactic": (53, 11),
    "cosmic":   (32, 32),
    "stellar":  (16, 16),
}

SAMPLE_STATE = {
    "solar": 2.5, "consumption": 0.8, "soc": 75, "charging": True,
    "sun_below": False, "energy_mode": "Net", "weather": "clear",
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


def _modules():
    global _loaded
    if _loaded is None:
        _install_mocks()
        from .render import bitfonts, declarative, drawing, layouts, weather_fx, widgets
        from .render.shim import PicoGraphics
        _loaded = types.SimpleNamespace(
            PicoGraphics=PicoGraphics, bitfonts=bitfonts, drawing=drawing,
            weather_fx=weather_fx, widgets=widgets, layouts=layouts, declarative=declarative)
    return _loaded


def default_layout(model: str) -> dict:
    """Return the firmware default layout for a model."""
    return _modules().layouts.default_layout(model)


def layout_capabilities() -> dict:
    """Return the widget catalogue from the render package."""
    return _modules().widgets.LAYOUT_CAPABILITIES


def _sensors_dict(sensors):
    """Convert a list of render-shape sensors to the draw_display_sensors dict."""
    out = {}
    for i, s in enumerate(sensors or []):
        out[str(i)] = {
            "state":   bool(s.get("state")),
            "on_rgb":  tuple(s.get("on_rgb", [0, 255, 0])),
            "off_rgb": tuple(s.get("off_rgb", [20, 20, 20])),
            "x":       int(s.get("x", 0)),
            "y":       int(s.get("y", 0)),
            "width":   int(s.get("width",  s.get("size", 2))),
            "height":  int(s.get("height", s.get("size", 2))),
        }
    return out


def layout_boxes(layout: dict) -> list:
    """Per-widget [w, h] boxes for the layout, computed by the real widget_box."""
    widgets = _modules().widgets
    out = []
    for entry in layout.get("widgets", []):
        meta = widgets.WIDGET_REGISTRY.get(entry.get("id"))
        if meta is None:
            out.append([0, 0])
            continue
        cfg = {**meta["default_cfg"], **entry.get("cfg", {})}
        out.append(list(widgets.widget_box(entry["id"], cfg)))
    return out


def _new_graphics(model: str):
    m = _modules()
    width, height = MODEL_DIMS.get(model, MODEL_DIMS["galactic"])
    g = m.PicoGraphics(width, height)
    m.drawing.init(g, m.bitfonts.BitFont(g), width, height)
    m.weather_fx.init(g, width, height)
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


def render_layout_png(model: str, layout: dict, sensors=None) -> str:
    """Render a layout (and any display sensors) for a model; return a base64 PNG."""
    m, g, width, height = _new_graphics(model)
    state = {**SAMPLE_STATE, "time": time.localtime()}
    m.widgets.render_layout(g, layout, state)
    m.drawing.draw_display_sensors(_sensors_dict(sensors))
    return _encode(g, width, height)


def render_widget_png(model: str, spec: dict, cfg=None, state=None) -> str:
    """Render a single declarative widget spec to a base64 PNG for authoring preview."""
    m, g, width, height = _new_graphics(model)
    full = {**SAMPLE_STATE, "time": time.localtime(), **(state or {})}
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
