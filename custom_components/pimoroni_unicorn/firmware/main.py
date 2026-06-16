"""Pimoroni Unicorn display controller with Home Assistant MQTT integration."""

import json
import time
from secrets import DEVICE_ID, MQTT_PASSWORD, MQTT_PORT, MQTT_SERVER, MQTT_USER, PASSWORD, SSID
try:
    from secrets import NTP_HOST
except ImportError:
    NTP_HOST = MQTT_SERVER

try:
    from secrets import (
        HA_SOLAR_ENTITY, HA_CONSUMPTION_ENTITY, HA_BATTERY_SOC_ENTITY,
        HA_BATTERY_CHARGING_ENTITY, HA_SUN_ENTITY, HA_WEATHER_CODE_ENTITY,
    )
except ImportError:
    HA_SOLAR_ENTITY = HA_CONSUMPTION_ENTITY = HA_BATTERY_SOC_ENTITY = ""
    HA_BATTERY_CHARGING_ENTITY = HA_WEATHER_CODE_ENTITY = ""
    HA_SUN_ENTITY = "sun.sun"

import machine
import network
import ntptime
import uasyncio as asyncio
import ubinascii
import uhashlib
import uos
from hardware import (
    DISPLAY, HAS_AUDIO, MODEL, MODEL_NAME,
    SWITCH_BRIGHTNESS_DOWN, SWITCH_BRIGHTNESS_UP, SWITCH_SLEEP,
    HEIGHT as height, WIDTH as width, unicorn,
)
from picographics import PEN_RGB888, PicoGraphics
from umqtt.simple import MQTTClient

from bitfonts import BitFont, font3x5

import drawing
import icons
import layouts
import notify_animations
import sounds
import weather_fx
import widgets
from version import ENGINE_VERSION
from drawing import draw_icon
from notify_animations import (
    NOTIFY_ANIMATIONS, NOTIFY_CAPABILITIES, _draw_notification, compute_duration_ms,
    reset_fire_heat,
)
from sounds import NOTIFY_SOUNDS, _start_sound, _tick_sound
from weather_fx import init_weather_drops, map_owm_code


machine.freq(200_000_000)
graphics = PicoGraphics(display=DISPLAY, pen_type=PEN_RGB888)
graphics.set_font("bitmap6")
bitfont  = BitFont(graphics)

# Initialise sub-modules that need hardware references
drawing.init(graphics, bitfont, width, height)
notify_animations.init(graphics, width, height)
sounds.init(unicorn)
weather_fx.init(graphics, width, height)

# --- MQTT ---
MQTT_BROKER      = MQTT_SERVER
DISCOVERY_PREFIX = "homeassistant"

# --- MQTT Topics ---
TOPIC_STATUS            = f"{DEVICE_ID}/status"
TOPIC_COMMAND           = f"{DEVICE_ID}/set"
TOPIC_STATE             = f"{DEVICE_ID}/state"
TOPIC_SOLAR             = f"{DEVICE_ID}/solar"
TOPIC_WEATHER           = f"{DEVICE_ID}/weather"
TOPIC_ANIM_CMD          = f"{DEVICE_ID}/animation/set"
TOPIC_ANIM_STATE        = f"{DEVICE_ID}/animation/state"
TOPIC_ENERGY_MODE_CMD   = f"{DEVICE_ID}/energy_mode/set"
TOPIC_ENERGY_MODE_STATE = f"{DEVICE_ID}/energy_mode/state"
TOPIC_NOTIFY            = f"{DEVICE_ID}/notify"
TOPIC_NOTIFY_DISMISS    = f"{DEVICE_ID}/notify/dismiss"
TOPIC_ICONS_CMD         = f"{DEVICE_ID}/icons/cmd"
TOPIC_LAYOUT            = f"{DEVICE_ID}/layout"
TOPIC_OTA               = f"{DEVICE_ID}/ota"
TOPIC_FW_MANIFEST       = f"{DEVICE_ID}/fw/manifest"
TOPIC_FW_REMOVE         = f"{DEVICE_ID}/fw/remove"

