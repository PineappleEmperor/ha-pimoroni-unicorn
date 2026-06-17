"""Named display-layout registry, import, and per-device MQTT push.

Layouts are authored in the panel Designer and exported/pasted as JSON. They are stored
by name in an HA Store; each device selects an active layout (by name, in its
config entry options) which is pushed to {device_id}/layout. Mirrors the icon
registry pattern in lametric.py.
"""

import json
from typing import Any

from homeassistant.components.mqtt import async_publish
from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import CONF_DEVICE_ID, DOMAIN

STORAGE_KEY     = f"{DOMAIN}_layouts"
SCREENSET_KEY   = f"{DOMAIN}_screensets"
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


async def async_set_published(hass: HomeAssistant, name: str, published: bool) -> None:
    """Mark a stored layout as (un)published to the marketplace."""
    registry = await async_get_registry(hass)
    if name in registry:
        registry[name] = {**registry[name], "published": bool(published)}
        await hass.data[DOMAIN]["_layout_store"].async_save(registry)


async def async_published_layouts(hass: HomeAssistant) -> dict[str, Any]:
    """Stored layouts explicitly published as marketplace units."""
    return {n: lay for n, lay in (await async_get_registry(hass)).items() if lay.get("published")}


async def async_get_screensets(hass: HomeAssistant) -> dict[str, Any]:
    """Load (once) and return the screenset registry: id -> screenset dict."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if "_screenset_registry" not in domain_data:
        store = Store(hass, STORAGE_VERSION, SCREENSET_KEY)
        domain_data["_screenset_store"]    = store
        domain_data["_screenset_registry"] = await store.async_load() or {}
    return domain_data["_screenset_registry"]


async def async_save_screenset(hass: HomeAssistant, sid: str, screenset: dict[str, Any]) -> None:
    """Store a screenset (referenced layout ids + rotation + triggers) under an id."""
    registry = await async_get_screensets(hass)
    registry[sid] = {**screenset, "id": sid}
    await hass.data[DOMAIN]["_screenset_store"].async_save(registry)


async def async_remove_screenset(hass: HomeAssistant, sid: str) -> None:
    """Remove a stored screenset."""
    registry = await async_get_screensets(hass)
    registry.pop(sid, None)
    await hass.data[DOMAIN]["_screenset_store"].async_save(registry)


async def async_push_layout(hass: HomeAssistant, device_id: str, layout: dict[str, Any]) -> None:
    """Publish a layout to a device's layout topic."""
    if device_id:
        await async_publish(hass, f"{device_id}/layout", json.dumps(layout))


async def async_push_screens(hass: HomeAssistant, device_id: str, payload: dict[str, Any]) -> None:
    """Publish a screen set (screens + dwell + transition) to a device."""
    if device_id:
        await async_publish(hass, f"{device_id}/screens", json.dumps(payload))


def entry_device_id(entry) -> str:
    """Return the MQTT device_id configured for a config entry."""
    return {**entry.data, **entry.options}.get(CONF_DEVICE_ID, "")


async def async_get_active(hass: HomeAssistant, entry) -> dict[str, Any] | None:
    """Return the entry's active named layout dict, if set and known."""
    name = {**entry.data, **entry.options}.get(CONF_ACTIVE_LAYOUT)
    if not name:
        return None
    return (await async_get_registry(hass)).get(name)


async def async_push_active(hass: HomeAssistant, entry) -> None:
    """Push the entry's active named layout to its device, if set and known."""
    layout = await async_get_active(hass, entry)
    if layout is None:
        return
    await async_push_layout(hass, entry_device_id(entry), layout)
