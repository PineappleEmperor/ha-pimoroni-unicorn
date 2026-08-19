"""Coverage for send_notification / dismiss_notification: targeting, fan-out and payload."""
from __future__ import annotations

import json

import homeassistant.helpers.device_registry as dr
import pytest
import voluptuous as vol
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import ServiceValidationError


@pytest.fixture
def expected_lingering_timers() -> bool:
    return True


async def _setup(hass: HomeAssistant, dev: str) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, unique_id=dev,
                            data={CONF_DEVICE_ID: dev, CONF_MODEL: "Galactic Unicorn"},
                            options={})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


def _reg_id(hass: HomeAssistant, entry: MockConfigEntry) -> str:
    return dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)[0].id


def _notify_payloads(mqtt_mock, suffix: str = "/notify") -> dict[str, dict]:
    """Map published topic -> decoded payload for topics ending in suffix."""
    out = {}
    for call in mqtt_mock.async_publish.call_args_list:
        topic, payload = call.args[0], call.args[1]
        if topic.endswith(suffix):
            out[topic] = json.loads(payload)
    return out


async def test_single_device_id_string_still_works(hass, mqtt_mock) -> None:
    """A pre-existing automation passing a bare string must keep working."""
    entry = await _setup(hass, "dev1")
    await hass.services.async_call(
        DOMAIN, "send_notification",
        {"device_id": _reg_id(hass, entry), "message": "hi"}, blocking=True)
    await hass.async_block_till_done()
    assert _notify_payloads(mqtt_mock) == {"dev1/notify": {"v": 2, "text": "hi"}}


async def test_fans_out_to_every_target(hass, mqtt_mock) -> None:
    a, b = await _setup(hass, "dev1"), await _setup(hass, "dev2")
    await hass.services.async_call(
        DOMAIN, "send_notification",
        {"device_id": [_reg_id(hass, a), _reg_id(hass, b)], "message": "hi"}, blocking=True)
    await hass.async_block_till_done()
    assert set(_notify_payloads(mqtt_mock)) == {"dev1/notify", "dev2/notify"}


async def test_font_and_bold_reach_the_payload(hass, mqtt_mock) -> None:
    entry = await _setup(hass, "dev1")
    await hass.services.async_call(
        DOMAIN, "send_notification",
        {"device_id": [_reg_id(hass, entry)], "message": "hi",
         "font": "heavy", "bold": True, "outlined": True}, blocking=True)
    await hass.async_block_till_done()
    payload = _notify_payloads(mqtt_mock)["dev1/notify"]
    assert payload["font"] == "heavy"
    assert payload["bold"] is True
    assert payload["outlined"] is True


async def test_unknown_font_is_rejected(hass, mqtt_mock) -> None:
    entry = await _setup(hass, "dev1")
    with pytest.raises(vol.Invalid, match="font"):
        await hass.services.async_call(
            DOMAIN, "send_notification",
            {"device_id": [_reg_id(hass, entry)], "message": "hi", "font": "comic"},
            blocking=True)
    assert not _notify_payloads(mqtt_mock)


async def test_one_dead_target_does_not_silence_the_rest(hass, mqtt_mock) -> None:
    """A removed device in a multi-target call must not stop the live ones."""
    entry = await _setup(hass, "dev1")
    await hass.services.async_call(
        DOMAIN, "send_notification",
        {"device_id": [_reg_id(hass, entry), "not-a-real-device"], "message": "hi"},
        blocking=True)
    await hass.async_block_till_done()
    assert set(_notify_payloads(mqtt_mock)) == {"dev1/notify"}


async def test_no_resolvable_target_raises(hass, mqtt_mock) -> None:
    await _setup(hass, "dev1")
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "send_notification",
            {"device_id": ["not-a-real-device"], "message": "hi"}, blocking=True)


async def test_empty_notification_raises(hass, mqtt_mock) -> None:
    entry = await _setup(hass, "dev1")
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "send_notification",
            {"device_id": [_reg_id(hass, entry)], "message": ""}, blocking=True)


async def test_dismiss_fans_out(hass, mqtt_mock) -> None:
    a, b = await _setup(hass, "dev1"), await _setup(hass, "dev2")
    await hass.services.async_call(
        DOMAIN, "dismiss_notification",
        {"device_id": [_reg_id(hass, a), _reg_id(hass, b)], "all": True}, blocking=True)
    await hass.async_block_till_done()
    sent = _notify_payloads(mqtt_mock, "/notify/dismiss")
    assert set(sent) == {"dev1/notify/dismiss", "dev2/notify/dismiss"}
    assert all(p == {"all": True} for p in sent.values())
