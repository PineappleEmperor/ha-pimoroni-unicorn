"""Bar widget unit: a sensor value drawn as a proportional bar, vertical or horizontal."""
import declarative

WIDGET = {
    "id": "bar", "label": "Bar (sensor level)", "w": 16, "h": 3, "variants": [], "multi": True,
    "default_cfg": {"entity": "", "min": 0, "max": 100, "orient": "horizontal",
                    "length": 16, "thickness": 3, "color": [0, 200, 0],
                    "bg": [40, 40, 40], "brightness": 100},
    "cfg_fields": [
        {"key": "entity", "type": "entity", "label": "Entity"},
        {"key": "orient", "type": "select", "options": ["horizontal", "vertical"], "label": "Orientation"},
        {"key": "min", "type": "number", "min": -100000, "max": 100000, "step": 1, "label": "Min value"},
        {"key": "max", "type": "number", "min": -100000, "max": 100000, "step": 1, "label": "Max value"},
        {"key": "length", "type": "number", "min": 1, "max": 53, "step": 1, "label": "Length"},
        {"key": "thickness", "type": "number", "min": 1, "max": 32, "step": 1, "label": "Thickness"},
        {"key": "color", "type": "rgb", "label": "Colour"},
        {"key": "bg", "type": "rgb", "label": "Track colour"},
        {"key": "brightness", "type": "range", "min": 10, "max": 100, "step": 5, "label": "Brightness"},
    ],
    "requires": [],
}


def box(cfg):
    """Footprint: length along the fill axis, thickness across it."""
    length = max(1, int(cfg.get("length", 16)))
    thick = max(1, int(cfg.get("thickness", 3)))
    if cfg.get("orient") == "vertical":
        return (thick, length)
    return (length, thick)


def render(g, x, y, w, h, cfg, state):
    """Draw the entity's value as a proportional bar with an optional track."""
    spec = {"draw": [{
        "op": "bar", "x": 0, "y": 0, "w": w, "h": h,
        "bind": cfg.get("entity", ""), "min": cfg.get("min", 0), "max": cfg.get("max", 100),
        "orient": cfg.get("orient", "horizontal"), "color": cfg.get("color"), "bg": cfg.get("bg"),
    }]}
    declarative.render(g, spec, x, y, w, h, cfg, state)
