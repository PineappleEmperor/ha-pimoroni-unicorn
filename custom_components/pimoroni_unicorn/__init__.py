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
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.loader import async_get_integration

from . import layout, websocket as ws_api
from .const import (
    CONF_BATTERY_CHARGING_ENTITY,
    CONF_BATTERY_SOC_ENTITY,
    CONF_CONSUMPTION_ENTITY,
    CONF_DEVICE_ID,
    CONF_DISPLAY_SENSORS,
    CONF_EXTRA_SENSORS,
    CONF_MODEL,
    CONF_SOLAR_ENTITY,
    CONF_SUN_ENTITY,
    CONF_WEATHER_CODE_ENTITY,
    DOMAIN,
    OTA_SOURCE_FILES,
    UNICORN_MODEL_KEYS,
)
from .notify import (
    DISMISS_SCHEMA,
    GENERIC_NOTIFY_SCHEMA,
    SERVICE_SCHEMA as NOTIFY_SERVICE_SCHEMA,
    make_dismiss_handler,
    make_generic_notify_handler,
    make_notify_handler,
)

_LOGGER = logging.getLogger(__name__)

SOLAR_INTERVAL        = timedelta(seconds=10)
SERVICE_GENERATE_SECRETS  = "generate_secrets"
SERVICE_PUSH_FIRMWARE     = "push_firmware"
SERVICE_SEND_NOTIFICATION = "send_notification"
SERVICE_DISMISS_NOTIFICATION = "dismiss_notification"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Pimoroni Unicorn from a config entry."""
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = {"unsub": [], "ha_config": {}, "display_sensor_ids": set()}

    opts      = _merged_opts(entry)
    device_id = opts[CONF_DEVICE_ID]

    _setup_publishers(hass, entry)
    await _async_subscribe_ha_config(hass, entry)
    await _async_subscribe_layout_caps(hass, entry)
    await _async_subscribe_notify_caps(hass, entry)
    await _async_setup_display_sensors(hass, entry)
    await layout.async_push_active(hass, entry)
    entry.async_on_unload(entry.add_update_listener(_async_options_updated))
    await hass.config_entries.async_forward_entry_setups(entry, ["button"])

    if not hass.data.get(f"{DOMAIN}_ws_registered"):
        ws_api.async_register(hass)
        hass.data[f"{DOMAIN}_ws_registered"] = True
    await _async_register_panel(hass)

    if not hass.services.has_service(DOMAIN, SERVICE_GENERATE_SECRETS):
        hass.services.async_register(
            DOMAIN, SERVICE_GENERATE_SECRETS, _make_generate_secrets_handler(hass)
        )
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

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    await hass.config_entries.async_unload_platforms(entry, ["button"])
    store = hass.data[DOMAIN].pop(entry.entry_id, {})
    for unsub in store.get("unsub", []):
        unsub()

    opts      = _merged_opts(entry)
    device_id = opts[CONF_DEVICE_ID]
    if device_id and hass.services.has_service(NOTIFY_DOMAIN, device_id):
        hass.services.async_remove(NOTIFY_DOMAIN, device_id)

    if not hass.data.get(DOMAIN):
        hass.services.async_remove(DOMAIN, SERVICE_GENERATE_SECRETS)
        hass.services.async_remove(DOMAIN, SERVICE_PUSH_FIRMWARE)
        hass.services.async_remove(DOMAIN, SERVICE_SEND_NOTIFICATION)
        hass.services.async_remove(DOMAIN, SERVICE_DISMISS_NOTIFICATION)
        if hass.data.pop(f"{DOMAIN}_panel_registered", False):
            frontend.async_remove_panel(hass, PANEL_URL_PATH)

    return True


PANEL_URL_PATH    = "pimoroni-unicorn"
PANEL_MODULE_URL  = "/pimoroni_unicorn_panel/editor.js"


async def _async_register_panel(hass: HomeAssistant) -> None:
    """Serve the editor bundle and register the sidebar panel (once)."""
    if hass.data.get(f"{DOMAIN}_panel_registered"):
        return
    await hass.http.async_register_static_paths([
        StaticPathConfig(PANEL_MODULE_URL, str(Path(__file__).parent / "panel" / "editor.js"), False),
    ])
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


async def _async_options_updated(hass: HomeAssistant, entry: ConfigEntry) -> None:
    _setup_publishers(hass, entry)
    await _async_subscribe_ha_config(hass, entry)
    await _async_publish_ha_config(hass, entry)
    await _async_setup_display_sensors(hass, entry)
    await layout.async_push_active(hass, entry)


async def _async_subscribe_ha_config(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Subscribe to retained ha_config topic and cache payload in hass.data."""
    device_id = _merged_opts(entry)[CONF_DEVICE_ID]

    @callback
    def _on_ha_config(msg: Any) -> None:
        try:
            data = json.loads(msg.payload)
            if isinstance(data, dict) and entry.entry_id in hass.data.get(DOMAIN, {}):
                hass.data[DOMAIN][entry.entry_id]["ha_config"] = data
        except (json.JSONDecodeError, ValueError):
            pass

    unsub = await async_subscribe(hass, f"{device_id}/ha_config", _on_ha_config)
    hass.data[DOMAIN][entry.entry_id]["unsub"].append(unsub)


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


