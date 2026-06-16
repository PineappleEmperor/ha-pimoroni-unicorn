"""Interpreter for declarative (JSON) widget specs, drawn with engine primitives."""
import drawing

_FONTS = {
    "digits":   (drawing.DIGITS, 3),
    "blocky":   (drawing.BLOCKY, 4),
    "tall":     (drawing.TALL, 3),
    "humanist": (drawing.HUMANIST, 4),
}


def box(spec, cfg=None):
    """Footprint declared by the spec."""
    return (spec.get("w", 8), spec.get("h", 8))


def _value_text(op, state):
    val = state.get(op.get("bind"))
    if val is None:
        return ""
    try:
        return op.get("fmt", "{}").format(val)
    except (ValueError, KeyError, IndexError, TypeError):
        return str(val)


def _draw_value(g, op, x, y, state, pen):
    table, fw = _FONTS.get(op.get("font", "digits"), _FONTS["digits"])
    cx = x
    for ch in _value_text(op, state):
        if "0" <= ch <= "9":
            drawing._draw_font_digit(table, fw, int(ch), cx, y, pen)
            cx += fw + 1
        elif ch == ".":
            g.set_pen(pen)
            g.pixel(cx, y + 4)
            cx += 2
        elif ch == ":":
            g.set_pen(pen)
            g.pixel(cx, y + 1)
            g.pixel(cx, y + 3)
            cx += 2
        elif ch == "-":
            g.set_pen(pen)
            g.rectangle(cx, y + 2, fw, 1)
            cx += fw + 1
        else:
            cx += fw + 1


def _draw_bar(g, op, x, y, state, pen):
    w = op.get("w", 1)
    h = op.get("h", 1)
    if op.get("bg"):
        g.set_pen(g.create_pen(*op["bg"]))
        g.rectangle(x, y, w, h)
    val = state.get(op.get("bind"), 0) or 0
    mx = op.get("max", 100) or 1
    fill = int(max(0.0, min(1.0, val / mx)) * w)
    if fill > 0:
        g.set_pen(pen)
        g.rectangle(x, y, fill, h)


def _draw_dot(g, op, x, y, state):
    sensor = state.get("display_sensors", {}).get(op.get("bind"), {})
    rgb = op.get("on_color", (0, 255, 0)) if sensor.get("state") else op.get("off_color", (20, 20, 20))
    g.set_pen(g.create_pen(*rgb))
    g.rectangle(x, y, op.get("w", 2), op.get("h", 2))


def render(g, spec, x, y, w, h, cfg, state):
    """Draw a declarative widget spec at (x, y)."""
    for op in spec.get("draw", []):
        kind = op.get("op")
        ox = x + op.get("x", 0)
        oy = y + op.get("y", 0)
        pen = g.create_pen(*(op.get("color") or cfg.get("color") or (255, 255, 255)))
        if kind == "rect":
            g.set_pen(pen)
            g.rectangle(ox, oy, op.get("w", 1), op.get("h", 1))
        elif kind == "pixel":
            g.set_pen(pen)
            g.pixel(ox, oy)
        elif kind == "icon":
            drawing.draw_icon(op.get("name", ""), ox, oy)
        elif kind == "value":
            _draw_value(g, op, ox, oy, state, pen)
        elif kind == "bar":
            _draw_bar(g, op, ox, oy, state, pen)
        elif kind == "dot":
            _draw_dot(g, op, ox, oy, state)
