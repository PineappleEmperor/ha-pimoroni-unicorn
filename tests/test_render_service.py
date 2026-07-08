"""Exercise the byte-faithful render service across its public surface (no device, no hass)."""
import base64
import importlib.util
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


def _png_size(b64: str):
    from PIL import Image
    import io
    return Image.open(io.BytesIO(base64.b64decode(b64))).size


@pytest.mark.parametrize("model,dims", [
    ("galactic", (53, 11)), ("cosmic", (32, 32)), ("stellar", (16, 16)),
])
def test_oriented_dims(rs, model, dims):
    assert rs.oriented_dims(model) == dims


def test_oriented_dims_rotation_swaps(rs):
    assert rs.oriented_dims("galactic", 90) == (11, 53)
    assert rs.oriented_dims("galactic", 270) == (11, 53)


def test_fit_scale_positive(rs):
    assert rs.fit_scale("stellar") >= 1
    assert rs.fit_scale("galactic", target=512) >= 1


def test_default_layout_per_model(rs):
    for model in ("galactic", "cosmic", "stellar"):
        lay = rs.default_layout(model)
        assert isinstance(lay.get("widgets"), list)
    assert rs.default_layout("galactic", 90)["name"].endswith("vertical")


def test_builtin_icon_names_is_list(rs):
    assert isinstance(rs.builtin_icon_names(), list)


def test_font_specs_have_keys(rs):
    specs = rs.font_specs()
    assert specs and all("name" in s and "label" in s for s in specs)


def test_map_owm(rs):
    assert isinstance(rs.map_owm(800), str)
    assert rs.map_owm("nonsense") == "clear"


def test_layout_boxes_matches_widget_count(rs):
    lay = rs.default_layout("galactic")
    boxes = rs.layout_boxes(lay)
    assert len(boxes) == len(lay["widgets"])
    assert all(len(b) == 2 for b in boxes)


def test_render_layout_png_dims(rs):
    png = rs.render_layout_png("cosmic", rs.default_layout("cosmic"))
    assert _png_size(png) == (32, 32)


def test_render_layout_png_scaled(rs):
    png = rs.render_layout_png("stellar", rs.default_layout("stellar"), scale=4)
    assert _png_size(png) == (64, 64)


def test_render_layout_frames_count(rs):
    frames = rs.render_layout_frames("stellar", rs.default_layout("stellar"), n=3, step_ms=100)
    assert len(frames) == 3
    assert all(_png_size(f) == (16, 16) for f in frames)


def test_render_widget_png(rs):
    spec = {"w": 16, "h": 5, "draw": [{"op": "rect", "x": 0, "y": 0, "w": 3, "h": 3}]}
    assert _png_size(rs.render_widget_png("galactic", spec))[0] > 0


def test_render_unit_thumb_known_widget(rs):
    thumb = rs.render_unit_thumb("cosmic", "clock")
    assert thumb is None or isinstance(thumb, str)


def test_render_text_png_alpha_and_digit(rs):
    assert _png_size(rs.render_text_png("font3x5", "HI"))[1] == 5
    assert _png_size(rs.render_text_png("digits", "12"))[1] == 5


def test_render_text_png_unknown_font_raises(rs):
    with pytest.raises(ValueError):
        rs.render_text_png("nope", "1")


def test_render_icon_thumb_animated_gif(rs):
    frames = [base64.b64encode(bytes([80 * i, 0, 0] * 64)).decode() for i in (1, 2, 3)]
    icon = {"frames": frames, "durations": [100, 100, 100], "w": 8, "h": 8}
    out = rs.render_icon_thumb(icon)
    from PIL import Image
    import io
    img = Image.open(io.BytesIO(base64.b64decode(out)))
    assert img.format == "GIF"
    assert getattr(img, "n_frames", 1) == 3
