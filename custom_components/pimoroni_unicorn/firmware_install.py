"""Install/remove marketplace units over the existing OTA/remove transport."""

import json
import logging
from pathlib import Path

from homeassistant.components.mqtt import async_publish
from homeassistant.core import HomeAssistant

from . import marketplace
from .const import CONF_DEVICE_ID

_LOGGER = logging.getLogger(__name__)


def _device_id(entry) -> str:
    return {**entry.data, **entry.options}.get(CONF_DEVICE_ID, "")


def _device_files(hass: HomeAssistant, entry) -> dict:
    manifest = (entry.runtime_data or {}).get("fw_manifest")
    return (manifest or {}).get("files", {})


async def _stage_and_ota(hass: HomeAssistant, entry, files: list[tuple[str, str]]) -> bool:
    """Stage (device_path, content) files under www and trigger a device OTA pull.

    An empty file list is a success (nothing to install); returns False only on a
    real failure (no HA URL).
    """
    if not files:
        return True
    device_id = _device_id(entry)
    base_url = hass.config.internal_url or hass.config.external_url
    if not base_url:
        _LOGGER.error("Pimoroni Unicorn install: no internal/external HA URL configured")
        return False
    www_dir = Path(hass.config.config_dir) / "www" / "pimoroni_unicorn" / device_id

    def _stage() -> list[tuple[str, str]]:
        www_dir.mkdir(parents=True, exist_ok=True)
        staged = []
        for device_path, content in files:
            name = device_path.lstrip("/")
            (www_dir / name).write_text(content)
            staged.append((name, device_path))
        return staged

    staged = await hass.async_add_executor_job(_stage)
    payload = {"files": [
        {"url": f"{base_url.rstrip('/')}/local/pimoroni_unicorn/{device_id}/{name}", "path": path}
        for name, path in staged
    ]}
    await async_publish(hass, f"{device_id}/ota", json.dumps(payload), retain=False)
    return True


async def async_install_widget(hass: HomeAssistant, entry, widget_id: str) -> bool:
    """Stage the widget (+ missing font deps) and trigger an OTA download."""
    files = marketplace.resolve_install(
        widget_id, _device_files(hass, entry), marketplace.widgets_dir(hass.config.config_dir))
    if not files:
        return False
    return await _stage_and_ota(hass, entry, files)


async def async_deploy_layout(hass: HomeAssistant, entry, layout: dict) -> bool:
    """Install a layout's missing widget/font deps, then push it (retained) to the device."""
    custom_dir = marketplace.widgets_dir(hass.config.config_dir)
    files = marketplace.resolve_layout_install(layout, _device_files(hass, entry), custom_dir)
    if not await _stage_and_ota(hass, entry, files):
        return False
    await async_publish(hass, f"{_device_id(entry)}/layout", json.dumps(layout), retain=True)
    return True


async def async_deploy_screenset(hass: HomeAssistant, entry, screenset: dict, layouts: dict) -> bool:
    """Install every referenced app's deps, then push the screen rotation (retained)."""
    custom_dir = marketplace.widgets_dir(hass.config.config_dir)
    files = marketplace.resolve_screenset_install(
        screenset, layouts, _device_files(hass, entry), custom_dir)
    if not await _stage_and_ota(hass, entry, files):
        return False
    screens = [layouts[n] for n in screenset.get("layouts", []) if n in layouts]
    payload = {"screens": screens, "dwell": screenset.get("dwell"),
               "transition": screenset.get("transition")}
    await async_publish(hass, f"{_device_id(entry)}/screens", json.dumps(payload), retain=True)
    return True


async def async_remove_widget(hass: HomeAssistant, entry, widget_id: str) -> bool:
    """Tell the device to delete a unit (widget/overlay, code or declarative) and reboot."""
    device_id = _device_id(entry)
    path = marketplace.unit_device_file(
        widget_id, marketplace.widgets_dir(hass.config.config_dir))
    if path is None:
        return False
    await async_publish(
        hass, f"{device_id}/fw/remove",
        json.dumps({"files": [path]}), retain=False)
    return True
