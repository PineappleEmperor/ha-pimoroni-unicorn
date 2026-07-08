"""Pure-function tests for marketplace spec validation + compatibility + catalogue."""
import importlib.util
import sys
import types
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture(scope="module")
def mk():
    """Load marketplace with HA shims."""
    sys.path.insert(0, str(ROOT))
    for name in ("homeassistant", "homeassistant.components"):
        sys.modules.setdefault(name, types.ModuleType(name))
    pkg = types.ModuleType("custom_components")
    pkg.__path__ = [str(ROOT / "custom_components")]
    sys.modules.setdefault("custom_components", pkg)
    sub = types.ModuleType("custom_components.pimoroni_unicorn")
    sub.__path__ = [str(ROOT / "custom_components" / "pimoroni_unicorn")]
    sys.modules.setdefault("custom_components.pimoroni_unicorn", sub)
    spec = importlib.util.spec_from_file_location(
        "custom_components.pimoroni_unicorn.marketplace",
        ROOT / "custom_components" / "pimoroni_unicorn" / "marketplace.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = mod
    spec.loader.exec_module(mod)
    return mod


def test_validate_spec_accepts_valid(mk):
    assert mk.validate_spec({"id": "x", "draw": [{"op": "rect", "x": 0, "y": 0, "w": 1, "h": 1}]}) is None


@pytest.mark.parametrize("spec", [
    {"draw": []},                                   # missing id
    {"id": "x"},                                     # missing draw
    {"id": "x", "draw": [{"op": "bogus"}]},          # unknown op
    {"id": "x", "draw": "notalist"},                 # draw not a list
])
def test_validate_spec_rejects(mk, spec):
    assert isinstance(mk.validate_spec(spec), str)


def test_compatible(mk):
    assert mk.compatible(None, "stellar") is True          # no constraint = universal
    assert mk.compatible(["stellar"], "stellar") is True
    assert mk.compatible(["cosmic"], "stellar") is False


def test_builtin_catalogues_nonempty(mk):
    ids = {w["id"] for w in mk.builtin_widgets()}
    assert {"clock", "icon"} <= ids
    assert isinstance(mk.builtin_overlays(), list)
    layouts = mk.builtin_layouts()
    assert layouts  # keyed by display name; each carries a model
    assert {v["model"] for v in layouts.values()} <= {"galactic", "cosmic", "stellar"}


def test_device_path(mk):
    assert mk.device_path("icons.py").endswith("/icons.py")


def test_device_diff(mk):
    # Device reports an old clock hash + is missing others -> diff flags them.
    manifest = {"engine_version": "1.7.0", "files": {"widget_clock": "deadbeef"}}
    diff = mk.device_diff(manifest)
    assert isinstance(diff, list) and diff
    assert all("id" in d and "status" in d for d in diff)


def test_layout_requires(mk):
    lay = {"widgets": [{"id": "clock", "cfg": {}}]}
    reqs = mk.layout_requires(lay)
    assert isinstance(reqs, list)


def test_resolve_install_clock(mk):
    files = mk.resolve_install("clock")
    assert files and files[0][0].endswith("widget_clock.py")


def test_save_and_delete_custom(mk, tmp_path):
    spec = {"id": "mine", "label": "Mine", "draw": [{"op": "pixel", "x": 0, "y": 0}]}
    wid = mk.save_custom(str(tmp_path), spec)
    assert wid == "mine"
    got = {w["id"] for w in mk.custom_widgets(mk.widgets_dir(str(tmp_path)))}
    assert "mine" in got
    mk.delete_custom(str(tmp_path), "mine")
    assert "mine" not in {w["id"] for w in mk.custom_widgets(mk.widgets_dir(str(tmp_path)))}
