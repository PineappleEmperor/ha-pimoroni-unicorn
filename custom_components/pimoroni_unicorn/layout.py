"""Named display-layout registry, import, and per-device MQTT push.

Layouts are authored in the emulator and pasted in as JSON. They are stored
by name in an HA Store; each device selects an active layout (by name, in its
config entry options) which is pushed to {device_id}/layout. Mirrors the icon
registry pattern in lametric.py.
"""

import json
import logging
from typing import Any

from homeassistant.components.mqtt import async_publish
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import CONF_DEVICE_ID, DOMAIN

_LOGGER = logging.getLogger(__name__)

STORAGE_KEY     = f"{DOMAIN}_layouts"
STORAGE_VERSION = 1
CONF_ACTIVE_LAYOUT = "active_layout"


async def async_get_registry(hass: HomeAssistant) -> dict[str, Any]:
    """Load (once) and return the layout registry: name -> layout dict."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if "_layout_registry" not in domain_data:
        store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        domain_data["_layout_store"]    = store
        domain_data["_layout_registry"] = await store.async_load() or {}
    return domain_data["_layout_registry"]


def parse_layout(raw: str) -> dict[str, Any] | None:
    """Parse and validate a pasted layout JSON string."""
    try:
        data = json.loads(raw)
    except (ValueError, TypeError):
        return None
    if not isinstance(data, dict) or not isinstance(data.get("widgets"), list):
        return None
    return data


async def async_save_layout(hass: HomeAssistant, name: str, layout: dict[str, Any]) -> None:
    """Store a layout under a name."""
    registry = await async_get_registry(hass)
    layout = {**layout, "name": name}
    registry[name] = layout
    await hass.data[DOMAIN]["_layout_store"].async_save(registry)


async def async_remove_layout(hass: HomeAssistant, name: str) -> None:
    """Remove a stored layout."""
    registry = await async_get_registry(hass)
    registry.pop(name, None)
    await hass.data[DOMAIN]["_layout_store"].async_save(registry)


async def async_push_layout(hass: HomeAssistant, device_id: str, layout: dict[str, Any]) -> None:
    """Publish a layout to a device's layout topic."""
    if device_id:
        await async_publish(hass, f"{device_id}/layout", json.dumps(layout))


def entry_device_id(entry) -> str:
    """Return the MQTT device_id configured for a config entry."""
    return {**entry.data, **entry.options}.get(CONF_DEVICE_ID, "")


async def async_push_active(hass: HomeAssistant, entry) -> None:
    """Push the entry's active named layout to its device, if set and known."""
    name = {**entry.data, **entry.options}.get(CONF_ACTIVE_LAYOUT)
    if not name:
        return
    registry = await async_get_registry(hass)
    layout = registry.get(name)
    if layout is None:
        _LOGGER.warning("Active layout %r not in registry", name)
        return
    await async_push_layout(hass, entry_device_id(entry), layout)
