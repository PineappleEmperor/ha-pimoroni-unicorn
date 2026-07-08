"""LaMetric icon gallery fetch, decode, registry, and device install."""

import base64
import io
import ipaddress
import json
import logging
import socket
from typing import Any
from urllib.parse import urlparse

import aiohttp
from PIL import Image

from homeassistant.components.mqtt import async_publish
from homeassistant.core import HomeAssistant
from homeassistant.helpers.aiohttp_client import async_get_clientsession
from homeassistant.helpers.storage import Store

from .const import CONF_DEVICE_ID, DOMAIN

_LOGGER = logging.getLogger(__name__)

ICON_SIZE       = 8
# Largest supported footprint across models (galactic 53×11, cosmic 32×32); imported
# icons auto-fit within this and clip to the target screen at render time.
MAX_ICON_W      = 53
MAX_ICON_H      = 32
MAX_FRAMES      = 64
MAX_ICON_BYTES  = 24 * 1024          # decoded RGB budget per icon; protects Pico RAM
MAX_UPLOAD_BYTES = 2 * 1024 * 1024   # reject oversized source files before decode
ICON_THUMB_URL  = "https://developer.lametric.com/content/apps/icon_thumbs/{code}"
STORAGE_KEY     = f"{DOMAIN}_icons"
STORAGE_VERSION = 1


async def async_fetch_icon(hass: HomeAssistant, code: int) -> dict[str, Any] | None:
    """Fetch a LaMetric gallery icon by code and decode to 8×8 frames."""
    raw = await _async_get(hass, ICON_THUMB_URL.format(code=code), f"LaMetric {code}")
    if raw is None:
        return None
    try:
        icon = await hass.async_add_executor_job(_decode_image, raw, ICON_SIZE, ICON_SIZE, ICON_SIZE)
    except (OSError, ValueError, KeyError) as err:
        _LOGGER.error("LaMetric decode failed for %s: %s", code, err)
        return None
    icon["code"] = int(code)
    return icon


async def async_decode_upload(hass: HomeAssistant, raw: bytes,
                              max_w: int | None = None,
                              max_h: int | None = None) -> dict[str, Any] | None:
    """Decode an uploaded image/GIF to frames, auto-fitting within the given (or largest) box."""
    bw = min(max_w or MAX_ICON_W, MAX_ICON_W)
    bh = min(max_h or MAX_ICON_H, MAX_ICON_H)
    try:
        return await hass.async_add_executor_job(_decode_image, raw, bw, bh, None)
    except (OSError, ValueError, KeyError) as err:
        _LOGGER.error("Icon image decode failed: %s", err)
        return None


async def async_fetch_image(hass: HomeAssistant, url: str, max_w: int | None = None,
                            max_h: int | None = None) -> dict[str, Any] | None:
    """Fetch an image/GIF by URL and decode it, auto-fitting within the given (or largest) box."""
    try:
        await hass.async_add_executor_job(_validate_public_url, url)
    except (ValueError, OSError) as err:
        _LOGGER.error("Icon URL rejected (%s): %s", url, err)
        return None
    raw = await _async_get(hass, url, url, allow_redirects=False)
    if raw is None:
        return None
    if len(raw) > MAX_UPLOAD_BYTES:
        _LOGGER.error("Icon URL image too large (%d bytes): %s", len(raw), url)
        return None
    return await async_decode_upload(hass, raw, max_w, max_h)


def _validate_public_url(url: str) -> None:
    """Reject non-HTTP(S) or internal/private targets to blunt SSRF on imported URLs."""
    parsed = urlparse(url)
    if parsed.scheme not in ("http", "https") or not parsed.hostname:
        raise ValueError("unsupported URL")
    for info in socket.getaddrinfo(parsed.hostname, parsed.port or 0, proto=socket.IPPROTO_TCP):
        ip = ipaddress.ip_address(info[4][0])
        if (ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_multicast
                or ip.is_reserved or ip.is_unspecified):
            raise ValueError("blocked non-public address")


async def _async_get(hass: HomeAssistant, url: str, label: str,
                     allow_redirects: bool = True) -> bytes | None:
    """GET raw bytes from a URL, returning None on any HTTP/network error."""
    session = async_get_clientsession(hass)
    try:
        resp = await session.get(url, allow_redirects=allow_redirects)
        if resp.status != 200:
            return None
        return await resp.read()
    except (aiohttp.ClientError, TimeoutError) as err:
        _LOGGER.error("Icon fetch failed for %s: %s", label, err)
        return None


def _fit(src_w: int, src_h: int, max_w: int, max_h: int) -> tuple[int, int]:
    """Target dims that fit (max_w, max_h) preserving aspect; never upscale."""
    if src_w <= max_w and src_h <= max_h:
        return (src_w, src_h)
    scale = min(max_w / src_w, max_h / src_h)
    return (max(1, round(src_w * scale)), max(1, round(src_h * scale)))


def _decode_image(raw: bytes, max_w: int, max_h: int,
                  force_size: int | None) -> dict[str, Any]:
    """Decode all frames to base64 RGB at a chosen size, capping frame count + total bytes."""
    img = Image.open(io.BytesIO(raw))
    n_total = getattr(img, "n_frames", 1)
    img.seek(0)
    if force_size:
        tw = th = force_size
    else:
        tw, th = _fit(img.size[0], img.size[1], max_w, max_h)
    per_frame = tw * th * 3
    keep = min(n_total, MAX_FRAMES, max(1, MAX_ICON_BYTES // per_frame))
    frames:    list[str] = []
    durations: list[int] = []
    for i in range(keep):
        img.seek(i)
        rgba = img.convert("RGBA")
        if rgba.size != (tw, th):
            rgba = rgba.resize((tw, th), Image.Resampling.NEAREST)
        black = Image.new("RGBA", rgba.size, (0, 0, 0, 255))
        rgb   = Image.alpha_composite(black, rgba).convert("RGB")
        frames.append(base64.b64encode(rgb.tobytes()).decode())
        durations.append(int(img.info.get("duration", 100)))
    return {"frames": frames, "durations": durations, "w": tw, "h": th,
            "n_total": n_total, "n_kept": keep}


async def async_get_registry(hass: HomeAssistant) -> dict[str, Any]:
    """Load (once) and return the installed-icon registry: name -> icon dict."""
    domain_data = hass.data.setdefault(DOMAIN, {})
    if "_icon_registry" not in domain_data:
        store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        domain_data["_icon_store"]    = store
        domain_data["_icon_registry"] = await store.async_load() or {}
    return domain_data["_icon_registry"]


_STORABLE = ("code", "frames", "durations", "w", "h")


async def async_install_icon(hass: HomeAssistant, name: str, icon: dict[str, Any],
                             entry_ids: list[str] | None = None) -> list[str]:
    """Persist an icon and push it to the chosen devices; return their names."""
    clean = {k: icon[k] for k in _STORABLE if k in icon}
    registry = await async_get_registry(hass)
    registry[name] = clean
    await hass.data[DOMAIN]["_icon_store"].async_save(registry)
    return await _async_publish_cmd(
        hass, {"action": "install", "name": name, **clean}, entry_ids)


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
