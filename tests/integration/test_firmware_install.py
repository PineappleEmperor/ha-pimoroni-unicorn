"""Coverage for firmware_install (staging + OTA publish; no device round-trip)."""
from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn import firmware_install as fw
from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant

URL = "custom_components.pimoroni_unicorn.firmware_install.async_device_base_url"


@pytest.fixture
def expected_lingering_timers() -> bool:
    return True


async def _entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev1",
                            data={CONF_DEVICE_ID: "dev1", CONF_MODEL: "Galactic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_install_widget_stages_and_publishes(hass, mqtt_mock) -> None:
    entry = await _entry(hass)
    with patch(URL, AsyncMock(return_value="http://127.0.0.1:8123")):
        assert await fw.async_install_widget(hass, entry, "clock") is True


async def test_install_widget_no_url_fails(hass, mqtt_mock) -> None:
    entry = await _entry(hass)
    with patch(URL, AsyncMock(return_value=None)):
        assert await fw.async_install_widget(hass, entry, "clock") is False


async def test_install_font_and_remove_widget(hass, mqtt_mock) -> None:
    entry = await _entry(hass)
    with patch(URL, AsyncMock(return_value="http://127.0.0.1:8123")):
        assert await fw.async_install_font(hass, entry, "digits") is True
    assert await fw.async_remove_widget(hass, entry, "clock") is True


async def test_deploy_layout_and_screenset(hass, mqtt_mock) -> None:
    entry = await _entry(hass)
    lay = {"widgets": [{"id": "clock", "x": 0, "y": 0, "cfg": {}}]}
    with patch(URL, AsyncMock(return_value="http://127.0.0.1:8123")):
        assert await fw.async_deploy_layout(hass, entry, lay) is True
        ss = {"label": "s", "layouts": ["p"], "dwell": 10, "transition": "none"}
        assert await fw.async_deploy_screenset(hass, entry, ss, {"p": lay}) is True


async def test_device_base_url_prefers_internal(hass) -> None:
    """async_device_base_url returns a configured internal URL when present."""
    await hass.config.async_update(internal_url="http://192.168.1.5:8123")
    assert await fw.async_device_base_url(hass) == "http://192.168.1.5:8123"
