"""Notification animation loading and rendering for the Pimoroni Unicorn."""

import random

from sounds import NOTIFY_SOUNDS
import icons as _icons
import uos

_g      = None
_width  = 0
_height = 0
_BLACK  = None

_fire_heat = None

_SCROLL_MS_PER_PX    = 50
_SPLIT_WIDTH_DEFAULT = 13
_ICON_PANEL_WIDTH    = 9   # 8px icon + 1px gap
_ENTRANCE_DURATION_MS = 400

NOTIFY_ANIMATIONS   = {}
NOTIFY_CAPABILITIES = {}


def init(graphics, width, height):
    """Initialise notify_animations module with graphics context and display dimensions."""
    global _g, _width, _height, _BLACK
    _g      = graphics
    _width  = width
    _height = height
    _BLACK  = graphics.create_pen(0, 0, 0)
    _icons.init(graphics)
    NOTIFY_ANIMATIONS.clear()
    NOTIFY_ANIMATIONS.update(_load_animations())
    NOTIFY_CAPABILITIES.clear()
    NOTIFY_CAPABILITIES.update({
        "animations": list(NOTIFY_ANIMATIONS.keys()),
        "sounds":     list(NOTIFY_SOUNDS.keys()),
        "icons":      list(_icons.STATIC_ICONS.keys()),
        "entrances":  ["none", "slide_left", "slide_right", "center_out", "fade"],
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


def _draw_icon_panel(icon, elapsed_ms, panel_w, color, bg_color):
    """Render icon or animation in the left notification panel."""
    anim_fn = NOTIFY_ANIMATIONS.get(icon) if isinstance(icon, str) else None
    if anim_fn:
        anim_fn(elapsed_ms, 0, 0, panel_w, _height, color, bg_color)
    else:
        _g.set_pen(_g.create_pen(*bg_color))
        _g.rectangle(0, 0, panel_w, _height)
        icon_y = (_height - _icons.ICON_SIZE) // 2
        _icons.draw_icon(icon, 0, icon_y)


def _apply_entrance(elapsed_ms, entrance):
    """Overdraw black to create entrance transition effects."""
    if not entrance or entrance == "none" or elapsed_ms >= _ENTRANCE_DURATION_MS:
        return
    progress = elapsed_ms / _ENTRANCE_DURATION_MS
    _g.set_pen(_BLACK)

    if entrance == "slide_left":
        reveal = int(_width * progress)
        if reveal < _width:
            _g.rectangle(reveal, 0, _width - reveal, _height)
    elif entrance == "slide_right":
        hide = int(_width * (1.0 - progress))
        if hide > 0:
            _g.rectangle(0, 0, hide, _height)
    elif entrance == "center_out":
        half = int(_width / 2 * progress)
        cx = _width // 2
        left  = max(0, cx - half)
        right = min(_width, cx + half)
        if left > 0:
            _g.rectangle(0, 0, left, _height)
        if right < _width:
            _g.rectangle(right, 0, _width - right, _height)
    elif entrance == "fade":
        threshold = int(progress * 8)
        for py in range(_height):
            for px in range(_width):
                if (px + py) % 8 >= threshold:
                    _g.pixel(px, py)


def _draw_simple_notification(notif, elapsed_ms):
    """Simple mode: icon+text layout or fullscreen animation/text."""
    color    = tuple(notif.get("color",    [255, 255, 255]))
    bg_color = tuple(notif.get("bg_color", [0, 0, 0]))
    text     = notif.get("text", "")
    icon     = notif.get("icon")
    anim     = notif.get("animation", "")
    outlined = notif.get("outlined", False)

    _g.set_pen(_g.create_pen(*bg_color))
    _g.clear()

    if icon is not None:
        _draw_icon_panel(icon, elapsed_ms, _icons.ICON_SIZE, color, bg_color)
        if text:
            _draw_notify_text(text, _ICON_PANEL_WIDTH, 0, _width - _ICON_PANEL_WIDTH, _height, color, elapsed_ms, outlined)
    else:
        anim_fn = NOTIFY_ANIMATIONS.get(anim)
        if anim and anim_fn is None:
            anim_fn = _anim_unknown
        if anim_fn:
            anim_fn(elapsed_ms, 0, 0, _width, _height, color, bg_color)
        if text:
            _draw_notify_text(text, 0, 0, _width, _height, color, elapsed_ms, outlined)


def _draw_advanced_notification(notif, elapsed_ms):
    """Advanced mode: full layout control with optional entrance effect."""
    color    = tuple(notif.get("color",    [255, 255, 255]))
    bg_color = tuple(notif.get("bg_color", [0, 0, 0]))
    text     = notif.get("text", "")
    anim     = notif.get("animation", "")
    icon     = notif.get("icon")
    layout   = notif.get("layout", "fullscreen")
    outlined = notif.get("outlined", False)
    entrance = notif.get("entrance", "none")
    sw       = notif.get("split_width", _SPLIT_WIDTH_DEFAULT)

    anim_fn = NOTIFY_ANIMATIONS.get(anim)
    if anim and anim_fn is None:
        anim_fn = _anim_unknown

    if layout == "split" and text:
        if icon is not None:
            _draw_icon_panel(icon, elapsed_ms, sw, color, bg_color)
        elif anim_fn:
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

    _apply_entrance(elapsed_ms, entrance)


def _draw_notification(notif, elapsed_ms):
    """Dispatch notification rendering based on mode."""
    mode = notif.get("mode")
    if mode == "simple":
        _draw_simple_notification(notif, elapsed_ms)
    elif mode == "advanced":
        _draw_advanced_notification(notif, elapsed_ms)
    else:
        _draw_legacy_notification(notif, elapsed_ms)


def _draw_legacy_notification(notif, elapsed_ms):
    """Legacy rendering for notifications without a mode field."""
    color    = tuple(notif.get("color",    [255, 255, 255]))
    bg_color = tuple(notif.get("bg_color", [0, 0, 0]))
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
