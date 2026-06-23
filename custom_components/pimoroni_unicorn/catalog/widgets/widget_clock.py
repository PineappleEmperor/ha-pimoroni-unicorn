"""Clock widget unit."""
import drawing

WIDGET = {
    "id": "clock", "label": "Clock", "w": 23, "h": 7, "variants": [],
    "default_cfg": {"font": "big", "layout": "row", "digit_gap": 1, "pair_gap": 2,
                    "color": [255, 255, 255], "brightness": 100},
    "cfg_fields": [
        {"key": "font", "type": "select",
         "options": ["big", "digits", "digits-serif", "blocky", "blocky-serif", "tall", "tall-bold",
                     "large", "huge", "jumbo", "humanist"],
         "label": "Digit font"},
        {"key": "layout", "type": "select", "options": ["row", "stacked"], "label": "Layout"},
        {"key": "digit_gap", "type": "number", "min": 0, "max": 8, "step": 1, "label": "Digit gap"},
        {"key": "pair_gap", "type": "number", "min": 0, "max": 12, "step": 1, "label": "HH–MM gap"},
        {"key": "color", "type": "rgb", "label": "Colour"},
        {"key": "brightness", "type": "range", "min": 10, "max": 100, "step": 5, "label": "Brightness"},
    ],
    "requires": ["font:digits", "font:digits_serif", "font:big_digits", "font:blocky",
                 "font:blocky_serif", "font:tall", "font:tall_bold", "font:large",
                 "font:huge", "font:jumbo", "font:humanist"],
}

# Legacy variant -> (font, layout, digit_gap, pair_gap). Pre-rc5 layouts still render.
_LEGACY = {
    "big":      ("big", "row", 1, 2),
    "small":    ("digits", "row", 1, 1),
    "wide":     ("digits", "row", 1, 2),
    "blocky":   ("blocky", "row", 1, 2),
    "tall":     ("tall", "row", 1, 2),
    "humanist": ("humanist", "row", 1, 2),
    "stacked":  ("big", "stacked", 1, 2),
}


def _resolve(cfg):
    """Return (font, layout, digit_gap, pair_gap), migrating a legacy variant if present."""
    v = cfg.get("variant")
    if v in _LEGACY:
        return _LEGACY[v]
    return (cfg.get("font", "big"), cfg.get("layout", "row"),
            int(cfg.get("digit_gap", 1)), int(cfg.get("pair_gap", 2)))


def box(cfg):
    """Footprint for the selected face, layout and gaps."""
    font, layout, dg, pg = _resolve(cfg)
    return drawing.clock_box(font, layout, dg, pg)


def render(g, x, y, w, h, cfg, state):
    """Draw the clock."""
    font, layout, dg, pg = _resolve(cfg)
    color = drawing.dim(cfg.get("color") or (255, 255, 255), cfg.get("brightness", 100))
    drawing.draw_clock(x, state["time"], y=y, font=font, layout=layout,
                       color=color, digit_gap=dg, pair_gap=pg)
