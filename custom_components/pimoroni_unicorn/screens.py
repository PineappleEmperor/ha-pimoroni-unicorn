"""Screen-rotation services: show a specific screen, or define a device's screen set."""
import json

import voluptuous as vol

from homeassistant.components.mqtt import async_publish
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv

from . import layout
from .notify import _resolve_entry

SHOW_SCREEN_SCHEMA = vol.Schema({
    vol.Required("device_id"):            cv.string,
    vol.Optional("index"):                vol.Coerce(int),
    vol.Optional("name"):                 cv.string,
    vol.Optional("clear", default=False): cv.boolean,
})

SET_SCREENS_SCHEMA = vol.Schema({
    vol.Required("device_id"):            cv.string,
    vol.Required("layouts"):              [cv.string],
    vol.Optional("dwell", default=10):    vol.Coerce(int),
    vol.Optional("transition", default="none"): cv.string,
})


def make_show_screen_handler(hass: HomeAssistant):
    """Pin a screen by index/name, or clear the pin to resume rotation."""
    async def _handle(call):
        _, device_id = _resolve_entry(hass, call.data["device_id"])
        if not device_id:
            return
        if call.data.get("clear"):
            payload = {"clear": True}
        elif "index" in call.data:
            payload = {"index": call.data["index"]}
        elif "name" in call.data:
            payload = {"name": call.data["name"]}
        else:
            return
        await async_publish(hass, f"{device_id}/screen/show", json.dumps(payload))
    return _handle


def make_set_screens_handler(hass: HomeAssistant):
    """Build a screen set from named layouts and push it to the device."""
    async def _handle(call):
        _, device_id = _resolve_entry(hass, call.data["device_id"])
        if not device_id:
            return
        registry = await layout.async_get_registry(hass)
        screens = [registry[n] for n in call.data["layouts"] if n in registry]
        if not screens:
            return
        payload = {"screens": screens, "dwell": call.data["dwell"],
                   "transition": call.data["transition"]}
        await async_publish(hass, f"{device_id}/screens", json.dumps(payload))
    return _handle
