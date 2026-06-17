"""Diagnostics for the Pimoroni Unicorn integration."""

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

from .const import CONF_DEVICE_ID, DOMAIN

TO_REDACT = {CONF_DEVICE_ID, "device_id", "unique_id", "title"}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: ConfigEntry
) -> dict[str, Any]:
    """Return redacted config + device-reported runtime state for an entry."""
    store = hass.data.get(DOMAIN, {}).get(entry.entry_id, {})
    runtime = {key: value for key, value in store.items() if key != "unsub"}
    return async_redact_data({"entry": entry.as_dict(), "runtime": runtime}, TO_REDACT)
