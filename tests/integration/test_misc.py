"""Coverage for the image entity, diagnostics, and live_state weather branch."""
from __future__ import annotations

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn import live_state
from custom_components.pimoroni_unicorn.const import (
    CONF_DEVICE_ID,
    CONF_MODEL,
    CONF_WEATHER_CODE_ENTITY,
    DOMAIN,
)
from custom_components.pimoroni_unicorn.diagnostics import (
    async_get_config_entry_diagnostics,
)
from custom_components.pimoroni_unicorn.image import PimoroniUnicornImage
from homeassistant.core import HomeAssistant


@pytest.fixture
def expected_lingering_timers() -> bool:
    return True


async def _setup(hass: HomeAssistant, options=None) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev1",
                            data={CONF_DEVICE_ID: "dev1", CONF_MODEL: "Cosmic Unicorn"},
                            options=options or {})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_image_renders_png(hass, mqtt_mock) -> None:
    entry = await _setup(hass)
    img = PimoroniUnicornImage(hass, entry, "dev1", "Cosmic Unicorn")
    img.hass = hass
    data = await img.async_image()
    assert data is not None
    assert data[:8] == b"\x89PNG\r\n\x1a\n"


async def test_diagnostics_shape(hass, mqtt_mock) -> None:
    entry = await _setup(hass)
    diag = await async_get_config_entry_diagnostics(hass, entry)
    assert isinstance(diag, dict)


async def test_live_state_weather(hass, mqtt_mock) -> None:
    hass.states.async_set("sensor.wcode", "800")
    entry = await _setup(hass, options={CONF_WEATHER_CODE_ENTITY: "sensor.wcode"})
    state = live_state(hass, entry)
    assert "weather" in state
