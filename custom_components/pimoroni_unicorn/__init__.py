"""Pimoroni Unicorn Home Assistant integration."""

import ast
from collections.abc import Callable, Coroutine
from datetime import timedelta
import json
import logging
from pathlib import Path
from typing import Any

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.mqtt import async_publish, async_subscribe
from homeassistant.components.notify.const import DOMAIN as NOTIFY_DOMAIN
from homeassistant.components.persistent_notification import (
    async_create as notify_create,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.loader import async_get_integration
from homeassistant.util import dt as dt_util

from . import layout, websocket as ws_api
from .const import (
    CONF_BATTERY_CHARGING_ENTITY,
    CONF_BATTERY_SOC_ENTITY,
    CONF_CONSUMPTION_ENTITY,
    CONF_DEVICE_ID,
    CONF_EXTRA_SENSORS,
    CONF_SHOW_PANEL,
    CONF_SOLAR_ENTITY,
    CONF_SUN_ENTITY,
    CONF_WEATHER_CODE_ENTITY,
    DOMAIN,
    OTA_SOURCE_FILES,
)
from .notify import (
    DISMISS_SCHEMA,
    GENERIC_NOTIFY_SCHEMA,
    SERVICE_SCHEMA as NOTIFY_SERVICE_SCHEMA,
    make_dismiss_handler,
    make_generic_notify_handler,
    make_notify_handler,
)
from .screens import (
    SET_PLAYLIST_SCHEMA,
    SHOW_PAGE_SCHEMA,
    make_set_playlist_handler,
    make_show_page_handler,
)

_LOGGER = logging.getLogger(__name__)

SOLAR_INTERVAL        = timedelta(seconds=10)
TIME_INTERVAL         = timedelta(minutes=5)
SERVICE_PUSH_FIRMWARE     = "push_firmware"
SERVICE_SEND_NOTIFICATION = "send_notification"
SERVICE_DISMISS_NOTIFICATION = "dismiss_notification"
SERVICE_SHOW_PAGE         = "show_page"
SERVICE_SET_PLAYLIST      = "set_playlist"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Pimoroni Unicorn from a config entry."""
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"unsub": [], "sensor_entities": set(), "diag": {}}

    opts      = _merged_opts(entry)
    device_id = opts[CONF_DEVICE_ID]

    _setup_publishers(hass, entry)
    await _async_subscribe_layout_caps(hass, entry)
    await _async_subscribe_notify_caps(hass, entry)
    await _async_subscribe_fw_manifest(hass, entry)
    await _async_subscribe_diag(hass, entry)
    await _async_setup_time_feed(hass, entry)
    await _async_setup_sensor_feed(hass, entry)
    await layout.async_push_active(hass, entry)
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    await hass.config_entries.async_forward_entry_setups(entry, ["button", "update", "sensor"])

    if not hass.data.get(f"{DOMAIN}_ws_registered"):
        ws_api.async_register(hass)
        hass.data[f"{DOMAIN}_ws_registered"] = True
    await _async_refresh_panel(hass)

    if not hass.services.has_service(DOMAIN, SERVICE_PUSH_FIRMWARE):
        hass.services.async_register(
            DOMAIN, SERVICE_PUSH_FIRMWARE, _make_push_firmware_handler(hass)
        )
    if device_id and not hass.services.has_service(NOTIFY_DOMAIN, device_id):
        hass.services.async_register(
            NOTIFY_DOMAIN, device_id, make_notify_handler(hass, device_id), schema=NOTIFY_SERVICE_SCHEMA
        )
    if not hass.services.has_service(DOMAIN, SERVICE_SEND_NOTIFICATION):
        hass.services.async_register(
            DOMAIN, SERVICE_SEND_NOTIFICATION, make_generic_notify_handler(hass), schema=GENERIC_NOTIFY_SCHEMA
        )
    if not hass.services.has_service(DOMAIN, SERVICE_DISMISS_NOTIFICATION):
        hass.services.async_register(
            DOMAIN, SERVICE_DISMISS_NOTIFICATION, make_dismiss_handler(hass), schema=DISMISS_SCHEMA
        )
    if not hass.services.has_service(DOMAIN, SERVICE_SHOW_PAGE):
        hass.services.async_register(
            DOMAIN, SERVICE_SHOW_PAGE, make_show_page_handler(hass), schema=SHOW_PAGE_SCHEMA
        )
    if not hass.services.has_service(DOMAIN, SERVICE_SET_PLAYLIST):
        hass.services.async_register(
            DOMAIN, SERVICE_SET_PLAYLIST, make_set_playlist_handler(hass), schema=SET_PLAYLIST_SCHEMA
        )

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    await hass.config_entries.async_unload_platforms(entry, ["button", "update", "sensor"])
    store = hass.data[DOMAIN].pop(entry.entry_id, {})
    for unsub in store.get("unsub", []):
        unsub()

    opts      = _merged_opts(entry)
    device_id = opts[CONF_DEVICE_ID]
    if device_id and hass.services.has_service(NOTIFY_DOMAIN, device_id):
        hass.services.async_remove(NOTIFY_DOMAIN, device_id)

    if not hass.data.get(DOMAIN):
        hass.services.async_remove(DOMAIN, SERVICE_PUSH_FIRMWARE)
        hass.services.async_remove(DOMAIN, SERVICE_SEND_NOTIFICATION)
        hass.services.async_remove(DOMAIN, SERVICE_DISMISS_NOTIFICATION)
        hass.services.async_remove(DOMAIN, SERVICE_SHOW_PAGE)
        hass.services.async_remove(DOMAIN, SERVICE_SET_PLAYLIST)
        if hass.data.pop(f"{DOMAIN}_panel_registered", False):
            frontend.async_remove_panel(hass, PANEL_URL_PATH)

    return True


async def async_remove_config_entry_device(hass, config_entry, device_entry) -> bool:
    """Allow deleting a stale device from the UI.

    The active device (matching the entry's current device_id) is recreated by
    the button platform, so deletion is blocked; any other device left behind by
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
        if not hass.data.get(f"{DOMAIN}_panel_static"):
            await hass.http.async_register_static_paths([
                StaticPathConfig(PANEL_MODULE_URL, str(Path(__file__).parent / "panel" / "editor.js"), False),
            ])
            hass.data[f"{DOMAIN}_panel_static"] = True
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
        hass.data[f"{DOMAIN}_panel_registered"] = True
    elif registered and not want:
        frontend.async_remove_panel(hass, PANEL_URL_PATH)
        hass.data[f"{DOMAIN}_panel_registered"] = False


async def _async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    _setup_publishers(hass, entry)
    await _async_setup_sensor_feed(hass, entry)
    await layout.async_push_active(hass, entry)
    await _async_refresh_panel(hass)


async def _async_subscribe_layout_caps(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Subscribe to retained layout/capabilities and cache the widget catalogue."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]

    @callback
    def _on_caps(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
            if isinstance(data, dict) and entry.entry_id in hass.data.get(DOMAIN, {}):
                hass.data[DOMAIN][entry.entry_id]["layout_caps"] = data
        except (json.JSONDecodeError, ValueError):
            pass

    unsub = await async_subscribe(hass, f"{device_id}/layout/capabilities", _on_caps)
    hass.data[DOMAIN][entry.entry_id]["unsub"].append(unsub)


async def _async_subscribe_fw_manifest(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Subscribe to the retained fw/manifest and cache engine version + file hashes."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]

    @callback
    def _on_manifest(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
            if isinstance(data, dict) and entry.entry_id in hass.data.get(DOMAIN, {}):
                hass.data[DOMAIN][entry.entry_id]["fw_manifest"] = data
                # Device just (re)connected — push fresh time so its clock is right immediately.
                hass.async_create_task(_async_publish_time(hass, device_id))
                async_dispatcher_send(hass, f"{DOMAIN}_manifest_{entry.entry_id}")
        except (json.JSONDecodeError, ValueError):
            pass

    unsub = await async_subscribe(hass, f"{device_id}/fw/manifest", _on_manifest)
    hass.data[DOMAIN][entry.entry_id]["unsub"].append(unsub)


async def _async_subscribe_diag(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Subscribe to the retained diagnostics topic (current page, free memory, uptime)."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]

    @callback
    def _on_diag(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
            if isinstance(data, dict) and entry.entry_id in hass.data.get(DOMAIN, {}):
                hass.data[DOMAIN][entry.entry_id]["diag"] = data
                async_dispatcher_send(hass, f"{DOMAIN}_diag_{entry.entry_id}")
        except (json.JSONDecodeError, ValueError):
            pass

    unsub = await async_subscribe(hass, f"{device_id}/diag", _on_diag)
    hass.data[DOMAIN][entry.entry_id]["unsub"].append(unsub)


async def _async_subscribe_notify_caps(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Subscribe to retained notify/capabilities (used to downconvert for old firmware)."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]

    @callback
    def _on_caps(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
            if isinstance(data, dict) and entry.entry_id in hass.data.get(DOMAIN, {}):
                hass.data[DOMAIN][entry.entry_id]["notify_caps"] = data
        except (json.JSONDecodeError, ValueError):
            pass

    unsub = await async_subscribe(hass, f"{device_id}/notify/capabilities", _on_caps)
    hass.data[DOMAIN][entry.entry_id]["unsub"].append(unsub)


async def _async_publish_time(hass: HomeAssistant, device_id: str) -> None:
    """Push HA's local time to the device (so it needs no NTP/internet)."""
    n = dt_util.now()
    payload = {"y": n.year, "mo": n.month, "d": n.day, "h": n.hour, "mi": n.minute, "s": n.second}
    await async_publish(hass, f"{device_id}/time", json.dumps(payload), retain=True)


async def _async_setup_time_feed(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Publish HA local time now and on an interval; device sets its RTC from it."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]
    await _async_publish_time(hass, device_id)

    async def _tick(_now) -> None:
        await _async_publish_time(hass, device_id)

    hass.data[DOMAIN][entry.entry_id]["unsub"].append(
        async_track_time_interval(hass, _tick, TIME_INTERVAL))


async def _async_setup_sensor_feed(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Watch entities named by sensor widgets in the active layout; publish their on/off state."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]
    store     = hass.data[DOMAIN][entry.entry_id]
    active    = await layout.async_get_active(hass, entry) or {}
    entities: set[str] = set()
    for w in active.get("widgets", []):
        if w.get("type", w.get("id")) == "sensor":
            ent = (w.get("cfg") or {}).get("entity")
            if isinstance(ent, str) and ent:
                entities.add(ent)

    for removed in store.get("sensor_entities", set()) - entities:
        await async_publish(hass, f"{device_id}/display/{removed}/state", "", retain=True)
    store["sensor_entities"] = entities

    for ent in entities:
        st = hass.states.get(ent)
        await async_publish(hass, f"{device_id}/display/{ent}/state",
                            "ON" if st and st.state == "on" else "OFF", retain=True)

        @callback
        def _on_state(event: Any, _ent: str = ent, _did: str = device_id) -> None:
            new_state = event.data.get("new_state")
            if new_state is not None:
                hass.async_create_task(async_publish(
                    hass, f"{_did}/display/{_ent}/state",
                    "ON" if new_state.state == "on" else "OFF", retain=True))

        store["unsub"].append(async_track_state_change_event(hass, [ent], _on_state))


def _merged_opts(entry: ConfigEntry) -> dict[str, Any]:
    return {**entry.data, **entry.options}


def _setup_publishers(hass: HomeAssistant, entry: ConfigEntry) -> None:
    opts        = _merged_opts(entry)
    device_id   = opts[CONF_DEVICE_ID]
    store       = hass.data[DOMAIN][entry.entry_id]

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

    if has_solar or extra_sensors:
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

    if weather_code_entity:
        weather_topic  = f"{device_id}/weather"
        watch_entities: list[str] = [weather_code_entity, sun_entity]

        @callback
        def _publish_weather(_event: Any = None) -> None:
            state = hass.states.get(weather_code_entity)
            if state is None or state.state in ("unknown", "unavailable", ""):
                return
            payload = json.dumps({"condition": state.state})
            hass.async_create_task(async_publish(hass, weather_topic, payload, retain=True))

        store["unsub"].append(
            async_track_state_change_event(hass, watch_entities, _publish_weather)
        )


def _make_push_firmware_handler(
    hass: HomeAssistant,
) -> Callable[[ServiceCall], Coroutine[Any, Any, None]]:
    async def _handle_push_firmware(call: ServiceCall) -> None:
        entries = hass.config_entries.async_entries(DOMAIN)
        if not entries:
            _LOGGER.error("Pimoroni Unicorn: no configured entries found")
            return

        base_url = hass.config.internal_url or hass.config.external_url
        if not base_url:
            notify_create(
                hass,
                title="Pimoroni Unicorn OTA failed",
                message=(
                    "Could not determine HA URL. Set an internal or external URL in "
                    "Settings → System → Network → Home Assistant URL."
                ),
                notification_id="pimoroni_unicorn_ota_error",
            )
            return

        requested    = call.data.get("files", ["main"])
        file_content = call.data.get("file_content", {})
        source_dir   = Path(__file__).parent / "firmware"

        all_errors: list[str] = []
        for entry in entries:
            opts      = _merged_opts(entry)
            device_id = opts[CONF_DEVICE_ID]
            www_dir   = Path(hass.config.config_dir) / "www" / "pimoroni_unicorn" / device_id

            def _stage_files(www_dir: Path = www_dir) -> tuple[list[tuple[str, str]], list[str]]:
                www_dir.mkdir(parents=True, exist_ok=True)
                staged: list[tuple[str, str]] = []
                errors: list[str]             = []
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

                    with (www_dir / src_name).open("w", encoding="utf-8") as f:
                        f.write(content)
                    staged.append((src_name, device_path))
                return staged, errors

            staged, errors = await hass.async_add_executor_job(_stage_files)
            all_errors.extend(errors)

            if not staged:
                _LOGGER.warning("Pimoroni Unicorn OTA: no files staged for %s", device_id)
                continue

            ota_payload = {
                "files": [
                    {
                        "url": f"{base_url.rstrip('/')}/local/pimoroni_unicorn/{device_id}/{src_name}",
                        "path": device_path,
                    }
                    for src_name, device_path in staged
                ]
            }
            await async_publish(
                hass,
                f"{device_id}/ota",
                json.dumps(ota_payload),
                retain=False,
            )

            _LOGGER.info(
                "Pimoroni Unicorn OTA: sent %s to %s",
                ", ".join(n for n, _ in staged),
                device_id,
            )

        error_note = f"\n\nSkipped (syntax/missing): {', '.join(all_errors)}" if all_errors else ""
        notify_create(
            hass,
            title="Pimoroni Unicorn OTA sent",
            message=(
                f"OTA command sent for: {', '.join(requested)}.\n"
                f"Device will download files and reboot automatically.{error_note}"
            ),
            notification_id="pimoroni_unicorn_ota_sent",
        )

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
