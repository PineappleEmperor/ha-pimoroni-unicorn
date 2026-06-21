"""Sensor widget unit: a state-bound dot, configured per instance."""
import declarative

_SPEC = {"draw": [{
    "op": "dot", "x": 0, "y": 0, "w": "$w", "h": "$h",
    "bind": "$entity", "on_color": "$on_color", "off_mode": "$off_mode",
    "off_color": "$off_color", "off_brightness": "$off_brightness",
}]}

WIDGET = {
    "id": "sensor", "label": "Sensor", "w": 2, "h": 2, "variants": [], "multi": True,
    "default_cfg": {"entity": "", "on_color": [0, 255, 0], "off_mode": "dim",
                    "off_brightness": 15, "off_color": [40, 40, 40], "w": 2, "h": 2},
    "cfg_fields": [
        {"key": "entity", "type": "entity", "label": "Entity"},
        {"key": "on_color", "type": "rgb", "label": "Colour"},
        {"key": "off_mode", "type": "select", "options": ["dim", "colour"], "label": "Off state"},
        {"key": "off_brightness", "type": "range", "min": 0, "max": 100, "step": 5, "label": "Off brightness"},
        {"key": "off_color", "type": "rgb", "label": "Off colour"},
        {"key": "w", "type": "number", "min": 1, "max": 32, "step": 1, "label": "Width"},
        {"key": "h", "type": "number", "min": 1, "max": 32, "step": 1, "label": "Height"},
    ],
    "requires": [],
}


def box(cfg):
    """Footprint from the configured width/height."""
    return (int(cfg.get("w", 2)), int(cfg.get("h", 2)))


def render(g, x, y, w, h, cfg, state):
    """Draw the state-bound dot."""
    declarative.render(g, _SPEC, x, y, w, h, cfg, state)
