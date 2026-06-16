"""Websocket API backing the layout editor panel."""

import json

import voluptuous as vol
import yaml

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback

from . import firmware_install, layout, marketplace, render_service
from .const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN

WS_DEVICES        = "pimoroni_unicorn/devices"
WS_CAPABILITIES   = "pimoroni_unicorn/capabilities"
WS_LAYOUTS        = "pimoroni_unicorn/layouts"
WS_RENDER         = "pimoroni_unicorn/render"
WS_SAVE_LAYOUT    = "pimoroni_unicorn/save_layout"
WS_PUSH_LAYOUT    = "pimoroni_unicorn/push_layout"
WS_DELETE_LAYOUT  = "pimoroni_unicorn/delete_layout"
WS_PUSH_SCREENS   = "pimoroni_unicorn/push_screens"
WS_CATALOG        = "pimoroni_unicorn/catalog"
WS_FW_MANIFEST    = "pimoroni_unicorn/fw_manifest"
WS_FW_INSTALL     = "pimoroni_unicorn/fw_install"
WS_FW_REMOVE      = "pimoroni_unicorn/fw_remove"
WS_WIDGET_PREVIEW = "pimoroni_unicorn/widget_preview"
WS_WIDGET_SAVE    = "pimoroni_unicorn/widget_save"
WS_WIDGET_IMPORT  = "pimoroni_unicorn/widget_import"
WS_WIDGET_DELETE  = "pimoroni_unicorn/widget_delete"
WS_CONTENT        = "pimoroni_unicorn/content_catalog"
WS_DEPLOY_LAYOUT  = "pimoroni_unicorn/deploy_layout"
WS_DEPLOY_SCREENSET = "pimoroni_unicorn/deploy_screenset"
WS_PUBLISH_LAYOUT = "pimoroni_unicorn/publish_layout"
WS_SAVE_SCREENSET = "pimoroni_unicorn/save_screenset"
WS_DELETE_SCREENSET = "pimoroni_unicorn/delete_screenset"


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register all layout-editor websocket commands (once)."""
    for handler in (ws_devices, ws_capabilities, ws_layouts, ws_render,
                    ws_save_layout, ws_push_layout, ws_delete_layout, ws_push_screens,
                    ws_catalog, ws_fw_manifest, ws_fw_install, ws_fw_remove,
                    ws_widget_preview, ws_widget_save, ws_widget_import, ws_widget_delete,
                    ws_content_catalog, ws_deploy_layout, ws_deploy_screenset,
                    ws_publish_layout, ws_save_screenset, ws_delete_screenset):
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
})
@websocket_api.async_response
async def ws_render(hass, connection, msg):
    """Render a layout to a base64 PNG using the device's own render code."""
    png = await hass.async_add_executor_job(
        render_service.render_layout_png, msg["model"], msg["layout"])
    boxes = render_service.layout_boxes(msg["layout"])
    connection.send_result(msg["id"], {"png": png, "boxes": boxes})


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


@websocket_api.websocket_command({
    vol.Required("type"): WS_PUSH_SCREENS,
    vol.Required("entry_id"): str,
    vol.Required("layouts"): [str],
    vol.Optional("dwell", default=10): int,
    vol.Optional("transition", default="none"): str,
})
@websocket_api.async_response
async def ws_push_screens(hass, connection, msg):
    """Push a screen set (named layouts + rotation) to a device."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    registry = await layout.async_get_registry(hass)
    screens = [registry[n] for n in msg["layouts"] if n in registry]
    if not screens:
        connection.send_error(msg["id"], "empty", "No known layouts selected")
        return
    payload = {"screens": screens, "dwell": msg["dwell"], "transition": msg["transition"]}
    await layout.async_push_screens(hass, layout.entry_device_id(entry), payload)
    connection.send_result(msg["id"], {"ok": True})


def _fw_manifest(hass, entry_id):
    return hass.data.get(DOMAIN, {}).get(entry_id, {}).get("fw_manifest")


@websocket_api.websocket_command({
    vol.Required("type"): WS_CATALOG,
    vol.Optional("entry_id"): str,
})
@callback
def ws_catalog(hass, connection, msg):
    """Catalogue of installable widgets (built-in + custom) with install status."""
    manifest = _fw_manifest(hass, msg["entry_id"]) if msg.get("entry_id") else None
    custom = marketplace.widgets_dir(hass.config.config_dir)
    connection.send_result(msg["id"], {"widgets": marketplace.device_diff(manifest, custom)})


@websocket_api.websocket_command({
    vol.Required("type"): WS_FW_MANIFEST,
    vol.Required("entry_id"): str,
})
@callback
def ws_fw_manifest(hass, connection, msg):
    """Return the device's cached firmware manifest (engine version + hashes)."""
    connection.send_result(msg["id"], {"manifest": _fw_manifest(hass, msg["entry_id"])})


