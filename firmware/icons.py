"""Static 8×8 pixel icons for Pimoroni Unicorn notification display."""

_g = None

ICON_SIZE = 8

_K = (0,   0,   0)    # black / transparent
_W = (255, 255, 255)  # white
_G = (0,   180, 50)   # green
_Y = (220, 180, 0)    # yellow
_R = (220, 50,  30)   # red
_O = (220, 100, 0)    # orange
_B = (50,  130, 220)  # blue
_C = (160, 210, 255)  # light blue (cloud)
_Z = (70,  70,  70)   # grey


def _b(*rows):
    return bytes([v for row in rows for rgb in row for v in rgb])


STATIC_ICONS = {
    "battery_full": _b(
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_W, _W, _W, _W, _W, _W, _W, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _W, _W, _W, _W, _W, _W, _W),
    ),
    "battery_half": _b(
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_W, _W, _W, _W, _W, _W, _W, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _Z, _Z, _Z, _Z, _Z, _Z, _W),
        (_W, _Z, _Z, _Z, _Z, _Z, _Z, _W),
        (_W, _W, _W, _W, _W, _W, _W, _W),
    ),
    "battery_low": _b(
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_W, _W, _W, _W, _W, _W, _W, _W),
        (_W, _K, _K, _K, _K, _K, _K, _W),
        (_W, _K, _K, _K, _K, _K, _K, _W),
        (_W, _K, _K, _K, _K, _K, _K, _W),
        (_W, _R, _R, _R, _R, _R, _R, _W),
        (_W, _W, _W, _W, _W, _W, _W, _W),
    ),
    "battery_charging": _b(
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_W, _W, _W, _W, _W, _W, _W, _W),
        (_W, _G, _G, _Y, _G, _G, _G, _W),
        (_W, _G, _Y, _Y, _G, _G, _G, _W),
        (_W, _G, _G, _Y, _Y, _G, _G, _W),
        (_W, _G, _G, _G, _Y, _G, _G, _W),
        (_W, _W, _W, _W, _W, _W, _W, _W),
    ),
    "solar": _b(
        (_K, _K, _K, _K, _K, _K, _K, _K),
        (_B, _Z, _B, _Z, _B, _Z, _K, _K),
        (_Z, _B, _Z, _B, _Z, _B, _K, _K),
        (_B, _Z, _B, _Z, _B, _Z, _K, _K),
        (_Z, _B, _Z, _B, _Z, _B, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
        (_K, _K, _K, _W, _K, _K, _K, _K),
        (_K, _W, _W, _W, _W, _W, _K, _K),
    ),
    "alert": _b(
        (_K, _K, _K, _O, _K, _K, _K, _K),
        (_K, _K, _O, _O, _O, _K, _K, _K),
        (_K, _K, _O, _W, _O, _K, _K, _K),
        (_K, _O, _O, _W, _O, _O, _K, _K),
        (_K, _O, _K, _W, _K, _O, _K, _K),
        (_O, _O, _K, _K, _K, _O, _O, _K),
        (_O, _O, _K, _W, _K, _O, _O, _K),
        (_O, _O, _O, _O, _O, _O, _O, _K),
    ),
    "home": _b(
        (_K, _K, _K, _W, _K, _K, _K, _K),
        (_K, _K, _W, _W, _W, _K, _K, _K),
        (_K, _W, _W, _W, _W, _W, _K, _K),
        (_W, _W, _K, _K, _K, _W, _W, _K),
        (_K, _K, _W, _W, _W, _W, _K, _K),
        (_K, _K, _W, _K, _K, _W, _K, _K),
        (_K, _K, _W, _K, _K, _W, _K, _K),
        (_K, _K, _W, _W, _W, _W, _K, _K),
    ),
    "lock": _b(
        (_K, _K, _Y, _Y, _Y, _K, _K, _K),
        (_K, _Y, _K, _K, _K, _Y, _K, _K),
        (_K, _Y, _K, _K, _K, _Y, _K, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_Y, _Y, _K, _W, _K, _Y, _Y, _K),
        (_Y, _Y, _K, _W, _K, _Y, _Y, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
    ),
    "unlock": _b(
        (_K, _K, _K, _K, _Y, _Y, _K, _K),
        (_K, _K, _K, _K, _K, _Y, _K, _K),
        (_K, _K, _K, _K, _K, _Y, _K, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_Y, _Y, _K, _W, _K, _Y, _Y, _K),
        (_Y, _Y, _K, _W, _K, _Y, _Y, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
    ),
    "thermometer": _b(
        (_K, _K, _K, _W, _W, _K, _K, _K),
        (_K, _K, _K, _W, _K, _K, _K, _K),
        (_K, _K, _K, _W, _K, _K, _K, _K),
        (_K, _K, _K, _W, _K, _K, _K, _K),
        (_K, _K, _K, _R, _K, _K, _K, _K),
        (_K, _K, _R, _R, _R, _K, _K, _K),
        (_K, _W, _R, _R, _R, _W, _K, _K),
        (_K, _K, _W, _W, _W, _K, _K, _K),
    ),
    "sun": _b(
        (_K, _Y, _K, _Y, _K, _Y, _K, _K),
        (_K, _K, _Y, _Y, _Y, _K, _K, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_K, _Y, _Y, _Y, _Y, _Y, _K, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_K, _K, _Y, _Y, _Y, _K, _K, _K),
        (_K, _Y, _K, _Y, _K, _Y, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
    ),
    "cloud": _b(
        (_K, _K, _C, _C, _C, _K, _K, _K),
        (_K, _C, _C, _C, _C, _C, _K, _K),
        (_C, _C, _C, _C, _C, _C, _C, _K),
        (_C, _C, _C, _C, _C, _C, _C, _K),
        (_C, _C, _C, _C, _C, _C, _C, _K),
        (_K, _C, _C, _C, _C, _C, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
    ),
    "rain": _b(
        (_K, _K, _C, _C, _C, _K, _K, _K),
        (_K, _C, _C, _C, _C, _C, _K, _K),
        (_C, _C, _C, _C, _C, _C, _K, _K),
        (_K, _C, _C, _C, _C, _K, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
        (_B, _K, _B, _K, _B, _K, _K, _K),
        (_K, _B, _K, _B, _K, _B, _K, _K),
        (_B, _K, _B, _K, _B, _K, _K, _K),
    ),
    "check": _b(
        (_K, _K, _K, _K, _K, _K, _G, _K),
        (_K, _K, _K, _K, _K, _G, _G, _K),
        (_G, _K, _K, _K, _G, _G, _K, _K),
        (_G, _G, _K, _G, _G, _K, _K, _K),
        (_K, _G, _G, _G, _K, _K, _K, _K),
        (_K, _K, _G, _K, _K, _K, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
    ),
}


def init(graphics):
    global _g
    _g = graphics


def draw_icon(icon, x, y):
    """Draw an 8×8 icon at (x, y). icon is a name string or flat list of [r,g,b]."""
    if isinstance(icon, str):
        data = STATIC_ICONS.get(icon)
        if data is None:
            return False
    else:
        data = bytes([v for rgb in icon for v in rgb])

    for i in range(ICON_SIZE * ICON_SIZE):
        r = data[i * 3]
        g = data[i * 3 + 1]
        b = data[i * 3 + 2]
        if r or g or b:
            _g.set_pen(_g.create_pen(r, g, b))
            _g.pixel(x + (i % ICON_SIZE), y + (i // ICON_SIZE))
    return True
