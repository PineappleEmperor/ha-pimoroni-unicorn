"""Widget registry mapping layout entries to drawing primitives.

Each widget render has the uniform signature render(g, x, y, w, h, cfg, state).
state is a per-frame dict; cfg is per-instance config (variant, colours).
Overlays (e.g. weather) render full-screen after positioned widgets.
"""

import drawing
import weather_fx


def _pen(g, rgb, default):
    return g.create_pen(*(rgb or default))


def _clock(g, x, y, w, h, cfg, state):
    drawing.draw_clock(x, state["time"], y=y, variant=cfg.get("variant", "big"),
                       color=cfg.get("color"))


def _calendar(g, x, y, w, h, cfg, state):
    drawing.draw_calendar(state["time"][2], x, y, _pen(g, cfg.get("header_color"), (200, 0, 0)))


def _weekdays(g, x, y, w, h, cfg, state):
    active   = _pen(g, cfg.get("active"),   (0, 0, 128))
    inactive = _pen(g, cfg.get("inactive"), (60, 60, 60))
    if cfg.get("variant", "big") == "small":
        drawing.draw_weekdays(state["time"][6], x, y, active, inactive)
    else:
        drawing.draw_big_weekdays(state["time"][6], x, y, active, inactive)


def _solar(g, x, y, w, h, cfg, state):
    drawing.draw_solar_quadrant(
        x, y, w, h,
        solar=state["solar"], battery_soc=state["soc"], is_charging=state["charging"],
        sun_below_horizon=state["sun_below"], mode=state["energy_mode"],
        consumption=state["consumption"], battery_animation=state["battery_animation"],
    )


def _weather(g, state):
    weather_fx.weather_overlay(state["weather"])


def _clock_box(cfg):
    variant = cfg.get("variant")
    if variant == "tiny":
        return (18, 6)
    if variant == "small":
        return (15, 5)
    return (23, 7)


def _weekdays_box(cfg):
    return (14, 2) if cfg.get("variant") == "small" else (20, 3)


WIDGET_REGISTRY = {
    "clock": {
        "label": "Clock", "w": 23, "h": 7, "variants": ["big", "small", "tiny"],
        "default_cfg": {"variant": "big", "color": [255, 255, 255]},
        "box": _clock_box, "render": _clock,
    },
    "calendar": {
        "label": "Calendar", "w": 9, "h": 10, "variants": [],
        "default_cfg": {"header_color": [200, 0, 0]},
        "box": None, "render": _calendar,
    },
    "weekdays": {
        "label": "Weekdays", "w": 20, "h": 3, "variants": ["big", "small"],
        "default_cfg": {"variant": "big", "active": [0, 0, 128], "inactive": [60, 60, 60]},
        "box": _weekdays_box, "render": _weekdays,
    },
    "solar": {
        "label": "Solar/Energy", "w": 16, "h": 11, "variants": [],
        "default_cfg": {}, "box": None, "render": _solar,
    },
}

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


LAYOUT_CAPABILITIES = {
    "widgets": [
        {"id": wid, "label": m["label"], "w": m["w"], "h": m["h"], "variants": m["variants"]}
        for wid, m in WIDGET_REGISTRY.items()
    ],
    "overlays": [{"id": oid, "label": m["label"]} for oid, m in OVERLAY_REGISTRY.items()],
}
