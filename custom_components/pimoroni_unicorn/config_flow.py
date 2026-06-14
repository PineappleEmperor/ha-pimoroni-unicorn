"""Config flow for Pimoroni Unicorn."""

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    NumberSelector,
    NumberSelectorConfig,
    NumberSelectorMode,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
)
from homeassistant.util import slugify

from . import lametric
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
    NOTIFY_STATIC_ICONS,
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


def _display_sensor_schema(current: dict) -> vol.Schema:
    def _d(key, default=""):
        return current.get(key) or default

    return vol.Schema({
        vol.Required("entity_id",  default=_d("entity_id")):           EntitySelector(EntitySelectorConfig()),
        vol.Optional("name",       default=_d("name")):                TextSelector(TextSelectorConfig()),
        vol.Optional("on_color",   default=_d("on_color",  "00FF00")):  TextSelector(TextSelectorConfig()),
        vol.Optional("off_color",  default=_d("off_color", "1A1A1A")):  TextSelector(TextSelectorConfig()),
        vol.Optional("x_pos",      default=current.get("x_pos", 37)):  NumberSelector(NumberSelectorConfig(min=0, max=64, step=1, mode=NumberSelectorMode.BOX)),
        vol.Optional("y_pos",      default=current.get("y_pos",  1)):  NumberSelector(NumberSelectorConfig(min=0, max=16, step=1, mode=NumberSelectorMode.BOX)),
        vol.Optional("spacing",    default=current.get("spacing",  4)): NumberSelector(NumberSelectorConfig(min=1, max=32, step=1, mode=NumberSelectorMode.BOX)),
    })