async def _async_publish_ha_config(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Publish current entity config to retained MQTT topic."""
    opts      = _merged_opts(entry)
    device_id = opts[CONF_DEVICE_ID]
    entity_keys = (
        CONF_SOLAR_ENTITY, CONF_CONSUMPTION_ENTITY, CONF_BATTERY_SOC_ENTITY,
        CONF_BATTERY_CHARGING_ENTITY, CONF_SUN_ENTITY, CONF_WEATHER_CODE_ENTITY,
        CONF_EXTRA_SENSORS,
    )
    payload = {k: opts[k] for k in entity_keys if opts.get(k)}
    await async_publish(hass, f"{device_id}/ha_config", json.dumps(payload), retain=True)


async def _async_setup_display_sensors(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Publish display sensor configs and subscribe to entity state changes."""
    opts      = _merged_opts(entry)
    device_id = opts[CONF_DEVICE_ID]
    store     = hass.data[DOMAIN][entry.entry_id]
    sensors   = opts.get(CONF_DISPLAY_SENSORS, [])
    new_ids   = {s["id"] for s in sensors}

    for removed_id in store.get("display_sensor_ids", set()) - new_ids:
        await async_publish(hass, f"{device_id}/display/{removed_id}/config", "", retain=True)
        await async_publish(hass, f"{device_id}/display/{removed_id}/state", "", retain=True)
    store["display_sensor_ids"] = new_ids

    for sensor in sensors:
        entity_id = sensor.get("entity_id", "")
        sensor_id = sensor.get("id", "")
        if not entity_id or not sensor_id:
            continue

        config_payload = json.dumps({
            "name":    sensor.get("name", sensor_id),
            "on_rgb":  _hex_to_rgb(sensor.get("on_color", "00FF00")),
            "off_rgb": _hex_to_rgb(sensor.get("off_color", "1A1A1A")),
            "x":       sensor.get("x_pos",  37),
            "y":       sensor.get("y_pos",   1),
            "spacing": sensor.get("spacing", 4),
        })
        await async_publish(hass, f"{device_id}/display/{sensor_id}/config", config_payload, retain=True)

        state = hass.states.get(entity_id)
        await async_publish(
            hass,
            f"{device_id}/display/{sensor_id}/state",
            "ON" if state and state.state == "on" else "OFF",
            retain=True,
        )

        @callback
        def _on_display_state(event: Any, _sid: str = sensor_id, _did: str = device_id) -> None:
            new_state = event.data.get("new_state")
            if new_state is not None:
                hass.async_create_task(async_publish(
                    hass,
                    f"{_did}/display/{_sid}/state",
                    "ON" if new_state.state == "on" else "OFF",
                    retain=True,
                ))

        store["unsub"].append(
            async_track_state_change_event(hass, [entity_id], _on_display_state)
        )


def _hex_to_rgb(hex_str: str) -> list[int]:
    """Convert hex colour string to [r, g, b] list."""
    h = hex_str.lstrip("#").upper()
    if len(h) != 6:
        return [0, 255, 0]
    try:
        return [int(h[i:i + 2], 16) for i in (0, 2, 4)]
    except ValueError:
        return [0, 255, 0]


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


def _make_generate_secrets_handler(
    hass: HomeAssistant,
) -> Callable[[ServiceCall], Coroutine[Any, Any, None]]:
    async def _handle_generate_secrets(call: ServiceCall) -> None:
        entries = hass.config_entries.async_entries(DOMAIN)
        if not entries:
            _LOGGER.error("Pimoroni Unicorn: no configured entries found")
            return

        mqtt_broker   = ""
        mqtt_port     = 1883
        mqtt_username = ""
        mqtt_entries  = hass.config_entries.async_entries("mqtt")
        if mqtt_entries:
            mqtt_data     = mqtt_entries[0].data
            mqtt_broker   = mqtt_data.get("broker", "")
            mqtt_port     = int(mqtt_data.get("port", 1883))
            mqtt_username = mqtt_data.get("username", "")

        out_dir = Path(hass.config.config_dir) / "pimoroni_unicorn"
        out_dir.mkdir(parents=True, exist_ok=True)

        generated: list[str] = []
        for entry in entries:
            opts      = _merged_opts(entry)
            device_id = opts[CONF_DEVICE_ID]
            file_path = out_dir / f"secrets_{device_id}.py"
            model_key    = UNICORN_MODEL_KEYS.get(opts.get(CONF_MODEL, ""), "galactic")
            entity_opts  = {k: (opts.get(k) or "") for k in (
                CONF_SOLAR_ENTITY, CONF_CONSUMPTION_ENTITY, CONF_BATTERY_SOC_ENTITY,
                CONF_BATTERY_CHARGING_ENTITY, CONF_SUN_ENTITY, CONF_WEATHER_CODE_ENTITY,
            )}
            content = _render_secrets(device_id, mqtt_broker, mqtt_port, mqtt_username, model_key, entity_opts)

            await hass.async_add_executor_job(file_path.write_text, content)

            generated.append(f"`{file_path}`")
            _LOGGER.info("Pimoroni Unicorn: wrote %s", file_path)

        files_list = "\n".join(f"- {p}" for p in generated)
        notify_create(
            hass,
            title="Pimoroni Unicorn firmware config generated",
            message=(
                f"Generated secrets file(s):\n\n{files_list}\n\n"
                "**Next steps:**\n"
                "1. Open the file and fill in `SSID`, `PASSWORD`, and `MQTT_PASSWORD`\n"
                "2. Rename to `secrets.py`\n"
                "3. Copy `secrets.py`, `main.py`, and `hardware.py` to the root of your Pimoroni Unicorn"
            ),
            notification_id="pimoroni_unicorn_secrets_generated",
        )

    return _handle_generate_secrets


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
        source_dir   = Path(hass.config.config_dir) / "pimoroni_unicorn" / "firmware"

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

                    if key in file_content:
                        src = source_dir / src_name
                        if src.is_file():
                            try:
                                src.replace(src.with_name(src.name + ".old"))
                            except OSError as e:
                                _LOGGER.warning("Pimoroni Unicorn OTA: could not back up %s: %s", src_name, e)
                        try:
                            with src.open("w", encoding="utf-8") as f:
                                f.write(content)
                        except OSError as e:
                            _LOGGER.warning("Pimoroni Unicorn OTA: could not update source %s: %s", src_name, e)

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
                f"Device will download files and reboot automatically.{error_note}\n\n"
                f"Source directory: `{source_dir}`"
            ),
            notification_id="pimoroni_unicorn_ota_sent",
        )

    return _handle_push_firmware


