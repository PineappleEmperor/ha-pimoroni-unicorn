"""Setup/teardown coverage."""
from __future__ import annotations

import asyncio
from unittest.mock import patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn.const import (
    CONF_DEVICE_ID,
    CONF_MODEL,
    DOMAIN,
    UNICORN_MODELS,
)
from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant


@pytest.fixture
def expected_lingering_timers() -> bool:
    """Tolerate the mqtt_mock fixture's own self-rescheduling periodic timer."""
    return True


def _entry(hass: HomeAssistant) -> MockConfigEntry:
    e = MockConfigEntry(
        domain=DOMAIN, unique_id="dev1",
        data={CONF_DEVICE_ID: "dev1", CONF_MODEL: UNICORN_MODELS[0]},
    )
    e.add_to_hass(hass)
    return e


def _entry_n(hass: HomeAssistant, dev: str, model_idx: int = 0) -> MockConfigEntry:
    e = MockConfigEntry(
        domain=DOMAIN, unique_id=dev,
        data={CONF_DEVICE_ID: dev, CONF_MODEL: UNICORN_MODELS[model_idx]},
    )
    e.add_to_hass(hass)
    return e


async def test_setup_retries_when_mqtt_unavailable(hass: HomeAssistant) -> None:
    """No MQTT client -> ConfigEntryNotReady -> entry goes to SETUP_RETRY, not error."""
    entry = _entry(hass)
    with patch(
        "custom_components.pimoroni_unicorn.async_wait_for_mqtt_client", return_value=False
    ):
        await hass.config_entries.async_setup(entry.entry_id)
        await hass.async_block_till_done()
    assert entry.state is ConfigEntryState.SETUP_RETRY


async def test_two_devices_set_up_in_parallel(hass: HomeAssistant, mqtt_mock) -> None:
    """Two entries set up concurrently both reach LOADED.

    Regression: integration-global resources (panel static path, websocket
    commands) registered per-entry raced and crashed the second entry with an
    aiohttp 'route will shadow' RuntimeError.
    """
    e1 = _entry_n(hass, "dev1", 0)
    e2 = _entry_n(hass, "dev2", 1)
    await asyncio.gather(
        hass.config_entries.async_setup(e1.entry_id),
        hass.config_entries.async_setup(e2.entry_id),
    )
    await hass.async_block_till_done()
    assert e1.state is ConfigEntryState.LOADED
    assert e2.state is ConfigEntryState.LOADED
    await hass.config_entries.async_unload(e1.entry_id)
    await hass.config_entries.async_unload(e2.entry_id)
    await hass.async_block_till_done()
