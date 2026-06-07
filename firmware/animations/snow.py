"""Falling snow animation."""

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    _g.set_pen(_g.create_pen(*bg_color))
    _g.rectangle(ax, ay, aw, ah)
    _g.set_pen(_g.create_pen(*color))
    tick = elapsed_ms // 120
    for col in range(aw):
        row = (tick + col * 5 + col * col) % (ah + 4) - 2
        if 0 <= row < ah:
            _g.pixel(ax + col, ay + row)

ANIMATIONS = {"snow": _render}
