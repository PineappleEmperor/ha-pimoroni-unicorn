"""Pixel-level checks on the notification text renderer: faces, bold spacing, counters.

The stub graphics in conftest is permissive and does not draw, so these swap in the
byte-faithful render/ shim — the same PicoGraphics stand-in the HA preview uses.
"""
from __future__ import annotations

import importlib
import pathlib
import sys

import pytest

# Imported as a TOP-LEVEL `render` package, not via custom_components.pimoroni_unicorn:
# that package's __init__ pulls in homeassistant, which the firmware job does not install.
sys.path.append(str(pathlib.Path(__file__).resolve().parents[2]
                    / "custom_components" / "pimoroni_unicorn"))
from render.shim import PicoGraphics  # noqa: E402

WIDTH, HEIGHT = 53, 11
EXPECTED_FACES = ["bitmap8", "font3x5", "font5x9", "heavy"]


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


def test_engine_declares_the_expected_faces(na):
    """Pins the engine side; test_notify.py checks it against the service schema."""
    assert sorted(na._TEXT_FACES) == EXPECTED_FACES


def test_every_face_renders_something(na):
    for font in EXPECTED_FACES:
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


def test_heavy_face_has_no_baked_in_sidebearings():
    """Every glyph's ink must fill its cell, so the advance is ink width + one gap."""
    # A glyph whose cell is wider than its ink adds a second blank column between it and
    # the next letter: 'Ocado' rendered c->a at 2px while every other pair sat at 1px.
    bitfonts = importlib.import_module("bitfonts")
    offenders = []
    for char, glyph in bitfonts.font_heavy.items():
        width, height = glyph["w"], glyph["h"]
        cols = [c for c in range(width) for r in range(height)
                if glyph["data"] & (1 << ((height - 1 - r) * width + (width - 1 - c)))]
        if not cols:
            continue
        if min(cols) != 0 or max(cols) != width - 1:
            offenders.append((char, min(cols), width - 1 - max(cols)))
    assert not offenders, f"glyphs padded inside their cell (char, padL, padR): {offenders}"


def test_heavy_face_letter_gaps_are_uniform(na):
    """Adjacent letters sit exactly one blank column apart, whatever the pair."""
    face = na._TEXT_FACES["heavy"]
    for word in ("Ocado", "Hello", "kick", "often", "fluffy"):
        cols = _render(na, word, {"font": "heavy"})
        lit = [i for i, col in enumerate(cols) if any(col)]
        runs, prev = [], None
        for i in lit:
            if prev is not None and i - prev > 1:
                runs.append(i - prev - 1)
            prev = i
        assert all(g == 1 for g in runs), f"{word}: gap widths {runs}"
    assert face is not None


def _layout(na, width, notif):
    """Run _notify_layout against a panel of the given width."""
    prev = na._width
    na._width = width
    try:
        return na._notify_layout(notif, na._text_style(notif))
    finally:
        na._width = prev


def test_stellar_drops_text_it_cannot_scroll(na):
    """16x16 leaves 7px beside an 8px icon, so a long message yields the icon alone."""
    *_, show_text = _layout(na, 16, {"icon": "bell", "text": "Back door opened"})
    assert show_text is False


def test_stellar_keeps_text_that_actually_fits(na):
    """The rule must not swallow a message short enough to render — that reads as a bug."""
    *_, show_text = _layout(na, 16, {"icon": "bell", "text": "Hi", "font": "font3x5"})
    assert show_text is True


def test_stellar_without_an_icon_uses_the_whole_panel(na):
    ix, panel_w, tx, tw, show_text = _layout(na, 16, {"text": "Back door opened"})
    assert (tx, tw, show_text) == (0, 16, True)
    assert panel_w == 0


@pytest.mark.parametrize("width", [32, 53])
def test_larger_panels_still_scroll_beside_the_icon(na, width):
    """Only panels too narrow to scroll drop text; Cosmic and Galactic are unaffected."""
    *_, tw, show_text = _layout(na, width, {"icon": "bell", "text": "Back door opened"})[1:]
    assert show_text is True
    assert tw >= na._MIN_SCROLL_W


def test_suppressed_text_centres_the_icon(na):
    """icon_position has no meaning once the icon is the whole notification."""
    left = _layout(na, 16, {"icon": "bell", "text": "Back door opened"})
    right = _layout(na, 16, {"icon": "bell", "text": "Back door opened",
                             "icon_position": "right"})
    assert left[0] == right[0] == (16 - 8) // 2


def test_duration_does_not_wait_for_text_it_never_draws(na):
    """A Stellar must not sit on a static icon for a scroll that was suppressed."""
    # duration=1 puts the floor well below the scroll time, so a suppressed text is the
    # only way this can come back as 1000ms. With the floor at 10s both branches collide.
    notif = {"v": 2, "icon": "bell", "duration": 1,
             "text": "a much longer message than the panel could ever show at once"}
    prev = na._width
    na._width = 16
    try:
        stellar = na.compute_duration_ms(notif)
    finally:
        na._width = prev
    galactic = na.compute_duration_ms(notif)
    assert stellar == 1_000, "suppressed text must not extend the display time"
    assert galactic > stellar
