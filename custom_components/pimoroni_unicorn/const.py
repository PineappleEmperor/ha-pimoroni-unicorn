"""Constants for the Pimoroni Unicorn integration."""

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

OTA_SOURCE_FILES = {
    "main":                ("main.py",                 "/main.py"),
    "hardware":            ("hardware.py",             "/hardware.py"),
    "drawing":             ("drawing.py",              "/drawing.py"),
    "notify_animations":   ("notify_animations.py",    "/notify_animations.py"),
    "sounds":              ("sounds.py",               "/sounds.py"),
    "weather_fx":          ("weather_fx.py",           "/weather_fx.py"),
    "bitfonts":            ("bitfonts.py",             "/bitfonts.py"),
    "monospace_digits":    ("monospace_digits.py",     "/monospace_digits.py"),
    "monospace_big_digits":("monospace_big_digits.py", "/monospace_big_digits.py"),
}

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
