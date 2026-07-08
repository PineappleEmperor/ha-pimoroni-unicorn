"""Unit test for render_service.first_frame_png (pure, no HA harness)."""
import base64
import io

import pytest


@pytest.fixture(scope="module")
def rs():
    """The real render_service (Home Assistant is installed in the test env)."""
    from custom_components.pimoroni_unicorn import render_service
    return render_service


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
