# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Per-model default display layouts.

A layout: {name, model, grid, widgets:[{id,x,y,cfg,enabled?}], overlays:[id]}.
Galactic reproduces the original hardcoded composition. Cosmic/Stellar are
hand-tuned for their dimensions. Editable in the panel Designer and overridable
via a pushed /settings/layout.json on the device.
"""

DEFAULT_LAYOUTS = {
    "galactic": {
        "name": "default", "model": "galactic", "grid": 2,
        "widgets": [
            {"id": "calendar", "x": 0,  "y": 0, "cfg": {"header_color": [200, 0, 0]}},
            {"id": "clock",    "x": 11, "y": 1, "cfg": {"variant": "big", "color": [255, 255, 255]}},
            {"id": "weekdays", "x": 12, "y": 9, "cfg": {"variant": "big", "active": [0, 0, 128], "inactive": [60, 60, 60]}},
            {"id": "energy",   "x": 34, "y": 6, "cfg": {}},
            {"id": "sun_moon", "x": 46, "y": 0, "cfg": {}},
        ],
        "overlays": ["weather"],
    },
    "cosmic": {
        "name": "default", "model": "cosmic", "grid": 2,
        "widgets": [
            {"id": "date",        "x": 0,  "y": 0,  "cfg": {"format": "weekday", "font": "font5x9", "color": [200, 0, 0]}},
            {"id": "date",        "x": 21, "y": 0,  "cfg": {"format": "day", "font": "font5x9", "color": [255, 255, 255]}},
            {"id": "clock",       "x": 4,  "y": 12, "cfg": {"variant": "big", "color": [255, 255, 255]}},
            {"id": "weather",     "x": 0,  "y": 24, "cfg": {}},
            {"id": "temperature", "x": 17, "y": 26, "cfg": {"unit": "C"}},
        ],
        "overlays": [],
    },
    "stellar": {
        "name": "default", "model": "stellar", "grid": 1,
        "widgets": [
            {"id": "weather", "x": 0, "y": 0,  "cfg": {}},
            {"id": "date",    "x": 9, "y": 2,  "cfg": {"format": "day", "font": "font3x5", "color": [255, 255, 255]}},
            {"id": "clock",   "x": 0, "y": 10, "cfg": {"variant": "wide", "color": [255, 255, 255]}},
        ],
        "overlays": [],
    },
}


def default_layout(model):
    """Return the default layout for a model, falling back to galactic."""
    return DEFAULT_LAYOUTS.get(model, DEFAULT_LAYOUTS["galactic"])
