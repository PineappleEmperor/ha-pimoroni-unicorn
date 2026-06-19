"""Camera platform: a live render of the device's current screen (HA-side, no device camera)."""
import base64

from homeassistant.components.camera import Camera
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.device_registry import DeviceInfo
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import lametric, layout, live_state, render_service
from .const import (
    CONF_DEVICE_ID,
    CONF_MODEL,
    CONF_ORIENTATION,
    DOMAIN,
    UNICORN_MODEL_KEYS,
    PUConfigEntry,
)

PARALLEL_UPDATES = 0


def _model_key(entry: PUConfigEntry) -> str:
    raw = {**entry.data, **entry.options}.get(CONF_MODEL, "")
    model = UNICORN_MODEL_KEYS.get(raw, raw)
    return model if model in render_service.MODEL_DIMS else "galactic"


async def async_setup_entry(
    hass: HomeAssistant, entry: PUConfigEntry, async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the live-screen camera."""
    opts = {**entry.data, **entry.options}
    async_add_entities([PimoroniUnicornCamera(
        hass, entry, opts[CONF_DEVICE_ID], opts.get(CONF_MODEL, "Pimoroni Unicorn"))])


class PimoroniUnicornCamera(Camera):
    """Renders the device's active layout + live state with its own draw code (byte-faithful)."""

    _attr_has_entity_name = True
    _attr_name = "Screen"
    _attr_frame_interval = 2.0

    def __init__(self, hass: HomeAssistant, entry: PUConfigEntry, device_id: str, model: str) -> None:
        """Initialise the camera."""
        super().__init__()
        self.hass = hass
        self._entry = entry
        self._attr_unique_id = f"{device_id}_screen"
        self._attr_device_info = DeviceInfo(
            identifiers={("mqtt", device_id)}, name="Pimoroni Unicorn",
            manufacturer="Pimoroni", model=model)

    async def async_added_to_hass(self) -> None:
        """Track device online/offline for availability."""
        self._attr_available = bool((self._entry.runtime_data or {}).get("available"))
        self.async_on_remove(async_dispatcher_connect(
            self.hass, f"{DOMAIN}_status_{self._entry.entry_id}", self._refresh))

    @callback
    def _refresh(self) -> None:
        self._attr_available = bool((self._entry.runtime_data or {}).get("available"))
        self.async_write_ha_state()

    async def async_camera_image(self, width: int | None = None, height: int | None = None) -> bytes | None:
        """Render the current screen to a PNG."""
        model = _model_key(self._entry)
        opts = {**self._entry.data, **self._entry.options}
        try:
            orientation = int(opts.get(CONF_ORIENTATION, 0) or 0)
        except (ValueError, TypeError):
            orientation = 0
        lay = await layout.async_get_active(self.hass, self._entry) \
            or render_service.default_layout(model, orientation)
        icons = await lametric.async_get_registry(self.hass)
        state = live_state(self.hass, self._entry)
        png_b64 = await self.hass.async_add_executor_job(
            render_service.render_layout_png, model, lay, icons, state["elapsed_ms"], orientation, state)
        return base64.b64decode(png_b64)
