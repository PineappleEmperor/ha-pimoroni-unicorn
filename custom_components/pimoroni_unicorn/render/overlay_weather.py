# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""Weather overlay unit."""
from . import weather_fx

OVERLAY = {"id": "weather", "label": "Weather", "requires": []}


def render(g, state):
    """Draw the full-screen weather overlay."""
    weather_fx.weather_overlay(state["weather"])
