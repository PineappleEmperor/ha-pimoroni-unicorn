"""Static text widget unit."""
import drawing

WIDGET = {
    "id": "text", "label": "Text", "w": 19, "h": 5, "variants": [],
    "default_cfg": {"text": "HELLO", "color": [255, 255, 255]},
    "cfg_fields": [
        {"key": "text", "type": "text", "label": "Text"},
        {"key": "color", "type": "rgb", "label": "Colour"},
    ],
    "multi": True,
    "requires": [],
}


def box(cfg):
    """Width of the configured text in the 3x5 font; fixed 5px height."""
    return (max(1, drawing.text_width(cfg.get("text", ""))), 5)


def render(g, x, y, w, h, cfg, state):
    """Draw the static text (uppercased by the 3x5 font)."""
    drawing.draw_text(cfg.get("text", ""), x, y, cfg.get("color"))
