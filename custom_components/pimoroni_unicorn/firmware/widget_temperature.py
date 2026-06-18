"""Temperature widget unit: value with unit label and value-based colour."""
import drawing

WIDGET = {
    "id": "temperature", "label": "Temperature", "w": 15, "h": 5, "variants": [],
    "default_cfg": {"unit": "C", "decimals": 0, "color_mode": "value",
                    "color": [255, 255, 255], "cold": [80, 150, 255],
                    "mid": [255, 255, 255], "hot": [255, 80, 40], "low": 5, "high": 25},
    "cfg_fields": [
        {"key": "unit", "type": "select", "options": ["C", "F", "none"], "label": "Unit"},
        {"key": "decimals", "type": "number", "min": 0, "max": 1, "step": 1, "label": "Decimals"},
        {"key": "color_mode", "type": "select", "options": ["value", "solid"], "label": "Colour mode"},
        {"key": "color", "type": "rgb", "label": "Solid colour"},
        {"key": "cold", "type": "rgb", "label": "Cold colour"},
        {"key": "mid", "type": "rgb", "label": "Mid colour"},
        {"key": "hot", "type": "rgb", "label": "Hot colour"},
        {"key": "low", "type": "number", "min": -40, "max": 60, "step": 1, "label": "Cold below"},
        {"key": "high", "type": "number", "min": -40, "max": 60, "step": 1, "label": "Hot at/above"},
    ],
    "multi": True,
    "requires": [],
}


def _text(cfg, temp):
    """Format the temperature value with the configured decimals and unit."""
    dec = max(0, int(cfg.get("decimals", 0)))
    val = ("{:." + str(dec) + "f}").format(temp) if dec else str(int(round(temp)))
    unit = cfg.get("unit", "C")
    return val + "°" + ("" if unit == "none" else unit)


def _color(cfg, temp):
    """Pick the text colour for solid or value-banded mode."""
    if cfg.get("color_mode", "value") == "solid":
        return cfg.get("color") or (255, 255, 255)
    if temp < cfg.get("low", 5):
        return cfg.get("cold") or (80, 150, 255)
    if temp >= cfg.get("high", 25):
        return cfg.get("hot") or (255, 80, 40)
    return cfg.get("mid") or (255, 255, 255)


def box(cfg):
    """Worst-case width for two int digits, decimals, degree and unit (no sign: rare ≤-10°)."""
    dec = max(0, int(cfg.get("decimals", 0)))
    unit = cfg.get("unit", "C")
    sample = "99" + ("." + "9" * dec if dec else "") + "°" + ("" if unit == "none" else unit)
    return (max(1, drawing.text_width(sample, font="font3x5")), 5)


def render(g, x, y, w, h, cfg, state):
    """Draw the temperature value, skipping when none has been received."""
    temp = state.get("temp")
    if temp is None:
        return
    tcfg = {"font": "font3x5", "color_mode": "solid", "color": _color(cfg, float(temp)), "spacing": 0}
    drawing.draw_text_fx(_text(cfg, float(temp)), x, y, tcfg, state.get("elapsed_ms", 0))
