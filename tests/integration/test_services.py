"""Coverage for the domain services (push_firmware, show_page, set_playlist, dismiss) + live_state."""
from __future__ import annotations

from unittest.mock import AsyncMock, patch

import homeassistant.helpers.device_registry as dr
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn import live_state
from custom_components.pimoroni_unicorn.const import (
    CONF_BATTERY_CHARGING_ENTITY,
    CONF_BATTERY_SOC_ENTITY,
    CONF_CONSUMPTION_ENTITY,
    CONF_DEVICE_ID,
    CONF_MODEL,
    CONF_SOLAR_ENTITY,
    CONF_SUN_ENTITY,
    DOMAIN,
)
from homeassistant.core import HomeAssistant

URL = "custom_components.pimoroni_unicorn.firmware_install.async_device_base_url"


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


def _reg_id(hass, entry) -> str:
    return dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)[0].id


async def test_push_firmware_service(hass, mqtt_mock) -> None:
    entry = await _setup(hass)
    with patch(URL, AsyncMock(return_value="http://127.0.0.1:8123")):
        await hass.services.async_call(
            DOMAIN, "push_firmware", {"entry_id": entry.entry_id}, blocking=True)
        await hass.async_block_till_done()


async def test_show_page_and_dismiss(hass, mqtt_mock) -> None:
    entry = await _setup(hass)
    did = _reg_id(hass, entry)
    await hass.services.async_call(
        DOMAIN, "show_page", {"device_id": did, "index": 0}, blocking=True)
    await hass.services.async_call(
        DOMAIN, "dismiss_notification", {"device_id": did}, blocking=True)
    await hass.async_block_till_done()


async def test_set_playlist_service(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    did = _reg_id(hass, entry)
    client = await hass_ws_client(hass)
    lay = {"widgets": [{"id": "clock", "x": 0, "y": 0, "cfg": {}}]}
    await client.send_json_auto_id({"type": "pimoroni_unicorn/save_layout", "name": "p", "layout": lay})
    await client.receive_json()
    await hass.services.async_call(
        DOMAIN, "set_playlist", {"device_id": did, "pages": ["p"], "dwell": 8}, blocking=True)
    await hass.async_block_till_done()


async def test_live_state_defaults(hass, mqtt_mock) -> None:
    entry = await _setup(hass)
    state = live_state(hass, entry)
    assert "elapsed_ms" in state and "display_sensors" in state


async def test_live_state_reads_configured_entities(hass, mqtt_mock) -> None:
    hass.states.async_set("sensor.solar", "2.5")
    hass.states.async_set("sensor.load", "0.8")
    hass.states.async_set("sensor.soc", "75")
    hass.states.async_set("binary_sensor.charging", "on")
    hass.states.async_set("sun.sun", "below_horizon")
    entry = await _setup(hass, options={
        CONF_SOLAR_ENTITY: "sensor.solar",
        CONF_CONSUMPTION_ENTITY: "sensor.load",
        CONF_BATTERY_SOC_ENTITY: "sensor.soc",
        CONF_BATTERY_CHARGING_ENTITY: "binary_sensor.charging",
        CONF_SUN_ENTITY: "sun.sun",
    })
    state = live_state(hass, entry)
    assert state["solar"] == 2.5
    assert state["soc"] == 75
    assert state["charging"] is True
