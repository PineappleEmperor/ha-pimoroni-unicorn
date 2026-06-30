"""Firmware update entity: OTA install blocks until the device confirms."""
from __future__ import annotations

import asyncio

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn import update as update_mod
from custom_components.pimoroni_unicorn.const import (
    CONF_DEVICE_ID,
    CONF_MODEL,
    DOMAIN,
    ENGINE_VERSION,
    UNICORN_MODELS,
)
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_send


@pytest.fixture
def expected_lingering_timers() -> bool:
    """Tolerate the mqtt_mock fixture's own self-rescheduling periodic timer."""
    return True


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id="dev1",
        data={CONF_DEVICE_ID: "dev1", CONF_MODEL: UNICORN_MODELS[0]},
    )
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _entity_id(hass: HomeAssistant) -> str:
    eid = er.async_get(hass).async_get_entity_id("update", DOMAIN, "dev1_firmware")
    assert eid
    return eid


def _report(entry: MockConfigEntry, hass: HomeAssistant, version: str, *, current: bool) -> None:
    """Stub the device's retained manifest and fire the manifest dispatch."""
    files = dict(update_mod._engine_bundle_hashes()) if current else {}
    entry.runtime_data["available"] = True
    entry.runtime_data["fw_manifest"] = {"engine_version": version, "files": files}
    async_dispatcher_send(hass, f"{DOMAIN}_manifest_{entry.entry_id}")


async def test_install_blocks_until_device_confirms(hass: HomeAssistant, mqtt_mock) -> None:
    """install() does not return until the device re-reports the new engine version."""
    entry = await _setup(hass)
    _report(entry, hass, "1.4.0", current=False)
    await hass.async_block_till_done()

    hass.services.async_register(DOMAIN, "push_firmware", lambda call: None)
    eid = _entity_id(hass)

    task = asyncio.ensure_future(hass.services.async_call(
        "update", "install", {"entity_id": eid}, blocking=True))
    await asyncio.sleep(0)
    assert not task.done()
    assert hass.states.get(eid).attributes["in_progress"] is True

    _report(entry, hass, ENGINE_VERSION, current=True)
    await asyncio.wait_for(task, timeout=1)
    assert hass.states.get(eid).attributes["in_progress"] is False


async def test_install_times_out_when_device_never_confirms(
    hass: HomeAssistant, mqtt_mock, monkeypatch,
) -> None:
    """A device that never re-reports the new version surfaces an error, not silent success."""
    entry = await _setup(hass)
    _report(entry, hass, "1.4.0", current=False)
    await hass.async_block_till_done()

    monkeypatch.setattr(update_mod, "OTA_CONFIRM_TIMEOUT", 0.05)
    hass.services.async_register(DOMAIN, "push_firmware", lambda call: None)
    eid = _entity_id(hass)

    with pytest.raises(HomeAssistantError):
        await hass.services.async_call("update", "install", {"entity_id": eid}, blocking=True)
    assert hass.states.get(eid).attributes["in_progress"] is False


async def test_concurrent_install_is_rejected(hass: HomeAssistant, mqtt_mock) -> None:
    """A second install while one is in flight raises, guarding against repeat clicks."""
    entry = await _setup(hass)
    _report(entry, hass, "1.4.0", current=False)
    await hass.async_block_till_done()

    hass.services.async_register(DOMAIN, "push_firmware", lambda call: None)
    eid = _entity_id(hass)

    first = asyncio.ensure_future(hass.services.async_call(
        "update", "install", {"entity_id": eid}, blocking=True))
    await asyncio.sleep(0)
    assert not first.done()

    with pytest.raises(HomeAssistantError):
        await hass.services.async_call("update", "install", {"entity_id": eid}, blocking=True)

    _report(entry, hass, ENGINE_VERSION, current=True)
    await asyncio.wait_for(first, timeout=1)
