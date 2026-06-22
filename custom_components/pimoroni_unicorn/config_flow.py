"""Config flow for Pimoroni Unicorn."""

import json

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    BooleanSelector,
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
from homeassistant.helpers.service_info.mqtt import MqttServiceInfo
from homeassistant.util import slugify

from . import lametric, layout
from .const import (
    CONF_BATTERY_CHARGING_ENTITY,
    CONF_BATTERY_SOC_ENTITY,
    CONF_CONSUMPTION_ENTITY,
    CONF_DEVICE_ID,
    CONF_EXTRA_SENSORS,
    CONF_MODEL,
    CONF_ORIENTATION,
    CONF_SHOW_PANEL,
    CONF_SOLAR_ENTITY,
    CONF_SUN_ENTITY,
    CONF_WEATHER_CODE_ENTITY,
    DOMAIN,
    NOTIFY_STATIC_ICONS,
    UNICORN_MODEL_KEYS,
    UNICORN_MODELS,
)

_KEY_TO_LABEL = {key: label for label, key in UNICORN_MODEL_KEYS.items()}

DATA_SCHEMA = vol.Schema({
    vol.Required(CONF_DEVICE_ID, default="pimoroni_unicorn_1"): str,
    vol.Required(CONF_MODEL,     default=UNICORN_MODELS[0]):          vol.In(UNICORN_MODELS),
})

_MODEL_SELECTOR = SelectSelector(
    SelectSelectorConfig(options=UNICORN_MODELS, mode=SelectSelectorMode.DROPDOWN)
)

_ORIENTATION_SELECTOR = SelectSelector(SelectSelectorConfig(
    options=[
        {"value": "0",   "label": "0° — normal"},
        {"value": "180", "label": "180° — upside down"},
        {"value": "90",  "label": "90° clockwise (vertical)"},
        {"value": "270", "label": "270° clockwise (vertical)"},
    ],
    mode=SelectSelectorMode.DROPDOWN,
))


