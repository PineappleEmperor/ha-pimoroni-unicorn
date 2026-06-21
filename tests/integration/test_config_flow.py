"""Config-flow coverage for the Pimoroni Unicorn integration."""
from __future__ import annotations

import json
from unittest.mock import patch

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers.service_info.mqtt import MqttServiceInfo
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn.const import (
    CONF_DEVICE_ID,
    CONF_MODEL,
    DOMAIN,
    UNICORN_MODELS,
)


async def test_user_flow_creates_entry(hass: HomeAssistant) -> None:
    """The user step shows a form, then creates an entry from device id + model."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    with patch(
        "custom_components.pimoroni_unicorn.async_setup_entry", return_value=True
    ):
        result2 = await hass.config_entries.flow.async_configure(
            result["flow_id"],
            {CONF_DEVICE_ID: "unicorn_test", CONF_MODEL: UNICORN_MODELS[0]},
        )

    assert result2["type"] is FlowResultType.CREATE_ENTRY
    assert result2["title"] == "unicorn_test"
    assert result2["data"][CONF_DEVICE_ID] == "unicorn_test"
    assert result2["result"].unique_id == "unicorn_test"


async def test_user_flow_duplicate_aborts(hass: HomeAssistant) -> None:
    """A second entry for the same device id aborts as already configured."""
    MockConfigEntry(
        domain=DOMAIN, unique_id="unicorn_test",
        data={CONF_DEVICE_ID: "unicorn_test", CONF_MODEL: UNICORN_MODELS[0]},
    ).add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_USER}
    )
    with patch(
        "custom_components.pimoroni_unicorn.async_setup_entry", return_value=True
    ):
        result2 = await hass.config_entries.flow.async_configure(
            result["flow_id"],
            {CONF_DEVICE_ID: "unicorn_test", CONF_MODEL: UNICORN_MODELS[0]},
        )

    assert result2["type"] is FlowResultType.ABORT
    assert result2["reason"] == "already_configured"


async def test_mqtt_discovery_creates_entry(hass: HomeAssistant) -> None:
    """A retained MQTT announcement discovers the device and confirms into an entry."""
    info = MqttServiceInfo(
        topic="pimoroni_unicorn/discovery/disco1",
        payload=json.dumps({"device_id": "disco1", "model": "galactic", "name": "Hallway"}),
        qos=0, retain=True, subscribed_topic="pimoroni_unicorn/discovery/#", timestamp=0.0,
    )
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_MQTT}, data=info
    )
    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "mqtt_confirm"

    with patch(
        "custom_components.pimoroni_unicorn.async_setup_entry", return_value=True
    ):
        result2 = await hass.config_entries.flow.async_configure(result["flow_id"], {})

    assert result2["type"] is FlowResultType.CREATE_ENTRY
    assert result2["data"][CONF_DEVICE_ID] == "disco1"


async def test_reconfigure_changes_model(hass: HomeAssistant) -> None:
    """Reconfigure updates the model on the existing entry and aborts successfully."""
    e = MockConfigEntry(
        domain=DOMAIN, unique_id="dev1",
        data={CONF_DEVICE_ID: "dev1", CONF_MODEL: UNICORN_MODELS[0]},
    )
    e.add_to_hass(hass)
    with patch("custom_components.pimoroni_unicorn.async_setup_entry", return_value=True):
        result = await e.start_reconfigure_flow(hass)
        result = await hass.config_entries.flow.async_configure(
            result["flow_id"], {CONF_MODEL: UNICORN_MODELS[1]})
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "reconfigure_successful"
    assert e.data[CONF_MODEL] == UNICORN_MODELS[1]


async def test_mqtt_discovery_invalid_payload_aborts(hass: HomeAssistant) -> None:
    """A malformed discovery payload aborts rather than creating a broken entry."""
    info = MqttServiceInfo(
        topic="pimoroni_unicorn/discovery/x", payload="not json",
        qos=0, retain=True, subscribed_topic="pimoroni_unicorn/discovery/#", timestamp=0.0,
    )
    result = await hass.config_entries.flow.async_init(
        DOMAIN, context={"source": config_entries.SOURCE_MQTT}, data=info
    )
    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "invalid_discovery"
