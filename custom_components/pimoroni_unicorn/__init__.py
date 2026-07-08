"""Pimoroni Unicorn Home Assistant integration."""

import ast
from collections.abc import Callable, Coroutine
from datetime import timedelta
import hashlib
import json
import logging
from pathlib import Path
import re
import time
from typing import Any

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.mqtt import (
    async_publish,
    async_subscribe,
    async_wait_for_mqtt_client,
)
from homeassistant.components.persistent_notification import (
    async_create as notify_create,
    async_dismiss as notify_dismiss,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.exceptions import ConfigEntryNotReady, HomeAssistantError
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_call_later,
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.typing import ConfigType
from homeassistant.loader import async_get_integration
from homeassistant.util import dt as dt_util

from . import (
    firmware_install,
    layout,
    marketplace,
    problems,
    render_service,
    websocket as ws_api,
)
from .const import (
    CONF_BATTERY_CHARGING_ENTITY,
    CONF_BATTERY_SOC_ENTITY,
    CONF_CONSUMPTION_ENTITY,
    CONF_DEVICE_ID,
    CONF_EXTRA_SENSORS,
    CONF_ORIENTATION,
    CONF_SHOW_PANEL,
    CONF_SOLAR_ENTITY,
    CONF_SUN_ENTITY,
    CONF_WEATHER_CODE_ENTITY,
    DOMAIN,
    OTA_SOURCE_FILES,
    PUConfigEntry,
)
from .notify import (
    DISMISS_SCHEMA,
    GENERIC_NOTIFY_SCHEMA,
    _resolve_entry,
    make_dismiss_handler,
    make_generic_notify_handler,
)
from .screens import (
    SET_PLAYLIST_SCHEMA,
    SHOW_PAGE_SCHEMA,
    make_set_playlist_handler,
    make_show_page_handler,
)

_LOGGER = logging.getLogger(__name__)

# Config-entry-only integration (no YAML); declare an empty domain schema for hassfest.
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

SOLAR_INTERVAL        = timedelta(seconds=10)
TIME_INTERVAL         = timedelta(minutes=5)
SERVICE_PUSH_FIRMWARE     = "push_firmware"
SERVICE_SEND_NOTIFICATION = "send_notification"
SERVICE_DISMISS_NOTIFICATION = "dismiss_notification"
SERVICE_SHOW_PAGE         = "show_page"
SERVICE_SET_PLAYLIST      = "set_playlist"

OTA_STAGING_TTL = 3600  # seconds; OTA files staged under www/ are swept once older than this


def _ota_www_dir(hass: HomeAssistant, device_id: str) -> Path:
    """Per-device staging dir served at /local for the device's OTA HTTP pull."""
    return Path(hass.config.config_dir) / "www" / "pimoroni_unicorn" / device_id


def _purge_ota_staging(hass: HomeAssistant, device_id: str, ttl: int = OTA_STAGING_TTL) -> None:
    """Delete staged OTA files older than ttl seconds (executor — does blocking file IO)."""
    www_dir = _ota_www_dir(hass, device_id)
    if not www_dir.is_dir():
        return
    cutoff = time.time() - ttl
    for p in www_dir.iterdir():
        try:
            if p.is_file() and p.stat().st_mtime < cutoff:
                p.unlink()
        except OSError:
            pass


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the integration-wide services once, independent of any device."""
    hass.services.async_register(
        DOMAIN, SERVICE_PUSH_FIRMWARE, _make_push_firmware_handler(hass)
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SEND_NOTIFICATION, make_generic_notify_handler(hass), schema=GENERIC_NOTIFY_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_DISMISS_NOTIFICATION, make_dismiss_handler(hass), schema=DISMISS_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SHOW_PAGE, make_show_page_handler(hass), schema=SHOW_PAGE_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SET_PLAYLIST, make_set_playlist_handler(hass), schema=SET_PLAYLIST_SCHEMA
    )
    await hass.http.async_register_static_paths([
        StaticPathConfig(PANEL_MODULE_URL, str(Path(__file__).parent / "panel" / "editor.js"), False),
    ])
    ws_api.async_register(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: PUConfigEntry) -> bool:
    """Set up Pimoroni Unicorn from a config entry."""
    if not await async_wait_for_mqtt_client(hass):
        raise ConfigEntryNotReady("MQTT integration not available")

    hass.data.setdefault(DOMAIN, {})
    entry.runtime_data = {"unsub": [], "sensor_unsub": [], "sensor_entities": set(),
                          "value_unsub": [], "value_entities": set(),
                          "diag": {}, "available": False}

    opts      = _merged_opts(entry)
    device_id = opts[CONF_DEVICE_ID]

    _setup_publishers(hass, entry)
    await _async_subscribe_notify_caps(hass, entry)
    await _async_subscribe_fw_manifest(hass, entry)
    await _async_subscribe_diag(hass, entry)
    await _async_subscribe_status(hass, entry)
    await _async_subscribe_page(hass, entry)
    await _async_subscribe_ota_result(hass, entry)
    await _async_subscribe_icons_result(hass, entry)
    await _async_setup_time_feed(hass, entry)
    await _async_rewire_sensor_feed(hass, entry, await layout.async_get_active(hass, entry))
    await _async_publish_orientation(hass, entry)
    await layout.async_push_active(hass, entry)
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    await hass.config_entries.async_forward_entry_setups(entry, ["update", "sensor", "image"])

    await _async_refresh_panel(hass)

    if device_id:
        await hass.async_add_executor_job(_purge_ota_staging, hass, device_id)

    hass.async_create_task(problems.async_sync_issues(hass, entry))

    return True


async def async_unload_entry(hass: HomeAssistant, entry: PUConfigEntry) -> bool:
    """Unload a config entry."""
    await hass.config_entries.async_unload_platforms(entry, ["update", "sensor", "image"])
    problems.async_clear_issues(hass, entry)
    for unsub in (entry.runtime_data or {}).get("unsub", []):
        unsub()
    for unsub in (entry.runtime_data or {}).get("sensor_unsub", []):
        unsub()
    for unsub in (entry.runtime_data or {}).get("value_unsub", []):
        unsub()

    others = [e for e in hass.config_entries.async_entries(DOMAIN) if e.entry_id != entry.entry_id]
    if not others and hass.data.pop(f"{DOMAIN}_panel_registered", False):
        frontend.async_remove_panel(hass, PANEL_URL_PATH)

    return True


async def async_remove_config_entry_device(hass, config_entry, device_entry) -> bool:
    """Allow deleting a stale device from the UI.

    The active device (matching the entry's current device_id) is recreated by
    the entity platforms, so deletion is blocked; any other device left behind by
    an earlier device_id is orphaned and may be removed.
    """
    current = _merged_opts(config_entry).get(CONF_DEVICE_ID)
    return ("mqtt", current) not in device_entry.identifiers


PANEL_URL_PATH    = "pimoroni-unicorn"
PANEL_MODULE_URL  = "/pimoroni_unicorn_panel/editor.js"


def _panel_wanted(hass: HomeAssistant) -> bool:
    """True if any configured device opts into the layout panel (default on)."""
    return any(
        _merged_opts(entry).get(CONF_SHOW_PANEL, True)
        for entry in hass.config_entries.async_entries(DOMAIN)
    )


async def _async_refresh_panel(hass: HomeAssistant) -> None:
    """Register or remove the sidebar panel to match the show_panel option."""
    want = _panel_wanted(hass)
    registered = hass.data.get(f"{DOMAIN}_panel_registered", False)
    if want and not registered:
        hass.data[f"{DOMAIN}_panel_registered"] = True  # claim before await to close the parallel-setup race
        integration = await async_get_integration(hass, DOMAIN)
        await panel_custom.async_register_panel(
            hass,
            frontend_url_path=PANEL_URL_PATH,
            webcomponent_name="pimoroni-unicorn-panel",
            module_url=f"{PANEL_MODULE_URL}?v={integration.version}",
            sidebar_title="Unicorn Layout",
            sidebar_icon="mdi:dots-grid",
            require_admin=True,
        )
    elif registered and not want:
        frontend.async_remove_panel(hass, PANEL_URL_PATH)
        hass.data[f"{DOMAIN}_panel_registered"] = False


async def _async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    _setup_publishers(hass, entry)
    await _async_rewire_sensor_feed(hass, entry, await layout.async_get_active(hass, entry))
    await _async_publish_orientation(hass, entry)
    await layout.async_push_active(hass, entry)
    await _async_refresh_panel(hass)


async def _async_subscribe_fw_manifest(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Subscribe to the retained fw/manifest and cache engine version + file hashes."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]

    @callback
    def _on_manifest(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
            if isinstance(data, dict):
                entry.runtime_data["fw_manifest"] = data
                # Device just (re)connected — push fresh time so its clock is right immediately.
                hass.async_create_task(_async_publish_time(hass, device_id))
                async_dispatcher_send(hass, f"{DOMAIN}_manifest_{entry.entry_id}")
        except (json.JSONDecodeError, ValueError):
            pass

    unsub = await async_subscribe(hass, f"{device_id}/fw/manifest", _on_manifest)
    entry.runtime_data["unsub"].append(unsub)


async def _async_subscribe_diag(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Subscribe to the retained diagnostics topic (current page, free memory, uptime)."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]

    note_id = f"pimoroni_unicorn_orientation_drift_{device_id}"

    @callback
    def _on_diag(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
        except (json.JSONDecodeError, ValueError):
            return
        if not isinstance(data, dict):
            return
        # Stable boot timestamp: compute once from uptime, only recompute on a reboot
        # (uptime dropped) — avoids the per-poll jitter of now-minus-uptime.
        prev = entry.runtime_data.get("diag") or {}
        up = data.get("uptime_s")
        boot = prev.get("boot_time")
        if isinstance(up, (int, float)):
            if boot is None or up < (prev.get("uptime_s") or 0):
                boot = dt_util.utcnow() - timedelta(seconds=int(up))
        data["boot_time"] = boot
        entry.runtime_data["diag"] = data
        async_dispatcher_send(hass, f"{DOMAIN}_diag_{entry.entry_id}")

        # Config-drift: the orientation the device actually applied vs what HA has configured.
        applied = data.get("orientation")
        try:
            configured = int(_merged_opts(entry).get(CONF_ORIENTATION, 0) or 0)
        except (ValueError, TypeError):
            configured = 0
        if isinstance(applied, int) and applied != configured:
            notify_create(
                hass,
                title="Pimoroni Unicorn orientation drift",
                message=(
                    f"{device_id} is running at {applied}° but is configured for {configured}°. "
                    "It applies a new orientation on reboot — reboot the device to sync."
                ),
                notification_id=note_id,
            )
        else:
            notify_dismiss(hass, note_id)

    unsub = await async_subscribe(hass, f"{device_id}/diag", _on_diag)
    entry.runtime_data["unsub"].append(unsub)


async def _async_subscribe_page(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Cache the layout the device is actually rendering, so the camera mirrors it."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]

    @callback
    def _on_page(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
        except (json.JSONDecodeError, ValueError):
            return
        lay = data if isinstance(data, dict) and data.get("widgets") else None
        entry.runtime_data["page"] = lay
        hass.async_create_task(_async_rewire_sensor_feed(hass, entry, lay))
        hass.async_create_task(problems.async_sync_issues(hass, entry))

    unsub = await async_subscribe(hass, f"{device_id}/page", _on_page)
    entry.runtime_data["unsub"].append(unsub)


async def _async_subscribe_status(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Subscribe to the device LWT/status topic to drive entity availability."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]

    @callback
    def _on_status(msg: Any) -> None:
        online = msg.payload == "online"
        rd = entry.runtime_data
        rd["available"] = online
        if not online and not rd.get("logged_offline"):
            _LOGGER.warning("%s is offline (MQTT last-will)", device_id)
            rd["logged_offline"] = True
        elif online and rd.get("logged_offline"):
            _LOGGER.info("%s is back online", device_id)
            rd["logged_offline"] = False
        async_dispatcher_send(hass, f"{DOMAIN}_status_{entry.entry_id}")

    unsub = await async_subscribe(hass, f"{device_id}/status", _on_status)
    entry.runtime_data["unsub"].append(unsub)


async def _async_subscribe_icons_result(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Surface the device's icon install/remove result (error -> notification)."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]
    note_id = f"pimoroni_unicorn_icon_result_{device_id}"

    @callback
    def _on_result(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
        except (json.JSONDecodeError, ValueError):
            return
        if not isinstance(data, dict):
            return
        if data.get("ok"):
            notify_dismiss(hass, note_id)
        else:
            notify_create(
                hass,
                title="Pimoroni Unicorn icon install failed",
                message=(
                    f"{device_id} could not install icon "
                    f"'{data.get('name', '?')}': {data.get('error', 'unknown error')}"
                ),
                notification_id=note_id,
            )

    unsub = await async_subscribe(hass, f"{device_id}/icons/result", _on_result)
    entry.runtime_data["unsub"].append(unsub)


async def _async_subscribe_ota_result(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Subscribe to the device's OTA result and surface failures in HA."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]
    note_id = f"pimoroni_unicorn_ota_result_{device_id}"

    @callback
    def _on_result(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
        except (json.JSONDecodeError, ValueError):
            return
        if not isinstance(data, dict):
            return
        entry.runtime_data["ota_result"] = data
        failed = data.get("failed") or []
        if failed:
            notify_create(
                hass,
                title="Pimoroni Unicorn OTA failed",
                message=(
                    f"{device_id} could not download {len(failed)} file(s):\n"
                    f"{', '.join(failed)}\n\n"
                    "Usually the device can't reach Home Assistant's URL. Check "
                    "Settings → System → Network → Home Assistant URL (a LAN http://… the device can reach)."
                ),
                notification_id=note_id,
            )
        else:
            notify_dismiss(hass, note_id)

    unsub = await async_subscribe(hass, f"{device_id}/ota/result", _on_result)
    entry.runtime_data["unsub"].append(unsub)


async def _async_subscribe_notify_caps(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Subscribe to retained notify/capabilities (used to downconvert for old firmware)."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]

    @callback
    def _on_caps(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
            if isinstance(data, dict):
                entry.runtime_data["notify_caps"] = data
        except (json.JSONDecodeError, ValueError):
            pass

    unsub = await async_subscribe(hass, f"{device_id}/notify/capabilities", _on_caps)
    entry.runtime_data["unsub"].append(unsub)


async def _async_publish_orientation(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Publish the configured mounting orientation (retained); device reboots on a change."""
    opts = _merged_opts(entry)
    await async_publish(
        hass, f"{opts[CONF_DEVICE_ID]}/orientation",
        str(opts.get(CONF_ORIENTATION, "0")), retain=True)


async def _async_publish_time(hass: HomeAssistant, device_id: str) -> None:
    """Push HA's local time to the device (so it needs no NTP/internet)."""
    n = dt_util.now()
    payload = {"y": n.year, "mo": n.month, "d": n.day, "h": n.hour, "mi": n.minute, "s": n.second}
    await async_publish(hass, f"{device_id}/time", json.dumps(payload), retain=True)


async def _async_setup_time_feed(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Publish HA local time now and on an interval; device sets its RTC from it."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]
    await _async_publish_time(hass, device_id)

    async def _tick(_now) -> None:
        await _async_publish_time(hass, device_id)

    entry.runtime_data["unsub"].append(
        async_track_time_interval(hass, _tick, TIME_INTERVAL))


_SENSOR_OFF_STATES = {
    "off", "not_home", "closed", "idle", "standby", "disconnected",
    "unavailable", "unknown", "none", "0", "false", "",
}


def _sensor_on_rule(rule: tuple[str, str] | None, state: Any) -> bool:
    """On/off for a dot honouring a per-widget (on_state, off_state) match, else default truthiness."""
    if state is None:
        return False
    raw = str(state.state).strip().lower()
    if raw in ("unavailable", "unknown", ""):
        return False
    on_s, off_s = rule or ("", "")
    if on_s:
        return raw == on_s.strip().lower()
    if off_s:
        return raw != off_s.strip().lower()
    return raw not in _SENSOR_OFF_STATES


def _op_field(op: dict[str, Any], cfg: dict[str, Any], key: str) -> str:
    """Resolve an op string field ($var -> cfg, else literal); '' when absent/non-string."""
    v = op.get(key)
    if isinstance(v, str) and v[:1] == "$":
        v = cfg.get(v[1:])
    return v if isinstance(v, str) else ""


def _layout_sensor_rules(
    lay: dict[str, Any] | None, specs: dict | None = None
) -> dict[str, tuple[str, str]]:
    """Per-entity custom match: built-in sensor widgets + custom declarative dot ops -> (on, off)."""
    rules: dict[str, tuple[str, str]] = {}
    for w in (lay or {}).get("widgets", []):
        cfg = w.get("cfg") or {}
        wid = w.get("type", w.get("id"))
        if wid == "sensor":
            ent = cfg.get("entity")
            if isinstance(ent, str) and ent and (cfg.get("on_state") or cfg.get("off_state")):
                rules[ent] = (str(cfg.get("on_state") or ""), str(cfg.get("off_state") or ""))
        elif specs and wid in specs:
            for op in specs[wid].get("draw", []):
                if not isinstance(op, dict) or op.get("op") != "dot":
                    continue
                ent = _resolve_bind(op, cfg)
                on_s, off_s = _op_field(op, cfg, "on_state"), _op_field(op, cfg, "off_state")
                if ent and (on_s or off_s):
                    rules[ent] = (on_s, off_s)
    return rules


def _num_payload(state: Any) -> str:
    """Numeric /display/<id>/num payload; '' clears it when the entity has no usable number."""
    if state is None or str(state.state).strip().lower() in ("unknown", "unavailable", ""):
        return ""
    try:
        return str(float(state.state))
    except (ValueError, TypeError):
        return ""


_ENTITY_ID = re.compile(r"^[a-z_][a-z0-9_]*\.[a-z0-9_]+$")


def _resolve_bind(op: dict[str, Any], cfg: dict[str, Any]) -> str | None:
    """Resolve a declarative op's bind (cfg $var or literal) to an entity id, else None."""
    bind = op.get("bind")
    if isinstance(bind, str) and bind[:1] == "$":
        bind = cfg.get(bind[1:])
    return bind if isinstance(bind, str) and _ENTITY_ID.match(bind) else None


def _spec_binds(spec: dict[str, Any], cfg: dict[str, Any]) -> tuple[set[str], set[str]]:
    """(numeric, on/off) entity ids a declarative spec's value/bar/dot ops bind, resolved via cfg."""
    nums: set[str] = set()
    dots: set[str] = set()
    for op in spec.get("draw", []):
        if not isinstance(op, dict):
            continue
        ent = _resolve_bind(op, cfg)
        if ent is None:
            continue
        if op.get("op") in ("value", "bar"):
            nums.add(ent)
        elif op.get("op") == "dot":
            dots.add(ent)
    return nums, dots


def _load_custom_specs(custom_dir: Path) -> dict[str, dict[str, Any]]:
    """Map custom declarative widget id -> spec JSON from custom_dir (blocking; run in executor)."""
    specs: dict[str, dict[str, Any]] = {}
    if not custom_dir.is_dir():
        return specs
    for p in custom_dir.glob("widget_*.json"):
        try:
            spec = json.loads(p.read_text())
        except (ValueError, OSError):
            continue
        if isinstance(spec, dict):
            specs[spec.get("id", p.stem[7:])] = spec
    return specs


def _layout_sensor_entities(lay: dict[str, Any] | None, specs: dict | None = None) -> set[str]:
    """On/off entity ids: sensor dots, energy charging + custom declarative dot ops."""
    out: set[str] = set()
    for w in (lay or {}).get("widgets", []):
        cfg = w.get("cfg") or {}
        wid = w.get("type", w.get("id"))
        if wid == "sensor":
            _add_entity(out, cfg.get("entity"))
        elif wid == "energy":
            _add_entity(out, cfg.get("charging_entity"))
        elif specs and wid in specs:
            out |= _spec_binds(specs[wid], cfg)[1]
    return out


def _layout_value_entities(lay: dict[str, Any] | None, specs: dict | None = None) -> set[str]:
    """Numeric entity ids: value widgets, energy overrides + custom declarative value/bar ops."""
    out: set[str] = set()
    for w in (lay or {}).get("widgets", []):
        cfg = w.get("cfg") or {}
        wid = w.get("type", w.get("id"))
        if wid == "value":
            _add_entity(out, cfg.get("entity"))
        elif wid == "energy":
            for k in ("solar_entity", "consumption_entity", "soc_entity"):
                _add_entity(out, cfg.get(k))
        elif specs and wid in specs:
            out |= _spec_binds(specs[wid], cfg)[0]
    return out


def _add_entity(out: set[str], ent: Any) -> None:
    if isinstance(ent, str) and ent:
        out.add(ent)


async def _async_rewire_sensor_feed(
    hass: HomeAssistant, entry: PUConfigEntry, lay: dict[str, Any] | None
) -> None:
    """Publish on/off + numeric state for the entity-bound widgets the device is showing."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]
    store     = entry.runtime_data
    custom_dir = marketplace.widgets_dir(hass.config.config_dir)
    specs = await hass.async_add_executor_job(_load_custom_specs, custom_dir)
    rules = _layout_sensor_rules(lay, specs)
    await _rewire_channel(hass, store, device_id, _layout_sensor_entities(lay, specs),
                          "sensor_entities", "sensor_unsub", "state",
                          lambda ent, s: "ON" if _sensor_on_rule(rules.get(ent), s) else "OFF",
                          meta=rules)
    await _rewire_channel(hass, store, device_id, _layout_value_entities(lay, specs),
                          "value_entities", "value_unsub", "num", lambda _ent, s: _num_payload(s))


async def _rewire_channel(
    hass: HomeAssistant, store: dict[str, Any], device_id: str, entities: set[str],
    ent_key: str, unsub_key: str, suffix: str, payload: Any, meta: Any = None,
) -> None:
    """Track a set of entities and mirror their state to /display/<id>/<suffix>."""
    meta_key = f"{ent_key}_meta"
    if entities == store.get(ent_key) and store.get(unsub_key) and store.get(meta_key) == meta:
        return

    for unsub in store.get(unsub_key, []):
        unsub()
    store[unsub_key] = []
    for removed in store.get(ent_key, set()) - entities:
        await async_publish(hass, f"{device_id}/display/{removed}/{suffix}", "", retain=True)
    store[ent_key] = entities
    store[meta_key] = meta

    for ent in entities:
        await async_publish(hass, f"{device_id}/display/{ent}/{suffix}",
                            payload(ent, hass.states.get(ent)), retain=True)

        @callback
        def _on_state(event: Any, _ent: str = ent) -> None:
            new_state = event.data.get("new_state")
            if new_state is not None:
                hass.async_create_task(async_publish(
                    hass, f"{device_id}/display/{_ent}/{suffix}",
                    payload(_ent, new_state), retain=True))

        store[unsub_key].append(async_track_state_change_event(hass, [ent], _on_state))


def _merged_opts(entry: ConfigEntry) -> dict[str, Any]:
    return {**entry.data, **entry.options}


# HA weather-entity condition strings -> the firmware's simplified condition vocabulary
# (matches weather_fx.map_owm_code outputs). Lets users pick a weather.* entity, not just an
# OWM-code sensor.
_HA_CONDITION_MAP = {
    "sunny": "clear", "clear-night": "clear",
    "partlycloudy": "partly_cloudy",
    "cloudy": "cloudy",
    "fog": "fog",
    "rainy": "rain", "pouring": "rain",
    "lightning": "thunderstorm", "lightning-rainy": "thunderstorm",
    "snowy": "snow", "snowy-rainy": "snow", "hail": "snow",
    "windy": "clear", "windy-variant": "clear", "exceptional": "clear",
}


def _weather_condition(state: Any) -> Any:
    """Normalize an entity to what the firmware expects: an int OWM code, or a condition string."""
    raw = state.state
    try:
        return int(raw)  # numeric OWM code — device maps it via map_owm_code
    except (ValueError, TypeError):
        pass
    for key in ("owm_code", "weather_code", "condition_code", "code"):
        val = state.attributes.get(key)
        if isinstance(val, int) or (isinstance(val, str) and val.isdigit()):
            return int(val)
    text = str(raw).lower()
    return _HA_CONDITION_MAP.get(text, text)  # known HA condition -> firmware string; else pass through


def live_state(hass: HomeAssistant, entry: PUConfigEntry) -> dict[str, Any]:
    """Assemble the render state the device is currently showing (for the screen camera)."""

    opts = _merged_opts(entry)
    sun_entity = (opts.get(CONF_SUN_ENTITY) or "sun.sun").strip() or "sun.sun"
    sun = hass.states.get(sun_entity)

    condition, temp = "clear", None
    # Prefer the condition the device actually received (faithful mirror); fall back to
    # re-deriving from the configured entity if the device hasn't reported it yet.
    diag = (entry.runtime_data or {}).get("diag") or {}
    if diag.get("weather"):
        condition = diag["weather"]
        if isinstance(diag.get("weather_temp"), (int, float)):
            temp = round(float(diag["weather_temp"]), 1)
    else:
        weather_entity = (opts.get(CONF_WEATHER_CODE_ENTITY) or "").strip()
        if weather_entity:
            st = hass.states.get(weather_entity)
            if st and st.state not in ("unknown", "unavailable", ""):
                cond = _weather_condition(st)
                condition = render_service.map_owm(cond) if isinstance(cond, int) else str(cond)
                t = st.attributes.get("temperature")
                if isinstance(t, (int, float)):
                    temp = round(float(t), 1)

    sensors = {
        ent: {"state": bool((s := hass.states.get(ent)) and s.state == "on")}
        for ent in (entry.runtime_data or {}).get("sensor_entities", set())
    }
    values = {
        ent: _float_state(hass, ent)
        for ent in (entry.runtime_data or {}).get("value_entities", set())
    }
    return {
        **values,
        "time": dt_util.now().timetuple(),
        "solar": _float_state(hass, (opts.get(CONF_SOLAR_ENTITY) or "").strip()),
        "consumption": _float_state(hass, (opts.get(CONF_CONSUMPTION_ENTITY) or "").strip()),
        "soc": int(_float_state(hass, (opts.get(CONF_BATTERY_SOC_ENTITY) or "").strip())),
        "charging": _bool_state(hass, (opts.get(CONF_BATTERY_CHARGING_ENTITY) or "").strip()),
        "sun_below": sun is not None and sun.state == "below_horizon",
        "weather": condition,
        "temp": temp,
        "display_sensors": sensors,
        "elapsed_ms": int(time.monotonic() * 1000),
    }


def _setup_publishers(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    opts        = _merged_opts(entry)
    device_id   = opts[CONF_DEVICE_ID]
    store       = entry.runtime_data

    for unsub in store["unsub"]:
        unsub()
    store["unsub"].clear()

    solar_entity            = (opts.get(CONF_SOLAR_ENTITY) or "").strip()
    consumption_entity      = (opts.get(CONF_CONSUMPTION_ENTITY) or "").strip()
    battery_soc_entity      = (opts.get(CONF_BATTERY_SOC_ENTITY) or "").strip()
    battery_charging_entity = (opts.get(CONF_BATTERY_CHARGING_ENTITY) or "").strip()
    sun_entity              = (opts.get(CONF_SUN_ENTITY) or "sun.sun").strip() or "sun.sun"
    weather_code_entity     = (opts.get(CONF_WEATHER_CODE_ENTITY) or "").strip()
    extra_sensors_raw       = (opts.get(CONF_EXTRA_SENSORS) or "").strip()

    extra_sensors = _parse_extra_sensors(extra_sensors_raw)
    has_solar     = any([solar_entity, consumption_entity, battery_soc_entity, battery_charging_entity])

    # Always feed sun_below (from sun.sun) so the sun/moon widget works without any
    # solar config; solar/consumption fields are simply zero when unconfigured.
    if has_solar or extra_sensors or sun_entity:
        solar_topic = f"{device_id}/solar"

        @callback
        def _publish_solar(_now: Any = None) -> None:
            sun_state = hass.states.get(sun_entity)
            sun_below = sun_state is not None and sun_state.state == "below_horizon"

            payload = json.dumps({
                "solar":             _float_state(hass, solar_entity),
                "consumption":       _float_state(hass, consumption_entity),
                "battery_soc":       int(_float_state(hass, battery_soc_entity)),
                "battery_charging":  _bool_state(hass, battery_charging_entity),
                "sun_below_horizon": sun_below,
            })
            hass.async_create_task(async_publish(hass, solar_topic, payload, retain=True))

            for entity_id, topic_suffix in extra_sensors:
                state = hass.states.get(entity_id)
                if state is None or state.state in ("unknown", "unavailable", ""):
                    continue
                extra_payload = json.dumps({"state": state.state})
                topic = f"{device_id}/{topic_suffix}"
                hass.async_create_task(async_publish(hass, topic, extra_payload, retain=True))

        store["unsub"].append(
            async_track_time_interval(hass, _publish_solar, SOLAR_INTERVAL)
        )
        store["unsub"].append(
            async_track_state_change_event(hass, [sun_entity], _publish_solar)
        )

    if weather_code_entity:
        weather_topic  = f"{device_id}/weather"
        watch_entities: list[str] = [weather_code_entity, sun_entity]

        @callback
        def _publish_weather(_event: Any = None) -> None:
            state = hass.states.get(weather_code_entity)
            if state is None or state.state in ("unknown", "unavailable", ""):
                return
            data: dict[str, Any] = {"condition": _weather_condition(state)}
            temp = state.attributes.get("temperature")
            if isinstance(temp, (int, float)):
                data["temp"] = round(float(temp), 1)
            payload = json.dumps(data)
            hass.async_create_task(async_publish(hass, weather_topic, payload, retain=True))

        store["unsub"].append(
            async_track_state_change_event(hass, watch_entities, _publish_weather)
        )


def _make_push_firmware_handler(
    hass: HomeAssistant,
) -> Callable[[ServiceCall], Coroutine[Any, Any, None]]:
    async def _handle_push_firmware(call: ServiceCall) -> None:
        entries = hass.config_entries.async_entries(DOMAIN)
        target = call.data.get("entry_id")
        if not target and call.data.get("device_id"):
            entry, _ = _resolve_entry(hass, call.data["device_id"])
            target = entry.entry_id if entry else "__none__"
        if target:
            entries = [e for e in entries if e.entry_id == target]
        if not entries:
            _LOGGER.error("Pimoroni Unicorn: no matching configured entries found")
            return

        base_url = await firmware_install.async_device_base_url(hass)
        if not base_url:
            msg = (
                "No local HA URL available for OTA. The device fetches firmware over plain HTTP "
                "on the LAN; an external/cloud URL is unreachable and HTTPS is unreliable on the "
                "device (memory-constrained, no cert verification). Either set a plain-HTTP "
                "internal URL (e.g. http://192.168.x.x:8123) in Settings → System → Network, or "
                "flash the firmware/ tree once over USB (Thonny)."
            )
            notify_create(
                hass, title="Pimoroni Unicorn OTA failed", message=msg,
                notification_id="pimoroni_unicorn_ota_error")
            raise HomeAssistantError(msg)
        _LOGGER.debug("Pimoroni Unicorn OTA: device will fetch files from %s", base_url)
        if base_url.lower().startswith("https"):
            _LOGGER.warning(
                "Pimoroni Unicorn OTA: HA URL is HTTPS (%s). TLS is unreliable on the device "
                "(memory-constrained); if the update fails, flash the firmware/ tree over USB "
                "(Thonny) instead.", base_url)

        requested    = call.data.get("files", ["main"])
        file_content = call.data.get("file_content", {})
        force        = bool(call.data.get("force", False))
        source_dir   = Path(__file__).parent / "firmware"

        all_errors: list[str] = []
        total_skipped = 0
        published = False
        for entry in entries:
            opts      = _merged_opts(entry)
            device_id = opts[CONF_DEVICE_ID]
            www_dir   = _ota_www_dir(hass, device_id)
            # Per-file hashes the device last reported; skip any file it already has identical.
            device_hashes = ((entry.runtime_data or {}).get("fw_manifest") or {}).get("files", {})

            def _stage_files(
                www_dir: Path = www_dir, device_hashes: dict = device_hashes,
            ) -> tuple[list[tuple[str, str]], list[str], list[str]]:
                www_dir.mkdir(parents=True, exist_ok=True)
                staged: list[tuple[str, str]] = []
                errors: list[str]             = []
                skipped: list[str]            = []
                for key in requested:
                    src_name, device_path = _resolve_ota_key(key)

                    if key in file_content:
                        content = str(file_content[key])
                    else:
                        src = source_dir / src_name
                        if not src.is_file():
                            _LOGGER.warning("Pimoroni Unicorn OTA: source not found: %s", src)
                            errors.append(src_name)
                            continue
                        with src.open(encoding="utf-8") as f:
                            content = f.read()

                    if src_name.endswith(".py"):
                        try:
                            ast.parse(content)
                        except SyntaxError as e:
                            _LOGGER.error("Pimoroni Unicorn OTA: syntax error in %s: %s", src_name, e)
                            errors.append(src_name)
                            continue
                        except MemoryError:
                            _LOGGER.warning(
                                "Pimoroni Unicorn OTA: low memory validating %s, skipping check",
                                src_name,
                            )

                    basename = device_path.rsplit("/", 1)[-1]
                    new_hash = hashlib.sha256(content.encode("utf-8")).hexdigest()[:16]
                    if not force and device_hashes.get(basename) == new_hash:
                        skipped.append(basename)
                        continue

                    with (www_dir / src_name).open("w", encoding="utf-8") as f:
                        f.write(content)
                    staged.append((src_name, device_path))
                return staged, errors, skipped

            staged, errors, skipped = await hass.async_add_executor_job(_stage_files)
            all_errors.extend(errors)
            total_skipped += len(skipped)
            if skipped:
                _LOGGER.debug(
                    "Pimoroni Unicorn OTA: %s already current on %s, skipped: %s",
                    len(skipped), device_id, ", ".join(skipped))

            if not staged:
                if skipped and not errors:
                    _LOGGER.info(
                        "Pimoroni Unicorn OTA: %s already up to date, nothing to send", device_id)
                else:
                    _LOGGER.warning("Pimoroni Unicorn OTA: no files staged for %s", device_id)
                continue

            ota_payload = {
                "base": f"{base_url.rstrip('/')}/local/pimoroni_unicorn/{device_id}/",
                "files": [[src_name, device_path] for src_name, device_path in staged],
            }
            await async_publish(
                hass,
                f"{device_id}/ota",
                json.dumps(ota_payload),
                retain=False,
            )
            published = True

            async def _sweep(_now: Any, did: str = device_id) -> None:
                await hass.async_add_executor_job(_purge_ota_staging, hass, did)

            entry.runtime_data["unsub"].append(async_call_later(hass, OTA_STAGING_TTL, _sweep))

            _LOGGER.info(
                "Pimoroni Unicorn OTA: sent %s to %s",
                ", ".join(n for n, _ in staged),
                device_id,
            )

        if all_errors:
            _LOGGER.warning(
                "Pimoroni Unicorn OTA: skipped (syntax/missing): %s", ", ".join(all_errors))
        if not published:
            if total_skipped and not all_errors:
                _LOGGER.info("Pimoroni Unicorn OTA: nothing to send, device(s) already current")
                return
            raise HomeAssistantError(
                f"OTA published nothing (no files staged{'; skipped: ' + ', '.join(all_errors) if all_errors else ''}).")
        _LOGGER.info("Pimoroni Unicorn OTA: command sent for %s", ", ".join(requested))

    return _handle_push_firmware


def _resolve_ota_key(key: str) -> tuple[str, str]:
    if key in OTA_SOURCE_FILES:
        return OTA_SOURCE_FILES[key]
    fn = key if "." in key else f"{key}.py"
    return (fn, f"/{fn}")


def _parse_extra_sensors(raw: str) -> list[tuple[str, str]]:
    result: list[tuple[str, str]] = []
    for line in raw.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split(None, 1)
        if len(parts) == 2:
            result.append((parts[0], parts[1]))
        else:
            _LOGGER.warning("Pimoroni Unicorn: ignoring malformed extra sensor line: %r", line)
    return result


def _float_state(hass: HomeAssistant, entity_id: str) -> float:
    if not entity_id:
        return 0.0
    state = hass.states.get(entity_id)
    if state is None or state.state in ("unknown", "unavailable", ""):
        return 0.0
    try:
        return float(state.state)
    except (ValueError, TypeError):
        return 0.0


def _bool_state(hass: HomeAssistant, entity_id: str) -> bool:
    if not entity_id:
        return False
    state = hass.states.get(entity_id)
    return state is not None and state.state == "on"
