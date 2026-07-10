"""Detect page/icon problems that won't render right on a device, surfaced as repair issues."""
from typing import Any

from homeassistant.core import HomeAssistant
import homeassistant.helpers.issue_registry as ir

from . import lametric, layout, render_service
from .const import (
    CONF_MODEL,
    CONF_ORIENTATION,
    DOMAIN,
    UNICORN_MODEL_KEYS,
    PUConfigEntry,
)


def _model(entry: PUConfigEntry) -> str:
    raw = {**entry.data, **entry.options}.get(CONF_MODEL, "")
    model = UNICORN_MODEL_KEYS.get(raw, raw)
    return model if model in render_service.MODEL_DIMS else "galactic"


def _orientation(entry: PUConfigEntry) -> int:
    try:
        return int({**entry.data, **entry.options}.get(CONF_ORIENTATION, 0) or 0)
    except (ValueError, TypeError):
        return 0


async def device_problems(hass: HomeAssistant, entry: PUConfigEntry) -> list[dict[str, Any]]:
    """Problems on the device's active page: oversize/trimmed icons and off-screen widgets."""
    model = _model(entry)
    orientation = _orientation(entry)
    dw, dh = render_service.oriented_dims(model, orientation)
    lay = (entry.runtime_data or {}).get("page") \
        or await layout.async_get_active(hass, entry) \
        or render_service.default_layout(model, orientation)
    registry = await lametric.async_get_registry(hass)
    boxes = await hass.async_add_executor_job(render_service.layout_boxes, lay)
    out: list[dict[str, Any]] = []
    for i, wdg in enumerate(lay.get("widgets", [])):
        if wdg.get("enabled") is False:
            continue
        wid = wdg.get("type", wdg.get("id"))
        ack = wdg.get("ack") or []
        x, y = int(wdg.get("x", 0)), int(wdg.get("y", 0))
        if wid == "icon":
            name = (wdg.get("cfg") or {}).get("icon")
            icon = registry.get(name) if name else None
            if icon:
                iw, ih = int(icon.get("w", 8)), int(icon.get("h", 8))
                if iw > dw or ih > dh:
                    if "oversize" not in ack:
                        out.append({
                            "issue_id": f"{entry.entry_id}_oversize_{name}",
                            "translation_key": "icon_oversize",
                            "placeholders": {"icon": str(name), "size": f"{iw}x{ih}", "screen": f"{dw}x{dh}"}})
                    continue
                kept = len(icon.get("frames") or [])
                total = int(icon.get("n_total", kept))
                if total > kept:
                    if "trimmed" not in ack:
                        out.append({
                            "issue_id": f"{entry.entry_id}_truncated_{name}",
                            "translation_key": "icon_truncated",
                            "placeholders": {"icon": str(name), "kept": str(kept), "total": str(total)}})
                    continue
        box = boxes[i] if i < len(boxes) else None
        if box and box[0] and box[1] and (x + box[0] > dw or y + box[1] > dh) and "offscreen" not in ack:
            out.append({
                "issue_id": f"{entry.entry_id}_overflow_{i}_{wid}",
                "translation_key": "widget_overflow",
                "placeholders": {"widget": str(wid), "screen": f"{dw}x{dh}"}})
    return out


async def async_sync_issues(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Create repair issues for the device's current problems and clear ones that are gone."""
    problems = await device_problems(hass, entry)
    current = {p["issue_id"] for p in problems}
    prev = set((entry.runtime_data or {}).get("issue_ids") or [])
    for p in problems:
        ir.async_create_issue(
            hass, DOMAIN, p["issue_id"], is_fixable=False,
            severity=ir.IssueSeverity.WARNING, translation_key=p["translation_key"],
            translation_placeholders=p["placeholders"])
    for stale in prev - current:
        ir.async_delete_issue(hass, DOMAIN, stale)
    if entry.runtime_data is not None:
        entry.runtime_data["issue_ids"] = current


def async_clear_issues(hass: HomeAssistant, entry: PUConfigEntry) -> None:
    """Delete every repair issue this entry raised (on unload)."""
    for issue_id in set((entry.runtime_data or {}).get("issue_ids") or []):
        ir.async_delete_issue(hass, DOMAIN, issue_id)
