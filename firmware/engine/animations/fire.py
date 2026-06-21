"""Fire simulation animation."""

_FIRE_STEP_MS = 70  # advance the flames this often (speed-scaled time); was every frame -> too fast

def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    state = _get_fire_heat()
    if not isinstance(state, tuple) or len(state[0]) != aw * ah:
        state = ([0] * (aw * ah), None)
    heat, last = state
    # Advance the heat sim on a (effect_speed-scaled) clock, not every render frame, so the
    # flames have a sane default pace and effect_speed actually changes how fast they move.
    if last is None or elapsed_ms - last >= _FIRE_STEP_MS:
        last = elapsed_ms
        for x in range(aw):
            heat[x + (ah - 1) * aw] = random.randint(160, 255)
        for y in range(ah - 2, -1, -1):
            for x in range(aw):
                s = (heat[x + (y + 1) * aw]
                     + heat[max(x - 1, 0) + (y + 1) * aw]
                     + heat[min(x + 1, aw - 1) + (y + 1) * aw])
                heat[x + y * aw] = max(0, s // 3 - random.randint(0, 12))
    _set_fire_heat((heat, last))
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
