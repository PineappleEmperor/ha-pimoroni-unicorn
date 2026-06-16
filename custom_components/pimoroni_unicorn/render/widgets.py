# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Widget loader: assembles the registry/capabilities API from widget_<id> units."""

import json

from . import declarative
from . import overlay_weather
from . import widget_calendar
from . import widget_clock
from . import widget_energy
from . import widget_sun_moon
from . import widget_weekdays

_UNITS = [widget_clock, widget_calendar, widget_weekdays, widget_energy, widget_sun_moon]
_OVERLAY_UNITS = [overlay_weather]


def _meta(mod):
    w = mod.WIDGET
    return {
        "label": w["label"], "w": w["w"], "h": w["h"],
        "variants": w.get("variants", []), "default_cfg": w["default_cfg"],
        "cfg_fields": w.get("cfg_fields", []),
        "box": getattr(mod, "box", None), "render": mod.render,
    }


def _overlay_meta(mod):
    return {"label": mod.OVERLAY["label"], "render": mod.render}


WIDGET_REGISTRY = {mod.WIDGET["id"]: _meta(mod) for mod in _UNITS}
OVERLAY_REGISTRY = {mod.OVERLAY["id"]: _overlay_meta(mod) for mod in _OVERLAY_UNITS}


def _declarative_meta(spec):
    def _render(g, x, y, w, h, cfg, state, _spec=spec):
        declarative.render(g, _spec, x, y, w, h, cfg, state)

    def _box(cfg, _spec=spec):
        return declarative.box(_spec, cfg)

    return {
        "label": spec.get("label", spec.get("id", "")),
        "w": spec.get("w", 8), "h": spec.get("h", 8),
        "variants": [], "default_cfg": spec.get("default_cfg", {}),
        "cfg_fields": spec.get("cfg_fields", []), "box": _box, "render": _render,
    }


def _discover_installed():
    """Find widget_<id> units (.py or declarative .json) on the device and register them."""
    try:
        import uos  # type: ignore  # noqa: PLC0415
        names = uos.listdir("/")
    except Exception:
        return
    for fn in names:
        if not fn.startswith("widget_"):
            continue
        if fn.endswith(".py"):
            wid = fn[7:-3]
            if wid not in WIDGET_REGISTRY:
                try:
                    mod = __import__(fn[:-3])
                    if hasattr(mod, "WIDGET") and hasattr(mod, "render"):
                        WIDGET_REGISTRY[wid] = _meta(mod)
                except Exception:
                    pass
        elif fn.endswith(".json"):
            wid = fn[7:-5]
            if wid not in WIDGET_REGISTRY:
                try:
                    with open("/" + fn) as f:
                        WIDGET_REGISTRY[wid] = _declarative_meta(json.load(f))
                except Exception:
                    pass
    for fn in names:
        if fn.startswith("overlay_") and fn.endswith(".py"):
            oid = fn[8:-3]
            if oid not in OVERLAY_REGISTRY:
                try:
                    mod = __import__(fn[:-3])
                    if hasattr(mod, "OVERLAY") and hasattr(mod, "render"):
                        OVERLAY_REGISTRY[oid] = _overlay_meta(mod)
                except Exception:
                    pass


_discover_installed()


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
