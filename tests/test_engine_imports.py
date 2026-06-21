"""Import the OTA-critical engine under stubs to catch load-time bugs CI can't otherwise see."""
from __future__ import annotations

import importlib

import pytest

# Importing app pulls the whole engine graph: hardware, drawing, icons, layouts,
# notify_animations, sounds, weather_fx, widgets (-> every widget_* unit), version.
ENGINE_MODULES = [
    "hardware", "version", "bitfonts", "drawing", "icons", "layouts",
    "weather_fx", "notify_animations", "sounds", "widgets", "declarative", "app",
]


@pytest.mark.parametrize("name", ENGINE_MODULES)
def test_engine_module_imports(name):
    """Each engine module loads (module-level code runs) without raising."""
    importlib.import_module(name)


def test_app_surface_initialised():
    """app reached the bottom of module-level init: graphics/surface/version are live."""
    app = importlib.import_module("app")
    assert app.ENGINE_VERSION
    assert app.graphics is not None
    assert app.width > 0 and app.height > 0


def test_widget_registry_populated():
    """All built-in widget units imported and registered (catches a broken unit)."""
    widgets = importlib.import_module("widgets")
    for wid in ("clock", "sensor", "energy", "weather", "temperature", "sun_moon"):
        assert wid in widgets.WIDGET_REGISTRY
