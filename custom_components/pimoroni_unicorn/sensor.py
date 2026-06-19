"""Sensor platform: current page + (disabled-by-default) device diagnostics."""
from collections.abc import Callable
from dataclasses import dataclass

from propcache.api import cached_property

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorEntityDescription,
    SensorStateClass,
)
from homeassistant.const import (
    SIGNAL_STRENGTH_DECIBELS_MILLIWATT,
    EntityCategory,
    UnitOfInformation,
    UnitOfTime,
)
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.typing import StateType

from .const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN, PUConfigEntry

PARALLEL_UPDATES = 0


@dataclass(frozen=True, kw_only=True)
class PUSensorDescription(SensorEntityDescription):
    """Sensor description with a value function over (diag, manifest)."""
    value_fn: Callable[[dict, dict], StateType]
    attr_fn: Callable[[dict, dict], dict] | None = None


SENSORS: tuple[PUSensorDescription, ...] = (
    PUSensorDescription(
        key="page", translation_key="page", icon="mdi:view-carousel",
        value_fn=lambda diag, manifest: diag.get("page"),
        attr_fn=lambda diag, manifest: {
            "index": diag.get("screen_index"),
            "count": diag.get("screen_count"),
            "dwell_s": diag.get("dwell_s"),
        },
    ),
    PUSensorDescription(
        key="free_mem", translation_key="free_mem",
        native_unit_of_measurement=UnitOfInformation.BYTES,
        entity_category=EntityCategory.DIAGNOSTIC, entity_registry_enabled_default=False,
        value_fn=lambda diag, manifest: diag.get("free_mem"),
    ),
    PUSensorDescription(
        key="uptime", translation_key="uptime",
        native_unit_of_measurement=UnitOfTime.SECONDS,
        entity_category=EntityCategory.DIAGNOSTIC, entity_registry_enabled_default=False,
        value_fn=lambda diag, manifest: diag.get("uptime_s"),
    ),
    PUSensorDescription(
        key="engine_version", translation_key="engine_version",
        entity_category=EntityCategory.DIAGNOSTIC, entity_registry_enabled_default=False,
        value_fn=lambda diag, manifest: manifest.get("engine_version"),
    ),
    PUSensorDescription(
        key="wifi_signal", translation_key="wifi_signal",
        native_unit_of_measurement=SIGNAL_STRENGTH_DECIBELS_MILLIWATT,
        device_class=SensorDeviceClass.SIGNAL_STRENGTH, state_class=SensorStateClass.MEASUREMENT,
        entity_category=EntityCategory.DIAGNOSTIC, entity_registry_enabled_default=False,
        value_fn=lambda diag, manifest: diag.get("rssi"),
    ),
    PUSensorDescription(
        key="ip_address", translation_key="ip_address", icon="mdi:ip-network",
        entity_category=EntityCategory.DIAGNOSTIC, entity_registry_enabled_default=False,
        value_fn=lambda diag, manifest: diag.get("ip"),
    ),
    PUSensorDescription(
        key="reset_cause", translation_key="reset_cause", icon="mdi:restart-alert",
        entity_category=EntityCategory.DIAGNOSTIC, entity_registry_enabled_default=False,
        value_fn=lambda diag, manifest: diag.get("reset_cause"),
    ),
    PUSensorDescription(
        key="orientation", translation_key="orientation", icon="mdi:screen-rotation",
        native_unit_of_measurement="°",
        entity_category=EntityCategory.DIAGNOSTIC, entity_registry_enabled_default=False,
        value_fn=lambda diag, manifest: diag.get("orientation"),
    ),
    PUSensorDescription(
        key="cpu_temp", translation_key="cpu_temp",
        native_unit_of_measurement="°C", device_class=SensorDeviceClass.TEMPERATURE,
        state_class=SensorStateClass.MEASUREMENT,
        entity_category=EntityCategory.DIAGNOSTIC, entity_registry_enabled_default=False,
        value_fn=lambda diag, manifest: diag.get("cpu_temp"),
    ),
)


async def async_setup_entry(
    hass: HomeAssistant, entry: PUConfigEntry, async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the page + diagnostic sensors."""
    opts = {**entry.data, **entry.options}
    device_id = opts[CONF_DEVICE_ID]
    model = opts.get(CONF_MODEL, "Pimoroni Unicorn")
    async_add_entities(PimoroniUnicornSensor(hass, entry, device_id, model, d) for d in SENSORS)


class PimoroniUnicornSensor(SensorEntity):
    """A device diagnostic / status sensor backed by retained MQTT payloads."""

    _attr_has_entity_name = True
    _attr_should_poll = False

    def __init__(self, hass: HomeAssistant, entry: PUConfigEntry, device_id: str,
                 model: str, description: PUSensorDescription) -> None:
        """Initialise the sensor."""
        self.hass = hass
        self._entry = entry
        self._desc = description
        self.entity_description = description
        self._attr_unique_id = f"{device_id}_{description.key}"
        self._attr_device_info = DeviceInfo(
            identifiers={("mqtt", device_id)}, name="Pimoroni Unicorn",
            manufacturer="Pimoroni", model=model)

    @cached_property
    def native_value(self) -> StateType:
        """Compute the value from the cached diag + firmware manifest payloads."""
        data = self._entry.runtime_data or {}
        return self._desc.value_fn(data.get("diag") or {}, data.get("fw_manifest") or {})

    @cached_property
    def extra_state_attributes(self) -> dict | None:
        """Optional per-sensor attributes (e.g. playlist position on the page sensor)."""
        if self._desc.attr_fn is None:
            return None
        data = self._entry.runtime_data or {}
        return self._desc.attr_fn(data.get("diag") or {}, data.get("fw_manifest") or {})

    async def async_added_to_hass(self) -> None:
        """Refresh when new diag, manifest or status payloads arrive."""
        self._attr_available = bool((self._entry.runtime_data or {}).get("available"))
        for sig in (f"{DOMAIN}_diag_{self._entry.entry_id}",
                    f"{DOMAIN}_manifest_{self._entry.entry_id}",
                    f"{DOMAIN}_status_{self._entry.entry_id}"):
            self.async_on_remove(async_dispatcher_connect(self.hass, sig, self._refresh))

    @callback
    def _refresh(self) -> None:
        self._attr_available = bool((self._entry.runtime_data or {}).get("available"))
        self.async_write_ha_state()
