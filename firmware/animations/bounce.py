"""Bouncing pixel animation."""

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    _g.set_pen(_g.create_pen(*bg_color))
    _g.rectangle(ax, ay, aw, ah)
    cx = (elapsed_ms // 12) % ((aw - 1) * 2)
    cy = (elapsed_ms // 18) % ((ah - 1) * 2)
    bx = cx if cx < aw else (aw - 1) * 2 - cx
    by = cy if cy < ah else (ah - 1) * 2 - cy
    _g.set_pen(_g.create_pen(*color))
    _g.pixel(ax + bx, ay + by)

ANIMATIONS = {"bounce": _render}
