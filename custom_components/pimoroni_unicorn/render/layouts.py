# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Per-model default display layouts.

A layout: {name, model, grid, widgets:[{id,x,y,cfg,enabled?}], overlays:[id]}.
Galactic reproduces the original hardcoded composition. Cosmic/Stellar are
hand-tuned for their dimensions. Editable in the emulator and overridable via
a pushed /layout.json on the device.
"""

DEFAULT_LAYOUTS = {
    "galactic": {
        "name": "default", "model": "galactic", "grid": 2,
        "widgets": [
            {"id": "calendar", "x": 0,  "y": 0, "cfg": {"header_color": [200, 0, 0]}},
            {"id": "clock",    "x": 11, "y": 1, "cfg": {"variant": "big", "color": [255, 255, 255]}},
            {"id": "weekdays", "x": 12, "y": 9, "cfg": {"variant": "big", "active": [0, 0, 128], "inactive": [60, 60, 60]}},
            {"id": "solar",    "x": 33, "y": 0, "cfg": {}},
        ],
        "overlays": ["weather"],
    },
    "cosmic": {
        "name": "default", "model": "cosmic", "grid": 2,
        "widgets": [
            {"id": "clock",    "x": 5,  "y": 2,  "cfg": {"variant": "big", "color": [255, 255, 255]}},
            {"id": "calendar", "x": 0,  "y": 11, "cfg": {"header_color": [200, 0, 0]}},
            {"id": "solar",    "x": 12, "y": 11, "cfg": {}},
            {"id": "weekdays", "x": 6,  "y": 29, "cfg": {"variant": "big", "active": [0, 0, 128], "inactive": [60, 60, 60]}},
        ],
        "overlays": ["weather"],
    },
    "stellar": {
        "name": "default", "model": "stellar", "grid": 1,
        "widgets": [
            {"id": "clock",    "x": 0, "y": 1, "cfg": {"variant": "small", "color": [255, 255, 255]}},
            {"id": "calendar", "x": 0, "y": 6, "cfg": {"header_color": [200, 0, 0]}},
            {"id": "weekdays", "x": 0, "y": 1, "cfg": {"variant": "small", "active": [0, 0, 128], "inactive": [60, 60, 60]}, "enabled": False},
            {"id": "solar",    "x": 0, "y": 0, "cfg": {}, "enabled": False},
        ],
        "overlays": ["weather"],
    },
}


def default_layout(model):
    """Return the default layout for a model, falling back to galactic."""
    return DEFAULT_LAYOUTS.get(model, DEFAULT_LAYOUTS["galactic"])
