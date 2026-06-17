# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Date / time text widget unit."""
from . import drawing

_WD = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
_MO = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN",
       "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
_MOF = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
_FORMATS = ["weekday", "day", "month", "month_full", "monthday", "year"]
# Widest sample per format, for the editor hit-box (font is fixed-width per glyph).
_SAMPLE = {"weekday": "WWW", "day": "30", "month": "WWW", "month_full": "SEPTEMBER",
           "monthday": "WWW 30", "year": "2026"}

WIDGET = {
    "id": "date", "label": "Date text", "w": 11, "h": 5, "variants": [],
    "default_cfg": {"format": "weekday", "color": [255, 255, 255],
                    "color_mode": "solid", "speed": 3},
    "cfg_fields": [
        {"key": "format", "type": "select", "options": _FORMATS, "label": "Format"},
        {"key": "color", "type": "rgb", "label": "Colour"},
        {"key": "color_mode", "type": "select",
         "options": ["solid", "rainbow", "per_char"], "label": "Colour mode"},
        {"key": "speed", "type": "number", "min": 0, "max": 10, "step": 1, "label": "Rainbow speed"},
    ],
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
    """Worst-case width for the chosen format; fixed 5px height."""
    return (max(1, drawing.text_width(_SAMPLE.get(cfg.get("format", "weekday"), "WWW"))), 5)


def render(g, x, y, w, h, cfg, state):
    """Draw the formatted date/time text from the current clock."""
    drawing.draw_text_fx(_format(cfg, state["time"]), x, y, cfg, state.get("elapsed_ms", 0))
