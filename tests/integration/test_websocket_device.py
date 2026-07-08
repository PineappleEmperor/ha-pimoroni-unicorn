"""Coverage for device-publish websocket handlers + the notify service."""
from __future__ import annotations

import base64
from unittest.mock import AsyncMock, patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant

FW = "custom_components.pimoroni_unicorn.firmware_install"


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


async def _call(client, **payload):
    await client.send_json_auto_id(payload)
    return await client.receive_json()


async def test_fw_install_remove(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    with patch(f"{FW}.async_install_widget", AsyncMock(return_value=True)) as ins, \
         patch(f"{FW}.async_remove_widget", AsyncMock(return_value=True)) as rem:
        r = await _call(client, type="pimoroni_unicorn/fw_install",
                        entry_id=entry.entry_id, widget_id="clock")
        assert r["success"] and r["result"]["ok"]
        assert ins.called
        r2 = await _call(client, type="pimoroni_unicorn/fw_remove",
                         entry_id=entry.entry_id, widget_id="clock")
        assert r2["success"] and rem.called


async def test_font_install(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    with patch(f"{FW}.async_install_font", AsyncMock(return_value=True)):
        r = await _call(client, type="pimoroni_unicorn/font_install",
                        entry_id=entry.entry_id, font="digits")
        assert r["success"] and r["result"]["ok"]


async def test_deploy_layout(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    lay = {"widgets": [{"id": "clock", "x": 0, "y": 0, "cfg": {}}]}
    await _call(client, type="pimoroni_unicorn/save_layout", name="mine", layout=lay)
    with patch(f"{FW}.async_deploy_layout", AsyncMock(return_value=True)) as dep:
        r = await _call(client, type="pimoroni_unicorn/deploy_layout",
                        entry_id=entry.entry_id, name="mine", override=True)
        assert r["success"] and dep.called


async def test_icon_install_mocked_fetch(hass, mqtt_mock, hass_ws_client) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    fake = {"frames": [base64.b64encode(bytes(8 * 8 * 3)).decode()], "durations": [0],
            "w": 8, "h": 8, "code": 123}
    with patch("custom_components.pimoroni_unicorn.lametric.async_fetch_icon",
               AsyncMock(return_value=fake)):
        r = await _call(client, type="pimoroni_unicorn/icon_install", code=123, name="star")
        assert r["success"] and r["result"]["ok"]


async def test_icon_push_and_device_remove(hass, mqtt_mock, hass_ws_client) -> None:
    from PIL import Image
    import io
    entry = await _setup(hass)
    client = await hass_ws_client(hass)
    buf = io.BytesIO()
    Image.new("RGB", (8, 8), (10, 20, 30)).save(buf, format="PNG")
    data = base64.b64encode(buf.getvalue()).decode()
    await _call(client, type="pimoroni_unicorn/icon_upload", name="ok", data=data, max_w=8, max_h=8)

    push = await _call(client, type="pimoroni_unicorn/icon_push",
                       entry_id=entry.entry_id, name="ok")
    assert push["success"]
    rm = await _call(client, type="pimoroni_unicorn/icon_device_remove",
                     entry_id=entry.entry_id, name="ok")
    assert rm["success"]


async def test_unknown_entry_errors(hass, mqtt_mock, hass_ws_client) -> None:
    await _setup(hass)
    client = await hass_ws_client(hass)
    r = await _call(client, type="pimoroni_unicorn/fw_install",
                    entry_id="nope", widget_id="clock")
    assert not r["success"]
    assert r["error"]["code"] == "not_found"


async def test_notify_service(hass, mqtt_mock) -> None:
    """The send_notification custom action publishes without raising."""
    import homeassistant.helpers.device_registry as dr
    entry = await _setup(hass)
    reg = dr.async_get(hass)
    device_id = dr.async_entries_for_config_entry(reg, entry.entry_id)[0].id
    await hass.services.async_call(
        DOMAIN, "send_notification",
        {"device_id": device_id, "message": "hi", "effect": "rainbow", "sound": "beep"},
        blocking=True)
    await hass.async_block_till_done()


async def test_notify_all_fields_and_dismiss(hass, mqtt_mock) -> None:
    """send_notification with the full v2 field set, and dismiss with all=True."""
    import homeassistant.helpers.device_registry as dr
    entry = await _setup(hass)
    did = dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)[0].id
    await hass.services.async_call(DOMAIN, "send_notification", {
        "device_id": did, "message": "hi", "icon": [255, 0, 0], "icon_scale": 2,
        "icon_position": "left", "effect": "rainbow", "effect_speed": 5, "sound": "beep",
        "color": [0, 255, 0], "bg_color": [0, 0, 0], "duration": 5.0, "repeat": 2,
        "hold": True, "stack": False, "scroll_speed": 3, "entrance": "fade",
        "outlined": True, "wakeup": True,
    }, blocking=True)
    await hass.services.async_call(
        DOMAIN, "dismiss_notification", {"device_id": did, "all": True}, blocking=True)
    await hass.async_block_till_done()


async def test_capabilities_model_only_and_render_weather(hass, mqtt_mock, hass_ws_client) -> None:
    """capabilities works with just a model; render accepts a forced weather condition."""
    await _setup(hass)
    c = await hass_ws_client(hass)
    cap = await _call(c, type="pimoroni_unicorn/capabilities", model="cosmic")
    assert cap["success"] and cap["result"]["dims"] == [32, 32]
    r = await _call(c, type="pimoroni_unicorn/render", model="cosmic",
                    layout={"widgets": []}, weather="rain")
    assert r["success"]


async def test_deploy_screenset_success(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    c = await hass_ws_client(hass)
    lay = {"widgets": [{"id": "clock", "x": 0, "y": 0, "cfg": {}}]}
    await _call(c, type="pimoroni_unicorn/save_layout", name="p", layout=lay)
    await _call(c, type="pimoroni_unicorn/save_screenset", name="ss",
                screenset={"label": "ss", "layouts": ["p"], "dwell": 10, "transition": "none"})
    with patch(f"{FW}.async_deploy_screenset", AsyncMock(return_value=True)) as dep:
        r = await _call(c, type="pimoroni_unicorn/deploy_screenset",
                        entry_id=entry.entry_id, name="ss", override=True)
        assert r["success"] and dep.called


async def test_font_install_unknown_entry(hass, mqtt_mock, hass_ws_client) -> None:
    await _setup(hass)
    c = await hass_ws_client(hass)
    r = await _call(c, type="pimoroni_unicorn/font_install", entry_id="nope", font="digits")
    assert not r["success"] and r["error"]["code"] == "not_found"


async def test_notify_no_content_and_downconvert_and_dismiss_nodev(hass, mqtt_mock) -> None:
    """Empty notify raises; a pre-v2 device downconverts; dismiss to an unknown device no-ops."""
    import homeassistant.helpers.device_registry as dr
    from homeassistant.exceptions import ServiceValidationError
    entry = await _setup(hass)
    did = dr.async_entries_for_config_entry(dr.async_get(hass), entry.entry_id)[0].id
    with pytest.raises(ServiceValidationError):
        await hass.services.async_call(
            DOMAIN, "send_notification", {"device_id": did, "message": ""}, blocking=True)

    entry.runtime_data["notify_caps"] = {"v": 1}  # pre-v2 device -> downconvert
    await hass.services.async_call(
        DOMAIN, "send_notification",
        {"device_id": did, "message": "hi", "effect": "rainbow"}, blocking=True)

    await hass.services.async_call(
        DOMAIN, "dismiss_notification", {"device_id": "ghost", "all": True}, blocking=True)
    await hass.async_block_till_done()
