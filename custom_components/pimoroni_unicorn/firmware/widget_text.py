"""Static text widget unit."""
import drawing

WIDGET = {
    "id": "text", "label": "Text", "w": 19, "h": 5, "variants": [],
    "default_cfg": {"text": "HELLO", "color": [255, 255, 255],
                    "font": "font3x5", "color_mode": "solid", "speed": 3, "spacing": 0,
                    "brightness": 100},
    "cfg_fields": [
        {"key": "text", "type": "text", "label": "Text"},
        {"key": "font", "type": "select", "options": ["font3x5", "font5x9"], "label": "Font"},
        {"key": "color", "type": "rgb", "label": "Colour"},
        {"key": "color_mode", "type": "select",
         "options": ["solid", "rainbow", "per_char"], "label": "Colour mode"},
        {"key": "colors", "type": "rgblist", "label": "Per-char colours"},
        {"key": "speed", "type": "number", "min": 0, "max": 10, "step": 1, "label": "Rainbow speed"},
        {"key": "spacing", "type": "number", "min": -2, "max": 6, "step": 1, "label": "Letter spacing"},
        {"key": "brightness", "type": "range", "min": 10, "max": 100, "step": 5, "label": "Brightness"},
    ],
    "multi": True,
    "requires": [],
}


def box(cfg):
    """Width and height of the configured text in the chosen font."""
    font = cfg.get("font", "font3x5")
    h = 9 if font == "font5x9" else 5
    return (max(1, drawing.text_width(cfg.get("text", ""), font=font, spacing=cfg.get("spacing", 0))), h)


def render(g, x, y, w, h, cfg, state):
    """Draw the static text (uppercased by the 3x5 font)."""
    drawing.draw_text_fx(cfg.get("text", ""), x, y, cfg, state.get("elapsed_ms", 0))
