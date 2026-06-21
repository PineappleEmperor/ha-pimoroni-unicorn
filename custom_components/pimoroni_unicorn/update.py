"""Update platform: device engine version vs the bundled firmware."""
import hashlib
from pathlib import Path

from homeassistant.components.update import UpdateEntity, UpdateEntityFeature
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
import homeassistant.helpers.issue_registry as ir

from .const import (
    CONF_DEVICE_ID,
    CONF_MODEL,
    DOMAIN,
    ENGINE_FILE_KEYS,
    ENGINE_REFLASH_BELOW,
    ENGINE_VERSION,
    OTA_SOURCE_FILES,
    PUConfigEntry,
)
from .entity import device_info

PARALLEL_UPDATES = 0

_BUNDLE_DIR = Path(__file__).parent / "firmware"
_bundle_hashes: dict[str, str] = {}


def _ver(v) -> tuple[int, ...]:
    """Parse a dotted version into a comparable tuple; unparseable -> (0,)."""
    try:
        return tuple(int(x) for x in str(v).split(".")[:3])
    except (TypeError, ValueError):
        return (0,)


def _engine_bundle_hashes() -> dict[str, str]:
    """Short sha256 of each bundled engine file, keyed by basename (matches device manifest)."""
    if not _bundle_hashes:
        for key in ENGINE_FILE_KEYS:
            name = OTA_SOURCE_FILES[key][0]
            p = _BUNDLE_DIR / name
            if p.is_file():
                _bundle_hashes[name] = hashlib.sha256(p.read_bytes()).hexdigest()[:16]
    return _bundle_hashes


async def async_setup_entry(
    hass: HomeAssistant, entry: PUConfigEntry, async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the firmware update entity."""
    opts = {**entry.data, **entry.options}
    async_add_entities([PimoroniUnicornUpdate(
        hass, entry, opts[CONF_DEVICE_ID], opts.get(CONF_MODEL, "Pimoroni Unicorn"))])


class PimoroniUnicornUpdate(UpdateEntity):
    """Firmware engine update, OTA-installed over MQTT (or USB reflash for layout changes)."""

    _attr_has_entity_name = True
    _attr_name = "Firmware"
    _attr_title = "Pimoroni Unicorn engine"
    _attr_supported_features = UpdateEntityFeature.INSTALL
    _attr_should_poll = False

    def __init__(self, hass: HomeAssistant, entry: PUConfigEntry, device_id: str, model: str) -> None:
        """Initialise the update entity."""
        self.hass = hass
        self._entry = entry
        self._device_id = device_id
        self._reflash = False
        self._attr_unique_id = f"{device_id}_firmware"
        self._attr_device_info = device_info(device_id, model)

    def _sync(self) -> None:
        """Recompute installed/latest version from the device manifest, incl. file-hash drift."""
        store = self._entry.runtime_data or {}
        self._attr_available = bool(store.get("available"))
        manifest = store.get("fw_manifest") or {}
        installed = manifest.get("engine_version")
        self._attr_installed_version = installed
        self._reflash = bool(installed) and _ver(installed) < _ver(ENGINE_REFLASH_BELOW)

        # Same version but the engine files on the device don't match the bundle -> drifted.
        device_files = manifest.get("files") or {}
        drift = installed == ENGINE_VERSION and any(
            device_files.get(name) != h for name, h in _engine_bundle_hashes().items())
        self._attr_latest_version = (
            f"{ENGINE_VERSION} (files changed)" if drift else ENGINE_VERSION)
        self._attr_release_summary = (
            "⚠ This engine changes the on-device file layout and must be applied by a one-time "
            "**USB reflash** (Thonny), not OTA. Copy the firmware/ tree to the device."
            if self._reflash else None)

        issue_id = f"reflash_required_{self._device_id}"
        if self._reflash:
            ir.async_create_issue(
                self.hass, DOMAIN, issue_id, is_fixable=False,
                severity=ir.IssueSeverity.WARNING, translation_key="reflash_required",
                translation_placeholders={"device": self._device_id})
        else:
            ir.async_delete_issue(self.hass, DOMAIN, issue_id)

    async def async_added_to_hass(self) -> None:
        """Seed installed version + refresh when a new device manifest/status arrives."""
        self._sync()
        for sig in (f"{DOMAIN}_manifest_{self._entry.entry_id}",
                    f"{DOMAIN}_status_{self._entry.entry_id}"):
            self.async_on_remove(async_dispatcher_connect(self.hass, sig, self._refresh))

    @callback
    def _refresh(self) -> None:
        self._sync()
        self.async_write_ha_state()

    async def async_install(self, version: str | None, backup: bool, **kwargs) -> None:
        """OTA-push the full engine file set, unless the change requires a USB reflash."""
        if self._reflash:
            raise HomeAssistantError(
                "This engine update changes the on-device file layout and cannot be applied "
                "over the air. Reflash the firmware/ tree via USB (Thonny) once; OTA works after.")
        await self.hass.services.async_call(
            DOMAIN, "push_firmware", {"files": ENGINE_FILE_KEYS}, blocking=True)
