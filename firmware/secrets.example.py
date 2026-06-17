# Copy this file to secrets.py, fill in your values, then flash it to the Pico.
SSID          = ""
PASSWORD      = ""
MQTT_SERVER   = ""
MQTT_PORT     = 1883
MQTT_USER     = ""
MQTT_PASSWORD = ""
DEVICE_ID     = "pimoroni_unicorn_1"
NTP_HOST      = ""            # defaults to pool.ntp.org if blank (or set your router IP)
MODEL         = "galactic"    # galactic | cosmic | stellar

# Optional: pre-set HA entity IDs so the integration auto-fills on first setup.
HA_SOLAR_ENTITY            = ""
HA_CONSUMPTION_ENTITY      = ""
HA_BATTERY_SOC_ENTITY      = ""
HA_BATTERY_CHARGING_ENTITY = ""
HA_SUN_ENTITY              = "sun.sun"
HA_WEATHER_CODE_ENTITY     = ""
