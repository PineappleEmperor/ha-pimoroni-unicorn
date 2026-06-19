"""Hardware abstraction layer for Pimoroni Unicorn models."""
from secrets import MODEL

if MODEL == "galactic":
    from galactic import Channel, GalacticUnicorn as _Cls
    from picographics import DISPLAY_GALACTIC_UNICORN as DISPLAY
    MODEL_NAME = "Galactic Unicorn"
    HAS_AUDIO  = True
elif MODEL == "cosmic":
    from cosmic import Channel, CosmicUnicorn as _Cls
    from picographics import DISPLAY_COSMIC_UNICORN as DISPLAY
    MODEL_NAME = "Cosmic Unicorn"
    HAS_AUDIO  = True
elif MODEL == "stellar":
    from picographics import DISPLAY_STELLAR_UNICORN as DISPLAY
    from stellar import StellarUnicorn as _Cls
    MODEL_NAME = "Stellar Unicorn"
    Channel    = None
    HAS_AUDIO  = False
elif MODEL == "unicorn_pack":
    # Unicorn Pack uses picounicorn, not PicoGraphics — main.py needs adaptation.
    from picounicorn import PicoUnicorn as _Cls
    DISPLAY    = None
    MODEL_NAME = "Unicorn Pack"
    Channel    = None
    HAS_AUDIO  = False
else:  # custom
    # Set CUSTOM_WIDTH, CUSTOM_HEIGHT in secrets.py.
    from secrets import CUSTOM_HEIGHT, CUSTOM_WIDTH
    _Cls       = None
    DISPLAY    = None
    MODEL_NAME = "Custom"
    Channel    = None
    HAS_AUDIO  = False

if _Cls is not None:
    SWITCH_BRIGHTNESS_UP   = getattr(_Cls, "SWITCH_BRIGHTNESS_UP",   None)
    SWITCH_BRIGHTNESS_DOWN = getattr(_Cls, "SWITCH_BRIGHTNESS_DOWN", None)
    SWITCH_SLEEP           = getattr(_Cls, "SWITCH_SLEEP",           None)
    unicorn = _Cls()
    WIDTH   = _Cls.WIDTH
    HEIGHT  = _Cls.HEIGHT
else:
    SWITCH_BRIGHTNESS_UP   = None
    SWITCH_BRIGHTNESS_DOWN = None
    SWITCH_SLEEP           = None
    unicorn = None
    WIDTH   = CUSTOM_WIDTH
    HEIGHT  = CUSTOM_HEIGHT

# --- Mounting orientation ---
# Persisted by app.py on an MQTT change (then a reboot). WIDTH/HEIGHT below are the
# *logical* (as-mounted) dims the render code draws into; 90/270 swap them. The physical
# matrix stays PHYS_WIDTH x PHYS_HEIGHT and OrientedSurface maps logical -> physical.
try:
    with open("orientation") as _f:
        ORIENTATION = int(_f.read().strip() or "0")
except (OSError, ValueError):
    ORIENTATION = 0
if ORIENTATION not in (0, 90, 180, 270):
    ORIENTATION = 0

PHYS_WIDTH, PHYS_HEIGHT = WIDTH, HEIGHT
if ORIENTATION in (90, 270):
    WIDTH, HEIGHT = HEIGHT, WIDTH


class OrientedSurface:
    """Logical (rotated) draw surface over the physical PicoGraphics buffer."""

    def __init__(self, g):
        self._g = g

    def _pt(self, x, y):
        if ORIENTATION == 90:
            return (PHYS_WIDTH - 1 - y, x)
        if ORIENTATION == 270:
            return (y, PHYS_HEIGHT - 1 - x)
        return (PHYS_WIDTH - 1 - x, PHYS_HEIGHT - 1 - y)  # 180

    def _rect(self, x, y, w, h):
        ax, ay = self._pt(x, y)
        bx, by = self._pt(x + w - 1, y + h - 1)
        return (min(ax, bx), min(ay, by), abs(bx - ax) + 1, abs(by - ay) + 1)

    def create_pen(self, *a):
        return self._g.create_pen(*a)

    def set_pen(self, p):
        self._g.set_pen(p)

    def set_font(self, n):
        self._g.set_font(n)

    def measure_text(self, *a, **k):
        return self._g.measure_text(*a, **k)

    def clear(self):
        self._g.clear()

    def remove_clip(self):
        self._g.remove_clip()

    def set_clip(self, x, y, w, h):
        self._g.set_clip(*self._rect(x, y, w, h))

    def pixel(self, x, y):
        px, py = self._pt(x, y)
        self._g.pixel(px, py)

    def rectangle(self, x, y, w, h):
        self._g.rectangle(*self._rect(x, y, w, h))

    def text(self, s, x, y, *a, **k):
        px, py = self._pt(x, y)
        self._g.text(s, px, py, *a, **k)


def make_surface(g):
    """Return the draw surface: raw graphics at 0°, else a rotated proxy."""
    return g if ORIENTATION == 0 else OrientedSurface(g)