def _render_secrets(
    device_id: str,
    mqtt_broker: str,
    mqtt_port: int,
    mqtt_username: str,
    model_key: str,
    entity_opts: dict[str, str],
) -> str:
    sun = entity_opts.get(CONF_SUN_ENTITY) or "sun.sun"
    return (
        f'SSID          = ""\n'
        f'PASSWORD      = ""\n'
        f'MQTT_SERVER   = "{mqtt_broker or ""}"\n'
        f'MQTT_PORT     = {mqtt_port}\n'
        f'MQTT_USER     = "{mqtt_username or ""}"\n'
        f'MQTT_PASSWORD = ""\n'
        f'DEVICE_ID     = "{device_id}"\n'
        f'NTP_HOST      = "{mqtt_broker or ""}"  # defaults to MQTT_SERVER if omitted\n'
        f'MODEL         = "{model_key}"\n'
        f'\n'
        f'# Optional: pre-configure HA entity IDs so the integration auto-fills on first setup\n'
        f'HA_SOLAR_ENTITY            = "{entity_opts.get(CONF_SOLAR_ENTITY, "")}"\n'
        f'HA_CONSUMPTION_ENTITY      = "{entity_opts.get(CONF_CONSUMPTION_ENTITY, "")}"\n'
        f'HA_BATTERY_SOC_ENTITY      = "{entity_opts.get(CONF_BATTERY_SOC_ENTITY, "")}"\n'
        f'HA_BATTERY_CHARGING_ENTITY = "{entity_opts.get(CONF_BATTERY_CHARGING_ENTITY, "")}"\n'
        f'HA_SUN_ENTITY              = "{sun}"\n'
        f'HA_WEATHER_CODE_ENTITY     = "{entity_opts.get(CONF_WEATHER_CODE_ENTITY, "")}"\n'
    )


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