@websocket_api.websocket_command({
    vol.Required("type"): WS_FW_INSTALL,
    vol.Required("entry_id"): str,
    vol.Required("widget_id"): str,
})
@websocket_api.async_response
async def ws_fw_install(hass, connection, msg):
    """Install a widget (and any missing font deps) on the device."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    ok = await firmware_install.async_install_widget(hass, entry, msg["widget_id"])
    connection.send_result(msg["id"], {"ok": ok})


@websocket_api.websocket_command({
    vol.Required("type"): WS_FW_REMOVE,
    vol.Required("entry_id"): str,
    vol.Required("widget_id"): str,
})
@websocket_api.async_response
async def ws_fw_remove(hass, connection, msg):
    """Remove a widget unit from the device."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    ok = await firmware_install.async_remove_widget(hass, entry, msg["widget_id"])
    connection.send_result(msg["id"], {"ok": ok})


@websocket_api.websocket_command({
    vol.Required("type"): WS_WIDGET_PREVIEW,
    vol.Required("model"): vol.In(list(render_service.MODEL_DIMS)),
    vol.Required("spec"): dict,
})
@websocket_api.async_response
async def ws_widget_preview(hass, connection, msg):
    """Render a declarative widget spec to a base64 PNG."""
    err = marketplace.validate_spec(msg["spec"])
    if err:
        connection.send_error(msg["id"], "invalid", err)
        return
    png = await hass.async_add_executor_job(
        render_service.render_widget_png, msg["model"], msg["spec"])
    connection.send_result(msg["id"], {"png": png})


@websocket_api.websocket_command({
    vol.Required("type"): WS_WIDGET_SAVE,
    vol.Required("spec"): dict,
})
@websocket_api.async_response
async def ws_widget_save(hass, connection, msg):
    """Persist a custom declarative widget."""
    try:
        wid = await hass.async_add_executor_job(
            marketplace.save_custom, hass.config.config_dir, msg["spec"])
    except ValueError as err:
        connection.send_error(msg["id"], "invalid", str(err))
        return
    connection.send_result(msg["id"], {"id": wid})


@websocket_api.websocket_command({
    vol.Required("type"): WS_WIDGET_IMPORT,
    vol.Required("text"): str,
})
@callback
def ws_widget_import(hass, connection, msg):
    """Parse pasted YAML/JSON into a spec and validate it (does not save)."""
    spec = _parse_spec_text(msg["text"])
    if spec is None:
        connection.send_error(msg["id"], "invalid", "could not parse as JSON or YAML")
        return
    err = marketplace.validate_spec(spec)
    if err:
        connection.send_error(msg["id"], "invalid", err)
        return
    connection.send_result(msg["id"], {"spec": spec})


