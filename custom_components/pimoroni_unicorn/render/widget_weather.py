# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Weather widget unit: draws a monochrome weather icon (8/16/32 px) for the condition."""
from . import drawing
from .weather_icons import WEATHER_ICONS

# Firmware condition string -> icon bucket.
_BUCKET = {
    "clear": "clear", "thunderstorm": "storm",
    "light_rain": "rain", "rain": "rain",
    "light_snow": "snow", "snow": "snow",
    "fog": "fog", "partly_cloudy": "partly_cloudy", "cloudy": "cloudy",
}

WIDGET = {
    "id": "weather", "label": "Weather icon", "w": 16, "h": 16, "variants": [], "multi": True,
    "default_cfg": {"size": 16, "style": "outline", "color": [160, 210, 255], "brightness": 100},
    "cfg_fields": [
        {"key": "size", "type": "select", "options": [8, 16, 32], "label": "Size"},
        {"key": "style", "type": "select", "options": ["outline", "solid"], "label": "Style"},
        {"key": "color", "type": "rgb", "label": "Colour"},
        {"key": "brightness", "type": "range", "min": 10, "max": 100, "step": 5, "label": "Brightness"},
    ],
    "requires": [],
}


def _size(cfg):
    s = int(cfg.get("size", 16))
    return s if s in (8, 16, 32) else 16


def box(cfg):
    """Square footprint at the configured size."""
    s = _size(cfg)
    return (s, s)


def render(g, x, y, w, h, cfg, state):
    """Draw the bucketed weather icon at the configured size, style and colour."""
    bucket = _BUCKET.get(state.get("weather", "clear"), "clear")
    styles = WEATHER_ICONS.get(bucket) or WEATHER_ICONS["clear"]
    style = cfg.get("style", "outline")
    sizes = styles.get(style) or styles["outline"]
    s = _size(cfg)
    rows = sizes.get(s) or sizes[16]
    color = drawing.dim(cfg.get("color") or (160, 210, 255), cfg.get("brightness", 100))
    g.set_pen(g.create_pen(color[0], color[1], color[2]))
    for ry in range(len(rows)):
        mask = rows[ry]
        for cx in range(s):
            if mask >> cx & 1:
                g.pixel(x + cx, y + ry)
