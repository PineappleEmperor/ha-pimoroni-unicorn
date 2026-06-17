"""Weather overlay unit."""
import weather_fx

OVERLAY = {"id": "weather", "label": "Weather", "requires": []}


def render(g, state):
    """Draw the full-screen weather overlay."""
    weather_fx.weather_overlay(state["weather"])
