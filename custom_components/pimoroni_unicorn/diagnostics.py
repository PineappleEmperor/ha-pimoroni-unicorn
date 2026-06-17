"""Diagnostics for the Pimoroni Unicorn integration."""

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant

from .const import CONF_DEVICE_ID, PUConfigEntry

TO_REDACT = {CONF_DEVICE_ID, "device_id", "unique_id", "title"}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: PUConfigEntry
) -> dict[str, Any]:
    """Return redacted config + device-reported runtime state for an entry."""
    store = entry.runtime_data or {}
    runtime = {key: value for key, value in store.items() if key != "unsub"}
    return async_redact_data({"entry": entry.as_dict(), "runtime": runtime}, TO_REDACT)
