"""Stub the MicroPython / Pimoroni hardware modules so engine code imports under CPython.

This is a necessary-not-sufficient harness: it catches syntax, import, NameError and
missing-symbol bugs in the OTA-critical engine (app.py / hardware.py) that CI otherwise
can't see (the device modules are RP2040 C extensions). It does NOT reproduce hardware
behaviour (RAM, timing, wifi/OTA) — that still needs a physical Pico smoke test.
"""
from __future__ import annotations

import asyncio
import binascii
import builtins
import hashlib
import sys
import time
import types
from pathlib import Path

import pytest

_ROOT = Path(__file__).resolve().parents[2]  # tests/firmware/conftest.py -> repo root
_ENGINE = _ROOT / "firmware" / "engine"
_WIDGETS = _ROOT / "firmware" / "widgets"
_FONTS = _ROOT / "firmware" / "assets" / "fonts"


def _mod(name: str, **attrs) -> types.ModuleType:
    m = types.ModuleType(name)
    for k, v in attrs.items():
        setattr(m, k, v)
    sys.modules[name] = m
    return m


class _Graphics:
    """Permissive PicoGraphics stand-in; numeric returns where the engine does maths."""

    _pen = 0

    def __init__(self, *a, **k):
        pass

    def create_pen(self, *rgb):
        _Graphics._pen += 1
        return _Graphics._pen

    def set_pen(self, *_a):
        pass

    def set_font(self, *_a):
        pass

    def measure_text(self, s="", *a, **k):
        return len(str(s)) * 4

    def text(self, *a, **k):
        pass

    def pixel(self, *_a):
        pass

    def rectangle(self, *_a):
        pass

    def clear(self):
        pass

    def update(self, *_a):
        pass

    def set_clip(self, *_a):
        pass

    def remove_clip(self):
        pass


class _Board:
    """Stand-in for a Pimoroni Unicorn board class (Galactic dims)."""

    WIDTH = 53
    HEIGHT = 11
    SWITCH_BRIGHTNESS_UP = 0
    SWITCH_BRIGHTNESS_DOWN = 1
    SWITCH_SLEEP = 2

    def set_brightness(self, *_a):
        pass

    def update(self, *_a):
        pass

    def is_pressed(self, *_a):
        return False

    def play_synth(self, *_a, **_k):
        pass

    def synth_channel(self, *_a, **_k):
        return _Channel()

    def stop_playing(self, *_a):
        pass


class _Channel:
    SQUARE = 0
    SINE = 1
    TRIANGLE = 2
    SAW = 3
    NOISE = 4

    def __getattr__(self, _name):
        return lambda *a, **k: None


class _WDT:
    def __init__(self, *a, **k):
        pass

    def feed(self):
        pass


class _WLAN:
    def __init__(self, *_a):
        pass

    def active(self, *_a):
        return True

    def isconnected(self):
        return True

    def config(self, *_a, **_k):
        return b"\x00\x00\x00\x00\x00\x00"

    def connect(self, *_a):
        pass

    def ifconfig(self, *_a):
        return ("0.0.0.0", "0.0.0.0", "0.0.0.0", "0.0.0.0")

    def status(self, *_a):
        return 3


