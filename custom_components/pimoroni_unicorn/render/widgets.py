# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Widget loader: assembles the registry from widget_<id> unit modules.

Each unit exposes WIDGET (descriptor), an optional box(cfg), and
render(g, x, y, w, h, cfg, state). Built-in units are imported statically here;
the loader exposes the same registry/capabilities API the engine and the
emulator already use. Overlays (e.g. weather) render full-screen after widgets.
"""

from . import weather_fx

from . import widget_calendar
from . import widget_clock
from . import widget_energy
from . import widget_sun_moon
from . import widget_weekdays

_UNITS = [widget_clock, widget_calendar, widget_weekdays, widget_energy, widget_sun_moon]


def _meta(mod):
    w = mod.WIDGET
    return {
        "label": w["label"], "w": w["w"], "h": w["h"],
        "variants": w.get("variants", []), "default_cfg": w["default_cfg"],
        "cfg_fields": w.get("cfg_fields", []),
        "box": getattr(mod, "box", None), "render": mod.render,
    }


WIDGET_REGISTRY = {mod.WIDGET["id"]: _meta(mod) for mod in _UNITS}


def _discover_installed():
    """On-device: register any installed widget_<id>.py beyond the built-ins.

    No-op off-device (the emulator/HA render path has no uos), so those see only
    the statically-imported built-ins.
    """
    try:
        import uos  # type: ignore  # noqa: PLC0415
        names = uos.listdir("/")
    except Exception:
        return
    for fn in names:
        if fn.startswith("widget_") and fn.endswith(".py"):
            wid = fn[7:-3]
            if wid in WIDGET_REGISTRY:
                continue
            try:
                mod = __import__(fn[:-3])
                if hasattr(mod, "WIDGET") and hasattr(mod, "render"):
                    WIDGET_REGISTRY[wid] = _meta(mod)
            except Exception:
                pass


_discover_installed()


def _weather(g, state):
    weather_fx.weather_overlay(state["weather"])


OVERLAY_REGISTRY = {
    "weather": {"label": "Weather", "render": _weather},
}


def widget_box(widget_id, cfg):
    """Return (w, h) bounding box for a widget instance, honouring variant."""
    meta = WIDGET_REGISTRY.get(widget_id)
    if meta is None:
        return (0, 0)
    if meta["box"]:
        return meta["box"](cfg or {})
    return (meta["w"], meta["h"])


def render_layout(g, layout, state):
    """Render every widget then every overlay of a layout dict."""
    for entry in layout.get("widgets", []):
        meta = WIDGET_REGISTRY.get(entry.get("id"))
        if meta is None or entry.get("enabled") is False:
            continue
        cfg = {**meta["default_cfg"], **entry.get("cfg", {})}
        w, h = widget_box(entry["id"], cfg)
        meta["render"](g, entry.get("x", 0), entry.get("y", 0), w, h, cfg, state)
    for name in layout.get("overlays", []):
        overlay = OVERLAY_REGISTRY.get(name)
        if overlay is not None:
            overlay["render"](g, state)


def _variant_sizes(wid, m):
    """Map each variant to its (w, h) box so editors draw accurate footprints."""
    if not m["variants"]:
        return {}
    return {v: list(widget_box(wid, {**m["default_cfg"], "variant": v})) for v in m["variants"]}


LAYOUT_CAPABILITIES = {
    "widgets": [
        {
            "id": wid, "label": m["label"], "w": m["w"], "h": m["h"],
            "variants": m["variants"], "default_cfg": m["default_cfg"],
            "cfg_fields": m["cfg_fields"], "sizes": _variant_sizes(wid, m),
        }
        for wid, m in WIDGET_REGISTRY.items()
    ],
    "overlays": [{"id": oid, "label": m["label"]} for oid, m in OVERLAY_REGISTRY.items()],
}
