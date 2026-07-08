"""Constants for the Pimoroni Unicorn integration."""

from typing import Any

from homeassistant.config_entries import ConfigEntry

# Per-entry runtime state lives on entry.runtime_data as this dict.
type PUConfigEntry = ConfigEntry[dict[str, Any]]

DOMAIN = "pimoroni_unicorn"
CONF_DEVICE_ID = "device_id"
CONF_MODEL = "model"

UNICORN_MODELS = [
    "Galactic Unicorn",
    "Cosmic Unicorn",
    "Stellar Unicorn",
    "Unicorn Pack",
    "Unicorn Mini Pack",
    "Custom",
]

UNICORN_MODEL_KEYS = {
    "Galactic Unicorn":  "galactic",
    "Cosmic Unicorn":    "cosmic",
    "Stellar Unicorn":   "stellar",
    "Unicorn Pack":      "unicorn_pack",
    "Unicorn Mini Pack": "unicorn_pack",
    "Custom":            "custom",
}

CONF_SOLAR_ENTITY               = "solar_entity"
CONF_CONSUMPTION_ENTITY         = "consumption_entity"
CONF_BATTERY_SOC_ENTITY         = "battery_soc_entity"
CONF_BATTERY_CHARGING_ENTITY    = "battery_charging_entity"
CONF_SUN_ENTITY                 = "sun_entity"
CONF_WEATHER_CODE_ENTITY        = "weather_code_entity"
CONF_EXTRA_SENSORS              = "extra_sensors"
CONF_SHOW_PANEL                 = "show_panel"
CONF_ORIENTATION                = "orientation"

# Display mounting orientation (degrees). 90/270 turn a non-square panel vertical.
ORIENTATIONS = ["0", "90", "180", "270"]

# key -> (bundle basename, device path). Device tree is foldered: root holds the
# auto-run boot.py + main.py stub; /engine the runtime; /widgets + /assets/fonts content.
OTA_SOURCE_FILES = {
    "main":                ("main.py",                 "/main.py"),
    "boot":                ("boot.py",                 "/boot.py"),
    "app":                 ("app.py",                  "/engine/app.py"),
    "hardware":            ("hardware.py",             "/engine/hardware.py"),
    "version":             ("version.py",              "/engine/version.py"),
    "drawing":             ("drawing.py",              "/engine/drawing.py"),
    "widgets":             ("widgets.py",              "/engine/widgets.py"),
    "declarative":         ("declarative.py",          "/engine/declarative.py"),
    "overlay_weather":     ("overlay_weather.py",      "/engine/overlay_weather.py"),
    "layouts":             ("layouts.py",              "/engine/layouts.py"),
    "notify_animations":   ("notify_animations.py",    "/engine/notify_animations.py"),
    "icons":               ("icons.py",                "/engine/icons.py"),
    "sounds":              ("sounds.py",               "/engine/sounds.py"),
    "weather_fx":          ("weather_fx.py",           "/engine/weather_fx.py"),
    "weather_icons":       ("weather_icons.py",        "/engine/weather_icons.py"),
    "bitfonts":            ("bitfonts.py",             "/engine/bitfonts.py"),
    "widget_clock":        ("widget_clock.py",         "/widgets/widget_clock.py"),
    "widget_calendar":     ("widget_calendar.py",      "/widgets/widget_calendar.py"),
    "widget_weekdays":     ("widget_weekdays.py",      "/widgets/widget_weekdays.py"),
    "widget_energy":       ("widget_energy.py",        "/widgets/widget_energy.py"),
    "widget_sun_moon":     ("widget_sun_moon.py",      "/widgets/widget_sun_moon.py"),
    "widget_sensor":       ("widget_sensor.py",        "/widgets/widget_sensor.py"),
    "widget_icon":         ("widget_icon.py",          "/widgets/widget_icon.py"),
    "widget_text":         ("widget_text.py",          "/widgets/widget_text.py"),
    "widget_value":        ("widget_value.py",         "/widgets/widget_value.py"),
    "widget_date":         ("widget_date.py",          "/widgets/widget_date.py"),
    "widget_temperature":  ("widget_temperature.py",   "/widgets/widget_temperature.py"),
    "widget_weather":      ("widget_weather.py",       "/widgets/widget_weather.py"),
    "widget_bar":          ("widget_bar.py",           "/widgets/widget_bar.py"),
    "monospace_digits":    ("monospace_digits.py",     "/assets/fonts/monospace_digits.py"),
    "monospace_digits_serif":("monospace_digits_serif.py", "/assets/fonts/monospace_digits_serif.py"),
    "monospace_big_digits":("monospace_big_digits.py", "/assets/fonts/monospace_big_digits.py"),
    "monospace_blocky":    ("monospace_blocky.py",     "/assets/fonts/monospace_blocky.py"),
    "monospace_blocky_serif":("monospace_blocky_serif.py", "/assets/fonts/monospace_blocky_serif.py"),
    "monospace_tall":      ("monospace_tall.py",       "/assets/fonts/monospace_tall.py"),
    "monospace_tall_bold": ("monospace_tall_bold.py",  "/assets/fonts/monospace_tall_bold.py"),
    "monospace_large":     ("monospace_large.py",      "/assets/fonts/monospace_large.py"),
    "monospace_huge":      ("monospace_huge.py",       "/assets/fonts/monospace_huge.py"),
    "monospace_jumbo":     ("monospace_jumbo.py",      "/assets/fonts/monospace_jumbo.py"),
    "monospace_humanist":  ("monospace_humanist.py",   "/assets/fonts/monospace_humanist.py"),
}

# Engine modules every device must have (push set when syncing a unit).
# Excludes secrets.py (device-private) and __init__.py.
ENGINE_FILE_KEYS = list(OTA_SOURCE_FILES)

# Bundled engine version (the update entity diffs the device's reported
# engine_version against this). Keep in sync with firmware/engine/version.py.
# Versioned independently of the integration manifest version.
ENGINE_VERSION = "1.7.0"

# Engine builds below this need a one-time USB reflash (the foldered file layout
# landed in 1.1.0); OTA cannot migrate a flat device, so the update entity refuses
# to OTA across this boundary and tells the user to reflash.
ENGINE_REFLASH_BELOW = "1.1.0"

# Seconds the update entity waits for the device to fetch, flash and re-report the new
# engine_version after an OTA push, before giving up. Covers download + reboot.
OTA_CONFIRM_TIMEOUT = 180

NOTIFY_ANIMATIONS = [
    "rainbow",
    "fire",
    "matrix",
    "scanner",
    "comet",
    "snow",
    "confetti",
    "flash",
    "pulse",
    "bounce",
    "supercomputer",
    "retroprompt",
]
NOTIFY_SOUNDS = ["beep", "chime", "alert"]

NOTIFY_STATIC_ICONS: list[str] = []

NOTIFY_ENTRANCES = ["none", "swipe_left", "swipe_right", "slide_left", "slide_right",
                    "center_out", "fade"]

# v2 notification payload. NOTIFY_EFFECTS is the renamed concept for animations.
NOTIFY_EFFECTS = NOTIFY_ANIMATIONS
NOTIFY_PAYLOAD_VERSION = 2
