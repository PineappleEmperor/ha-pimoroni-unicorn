"""Pimoroni Unicorn notify platform."""

import json
import logging
from typing import Any

from homeassistant.components.mqtt import async_publish
from homeassistant.components.notify import NotifyEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_DEVICE_ID, NOTIFY_ANIMATIONS, NOTIFY_SOUNDS

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Pimoroni Unicorn notify entity."""
    opts      = {**entry.data, **entry.options}
    device_id = opts.get(CONF_DEVICE_ID, "")
    async_add_entities([PimoroniUnicornNotifyEntity(hass, device_id)])


class PimoroniUnicornNotifyEntity(NotifyEntity):
    """Send notifications to a Pimoroni Unicorn display via MQTT."""

    _attr_has_entity_name = True
    _attr_name            = "Notify"

    def __init__(self, hass: HomeAssistant, device_id: str) -> None:
        """Initialise notify entity."""
        self.hass            = hass
        self._device_id      = device_id
        self._attr_unique_id = f"{device_id}_notify"

    async def async_send_message(self, message: str, title: str | None = None, **kwargs: Any) -> None:
        """Send notification to device via MQTT."""
        data: dict    = kwargs.get("data") or {}
        payload: dict = {}

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

        await async_publish(self.hass, f"{self._device_id}/notify", json.dumps(payload))
