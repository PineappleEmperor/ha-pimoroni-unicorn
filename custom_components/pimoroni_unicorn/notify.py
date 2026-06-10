"""Pimoroni Unicorn notify service."""

import json
import logging
from typing import Any

import voluptuous as vol
from homeassistant.components.mqtt import async_publish
from homeassistant.components.notify.const import ATTR_DATA, ATTR_MESSAGE, ATTR_TITLE
from homeassistant.core import HomeAssistant, ServiceCall
import homeassistant.helpers.config_validation as cv

from .const import NOTIFY_ANIMATIONS, NOTIFY_SOUNDS

_LOGGER = logging.getLogger(__name__)

SERVICE_SCHEMA = vol.Schema({
    vol.Required(ATTR_MESSAGE): cv.string,
    vol.Optional(ATTR_TITLE):   cv.string,
    vol.Optional(ATTR_DATA):    dict,
})


def make_notify_handler(hass: HomeAssistant, device_id: str):
    """Return a ServiceCall handler that publishes notifications via MQTT."""
    async def async_handle(call: ServiceCall) -> None:
        message: str       = call.data.get(ATTR_MESSAGE, "")
        data: dict[str, Any] = call.data.get(ATTR_DATA) or {}
        payload: dict[str, Any] = {}

        if message:
            payload["text"] = message

        animation = data.get("animation")
        if animation:
            if animation not in NOTIFY_ANIMATIONS:
                _LOGGER.warning("Unknown animation '%s'. Supported: %s", animation, NOTIFY_ANIMATIONS)
            else:
                payload["animation"] = animation

        sound = data.get("sound")
        if sound:
            if sound not in NOTIFY_SOUNDS:
                _LOGGER.warning("Unknown sound '%s'. Supported: %s", sound, NOTIFY_SOUNDS)
            else:
                payload["sound"] = sound

        for key in ("color", "bg_color", "duration", "layout", "split_width", "outlined"):
            if key in data:
                payload[key] = data[key]

        if not payload:
            _LOGGER.warning("Pimoroni Unicorn notify: provide at least 'message' or 'animation'")
            return

        await async_publish(hass, f"{device_id}/notify", json.dumps(payload))

    return async_handle
