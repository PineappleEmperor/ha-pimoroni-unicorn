"""Playlist services: show a specific page, or define a device's playlist."""
import json

import voluptuous as vol

from homeassistant.components.mqtt import async_publish
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv

from . import layout
from .notify import _resolve_entry

SHOW_PAGE_SCHEMA = vol.Schema({
    vol.Required("device_id"):            cv.string,
    vol.Optional("index"):                vol.Coerce(int),
    vol.Optional("name"):                 cv.string,
    vol.Optional("clear", default=False): cv.boolean,
})

SET_PLAYLIST_SCHEMA = vol.Schema({
    vol.Required("device_id"):            cv.string,
    vol.Required("pages"):                [cv.string],
    vol.Optional("dwell", default=10):    vol.Coerce(int),
    vol.Optional("transition", default="none"): cv.string,
})


def make_show_page_handler(hass: HomeAssistant):
    """Pin a page by index/name, or clear the pin to resume the playlist."""
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


def make_set_playlist_handler(hass: HomeAssistant):
    """Build a playlist from named pages and push it to the device."""
    async def _handle(call):
        _, device_id = _resolve_entry(hass, call.data["device_id"])
        if not device_id:
            return
        registry = await layout.async_get_registry(hass)
        screens = [registry[n] for n in call.data["pages"] if n in registry]
        if not screens:
            return
        payload = {"screens": screens, "dwell": call.data["dwell"],
                   "transition": call.data["transition"]}
        await async_publish(hass, f"{device_id}/screens", json.dumps(payload))
    return _handle