# --- HA Device details ---
DEVICE_INFO = {
    "identifiers": [DEVICE_ID],
    "name": "Pimoroni Unicorn",
    "model": MODEL_NAME,
    "manufacturer": "Pimoroni",
}

# --- Global state ---
brightness        = 0.35
system_state      = "AWAKE"
msg               = "Ready"
icon_type         = "none"
mqtt_client       = None
solar_power       = 0.0
battery_soc       = 0
battery_charging  = False
battery_animation = False
sun_below_horizon = False
energy_mode       = "Net"
consumption_power = 0.0
weather_condition = "clear"

_notify_queue    = []
_notify_active   = None
_notify_start_ms = 0
_notify_end_ms   = 0
_ota_pending     = None

LAYOUT_PATH = "/layout.json"


def _load_layout():
    """Return the active layout: pushed /layout.json if valid, else model default."""
    try:
        with open(LAYOUT_PATH) as f:
            data = json.load(f)
        if isinstance(data, dict) and data.get("widgets") is not None:
            return data
    except (OSError, ValueError):
        pass
    return layouts.default_layout(MODEL)


_active_layout = _load_layout()

display_sensors: dict = {}  # populated via MQTT {device_id}/display/{id}/config and state
TOPIC_DISPLAY_PREFIX = f"{DEVICE_ID}/display/"

# Colour pens used directly in main.py (OTA screen + sleep clear)
BLACK       = graphics.create_pen(0,   0,   0)
WHITE       = graphics.create_pen(255, 255, 255)
ENERGY_CYAN = graphics.create_pen(0,   206, 206)


# --- Helpers ---

def send_ha_state():
    """Publish current on/off state and brightness to the HA state topic."""
    if mqtt_client:
        try:
            mqtt_client.publish(TOPIC_STATE, json.dumps({
                "state": "ON" if system_state == "AWAKE" else "OFF",
                "brightness": int(brightness * 100),
            }), retain=True)
        except Exception:
            pass


def is_bst(year, month, day):
    """Return True if the given date falls within British Summer Time."""
    if month < 3 or month > 10:
        return False
    if 3 < month < 10:
        return True
    last_sunday = 31 - ((time.localtime(time.mktime((year, month, 31, 0, 0, 0, 0, 0)))[6] + 1) % 7)
    if month == 3:
        return day >= last_sunday
    return day < last_sunday


async def sync_time():
    """Sync the RTC via NTP and apply a BST offset if applicable."""
    ntptime.host = NTP_HOST
    try:
        ntptime.settime()
        t  = time.time()
        tm = time.localtime(t)
        t += 3600 if is_bst(tm[0], tm[1], tm[2]) else 0
        tm = time.localtime(t)
        machine.RTC().datetime((tm[0], tm[1], tm[2], 0, tm[3], tm[4], tm[5], 0))
        print("Time synced")
    except Exception:
        print("Time sync failed")


# --- OTA ---

def _show_ota_screen(label, n, total):
    graphics.set_pen(graphics.create_pen(0, 0, 30))
    graphics.clear()
    graphics.set_pen(WHITE)
    bitfont.text("OTA", 1, 1, font3x5)
    bitfont.text(label[:14], 1, 7, font3x5)
    if total > 0:
        graphics.set_pen(ENERGY_CYAN)
        graphics.rectangle(1, 5, max(1, int((n / total) * (width - 2))), 1)
    unicorn.update(graphics)


def _run_ota(payload):
    import urequests  # noqa: PLC0415
    files     = payload.get("files", [])
    total     = len(files)
    succeeded = 0
    for i, item in enumerate(files):
        url  = item.get("url", "")
        path = item.get("path", "")
        if not url or not path:
            continue
        _show_ota_screen(path.lstrip("/"), i + 1, total)
        parent = path.rsplit("/", 1)[0]
        if parent:
            try:
                uos.mkdir(parent)
            except OSError:
                pass
        tmp = path + ".tmp"
        try:
            r = urequests.get(url, timeout=30)
            if r.status_code == 200:
                with open(tmp, "wb") as f:
                    f.write(r.content)
                r.close()
                valid = True
                if path.endswith(".py"):
                    try:
                        with open(tmp, "r") as f:
                            src = f.read()
                        compile(src, path, "exec")
                        del src
                    except SyntaxError as e:
                        print("OTA syntax error:", path, e)
                        valid = False
                    except MemoryError:
                        print("OTA: low RAM, skipping validation:", path)
                if valid:
                    uos.rename(tmp, path)
                    succeeded += 1
                else:
                    uos.remove(tmp)
            else:
                r.close()
        except Exception as e:
            print("OTA failed:", path, e)
            try:
                uos.remove(tmp)
            except Exception:
                pass
    _show_ota_screen(f"Done {succeeded}/{total}", total, total)


