"""Matrix-style falling column animation."""

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    _g.set_pen(_g.create_pen(*bg_color))
    _g.rectangle(ax, ay, aw, ah)
    tick = elapsed_ms // 80
    for col in range(aw):
        head = (tick + col * 3) % (ah * 2)
        for row in range(ah):
            dist = head - row
            if 0 <= dist < ah:
                v = 255 - dist * (255 // ah)
                _g.set_pen(_g.create_pen(
                    color[0] * v // 255,
                    color[1] * v // 255,
                    color[2] * v // 255,
                ))
                _g.pixel(ax + col, ay + row)

ANIMATIONS = {"matrix": _render}
