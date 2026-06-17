# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Icon widget unit: draws a named 8x8 icon from the engine icon set."""
from . import declarative
from . import icons

_SPEC = {"draw": [{"op": "icon", "name": "$icon", "x": 0, "y": 0}]}

WIDGET = {
    "id": "icon", "label": "Icon", "w": 8, "h": 8, "variants": [], "multi": True,
    "default_cfg": {"icon": "home"},
    "cfg_fields": [
        {"key": "icon", "type": "icon", "label": "Icon"},
    ],
    "requires": [],
}


def box(cfg):
    """Icons are a fixed 8x8 footprint."""
    return (icons.ICON_SIZE, icons.ICON_SIZE)


def render(g, x, y, w, h, cfg, state):
    """Draw the configured icon."""
    declarative.render(g, _SPEC, x, y, w, h, cfg, state)
