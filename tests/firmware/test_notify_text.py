"""Pixel-level checks on the notification text renderer: faces, bold spacing, counters.

The stub graphics in conftest is permissive and does not draw, so these swap in the
byte-faithful render/ shim — the same PicoGraphics stand-in the HA preview uses.
"""
from __future__ import annotations

import importlib

import pytest

from custom_components.pimoroni_unicorn.const import NOTIFY_FONTS
from custom_components.pimoroni_unicorn.render.shim import PicoGraphics

WIDTH, HEIGHT = 53, 11


@pytest.fixture
def na():
    """notify_animations wired to the faithful shim instead of the drawing-free stub."""
    mod = importlib.import_module("notify_animations")
    bitfonts = importlib.import_module("bitfonts")
    graphics = PicoGraphics(WIDTH, HEIGHT)
    mod._g = graphics
    mod._bitfont = bitfonts.BitFont(graphics)
    mod._BLACK = graphics.create_pen(0, 0, 0)
    mod._width, mod._height = WIDTH, HEIGHT
    return mod


def _panel(na, text, notif, bg=(0, 0, 0), elapsed_ms=50 * WIDTH):
    """Draw text onto a fresh panel over bg; returns the raw pixel buffer."""
    graphics = PicoGraphics(WIDTH, HEIGHT)
    na._g = graphics
    na._bitfont = importlib.import_module("bitfonts").BitFont(graphics)
    na._BLACK = graphics.create_pen(0, 0, 0)
    graphics.set_pen(bg)
    graphics.clear()
    na._draw_notify_text(text, 0, 0, WIDTH, HEIGHT, (255, 255, 255), elapsed_ms,
                         na._text_style(notif))
    return graphics.buffer


def _render(na, text, notif, elapsed_ms=50 * WIDTH):
    """Column-major lit map (non-black pixels) for a notification drawn on black."""
    buf = _panel(na, text, notif, elapsed_ms=elapsed_ms)
    return [[buf[y * WIDTH + x] != (0, 0, 0) for y in range(HEIGHT)] for x in range(WIDTH)]


def test_face_names_match_the_service_schema(na):
    """The picker's options and the engine's faces must not drift apart."""
    assert sorted(na._TEXT_FACES) == sorted(NOTIFY_FONTS)


def test_every_face_renders_something(na):
    for font in NOTIFY_FONTS:
        cols = _render(na, "Hi", {"font": font})
        assert any(any(col) for col in cols), f"{font} drew nothing"


def test_bold_lights_more_pixels_than_plain(na):
    plain = sum(map(sum, _render(na, "Hello", {})))
    bold = sum(map(sum, _render(na, "Hello", {"bold": True})))
    assert bold > plain


def test_bold_widens_the_advance(na):
    """Without the widened advance the smear closes bitmap8's 1px gap (glyphs fuse)."""
    face = na._TEXT_FACES["bitmap8"]
    assert na._measure_styled("12:34", face, True) > na._measure_styled("12:34", face, False)


def test_bold_digits_stay_separated(na):
    """The regression the mockups caught: '12:34' bolded must not fuse into one blob."""
    cols = _render(na, "12:34", {"bold": True})
    lit = [i for i, col in enumerate(cols) if any(col)]
    assert lit, "nothing drawn"
    gaps = sum(1 for i in range(lit[0], lit[-1]) if not any(cols[i]))
    assert gaps >= 4, f"expected >=4 blank separator columns between 5 glyphs, got {gaps}"


@pytest.mark.parametrize("notif", [
    {"outlined": True},
    {"outlined": True, "bold": True},
    {"outlined": True, "bold": True, "font": "heavy"},
])
def test_outline_fully_encloses_the_glyph(na, notif):
    """No glyph pixel may touch the background.

    Drawn on a non-black ground so the black ring is visible: if the ring did not widen
    with the bold smear it would sit inside the glyph, leaving smeared pixels exposed.
    """
    bg = (0, 0, 255)
    buf = _panel(na, "Hi8", notif, bg=bg)
    exposed = []
    for y in range(HEIGHT):
        for x in range(WIDTH):
            if buf[y * WIDTH + x] != (255, 255, 255):
                continue
            for nx, ny in ((x+1, y), (x-1, y), (x, y+1), (x, y-1),
                           (x+1, y+1), (x-1, y-1), (x+1, y-1), (x-1, y+1)):
                if 0 <= nx < WIDTH and 0 <= ny < HEIGHT and buf[ny * WIDTH + nx] == bg:
                    exposed.append((x, y))
                    break
    assert not exposed, f"glyph pixels touching background: {exposed[:5]}"


def test_heavy_face_keeps_its_counters(na):
    """A '4' whose inner hole fills in is the exact defect the first sketch had."""
    bitfonts = importlib.import_module("bitfonts")
    glyph = bitfonts.font_heavy["4"]
    width, height = glyph["w"], glyph["h"]
    rows = [[bool(glyph["data"] & (1 << ((height - 1 - r) * width + (width - 1 - c))))
             for c in range(width)] for r in range(height)]
    outside, stack = set(), [(x, y) for y in range(height) for x in range(width)
                             if (x in (0, width - 1) or y in (0, height - 1)) and not rows[y][x]]
    outside.update(stack)
    while stack:
        x, y = stack.pop()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < width and 0 <= ny < height and not rows[ny][nx] and (nx, ny) not in outside:
                outside.add((nx, ny)); stack.append((nx, ny))
    enclosed = sum(1 for y in range(height) for x in range(width)
                   if not rows[y][x] and (x, y) not in outside)
    assert enclosed > 0, "the '4' counter is filled in"


def test_duration_defaults_to_ten_seconds(na):
    assert na.compute_duration_ms({"v": 2}) == 10_000


def test_duration_measures_the_selected_face(na):
    """A heavy notification is wider, so it must be given longer to finish scrolling."""
    long_text = "a much longer notification than the panel"
    plain = na.compute_duration_ms({"v": 2, "text": long_text})
    heavy = na.compute_duration_ms({"v": 2, "text": long_text, "font": "heavy"})
    assert heavy > plain
