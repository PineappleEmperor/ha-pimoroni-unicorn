"""Confetti colour burst animation."""

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    _g.set_pen(_g.create_pen(*bg_color))
    _g.rectangle(ax, ay, aw, ah)
    seed = elapsed_ms // 80
    for i in range(aw * ah // 4):
        px  = (seed * 7  + i * 13) % aw
        py  = (seed * 3  + i * 17) % ah
        hue = (seed * 23 + i * 37) % 360
        r, g, b = _hsv_to_rgb(hue / 360.0, 1.0, 1.0)
        _g.set_pen(_g.create_pen(r, g, b))
        _g.pixel(ax + px, ay + py)

ANIMATIONS = {"confetti": _render}
