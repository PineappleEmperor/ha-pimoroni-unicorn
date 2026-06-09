"""Pimoroni Unicorn notify platform."""

import json
import logging

from homeassistant.components.mqtt import async_publish
from homeassistant.components.notify.const import ATTR_DATA
from homeassistant.components.notify.legacy import BaseNotificationService
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType, DiscoveryInfoType

from .const import CONF_DEVICE_ID, NOTIFY_ANIMATIONS, NOTIFY_SOUNDS

_LOGGER = logging.getLogger(__name__)


async def async_get_service(
    hass: HomeAssistant,
    config: ConfigType,
    discovery_info: DiscoveryInfoType | None = None,
) -> "PimoroniUnicornNotify | None":
    """Return the notify service."""
    if discovery_info is None:
        return None
    return PimoroniUnicornNotify(hass, discovery_info.get(CONF_DEVICE_ID, ""))


class PimoroniUnicornNotify(BaseNotificationService):
    """Send notifications to a Pimoroni Unicorn display via MQTT."""

    def __init__(self, hass: HomeAssistant, device_id: str) -> None:
        """Initialise notify service."""
        self.hass = hass
        self._device_id = device_id

    async def async_send_message(self, message: str = "", **kwargs) -> None:
        """Send notification to device via MQTT."""
        data    = kwargs.get(ATTR_DATA) or {}
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
