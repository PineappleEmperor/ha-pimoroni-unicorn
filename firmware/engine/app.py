"""Pimoroni Unicorn display controller with Home Assistant MQTT integration."""

import gc
import json
import time
from secrets import DEVICE_ID, MQTT_PASSWORD, MQTT_PORT, MQTT_SERVER, MQTT_USER, PASSWORD, SSID
try:
    from secrets import NTP_HOST
except ImportError:
    NTP_HOST = ""

_time_synced = False
_last_ntp_ms = 0


import machine
import network
import ntptime
import uasyncio as asyncio
import ubinascii
import uhashlib
import uos
from hardware import (
    DISPLAY, HAS_AUDIO, MODEL, MODEL_NAME, ORIENTATION,
    SWITCH_BRIGHTNESS_DOWN, SWITCH_BRIGHTNESS_UP, SWITCH_SLEEP,
    HEIGHT as height, WIDTH as width, make_surface, unicorn,
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


def _reset_cause_label():
    """Human label for the last reset, using machine's own constants (raw int if unknown)."""
    rc = machine.reset_cause()
    for name, label in (("PWRON_RESET", "Power-on"), ("HARD_RESET", "Hard reset"),
                        ("WDT_RESET", "Watchdog"), ("DEEPSLEEP_RESET", "Deep sleep"),
                        ("SOFT_RESET", "Soft reset"), ("BROWNOUT_RESET", "Brownout")):
        if getattr(machine, name, None) == rc:
            return label
    return str(rc)


_RESET_CAUSE = _reset_cause_label()  # why the device last rebooted — for diagnostics
graphics = PicoGraphics(display=DISPLAY, pen_type=PEN_RGB888)
graphics.set_font("bitmap6")
# All render code draws into the logical (as-mounted) surface; unicorn.update() always
# gets the raw physical `graphics`. At 0° the surface IS graphics (zero overhead).
surface  = make_surface(graphics)
bitfont  = BitFont(surface)

# Initialise sub-modules that need hardware references
drawing.init(surface, bitfont, width, height)
notify_animations.init(surface, width, height)
sounds.init(unicorn)
weather_fx.init(surface, width, height)

# --- MQTT ---
MQTT_BROKER      = MQTT_SERVER
DISCOVERY_PREFIX = "homeassistant"

# Blank DEVICE_ID -> stable MAC-derived id, so multiple devices are unique out of the box.
if not DEVICE_ID:
    _sta = network.WLAN(network.STA_IF)
    _sta.active(True)
    DEVICE_ID = "pimoroni_unicorn_" + ubinascii.hexlify(_sta.config("mac")[-3:]).decode()

# --- MQTT Topics ---
TOPIC_STATUS            = f"{DEVICE_ID}/status"
TOPIC_COMMAND           = f"{DEVICE_ID}/set"
TOPIC_STATE             = f"{DEVICE_ID}/state"
TOPIC_SOLAR             = f"{DEVICE_ID}/solar"
TOPIC_WEATHER           = f"{DEVICE_ID}/weather"
TOPIC_NOTIFY            = f"{DEVICE_ID}/notify"
TOPIC_NOTIFY_DISMISS    = f"{DEVICE_ID}/notify/dismiss"
TOPIC_ICONS_CMD         = f"{DEVICE_ID}/icons/cmd"
TOPIC_ICONS_RESULT      = f"{DEVICE_ID}/icons/result"
TOPIC_LAYOUT            = f"{DEVICE_ID}/layout"
TOPIC_SCREENS           = f"{DEVICE_ID}/screens"
TOPIC_SCREEN_SHOW       = f"{DEVICE_ID}/screen/show"
TOPIC_OTA               = f"{DEVICE_ID}/ota"
TOPIC_FW_MANIFEST       = f"{DEVICE_ID}/fw/manifest"
TOPIC_FW_REMOVE         = f"{DEVICE_ID}/fw/remove"
TOPIC_TIME              = f"{DEVICE_ID}/time"
TOPIC_DIAG              = f"{DEVICE_ID}/diag"
TOPIC_PAGE              = f"{DEVICE_ID}/page"
TOPIC_ORIENTATION       = f"{DEVICE_ID}/orientation"

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
sun_below_horizon = False
consumption_power = 0.0
weather_condition = "clear"
weather_temp      = None

_notify_queue    = []
_notify_active   = None
_notify_start_ms = 0
_notify_end_ms   = 0
_ota_pending     = None

LAYOUT_PATH = "/settings/layout.json"
SCREENS_PATH = "/settings/screens.json"


def _valid_layout(d):
    return isinstance(d, dict) and d.get("widgets") is not None


def _load_screens():
    """Return (screens, dwell_ms, transition): a screen set from /screens.json, a single
    /layout.json, or the model default."""
    try:
        with open(SCREENS_PATH) as f:
            data = json.load(f)
        screens = [s for s in data.get("screens", []) if _valid_layout(s)]
        if screens:
            return screens, int(data.get("dwell", 0)) * 1000, data.get("transition", "none")
    except (OSError, ValueError):
        pass
    try:
        with open(LAYOUT_PATH) as f:
            data = json.load(f)
        if _valid_layout(data):
            return [data], 0, "none"
    except (OSError, ValueError):
        pass
    return [layouts.default_layout(MODEL)], 0, "none"


_screens, _screen_dwell_ms, _screen_transition = _load_screens()


_screen_idx = 0
_screen_pinned = False
_screen_switch_ms = 0
_fade_left = 0
FADE_FRAMES = 12
_wdt = None
WDT_TIMEOUT_MS = 8000


def _advance_screen():
    """Advance to the next screen when its dwell elapses (multi-screen, not pinned)."""
    global _screen_idx, _screen_switch_ms, _fade_left
    if _screen_pinned or _screen_dwell_ms <= 0 or len(_screens) <= 1:
        return
    now = time.ticks_ms()
    if _screen_switch_ms == 0 or time.ticks_diff(now, _screen_switch_ms) >= _screen_dwell_ms:
        if _screen_switch_ms:
            _screen_idx = (_screen_idx + 1) % len(_screens)
            if _screen_transition == "fade":
                _fade_left = FADE_FRAMES
            _publish_page()  # reflect the rotation to HA as it changes
        _screen_switch_ms = now

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
            _pub(TOPIC_STATE, json.dumps({
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
    """Sync the RTC via NTP (retry a few times); apply a BST offset. Returns success."""
    global _time_synced, _last_ntp_ms
    ntptime.host = NTP_HOST or "pool.ntp.org"
    for _ in range(3):
        try:
            ntptime.settime()
            t  = time.time()
            tm = time.localtime(t)
            t += 3600 if is_bst(tm[0], tm[1], tm[2]) else 0
            tm = time.localtime(t)
            machine.RTC().datetime((tm[0], tm[1], tm[2], 0, tm[3], tm[4], tm[5], 0))
            _time_synced = True
            _last_ntp_ms = time.ticks_ms()
            print("Time synced")
            return True
        except Exception:
            await asyncio.sleep(2)
    print("Time sync failed")
    return False


# --- OTA ---

def _draw_ota_progress(frac, phase_ms):
    """Boustrophedon progress fill: columns fill in 2px pairs, snaking up then down;
    the frontier pair pulses slowly to show activity."""
    if frac < 0:
        frac = 0
    elif frac > 1:
        frac = 1
    ppc = height // 2
    if ppc < 1:
        return
    total  = width * ppc
    filled = int(frac * total)
    graphics.set_pen(BLACK)
    graphics.clear()
    graphics.set_pen(ENERGY_CYAN)
    for p in range(filled):
        c = p // ppc
        k = p % ppc
        if c % 2 == 0:
            ya = height - 1 - 2 * k
            yb = ya - 1
        else:
            ya = 2 * k
            yb = ya + 1
        graphics.pixel(c, ya)
        graphics.pixel(c, yb)
    if filled < total:
        ph = (phase_ms % 1400) / 700
        if ph > 1:
            ph = 2 - ph
        lvl = int(30 + 176 * ph)
        graphics.set_pen(graphics.create_pen(0, lvl, lvl))
        c = filled // ppc
        k = filled % ppc
        if c % 2 == 0:
            ya = height - 1 - 2 * k
            yb = ya - 1
        else:
            ya = 2 * k
            yb = ya + 1
        graphics.pixel(c, ya)
        graphics.pixel(c, yb)
    unicorn.update(graphics)


# Time-driven progress sweep: ~_OTA_PER_COL_MS per column, clamped to [MIN, MAX] total so the
# fill is a smooth snake (not tied to jumpy per-file progress) and wide panels don't crawl.
_OTA_PER_COL_MS = 140
_OTA_ANIM_MIN_MS = 1800
_OTA_ANIM_MAX_MS = 3500


def _ota_anim_ms():
    """Total progress-sweep duration for this display width, capped for wide panels."""
    return min(_OTA_ANIM_MAX_MS, max(_OTA_ANIM_MIN_MS, width * _OTA_PER_COL_MS))


def _ota_sweep_frac(t0, anim_ms, cap=0.97):
    """Smooth time-driven fill fraction, held below full until the downloads finish."""
    return min(cap, time.ticks_diff(time.ticks_ms(), t0) / anim_ms)


def _ota_needs_reboot(paths):
    """True if any written path is the engine or an update to an already-loaded module.

    New content (widget/overlay/font/json not yet imported) hot-loads without a reboot;
    engine files and updates to live modules can't be hot-swapped, so they reboot.
    """
    import sys  # noqa: PLC0415
    for p in paths:
        base = p.rsplit("/", 1)[-1]
        if base.startswith("monospace_") and base.endswith(".py"):
            continue  # digit-font unit -> hot via drawing.reload_fonts()
        if p.startswith("/engine/") or p in ("/main.py", "/boot.py"):
            return True
        if base.startswith("widget_"):
            if base[7:].rsplit(".", 1)[0] in widgets.WIDGET_REGISTRY:
                return True
        elif base.startswith("overlay_") and base.endswith(".py"):
            if base[8:-3] in widgets.OVERLAY_REGISTRY:
                return True
        elif base.endswith(".py") and base[:-3] in sys.modules:
            return True  # a font/module already imported into the running engine
    return False


def _ota_normalize(payload):
    """Yield (url, path) from either the compact {base, files:[[name,path]]} form or the
    legacy {files:[{url,path}]} form."""
    base = payload.get("base")
    norm = []
    for item in payload.get("files", []):
        if base is not None:
            try:
                name, path = item
            except (ValueError, TypeError):
                continue
            url = base + name
        else:
            url  = item.get("url", "")
            path = item.get("path", "")
        if url and path:
            norm.append((url, path))
    return norm


def _run_ota(payload):
    global _ota_pending
    _ota_pending = None  # one-shot: don't retry-loop on failure, report it instead
    import urequests  # noqa: PLC0415
    norm      = _ota_normalize(payload)
    total     = len(norm)
    succeeded = 0
    written   = []
    failed    = []
    last_draw = 0
    t0 = time.ticks_ms()
    anim_ms = _ota_anim_ms()
    for i, (url, path) in enumerate(norm):
        if _wdt is not None:
            _wdt.feed()
        _draw_ota_progress(_ota_sweep_frac(t0, anim_ms), time.ticks_ms())
        parent = path.rsplit("/", 1)[0]
        if parent:
            try:
                uos.mkdir(parent)
            except OSError:
                pass
        tmp = path + ".tmp"
        try:
            r = urequests.get(url, timeout=5)  # keep < WDT_TIMEOUT_MS
            if r.status_code == 200:
                sock = r.raw
                with open(tmp, "wb") as f:
                    while True:
                        chunk = sock.read(512)
                        if not chunk:
                            break
                        f.write(chunk)
                        if _wdt is not None:
                            _wdt.feed()
                        now = time.ticks_ms()
                        if time.ticks_diff(now, last_draw) >= 50:
                            last_draw = now
                            _draw_ota_progress(_ota_sweep_frac(t0, anim_ms), now)
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
                    try:
                        uos.remove(path + ".bak")
                    except OSError:
                        pass
                    try:
                        uos.rename(path, path + ".bak")  # keep old for rollback
                    except OSError:
                        pass
                    uos.rename(tmp, path)
                    written.append(path)
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
    while True:
        elapsed = time.ticks_diff(time.ticks_ms(), t0)
        if elapsed >= anim_ms:
            break
        if _wdt is not None:
            _wdt.feed()
        _draw_ota_progress(elapsed / anim_ms, time.ticks_ms())
        time.sleep_ms(33)
    _draw_ota_progress(1.0, time.ticks_ms())
    failed = [p for (_u, p) in norm if p not in written]
    try:
        _pub(
            f"{DEVICE_ID}/ota/result",
            json.dumps({"ok": not failed, "succeeded": succeeded, "total": total, "failed": failed}),
            retain=True)
    except Exception:
        pass
    if written:
        if _ota_needs_reboot(written):
            try:
                with open("/ota_pending", "w") as f:
                    json.dump(written, f)
            except OSError:
                pass
            time.sleep(1)
            machine.reset()
        else:
            # New content only — register it live and tell HA, no reboot.
            try:
                if any(p.rsplit("/", 1)[-1].startswith("monospace_") for p in written):
                    drawing.reload_fonts()
                widgets.reload()
            except Exception as e:
                print("hot-load failed:", e)
            _pub(TOPIC_FW_MANIFEST, json.dumps(_fw_manifest()), retain=True)


def _ota_commit():
    """Healthy boot: drop the OTA .bak backups and clear the boot-attempt counter."""
    try:
        with open("/ota_pending") as f:
            pending = json.load(f)
    except (OSError, ValueError):
        return
    for p in pending:
        try:
            uos.remove(p + ".bak")
        except OSError:
            pass
    for f in ("/ota_pending", "/boot_attempts"):
        try:
            uos.remove(f)
        except OSError:
            pass


def _file_hash(path):
    h = uhashlib.sha256()
    with open(path, "rb") as f:
        while True:
            chunk = f.read(512)
            if not chunk:
                break
            h.update(chunk)
    return ubinascii.hexlify(h.digest()).decode()[:16]


_MANIFEST_DIRS = ("/", "/engine", "/engine/animations", "/widgets", "/assets/fonts", "/icons")


def _cpu_temp():
    """Pico internal temperature sensor in °C (None if unavailable)."""
    try:
        v = machine.ADC(4).read_u16() * 3.3 / 65535
        return round(27 - (v - 0.706) / 0.001721, 1)
    except Exception:
        return None


_last_page = None  # last published page JSON; skip re-publishing an unchanged page


def _publish_page():
    """Publish the rendered layout (retained) when it changes, so HA mirrors it (camera)."""
    global _last_page
    try:
        payload = json.dumps(_screens[_screen_idx]) if _screens else "{}"
        if payload == _last_page:
            return
        _last_page = payload
        _pub(TOPIC_PAGE, payload, retain=True)
    except Exception as e:
        print("page publish failed:", e)


def _diag_payload():
    """Full device state HA mirrors: current page, health, identity/config, WiFi, rotation."""
    page = _screens[_screen_idx].get("name", str(_screen_idx)) if _screens else ""
    wlan = network.WLAN(network.STA_IF)
    try:
        ip = wlan.ifconfig()[0]
    except Exception:
        ip = ""
    try:
        rssi = wlan.status("rssi")
    except Exception:
        rssi = None
    return {
        "page": page,
        "free_mem": gc.mem_free(),
        "uptime_s": time.ticks_ms() // 1000,
        "engine_version": ENGINE_VERSION,
        "model": MODEL,
        "orientation": ORIENTATION,
        "brightness": int(brightness * 100),
        "awake": system_state == "AWAKE",
        "ip": ip,
        "rssi": rssi,
        "reset_cause": _RESET_CAUSE,
        "cpu_temp": _cpu_temp(),
        "screen_index": _screen_idx,
        "screen_count": len(_screens) if _screens else 0,
        "dwell_s": (_screen_dwell_ms // 1000) if _screen_dwell_ms else 0,
    }


def _fw_manifest():
    """Engine version + short per-file hash of every engine/content unit, keyed by basename."""
    files = {}
    for d in _MANIFEST_DIRS:
        try:
            names = uos.listdir(d)
        except OSError:
            continue
        for name in names:
            if (name.endswith(".py") or name.endswith(".json")) and name != "secrets.py":
                try:
                    files[name] = _file_hash(("" if d == "/" else d) + "/" + name)
                except Exception:
                    pass
    return {"engine_version": ENGINE_VERSION, "files": files}


# --- MQTT ---

def on_message(topic, message):
    """Handle incoming MQTT messages and update global display state."""
    global msg, system_state, icon_type, brightness
    global solar_power, battery_soc, battery_charging
    global sun_below_horizon, weather_condition, weather_temp, consumption_power
    global _ota_pending, _notify_active
    global _screens, _screen_dwell_ms, _screen_transition, _screen_idx, _screen_pinned, _screen_switch_ms
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
            name, action = "", ""
            try:
                data   = json.loads(message)
                action = data.get("action", "")
                name   = data.get("name", "")
                if action == "install" and name:
                    icons.install(name, data)
                elif action == "remove" and name:
                    icons.remove(name)
                # Republish the manifest so HA sees the /icons change immediately (not just on reconnect).
                _pub(TOPIC_FW_MANIFEST, json.dumps(_fw_manifest()), retain=True)
                _pub(TOPIC_ICONS_RESULT, json.dumps({"name": name, "action": action, "ok": True}))
            except Exception as e:
                print("Icon cmd failed:", e)
                _pub(TOPIC_ICONS_RESULT, json.dumps({"name": name, "action": action, "ok": False, "error": str(e)}))
            return

        if topic_str == TOPIC_TIME:
            try:
                global _time_synced, _last_ntp_ms
                t = json.loads(message)
                machine.RTC().datetime((t["y"], t["mo"], t["d"], 0, t["h"], t["mi"], t["s"], 0))
                _time_synced = True
                _last_ntp_ms = time.ticks_ms()
            except Exception as e:
                print("Time cmd failed:", e)
            return

        if topic_str == TOPIC_LAYOUT:
            try:
                data = json.loads(message)
                if _valid_layout(data):
                    with open(LAYOUT_PATH, "w") as f:
                        json.dump(data, f)
                    _screens, _screen_dwell_ms, _screen_idx, _screen_pinned = [data], 0, 0, False
            except Exception as e:
                print("Layout cmd failed:", e)
            return

        if topic_str == TOPIC_SCREENS:
            try:
                data = json.loads(message)
                screens = [s for s in data.get("screens", []) if _valid_layout(s)]
                if screens:
                    with open(SCREENS_PATH, "w") as f:
                        json.dump(data, f)
                    _screens = screens
                    _screen_dwell_ms = int(data.get("dwell", 0)) * 1000
                    _screen_transition = data.get("transition", "none")
                    _screen_idx, _screen_pinned = 0, False
            except Exception as e:
                print("Screens cmd failed:", e)
            return

        if topic_str == TOPIC_SCREEN_SHOW:
            try:
                data = json.loads(message)
                if data.get("clear"):
                    _screen_pinned = False
                else:
                    idx = data.get("index")
                    if idx is None and "name" in data:
                        for i, s in enumerate(_screens):
                            if s.get("name") == data["name"]:
                                idx = i
                                break
                    if idx is not None and 0 <= int(idx) < len(_screens):
                        _screen_idx, _screen_pinned = int(idx), True
            except Exception as e:
                print("Screen show cmd failed:", e)
            return

        if topic_str == TOPIC_OTA:
            try:
                _ota_pending = json.loads(message)
            except Exception:
                pass
            return

        if topic_str == TOPIC_FW_REMOVE:
            removed = []
            try:
                data = json.loads(message)
                for path in data.get("files", []):
                    try:
                        uos.remove(path)
                        removed.append(path)
                    except Exception:
                        pass
            except Exception:
                pass
            hot = bool(removed)
            for path in removed:
                base = path.rsplit("/", 1)[-1]
                if base.startswith("widget_"):
                    widgets.WIDGET_REGISTRY.pop(base[7:].rsplit(".", 1)[0], None)
                elif base.startswith("overlay_") and base.endswith(".py"):
                    widgets.OVERLAY_REGISTRY.pop(base[8:-3], None)
                else:
                    hot = False  # font/engine file -> reboot to be safe
            if hot:
                _pub(TOPIC_FW_MANIFEST, json.dumps(_fw_manifest()), retain=True)
                return
            time.sleep(1)
            machine.reset()
            return

        if topic_str == TOPIC_ORIENTATION:
            try:
                ang = int(message.decode().strip())
            except Exception:
                return
            if ang in (0, 90, 180, 270) and ang != ORIENTATION:
                try:
                    with open("orientation", "w") as f:
                        f.write(str(ang))
                except OSError:
                    return
                time.sleep(1)
                machine.reset()
            return

        data = json.loads(message)
        state_changed = False

        if topic_str == TOPIC_WEATHER:
            try:
                code = data.get("condition", 800)
                try:
                    new_condition = map_owm_code(int(code))   # numeric OWM code
                except (ValueError, TypeError):
                    new_condition = str(code)                 # already a condition string from HA
                if new_condition != weather_condition:
                    weather_condition = new_condition
                    init_weather_drops(weather_condition)
                weather_temp = data.get("temp")
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


_MQTT_MAX_PAYLOAD = 4096  # umqtt short-writes larger publishes over lwIP -> truncated/malformed packet


def _pub(topic, payload, retain=False, qos=0):
    """Publish, skipping (with a warning) any payload too large to send intact over MQTT."""
    if len(payload) > _MQTT_MAX_PAYLOAD:
        print("MQTT publish skipped (payload too large):", topic, len(payload))
        return
    mqtt_client.publish(topic, payload, retain=retain, qos=qos)


async def mqtt_task():
    """Manage MQTT connection, HA discovery publishing, and message polling."""
    global mqtt_client, _wdt
    mqtt_client = MQTTClient(
        DEVICE_ID, MQTT_BROKER,
        port=MQTT_PORT, user=MQTT_USER, password=MQTT_PASSWORD, keepalive=60,
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
            _pub(TOPIC_STATUS, b"online", retain=True)
            # Announce to the Pimoroni Unicorn integration for auto-discovery (no manual device id).
            _pub(
                f"pimoroni_unicorn/discovery/{DEVICE_ID}",
                json.dumps({"device_id": DEVICE_ID, "model": MODEL, "name": DEVICE_ID}),
                retain=True,
            )
            await asyncio.sleep(0.5)

            _pub(
                f"{DISCOVERY_PREFIX}/binary_sensor/{DEVICE_ID}/status/config",
                json.dumps({
                    "name": "Connectivity", "state_topic": TOPIC_STATUS,
                    "device_class": "connectivity",
                    "payload_on": "online", "payload_off": "offline",
                    "unique_id": f"{DEVICE_ID}_connectivity", "device": DEVICE_INFO,
                }),
                retain=True,
            )
            _pub(
                f"{DISCOVERY_PREFIX}/light/{DEVICE_ID}/display/config",
                json.dumps({
                    "name": "Display", "unique_id": f"{DEVICE_ID}_light",
                    "schema": "json",
                    "command_topic": TOPIC_COMMAND, "state_topic": TOPIC_STATE,
                    "availability_topic": TOPIC_STATUS,
                    "payload_available": "online", "payload_not_available": "offline",
                    "brightness": True, "brightness_scale": 100, "device": DEVICE_INFO,
                }),
                retain=True,
            )
            # Energy mode + battery animation are now per-widget config; clear any
            # select/switch discovery a previous firmware advertised so the entities vanish.
            _pub(f"{DISCOVERY_PREFIX}/switch/{DEVICE_ID}/animation/config", b"", retain=True)
            _pub(f"{DISCOVERY_PREFIX}/select/{DEVICE_ID}/energy_mode/config", b"", retain=True)
            # Clear the oversized retained layout/capabilities a prior build left on the broker.
            _pub(f"{DEVICE_ID}/layout/capabilities", b"", retain=True)

            mqtt_client.subscribe(f"{DEVICE_ID}/display/#".encode())
            for topic in (
                TOPIC_COMMAND, TOPIC_SOLAR, TOPIC_WEATHER, TOPIC_NOTIFY,
                TOPIC_NOTIFY_DISMISS, TOPIC_ICONS_CMD, TOPIC_LAYOUT, TOPIC_OTA,
                TOPIC_SCREENS, TOPIC_SCREEN_SHOW, TOPIC_FW_REMOVE, TOPIC_TIME,
                TOPIC_ORIENTATION,
            ):
                mqtt_client.subscribe(topic.encode())

            _pub(
                f"{DEVICE_ID}/notify/capabilities", json.dumps(NOTIFY_CAPABILITIES), retain=True
            )
            # NB: the editor palette comes from the HA backend (render_service.layout_capabilities),
            # not the device — so we no longer publish the ~6KB layout/capabilities. umqtt short-writes
            # a publish that large over lwIP, sending a truncated (malformed) packet the broker rejects.
            _pub(TOPIC_FW_MANIFEST, json.dumps(_fw_manifest()), retain=True)
            _ota_commit()  # booted healthy — drop OTA backups/rollback counter
            if _wdt is None:  # arm watchdog once up; main loop + OTA feed it
                _wdt = machine.WDT(timeout=WDT_TIMEOUT_MS)
            send_ha_state()
            _pub(TOPIC_DIAG, json.dumps(_diag_payload()), retain=True)  # immediate state, not after 60s
            _publish_page()
            print("MQTT Connected & Discovery Published")

            last_ping = time.ticks_ms()
            last_diag = last_ping
            while True:
                mqtt_client.check_msg()
                now = time.ticks_ms()
                # Keep the connection alive: ping at keepalive/2 (60s) since check_msg never
                # sends PINGREQ and the 60s diag publish alone races the broker's grace window.
                if time.ticks_diff(now, last_ping) >= 30000:
                    mqtt_client.ping()
                    last_ping = now
                if time.ticks_diff(now, last_diag) >= 60000:
                    last_diag = now
                    _pub(TOPIC_STATUS, b"online", retain=True)
                    _pub(TOPIC_DIAG, json.dumps(_diag_payload()), retain=True)
                    _publish_page()  # catches layout/screen changes without per-handler hooks
                    # Re-sync NTP if never synced, or hourly — time isn't battery-backed.
                    if not _time_synced or time.ticks_diff(time.ticks_ms(), _last_ntp_ms) > 3600000:
                        await sync_time()
                await asyncio.sleep(0.1)

        except Exception as e:
            print(f"MQTT error: {e}. Retrying in 5s..")
            await asyncio.sleep(5)


async def main_loop():
    """Handle button presses, draw each frame, and sleep; runs as the main display loop."""
    global brightness, system_state, msg, icon_type, _fade_left
    global _notify_active, _notify_start_ms, _notify_end_ms, _ota_pending

    last_button_time = 0

    while True:
        if _wdt is not None:
            _wdt.feed()
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

            # Normal display — render the active layout (widgets + overlays)
            state = {
                "time": t, "solar": solar_power, "consumption": consumption_power,
                "soc": battery_soc, "charging": battery_charging,
                "sun_below": sun_below_horizon,
                "weather": weather_condition, "temp": weather_temp,
                "display_sensors": display_sensors,
                "elapsed_ms": current_time,
            }
            _advance_screen()
            if _fade_left > 0:
                unicorn.set_brightness(brightness * (1.0 - _fade_left / FADE_FRAMES))
                _fade_left -= 1
            else:
                unicorn.set_brightness(brightness)
            widgets.render_layout(surface, _screens[_screen_idx], state)

            if icon_type != "none":
                draw_icon(icon_type, 2, 2)
        else:
            graphics.set_pen(BLACK)
            graphics.clear()
            unicorn.set_brightness(0)

        unicorn.update(graphics)
        await asyncio.sleep(0.01)


async def connect_wifi():
    """Connect to WiFi and sync the RTC via NTP; recover a wedged CYW43 chip by re-init/reset."""
    wlan = network.WLAN(network.STA_IF)
    for attempt in range(4):
        try:
            wlan.active(False)
            await asyncio.sleep(0.3)
            wlan.active(True)
            break
        except OSError as e:
            print("WiFi chip init failed (attempt %d): %s" % (attempt + 1, e))
            await asyncio.sleep(1)
    else:
        print("WiFi chip will not initialise; resetting to recover")
        time.sleep(1)
        machine.reset()
    wlan.connect(SSID, PASSWORD)
    print("Connecting to WiFi...")
    while not wlan.isconnected():
        await asyncio.sleep(0.5)
    print(f"Connected! IP: {wlan.ifconfig()[0]}")
    await asyncio.sleep(0.5)
    await sync_time()


async def _show_unconfigured():
    """secrets.py not filled in — show an alert instead of hanging on a blank WiFi connect."""
    print("Secrets not configured — copy secrets.example.py to secrets.py and fill SSID/MQTT.")
    while True:
        graphics.set_pen(graphics.create_pen(60, 0, 0))
        graphics.clear()
        icons.draw_icon("alert", (width - 8) // 2, max(0, (height - 8) // 2))
        unicorn.update(graphics)
        await asyncio.sleep(1)


async def main():
    """Entry point: connect WiFi, then run MQTT and display tasks concurrently."""
    if not SSID or not MQTT_SERVER:
        await _show_unconfigured()
        return
    await connect_wifi()
    await asyncio.gather(mqtt_task(), main_loop())


try:
    asyncio.run(main())
except KeyboardInterrupt:
    print("Stopped")