@websocket_api.websocket_command({
    vol.Required("type"): WS_WIDGET_DELETE,
    vol.Required("widget_id"): str,
})
@websocket_api.async_response
async def ws_widget_delete(hass, connection, msg):
    """Delete a custom declarative widget."""
    await hass.async_add_executor_job(
        marketplace.delete_custom, hass.config.config_dir, msg["widget_id"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_CONTENT,
    vol.Optional("entry_id"): str,
})
@websocket_api.async_response
async def ws_content_catalog(hass, connection, msg):
    """Marketplace content: published layouts + screensets, flagged compatible vs the device."""
    custom = marketplace.widgets_dir(hass.config.config_dir)
    all_layouts = await layout.async_get_registry(hass)
    published = await layout.async_published_layouts(hass)
    screensets = await layout.async_get_screensets(hass)
    model = None
    if msg.get("entry_id"):
        entry = _entry(hass, msg["entry_id"])
        if entry is not None:
            model = _model_key(entry)

    def _tag(units):
        return [{**u, "compatible": marketplace.compatible(u["compat"], model)} for u in units]

    connection.send_result(msg["id"], {
        "model": model,
        "layouts": _tag(marketplace.layout_units(published, custom)),
        "screensets": _tag(marketplace.screenset_units(screensets, all_layouts)),
    })


@websocket_api.websocket_command({
    vol.Required("type"): WS_DEPLOY_LAYOUT,
    vol.Required("entry_id"): str,
    vol.Required("name"): str,
    vol.Optional("override", default=False): bool,
})
@websocket_api.async_response
async def ws_deploy_layout(hass, connection, msg):
    """Resolve a layout's deps, install missing ones, then deploy it to the device."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    lay = (await layout.async_get_registry(hass)).get(msg["name"])
    if lay is None:
        connection.send_error(msg["id"], "not_found", "Unknown layout")
        return
    custom = marketplace.widgets_dir(hass.config.config_dir)
    unit = marketplace.layout_unit(msg["name"], lay, custom)
    if not msg["override"] and not marketplace.compatible(unit["compat"], _model_key(entry)):
        connection.send_error(msg["id"], "incompatible",
                              f"Layout targets {unit['compat']}, device is {_model_key(entry)}")
        return
    ok = await firmware_install.async_deploy_layout(hass, entry, lay)
    connection.send_result(msg["id"], {"ok": ok})


@websocket_api.websocket_command({
    vol.Required("type"): WS_DEPLOY_SCREENSET,
    vol.Required("entry_id"): str,
    vol.Required("id"): str,
    vol.Optional("override", default=False): bool,
})
@websocket_api.async_response
async def ws_deploy_screenset(hass, connection, msg):
    """Resolve every referenced app's deps, install missing ones, then deploy the rotation."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    screensets = await layout.async_get_screensets(hass)
    ss = screensets.get(msg["id"])
    if ss is None:
        connection.send_error(msg["id"], "not_found", "Unknown screenset")
        return
    all_layouts = await layout.async_get_registry(hass)
    unit = marketplace.screenset_unit(msg["id"], ss, all_layouts)
    if not msg["override"] and not marketplace.compatible(unit["compat"], _model_key(entry)):
        connection.send_error(msg["id"], "incompatible",
                              f"Screenset targets {unit['compat']}, device is {_model_key(entry)}")
        return
    ok = await firmware_install.async_deploy_screenset(hass, entry, ss, all_layouts)
    connection.send_result(msg["id"], {"ok": ok})


@websocket_api.websocket_command({
    vol.Required("type"): WS_PUBLISH_LAYOUT,
    vol.Required("name"): str,
    vol.Required("published"): bool,
})
@websocket_api.async_response
async def ws_publish_layout(hass, connection, msg):
    """Mark a stored layout (un)published to the marketplace."""
    await layout.async_set_published(hass, msg["name"], msg["published"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_SAVE_SCREENSET,
    vol.Required("id"): str,
    vol.Required("screenset"): dict,
})
@websocket_api.async_response
async def ws_save_screenset(hass, connection, msg):
    """Store a screenset (referenced apps + rotation + triggers)."""
    await layout.async_save_screenset(hass, msg["id"], msg["screenset"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_DELETE_SCREENSET,
    vol.Required("id"): str,
})
@websocket_api.async_response
async def ws_delete_screenset(hass, connection, msg):
    """Remove a stored screenset."""
    await layout.async_remove_screenset(hass, msg["id"])
    connection.send_result(msg["id"], {"ok": True})


def _parse_spec_text(text: str):
    try:
        return json.loads(text)
    except ValueError:
        pass
    try:
        return yaml.safe_load(text)
    except yaml.YAMLError:
        return None
