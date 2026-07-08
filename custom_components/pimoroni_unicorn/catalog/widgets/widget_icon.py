"""Icon widget unit: draws a named icon (built-in 8x8 or imported, up to full-screen)."""
import declarative
import icons

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
    """Footprint of the configured icon at its native size (built-ins are 8x8)."""
    return icons.icon_size(cfg.get("icon", ""))


def render(g, x, y, w, h, cfg, state):
    """Draw the configured icon."""
    declarative.render(g, _SPEC, x, y, w, h, cfg, state)
