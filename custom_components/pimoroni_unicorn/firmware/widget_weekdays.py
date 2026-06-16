"""Weekdays widget unit."""
import drawing

WIDGET = {
    "id": "weekdays", "label": "Weekdays", "w": 20, "h": 1, "variants": ["big", "small"],
    "default_cfg": {"variant": "big", "active": [0, 0, 128], "inactive": [60, 60, 60]},
    "cfg_fields": [
        {"key": "variant", "type": "select", "options": ["big", "small"]},
        {"key": "active", "type": "rgb", "label": "Active"},
        {"key": "inactive", "type": "rgb", "label": "Inactive"},
    ],
    "requires": [],
}


def box(cfg):
    """Footprint for the variant."""
    return (13, 2) if cfg.get("variant") == "small" else (20, 1)


def render(g, x, y, w, h, cfg, state):
    """Draw the weekday row."""
    active   = g.create_pen(*(cfg.get("active")   or (0, 0, 128)))
    inactive = g.create_pen(*(cfg.get("inactive") or (60, 60, 60)))
    if cfg.get("variant", "big") == "small":
        drawing.draw_weekdays(state["time"][6], x, y, active, inactive)
    else:
        drawing.draw_big_weekdays(state["time"][6], x, y, active, inactive)
