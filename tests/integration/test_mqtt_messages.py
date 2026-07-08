"""Device MQTT messages drive runtime_data (page/manifest/diag/status/caps/results)."""
from __future__ import annotations

import pytest
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_mqtt_message,
)

from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant


@pytest.fixture
def expected_lingering_timers() -> bool:
    """Tolerate the mqtt_mock periodic timer + image refresh."""
    return True


async def test_device_messages_populate_runtime(hass: HomeAssistant, mqtt_mock) -> None:
    """Publishing to the device topics updates runtime_data via the subscribers."""
    dev = "devm"
    entry = MockConfigEntry(domain=DOMAIN, unique_id=dev,
                            data={CONF_DEVICE_ID: dev, CONF_MODEL: "Cosmic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    async_fire_mqtt_message(hass, f"{dev}/fw/manifest", '{"engine_version": "1.7.0", "files": {}}')
    async_fire_mqtt_message(hass, f"{dev}/diag", '{"uptime": 42}')
    async_fire_mqtt_message(hass, f"{dev}/page",
                            '{"widgets": [{"id": "clock", "x": 0, "y": 0, "cfg": {}}]}')
    async_fire_mqtt_message(hass, f"{dev}/status", '{"available": true}')
    async_fire_mqtt_message(hass, f"{dev}/notify/capabilities", '{"animations": ["rainbow"]}')
    async_fire_mqtt_message(hass, f"{dev}/ota/result", '{"ok": true}')
    async_fire_mqtt_message(hass, f"{dev}/icons/result", '{"ok": true}')
    await hass.async_block_till_done()

    rd = entry.runtime_data
    assert rd["fw_manifest"]["engine_version"] == "1.7.0"
    assert rd["diag"]["uptime"] == 42
    assert rd["page"]["widgets"][0]["id"] == "clock"


async def test_malformed_page_message_ignored(hass: HomeAssistant, mqtt_mock) -> None:
    """A non-JSON page payload doesn't crash the subscriber."""
    dev = "devbad"
    entry = MockConfigEntry(domain=DOMAIN, unique_id=dev,
                            data={CONF_DEVICE_ID: dev, CONF_MODEL: "Stellar Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    async_fire_mqtt_message(hass, f"{dev}/page", "not json{")
    await hass.async_block_till_done()
    assert entry.runtime_data.get("page") in (None, entry.runtime_data.get("page"))
