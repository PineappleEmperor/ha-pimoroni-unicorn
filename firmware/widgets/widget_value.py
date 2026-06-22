"""Value widget unit: a numeric sensor readout bound to an entity, configured per instance."""
import declarative

_FONTS = {"digits": (3, 5), "blocky": (4, 5), "tall": (3, 7), "humanist": (4, 7)}

WIDGET = {
    "id": "value", "label": "Value (sensor readout)", "w": 11, "h": 5, "variants": [], "multi": True,
    "default_cfg": {"entity": "", "digits": 3, "decimals": 0, "font": "digits",
                    "color": [255, 255, 255], "brightness": 100},
    "cfg_fields": [
        {"key": "entity", "type": "entity", "label": "Entity"},
        {"key": "digits", "type": "number", "min": 1, "max": 5, "step": 1, "label": "Max digits"},
        {"key": "decimals", "type": "number", "min": 0, "max": 2, "step": 1, "label": "Decimals"},
        {"key": "font", "type": "select", "options": ["digits", "blocky", "tall", "humanist"], "label": "Font"},
        {"key": "color", "type": "rgb", "label": "Colour"},
        {"key": "brightness", "type": "range", "min": 10, "max": 100, "step": 5, "label": "Brightness"},
    ],
    "requires": ["font:digits"],
}


def _fmt(cfg):
    """Python format string for the configured decimal places."""
    return "{:." + str(max(0, int(cfg.get("decimals", 0)))) + "f}"


def box(cfg):
    """Footprint for the configured digit/decimal width and font height."""
    fw, fh = _FONTS.get(cfg.get("font", "digits"), _FONTS["digits"])
    d = max(1, int(cfg.get("digits", 3)))
    k = max(0, int(cfg.get("decimals", 0)))
    width = d * (fw + 1) + (2 + k * (fw + 1) if k > 0 else 0) - 1
    return (width, fh)


def render(g, x, y, w, h, cfg, state):
    """Draw the entity's numeric value with the configured font and colour."""
    spec = {"draw": [{
        "op": "value", "x": 0, "y": 0, "bind": cfg.get("entity", ""),
        "fmt": _fmt(cfg), "font": cfg.get("font", "digits"), "color": cfg.get("color"),
    }]}
    declarative.render(g, spec, x, y, w, h, cfg, state)
