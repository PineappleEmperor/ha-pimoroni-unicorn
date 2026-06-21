"""Interpreter for declarative (JSON) widget specs, drawn with engine primitives."""
import drawing
import icons

_FONTS = {
    "digits":   (drawing.DIGITS, 3),
    "blocky":   (drawing.BLOCKY, 4),
    "tall":     (drawing.TALL, 3),
    "humanist": (drawing.HUMANIST, 4),
}


def box(spec, cfg=None):
    """Footprint, honouring cfg w/h overrides for configurable widgets."""
    cfg = cfg or {}
    return (cfg.get("w", spec.get("w", 8)), cfg.get("h", spec.get("h", 8)))


def _resolve(op, cfg):
    """Substitute $name op fields from cfg (cfg-parameterised widgets)."""
    out = {}
    for k, v in op.items():
        out[k] = cfg.get(v[1:]) if isinstance(v, str) and v[:1] == "$" else v
    return out


def _dim(rgb, b):
    """Scale an (r, g, b) by a 0-100 brightness; 100 (or missing) is unchanged."""
    if not rgb or b >= 100:
        return rgb
    f = max(0, b) / 100.0
    return (int(rgb[0] * f), int(rgb[1] * f), int(rgb[2] * f))


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


def _draw_bar(g, op, x, y, state, pen, bright):
    w = op.get("w", 1)
    h = op.get("h", 1)
    if op.get("bg"):
        g.set_pen(g.create_pen(*_dim(op["bg"], bright)))
        g.rectangle(x, y, w, h)
    val = state.get(op.get("bind"), 0) or 0
    mx = op.get("max", 100) or 1
    fill = int(max(0.0, min(1.0, val / mx)) * w)
    if fill > 0:
        g.set_pen(pen)
        g.rectangle(x, y, fill, h)


def _draw_dot(g, op, x, y, state, bright):
    on = state.get("display_sensors", {}).get(op.get("bind"), {}).get("state")
    on_rgb = op.get("on_color", (0, 255, 0))
    if on:
        rgb = on_rgb
    else:
        ob = op.get("off_brightness")
        rgb = _dim(on_rgb, ob) if ob is not None else op.get("off_color", (20, 20, 20))
    g.set_pen(g.create_pen(*_dim(rgb, bright)))
    g.rectangle(x, y, op.get("w", 2), op.get("h", 2))


def render(g, spec, x, y, w, h, cfg, state):
    """Draw a declarative widget spec at (x, y)."""
    bright = cfg.get("brightness", 100)
    for raw in spec.get("draw", []):
        op = _resolve(raw, cfg)
        kind = op.get("op")
        ox = x + op.get("x", 0)
        oy = y + op.get("y", 0)
        pen = g.create_pen(*_dim(op.get("color") or cfg.get("color") or (255, 255, 255), bright))
        if kind == "rect":
            g.set_pen(pen)
            g.rectangle(ox, oy, op.get("w", 1), op.get("h", 1))
        elif kind == "pixel":
            g.set_pen(pen)
            g.pixel(ox, oy)
        elif kind == "icon":
            elapsed = state.get("elapsed_ms", 0) if isinstance(state, dict) else 0
            icons.draw_icon(op.get("name", ""), ox, oy, elapsed)
        elif kind == "value":
            _draw_value(g, op, ox, oy, state, pen)
        elif kind == "bar":
            _draw_bar(g, op, ox, oy, state, pen, bright)
        elif kind == "dot":
            _draw_dot(g, op, ox, oy, state, bright)
