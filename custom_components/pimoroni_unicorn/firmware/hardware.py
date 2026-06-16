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
