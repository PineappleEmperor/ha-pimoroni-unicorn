"""Button platform for Pimoroni Unicorn."""
from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up button platform."""
    opts = {**entry.data, **entry.options}
    async_add_entities([PimoroniUnicornUpdateButton(
        hass, entry, opts[CONF_DEVICE_ID], opts.get(CONF_MODEL, "Pimoroni Unicorn")
    )])


class PimoroniUnicornUpdateButton(ButtonEntity):
    """OTA firmware update button."""

    _attr_icon = "mdi:upload"

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, device_id: str, model: str) -> None:
        """Initialise button entity."""
        self.hass = hass
        self._entry = entry
        self._attr_unique_id  = f"{device_id}_ota_main"
        self._attr_name       = "Update Firmware"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, device_id)},
            name="Pimoroni Unicorn",
            manufacturer="Pimoroni",
            model=model,
        )

    async def async_press(self) -> None:
        """Trigger firmware OTA push."""
        await self.hass.services.async_call(
            DOMAIN,
            "push_firmware",
            {"files": ["main"]},
            blocking=False,
        )
