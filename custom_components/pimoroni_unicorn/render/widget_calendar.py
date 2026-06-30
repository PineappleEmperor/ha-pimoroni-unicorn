# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Calendar widget unit."""
from . import drawing

_WD_RAINBOW = [(255, 0, 0), (255, 120, 0), (255, 220, 0), (0, 220, 0),
               (0, 180, 255), (60, 60, 255), (200, 0, 220)]

WIDGET = {
    "id": "calendar", "label": "Calendar", "w": 9, "h": 10, "variants": [],
    "default_cfg": {"header_color": [200, 0, 0], "rainbow_header": False, "brightness": 100},
    "cfg_fields": [
        {"key": "header_color", "type": "rgb", "label": "Header"},
        {"key": "rainbow_header", "type": "bool", "label": "Rainbow header (by weekday)"},
        {"key": "brightness", "type": "range", "min": 10, "max": 100, "step": 5, "label": "Brightness"},
    ],
    "requires": ["font:digits"],
}


def render(g, x, y, w, h, cfg, state):
    """Draw the calendar, with an optional weekday-coloured header."""
    rgb = _WD_RAINBOW[state["time"][6] % 7] if cfg.get("rainbow_header") else (cfg.get("header_color") or (200, 0, 0))
    header = g.create_pen(*drawing.dim(rgb, cfg.get("brightness", 100)))
    drawing.draw_calendar(state["time"][2], x, y, header)