def _install_stubs() -> None:
    # Engine + widget + font units on the import path.
    for p in (_ENGINE, _WIDGETS, _FONTS):
        sp = str(p)
        if sp not in sys.path:
            sys.path.insert(0, sp)

    # micropython decorators used at module scope.
    if not hasattr(builtins, "micropython"):
        builtins.micropython = types.SimpleNamespace(  # type: ignore[attr-defined]
            native=lambda f: f, viper=lambda f: f, const=lambda x: x,
        )

    # MicroPython time/gc extensions.
    time.ticks_ms = lambda: int(time.monotonic() * 1000)  # type: ignore[attr-defined]
    time.ticks_diff = lambda a, b: a - b  # type: ignore[attr-defined]
    time.ticks_add = lambda a, b: a + b  # type: ignore[attr-defined]
    time.sleep_ms = lambda ms: None  # type: ignore[attr-defined]
    import gc
    if not hasattr(gc, "mem_free"):
        gc.mem_free = lambda: 200000  # type: ignore[attr-defined]

    # Credentials/board selection (non-empty DEVICE_ID skips the wifi-MAC path).
    _mod(
        "secrets",
        DEVICE_ID="test_device", MODEL="galactic",
        SSID="x", PASSWORD="x", MQTT_SERVER="127.0.0.1", MQTT_PORT=1883,
        MQTT_USER="u", MQTT_PASSWORD="p", NTP_HOST="pool.ntp.org",
        CUSTOM_WIDTH=32, CUSTOM_HEIGHT=32,
    )

    # uasyncio mirrors asyncio, but run() is a no-op: app.py calls asyncio.run(main())
    # at module scope, so importing it must NOT launch the (infinite) device loop.
    _uasyncio = types.ModuleType("uasyncio")
    for _attr in dir(asyncio):
        setattr(_uasyncio, _attr, getattr(asyncio, _attr))

    def _noop_run(coro=None, *_a, **_k):
        if coro is not None and hasattr(coro, "close"):
            coro.close()  # consume the main() coroutine so it isn't "never awaited"

    _uasyncio.run = _noop_run  # type: ignore[attr-defined]
    sys.modules["uasyncio"] = _uasyncio
    sys.modules["ubinascii"] = binascii
    sys.modules["uhashlib"] = hashlib
    _mod("uos", listdir=lambda *_a: [], mkdir=lambda *_a: None,
         remove=lambda *_a: None, rename=lambda *_a: None,
         stat=lambda *_a: (0,) * 10, ilistdir=lambda *_a: iter(()))
    _mod("ntptime", settime=lambda *_a: None, host="pool.ntp.org")
    _mod("machine", WDT=_WDT, reset=lambda *_a: None,
         Pin=lambda *a, **k: types.SimpleNamespace(value=lambda *_a: 0),
         RTC=lambda *a, **k: types.SimpleNamespace(datetime=lambda *_a: None),
         freq=lambda *_a: 0, reset_cause=lambda: 0,
         PWRON_RESET=0, WDT_RESET=1, DEEPSLEEP_RESET=2, HARD_RESET=3, SOFT_RESET=4)
    _mod("network", WLAN=_WLAN, STA_IF=0, AP_IF=1, STAT_GOT_IP=3)
    _mod("urequests", get=lambda *a, **k: types.SimpleNamespace(
        status_code=200, raw=types.SimpleNamespace(read=lambda *_a: b""),
        close=lambda: None, content=b"", text=""))
    _mod("umqtt", simple=types.ModuleType("umqtt.simple"))
    _mqtt = _mod("umqtt.simple", MQTTClient=lambda *a, **k: types.SimpleNamespace(
        connect=lambda *_a, **_k: None, publish=lambda *_a, **_k: None,
        subscribe=lambda *_a, **_k: None, set_callback=lambda *_a: None,
        check_msg=lambda *_a: None, ping=lambda *_a: None, disconnect=lambda *_a: None))
    sys.modules["umqtt"].simple = _mqtt  # type: ignore[attr-defined]

    # picographics + the three board modules.
    _mod("picographics", PicoGraphics=_Graphics, PEN_RGB888=0, PEN_P8=1,
         DISPLAY_GALACTIC_UNICORN=0, DISPLAY_COSMIC_UNICORN=1, DISPLAY_STELLAR_UNICORN=2)
    _mod("galactic", GalacticUnicorn=_Board, Channel=_Channel)
    _mod("cosmic", CosmicUnicorn=_Board, Channel=_Channel)
    _mod("stellar", StellarUnicorn=_Board, Channel=_Channel)
    _mod("picounicorn", PicoUnicorn=_Board)


_install_stubs()


@pytest.fixture(autouse=True)
def enable_event_loop_debug():
    """Shadow pytest-homeassistant-custom-component's async autouse fixture.

    That plugin installs an async autouse `enable_event_loop_debug` meant for HA tests;
    it breaks these plain sync firmware tests under pytest 9. Overriding it here (sync,
    no-op, firmware-scope only) lets the firmware + integration suites coexist in one run.
    """
    yield


@pytest.fixture(scope="session")
def engine_stubs():
    """Marker fixture; stubs are installed at collection time."""
    return True
