"""Flashing colour animation."""

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    c = color if (elapsed_ms // 160) % 2 == 0 else bg_color
    _g.set_pen(_g.create_pen(*c))
    _g.rectangle(ax, ay, aw, ah)

ANIMATIONS = {"flash": _render}
