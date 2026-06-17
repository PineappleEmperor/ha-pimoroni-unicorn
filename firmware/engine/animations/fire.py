"""Fire simulation animation."""

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    heat = _get_fire_heat()
    if heat is None or len(heat) != aw * ah:
        heat = [0] * (aw * ah)
        _set_fire_heat(heat)
    for x in range(aw):
        heat[x + (ah - 1) * aw] = random.randint(160, 255)
    for y in range(ah - 2, -1, -1):
        for x in range(aw):
            s = (heat[x + (y + 1) * aw]
                 + heat[max(x - 1, 0) + (y + 1) * aw]
                 + heat[min(x + 1, aw - 1) + (y + 1) * aw])
            heat[x + y * aw] = max(0, s // 3 - random.randint(0, 12))
    for y in range(ah):
        for x in range(aw):
            v = heat[x + y * aw]
            if v < 80:
                r, g, b = 0, 0, 0
            elif v < 128:
                r, g, b = v, 0, 0
            elif v < 192:
                r, g, b = 255, (v - 128) * 2, 0
            else:
                r, g, b = 255, 255, (v - 192) * 4
            _g.set_pen(_g.create_pen(r, g, b))
            _g.pixel(ax + x, ay + y)

ANIMATIONS = {"fire": _render}