def _file_hash(path):
    h = uhashlib.sha256()
    with open(path, "rb") as f:
        while True:
            chunk = f.read(512)
            if not chunk:
                break
            h.update(chunk)
    return ubinascii.hexlify(h.digest()).decode()[:16]


def _fw_manifest():
    """Engine version + short per-file hash of every root module (excl. secrets)."""
    files = {}
    for name in uos.listdir("/"):
        if name.endswith(".py") and name != "secrets.py":
            try:
                files[name] = _file_hash("/" + name)
            except Exception:
                pass
    return {"engine_version": ENGINE_VERSION, "files": files}
    time.sleep(2)
    machine.reset()


# --- MQTT ---

def on_message(topic, message):
    """Handle incoming MQTT messages and update global display state."""
    global msg, system_state, icon_type, brightness
    global solar_power, battery_soc, battery_charging, battery_animation
    global sun_below_horizon, weather_condition, energy_mode, consumption_power
    global _ota_pending, _notify_active, _active_layout
    try:
        topic_str = topic.decode()

        if topic_str.startswith(TOPIC_DISPLAY_PREFIX):
            suffix = topic_str[len(TOPIC_DISPLAY_PREFIX):]
            parts  = suffix.split("/", 1)
            if len(parts) == 2:
                sensor_id, msg_type = parts
                if msg_type == "config":
                    try:
                        data = json.loads(message)
                        if data:
                            if sensor_id not in display_sensors:
                                display_sensors[sensor_id] = {"state": False}
                            display_sensors[sensor_id].update({
                                "name":    data.get("name",    sensor_id),
                                "on_rgb":  tuple(data.get("on_rgb",  [0, 255, 0])),
                                "off_rgb": tuple(data.get("off_rgb", [20, 20, 20])),
                                "x":       data.get("x",        37),
                                "y":       data.get("y",         1),
                                "width":   data.get("width",  data.get("size", 2)),
                                "height":  data.get("height", data.get("size", 2)),
                                "spacing": data.get("spacing",   4),
                            })
                        else:
                            display_sensors.pop(sensor_id, None)
                    except Exception:
                        pass
                elif msg_type == "state":
                    if sensor_id in display_sensors:
                        display_sensors[sensor_id]["state"] = message.decode().upper() == "ON"
            return

        if topic_str == TOPIC_ANIM_CMD:
            battery_animation = message != b"OFF"
            mqtt_client.publish(TOPIC_ANIM_STATE, b"ON" if battery_animation else b"OFF", retain=True)
            return

        if topic_str == TOPIC_ENERGY_MODE_CMD:
            mode = message.decode()
            if mode in ("Solar", "Consumption", "Net"):
                energy_mode = mode
                mqtt_client.publish(TOPIC_ENERGY_MODE_STATE, mode.encode(), retain=True)
            return

        if topic_str == TOPIC_NOTIFY:
            try:
                data = json.loads(message)
                has_text   = bool(data.get("text", ""))
                has_anim   = data.get("animation", "") in NOTIFY_ANIMATIONS
                has_effect = data.get("effect", "") in NOTIFY_ANIMATIONS
                has_icon   = data.get("icon") is not None
                if has_text or has_anim or has_effect or has_icon:
                    if data.get("stack") is False:
                        _notify_queue.clear()
                        _notify_active = None
                        if HAS_AUDIO:
                            unicorn.stop_playing()
                    if len(_notify_queue) < 5:
                        _notify_queue.append(data)
            except Exception:
                pass
            return

        if topic_str == TOPIC_NOTIFY_DISMISS:
            try:
                opts = json.loads(message) if message else {}
            except Exception:
                opts = {}
            _notify_active = None
            if isinstance(opts, dict) and opts.get("all"):
                _notify_queue.clear()
            if HAS_AUDIO:
                unicorn.stop_playing()
            return

        if topic_str == TOPIC_ICONS_CMD:
            try:
                data   = json.loads(message)
                action = data.get("action")
                name   = data.get("name", "")
                if action == "install" and name:
                    icons.install(name, data)
                elif action == "remove" and name:
                    icons.remove(name)
            except Exception as e:
                print("Icon cmd failed:", e)
            return

        if topic_str == TOPIC_LAYOUT:
            try:
                data = json.loads(message)
                if isinstance(data, dict) and data.get("widgets") is not None:
                    with open(LAYOUT_PATH, "w") as f:
                        json.dump(data, f)
                    _active_layout = data
            except Exception as e:
                print("Layout cmd failed:", e)
            return

        if topic_str == TOPIC_OTA:
            try:
                _ota_pending = json.loads(message)
            except Exception:
                pass
            return

        if topic_str == TOPIC_FW_REMOVE:
            try:
                data = json.loads(message)
                for path in data.get("files", []):
                    try:
                        uos.remove(path)
                    except Exception:
                        pass
            except Exception:
                pass
            time.sleep(1)
            machine.reset()
            return

        data = json.loads(message)
        state_changed = False

        if topic_str == TOPIC_WEATHER:
            try:
                code = json.loads(message).get("condition", 800)
                new_condition = map_owm_code(int(code))
                if new_condition != weather_condition:
                    weather_condition = new_condition
                    init_weather_drops(weather_condition)
            except Exception as e:
                print("Weather parse error:", e)
            return

        if topic_str == TOPIC_SOLAR:
            try:
                data          = json.loads(message)
                solar_power       = data.get("solar",            0.0)
                consumption_power = data.get("consumption",      0.0)
                battery_soc       = data.get("battery_soc",      0)
                battery_charging  = data.get("battery_charging", False)
                sun_below_horizon = data.get("sun_below_horizon", False)
            except Exception as e:
                print("Solar parse error:", e)
                solar_power = consumption_power = 0.0
                battery_soc = 0
                battery_charging = sun_below_horizon = False
            return

        if "state" in data:
            system_state  = "AWAKE" if data["state"] == "ON" else "SLEEP"
            state_changed = True
        if "brightness" in data:
            brightness    = data["brightness"] / 100.0
            state_changed = True
        if "text" in data:
            msg = data["text"]
        if "icon" in data:
            icon_type = data["icon"]

        if state_changed:
            send_ha_state()

    except Exception as e:
        print("MQTT message error:", e)


