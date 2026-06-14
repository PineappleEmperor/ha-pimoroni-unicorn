"""Websocket API backing the layout editor panel."""

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from . import layout, render_service
from .const import CONF_DEVICE_ID, CONF_DISPLAY_SENSORS, CONF_MODEL, DOMAIN

WS_DEVICES        = "pimoroni_unicorn/devices"
WS_CAPABILITIES   = "pimoroni_unicorn/capabilities"
WS_LAYOUTS        = "pimoroni_unicorn/layouts"
WS_RENDER         = "pimoroni_unicorn/render"
WS_SAVE_LAYOUT    = "pimoroni_unicorn/save_layout"
WS_PUSH_LAYOUT    = "pimoroni_unicorn/push_layout"
WS_DELETE_LAYOUT  = "pimoroni_unicorn/delete_layout"
WS_SENSORS        = "pimoroni_unicorn/display_sensors"
WS_SET_SENSORS    = "pimoroni_unicorn/set_display_sensors"


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register all layout-editor websocket commands (once)."""
    for handler in (ws_devices, ws_capabilities, ws_layouts, ws_render,
                    ws_save_layout, ws_push_layout, ws_delete_layout,
                    ws_display_sensors, ws_set_display_sensors):
        websocket_api.async_register_command(hass, handler)


def _entry(hass, entry_id):
    return hass.config_entries.async_get_entry(entry_id)


def _model_key(entry) -> str:
    model = {**entry.data, **entry.options}.get(CONF_MODEL, "")
    return model if model in render_service.MODEL_DIMS else "galactic"


@websocket_api.websocket_command({vol.Required("type"): WS_DEVICES})
@callback
def ws_devices(hass, connection, msg):
    """List configured Pimoroni Unicorn devices."""
    devices = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        opts = {**entry.data, **entry.options}
        devices.append({
            "entry_id":  entry.entry_id,
            "device_id": opts.get(CONF_DEVICE_ID, ""),
            "model":     _model_key(entry),
            "name":      entry.title,
            "active_layout": opts.get(layout.CONF_ACTIVE_LAYOUT),
        })
    connection.send_result(msg["id"], {"devices": devices})


@websocket_api.websocket_command({
    vol.Required("type"): WS_CAPABILITIES,
    vol.Optional("entry_id"): str,
    vol.Optional("model"): vol.In(list(render_service.MODEL_DIMS)),
})
@callback
def ws_capabilities(hass, connection, msg):
    """Widget catalogue + model default layout, for a device or a bare model (mock)."""
    caps = None
    entry = _entry(hass, msg["entry_id"]) if msg.get("entry_id") else None
    if entry is not None:
        model = _model_key(entry)
        caps  = hass.data.get(DOMAIN, {}).get(entry.entry_id, {}).get("layout_caps")
    else:
        model = msg.get("model", "galactic")
    if not caps:
        caps = render_service.layout_capabilities()
    connection.send_result(msg["id"], {
        "model": model,
        "widgets": caps.get("widgets", []),
        "overlays": caps.get("overlays", []),
        "default_layout": render_service.default_layout(model),
    })


@websocket_api.websocket_command({vol.Required("type"): WS_LAYOUTS})
@websocket_api.async_response
async def ws_layouts(hass, connection, msg):
    """Return the stored named-layout registry."""
    registry = await layout.async_get_registry(hass)
    connection.send_result(msg["id"], {"layouts": registry})


@websocket_api.websocket_command({
    vol.Required("type"): WS_RENDER,
    vol.Required("model"): vol.In(list(render_service.MODEL_DIMS)),
    vol.Required("layout"): dict,
    vol.Optional("sensors"): list,
})
@websocket_api.async_response
async def ws_render(hass, connection, msg):
    """Render a layout to a base64 PNG using the device's own render code."""
    png = await hass.async_add_executor_job(
        render_service.render_layout_png, msg["model"], msg["layout"], msg.get("sensors"))
    connection.send_result(msg["id"], {"png": png})


@websocket_api.websocket_command({
    vol.Required("type"): WS_SENSORS,
    vol.Required("entry_id"): str,
})
@callback
def ws_display_sensors(hass, connection, msg):
    """Return a device's configured display sensors."""
    entry = _entry(hass, msg["entry_id"])
    sensors = {**entry.data, **entry.options}.get(CONF_DISPLAY_SENSORS, []) if entry else []
    connection.send_result(msg["id"], {"sensors": sensors})


@websocket_api.websocket_command({
    vol.Required("type"): WS_SET_SENSORS,
    vol.Required("entry_id"): str,
    vol.Required("sensors"): list,
})
@websocket_api.async_response
async def ws_set_display_sensors(hass, connection, msg):
    """Replace a device's display sensors (re-published by the options listener)."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    hass.config_entries.async_update_entry(
        entry, options={**entry.options, CONF_DISPLAY_SENSORS: msg["sensors"]})
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_SAVE_LAYOUT,
    vol.Required("entry_id"): str,
    vol.Required("name"): str,
    vol.Required("layout"): dict,
})
@websocket_api.async_response
async def ws_save_layout(hass, connection, msg):
    """Store a named layout, make it the device's active layout, and push it."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    name = msg["name"]
    await layout.async_save_layout(hass, name, msg["layout"])
    hass.config_entries.async_update_entry(
        entry, options={**entry.options, layout.CONF_ACTIVE_LAYOUT: name})
    await layout.async_push_layout(hass, layout.entry_device_id(entry), msg["layout"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_PUSH_LAYOUT,
    vol.Required("entry_id"): str,
    vol.Required("layout"): dict,
})
@websocket_api.async_response
async def ws_push_layout(hass, connection, msg):
    """Push a layout to a device without storing it (live preview)."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    await layout.async_push_layout(hass, layout.entry_device_id(entry), msg["layout"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_DELETE_LAYOUT,
    vol.Required("name"): str,
})
@websocket_api.async_response
async def ws_delete_layout(hass, connection, msg):
    """Remove a stored named layout."""
    await layout.async_remove_layout(hass, msg["name"])
    connection.send_result(msg["id"], {"ok": True})
