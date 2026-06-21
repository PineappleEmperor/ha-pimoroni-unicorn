"""Shared entity helpers for the Pimoroni Unicorn platforms."""
from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo


def device_info(device_id: str, model: str) -> DeviceInfo:
    """The DeviceInfo every Pimoroni Unicorn entity attaches to (one device per entry)."""
    return DeviceInfo(
        identifiers={("mqtt", device_id)},
        name="Pimoroni Unicorn",
        manufacturer="Pimoroni",
        model=model,
    )
