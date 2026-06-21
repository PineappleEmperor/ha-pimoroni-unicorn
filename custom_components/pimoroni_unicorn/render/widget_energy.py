# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Energy widget unit (battery + value)."""
from . import drawing

WIDGET = {
    "id": "energy", "label": "Energy (battery + value)", "w": 14, "h": 5, "variants": [],
    "default_cfg": {"digits": 1, "decimals": 1, "mode": "Net", "animation": "off", "brightness": 100},
    "cfg_fields": [
        {"key": "digits", "type": "number", "min": 1, "max": 3, "step": 1, "label": "Range (int digits)"},
        {"key": "decimals", "type": "number", "min": 0, "max": 2, "step": 1, "label": "Decimals"},
        {"key": "mode", "type": "select", "options": ["Net", "Solar", "Consumption"], "label": "Value"},
        {"key": "animation", "type": "select", "options": ["off", "on"], "label": "Battery animation"},
        {"key": "brightness", "type": "range", "min": 10, "max": 100, "step": 5, "label": "Brightness"},
    ],
    "requires": ["font:digits"],
}


def box(cfg):
    """Footprint for the digit/decimal config."""
    # battery(4)+gap(1) + value field. integer digit = 4px, decimal point = 2px, each dp = 4px.
    d = max(1, int(cfg.get("digits", 1)))
    k = max(0, int(cfg.get("decimals", 1)))
    value = d * 4 + (2 + k * 4 if k > 0 else 0) - 1
    return (5 + value, 5)


def render(g, x, y, w, h, cfg, state):
    """Draw the battery and value."""
    drawing.draw_energy(
        x, y, w, h,
        solar=state["solar"], battery_soc=state["soc"], is_charging=state["charging"],
        mode=cfg.get("mode", "Net"), consumption=state["consumption"],
        battery_animation=cfg.get("animation") == "on", decimals=int(cfg.get("decimals", 1)),
        brightness=cfg.get("brightness", 100),
    )
