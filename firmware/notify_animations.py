"""Notification animation loading and rendering for the Pimoroni Unicorn."""

import random

from sounds import NOTIFY_SOUNDS
import uos

_g      = None
_width  = 0
_height = 0
_BLACK  = None

_fire_heat = None

_SCROLL_MS_PER_PX    = 50
_SPLIT_WIDTH_DEFAULT = 13

NOTIFY_ANIMATIONS   = {}
NOTIFY_CAPABILITIES = {}


def init(graphics, width, height):
    """Initialise notify_animations module with graphics context and display dimensions."""
    global _g, _width, _height, _BLACK
    _g      = graphics
    _width  = width
    _height = height
    _BLACK  = graphics.create_pen(0, 0, 0)
    NOTIFY_ANIMATIONS.clear()
    NOTIFY_ANIMATIONS.update(_load_animations())
    NOTIFY_CAPABILITIES.clear()
    NOTIFY_CAPABILITIES.update({
        "animations": list(NOTIFY_ANIMATIONS.keys()),
        "sounds":     list(NOTIFY_SOUNDS.keys()),
    })


def reset_fire_heat():
    """Reset fire heat state between notification renders."""
    global _fire_heat
    _fire_heat = None


def _get_fire_heat():
    return _fire_heat


def _set_fire_heat(val):
    global _fire_heat
    _fire_heat = val


def _hsv_to_rgb(h, s, v):
    """Convert HSV (0–1 each) to (r, g, b) 0–255."""
    if s == 0:
        c = int(v * 255)
        return c, c, c
    i = int(h * 6)
    f = h * 6 - i
    p, q, t = v * (1 - s), v * (1 - f * s), v * (1 - (1 - f) * s)
    i %= 6
    if i == 0:
        r, g, b = v, t, p
    elif i == 1:
        r, g, b = q, v, p
    elif i == 2:
        r, g, b = p, v, t
    elif i == 3:
        r, g, b = p, q, v
    elif i == 4:
        r, g, b = t, p, v
    else:
        r, g, b = v, p, q
    return int(r * 255), int(g * 255), int(b * 255)


def _load_animations():
    """Exec each *.py file in /animations/ with injected context."""
    result = {}
    try:
        files = sorted(uos.listdir("/animations"))
    except OSError:
        print("notify_animations: /animations not found")
        return result

    ns_base = {
        "_g":             _g,
        "_width":         _width,
        "_height":        _height,
        "_hsv_to_rgb":    _hsv_to_rgb,
        "_get_fire_heat": _get_fire_heat,
        "_set_fire_heat": _set_fire_heat,
        "random":         random,
    }

    for fname in files:
        if not fname.endswith(".py") or fname.startswith("_"):
            continue
        path = "/animations/" + fname
        ns = dict(ns_base)
        try:
            with open(path) as f:
                exec(f.read(), ns)
            if "ANIMATIONS" in ns:
                result.update(ns["ANIMATIONS"])
                print("Loaded:", list(ns["ANIMATIONS"].keys()))
        except Exception as e:
            print("Animation load error:", path, e)

    return result


def _anim_unknown(elapsed_ms, ax, ay, aw, ah, color, bg_color):
    """Blink '?' when an animation name is requested but not found."""
    _g.set_pen(_g.create_pen(*bg_color))
    _g.rectangle(ax, ay, aw, ah)
    if (elapsed_ms // 500) % 2 == 0:
        _g.set_font("bitmap8")
        _g.set_pen(_g.create_pen(*color))
        _g.text("?", ax + aw // 2 - 3, ay + ah // 2 - 4, scale=1)


def _draw_notify_text(text, tx, ty, tw, th, color, elapsed_ms, outlined):
    """Draw notification text (scrolling if too wide) within a bounding region."""
    _g.set_font("bitmap8")
    text_w = _g.measure_text(text, 1)
    if text_w <= tw:
        sx = tx + (tw - text_w) // 2
    else:
        adv = elapsed_ms // _SCROLL_MS_PER_PX
        sx  = tx + tw - (adv % (text_w + tw))
    text_y = ty + (th - 8) // 2
    if outlined:
        _g.set_pen(_BLACK)
        for ox, oy in ((-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, -1), (-1, 1), (1, 1)):
            _g.text(text, sx + ox, text_y + oy, -1, 1)
    _g.set_pen(_g.create_pen(*color))
    _g.text(text, sx, text_y, -1, 1)


def _draw_notification(notif, elapsed_ms):
    """Render one notification frame (animation + optional text overlay or split layout)."""
    color    = tuple(notif.get("color",    [255, 255, 255]))
    bg_color = tuple(notif.get("bg_color", [0,   0,   80]))
    text     = notif.get("text", "")
    anim     = notif.get("animation", "")
    layout   = notif.get("layout", "fullscreen")
    outlined = notif.get("outlined", False)

    anim_fn = NOTIFY_ANIMATIONS.get(anim)
    if anim and anim_fn is None:
        anim_fn = _anim_unknown

    if layout == "split" and text:
        sw = notif.get("split_width", _SPLIT_WIDTH_DEFAULT)
        if anim_fn:
            anim_fn(elapsed_ms, 0, 0, sw, _height, color, bg_color)
        else:
            _g.set_pen(_g.create_pen(*bg_color))
            _g.rectangle(0, 0, sw, _height)
        _draw_notify_text(text, sw + 1, 0, _width - sw - 1, _height, color, elapsed_ms, outlined)
    else:
        if anim_fn:
            anim_fn(elapsed_ms, 0, 0, _width, _height, color, bg_color)
        else:
            _g.set_pen(_g.create_pen(*bg_color))
            _g.clear()
        if text:
            _draw_notify_text(text, 0, 0, _width, _height, color, elapsed_ms, outlined)
