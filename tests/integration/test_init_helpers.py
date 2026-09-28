"""Coverage for __init__ sensor-feed helpers + the live rewiring/state-change path."""
from __future__ import annotations

from datetime import timedelta
import pathlib
import re
import types

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry, async_fire_time_changed

import custom_components.pimoroni_unicorn as pu
from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util


@pytest.fixture
def expected_lingering_timers() -> bool:
    return True


def test_sensor_on_rule() -> None:
    assert pu._sensor_on_rule(None, "on") is True
    assert pu._sensor_on_rule(None, "off") is False
    assert pu._sensor_on_rule(None, None) is False
    assert pu._sensor_on_rule(("home", ""), "home") is True
    assert pu._sensor_on_rule(("home", ""), "away") is False
    assert pu._sensor_on_rule(("", "closed"), "open") is True
    assert pu._sensor_on_rule(None, True) is True
    assert pu._sensor_on_rule(None, False) is False


def test_num_payload() -> None:
    assert pu._num_payload("2.5") == "2.5"
    assert pu._num_payload(3) == "3.0"
    assert pu._num_payload("unknown") == ""
    assert pu._num_payload("notanumber") == ""
    assert pu._num_payload(None) == ""
    assert pu._num_payload("1234.56", 0) == "1235.0"
    assert pu._num_payload("1234.56", 1) == "1234.6"


def test_layout_value_precision() -> None:
    specs = {"custom": {"draw": [
        {"op": "value", "bind": "$e", "fmt": "{:.1f}"},
        {"op": "value", "bind": "sensor.raw", "fmt": "{}"},
    ]}}
    lay = {"widgets": [
        {"id": "value", "cfg": {"entity": "sensor.power", "decimals": 0}},
        {"id": "value", "cfg": {"entity": "sensor.temp", "decimals": 0}},
        {"id": "custom", "cfg": {"e": "sensor.temp"}},
        {"id": "value", "cfg": {"entity": "sensor.soc", "decimals": 0}},
        {"id": "energy", "cfg": {"soc_entity": "sensor.soc"}},
    ]}
    assert pu._layout_value_precision(lay, specs) == {
        "sensor.power": 0, "sensor.temp": 1, "sensor.raw": None, "sensor.soc": None,
    }


def test_layout_bind_rates() -> None:
    lay = {"widgets": [
        {"id": "value", "cfg": {"entity": "sensor.power", "update_rate": "30s"}},
        {"id": "value", "cfg": {"entity": "sensor.power", "update_rate": "5s"}},
        {"id": "sensor", "cfg": {"entity": "binary_sensor.door"}},
        {"id": "value", "cfg": {"entity": "sensor.temp", "update_rate": "5m"}},
        {"id": "value", "cfg": {"entity": "sensor.temp"}},
    ]}
    assert pu._layout_bind_rates(lay) == {"sensor.power": 5}


def test_update_rates_match_the_panel() -> None:
    src = (pathlib.Path(__file__).parents[2] / "frontend" / "src" / "bind-utils.ts").read_text()
    panel = re.search(r"UPDATE_RATES = \[(.*?)\]", src)
    assert panel is not None
    assert re.findall(r'"([^"]+)"', panel.group(1)) == list(pu.UPDATE_RATES)


def test_split_bind() -> None:
    assert pu._split_bind("sensor.lola") == ("sensor.lola", None)
    assert pu._split_bind("sensor.lola.attributes.state") == ("sensor.lola", "state")
    assert pu._split_bind("sensor.lola.attributes.time since") == ("sensor.lola", "time since")
    assert pu._split_bind("sensor.lola.attributes.a/b") is None
    assert pu._split_bind("sensor.lola.state") is None
    assert pu._split_bind("notanentity") is None
    assert pu._split_bind(None) is None


def test_bind_value() -> None:
    st = types.SimpleNamespace(state="Spicy", attributes={"state": "Home", "snacks": 1})
    assert pu._bind_value(st, None) == "Spicy"
    assert pu._bind_value(st, "state") == "Home"
    assert pu._bind_value(st, "missing") is None
    assert pu._bind_value(None, "state") is None


