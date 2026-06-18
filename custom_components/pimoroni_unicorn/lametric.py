"""LaMetric icon gallery fetch, decode, registry, and device install."""

import base64
import io
import json
import logging
from typing import Any

import aiohttp
from PIL import Image

from homeassistant.components.mqtt import async_publish
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.storage import Store

from .const import CONF_DEVICE_ID, DOMAIN

_LOGGER = logging.getLogger(__name__)

ICON_SIZE       = 8
ICON_THUMB_URL  = "https://developer.lametric.com/content/apps/icon_thumbs/{code}"
STORAGE_KEY     = f"{DOMAIN}_icons"
STORAGE_VERSION = 1


async def async_fetch_icon(hass: HomeAssistant, code: int) -> dict[str, Any] | None:
    """Fetch a LaMetric gallery icon by code and decode to frames."""
    session = async_get_clientsession(hass)
    try:
        resp = await session.get(ICON_THUMB_URL.format(code=code))
        if resp.status != 200:
            return None
        raw = await resp.read()
    except (aiohttp.ClientError, TimeoutError) as err:
        _LOGGER.error("LaMetric fetch failed for %s: %s", code, err)
        return None
    try:
        return await hass.async_add_executor_job(_decode_icon, code, raw)
    except (OSError, ValueError, KeyError) as err:
        _LOGGER.error("LaMetric decode failed for %s: %s", code, err)
        return None


def _decode_icon(code: int, raw: bytes) -> dict[str, Any]:
    img = Image.open(io.BytesIO(raw))
    frames:    list[str] = []
    durations: list[int] = []
    for i in range(getattr(img, "n_frames", 1)):
        img.seek(i)
        rgba = img.convert("RGBA")
        if rgba.size != (ICON_SIZE, ICON_SIZE):
            rgba = rgba.resize((ICON_SIZE, ICON_SIZE), Image.Resampling.NEAREST)
        black = Image.new("RGBA", rgba.size, (0, 0, 0, 255))
        rgb   = Image.alpha_composite(black, rgba).convert("RGB")
        frames.append(base64.b64encode(rgb.tobytes()).decode())
        durations.append(int(img.info.get("duration", 100)))
    return {"code": int(code), "frames": frames, "durations": durations}


async def async_get_registry(hass: HomeAssistant) -> dict[str, Any]:
    """Load (once) and return the installed-icon registry: name -> icon dict."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if "_icon_registry" not in domain_data:
        store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        domain_data["_icon_store"]    = store
        domain_data["_icon_registry"] = await store.async_load() or {}
    return domain_data["_icon_registry"]


async def async_install_icon(hass: HomeAssistant, name: str, icon: dict[str, Any],
                             entry_ids: list[str] | None = None) -> list[str]:
    """Persist an icon and push it to the chosen devices; return their names."""
    registry = await async_get_registry(hass)
    registry[name] = icon
    await hass.data[DOMAIN]["_icon_store"].async_save(registry)
    return await _async_publish_cmd(
        hass, {"action": "install", "name": name, **icon}, entry_ids)


async def async_remove_icon(hass: HomeAssistant, name: str) -> list[str]:
    """Remove an icon from the registry and from every configured device."""
    registry = await async_get_registry(hass)
    registry.pop(name, None)
    await hass.data[DOMAIN]["_icon_store"].async_save(registry)
    return await _async_publish_cmd(hass, {"action": "remove", "name": name})


async def async_push_icon_to_device(hass: HomeAssistant, name: str, entry_id: str) -> bool:
    """Install an already-registered icon onto a single device (registry unchanged)."""
    icon = (await async_get_registry(hass)).get(name)
    if not icon:
        return False
    await _async_publish_cmd(hass, {"action": "install", "name": name, **icon}, [entry_id])
    return True


async def async_remove_icon_from_device(hass: HomeAssistant, name: str, entry_id: str) -> None:
    """Remove an icon from a single device, leaving the registry and other devices intact."""
    await _async_publish_cmd(hass, {"action": "remove", "name": name}, [entry_id])


async def _async_publish_cmd(hass: HomeAssistant, payload: dict[str, Any],
                             entry_ids: list[str] | None = None) -> list[str]:
    """Publish an icons command to the chosen entries (all when None); return device names."""
    message = json.dumps(payload)
    sent: list[str] = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry_ids is not None and entry.entry_id not in entry_ids:
            continue
        device_id = {**entry.data, **entry.options}.get(CONF_DEVICE_ID, "")
        if device_id:
            await async_publish(hass, f"{device_id}/icons/cmd", message)
            sent.append(entry.title or device_id)
    return sent
