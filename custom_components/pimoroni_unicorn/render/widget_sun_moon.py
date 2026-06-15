# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Sun / moon widget unit."""
from . import drawing

WIDGET = {
    "id": "sun_moon", "label": "Sun / Moon", "w": 7, "h": 7, "variants": [],
    "default_cfg": {"size": 7},
    "cfg_fields": [{"key": "size", "type": "number", "min": 3, "max": 31, "step": 2, "label": "Size"}],
    "requires": [],
}


def box(cfg):
    """Square footprint of the configured size."""
    s = int(cfg.get("size", 7))
    return (s, s)


def render(g, x, y, w, h, cfg, state):
    """Draw the sun/moon disc."""
    drawing.draw_sun_moon(x, y, w, h, solar=state["solar"], sun_below_horizon=state["sun_below"])
