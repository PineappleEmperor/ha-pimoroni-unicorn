"""Select platform: a weather-condition test override to force a condition on the device."""
from homeassistant.components.select import SelectEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.entity import EntityCategory
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import async_publish_weather
from .const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN, PUConfigEntry

PARALLEL_UPDATES = 0

_AUTO = "Auto (live)"

# Display label -> firmware condition string the device's weather widgets understand.
_OPTIONS: dict[str, str | None] = {
    _AUTO: None,
    "Clear": "clear",
    "Partly cloudy": "partly_cloudy",
    "Cloudy": "cloudy",
    "Fog": "fog",
    "Rain": "rain",
    "Snow": "snow",
    "Storm": "thunderstorm",
}


async def async_setup_entry(
    hass: HomeAssistant, entry: PUConfigEntry, async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the weather-condition test select."""
    opts = {**entry.data, **entry.options}
    async_add_entities([PimoroniUnicornWeatherTest(
        entry, opts[CONF_DEVICE_ID], opts.get(CONF_MODEL, "Pimoroni Unicorn"))])


class PimoroniUnicornWeatherTest(SelectEntity):
    """Forces a weather condition (device + dashboard render); 'Auto (live)' resumes the entity."""

    _attr_has_entity_name = True
    _attr_translation_key = "weather_test"
    _attr_entity_category = EntityCategory.CONFIG
    _attr_options = list(_OPTIONS)

    def __init__(self, entry: PUConfigEntry, device_id: str, model: str) -> None:
        """Initialise the select."""
        self._entry = entry
        self._attr_current_option = _AUTO
        self._attr_unique_id = f"{device_id}_weather_test"
        self._attr_device_info = DeviceInfo(
            identifiers={("mqtt", device_id)}, name="Pimoroni Unicorn",
            manufacturer="Pimoroni", model=model)

    @callback
    def _available(self) -> bool:
        return bool((self._entry.runtime_data or {}).get("available"))

    async def async_select_option(self, option: str) -> None:
        """Set (or clear) the override, push it to the device, and refresh the screen mirror."""
        if option not in _OPTIONS:
            return
        self._attr_current_option = option
        if self._entry.runtime_data is not None:
            self._entry.runtime_data["weather_override"] = _OPTIONS[option]
        await async_publish_weather(self.hass, self._entry)
        async_dispatcher_send(self.hass, f"{DOMAIN}_diag_{self._entry.entry_id}")
        self.async_write_ha_state()
