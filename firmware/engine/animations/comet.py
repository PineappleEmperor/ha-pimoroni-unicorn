"""Comet trail animation."""

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    _g.set_pen(_g.create_pen(*bg_color))
    _g.rectangle(ax, ay, aw, ah)
    pos   = (elapsed_ms // 8) % (aw + 8)
    trail = 6
    cy    = ay + ah // 2
    for i in range(trail):
        px = pos - i
        if 0 <= px < aw:
            v = 255 - i * (255 // trail)
            _g.set_pen(_g.create_pen(
                color[0] * v // 255,
                color[1] * v // 255,
                color[2] * v // 255,
            ))
            _g.pixel(ax + px, cy)
            if ah > 2:
                _g.pixel(ax + px, cy - 1)
                _g.pixel(ax + px, cy + 1)

ANIMATIONS = {"comet": _render}