def _options_schema(current: dict) -> vol.Schema:
    def _sv(key, default=None):
        # suggested_value (pre-fill) with NO default, so clearing a field omits the key.
        v = current.get(key) or default
        return {"suggested_value": v} if v is not None else {}

    return vol.Schema({
        vol.Required(CONF_MODEL, default=current.get(CONF_MODEL) or UNICORN_MODELS[0]):     _MODEL_SELECTOR,
        vol.Optional(CONF_ORIENTATION, default=str(current.get(CONF_ORIENTATION, "0"))):    _ORIENTATION_SELECTOR,
        vol.Optional(CONF_SOLAR_ENTITY,            description=_sv(CONF_SOLAR_ENTITY)):            EntitySelector(EntitySelectorConfig(domain=["sensor", "input_number"])),
        vol.Optional(CONF_CONSUMPTION_ENTITY,      description=_sv(CONF_CONSUMPTION_ENTITY)):      EntitySelector(EntitySelectorConfig(domain=["sensor", "input_number"])),
        vol.Optional(CONF_BATTERY_SOC_ENTITY,      description=_sv(CONF_BATTERY_SOC_ENTITY)):      EntitySelector(EntitySelectorConfig(domain=["sensor", "input_number"])),
        vol.Optional(CONF_BATTERY_CHARGING_ENTITY, description=_sv(CONF_BATTERY_CHARGING_ENTITY)): EntitySelector(EntitySelectorConfig(domain=["binary_sensor", "switch", "input_boolean"])),
        vol.Optional(CONF_SUN_ENTITY,              description=_sv(CONF_SUN_ENTITY, "sun.sun")):   EntitySelector(EntitySelectorConfig(domain="sun")),
        vol.Optional(CONF_WEATHER_CODE_ENTITY,     description=_sv(CONF_WEATHER_CODE_ENTITY)):     EntitySelector(EntitySelectorConfig(domain=["sensor", "weather"])),
        vol.Optional(CONF_EXTRA_SENSORS,           description=_sv(CONF_EXTRA_SENSORS)):           TextSelector(TextSelectorConfig(multiline=True)),
        vol.Optional(CONF_SHOW_PANEL,              default=current.get(CONF_SHOW_PANEL, True)):    BooleanSelector(),
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

    async def async_step_mqtt(self, discovery_info: MqttServiceInfo):
        """Auto-discover a device from its retained announcement (no manual entry)."""
        try:
            data = json.loads(discovery_info.payload)
        except (ValueError, TypeError):
            return self.async_abort(reason="invalid_discovery")
        device_id = data.get("device_id")
        if not device_id:
            return self.async_abort(reason="invalid_discovery")
        await self.async_set_unique_id(device_id)
        self._abort_if_unique_id_configured()
        label = _KEY_TO_LABEL.get(data.get("model", ""), UNICORN_MODELS[0])
        self._discovered = {CONF_DEVICE_ID: device_id, CONF_MODEL: label}
        self.context["title_placeholders"] = {"name": data.get("name") or device_id}
        return await self.async_step_mqtt_confirm()

    async def async_step_mqtt_confirm(self, user_input: dict | None = None):
        """Confirm adding a discovered device."""
        if user_input is not None:
            return self.async_create_entry(
                title=self._discovered[CONF_DEVICE_ID], data=self._discovered)
        return self.async_show_form(
            step_id="mqtt_confirm",
            description_placeholders={
                "device_id": self._discovered[CONF_DEVICE_ID],
                "model": self._discovered[CONF_MODEL],
            },
        )

    async def async_step_reconfigure(self, user_input: dict | None = None):
        """Change the device model on an existing entry (device id is the identity, fixed)."""
        entry = self._get_reconfigure_entry()
        if user_input is not None:
            return self.async_update_reload_and_abort(entry, data_updates=user_input)
        return self.async_show_form(
            step_id="reconfigure",
            data_schema=self.add_suggested_values_to_schema(
                vol.Schema({vol.Required(CONF_MODEL): vol.In(UNICORN_MODELS)}), entry.data),
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
        self._pending_icon: dict | None = None
        self._initialized = False

    def _init_state(self) -> None:
        if self._initialized:
            return
        self._initialized = True
        self._settings = {**self._config_entry.data, **self._config_entry.options}

    async def async_step_init(self, user_input=None):
        """Show main options menu."""
        self._init_state()
        registry = await lametric.async_get_registry(self.hass)
        layouts = await layout.async_get_registry(self.hass)
        active  = self._settings.get(layout.CONF_ACTIVE_LAYOUT)
        menu_options = ["settings"]
        menu_options.append("add_icon")
        if registry:
            menu_options.append("remove_icon")
        menu_options.append("import_layout")
        if layouts:
            menu_options.append("select_layout")
        if active and active in layouts:
            menu_options.append("toggle_widgets")
        menu_options.append("save")

        icon_list = "\n".join(
            f"- {name} (code {icon.get('code', '?')}, {len(icon.get('frames', []))} frame(s))"
            for name, icon in registry.items()
        ) if registry else "None installed"

        layout_list = "\n".join(
            f"- {name}{' (active)' if name == active else ''}" for name in layouts
        ) if layouts else "None imported"

        return self.async_show_menu(
            step_id="init",
            menu_options=menu_options,
            description_placeholders={"icons": icon_list, "layouts": layout_list},
        )

    async def async_step_settings(self, user_input=None):
        """Handle general settings form."""
        if user_input is not None:
            self._settings.update(user_input)
            return await self.async_step_init()

        return self.async_show_form(
            step_id="settings",
            data_schema=_options_schema(self._settings),
            description_placeholders={"device_id": self._settings.get(CONF_DEVICE_ID, "")},
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

    async def async_step_import_layout(self, user_input=None):
        """Import a layout JSON authored in the panel Designer and make it active."""
        errors = {}
        if user_input is not None:
            parsed = layout.parse_layout(user_input["layout_json"])
            if parsed is None:
                errors["layout_json"] = "invalid_layout"
            else:
                existing = await layout.async_get_registry(self.hass)
                name = str(parsed.get("name") or f"layout_{len(existing) + 1}")
                await layout.async_save_layout(self.hass, name, parsed)
                self._settings[layout.CONF_ACTIVE_LAYOUT] = name
                await layout.async_push_layout(
                    self.hass, layout.entry_device_id(self._config_entry), parsed)
                return await self.async_step_init()

        return self.async_show_form(
            step_id="import_layout",
            data_schema=vol.Schema({
                vol.Required("layout_json"): TextSelector(TextSelectorConfig(multiline=True)),
            }),
            errors=errors,
        )

    async def async_step_select_layout(self, user_input=None):
        """Select which stored layout is active for this device."""
        layouts = await layout.async_get_registry(self.hass)
        if user_input is not None:
            name = user_input["layout_name"]
            self._settings[layout.CONF_ACTIVE_LAYOUT] = name
            await layout.async_push_layout(
                self.hass, layout.entry_device_id(self._config_entry), layouts[name])
            return await self.async_step_init()

        return self.async_show_form(
            step_id="select_layout",
            data_schema=vol.Schema({
                vol.Required("layout_name", default=self._settings.get(layout.CONF_ACTIVE_LAYOUT)):
                    SelectSelector(SelectSelectorConfig(options=sorted(layouts), mode=SelectSelectorMode.DROPDOWN)),
            }),
        )

    async def async_step_toggle_widgets(self, user_input=None):
        """Enable/disable widgets in the active layout and re-push."""
        layouts = await layout.async_get_registry(self.hass)
        name    = self._settings.get(layout.CONF_ACTIVE_LAYOUT)
        lay     = layouts.get(name) if name else None
        if lay is None:
            return await self.async_step_init()
        ids = [w["id"] for w in lay["widgets"]]

        if user_input is not None:
            enabled = set(user_input.get("widgets", []))
            for w in lay["widgets"]:
                w["enabled"] = w["id"] in enabled
            await layout.async_save_layout(self.hass, str(name), lay)
            await layout.async_push_layout(
                self.hass, layout.entry_device_id(self._config_entry), lay)
            return await self.async_step_init()

        current = [w["id"] for w in lay["widgets"] if w.get("enabled", True)]
        return self.async_show_form(
            step_id="toggle_widgets",
            data_schema=vol.Schema({
                vol.Optional("widgets", default=current): SelectSelector(SelectSelectorConfig(
                    options=ids, multiple=True, mode=SelectSelectorMode.LIST)),
            }),
        )

    async def async_step_save(self, user_input=None):
        """Save all options and close."""
        return self.async_create_entry(title="", data={**self._settings})
