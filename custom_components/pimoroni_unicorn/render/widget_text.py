# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Static text widget unit."""
from . import drawing

WIDGET = {
    "id": "text", "label": "Text", "w": 19, "h": 5, "variants": [],
    "default_cfg": {"text": "HELLO", "color": [255, 255, 255],
                    "color_mode": "solid", "speed": 3},
    "cfg_fields": [
        {"key": "text", "type": "text", "label": "Text"},
        {"key": "color", "type": "rgb", "label": "Colour"},
        {"key": "color_mode", "type": "select",
         "options": ["solid", "rainbow", "per_char"], "label": "Colour mode"},
        {"key": "colors", "type": "rgblist", "label": "Per-char colours"},
        {"key": "speed", "type": "number", "min": 0, "max": 10, "step": 1, "label": "Rainbow speed"},
    ],
    "multi": True,
    "requires": [],
}


def box(cfg):
    """Width of the configured text in the 3x5 font; fixed 5px height."""
    return (max(1, drawing.text_width(cfg.get("text", ""))), 5)


def render(g, x, y, w, h, cfg, state):
    """Draw the static text (uppercased by the 3x5 font)."""
    drawing.draw_text_fx(cfg.get("text", ""), x, y, cfg, state.get("elapsed_ms", 0))
