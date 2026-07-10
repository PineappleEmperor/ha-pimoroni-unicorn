"""Repair-issue detection for oversize / trimmed icons on a device's active page."""
from __future__ import annotations

import homeassistant.helpers.issue_registry as ir
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.pimoroni_unicorn import problems
from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from homeassistant.core import HomeAssistant


def _stellar(hass: HomeAssistant, icons: dict, page: dict) -> MockConfigEntry:
    entry = MockConfigEntry(
        domain=DOMAIN, unique_id="dev1",
        data={CONF_DEVICE_ID: "dev1", CONF_MODEL: "Stellar Unicorn"})  # 16x16
    entry.add_to_hass(hass)
    entry.runtime_data = {"page": page}
    hass.data.setdefault(DOMAIN, {})["_icon_registry"] = icons
    return entry


async def test_oversize_icon_raises_and_clears(hass: HomeAssistant) -> None:
    """A 32x32 icon on a 16x16 device raises an oversize repair, cleared when removed."""
    page = {"widgets": [{"id": "icon", "x": 0, "y": 0, "cfg": {"icon": "big"}}]}
    entry = _stellar(hass, {"big": {"w": 32, "h": 32, "frames": ["x"]}}, page)
    await problems.async_sync_issues(hass, entry)
    reg = ir.async_get(hass)
    assert reg.async_get_issue(DOMAIN, f"{entry.entry_id}_oversize_big") is not None

    entry.runtime_data["page"] = {"widgets": []}  # icon removed from the page
    await problems.async_sync_issues(hass, entry)
    assert reg.async_get_issue(DOMAIN, f"{entry.entry_id}_oversize_big") is None


async def test_truncated_icon_raises(hass: HomeAssistant) -> None:
    """An icon whose stored frames are fewer than its source count raises a trimmed repair."""
    page = {"widgets": [{"id": "icon", "x": 0, "y": 0, "cfg": {"icon": "anim"}}]}
    entry = _stellar(hass, {"anim": {"w": 8, "h": 8, "frames": ["a", "b", "c"], "n_total": 20}}, page)
    await problems.async_sync_issues(hass, entry)
    reg = ir.async_get(hass)
    assert reg.async_get_issue(DOMAIN, f"{entry.entry_id}_truncated_anim") is not None


async def test_clean_page_no_issues(hass: HomeAssistant) -> None:
    """A well-fitting, whole icon raises nothing."""
    page = {"widgets": [{"id": "icon", "x": 0, "y": 0, "cfg": {"icon": "ok"}}]}
    entry = _stellar(hass, {"ok": {"w": 8, "h": 8, "frames": ["a", "b"], "n_total": 2}}, page)
    await problems.async_sync_issues(hass, entry)
    assert not entry.runtime_data["issue_ids"]


async def test_acked_oversize_icon_suppressed(hass: HomeAssistant) -> None:
    """An oversize icon whose widget acks 'oversize' raises no repair."""
    page = {"widgets": [{"id": "icon", "x": 0, "y": 0, "cfg": {"icon": "big"}, "ack": ["oversize"]}]}
    entry = _stellar(hass, {"big": {"w": 32, "h": 32, "frames": ["x"]}}, page)
    await problems.async_sync_issues(hass, entry)
    reg = ir.async_get(hass)
    assert reg.async_get_issue(DOMAIN, f"{entry.entry_id}_oversize_big") is None
    assert not entry.runtime_data["issue_ids"]


async def test_acked_trimmed_icon_suppressed(hass: HomeAssistant) -> None:
    """A trimmed icon whose widget acks 'trimmed' raises no repair."""
    page = {"widgets": [{"id": "icon", "x": 0, "y": 0, "cfg": {"icon": "anim"}, "ack": ["trimmed"]}]}
    entry = _stellar(hass, {"anim": {"w": 8, "h": 8, "frames": ["a", "b"], "n_total": 20}}, page)
    await problems.async_sync_issues(hass, entry)
    assert not entry.runtime_data["issue_ids"]
