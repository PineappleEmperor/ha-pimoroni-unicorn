# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Energy widget unit (battery + value)."""
from . import drawing

WIDGET = {
    "id": "energy", "label": "Energy (battery + value)", "w": 14, "h": 5, "variants": [],
    "default_cfg": {"digits": 1, "decimals": 1},
    "cfg_fields": [
        {"key": "digits", "type": "number", "min": 1, "max": 3, "step": 1, "label": "Range (int digits)"},
        {"key": "decimals", "type": "number", "min": 0, "max": 2, "step": 1, "label": "Decimals"},
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
        mode=state["energy_mode"], consumption=state["consumption"],
        battery_animation=state["battery_animation"], decimals=int(cfg.get("decimals", 1)),
    )
