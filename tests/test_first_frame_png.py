"""Unit test for render_service.first_frame_png (pure, no HA harness)."""
import base64
import importlib.util
import io
import sys
import types
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]


@pytest.fixture(scope="module")
def rs():
    """Load render_service with the firmware shims it imports at module top."""
    sys.path.insert(0, str(ROOT))
    for name in ("homeassistant", "homeassistant.components"):
        sys.modules.setdefault(name, types.ModuleType(name))
    pkg = types.ModuleType("custom_components")
    pkg.__path__ = [str(ROOT / "custom_components")]
    sys.modules["custom_components"] = pkg
    sub = types.ModuleType("custom_components.pimoroni_unicorn")
    sub.__path__ = [str(ROOT / "custom_components" / "pimoroni_unicorn")]
    sys.modules["custom_components.pimoroni_unicorn"] = sub
    spec = importlib.util.spec_from_file_location(
        "custom_components.pimoroni_unicorn.render_service",
        ROOT / "custom_components" / "pimoroni_unicorn" / "render_service.py")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = mod
    spec.loader.exec_module(mod)
    return mod


def _icon(w, h):
    raw = bytes([200, 100, 50] * (w * h))
    return {"frames": [base64.b64encode(raw).decode()], "w": w, "h": h}


def test_first_frame_png_dims(rs):
    from PIL import Image
    out = rs.first_frame_png(_icon(12, 5))
    img = Image.open(io.BytesIO(base64.b64decode(out)))
    assert img.format == "PNG"
    assert img.size == (12, 5)


def test_first_frame_png_none_when_empty(rs):
    assert rs.first_frame_png({"frames": [], "w": 8, "h": 8}) is None
