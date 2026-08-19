"""Pimoroni Unicorn notify service (v2 payload)."""

import json
import logging
from typing import Any

import voluptuous as vol

from homeassistant.components.mqtt import async_publish
from homeassistant.components.notify.const import ATTR_MESSAGE
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import device_registry as dr
import homeassistant.helpers.config_validation as cv

from .const import (
    CONF_DEVICE_ID,
    DOMAIN,
    NOTIFY_EFFECTS,
    NOTIFY_ENTRANCES,
    NOTIFY_FONTS,
    NOTIFY_PAYLOAD_VERSION,
    NOTIFY_SOUNDS,
)

_LOGGER = logging.getLogger(__name__)

_SPEED = vol.All(vol.Coerce(float), vol.Range(min=0.1, max=5.0))

GENERIC_NOTIFY_SCHEMA = vol.Schema({
    vol.Required("device_id"):                 vol.All(cv.ensure_list, [cv.string]),
    vol.Optional(ATTR_MESSAGE, default=""):    cv.string,
    vol.Optional("icon"):                      vol.Any(cv.string, list),
    vol.Optional("icon_scale"):                vol.Any(None, vol.All(vol.Coerce(int), vol.Range(min=1, max=4))),
    vol.Optional("icon_position"):             vol.Any(None, vol.In(["left", "center", "right"])),
    vol.Optional("effect"):                    vol.In(NOTIFY_EFFECTS),
    vol.Optional("font"):                      vol.In(NOTIFY_FONTS),
    vol.Optional("bold"):                      cv.boolean,
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
    vol.Required("device_id"):          vol.All(cv.ensure_list, [cv.string]),
    vol.Optional("all", default=False): cv.boolean,
})

_V2_FIELDS = (
    "icon", "icon_scale", "icon_position", "effect", "effect_speed", "sound", "color", "bg_color",
    "duration", "repeat", "hold", "stack", "scroll_speed", "entrance",
    "outlined", "wakeup", "font", "bold",
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
        (e for eid in device.config_entries
         if (e := hass.config_entries.async_get_entry(eid)) is not None and e.domain == DOMAIN),
        None,
    )
    if entry is None:
        return None, ""
    return entry, {**entry.data, **entry.options}.get(CONF_DEVICE_ID, "")


def _resolve_targets(hass: HomeAssistant, ha_device_ids: list[str]):
    """Resolve HA device ids to [(config_entry, mqtt_device_id)], skipping unknown ones.

    One removed device in a multi-target call must not silence the rest, so unresolved ids
    are warned about and dropped; the caller decides what an empty result means.
    """
    targets = []
    for ha_device_id in ha_device_ids:
        entry, device_id = _resolve_entry(hass, ha_device_id)
        if device_id:
            targets.append((entry, device_id))
        else:
            _LOGGER.warning("Pimoroni Unicorn: no MQTT device for %s, skipping", ha_device_id)
    return targets


def _maybe_downconvert(hass: HomeAssistant, entry, payload: dict[str, Any]) -> dict[str, Any]:
    """Downconvert when the device reported pre-v2 capabilities."""
    caps = (entry.runtime_data or {}).get("notify_caps")
    if caps is not None and caps.get("v") != NOTIFY_PAYLOAD_VERSION:
        return _downconvert_v2(payload)
    return payload


def make_generic_notify_handler(hass: HomeAssistant):
    """Return the pimoroni_unicorn.send_notification handler (v2)."""
    async def async_handle(call: ServiceCall) -> None:
        targets = _resolve_targets(hass, call.data["device_id"])
        if not targets:
            raise ServiceValidationError(translation_domain=DOMAIN, translation_key="no_device")
        payload = _build_payload_v2(call.data.get(ATTR_MESSAGE, ""), call.data)
        if not _has_content(payload):
            raise ServiceValidationError(
                translation_domain=DOMAIN, translation_key="no_notify_content")
        for entry, device_id in targets:
            await async_publish(hass, f"{device_id}/notify",
                                json.dumps(_maybe_downconvert(hass, entry, payload)))

    return async_handle


def make_dismiss_handler(hass: HomeAssistant):
    """Return the pimoroni_unicorn.dismiss_notification handler."""
    async def async_handle(call: ServiceCall) -> None:
        targets = _resolve_targets(hass, call.data["device_id"])
        if not targets:
            _LOGGER.error("Pimoroni Unicorn dismiss: no MQTT device for the selected devices")
            return
        body = json.dumps({"all": call.data.get("all", False)})
        for _entry, device_id in targets:
            await async_publish(hass, f"{device_id}/notify/dismiss", body)

    return async_handle
