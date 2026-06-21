"""Unit-test the pure OTA helpers in app.py — they need no hardware, only logic."""
from __future__ import annotations

import importlib

import pytest

app = importlib.import_module("app")


def test_ota_normalize_compact_form():
    """Compact {base, files:[[name, path]]} expands to (url, path) pairs."""
    out = app._ota_normalize({"base": "http://h/", "files": [["a.py", "/a.py"], ["b.py", "/b.py"]]})
    assert out == [("http://h/a.py", "/a.py"), ("http://h/b.py", "/b.py")]


def test_ota_normalize_legacy_form():
    """Legacy {files:[{url, path}]} passes through."""
    out = app._ota_normalize({"files": [{"url": "http://h/a.py", "path": "/a.py"}]})
    assert out == [("http://h/a.py", "/a.py")]


def test_ota_normalize_skips_malformed():
    """Bad entries are dropped, not raised on."""
    out = app._ota_normalize({"base": "http://h/", "files": [["only_one"], ["a.py", "/a.py"]]})
    assert out == [("http://h/a.py", "/a.py")]


def test_ota_needs_reboot_engine_file():
    """An /engine/ path or main.py forces a reboot."""
    assert app._ota_needs_reboot(["/engine/app.py"]) is True
    assert app._ota_needs_reboot(["/main.py"]) is True


def test_ota_needs_reboot_new_content_hot_loads():
    """A brand-new widget unit (not in the registry) hot-loads — no reboot."""
    assert app._ota_needs_reboot(["/widgets/widget_brandnew_xyz.json"]) is False


def test_ota_sweep_frac_monotonic_and_capped():
    """Time-driven fill rises with elapsed time and never exceeds the cap."""
    t0 = app.time.ticks_ms()
    early = app._ota_sweep_frac(t0, 1000)
    assert 0.0 <= early <= 0.97
    assert app._ota_sweep_frac(t0 - 100000, 1000, cap=0.97) == pytest.approx(0.97)


def test_ota_anim_ms_clamped():
    """Sweep duration stays within [MIN, MAX] regardless of width."""
    ms = app._ota_anim_ms()
    assert app._OTA_ANIM_MIN_MS <= ms <= app._OTA_ANIM_MAX_MS
