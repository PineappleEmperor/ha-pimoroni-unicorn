"""Date / time text widget unit."""
import drawing

_WD = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
_MO = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
       "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
_MOF = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
_FORMATS = ["weekday", "day", "month", "month_full", "monthday", "year"]
# Widest sample per format, for the editor hit-box (font is fixed-width per glyph).
_SAMPLE = {"weekday": "WWW", "day": "30", "month": "WWW", "month_full": "SEPTEMBER",
           "monthday": "WWW 30", "year": "2026"}
_WD_RAINBOW = [(255, 0, 0), (255, 120, 0), (255, 220, 0), (0, 220, 0),
               (0, 180, 255), (60, 60, 255), (200, 0, 220)]

WIDGET = {
    "id": "date", "label": "Date text", "w": 11, "h": 5, "variants": [],
    "default_cfg": {"format": "weekday", "color": [255, 255, 255], "colors": _WD_RAINBOW,
                    "font": "font3x5", "color_mode": "solid", "spacing": 0,
                    "brightness": 100},
    "cfg_fields": [
        {"key": "format", "type": "select", "options": _FORMATS, "label": "Format"},
        {"key": "font", "type": "select", "options": ["font3x5", "font5x9"], "label": "Font"},
        {"key": "color", "type": "rgb", "label": "Colour"},
        {"key": "color_mode", "type": "select",
         "options": ["solid", "rainbow", "per_char"], "label": "Colour mode"},
        {"key": "colors", "type": "rgblist", "label": "Per-char colours"},
        {"key": "spacing", "type": "number", "min": -2, "max": 6, "step": 1, "label": "Letter spacing"},
        {"key": "brightness", "type": "range", "min": 10, "max": 100, "step": 5, "label": "Brightness"},
    ],
    "multi": True,
    "requires": [],
}


def _format(cfg, t):
    fmt = cfg.get("format", "weekday")
    if fmt == "day":
        return str(t[2])
    if fmt == "month":
        return _MO[t[1] - 1]
    if fmt == "month_full":
        return _MOF[t[1] - 1]
    if fmt == "monthday":
        return _MO[t[1] - 1] + " " + str(t[2])
    if fmt == "year":
        return str(t[0])
    return _WD[t[6]]


def box(cfg):
    """Worst-case width for the chosen format and font, cropping the font's top padding."""
    font = cfg.get("font", "font3x5")
    sample = _SAMPLE.get(cfg.get("format", "weekday"), "WWW")
    h = (9 if font == "font5x9" else 5) - drawing.text_top_pad(sample, font)
    return (max(1, drawing.text_width(sample, font=font, spacing=cfg.get("spacing", 0))), h)


def render(g, x, y, w, h, cfg, state):
    """Draw the formatted date/time text from the current clock, cropping top padding."""
    font = cfg.get("font", "font3x5")
    s = _format(cfg, state["time"])
    if cfg.get("color_mode") == "rainbow":
        cfg = dict(cfg)
        cfg["color"] = _WD_RAINBOW[state["time"][6] % 7]
        cfg["color_mode"] = "solid"
    drawing.draw_text_fx(s, x, y - drawing.text_top_pad(s, font), cfg, state.get("elapsed_ms", 0))
