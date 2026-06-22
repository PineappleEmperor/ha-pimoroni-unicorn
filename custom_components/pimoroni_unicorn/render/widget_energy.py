# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Energy widget unit (battery + value)."""
from . import drawing

WIDGET = {
    "id": "energy", "label": "Energy (battery + value)", "w": 14, "h": 5, "variants": [],
    "default_cfg": {"digits": 1, "decimals": 1, "mode": "Net", "animation": "off",
                    "brightness": 100, "gap": 1,
                    "solar_entity": "", "consumption_entity": "", "soc_entity": "",
                    "charging_entity": ""},
    "cfg_fields": [
        {"key": "digits", "type": "number", "min": 1, "max": 3, "step": 1, "label": "Range (int digits)"},
        {"key": "decimals", "type": "number", "min": 0, "max": 2, "step": 1, "label": "Decimals"},
        {"key": "mode", "type": "select", "options": ["Net", "Solar", "Consumption"], "label": "Value"},
        {"key": "animation", "type": "select", "options": ["off", "on"], "label": "Battery animation"},
        {"key": "gap", "type": "number", "min": 0, "max": 8, "step": 1, "label": "Battery–value gap"},
        {"key": "brightness", "type": "range", "min": 10, "max": 100, "step": 5, "label": "Brightness"},
        {"key": "solar_entity", "type": "entity", "label": "Solar entity (else global)"},
        {"key": "consumption_entity", "type": "entity", "label": "Consumption entity (else global)"},
        {"key": "soc_entity", "type": "entity", "label": "Battery % entity (else global)"},
        {"key": "charging_entity", "type": "entity", "label": "Charging entity (else global)"},
    ],
    "requires": ["font:digits"],
}


def _num(state, cfg, key, fallback):
    """Per-widget numeric entity value if configured and present, else the global feed."""
    ent = cfg.get(key)
    if ent:
        val = state.get(ent)
        if val is not None:
            return val
    return state[fallback]


def _charging(state, cfg):
    """Per-widget charging entity (on/off dot feed) if configured, else the global feed."""
    ent = cfg.get("charging_entity")
    if ent:
        sd = state.get("display_sensors", {}).get(ent)
        if sd is not None:
            return bool(sd.get("state"))
    return state["charging"]


def box(cfg):
    """Footprint for the digit/decimal config."""
    # battery(4) + gap + value field. integer digit = 4px, decimal point = 2px, each dp = 4px.
    d = max(1, int(cfg.get("digits", 1)))
    k = max(0, int(cfg.get("decimals", 1)))
    gap = max(0, int(cfg.get("gap", 1)))
    value = d * 4 + (2 + k * 4 if k > 0 else 0) - 1
    return (4 + gap + value, 5)


def render(g, x, y, w, h, cfg, state):
    """Draw the battery and value."""
    drawing.draw_energy(
        x, y, w, h,
        solar=_num(state, cfg, "solar_entity", "solar"),
        battery_soc=int(_num(state, cfg, "soc_entity", "soc")),
        is_charging=_charging(state, cfg),
        mode=cfg.get("mode", "Net"),
        consumption=_num(state, cfg, "consumption_entity", "consumption"),
        battery_animation=cfg.get("animation") == "on", decimals=int(cfg.get("decimals", 1)),
        brightness=cfg.get("brightness", 100), gap=int(cfg.get("gap", 1)),
    )
