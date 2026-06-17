"""Retro home-computer splash animation."""

_C64 = [
    "                                                     ",
    "                                                     ",
    " OOOOO   OOOOOO    OO    OOOO    OO  OO      XXXXXXX ",
    " OO  OO  OO       OOOO   OO OO   OO  OO      XXXXXXX ",
    " OO  OO  OO      OO  OO  OO  OO  OO  OO      XXXXXXX ",
    " OOOOO   OOOO    OOOOOO  OO  OO   OOOO       XXXXXXX ",
    " OOOO    OO      OO  OO  OO  OO    OO        XXXXXXX ",
    " OO OO   OO      OO  OO  OO OO     OO    OO  XXXXXXX ",
    " OO  OO  OOOOOO  OO  OO  OOOO      OO    OO  XXXXXXX ",
    "                                             XXXXXXX ",
    "                                                     ",
]
_FG_C64 = (230, 210, 250)
_BG_C64 = ( 20,  20, 120)

_SPECTRUM = [
    "                                                     ",
    "                                                     ",
    " O        OOOO    OOOO   OOOOO     O O  O O XXXXXXXX ",
    " O       O    O  O    O  O    O    O O  O O X XXXXXX ",
    " O       O    O  O    O  O    O             X XXXXXX ",
    " O       O    O  OOOOOO  O    O             X XXXXXX ",
    " O       O    O  O    O  O    O             X XXXXXX ",
    " OOOOOO   OOOO   O    O  OOOOO              X XXXXXX ",
    "                                            X      X ",
    "                                            XXXXXXXX ",
    "                                                     ",
]
_FG_SPECTRUM = (  0,   0,   0)
_BG_SPECTRUM = (180, 150, 150)

_BBC = [
    "                                                     ",
    "                                                     ",
    " OOOOO    OO    OOOO   OOO    OOOO      O            ",
    " O    O  O  O  O    O   O    O    O      O           ",
    " O    O O    O O        O    O            O          ",
    " OOOOO  O    O  OOOO    O    O             O         ",
    " O    O OOOOOO      O   O    O            O          ",
    " O    O O    O O    O   O    O    O      O           ",
    " OOOOO  O    O  OOOO   OOO    OOOO      O            ",
    "                                             XXXXXXX ",
    "                                                     ",
]
_FG_BBC = (255, 255, 255)
_BG_BBC = (  0,   0,   0)

_THEMES = [
    (_C64,      _FG_C64,      _BG_C64),
    (_SPECTRUM, _FG_SPECTRUM, _BG_SPECTRUM),
    (_BBC,      _FG_BBC,      _BG_BBC),
]


def _render(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    image, fg, bg = _THEMES[(elapsed_ms // 3000) % 3]
    fg_pen = _g.create_pen(fg[0], fg[1], fg[2])
    bg_pen = _g.create_pen(bg[0], bg[1], bg[2])
    blink  = (elapsed_ms // 300) % 2
    for y, row in enumerate(image):
        if y >= ah:
            break
        for x, pixel in enumerate(row):
            if x >= aw:
                break
            _g.set_pen(fg_pen if (pixel == "O" or (pixel == "X" and blink)) else bg_pen)
            _g.pixel(ax + x, ay + y)


ANIMATIONS = {"retroprompt": _render}
