# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Calendar widget unit."""
from . import drawing

WIDGET = {
    "id": "calendar", "label": "Calendar", "w": 9, "h": 10, "variants": [],
    "default_cfg": {"header_color": [200, 0, 0], "brightness": 100},
    "cfg_fields": [
        {"key": "header_color", "type": "rgb", "label": "Header"},
        {"key": "brightness", "type": "range", "min": 10, "max": 100, "step": 5, "label": "Brightness"},
    ],
    "requires": ["font:digits"],
}


def render(g, x, y, w, h, cfg, state):
    """Draw the calendar."""
    header = g.create_pen(*drawing.dim(cfg.get("header_color") or (200, 0, 0), cfg.get("brightness", 100)))
    drawing.draw_calendar(state["time"][2], x, y, header)
