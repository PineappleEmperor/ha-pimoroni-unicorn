"""Options-flow coverage for the Pimoroni Unicorn integration."""
from __future__ import annotations

from unittest.mock import patch

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
