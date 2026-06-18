"""Clock widget unit."""
import drawing

WIDGET = {
    "id": "clock", "label": "Clock", "w": 23, "h": 7,
    "variants": ["big", "small", "wide", "blocky", "tall", "humanist", "stacked"],
    "default_cfg": {"variant": "big", "color": [255, 255, 255]},
    "cfg_fields": [
        {"key": "variant", "type": "select",
         "options": ["big", "small", "wide", "blocky", "tall", "humanist", "stacked"]},
        {"key": "color", "type": "rgb", "label": "Colour"},
    ],
    "requires": ["font:digits", "font:big_digits", "font:blocky", "font:tall", "font:humanist"],
}

_BOXES = {
    "small":    (15, 5),
    "wide":     (16, 5),
    "blocky":   (20, 5),
    "tall":     (16, 7),
    "humanist": (20, 7),
    "stacked":  (11, 15),
}


def box(cfg):
    """Footprint for the selected variant."""
    return _BOXES.get(cfg.get("variant"), (23, 7))


def render(g, x, y, w, h, cfg, state):
    """Draw the clock."""
    drawing.draw_clock(x, state["time"], y=y, variant=cfg.get("variant", "big"),
                       color=cfg.get("color"))
