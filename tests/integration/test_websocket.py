"""Exercise the layout-editor websocket API end-to-end via a set-up entry."""
from __future__ import annotations

import base64
import io

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant


@pytest.fixture
def expected_lingering_timers() -> bool:
    """Tolerate the mqtt_mock fixture's self-rescheduling periodic timer + image refresh."""
    return True


def _png(w: int, h: int, color=(200, 40, 40)) -> str:
    from PIL import Image
    buf = io.BytesIO()
    Image.new("RGB", (w, h), color).save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode()


async def _setup(hass: HomeAssistant, model: str = "Galactic Unicorn", dev: str = "dev1") -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, unique_id=dev,
                            data={CONF_DEVICE_ID: dev, CONF_MODEL: model})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def _call(client, **payload):
    await client.send_json_auto_id(payload)
    return await client.receive_json()


async def test_devices_and_capabilities(hass, mqtt_mock, hass_ws_client) -> None:
    """devices lists the entry (with a registry id); capabilities returns dims + catalogue."""
    entry = await _setup(hass)
    client = await hass_ws_client(hass)

    resp = await _call(client, type="pimoroni_unicorn/devices")
    assert resp["success"]
    dev = next(d for d in resp["result"]["devices"] if d["entry_id"] == entry.entry_id)
    assert dev["registry_id"]  # HA device-registry UUID resolved

    resp = await _call(client, type="pimoroni_unicorn/capabilities", entry_id=entry.entry_id)
    assert resp["success"]
    assert resp["result"]["dims"] == [53, 11]
    assert resp["result"]["widgets"]


async def test_render_returns_frames(hass, mqtt_mock, hass_ws_client) -> None:
    """render returns a PNG (or frames) and per-widget boxes for a layout."""
    await _setup(hass, model="Cosmic Unicorn", dev="devc")
    client = await hass_ws_client(hass)
    resp = await _call(client, type="pimoroni_unicorn/render", model="cosmic",
                       layout={"widgets": [{"id": "clock", "x": 0, "y": 0, "cfg": {}}]})
    assert resp["success"]
    r = resp["result"]
    assert (r.get("frames") or r.get("png"))
    assert isinstance(r["boxes"], list)


async def test_icons_list_shape(hass, mqtt_mock, hass_ws_client) -> None:
    """icons returns builtin/installed/thumbs/dims/trunc without a device selected."""
    await _setup(hass)
    client = await hass_ws_client(hass)
    resp = await _call(client, type="pimoroni_unicorn/icons")
    assert resp["success"]
    for key in ("builtin", "installed", "thumbs", "dims", "trunc"):
        assert key in resp["result"]


async def test_icon_decode_from_data(hass, mqtt_mock, hass_ws_client) -> None:
    """icon_decode returns a PNG + fitted dims for an uploaded image, without installing."""
    await _setup(hass)
    client = await hass_ws_client(hass)
    resp = await _call(client, type="pimoroni_unicorn/icon_decode", data=_png(8, 8),
                       max_w=16, max_h=16)
    assert resp["success"]
    assert resp["result"]["w"] == 8 and resp["result"]["h"] == 8
    assert resp["result"]["png"]


async def test_icon_upload_and_remove(hass, mqtt_mock, hass_ws_client) -> None:
    """Uploading installs into the library; removing clears it."""
    await _setup(hass)
    client = await hass_ws_client(hass)
    up = await _call(client, type="pimoroni_unicorn/icon_upload", name="pic",
                     data=_png(12, 6), max_w=53, max_h=11)
    assert up["success"] and up["result"]["ok"]

    lst = await _call(client, type="pimoroni_unicorn/icons")
    assert "pic" in lst["result"]["installed"]
    assert lst["result"]["dims"]["pic"] == [12, 6]

    rm = await _call(client, type="pimoroni_unicorn/icon_remove", name="pic")
    assert rm["success"]
    lst2 = await _call(client, type="pimoroni_unicorn/icons")
    assert "pic" not in lst2["result"]["installed"]


async def test_icon_upload_oversize_blocked(hass, mqtt_mock, hass_ws_client) -> None:
    """Installing an oversize icon onto a small device is refused unless overridden."""
    entry = await _setup(hass, model="Stellar Unicorn", dev="devs")  # 16x16
    client = await hass_ws_client(hass)
    resp = await _call(client, type="pimoroni_unicorn/icon_upload", name="huge",
                       data=_png(32, 32), max_w=32, max_h=32, entry_ids=[entry.entry_id])
    assert not resp["success"]
    assert resp["error"]["code"] == "oversize"

    ok = await _call(client, type="pimoroni_unicorn/icon_upload", name="huge",
                     data=_png(32, 32), max_w=32, max_h=32,
                     entry_ids=[entry.entry_id], allow_oversize=True)
    assert ok["success"]


async def test_fonts_and_preview(hass, mqtt_mock, hass_ws_client) -> None:
    """fonts lists the catalogue; font_preview renders a text strip."""
    await _setup(hass)
    client = await hass_ws_client(hass)
    fonts = await _call(client, type="pimoroni_unicorn/fonts")
    assert fonts["success"] and fonts["result"]["fonts"]
    prev = await _call(client, type="pimoroni_unicorn/font_preview", font="font3x5", text="HI")
    assert prev["success"] and prev["result"]["png"]


async def test_widget_preview(hass, mqtt_mock, hass_ws_client) -> None:
    """widget_preview renders a declarative spec to a PNG."""
    await _setup(hass)
    client = await hass_ws_client(hass)
    resp = await _call(client, type="pimoroni_unicorn/widget_preview", model="galactic",
                       spec={"id": "t", "w": 10, "h": 5, "draw": [{"op": "rect", "x": 0, "y": 0, "w": 2, "h": 2}]})
    assert resp["success"]
    assert resp["result"]["png"]


async def test_fonts_with_device_and_icon_url_and_decode_url(hass, mqtt_mock, hass_ws_client) -> None:
    """fonts with a device shows install state; icon_url + icon_decode(url) use the fetch path."""
    from unittest.mock import AsyncMock, patch
    import base64 as _b64
    entry = await _setup(hass)
    c = await hass_ws_client(hass)
    fonts = await _call(c, type="pimoroni_unicorn/fonts", entry_id=entry.entry_id)
    assert fonts["success"]
    fake = {"frames": [_b64.b64encode(bytes(8 * 8 * 3)).decode()], "durations": [0], "w": 8, "h": 8}
    with patch("custom_components.pimoroni_unicorn.lametric.async_fetch_image",
               AsyncMock(return_value=fake)):
        up = await _call(c, type="pimoroni_unicorn/icon_url", name="fromurl",
                         url="http://example.com/a.png")
        assert up["success"]
        dec = await _call(c, type="pimoroni_unicorn/icon_decode", url="http://example.com/a.png")
        assert dec["success"] and dec["result"]["png"]


async def test_render_with_device_entry(hass, mqtt_mock, hass_ws_client) -> None:
    entry = await _setup(hass)
    c = await hass_ws_client(hass)
    r = await _call(c, type="pimoroni_unicorn/render", model="galactic",
                    layout={"widgets": []}, entry_id=entry.entry_id)
    assert r["success"]
