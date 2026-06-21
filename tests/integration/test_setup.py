"""Setup/teardown coverage."""
from __future__ import annotations

from unittest.mock import patch

from homeassistant.config_entries import ConfigEntryState
from homeassistant.core import HomeAssistant
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN, UNICORN_MODELS


def _entry(hass: HomeAssistant) -> MockConfigEntry:
    e = MockConfigEntry(
        domain=DOMAIN, unique_id="dev1",
        data={CONF_DEVICE_ID: "dev1", CONF_MODEL: UNICORN_MODELS[0]},
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
