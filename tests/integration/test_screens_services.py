"""Error branches of the show_page / set_playlist services."""
from __future__ import annotations

import homeassistant.helpers.device_registry as dr
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError


@pytest.fixture
def expected_lingering_timers() -> bool:
    return True


async def _setup(hass: HomeAssistant):
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev1",
                            data={CONF_DEVICE_ID: "dev1", CONF_MODEL: "Galactic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    did = dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)[0].id
    return did


async def test_show_page_needs_a_target(hass, mqtt_mock) -> None:
    did = await _setup(hass)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(DOMAIN, "show_page", {"device_id": did}, blocking=True)


async def test_show_page_unknown_device(hass, mqtt_mock) -> None:
    await _setup(hass)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "show_page", {"device_id": "ghost", "index": 0}, blocking=True)


async def test_set_playlist_no_matching_pages(hass, mqtt_mock) -> None:
    did = await _setup(hass)
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "set_playlist", {"device_id": did, "pages": ["ghost"]}, blocking=True)


async def test_show_page_clear(hass, mqtt_mock) -> None:
    did = await _setup(hass)
    await hass.services.async_call(
        DOMAIN, "show_page", {"device_id": did, "clear": True}, blocking=True)
    await hass.async_block_till_done()
