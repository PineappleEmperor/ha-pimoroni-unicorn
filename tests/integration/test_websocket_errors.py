"""Induce the websocket error branches (unknown ids, bad specs, incompatible, fetch fail)."""
from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant


@pytest.fixture
def expected_lingering_timers() -> bool:
    return True


async def _setup(hass: HomeAssistant, dev="dev1", model="Galactic Unicorn") -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, unique_id=dev,
                            data={CONF_DEVICE_ID: dev, CONF_MODEL: model})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _err(client, **payload) -> str:
    await client.send_json_auto_id(payload)
    res = await client.receive_json()
    assert not res["success"]
    return res["error"]["code"]


async def test_unknown_entry_and_layout_errors(hass, mqtt_mock, hass_ws_client) -> None:
    await _setup(hass)
    c = await hass_ws_client(hass)
    assert await _err(c, type="pimoroni_unicorn/push_layout", entry_id="x",
                      layout={"widgets": []}, name="n", set_active=False) == "not_found"
    assert await _err(c, type="pimoroni_unicorn/deploy_layout", entry_id="x",
                      name="n", override=True) == "not_found"
    assert await _err(c, type="pimoroni_unicorn/deploy_screenset", entry_id="x",
                      name="n") == "not_found"


async def test_deploy_unknown_layout_and_screenset(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    c = await hass_ws_client(hass)
    assert await _err(c, type="pimoroni_unicorn/deploy_layout",
                      entry_id=entry.entry_id, name="nope", override=True) == "not_found"
    assert await _err(c, type="pimoroni_unicorn/deploy_screenset",
                      entry_id=entry.entry_id, name="nope") == "not_found"


async def test_deploy_incompatible_layout(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass, model="Galactic Unicorn")
    c = await hass_ws_client(hass)
    # A Cosmic built-in layout deployed to a Galactic device without override -> incompatible.
    code = await _err(c, type="pimoroni_unicorn/deploy_layout",
                      entry_id=entry.entry_id, name="Starter · Cosmic", override=False)
    assert code == "incompatible"


async def test_push_screens_empty(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    c = await hass_ws_client(hass)
    assert await _err(c, type="pimoroni_unicorn/push_screens",
                      entry_id=entry.entry_id, layouts=["ghost"], dwell=10, transition="none") == "empty"


async def test_bad_specs_and_fetch(hass, mqtt_mock, hass_ws_client) -> None:
    await _setup(hass)
    c = await hass_ws_client(hass)
    assert await _err(c, type="pimoroni_unicorn/widget_import", text="{not json") == "invalid"
    assert await _err(c, type="pimoroni_unicorn/widget_save", spec={"draw": []}) == "invalid"
    assert await _err(c, type="pimoroni_unicorn/widget_preview", model="galactic",
                      spec={"draw": [{"op": "bogus"}]}) == "invalid"
    with patch("custom_components.pimoroni_unicorn.lametric.async_fetch_icon",
               AsyncMock(return_value=None)):
        assert await _err(c, type="pimoroni_unicorn/icon_install", code=1, name="x") == "fetch_failed"
    with patch("custom_components.pimoroni_unicorn.lametric.async_fetch_image",
               AsyncMock(return_value=None)):
        assert await _err(c, type="pimoroni_unicorn/icon_url", name="x",
                          url="http://example.com/a.png") == "fetch_failed"


async def test_icon_upload_bad_and_too_large(hass, mqtt_mock, hass_ws_client) -> None:
    await _setup(hass)
    c = await hass_ws_client(hass)
    assert await _err(c, type="pimoroni_unicorn/icon_upload", name="x", data="!!notb64!!") == "bad_image"
    assert await _err(c, type="pimoroni_unicorn/icon_decode", data="Zm9v") == "decode_failed"
