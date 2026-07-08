"""Coverage for the layout/screenset/catalog/font websocket handlers."""
from __future__ import annotations

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant


@pytest.fixture
def expected_lingering_timers() -> bool:
    """Tolerate the mqtt_mock periodic timer + image refresh."""
    return True


async def _setup(hass: HomeAssistant, dev="dev1", model="Galactic Unicorn") -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, unique_id=dev,
                            data={CONF_DEVICE_ID: dev, CONF_MODEL: model})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _call(client, **payload):
    await client.send_json_auto_id(payload)
    return await client.receive_json()


async def test_layout_save_list_delete(hass, mqtt_mock, hass_ws_client) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    lay = {"widgets": [{"id": "clock", "x": 0, "y": 0, "cfg": {}}]}

    save = await _call(client, type="pimoroni_unicorn/save_layout", name="mine", layout=lay)
    assert save["success"]

    lst = await _call(client, type="pimoroni_unicorn/layouts")
    assert "mine" in lst["result"]["layouts"]

    pub = await _call(client, type="pimoroni_unicorn/publish_layout", name="mine", published=True)
    assert pub["success"]

    dele = await _call(client, type="pimoroni_unicorn/delete_layout", name="mine")
    assert dele["success"]
    lst2 = await _call(client, type="pimoroni_unicorn/layouts")
    assert "mine" not in lst2["result"]["layouts"]


async def test_push_layout_and_screens(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    lay = {"widgets": [{"id": "clock", "x": 0, "y": 0, "cfg": {}}]}
    r = await _call(client, type="pimoroni_unicorn/push_layout", entry_id=entry.entry_id,
                    layout=lay, name="live", set_active=False)
    assert r["success"]
    await _call(client, type="pimoroni_unicorn/save_layout", name="live", layout=lay)
    r2 = await _call(client, type="pimoroni_unicorn/push_screens", entry_id=entry.entry_id,
                     layouts=["live"], dwell=10, transition="none")
    assert r2["success"]


async def test_catalog_and_content(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    cat = await _call(client, type="pimoroni_unicorn/catalog", entry_id=entry.entry_id)
    assert cat["success"]
    con = await _call(client, type="pimoroni_unicorn/content_catalog", entry_id=entry.entry_id)
    assert con["success"]
    assert "layouts" in con["result"]


async def test_screenset_save_delete(hass, mqtt_mock, hass_ws_client) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    ss = {"label": "s1", "layouts": ["a"], "dwell": 10, "transition": "none"}
    save = await _call(client, type="pimoroni_unicorn/save_screenset", name="s1", screenset=ss)
    assert save["success"]
    dele = await _call(client, type="pimoroni_unicorn/delete_screenset", name="s1")
    assert dele["success"]


async def test_widget_thumbs_and_font_preview(hass, mqtt_mock, hass_ws_client) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    th = await _call(client, type="pimoroni_unicorn/widget_thumbs", model="galactic")
    assert th["success"]
    fp = await _call(client, type="pimoroni_unicorn/font_preview", font="digits", text="12")
    assert fp["success"] and fp["result"]["png"]


async def test_widget_save_import_delete(hass, mqtt_mock, hass_ws_client) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    spec = {"id": "mine", "label": "Mine", "draw": [{"op": "rect", "x": 0, "y": 0, "w": 2, "h": 2}]}
    save = await _call(client, type="pimoroni_unicorn/widget_save", spec=spec)
    assert save["success"]
    imp = await _call(client, type="pimoroni_unicorn/widget_import",
                      text='{"id": "imp", "draw": [{"op": "pixel", "x": 0, "y": 0}]}')
    assert imp["success"]
    dele = await _call(client, type="pimoroni_unicorn/widget_delete", widget_id="mine")
    assert dele["success"]


async def test_fw_manifest(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    r = await _call(client, type="pimoroni_unicorn/fw_manifest", entry_id=entry.entry_id)
    assert r["success"]