def _select_sensor_schema(sensors: dict) -> vol.Schema:
    return vol.Schema({
        vol.Required("sensor_id"): SelectSelector(SelectSelectorConfig(
            options=[{"value": s["id"], "label": s.get("name", s["id"])} for s in sensors.values()],
            mode=SelectSelectorMode.DROPDOWN,
        ))
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
        self._settings: dict = {}
        self._display_sensors: dict = {}
        self._edit_sensor_id: str | None = None
        self._pending_icon: dict | None = None
        self._initialized = False

    def _init_state(self) -> None:
        if self._initialized:
            return
        self._initialized = True
        store      = self.hass.data.get(DOMAIN, {}).get(self._config_entry.entry_id, {})
        ha_config  = store.get("ha_config", {})
        merged     = {**ha_config, **self._config_entry.data, **self._config_entry.options}
        sensors    = merged.pop(CONF_DISPLAY_SENSORS, [])
        self._display_sensors = {s["id"]: s for s in sensors}
        self._settings = merged

    async def async_step_init(self, user_input=None):
        """Show main options menu."""
        self._init_state()
        registry = await lametric.async_get_registry(self.hass)
        menu_options = ["settings", "add_display_sensor"]
        if self._display_sensors:
            menu_options += ["edit_display_sensor", "remove_display_sensor"]
        menu_options.append("add_icon")
        if registry:
            menu_options.append("remove_icon")
        menu_options.append("save")

        sensor_list = "\n".join(
            f"- {s.get('name', s['id'])} ({s['entity_id']})"
            for s in self._display_sensors.values()
        ) if self._display_sensors else "None configured"

        icon_list = "\n".join(
            f"- {name} (code {icon.get('code', '?')}, {len(icon.get('frames', []))} frame(s))"
            for name, icon in registry.items()
        ) if registry else "None installed"

        return self.async_show_menu(
            step_id="init",
            menu_options=menu_options,
            description_placeholders={"sensors": sensor_list, "icons": icon_list},
        )

    async def async_step_settings(self, user_input=None):
        """Handle general settings form."""
        if user_input is not None:
            self._settings.update(user_input)
            return await self.async_step_init()

        return self.async_show_form(
            step_id="settings",
            data_schema=_options_schema(self._settings),
        )

    async def async_step_add_display_sensor(self, user_input=None):
        """Handle adding a new display sensor."""
        if user_input is not None:
            entity_id = user_input["entity_id"]
            sensor_id = entity_id.replace(".", "_")
            self._display_sensors[sensor_id] = {
                "id":        sensor_id,
                "entity_id": entity_id,
                "name":      user_input.get("name") or entity_id.split(".")[-1],
                "on_color":  (user_input.get("on_color") or "00FF00").lstrip("#").upper(),
                "off_color": (user_input.get("off_color") or "1A1A1A").lstrip("#").upper(),
                "x_pos":     int(user_input.get("x_pos") or 37),
                "y_pos":     int(user_input.get("y_pos") or 1),
                "spacing":   int(user_input.get("spacing") or 4),
            }
            return await self.async_step_init()

        defaults: dict = {}
        if self._display_sensors:
            rightmost = max(self._display_sensors.values(), key=lambda s: s.get("x_pos", 37))
            defaults["x_pos"] = rightmost.get("x_pos", 37) + rightmost.get("spacing", 4)

        return self.async_show_form(
            step_id="add_display_sensor",
            data_schema=_display_sensor_schema(defaults),
        )

    async def async_step_edit_display_sensor(self, user_input=None):
        """Handle editing an existing display sensor (two-phase: select then edit)."""
        if self._edit_sensor_id is None:
            if user_input is not None and "sensor_id" in user_input:
                self._edit_sensor_id = user_input["sensor_id"]
                user_input = None
            else:
                return self.async_show_form(
                    step_id="edit_display_sensor",
                    data_schema=_select_sensor_schema(self._display_sensors),
                )

        if user_input is not None:
            sensor = self._display_sensors[self._edit_sensor_id]
            sensor.update({
                "entity_id": user_input["entity_id"],
                "name":      user_input.get("name") or user_input["entity_id"].split(".")[-1],
                "on_color":  (user_input.get("on_color") or "00FF00").lstrip("#").upper(),
                "off_color": (user_input.get("off_color") or "1A1A1A").lstrip("#").upper(),
                "x_pos":     int(user_input.get("x_pos") or 37),
                "y_pos":     int(user_input.get("y_pos") or 1),
                "spacing":   int(user_input.get("spacing") or 4),
            })
            self._edit_sensor_id = None
            return await self.async_step_init()

        current = self._display_sensors[self._edit_sensor_id]
        return self.async_show_form(
            step_id="edit_display_sensor",
            data_schema=_display_sensor_schema(current),
        )

    async def async_step_remove_display_sensor(self, user_input=None):
        """Handle removing a display sensor."""
        if user_input is not None:
            self._display_sensors.pop(user_input["sensor_id"], None)
            return await self.async_step_init()

        return self.async_show_form(
            step_id="remove_display_sensor",
            data_schema=_select_sensor_schema(self._display_sensors),
        )

    async def async_step_add_icon(self, user_input=None):
        """Fetch a LaMetric gallery icon by code."""
        errors = {}
        if user_input is not None:
            code = int(user_input["code"])
            icon = await lametric.async_fetch_icon(self.hass, code)
            if icon is None:
                errors["code"] = "icon_not_found"
            else:
                self._pending_icon = icon
                return await self.async_step_icon_preview()

        return self.async_show_form(
            step_id="add_icon",
            data_schema=vol.Schema({
                vol.Required("code"): NumberSelector(NumberSelectorConfig(
                    min=1, max=999999, step=1, mode=NumberSelectorMode.BOX
                )),
            }),
            errors=errors,
        )

    async def async_step_icon_preview(self, user_input=None):
        """Preview the fetched icon and name it to install."""
        pending = self._pending_icon
        if pending is None:
            return await self.async_step_add_icon()
        errors = {}
        code   = pending["code"]
        if user_input is not None:
            name = slugify(user_input.get("name") or f"lm_{code}")
            if name in NOTIFY_STATIC_ICONS:
                errors["name"] = "name_taken"
            else:
                await lametric.async_install_icon(self.hass, name, pending)
                self._pending_icon = None
                return await self.async_step_init()

        return self.async_show_form(
            step_id="icon_preview",
            data_schema=vol.Schema({
                vol.Optional("name", default=f"lm_{code}"): TextSelector(TextSelectorConfig()),
            }),
            errors=errors,
            description_placeholders={
                "code":   str(code),
                "frames": str(len(pending["frames"])),
                "url":    lametric.ICON_THUMB_URL.format(code=code),
            },
        )

    async def async_step_remove_icon(self, user_input=None):
        """Remove an installed icon from registry and devices."""
        registry = await lametric.async_get_registry(self.hass)
        if user_input is not None:
            await lametric.async_remove_icon(self.hass, user_input["icon_name"])
            return await self.async_step_init()

        return self.async_show_form(
            step_id="remove_icon",
            data_schema=vol.Schema({
                vol.Required("icon_name"): SelectSelector(SelectSelectorConfig(
                    options=sorted(registry), mode=SelectSelectorMode.DROPDOWN
                )),
            }),
        )

    async def async_step_save(self, user_input=None):
        """Save all options and close."""
        return self.async_create_entry(
            title="",
            data={**self._settings, CONF_DISPLAY_SENSORS: list(self._display_sensors.values())},
        )
