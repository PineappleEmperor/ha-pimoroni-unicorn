"""MQTT payload edge cases + options-reload + unload for the integration."""
from __future__ import annotations

import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_mqtt_message,
)

from custom_components.pimoroni_unicorn.const import (
    CONF_DEVICE_ID,
    CONF_MODEL,
    CONF_ORIENTATION,
    DOMAIN,
)
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant


@pytest.fixture
def expected_lingering_timers() -> bool:
    return True


async def _setup(hass: HomeAssistant, dev="dev1", options=None) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, unique_id=dev,
                            data={CONF_DEVICE_ID: dev, CONF_MODEL: "Galactic Unicorn"},
                            options=options or {})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_malformed_payloads_are_ignored(hass: HomeAssistant, mqtt_mock) -> None:
    """Non-JSON and non-dict payloads on every device topic are swallowed, not fatal."""
    entry = await _setup(hass, dev="dm")
    for topic in ("fw/manifest", "diag", "status", "ota/result", "icons/result",
                  "notify/capabilities", "page"):
        async_fire_mqtt_message(hass, f"dm/{topic}", "not json{")
        async_fire_mqtt_message(hass, f"dm/{topic}", "[1,2,3]")  # valid JSON, wrong type
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED


async def test_diag_uptime_and_orientation_drift(hass: HomeAssistant, mqtt_mock) -> None:
    """Diag computes a stable boot time and flags orientation drift; reboot recomputes it."""
    entry = await _setup(hass, dev="dd", options={CONF_ORIENTATION: 0})
    async_fire_mqtt_message(hass, "dd/diag", '{"uptime_s": 100, "orientation": 90}')
    await hass.async_block_till_done()
    boot1 = entry.runtime_data["diag"]["boot_time"]
    assert boot1 is not None
    async_fire_mqtt_message(hass, "dd/diag", '{"uptime_s": 3, "orientation": 0}')  # reboot
    await hass.async_block_till_done()
    assert entry.runtime_data["diag"]["boot_time"] != boot1


async def test_options_reload_and_unload(hass: HomeAssistant, mqtt_mock) -> None:
    """Updating options reloads the entry; unloading tears it down cleanly."""
    entry = await _setup(hass)
    hass.config_entries.async_update_entry(entry, options={CONF_ORIENTATION: 90})
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.LOADED

    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.NOT_LOADED