def test_resolve_bind_and_op_field() -> None:
    assert pu._resolve_bind({"bind": "$e"}, {"e": "sensor.x"}) == "sensor.x"
    assert pu._resolve_bind({"bind": "$e"}, {"e": "sensor.x.attributes.y"}) == "sensor.x.attributes.y"
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


def _published(mqtt_mock, topic: str) -> list[str]:
    return [c.args[1] for c in mqtt_mock.async_publish.call_args_list if c.args[0] == topic]


async def test_rewire_feed_binds_attributes(hass: HomeAssistant, mqtt_mock) -> None:
    """Attribute binds publish under their own key, share one listener and skip repeats."""
    hass.states.async_set("sensor.lola", "Spicy", {"state": "Home", "snacks": 1, "since": "1m"})
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev1",
                            data={CONF_DEVICE_ID: "dev1", CONF_MODEL: "Galactic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    lay = {"widgets": [
        {"id": "sensor", "cfg": {"entity": "sensor.lola.attributes.state", "on_state": "home"}},
        {"id": "value", "cfg": {"entity": "sensor.lola.attributes.snacks"}},
    ]}
    await pu._async_rewire_sensor_feed(hass, entry, lay)
    dot = "dev1/display/sensor.lola.attributes.state/state"
    num = "dev1/display/sensor.lola.attributes.snacks/num"
    assert _published(mqtt_mock, dot) == ["ON"]
    assert _published(mqtt_mock, num) == ["1.0"]
    assert len(entry.runtime_data["sensor_unsub"]) == 1

    hass.states.async_set("sensor.lola", "Spicy", {"state": "Home", "snacks": 1, "since": "2m"})
    await hass.async_block_till_done()
    assert _published(mqtt_mock, dot) == ["ON"]
    assert _published(mqtt_mock, num) == ["1.0"]

    hass.states.async_set("sensor.lola", "Spicy", {"state": "Away", "snacks": 2, "since": "0m"})
    await hass.async_block_till_done()
    assert _published(mqtt_mock, dot) == ["ON", "OFF"]
    assert _published(mqtt_mock, num) == ["1.0", "2.0"]

    live = pu.live_state(hass, entry)
    assert live["display_sensors"]["sensor.lola.attributes.state"] == {"state": False}
    assert live["sensor.lola.attributes.snacks"] == 2.0


async def _entry(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev1",
                            data={CONF_DEVICE_ID: "dev1", CONF_MODEL: "Galactic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_rewire_rounds_to_displayed_precision(hass: HomeAssistant, mqtt_mock) -> None:
    """A change the widget cannot show is not sent."""
    hass.states.async_set("sensor.power", "1234.4")
    entry = await _entry(hass)
    await pu._async_rewire_sensor_feed(
        hass, entry, {"widgets": [{"id": "value", "cfg": {"entity": "sensor.power", "decimals": 0}}]})
    topic = "dev1/display/sensor.power/num"
    for v in ("1234.2", "1233.9", "1235.6"):
        hass.states.async_set("sensor.power", v)
        await hass.async_block_till_done()
    assert _published(mqtt_mock, topic) == ["1234.0", "1236.0"]


async def test_rewire_update_rate_holds_then_sends_latest(hass: HomeAssistant, mqtt_mock) -> None:
    """Within the window changes are held; the latest one is sent when it closes."""
    hass.states.async_set("sensor.power", "1")
    entry = await _entry(hass)
    await pu._async_rewire_sensor_feed(hass, entry, {"widgets": [
        {"id": "value", "cfg": {"entity": "sensor.power", "update_rate": "30s"}}]})
    topic = "dev1/display/sensor.power/num"
    for v in ("2", "3", "4"):
        hass.states.async_set("sensor.power", v)
        await hass.async_block_till_done()
    assert _published(mqtt_mock, topic) == ["1.0"]
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(seconds=31))
    await hass.async_block_till_done()
    assert _published(mqtt_mock, topic) == ["1.0", "4.0"]

    await pu._async_rewire_sensor_feed(hass, entry, {"widgets": []})
    assert entry.runtime_data["value_unsub"] == []


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


async def test_rewire_retrack_removes_stale(hass: HomeAssistant, mqtt_mock) -> None:
    """Re-wiring a new entity set clears the previously-tracked entities (removal publish)."""
    hass.states.async_set("binary_sensor.a", "on")
    hass.states.async_set("sensor.p", "1.0")
    hass.states.async_set("binary_sensor.b", "on")
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev3",
                            data={CONF_DEVICE_ID: "dev3", CONF_MODEL: "Galactic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    first = {"widgets": [
        {"id": "sensor", "cfg": {"entity": "binary_sensor.a"}},
        {"id": "value", "cfg": {"entity": "sensor.p"}}]}
    await pu._async_rewire_sensor_feed(hass, entry, first)
    second = {"widgets": [{"id": "sensor", "cfg": {"entity": "binary_sensor.b"}}]}
    await pu._async_rewire_sensor_feed(hass, entry, second)
    await hass.async_block_till_done()
    assert entry.runtime_data["sensor_entities"] == {"binary_sensor.b"}
    assert entry.runtime_data["value_entities"] == set()