async def mqtt_task():
    """Manage MQTT connection, HA discovery publishing, and message polling."""
    global mqtt_client
    mqtt_client = MQTTClient(
        DEVICE_ID, MQTT_BROKER,
        port=MQTT_PORT, user=MQTT_USER, password=MQTT_PASSWORD, keepalive=45,
    )
    mqtt_client.set_last_will(TOPIC_STATUS, b"offline", retain=True)
    mqtt_client.set_callback(on_message)

    while True:
        try:
            if not network.WLAN(network.STA_IF).isconnected():
                await connect_wifi()

            print("Connecting to MQTT...")
            mqtt_client.connect()
            print("Connected to MQTT broker")
            mqtt_client.publish(TOPIC_STATUS, b"online", retain=True)
            await asyncio.sleep(0.5)

            mqtt_client.publish(
                f"{DISCOVERY_PREFIX}/binary_sensor/{DEVICE_ID}/status/config",
                json.dumps({
                    "name": "Connectivity", "state_topic": TOPIC_STATUS,
                    "device_class": "connectivity",
                    "payload_on": "online", "payload_off": "offline",
                    "unique_id": f"{DEVICE_ID}_connectivity", "device": DEVICE_INFO,
                }),
            )
            mqtt_client.publish(
                f"{DISCOVERY_PREFIX}/light/{DEVICE_ID}/display/config",
                json.dumps({
                    "name": "Display", "unique_id": f"{DEVICE_ID}_light",
                    "schema": "json",
                    "command_topic": TOPIC_COMMAND, "state_topic": TOPIC_STATE,
                    "availability_topic": TOPIC_STATUS,
                    "payload_available": "online", "payload_not_available": "offline",
                    "brightness": True, "brightness_scale": 100, "device": DEVICE_INFO,
                }),
            )
            mqtt_client.publish(
                f"{DISCOVERY_PREFIX}/switch/{DEVICE_ID}/animation/config",
                json.dumps({
                    "name": "Battery Animation",
                    "unique_id": f"{DEVICE_ID}_battery_animation",
                    "command_topic": TOPIC_ANIM_CMD, "state_topic": TOPIC_ANIM_STATE,
                    "availability_topic": TOPIC_STATUS,
                    "payload_available": "online", "payload_not_available": "offline",
                    "device": DEVICE_INFO,
                }),
            )
            mqtt_client.publish(
                f"{DISCOVERY_PREFIX}/select/{DEVICE_ID}/energy_mode/config",
                json.dumps({
                    "name": "Energy Mode", "unique_id": f"{DEVICE_ID}_energy_mode",
                    "command_topic": TOPIC_ENERGY_MODE_CMD,
                    "state_topic": TOPIC_ENERGY_MODE_STATE,
                    "options": ["Solar", "Consumption", "Net"],
                    "availability_topic": TOPIC_STATUS,
                    "payload_available": "online", "payload_not_available": "offline",
                    "device": DEVICE_INFO,
                }),
            )

            mqtt_client.subscribe(f"{DEVICE_ID}/display/#".encode())
            for topic in (
                TOPIC_COMMAND, TOPIC_SOLAR, TOPIC_WEATHER,
                TOPIC_ANIM_CMD, TOPIC_ENERGY_MODE_CMD, TOPIC_NOTIFY,
                TOPIC_NOTIFY_DISMISS, TOPIC_ICONS_CMD, TOPIC_LAYOUT, TOPIC_OTA,
                TOPIC_FW_REMOVE,
            ):
                mqtt_client.subscribe(topic.encode())

            mqtt_client.publish(TOPIC_ANIM_STATE, b"ON" if battery_animation else b"OFF", retain=True)
            mqtt_client.publish(TOPIC_ENERGY_MODE_STATE, energy_mode.encode(), retain=True)
            mqtt_client.publish(
                f"{DEVICE_ID}/notify/capabilities", json.dumps(NOTIFY_CAPABILITIES), retain=True
            )
            mqtt_client.publish(
                f"{DEVICE_ID}/layout/capabilities",
                json.dumps(widgets.LAYOUT_CAPABILITIES), retain=True,
            )
            mqtt_client.publish(TOPIC_FW_MANIFEST, json.dumps(_fw_manifest()), retain=True)
            _ha_config = {
                k: v for k, v in (
                    ("solar_entity",            HA_SOLAR_ENTITY),
                    ("consumption_entity",      HA_CONSUMPTION_ENTITY),
                    ("battery_soc_entity",      HA_BATTERY_SOC_ENTITY),
                    ("battery_charging_entity", HA_BATTERY_CHARGING_ENTITY),
                    ("sun_entity",              HA_SUN_ENTITY),
                    ("weather_code_entity",     HA_WEATHER_CODE_ENTITY),
                ) if v
            }
            if _ha_config:
                mqtt_client.publish(f"{DEVICE_ID}/ha_config", json.dumps(_ha_config), retain=True)
            send_ha_state()
            print("MQTT Connected & Discovery Published")

            while True:
                mqtt_client.check_msg()
                if time.ticks_ms() % 60000 < 500:
                    mqtt_client.publish(TOPIC_STATUS, b"online", retain=True)
                await asyncio.sleep(0.1)

        except Exception as e:
            print(f"MQTT error: {e}. Retrying in 5s..")
            await asyncio.sleep(5)


