"""Websocket API backing the layout editor panel."""

import base64
import binascii
import json

import voluptuous as vol
import yaml

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import device_registry as dr

from . import firmware_install, lametric, layout, marketplace, render_service
from .const import (
    CONF_DEVICE_ID,
    CONF_MODEL,
    CONF_ORIENTATION,
    DOMAIN,
    UNICORN_MODEL_KEYS,
)

ORIENTATION_ANGLES = [0, 90, 180, 270]


def _orientation(entry) -> int:
    """Device's configured mounting orientation in degrees (0 default)."""
    try:
        return int({**entry.data, **entry.options}.get(CONF_ORIENTATION, 0) or 0)
    except (ValueError, TypeError):
        return 0

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
WS_WIDGET_THUMBS  = "pimoroni_unicorn/widget_thumbs"
WS_WIDGET_SAVE    = "pimoroni_unicorn/widget_save"
WS_WIDGET_IMPORT  = "pimoroni_unicorn/widget_import"
WS_WIDGET_DELETE  = "pimoroni_unicorn/widget_delete"
WS_CONTENT        = "pimoroni_unicorn/content_catalog"
WS_DEPLOY_LAYOUT  = "pimoroni_unicorn/deploy_layout"
WS_DEPLOY_SCREENSET = "pimoroni_unicorn/deploy_screenset"
WS_PUBLISH_LAYOUT = "pimoroni_unicorn/publish_layout"
WS_SAVE_SCREENSET = "pimoroni_unicorn/save_screenset"
WS_DELETE_SCREENSET = "pimoroni_unicorn/delete_screenset"
WS_ICONS          = "pimoroni_unicorn/icons"
WS_ICON_INSTALL   = "pimoroni_unicorn/icon_install"
WS_ICON_UPLOAD    = "pimoroni_unicorn/icon_upload"
WS_ICON_URL       = "pimoroni_unicorn/icon_url"
WS_ICON_DECODE    = "pimoroni_unicorn/icon_decode"
WS_ICON_REMOVE    = "pimoroni_unicorn/icon_remove"
WS_ICON_PUSH      = "pimoroni_unicorn/icon_push"
WS_ICON_DEV_REMOVE = "pimoroni_unicorn/icon_device_remove"
WS_FONTS          = "pimoroni_unicorn/fonts"
WS_FONT_PREVIEW   = "pimoroni_unicorn/font_preview"
WS_FONT_INSTALL   = "pimoroni_unicorn/font_install"


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register all layout-editor websocket commands (once)."""
    for handler in (ws_devices, ws_capabilities, ws_layouts, ws_render,
                    ws_save_layout, ws_push_layout, ws_delete_layout, ws_push_screens,
                    ws_catalog, ws_fw_manifest, ws_fw_install, ws_fw_remove,
                    ws_widget_preview, ws_widget_thumbs, ws_widget_save, ws_widget_import, ws_widget_delete,
                    ws_content_catalog, ws_deploy_layout, ws_deploy_screenset,
                    ws_publish_layout, ws_save_screenset, ws_delete_screenset, ws_icons,
                    ws_icon_install, ws_icon_upload, ws_icon_url, ws_icon_decode,
                    ws_icon_remove, ws_icon_push, ws_icon_device_remove,
                    ws_fonts, ws_font_preview, ws_font_install):
        websocket_api.async_register_command(hass, handler)


def _entry(hass, entry_id):
    return hass.config_entries.async_get_entry(entry_id)


def _preview_state(hass, msg):
    """Mirror the device's live values in the Designer preview when an entry is selected."""
    entry = _entry(hass, msg["entry_id"]) if msg.get("entry_id") else None
    if entry is None or not entry.runtime_data:
        return {"weather": msg["weather"]} if msg.get("weather") else None
    # Local import: __init__ imports this module at top level, so a top-level
    # `from . import live_state` would import a half-initialised package.
    from . import live_state  # noqa: PLC0415

    state = live_state(hass, entry)
    if msg.get("weather"):
        state["weather"] = msg["weather"]
    return state


