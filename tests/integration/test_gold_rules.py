"""Behavioural proofs for the Gold quality-scale rules (hassfest can't check these)."""
from __future__ import annotations

import json
import re
import types
from pathlib import Path

import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

import custom_components.pimoroni_unicorn as pu
from custom_components.pimoroni_unicorn.const import CONF_DEVICE_ID, CONF_MODEL, DOMAIN
from custom_components.pimoroni_unicorn.diagnostics import (
    async_get_config_entry_diagnostics,
)
from homeassistant.core import HomeAssistant

_PKG = Path(pu.__file__).parent


@pytest.fixture
def expected_lingering_timers() -> bool:
    return True


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, unique_id="dev1",
                            data={CONF_DEVICE_ID: "dev1", CONF_MODEL: "Galactic Unicorn"})
    entry.add_to_hass(hass)
    await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_diagnostics_redacts_identifiers(hass: HomeAssistant, mqtt_mock) -> None:
    entry = await _setup(hass)
    diag = await async_get_config_entry_diagnostics(hass, entry)
    dumped = str(diag)  # runtime state holds sets; str is enough to scan for leaks
    assert "**REDACTED**" in dumped
    assert "dev1" not in dumped  # device_id / unique_id redacted


async def test_stale_device_removal(hass: HomeAssistant, mqtt_mock) -> None:
    entry = await _setup(hass)
    active = types.SimpleNamespace(identifiers={("mqtt", "dev1")})
    orphan = types.SimpleNamespace(identifiers={("mqtt", "old_id")})
    assert await pu.async_remove_config_entry_device(hass, entry, active) is False
    assert await pu.async_remove_config_entry_device(hass, entry, orphan) is True


def test_translation_keys_resolve() -> None:
    """Every translation_key used in code exists in strings.json (catches typos)."""
    strings = json.loads((_PKG / "strings.json").read_text())
    available: set[str] = set()
    for section in ("exceptions", "issues"):
        available |= set(strings.get(section, {}))
    for platform in strings.get("entity", {}).values():  # entity translation keys (sensors, …)
        available |= set(platform)
    used: set[str] = set()
    for p in _PKG.glob("*.py"):
        used |= set(re.findall(r'translation_key="([^"]+)"', p.read_text()))
    missing = used - available
    assert not missing, f"translation_keys missing from strings.json: {missing}"
