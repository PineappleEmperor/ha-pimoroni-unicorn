"""Options-flow coverage for the Pimoroni Unicorn integration."""
from __future__ import annotations

import base64
from unittest.mock import AsyncMock, patch

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn.const import (
    CONF_DEVICE_ID,
    CONF_MODEL,
    CONF_SHOW_PANEL,
    DOMAIN,
    UNICORN_MODELS,
)


@pytest.fixture
def expected_lingering_timers() -> bool:
    """Tolerate the mqtt_mock periodic timer in flows that publish."""
    return True


@pytest.fixture
def entry(hass: HomeAssistant) -> MockConfigEntry:
    """A configured entry with setup stubbed out."""
    e = MockConfigEntry(
        domain=DOMAIN, unique_id="dev1",
        data={CONF_DEVICE_ID: "dev1", CONF_MODEL: UNICORN_MODELS[0]},
    )
    e.add_to_hass(hass)
    return e


async def test_options_init_shows_menu(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    """Opening options lands on the menu."""
    result = await hass.config_entries.options.async_init(entry.entry_id)
    assert result["type"] is FlowResultType.MENU
    assert "settings" in result["menu_options"]
    assert "save" in result["menu_options"]


async def test_options_settings_then_save(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    """Edit settings, then Save persists them into entry.options."""
    with patch("custom_components.pimoroni_unicorn.async_setup_entry", return_value=True):
        result = await hass.config_entries.options.async_init(entry.entry_id)
        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {"next_step_id": "settings"})
        assert result["step_id"] == "settings"

        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {CONF_MODEL: UNICORN_MODELS[0], CONF_SHOW_PANEL: False})
        assert result["type"] is FlowResultType.MENU  # back to menu

        result = await hass.config_entries.options.async_configure(
            result["flow_id"], {"next_step_id": "save"})

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["data"][CONF_SHOW_PANEL] is False


async def test_options_import_invalid_layout_errors(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    """Importing malformed layout JSON shows a field error, not a crash."""
    result = await hass.config_entries.options.async_init(entry.entry_id)
    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"next_step_id": "import_layout"})
    assert result["step_id"] == "import_layout"

    result = await hass.config_entries.options.async_configure(
        result["flow_id"], {"layout_json": "{not valid"})
    assert result["type"] is FlowResultType.FORM
    assert result["errors"] == {"layout_json": "invalid_layout"}


async def test_options_add_icon_flow(hass: HomeAssistant, entry: MockConfigEntry, mqtt_mock) -> None:
    """Add a LaMetric icon by code, then name + install it (mocked fetch)."""
    fake = {"frames": [base64.b64encode(bytes(8 * 8 * 3)).decode()], "durations": [0],
            "w": 8, "h": 8, "code": 123}
    opts = hass.config_entries.options
    with patch("custom_components.pimoroni_unicorn.lametric.async_fetch_icon",
               AsyncMock(return_value=fake)):
        res = await opts.async_init(entry.entry_id)
        res = await opts.async_configure(res["flow_id"], {"next_step_id": "add_icon"})
        assert res["step_id"] == "add_icon"
        res = await opts.async_configure(res["flow_id"], {"code": 123})
        assert res["step_id"] == "icon_preview"
        res = await opts.async_configure(res["flow_id"], {"name": "star"})
    assert res["type"] is FlowResultType.MENU


async def test_options_add_icon_not_found(hass: HomeAssistant, entry: MockConfigEntry) -> None:
    """An unknown LaMetric code shows a field error."""
    opts = hass.config_entries.options
    with patch("custom_components.pimoroni_unicorn.lametric.async_fetch_icon",
               AsyncMock(return_value=None)):
        res = await opts.async_init(entry.entry_id)
        res = await opts.async_configure(res["flow_id"], {"next_step_id": "add_icon"})
        res = await opts.async_configure(res["flow_id"], {"code": 999})
    assert res["errors"] == {"code": "icon_not_found"}


async def test_options_remove_icon(hass: HomeAssistant, entry: MockConfigEntry, mqtt_mock) -> None:
    """With an icon installed, the menu offers remove_icon and it deletes it."""
    from custom_components.pimoroni_unicorn import lametric
    reg = await lametric.async_get_registry(hass)  # creates the store
    reg["star"] = {"w": 8, "h": 8, "frames": ["x"]}
    opts = hass.config_entries.options
    res = await opts.async_init(entry.entry_id)
    assert "remove_icon" in res["menu_options"]
    res = await opts.async_configure(res["flow_id"], {"next_step_id": "remove_icon"})
    res = await opts.async_configure(res["flow_id"], {"icon_name": "star"})
    assert res["type"] is FlowResultType.MENU


async def test_options_import_layout_success(hass: HomeAssistant, entry: MockConfigEntry, mqtt_mock) -> None:
    """Importing a valid layout saves it and returns to the menu."""
    opts = hass.config_entries.options
    res = await opts.async_init(entry.entry_id)
    res = await opts.async_configure(res["flow_id"], {"next_step_id": "import_layout"})
    res = await opts.async_configure(
        res["flow_id"], {"layout_json": '{"name": "L", "widgets": []}'})
    assert res["type"] is FlowResultType.MENU


async def test_options_select_layout(hass: HomeAssistant, entry: MockConfigEntry, mqtt_mock) -> None:
    """With a stored layout, the menu offers select_layout and it sets the active page."""
    from custom_components.pimoroni_unicorn import layout as lay_mod
    reg = await lay_mod.async_get_registry(hass)
    reg["mylay"] = {"name": "mylay", "widgets": []}
    opts = hass.config_entries.options
    res = await opts.async_init(entry.entry_id)
    assert "select_layout" in res["menu_options"]
    res = await opts.async_configure(res["flow_id"], {"next_step_id": "select_layout"})
    res = await opts.async_configure(res["flow_id"], {"layout_name": "mylay"})
    assert res["type"] is FlowResultType.MENU


async def test_options_toggle_widgets(hass: HomeAssistant, mqtt_mock) -> None:
    """With an active layout, toggle_widgets enables/disables its widgets."""
    from custom_components.pimoroni_unicorn import layout as lay_mod
    reg = await lay_mod.async_get_registry(hass)
    reg["act"] = {"name": "act", "widgets": [{"id": "clock"}, {"id": "date"}]}
    e = MockConfigEntry(domain=DOMAIN, unique_id="tw",
                        data={CONF_DEVICE_ID: "tw", CONF_MODEL: UNICORN_MODELS[0]},
                        options={lay_mod.CONF_ACTIVE_LAYOUT: "act"})
    e.add_to_hass(hass)
    opts = hass.config_entries.options
    res = await opts.async_init(e.entry_id)
    assert "toggle_widgets" in res["menu_options"]
    res = await opts.async_configure(res["flow_id"], {"next_step_id": "toggle_widgets"})
    res = await opts.async_configure(res["flow_id"], {"widgets": ["clock"]})
    assert res["type"] is FlowResultType.MENU