async def main_loop():
    """Handle button presses, draw each frame, and sleep; runs as the main display loop."""
    global brightness, system_state, msg, icon_type
    global _notify_active, _notify_start_ms, _notify_end_ms, _ota_pending

    last_button_time = 0

    while True:
        if _ota_pending is not None:
            _run_ota(_ota_pending)

        current_time = time.ticks_ms()
        t            = time.localtime()

        if SWITCH_SLEEP is not None and unicorn.is_pressed(SWITCH_SLEEP):
            if time.ticks_diff(current_time, last_button_time) > 500:
                system_state     = "SLEEP" if system_state == "AWAKE" else "AWAKE"
                last_button_time = current_time
                send_ha_state()

        notify_wakeup = system_state != "AWAKE" and (
            (_notify_active is not None and _notify_active.get("wakeup"))
            or (_notify_active is None and _notify_queue and _notify_queue[0].get("wakeup"))
        )

        if system_state == "AWAKE" or notify_wakeup:
            graphics.set_pen(BLACK)
            graphics.clear()

            # Notification takeover
            if _notify_active is None and _notify_queue:
                _notify_active   = _notify_queue.pop(0)
                _notify_start_ms = current_time
                _notify_end_ms   = compute_duration_ms(_notify_active)
                reset_fire_heat()
                sound = _notify_active.get("sound")
                if sound:
                    _start_sound(sound)

            if _notify_active is not None:
                elapsed = time.ticks_diff(current_time, _notify_start_ms)
                sound   = _notify_active.get("sound")
                if sound:
                    _tick_sound(sound)
                expired = _notify_end_ms is not None and elapsed >= _notify_end_ms
                if expired or (_notify_end_ms is None and _notify_queue):
                    _notify_active = None
                    if HAS_AUDIO:
                        unicorn.stop_playing()
                else:
                    if notify_wakeup:
                        unicorn.set_brightness(brightness)
                    _draw_notification(_notify_active, elapsed)
                    unicorn.update(graphics)
                    await asyncio.sleep(0.01)
                    continue

            if notify_wakeup:
                graphics.set_pen(BLACK)
                graphics.clear()
                unicorn.set_brightness(0)
                unicorn.update(graphics)
                await asyncio.sleep(0.01)
                continue

            # Brightness buttons
            if SWITCH_BRIGHTNESS_UP is not None and unicorn.is_pressed(SWITCH_BRIGHTNESS_UP):
                brightness += 0.01
            if SWITCH_BRIGHTNESS_DOWN is not None and unicorn.is_pressed(SWITCH_BRIGHTNESS_DOWN):
                brightness -= 0.01
            brightness = max(0.0, min(1.0, brightness))
            unicorn.set_brightness(brightness)

            # Normal display — render the active layout (widgets + overlays)
            state = {
                "time": t, "solar": solar_power, "consumption": consumption_power,
                "soc": battery_soc, "charging": battery_charging,
                "sun_below": sun_below_horizon, "energy_mode": energy_mode,
                "weather": weather_condition, "display_sensors": display_sensors,
                "battery_animation": battery_animation,
            }
            widgets.render_layout(graphics, _active_layout, state)

            if icon_type != "none":
                draw_icon(icon_type, 2, 2)
        else:
            graphics.set_pen(BLACK)
            graphics.clear()
            unicorn.set_brightness(0)

        unicorn.update(graphics)
        await asyncio.sleep(0.01)


async def connect_wifi():
    """Connect to WiFi and sync the RTC via NTP."""
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)
    print("Connecting to WiFi...")
    while not wlan.isconnected():
        await asyncio.sleep(0.5)
    print(f"Connected! IP: {wlan.ifconfig()[0]}")
    await asyncio.sleep(0.5)
    await sync_time()


async def main():
    """Entry point: connect WiFi, then run MQTT and display tasks concurrently."""
    await connect_wifi()
    await asyncio.gather(mqtt_task(), main_loop())


try:
    asyncio.run(main())
except KeyboardInterrupt:
    print("Stopped")
