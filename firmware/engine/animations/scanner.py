"""Knight Rider-style scanning bar animation."""

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    _g.set_pen(_g.create_pen(*bg_color))
    _g.rectangle(ax, ay, aw, ah)
    cycle = (elapsed_ms // 10) % (aw * 2)
    pos   = cycle if cycle < aw else aw * 2 - 1 - cycle
    for dx in range(-2, 3):
        px = pos + dx
        if 0 <= px < aw:
            v = 255 - abs(dx) * 70
            _g.set_pen(_g.create_pen(
                color[0] * v // 255,
                color[1] * v // 255,
                color[2] * v // 255,
            ))
            for py in range(ah):
                _g.pixel(ax + px, ay + py)

ANIMATIONS = {"scanner": _render}
