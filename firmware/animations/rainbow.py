"""Scrolling rainbow animation."""

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    offset = (elapsed_ms // 20) % 360
    for px in range(aw):
        r, g, b = _hsv_to_rgb(((px * 360 // aw) + offset) % 360 / 360.0, 1.0, 1.0)
        _g.set_pen(_g.create_pen(r, g, b))
        for py in range(ah):
            _g.pixel(ax + px, ay + py)

ANIMATIONS = {"rainbow": _render}
