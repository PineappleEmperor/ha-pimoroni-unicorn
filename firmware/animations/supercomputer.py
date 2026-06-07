"""Supercomputer blinking light animation."""

_lifetime = None
_age      = None
_aw       = 0
_ah       = 0


def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    global _lifetime, _age, _aw, _ah
    if _lifetime is None or _aw != aw or _ah != ah:
        _aw       = aw
        _ah       = ah
        n         = aw * ah
        _lifetime = [1.0 + random.uniform(0.0, 0.1) for _ in range(n)]
        _age      = [random.uniform(0.0, 1.0) * _lifetime[i] for i in range(n)]

    for i in range(_aw * _ah):
        if _age[i] >= _lifetime[i]:
            _age[i]      = 0.0
            _lifetime[i] = 1.0 + random.uniform(0.0, 0.1)
        _age[i] += 0.025

    cr, cg, cb = color
    for y in range(ah):
        for x in range(aw):
            i = x + y * aw
            a  = _age[i]
            lt = _lifetime[i]
            if a < lt * 0.3:
                _g.set_pen(_g.create_pen(cr, cg, cb))
            elif a < lt * 0.5:
                decay = (lt * 0.5 - a) * 5.0
                _g.set_pen(_g.create_pen(int(decay * cr), int(decay * cg), int(decay * cb)))
            else:
                _g.set_pen(0)
            _g.pixel(ax + x, ay + y)


ANIMATIONS = {"supercomputer": _render}