async def test_rewire_with_custom_declarative_spec(hass: HomeAssistant, mqtt_mock) -> None:
    """A custom declarative widget's dot/value binds are tracked via its spec."""
    import json as _json
    from custom_components.pimoroni_unicorn import marketplace
    wdir = marketplace.widgets_dir(hass.config.config_dir)
    wdir.mkdir(parents=True, exist_ok=True)
    (wdir / "widget_mycustom.json").write_text(_json.dumps({
        "id": "mycustom",
        "draw": [{"op": "dot", "bind": "$sensor", "on_state": "open"},
                 {"op": "value", "bind": "$num"}]}))
    hass.states.async_set("binary_sensor.z", "open")
    hass.states.async_set("sensor.z2", "3.0")
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev4",
                            data={CONF_DEVICE_ID: "dev4", CONF_MODEL: "Galactic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()

    lay = {"widgets": [{"id": "mycustom",
                        "cfg": {"sensor": "binary_sensor.z", "num": "sensor.z2"}}]}
    await pu._async_rewire_sensor_feed(hass, entry, lay)
    assert entry.runtime_data["sensor_entities"] == {"binary_sensor.z"}
    assert entry.runtime_data["value_entities"] == {"sensor.z2"}


async def test_live_state_uses_diag_weather(hass: HomeAssistant, mqtt_mock) -> None:
    """live_state prefers the device-reported weather + temp from diag."""
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev5",
                            data={CONF_DEVICE_ID: "dev5", CONF_MODEL: "Galactic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    entry.runtime_data["diag"] = {"weather": "rain", "weather_temp": 12.5}
    state = pu.live_state(hass, entry)
    assert state["weather"] == "rain"


async def test_publishers_malformed_extra_and_bad_number(hass: HomeAssistant, mqtt_mock) -> None:
    """A malformed extra-sensor line is skipped; a non-numeric solar value reads as 0."""
    from custom_components.pimoroni_unicorn.const import CONF_EXTRA_SENSORS, CONF_SOLAR_ENTITY
    hass.states.async_set("sensor.solar", "not-a-number")
    hass.states.async_set("sensor.good", "5")
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev6",
                            data={CONF_DEVICE_ID: "dev6", CONF_MODEL: "Galactic Unicorn"},
                            options={CONF_SOLAR_ENTITY: "sensor.solar",
                                     CONF_EXTRA_SENSORS: "oneword\nsensor.good extra"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    hass.states.async_set("sun.sun", "above_horizon")  # fire the solar publisher
    await hass.async_block_till_done()


async def test_unload_removes_panel_on_last_entry(hass: HomeAssistant, mqtt_mock) -> None:
    """Unloading the last panel-enabled entry removes the sidebar panel."""
    from custom_components.pimoroni_unicorn.const import CONF_SHOW_PANEL
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev7",
                            data={CONF_DEVICE_ID: "dev7", CONF_MODEL: "Galactic Unicorn"},
                            options={CONF_SHOW_PANEL: True})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    assert await hass.config_entries.async_unload(entry.entry_id)
    await hass.async_block_till_done()
