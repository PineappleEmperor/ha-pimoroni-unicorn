"""Update platform: device engine version vs the bundled firmware."""
from homeassistant.components.update import UpdateEntity, UpdateEntityFeature
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN, ENGINE_FILE_KEYS, ENGINE_VERSION


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the firmware update entity."""
    opts = {**entry.data, **entry.options}
    async_add_entities([PimoroniUnicornUpdate(
        hass, entry, opts[CONF_DEVICE_ID], opts.get(CONF_MODEL, "Pimoroni Unicorn"))])


class PimoroniUnicornUpdate(UpdateEntity):
    """Firmware engine update, OTA-installed over MQTT."""

    _attr_has_entity_name = True
    _attr_name = "Firmware"
    _attr_title = "Pimoroni Unicorn engine"
    _attr_supported_features = UpdateEntityFeature.INSTALL
    _attr_should_poll = False
    _attr_latest_version = ENGINE_VERSION

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry, device_id: str, model: str) -> None:
        """Initialise the update entity."""
        self.hass = hass
        self._entry = entry
        self._device_id = device_id
        self._attr_unique_id = f"{device_id}_firmware"
        self._attr_device_info = DeviceInfo(
            identifiers={("mqtt", device_id)}, name="Pimoroni Unicorn",
            manufacturer="Pimoroni", model=model)

    def _sync(self) -> None:
        """Read the device's reported engine version from the cached manifest."""
        data = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id, {})
        self._attr_installed_version = (data.get("fw_manifest") or {}).get("engine_version")

    async def async_added_to_hass(self) -> None:
        """Seed installed version + refresh when a new device manifest arrives."""
        self._sync()
        self.async_on_remove(async_dispatcher_connect(
            self.hass, f"{DOMAIN}_manifest_{self._entry.entry_id}", self._refresh))

    @callback
    def _refresh(self) -> None:
        self._sync()
        self.async_write_ha_state()

    async def async_install(self, version: str | None, backup: bool, **kwargs) -> None:
        """OTA-push the full engine file set to the device."""
        await self.hass.services.async_call(
            DOMAIN, "push_firmware", {"files": ENGINE_FILE_KEYS}, blocking=False)
