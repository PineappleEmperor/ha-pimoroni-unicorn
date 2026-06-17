"""Pulsing brightness animation."""

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    t = (elapsed_ms % 1000) / 1000.0
    v = t * 2 if t < 0.5 else (1.0 - t) * 2
    _g.set_pen(_g.create_pen(int(color[0] * v), int(color[1] * v), int(color[2] * v)))
    _g.rectangle(ax, ay, aw, ah)

ANIMATIONS = {"pulse": _render}