def _model_key(entry) -> str:
    raw = {**entry.data, **entry.options}.get(CONF_MODEL, "")
    model = UNICORN_MODEL_KEYS.get(raw, raw)  # stored display label -> dims key (pass through if already a key)
    return model if model in render_service.MODEL_DIMS else "galactic"


def _device_dims(hass, entry_id: str) -> tuple[int, int]:
    """A device's on-screen (w, h) at its configured model + orientation; (0, 0) if unknown."""
    entry = _entry(hass, entry_id)
    if entry is None:
        return (0, 0)
    return render_service.oriented_dims(_model_key(entry), _orientation(entry))


def _oversize_targets(hass, w: int, h: int, entry_ids) -> list[str]:
    """Target device labels whose screen is smaller than a w×h icon (entry_ids None = all)."""
    out = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        if entry_ids is not None and entry.entry_id not in entry_ids:
            continue
        dw, dh = render_service.oriented_dims(_model_key(entry), _orientation(entry))
        if w > dw or h > dh:
            out.append(f"{entry.title or entry.entry_id} ({dw}×{dh})")
    return out


def _safe_render(fn, *args):
    """Render, returning None on failure — one bad unit mustn't break a catalogue."""
    try:
        return fn(*args)
    except Exception:  # noqa: BLE001
        return None


@websocket_api.websocket_command({vol.Required("type"): WS_DEVICES})
@callback
def ws_devices(hass, connection, msg):
    """List configured Pimoroni Unicorn devices."""
    dev_reg = dr.async_get(hass)
    devices = []
    for entry in hass.config_entries.async_entries(DOMAIN):
        opts = {**entry.data, **entry.options}
        regs = dr.async_entries_for_config_entry(dev_reg, entry.entry_id)
        devices.append({
            "entry_id":  entry.entry_id,
            "device_id": opts.get(CONF_DEVICE_ID, ""),
            "registry_id": regs[0].id if regs else "",
            "model":     _model_key(entry),
            "name":      entry.title,
            "active_layout": opts.get(layout.CONF_ACTIVE_LAYOUT),
            "orientation": _orientation(entry),
        })
    connection.send_result(msg["id"], {"devices": devices})


@websocket_api.websocket_command({
    vol.Required("type"): WS_CAPABILITIES,
    vol.Optional("entry_id"): str,
    vol.Optional("model"): vol.In(list(render_service.MODEL_DIMS)),
    vol.Optional("orientation"): vol.In(ORIENTATION_ANGLES),
})
@websocket_api.async_response
async def ws_capabilities(hass, connection, msg):
    """Widget catalogue (backend built-ins + HA custom widgets) + oriented default layout + dims."""
    entry = _entry(hass, msg["entry_id"]) if msg.get("entry_id") else None
    model = _model_key(entry) if entry is not None else msg.get("model", "galactic")
    orientation = msg["orientation"] if "orientation" in msg else (
        _orientation(entry) if entry is not None else 0)
    custom_dir = marketplace.widgets_dir(hass.config.config_dir)

    def _caps():
        return (render_service.layout_capabilities(custom_dir),
                render_service.default_layout(model, orientation))

    caps, default_layout = await hass.async_add_executor_job(_caps)
    connection.send_result(msg["id"], {
        "model": model,
        "orientation": orientation,
        "dims": list(render_service.oriented_dims(model, orientation)),
        "widgets": caps.get("widgets", []),
        "overlays": caps.get("overlays", []),
        "default_layout": default_layout,
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
    vol.Optional("orientation", default=0): vol.In(ORIENTATION_ANGLES),
    vol.Optional("weather"): vol.Any(None, str),
    vol.Optional("entry_id"): str,
})
@websocket_api.async_response
async def ws_render(hass, connection, msg):
    """Render a layout to animated base64 PNG frames using the device's own render code."""
    installed = await lametric.async_get_registry(hass)
    orientation = msg["orientation"]
    state = _preview_state(hass, msg)
    frames = await hass.async_add_executor_job(
        render_service.render_layout_frames, msg["model"], msg["layout"], installed, 8, 200,
        orientation, state)
    boxes = render_service.layout_boxes(msg["layout"])
    dims = list(render_service.oriented_dims(msg["model"], orientation))
    connection.send_result(msg["id"], {
        "png": frames[0], "frames": frames, "boxes": boxes, "dims": dims})


