# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Weather widget unit: draws an 8x8 icon for the current condition."""
from . import icons

_BUCKET = {
    "clear": "clear", "thunderstorm": "storm",
    "light_rain": "rain", "rain": "rain",
    "light_snow": "snow", "snow": "snow",
    "fog": "fog", "partly_cloudy": "partly_cloudy", "cloudy": "cloudy",
}

WIDGET = {
    "id": "weather", "label": "Weather icon", "w": 8, "h": 8, "variants": [], "multi": True,
    "default_cfg": {"clear": "wx_clear", "partly_cloudy": "wx_partly_cloudy",
                    "cloudy": "wx_cloudy", "fog": "wx_fog", "rain": "wx_rain",
                    "snow": "wx_snow", "storm": "wx_storm"},
    "cfg_fields": [
        {"key": "clear", "type": "icon", "label": "Clear"},
        {"key": "partly_cloudy", "type": "icon", "label": "Partly cloudy"},
        {"key": "cloudy", "type": "icon", "label": "Cloudy"},
        {"key": "fog", "type": "icon", "label": "Fog"},
        {"key": "rain", "type": "icon", "label": "Rain"},
        {"key": "snow", "type": "icon", "label": "Snow"},
        {"key": "storm", "type": "icon", "label": "Storm"},
    ],
    "requires": [],
}


def box(cfg):
    """Icons are a fixed 8x8 footprint."""
    return (icons.ICON_SIZE, icons.ICON_SIZE)


def render(g, x, y, w, h, cfg, state):
    """Draw the icon mapped from the current weather condition."""
    bucket = _BUCKET.get(state.get("weather", "clear"), "clear")
    name = cfg.get(bucket) or bucket
    icons.draw_icon(name, x, y, state.get("elapsed_ms", 0))
