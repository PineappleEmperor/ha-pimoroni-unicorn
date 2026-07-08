"""Image platform: a live render of the device's current screen (HA-side, no device camera)."""
import base64
from datetime import timedelta

from homeassistant.components.image import ImageEntity
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.util import dt as dt_util

from . import lametric, layout, live_state, render_service
from .const import (
    CONF_DEVICE_ID,
    CONF_MODEL,
    CONF_ORIENTATION,
    DOMAIN,
    UNICORN_MODEL_KEYS,
    PUConfigEntry,
)
from .entity import device_info

PARALLEL_UPDATES = 0
REFRESH = timedelta(seconds=30)  # re-render cadence for the live mirror (also ticks on page/state changes)


def _model_key(entry: PUConfigEntry) -> str:
    raw = {**entry.data, **entry.options}.get(CONF_MODEL, "")
    model = UNICORN_MODEL_KEYS.get(raw, raw)
    return model if model in render_service.MODEL_DIMS else "galactic"


async def async_setup_entry(
    hass: HomeAssistant, entry: PUConfigEntry, async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the live-screen image."""
    opts = {**entry.data, **entry.options}
    async_add_entities([PimoroniUnicornImage(
        hass, entry, opts[CONF_DEVICE_ID], opts.get(CONF_MODEL, "Pimoroni Unicorn"))])


class PimoroniUnicornImage(ImageEntity):
    """Renders the device's active layout + live state with its own draw code (byte-faithful)."""

    _attr_has_entity_name = True
    _attr_name = "Screen"
    _attr_content_type = "image/png"

    def __init__(self, hass: HomeAssistant, entry: PUConfigEntry, device_id: str, model: str) -> None:
        """Initialise the image entity."""
        super().__init__(hass)
        self._entry = entry
        self._attr_unique_id = f"{device_id}_screen"
        self._attr_device_info = device_info(device_id, model)

    async def async_added_to_hass(self) -> None:
        """Refresh on a timer (live clock) and whenever page/state/status changes."""
        self._attr_available = bool((self._entry.runtime_data or {}).get("available"))
        self._attr_image_last_updated = dt_util.utcnow()
        self.async_on_remove(async_track_time_interval(self.hass, self._tick, REFRESH))
        for sig in (f"{DOMAIN}_status_{self._entry.entry_id}", f"{DOMAIN}_diag_{self._entry.entry_id}"):
            self.async_on_remove(async_dispatcher_connect(self.hass, sig, self._tick))

    @callback
    def _tick(self, _now=None) -> None:
        self._attr_available = bool((self._entry.runtime_data or {}).get("available"))
        self._attr_image_last_updated = dt_util.utcnow()  # tells HA to re-fetch
        self.async_write_ha_state()

    async def async_image(self) -> bytes | None:
        """Render the current screen to a PNG."""
        model = _model_key(self._entry)
        opts = {**self._entry.data, **self._entry.options}
        try:
            orientation = int(opts.get(CONF_ORIENTATION, 0) or 0)
        except (ValueError, TypeError):
            orientation = 0
        # Prefer the layout the device says it's rendering; fall back to the active layout, then default.
        lay = (self._entry.runtime_data or {}).get("page") \
            or await layout.async_get_active(self.hass, self._entry) \
            or render_service.default_layout(model, orientation)
        icons = await lametric.async_get_registry(self.hass)
        state = live_state(self.hass, self._entry)
        scale = render_service.fit_scale(model, orientation)
        png_b64 = await self.hass.async_add_executor_job(
            render_service.render_layout_png, model, lay, icons,
            state["elapsed_ms"], orientation, state, scale)
        return base64.b64decode(png_b64)