@websocket_api.websocket_command({
    vol.Required("type"): WS_SAVE_LAYOUT,
    vol.Required("name"): str,
    vol.Required("layout"): dict,
})
@websocket_api.async_response
async def ws_save_layout(hass, connection, msg):
    """Store a named layout in the library (no device needed; does not push)."""
    await layout.async_save_layout(hass, msg["name"], msg["layout"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_PUSH_LAYOUT,
    vol.Required("entry_id"): str,
    vol.Required("layout"): dict,
    vol.Optional("set_active", default=False): bool,
    vol.Optional("name"): str,
})
@websocket_api.async_response
async def ws_push_layout(hass, connection, msg):
    """Push a layout to a device (live preview); optionally mark it the active page."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    await layout.async_push_layout(hass, layout.entry_device_id(entry), msg["layout"])
    if msg["set_active"] and msg.get("name"):
        hass.config_entries.async_update_entry(
            entry, options={**entry.options, layout.CONF_ACTIVE_LAYOUT: msg["name"]})
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
    entry = _entry(hass, entry_id)
    return (entry.runtime_data or {}).get("fw_manifest") if entry else None


@websocket_api.websocket_command({
    vol.Required("type"): WS_CATALOG,
    vol.Optional("entry_id"): str,
})
@websocket_api.async_response
async def ws_catalog(hass, connection, msg):
    """Catalogue of installable widgets (built-in + custom) with status + thumbnails."""
    manifest = _fw_manifest(hass, msg["entry_id"]) if msg.get("entry_id") else None
    custom = marketplace.widgets_dir(hass.config.config_dir)
    widgets = marketplace.device_diff(manifest, custom)
    model = _model_key(_entry(hass, msg["entry_id"])) if msg.get("entry_id") else "galactic"
    installed_icons = await lametric.async_get_registry(hass)

    def _thumbs():
        return {w["id"]: _safe_render(render_service.render_unit_thumb, model, w["id"], installed_icons)
                for w in widgets}

    thumbs = await hass.async_add_executor_job(_thumbs)
    connection.send_result(msg["id"], {
        "widgets": [{**w, "thumb": thumbs.get(w["id"])} for w in widgets]})


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
    vol.Optional("weather"): vol.Any(None, str),
})
@websocket_api.async_response
async def ws_widget_preview(hass, connection, msg):
    """Render a declarative widget spec to animated base64 PNG frames."""
    err = marketplace.validate_spec(msg["spec"])
    if err:
        connection.send_error(msg["id"], "invalid", err)
        return
    state = {"weather": msg["weather"]} if msg.get("weather") else None
    frames = await hass.async_add_executor_job(
        render_service.render_widget_frames, msg["model"], msg["spec"], None, 8, 200, state)
    connection.send_result(msg["id"], {"png": frames[0], "frames": frames})


@websocket_api.websocket_command({
    vol.Required("type"): WS_WIDGET_THUMBS,
    vol.Required("model"): vol.In(list(render_service.MODEL_DIMS)),
})
@websocket_api.async_response
async def ws_widget_thumbs(hass, connection, msg):
    """Per-built-in-widget thumbnails for the add-widget grid (model-only, works in Mock)."""
    installed = await lametric.async_get_registry(hass)
    caps = await hass.async_add_executor_job(render_service.layout_capabilities, None)
    ids = [w["id"] for w in caps.get("widgets", [])]
    thumbs: dict[str, str] = {}
    for wid in ids:
        thumb = await hass.async_add_executor_job(
            render_service.render_unit_thumb, msg["model"], wid, installed)
        if thumb:
            thumbs[wid] = thumb
    connection.send_result(msg["id"], {"thumbs": thumbs})


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
    builtin = marketplace.builtin_layouts()
    pages = {**builtin, **published}            # published wins on a name clash
    thumb_source = {**builtin, **all_layouts}
    model = None
    active_page = None
    if msg.get("entry_id"):
        entry = _entry(hass, msg["entry_id"])
        if entry is not None:
            model = _model_key(entry)
            active_page = ((entry.runtime_data or {}).get("diag") or {}).get("page")

    # Thumbnail every catalogue page + the first page of each screenset.
    installed_icons = await lametric.async_get_registry(hass)
    thumb_names = set(pages) | {
        ss["layouts"][0] for ss in screensets.values() if ss.get("layouts")}

    def _thumbs():
        out = {}
        for name in thumb_names:
            lay = thumb_source.get(name)
            if lay:
                png = _safe_render(render_service.render_layout_png,
                                   lay.get("model", "galactic"), lay, installed_icons)
                if png:
                    out[name] = png
        return out

    thumbs = await hass.async_add_executor_job(_thumbs)

    def _tag(units, first_key=None):
        out = []
        for u in units:
            key = u["id"] if first_key is None else (u.get(first_key) or [None])[0]
            out.append({**u, "compatible": marketplace.compatible(u["compat"], model),
                        "thumb": thumbs.get(key)})
        return out

    connection.send_result(msg["id"], {
        "model": model,
        "active_page": active_page,
        "layouts": _tag(marketplace.layout_units(pages, custom)),
        "screensets": _tag(marketplace.screenset_units(screensets, all_layouts), first_key="layouts"),
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
    lay = (await layout.async_get_registry(hass)).get(msg["name"]) or marketplace.builtin_layouts().get(msg["name"])
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
    vol.Required("name"): str,
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
    ss = screensets.get(msg["name"])
    if ss is None:
        connection.send_error(msg["id"], "not_found", "Unknown screenset")
        return
    all_layouts = await layout.async_get_registry(hass)
    unit = marketplace.screenset_unit(msg["name"], ss, all_layouts)
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
    vol.Required("name"): str,
    vol.Required("screenset"): dict,
})
@websocket_api.async_response
async def ws_save_screenset(hass, connection, msg):
    """Store a screenset (referenced apps + rotation + triggers)."""
    await layout.async_save_screenset(hass, msg["name"], msg["screenset"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_DELETE_SCREENSET,
    vol.Required("name"): str,
})
@websocket_api.async_response
async def ws_delete_screenset(hass, connection, msg):
    """Remove a stored screenset."""
    await layout.async_remove_screenset(hass, msg["name"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_ICONS,
    vol.Optional("entry_id"): str,
})
@websocket_api.async_response
async def ws_icons(hass, connection, msg):
    """Engine built-ins + installed LaMetric/custom + thumbs; per-device installed when entry_id given."""
    registry = await lametric.async_get_registry(hass)
    installed = sorted(registry.keys())

    def _thumbs():
        return {n: render_service.render_icon_thumb(registry[n]) for n in installed}

    thumbs = await hass.async_add_executor_job(_thumbs)
    dims = {n: [int(registry[n].get("w", 8)), int(registry[n].get("h", 8))] for n in installed}
    device_installed = []
    if msg.get("entry_id"):
        files = (_fw_manifest(hass, msg["entry_id"]) or {}).get("files") or {}
        device_installed = [n for n in installed if f"{n}.json" in files]
    connection.send_result(msg["id"], {
        "builtin": render_service.builtin_icon_names(),
        "installed": installed,
        "thumbs": thumbs,
        "dims": dims,
        "device_installed": device_installed,
    })


@websocket_api.websocket_command({
    vol.Required("type"): WS_ICON_INSTALL,
    vol.Required("code"): vol.Coerce(int),
    vol.Required("name"): str,
    vol.Optional("entry_ids"): [str],
})
@websocket_api.async_response
async def ws_icon_install(hass, connection, msg):
    """Fetch a LaMetric gallery icon by code and install it on the chosen devices."""
    icon = await lametric.async_fetch_icon(hass, msg["code"])
    if not icon:
        connection.send_error(msg["id"], "fetch_failed", "Could not fetch that LaMetric icon code")
        return
    sent = await lametric.async_install_icon(hass, msg["name"], icon, msg.get("entry_ids"))
    connection.send_result(msg["id"], {"ok": True, "sent": sent})


def _icon_meta(icon: dict) -> dict:
    """Size + frame-kept info for the panel to report after an import."""
    return {"w": icon.get("w"), "h": icon.get("h"),
            "n_total": icon.get("n_total"), "n_kept": icon.get("n_kept")}


def _oversize_blocked(hass, connection, msg, icon) -> bool:
    """Send an oversize error and return True if the icon is too big for a target device."""
    if msg.get("allow_oversize"):
        return False
    blocked = _oversize_targets(hass, int(icon["w"]), int(icon["h"]), msg.get("entry_ids"))
    if not blocked:
        return False
    connection.send_error(msg["id"], "oversize",
        f"{icon['w']}×{icon['h']} is larger than: {', '.join(blocked)}. "
        "Reduce the size, or enable test mode to push it anyway.")
    return True


@websocket_api.websocket_command({
    vol.Required("type"): WS_ICON_UPLOAD,
    vol.Required("name"): str,
    vol.Required("data"): str,
    vol.Optional("max_w"): vol.Coerce(int),
    vol.Optional("max_h"): vol.Coerce(int),
    vol.Optional("allow_oversize"): bool,
    vol.Optional("entry_ids"): [str],
})
@websocket_api.async_response
async def ws_icon_upload(hass, connection, msg):
    """Decode an uploaded image/GIF, fit it to the chosen size, and install it."""
    try:
        raw = base64.b64decode(msg["data"], validate=True)
    except (ValueError, binascii.Error):
        connection.send_error(msg["id"], "bad_image", "Could not decode the uploaded image")
        return
    if len(raw) > lametric.MAX_UPLOAD_BYTES:
        connection.send_error(msg["id"], "too_large", "That image file is too large")
        return
    icon = await lametric.async_decode_upload(hass, raw, msg.get("max_w"), msg.get("max_h"))
    if not icon:
        connection.send_error(msg["id"], "decode_failed", "Could not read that image")
        return
    if _oversize_blocked(hass, connection, msg, icon):
        return
    sent = await lametric.async_install_icon(hass, msg["name"], icon, msg.get("entry_ids"))
    connection.send_result(msg["id"], {"ok": True, "sent": sent, **_icon_meta(icon)})


@websocket_api.websocket_command({
    vol.Required("type"): WS_ICON_URL,
    vol.Required("name"): str,
    vol.Required("url"): str,
    vol.Optional("max_w"): vol.Coerce(int),
    vol.Optional("max_h"): vol.Coerce(int),
    vol.Optional("allow_oversize"): bool,
    vol.Optional("entry_ids"): [str],
})
@websocket_api.async_response
async def ws_icon_url(hass, connection, msg):
    """Fetch an image/GIF by URL, fit it to the chosen size, and install it."""
    icon = await lametric.async_fetch_image(hass, msg["url"], msg.get("max_w"), msg.get("max_h"))
    if not icon:
        connection.send_error(msg["id"], "fetch_failed", "Could not fetch or read that image URL")
        return
    if _oversize_blocked(hass, connection, msg, icon):
        return
    sent = await lametric.async_install_icon(hass, msg["name"], icon, msg.get("entry_ids"))
    connection.send_result(msg["id"], {"ok": True, "sent": sent, **_icon_meta(icon)})


@websocket_api.websocket_command({
    vol.Required("type"): WS_ICON_DECODE,
    vol.Optional("data"): str,
    vol.Optional("url"): str,
    vol.Optional("max_w"): vol.Coerce(int),
    vol.Optional("max_h"): vol.Coerce(int),
})
@websocket_api.async_response
async def ws_icon_decode(hass, connection, msg):
    """Decode a source image (upload or URL) to a PNG for the editor canvas; no install."""
    if msg.get("data"):
        try:
            raw = base64.b64decode(msg["data"], validate=True)
        except (ValueError, binascii.Error):
            connection.send_error(msg["id"], "bad_image", "Could not decode the uploaded image")
            return
        if len(raw) > lametric.MAX_UPLOAD_BYTES:
            connection.send_error(msg["id"], "too_large", "That image file is too large")
            return
        icon = await lametric.async_decode_upload(hass, raw, msg.get("max_w"), msg.get("max_h"))
    elif msg.get("url"):
        icon = await lametric.async_fetch_image(hass, msg["url"], msg.get("max_w"), msg.get("max_h"))
    else:
        connection.send_error(msg["id"], "no_source", "Provide data or url")
        return
    if not icon:
        connection.send_error(msg["id"], "decode_failed", "Could not read that image")
        return
    png = render_service.first_frame_png(icon)
    if not png:
        connection.send_error(msg["id"], "decode_failed", "Could not read that image")
        return
    connection.send_result(msg["id"], {"png": png, "w": icon["w"], "h": icon["h"]})


@websocket_api.websocket_command({
    vol.Required("type"): WS_ICON_REMOVE,
    vol.Required("name"): str,
})
@websocket_api.async_response
async def ws_icon_remove(hass, connection, msg):
    """Remove an installed custom/LaMetric icon from the registry and every device."""
    await lametric.async_remove_icon(hass, msg["name"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_ICON_PUSH,
    vol.Required("entry_id"): str,
    vol.Required("name"): str,
    vol.Optional("allow_oversize"): bool,
})
@websocket_api.async_response
async def ws_icon_push(hass, connection, msg):
    """Install an already-registered icon onto a single device (blocks oversize by default)."""
    if not msg.get("allow_oversize"):
        icon = (await lametric.async_get_registry(hass)).get(msg["name"])
        if icon:
            dw, dh = _device_dims(hass, msg["entry_id"])
            if int(icon.get("w", 8)) > dw or int(icon.get("h", 8)) > dh:
                connection.send_error(msg["id"], "oversize",
                    f"{msg['name']} ({icon.get('w')}×{icon.get('h')}) is larger than this "
                    f"device ({dw}×{dh}). Enable test mode to push it anyway.")
                return
    ok = await lametric.async_push_icon_to_device(hass, msg["name"], msg["entry_id"])
    connection.send_result(msg["id"], {"ok": ok})


@websocket_api.websocket_command({
    vol.Required("type"): WS_ICON_DEV_REMOVE,
    vol.Required("entry_id"): str,
    vol.Required("name"): str,
})
@websocket_api.async_response
async def ws_icon_device_remove(hass, connection, msg):
    """Remove an icon from a single device, keeping it in the registry for others."""
    await lametric.async_remove_icon_from_device(hass, msg["name"], msg["entry_id"])
    connection.send_result(msg["id"], {"ok": True})


@websocket_api.websocket_command({
    vol.Required("type"): WS_FONTS,
    vol.Optional("entry_id"): str,
})
@callback
def ws_fonts(hass, connection, msg):
    """Marketplace font catalog; per-device install state when entry_id is given."""
    specs = render_service.font_specs()
    files = (_fw_manifest(hass, msg["entry_id"]) or {}).get("files") or {} if msg.get("entry_id") else {}
    for s in specs:
        df = s.get("device_file")
        s["installed"] = (df in files) if df else True  # built-in alpha fonts always present
    connection.send_result(msg["id"], {"fonts": specs})


@websocket_api.websocket_command({
    vol.Required("type"): WS_FONT_INSTALL,
    vol.Required("entry_id"): str,
    vol.Required("font"): str,
})
@websocket_api.async_response
async def ws_font_install(hass, connection, msg):
    """Install a single font unit onto a device (hot-loaded, no reboot)."""
    entry = _entry(hass, msg["entry_id"])
    if entry is None:
        connection.send_error(msg["id"], "not_found", "Unknown device")
        return
    ok = await firmware_install.async_install_font(hass, entry, msg["font"])
    connection.send_result(msg["id"], {"ok": ok})


@websocket_api.websocket_command({
    vol.Required("type"): WS_FONT_PREVIEW,
    vol.Required("font"): vol.In([s["name"] for s in render_service.FONT_SPECS]),
    vol.Required("text"): str,
    vol.Optional("color"): [vol.Coerce(int)],
})
@websocket_api.async_response
async def ws_font_preview(hass, connection, msg):
    """Render arbitrary text in a font to a content-sized base64 PNG (type-to-preview)."""
    color = tuple(msg.get("color") or (255, 255, 255))[:3]
    png = await hass.async_add_executor_job(
        render_service.render_text_png, msg["font"], msg["text"], color)
    connection.send_result(msg["id"], {"png": png})


def _parse_spec_text(text: str):
    try:
        return json.loads(text)
    except ValueError:
        pass
    try:
        return yaml.safe_load(text)
    except yaml.YAMLError:
        return None
