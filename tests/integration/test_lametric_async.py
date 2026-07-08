"""Coverage for lametric fetch/registry/install async wrappers (HTTP boundary mocked)."""
from __future__ import annotations

import io
from unittest.mock import AsyncMock, patch

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn import lametric
from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant

GET = "custom_components.pimoroni_unicorn.lametric._async_get"


@pytest.fixture
def expected_lingering_timers() -> bool:
    return True


def _png(w=8, h=8) -> bytes:
    from PIL import Image
    buf = io.BytesIO()
    Image.new("RGB", (w, h), (10, 20, 30)).save(buf, format="PNG")
    return buf.getvalue()


async def _entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev1",
                            data={CONF_DEVICE_ID: "dev1", CONF_MODEL: "Galactic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_fetch_icon_ok_and_none(hass: HomeAssistant) -> None:
    with patch(GET, AsyncMock(return_value=_png())):
        icon = await lametric.async_fetch_icon(hass, 123)
    assert icon["code"] == 123 and (icon["w"], icon["h"]) == (8, 8)
    with patch(GET, AsyncMock(return_value=None)):
        assert await lametric.async_fetch_icon(hass, 123) is None


async def test_fetch_image_ok_and_rejected(hass: HomeAssistant) -> None:
    with patch("custom_components.pimoroni_unicorn.lametric._validate_public_url"), \
         patch(GET, AsyncMock(return_value=_png(16, 8))):
        icon = await lametric.async_fetch_image(hass, "http://example.com/a.png", 16, 16)
    assert (icon["w"], icon["h"]) == (16, 8)
    # a loopback URL is rejected before any fetch (numeric resolve, no DNS)
    assert await lametric.async_fetch_image(hass, "http://127.0.0.1/x.png") is None


async def test_decode_upload(hass: HomeAssistant) -> None:
    icon = await lametric.async_decode_upload(hass, _png(20, 10), 16, 16)
    assert (icon["w"], icon["h"]) == (16, 8)


async def test_registry_install_remove_push(hass: HomeAssistant, mqtt_mock) -> None:
    entry = await _entry(hass)
    icon = {"frames": [lametric.base64.b64encode(bytes(8 * 8 * 3)).decode()],
            "durations": [0], "w": 8, "h": 8, "code": 7}
    sent = await lametric.async_install_icon(hass, "star", icon, [entry.entry_id])
    assert sent  # published to the device
    reg = await lametric.async_get_registry(hass)
    assert "star" in reg

    assert await lametric.async_push_icon_to_device(hass, "star", entry.entry_id) is True
    assert await lametric.async_push_icon_to_device(hass, "missing", entry.entry_id) is False
    await lametric.async_remove_icon_from_device(hass, "star", entry.entry_id)

    await lametric.async_remove_icon(hass, "star")
    assert "star" not in await lametric.async_get_registry(hass)
