"""Config flow for Pimoroni Unicorn."""

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
)

from .const import (
    CONF_BATTERY_CHARGING_ENTITY,
    CONF_BATTERY_SOC_ENTITY,
    CONF_CONSUMPTION_ENTITY,
    CONF_DEVICE_ID,
    CONF_EXTRA_SENSORS,
    CONF_MODEL,
    CONF_SOLAR_ENTITY,
    CONF_SUN_ENTITY,
    CONF_WEATHER_CODE_ENTITY,
    DOMAIN,
    UNICORN_MODELS,
)

DATA_SCHEMA = vol.Schema({
    vol.Required(CONF_DEVICE_ID, default="pimoroni_unicorn_studio"): str,
    vol.Required(CONF_MODEL,     default=UNICORN_MODELS[0]):          vol.In(UNICORN_MODELS),
})

_MODEL_SELECTOR = SelectSelector(
    SelectSelectorConfig(options=UNICORN_MODELS, mode=SelectSelectorMode.DROPDOWN)
)


def _options_schema(current: dict) -> vol.Schema:
    def _d(key, default=""):
        return current.get(key) or default

    return vol.Schema({
        vol.Required(CONF_DEVICE_ID,               default=_d(CONF_DEVICE_ID)):               str,
        vol.Required(CONF_MODEL,                   default=_d(CONF_MODEL, UNICORN_MODELS[0])): _MODEL_SELECTOR,
        vol.Optional(CONF_SOLAR_ENTITY,            default=_d(CONF_SOLAR_ENTITY)):            EntitySelector(EntitySelectorConfig(device_class="power")),
        vol.Optional(CONF_CONSUMPTION_ENTITY,      default=_d(CONF_CONSUMPTION_ENTITY)):      EntitySelector(EntitySelectorConfig(device_class="power")),
        vol.Optional(CONF_BATTERY_SOC_ENTITY,      default=_d(CONF_BATTERY_SOC_ENTITY)):      EntitySelector(EntitySelectorConfig(device_class="battery")),
        vol.Optional(CONF_BATTERY_CHARGING_ENTITY, default=_d(CONF_BATTERY_CHARGING_ENTITY)): EntitySelector(EntitySelectorConfig(domain="binary_sensor", device_class="battery_charging")),
        vol.Optional(CONF_SUN_ENTITY,              default=_d(CONF_SUN_ENTITY, "sun.sun")):   EntitySelector(EntitySelectorConfig(domain="sun")),
        vol.Optional(CONF_WEATHER_CODE_ENTITY,     default=_d(CONF_WEATHER_CODE_ENTITY)):     EntitySelector(EntitySelectorConfig(domain="sensor")),
        vol.Optional(CONF_EXTRA_SENSORS,           default=_d(CONF_EXTRA_SENSORS)):           TextSelector(TextSelectorConfig(multiline=True)),
    })


class PimoroniUnicornConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Pimoroni Unicorn."""

    VERSION = 1

    async def async_step_user(self, user_input: dict | None = None):
        """Handle the initial step."""
        errors = {}

        if user_input is not None:
            await self.async_set_unique_id(user_input[CONF_DEVICE_ID])
            self._abort_if_unique_id_configured()
            return self.async_create_entry(
                title=user_input[CONF_DEVICE_ID],
                data=user_input,
            )

        return self.async_show_form(
            step_id="user",
            data_schema=DATA_SCHEMA,
            errors=errors,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        """Return options flow handler."""
        return PimoroniUnicornOptionsFlow(config_entry)


class PimoroniUnicornOptionsFlow(config_entries.OptionsFlow):
    """Handle options for Pimoroni Unicorn."""

    def __init__(self, config_entry) -> None:
        """Initialise options flow."""
        self._config_entry = config_entry

    async def async_step_init(self, user_input=None):
        """Manage options."""
        if user_input is not None:
            return self.async_create_entry(title="", data=user_input)

        store      = self.hass.data.get(DOMAIN, {}).get(self._config_entry.entry_id, {})
        ha_config  = store.get("ha_config", {})
        current    = {**ha_config, **self._config_entry.data, **self._config_entry.options}

        return self.async_show_form(
            step_id="init",
            data_schema=_options_schema(current),
        )
