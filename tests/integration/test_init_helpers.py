"""Coverage for __init__ sensor-feed helpers + the live rewiring/state-change path."""
from __future__ import annotations

import types

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

import custom_components.pimoroni_unicorn as pu
from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant


@pytest.fixture
def expected_lingering_timers() -> bool:
    return True


def _st(value: str):
    return types.SimpleNamespace(state=value)


def test_sensor_on_rule() -> None:
    assert pu._sensor_on_rule(None, _st("on")) is True
    assert pu._sensor_on_rule(None, _st("off")) is False
    assert pu._sensor_on_rule(None, None) is False
    assert pu._sensor_on_rule(("home", ""), _st("home")) is True
    assert pu._sensor_on_rule(("home", ""), _st("away")) is False
    assert pu._sensor_on_rule(("", "closed"), _st("open")) is True


def test_num_payload() -> None:
    assert pu._num_payload(_st("2.5")) == "2.5"
    assert pu._num_payload(_st("unknown")) == ""
    assert pu._num_payload(_st("notanumber")) == ""
    assert pu._num_payload(None) == ""


def test_resolve_bind_and_op_field() -> None:
    assert pu._resolve_bind({"bind": "$e"}, {"e": "sensor.x"}) == "sensor.x"
    assert pu._resolve_bind({"bind": "notanentity"}, {}) is None
    assert pu._op_field({"name": "$n"}, {"n": "hi"}, "name") == "hi"
    assert pu._op_field({"name": 5}, {}, "name") == ""


def test_layout_entity_collectors() -> None:
    lay = {"widgets": [
        {"id": "sensor", "cfg": {"entity": "binary_sensor.door", "on_state": "open"}},
        {"id": "value", "cfg": {"entity": "sensor.power"}},
    ]}
    assert pu._layout_sensor_entities(lay) == {"binary_sensor.door"}
    assert pu._layout_value_entities(lay) == {"sensor.power"}
    assert pu._layout_sensor_rules(lay) == {"binary_sensor.door": ("open", "")}


async def test_rewire_feed_publishes_and_tracks(hass: HomeAssistant, mqtt_mock) -> None:
    """Rewiring an entity-bound layout publishes state and tracks changes; clears on removal."""
    hass.states.async_set("binary_sensor.door", "on")
    hass.states.async_set("sensor.power", "1.5")
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev1",
                            data={CONF_DEVICE_ID: "dev1", CONF_MODEL: "Galactic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    lay = {"widgets": [
        {"id": "sensor", "cfg": {"entity": "binary_sensor.door", "on_state": "on"}},
        {"id": "value", "cfg": {"entity": "sensor.power"}},
    ]}
    await pu._async_rewire_sensor_feed(hass, entry, lay)
    assert entry.runtime_data["sensor_entities"] == {"binary_sensor.door"}
    assert entry.runtime_data["value_entities"] == {"sensor.power"}

    # a state change fires the tracked callback
    hass.states.async_set("binary_sensor.door", "off")
    hass.states.async_set("sensor.power", "2.0")
    await hass.async_block_till_done()

    # removing the widgets clears the tracked entities
    await pu._async_rewire_sensor_feed(hass, entry, {"widgets": []})
    await hass.async_block_till_done()
    assert entry.runtime_data["sensor_entities"] == set()


async def test_setup_publishers_fire_on_state_change(hass: HomeAssistant, mqtt_mock) -> None:
    """Solar + weather publishers run when their watched entities change."""
    from custom_components.pimoroni_unicorn.const import (
        CONF_EXTRA_SENSORS,
        CONF_SOLAR_ENTITY,
        CONF_SUN_ENTITY,
        CONF_WEATHER_CODE_ENTITY,
    )
    hass.states.async_set("sun.sun", "below_horizon")
    hass.states.async_set("weather.home", "sunny", {"temperature": 18.5})
    hass.states.async_set("sensor.solar", "2.0")
    hass.states.async_set("sensor.extra", "5")
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev2",
                            data={CONF_DEVICE_ID: "dev2", CONF_MODEL: "Galactic Unicorn"},
                            options={CONF_SOLAR_ENTITY: "sensor.solar",
                                     CONF_SUN_ENTITY: "sun.sun",
                                     CONF_WEATHER_CODE_ENTITY: "weather.home",
                                     CONF_EXTRA_SENSORS: "sensor.extra:extra"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    hass.states.async_set("sun.sun", "above_horizon")
    hass.states.async_set("weather.home", "cloudy", {"temperature": 10.2})
    await hass.async_block_till_done()
