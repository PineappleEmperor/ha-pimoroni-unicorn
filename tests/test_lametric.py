"""Pure-function tests for the icon decode/fit/SSRF logic (no hass)."""
import base64
import io

import pytest


@pytest.fixture(scope="module")
def lam():
    """The real lametric module (Home Assistant is installed in the test env)."""
    from custom_components.pimoroni_unicorn import lametric
    return lametric


def _png(w, h):
    from PIL import Image
    buf = io.BytesIO()
    Image.new("RGB", (w, h), (10, 20, 30)).save(buf, format="PNG")
    return buf.getvalue()


def test_fit_no_upscale(lam):
    assert lam._fit(8, 8, 53, 32) == (8, 8)


def test_fit_downscale_keeps_aspect(lam):
    assert lam._fit(100, 60, 53, 32) == (53, 32)   # width-bound
    assert lam._fit(64, 16, 16, 16) == (16, 4)     # aspect kept


def test_decode_image_fits_and_caps(lam):
    raw = _png(32, 32)
    icon = lam._decode_image(raw, 16, 16, None)
    assert (icon["w"], icon["h"]) == (16, 16)
    assert len(base64.b64decode(icon["frames"][0])) == 16 * 16 * 3


def test_decode_image_force_size(lam):
    icon = lam._decode_image(_png(32, 32), 8, 8, 8)
    assert (icon["w"], icon["h"]) == (8, 8)


@pytest.mark.parametrize("url", [
    "http://169.254.169.254/latest/meta-data/",  # link-local metadata
    "http://127.0.0.1/admin",                     # loopback
    "ftp://example.com/x",                         # bad scheme
    "http:///nohost",                              # no host
])
def test_validate_public_url_rejects(lam, url):
    # loopback/link-local resolve numerically (no DNS); bad scheme/host reject earlier.
    with pytest.raises(ValueError):
        lam._validate_public_url(url)
