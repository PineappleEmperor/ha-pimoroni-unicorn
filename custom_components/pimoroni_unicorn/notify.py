"""Pimoroni Unicorn notify service (v2 payload)."""

import json
import logging
from typing import Any

import voluptuous as vol

from homeassistant.components.mqtt import async_publish
from homeassistant.components.notify.const import ATTR_MESSAGE
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import device_registry as dr
import homeassistant.helpers.config_validation as cv

from .const import (
    CONF_DEVICE_ID,
    NOTIFY_EFFECTS,
    NOTIFY_ENTRANCES,
    NOTIFY_PAYLOAD_VERSION,
    NOTIFY_SOUNDS,
)

_LOGGER = logging.getLogger(__name__)

_SPEED = vol.All(vol.Coerce(float), vol.Range(min=0.1, max=5.0))

GENERIC_NOTIFY_SCHEMA = vol.Schema({
    vol.Required("device_id"):                 cv.string,
    vol.Optional(ATTR_MESSAGE, default=""):    cv.string,
    vol.Optional("icon"):                      vol.Any(cv.string, list),
    vol.Optional("effect"):                    vol.In(NOTIFY_EFFECTS),
    vol.Optional("effect_speed"):              _SPEED,
    vol.Optional("sound"):                     vol.In(NOTIFY_SOUNDS),
    vol.Optional("color"):                     list,
    vol.Optional("bg_color"):                  list,
    vol.Optional("duration"):                  vol.Coerce(float),
    vol.Optional("repeat"):                    vol.All(vol.Coerce(int), vol.Range(min=1, max=10)),
    vol.Optional("hold"):                      cv.boolean,
    vol.Optional("stack"):                     cv.boolean,
    vol.Optional("scroll_speed"):              _SPEED,
    vol.Optional("entrance"):                  vol.In(NOTIFY_ENTRANCES),
    vol.Optional("outlined"):                  cv.boolean,
    vol.Optional("wakeup"):                    cv.boolean,
})

DISMISS_SCHEMA = vol.Schema({
    vol.Required("device_id"):          cv.string,
    vol.Optional("all", default=False): cv.boolean,
})

_V2_FIELDS = (
    "icon", "icon_scale", "icon_position", "effect", "effect_speed", "sound", "color", "bg_color",
    "duration", "repeat", "hold", "stack", "scroll_speed", "entrance",
    "outlined", "wakeup",
)


def _build_payload_v2(message: str, data: dict[str, Any]) -> dict[str, Any]:
    """Build a v2 MQTT payload from a message + flat field dict."""
    payload: dict[str, Any] = {"v": NOTIFY_PAYLOAD_VERSION}
    if message:
        payload["text"] = message
    for key in _V2_FIELDS:
        if data.get(key) is not None:
            payload[key] = data[key]
    return payload


def _downconvert_v2(payload: dict[str, Any]) -> dict[str, Any]:
    """Map a v2 payload to the legacy mode:simple shape for pre-v2 firmware."""
    out: dict[str, Any] = {"mode": "simple"}
    for key in ("text", "icon", "color", "bg_color", "duration", "outlined", "sound"):
        if key in payload:
            out[key] = payload[key]
    if "effect" in payload:
        out["animation"] = payload["effect"]
    return out


def _has_content(payload: dict[str, Any]) -> bool:
    return bool(payload.get("text") or payload.get("icon") or payload.get("effect"))


def _resolve_entry(hass: HomeAssistant, ha_device_id: str):
    """Resolve an HA device id to (config_entry, mqtt_device_id)."""
    device = dr.async_get(hass).async_get(ha_device_id)
    if device is None:
        return None, ""
    entry = next(
        (hass.config_entries.async_get_entry(eid) for eid in device.config_entries
         if hass.config_entries.async_get_entry(eid) is not None),
        None,
    )
    if entry is None:
        return None, ""
    return entry, {**entry.data, **entry.options}.get(CONF_DEVICE_ID, "")


def _maybe_downconvert(hass: HomeAssistant, entry, payload: dict[str, Any]) -> dict[str, Any]:
    """Downconvert when the device reported pre-v2 capabilities."""
    caps = (entry.runtime_data or {}).get("notify_caps")
    if caps is not None and caps.get("v") != NOTIFY_PAYLOAD_VERSION:
        return _downconvert_v2(payload)
    return payload


def make_generic_notify_handler(hass: HomeAssistant):
    """Return the pimoroni_unicorn.send_notification handler (v2)."""
    async def async_handle(call: ServiceCall) -> None:
        entry, device_id = _resolve_entry(hass, call.data["device_id"])
        if not device_id:
            _LOGGER.error("Pimoroni Unicorn notify: no MQTT device for the selected device")
            return
        payload = _build_payload_v2(call.data.get(ATTR_MESSAGE, ""), call.data)
        if not _has_content(payload):
            _LOGGER.warning("Pimoroni Unicorn notify: provide at least 'message', 'icon' or 'effect'")
            return
        payload = _maybe_downconvert(hass, entry, payload)
        await async_publish(hass, f"{device_id}/notify", json.dumps(payload))

    return async_handle


def make_dismiss_handler(hass: HomeAssistant):
    """Return the pimoroni_unicorn.dismiss_notification handler."""
    async def async_handle(call: ServiceCall) -> None:
        _entry, device_id = _resolve_entry(hass, call.data["device_id"])
        if not device_id:
            _LOGGER.error("Pimoroni Unicorn dismiss: no MQTT device for the selected device")
            return
        await async_publish(
            hass, f"{device_id}/notify/dismiss", json.dumps({"all": call.data.get("all", False)}))

    return async_handle
