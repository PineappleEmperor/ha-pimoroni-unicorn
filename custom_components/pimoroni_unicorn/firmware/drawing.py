"""Display drawing utilities for the Pimoroni Unicorn."""
import time

from bitfonts import font3x5, font5x9
from monospace_big_digits import BIG_DIGITS
from monospace_blocky import BLOCKY
from monospace_blocky_serif import BLOCKY_SERIF
from monospace_digits import DIGITS
from monospace_digits_serif import DIGITS_SERIF
from monospace_humanist import HUMANIST
from monospace_tall import TALL

# Clock digit faces: name -> (glyph table, glyph width). Height derives from the table.
_CLOCK_FACES = {
    "big":          (BIG_DIGITS, 5),
    "digits":       (DIGITS, 3),
    "digits-serif": (DIGITS_SERIF, 3),
    "blocky":       (BLOCKY, 4),
    "blocky-serif": (BLOCKY_SERIF, 4),
    "tall":         (TALL, 3),
    "humanist":     (HUMANIST, 4),
}


def _clock_face(name):
    """Resolve a clock face name to (glyph table, width, height)."""
    table, w = _CLOCK_FACES.get(name, _CLOCK_FACES["big"])
    return table, w, len(table[0]) // w


def reload_fonts():
    """Re-import the installable digit-font tables and rebuild the clock-face map (no reboot).

    Lets a newly installed or updated monospace_* font apply live. Text fonts (font3x5/
    font5x9) live in the engine's bitfonts.py, so updating those still needs a reboot.
    """
    import sys  # noqa: PLC0415
    global BIG_DIGITS, BLOCKY, BLOCKY_SERIF, DIGITS, DIGITS_SERIF, HUMANIST, TALL, _CLOCK_FACES
    for m in ("monospace_big_digits", "monospace_blocky", "monospace_blocky_serif",
              "monospace_digits", "monospace_digits_serif", "monospace_humanist",
              "monospace_tall"):
        sys.modules.pop(m, None)
    from monospace_big_digits import BIG_DIGITS
    from monospace_blocky import BLOCKY
    from monospace_blocky_serif import BLOCKY_SERIF
    from monospace_digits import DIGITS
    from monospace_digits_serif import DIGITS_SERIF
    from monospace_humanist import HUMANIST
    from monospace_tall import TALL
    _CLOCK_FACES = {
        "big":          (BIG_DIGITS, 5),
        "digits":       (DIGITS, 3),
        "digits-serif": (DIGITS_SERIF, 3),
        "blocky":       (BLOCKY, 4),
        "blocky-serif": (BLOCKY_SERIF, 4),
        "tall":         (TALL, 3),
        "humanist":     (HUMANIST, 4),
    }

# Selectable text fonts: name -> (glyph table, force-uppercase). font3x5 is
# uppercase-only; font5x9 is mixed-case so case is preserved.
_TEXT_FONTS = {"font3x5": (font3x5, True), "font5x9": (font5x9, False)}


def _text_font(name):
    """Resolve a text font name to (glyph table, force-uppercase)."""
    return _TEXT_FONTS.get(name, _TEXT_FONTS["font3x5"])


BATTERY_ROWS = 4

_g       = None
_bitfont = None
_width   = 0
_height  = 0

_WHITE       = None
_BLACK       = None
_RED         = None
_GREEN       = None
_CYAN        = None
_CHARCOAL    = None
_DARK_GREY   = None
_SUN_YELLOW  = None
_MOON_SILVER = None
_ENERGY_CYAN = None
_ENERGY_RED  = None


def init(graphics, bitfont, width, height):
    """Initialise drawing module with graphics context, font, and display dimensions."""
    global _g, _bitfont, _width, _height
    global _WHITE, _BLACK, _RED, _GREEN, _CYAN
    global _CHARCOAL, _DARK_GREY, _SUN_YELLOW, _MOON_SILVER, _ENERGY_CYAN, _ENERGY_RED
    _g       = graphics
    _bitfont = bitfont
    _width   = width
    _height  = height
    _WHITE       = graphics.create_pen(255, 255, 255)
    _BLACK       = graphics.create_pen(0,   0,   0)
    _RED         = graphics.create_pen(255, 0,   0)
    _GREEN       = graphics.create_pen(0,   255, 0)
    _CYAN        = graphics.create_pen(0,   255, 255)
    _CHARCOAL    = graphics.create_pen(54,  69,  79)
    _DARK_GREY   = graphics.create_pen(169, 169, 169)
    _SUN_YELLOW  = graphics.create_pen(255, 255, 0)
    _MOON_SILVER = graphics.create_pen(180, 190, 210)
    _ENERGY_CYAN = graphics.create_pen(0,   206, 206)
    _ENERGY_RED  = graphics.create_pen(220, 60,  60)


def dim(rgb, b):
    """Scale an (r, g, b) by a 0-100 brightness; 100 (or missing) is unchanged."""
    if not rgb or b >= 100:
        return rgb
    f = max(0, b) / 100.0
    return (int(rgb[0] * f), int(rgb[1] * f), int(rgb[2] * f))


def lerp_colour(rgb_a, rgb_b, t):
    """Interpolate between two (r,g,b) tuples; t=0→rgb_a, t=1→rgb_b."""
    return (
        int(rgb_a[0] + (rgb_b[0] - rgb_a[0]) * t),
        int(rgb_a[1] + (rgb_b[1] - rgb_a[1]) * t),
        int(rgb_a[2] + (rgb_b[2] - rgb_a[2]) * t),
    )


def _hsv_to_rgb(h, s, v):
    """HSV (h wrapped to [0,1)) to a 0-255 (r,g,b) tuple."""
    h = h % 1.0
    i = int(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    i = i % 6
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
    return (int(r * 255), int(g * 255), int(b * 255))


def text_fx_colors(s, cfg, elapsed_ms=0):
    """Per-character (r,g,b) list for string s under cfg's colour mode."""
    n = len(s)
    mode = cfg.get("color_mode", "solid")
    if mode == "rainbow":
        speed = cfg.get("speed", 3)
        spread = cfg.get("spread", 0.12)
        phase = (elapsed_ms * speed) / 6000.0
        cols = [_hsv_to_rgb(i * spread - phase, 1.0, 1.0) for i in range(n)]
    elif mode == "per_char":
        palette = cfg.get("colors") or [cfg.get("color") or (255, 255, 255)]
        cols = [tuple(palette[i % len(palette)]) for i in range(n)]
    else:
        base = tuple(cfg.get("color") or (255, 255, 255))
        cols = [base for _ in range(n)]
    b = cfg.get("brightness", 100)
    return cols if b >= 100 else [dim(c, b) for c in cols]


def draw_text_fx(s, x, y, cfg, elapsed_ms=0):
    """Draw a string in the configured text font with solid / per-char / rainbow colouring."""
    table, upper = _text_font(cfg.get("font", "font3x5"))
    s = str(s).upper() if upper else str(s)
    spacing = cfg.get("spacing", 0)
    colors = text_fx_colors(s, cfg, elapsed_ms)
    cx = x
    for i in range(len(s)):
        glyph = table.get(s[i])
        if glyph is None:
            continue
        _g.set_pen(_g.create_pen(*colors[i]))
        _bitfont.draw_char(s[i], cx, y, table)
        cx += glyph["w"] + glyph["s"] + spacing


def soc_colour(soc_pct, is_charging):
    """Return an (r,g,b) colour for the given battery SoC and charging state."""
    if is_charging:
        return (0, 206, 206)
    if soc_pct <= 25:
        return lerp_colour((200, 0, 0), (255, 140, 0), soc_pct / 25.0)
    if soc_pct <= 60:
        return lerp_colour((255, 140, 0), (0, 200, 0), (soc_pct - 25) / 35.0)
    return lerp_colour((0, 200, 0), (0, 255, 0), (soc_pct - 60) / 40.0)


def _energy_colour(solar, consumption, mode, soc):
    """Pick the energy value colour by mode, surplus/deficit and battery state."""
    net = solar - consumption
    surplus = net > 0.1
    surplus_colour = _SUN_YELLOW if soc >= 100 else _ENERGY_CYAN
    no_data = solar <= 0.1 and consumption <= 0.1
    if mode == "Solar":
        return _CHARCOAL if solar <= 0.1 else (surplus_colour if surplus else _WHITE)
    if mode == "Consumption":
        if no_data:
            return _CHARCOAL
        if surplus:
            return surplus_colour
        return _WHITE if net >= -0.1 else _ENERGY_RED
    if no_data:
        return _CHARCOAL
    if surplus:
        return surplus_colour
    if net < -0.1:
        return _ENERGY_RED
    return _WHITE


def draw_battery(x, y, soc, is_charging, battery_animation):
    """Draw a 4x5 battery indicator with its top-left at (x, y)."""
    rgb        = soc_colour(soc, is_charging)
    exact_fill = (soc / 100.0) * BATTERY_ROWS
    full_rows  = int(exact_fill)
    frac       = exact_fill - full_rows
    tick       = time.ticks_ms()

    _g.set_pen(_DARK_GREY)
    _g.rectangle(x,     y + 1, 1, 4)
    _g.rectangle(x + 3, y + 1, 1, 4)
    _g.rectangle(x + 1, y,     2, 1)

    for row in range(BATTERY_ROWS):
        py = (y + 4) - row
        if row < full_rows:
            _g.set_pen(_g.create_pen(*rgb))
        elif row == full_rows and frac > 0.05:
            _g.set_pen(_g.create_pen(int(rgb[0] * frac), int(rgb[1] * frac), int(rgb[2] * frac)))
        else:
            _g.set_pen(_BLACK)
        _g.rectangle(x + 1, py, 2, 1)

    if battery_animation and is_charging and soc < 100:
        active_rows = full_rows + (1 if frac > 0.05 else 0)
        next_row    = active_rows
        has_next    = frac <= 0.05 and next_row < BATTERY_ROWS
        cycle_rows  = active_rows + (1 if has_next else 0)
        if cycle_rows > 0:
            pulse_row = (tick // 600) % cycle_rows
            for row in range(BATTERY_ROWS):
                py          = (y + 4) - row
                is_frac_row = row == full_rows and frac > 0.05
                if row == pulse_row:
                    if row == next_row:
                        _g.set_pen(_g.create_pen(max(0, rgb[0] - 120), max(0, rgb[1] - 120), max(0, rgb[2] - 120)))
                    elif is_frac_row:
                        _g.set_pen(_g.create_pen(min(255, int(rgb[0] * frac) + 60), min(255, int(rgb[1] * frac) + 60), min(255, int(rgb[2] * frac) + 60)))
                    else:
                        _g.set_pen(_g.create_pen(min(255, rgb[0] + 80), min(255, rgb[1] + 80), min(255, rgb[2] + 80)))
                elif row < full_rows:
                    _g.set_pen(_g.create_pen(max(0, rgb[0] - 60), max(0, rgb[1] - 60), max(0, rgb[2] - 60)))
                elif is_frac_row:
                    _g.set_pen(_g.create_pen(int(rgb[0] * frac), int(rgb[1] * frac), int(rgb[2] * frac)))
                else:
                    _g.set_pen(_BLACK)
                _g.rectangle(x + 1, py, 2, 1)

    elif battery_animation and not is_charging and soc > 0:
        active_rows = full_rows + (1 if frac > 0.05 else 0)
        if active_rows > 0:
            pulse_row = (active_rows - 1) - (tick // 500) % active_rows
            for row in range(BATTERY_ROWS):
                py          = (y + 4) - row
                is_frac_row = row == full_rows and frac > 0.05
                if row == pulse_row:
                    if is_frac_row:
                        _g.set_pen(_g.create_pen(min(255, int(rgb[0] * frac) + 60), min(255, int(rgb[1] * frac) + 60), min(255, int(rgb[2] * frac) + 60)))
                    else:
                        _g.set_pen(_g.create_pen(min(255, rgb[0] + 80), min(255, rgb[1] + 80), min(255, rgb[2] + 80)))
                elif row < full_rows:
                    _g.set_pen(_g.create_pen(max(0, rgb[0] - 60), max(0, rgb[1] - 60), max(0, rgb[2] - 60)))
                elif is_frac_row:
                    _g.set_pen(_g.create_pen(int(rgb[0] * frac), int(rgb[1] * frac), int(rgb[2] * frac)))
                else:
                    _g.set_pen(_BLACK)
                _g.rectangle(x + 1, py, 2, 1)


def draw_energy(x, y, w, h, solar=0.0, battery_soc=0, is_charging=False,
                mode="Net", consumption=0.0, battery_animation=False, decimals=1):
    """Battery indicator plus the left-aligned energy value, top-left at (x, y)."""
    draw_battery(x, y, battery_soc, is_charging, battery_animation)
    if mode == "Consumption":
        val = consumption
    elif mode == "Net":
        val = abs(solar - consumption)
    else:
        val = solar
    _g.set_pen(_energy_colour(solar, consumption, mode, battery_soc))
    _bitfont.draw_text(f"{val:.{decimals}f}", x + 5, y, font3x5, d=1)


def draw_sun_moon(x, y, w, h, solar=0.0, sun_below_horizon=False):
    """Draw a sun (day) or moon (night) filled disc in the w*h box at (x, y).

    Uses explicit pixels (not _g.circle) so the device and the CPython shim
    render an identical shape.
    """
    # Day/night follows the horizon, not solar output: sun by day, moon at night.
    _g.set_pen(_MOON_SILVER if sun_below_horizon else _SUN_YELLOW)
    d = min(w, h)
    r = (d - 1) / 2.0
    lim = (r + 0.5) * (r + 0.5)
    for iy in range(d):
        for ix in range(d):
            dx = ix - r
            dy = iy - r
            if dx * dx + dy * dy <= lim:
                _g.pixel(x + ix, y + iy)


def draw_custom_digit(digit_idx, x, y, colour, background=None):
    """Draw a single 3x5 digit from the DIGITS bitmask."""
    bg = background if background is not None else _BLACK
    if 0 <= digit_idx <= 9:
        bitmask = DIGITS[digit_idx]
        for i in range(15):
            _g.set_pen(colour if bitmask[i] else bg)
            _g.pixel(x + i % 3, y + i // 3)


def draw_big_custom_digit(digit, x, y, colour, background=None):
    """Draw a single 5x7 digit from the BIG_DIGITS bitmask."""
    bg = background if background is not None else _BLACK
    mask = BIG_DIGITS[digit]
    for i in range(35):
        _g.set_pen(colour if mask[i] else bg)
        _g.pixel(x + i % 5, y + i // 5)


def _draw_font_digit(font, w, digit, x, y, pen):
    """Draw one lit-pixel digit from a w-wide bitmask table (no background)."""
    if 0 <= digit <= 9:
        _g.set_pen(pen)
        mask = font[digit]
        for i in range(len(mask)):
            if mask[i]:
                _g.pixel(x + i % w, y + i // w)


BIG_DIGIT_W = 5
BIG_DIGIT_STEP = BIG_DIGIT_W + 1


def text_width(s, d=1, font="font3x5", spacing=0):
    """Pixel width of a string in the named text font (unknown glyphs skipped)."""
    table, upper = _text_font(font)
    seq = str(s).upper() if upper else str(s)
    total = 0
    for ch in seq:
        glyph = table.get(ch)
        if glyph:
            total += glyph["w"] + d + spacing
    return total - d - spacing if total else 0


def draw_text(s, x, y, color=None):
    """Draw an uppercase string in the 3x5 bitmap font at (x, y)."""
    _g.set_pen(_g.create_pen(*color) if color else _WHITE)
    _bitfont.draw_text(str(s).upper(), x, y, font3x5, d=1)


def clock_box(font="big", layout="row", digit_gap=1, pair_gap=2):
    """Footprint (w, h) for a clock face + layout + gaps."""
    _table, w, h = _clock_face(font)
    if layout == "stacked":
        return (2 * w + digit_gap, 2 * h + pair_gap)
    return (4 * w + 2 * digit_gap + pair_gap, h)


def draw_clock(x, t=None, y=1, font="big", layout="row", color=None, digit_gap=1, pair_gap=2):
    """Draw the time at (x, y) in a digit face. layout: row (HHMM) or stacked (HH over MM)."""
    if t is None:
        t = time.localtime()
    pen = _g.create_pen(*color) if color else _WHITE
    digits = (t[3] // 10, t[3] % 10, t[4] // 10, t[4] % 10)
    table, w, h = _clock_face(font)
    if layout == "stacked":
        dx = w + digit_gap
        dy = h + pair_gap
        _draw_font_digit(table, w, digits[0], x,      y,      pen)
        _draw_font_digit(table, w, digits[1], x + dx, y,      pen)
        _draw_font_digit(table, w, digits[2], x,      y + dy, pen)
        _draw_font_digit(table, w, digits[3], x + dx, y + dy, pen)
        return
    offsets = (0, w + digit_gap, 2 * w + digit_gap + pair_gap, 3 * w + 2 * digit_gap + pair_gap)
    for i in range(4):
        _draw_font_digit(table, w, digits[i], x + offsets[i], y, pen)


def draw_calendar(day_val, x, y, header_color):
    """Draw a post-it style calendar widget showing day_val at (x, y)."""
    _g.set_pen(header_color)
    _g.rectangle(x, y, 9, 3)
    _g.set_pen(_WHITE)
    _g.rectangle(x, y + 3, 9, 7)
    if day_val < 10:
        draw_custom_digit(day_val, x + 3, y + 4, _BLACK, _WHITE)
    elif 9 < day_val < 20 and day_val != 11:
        draw_custom_digit(day_val // 10, x + 1, y + 4, _BLACK, _WHITE)
        draw_custom_digit(day_val % 10,  x + 4, y + 4, _BLACK, _WHITE)
    else:
        draw_custom_digit(day_val // 10, x + 1, y + 4, _BLACK, _WHITE)
        draw_custom_digit(day_val % 10,  x + 5, y + 4, _BLACK, _WHITE)


def draw_weekdays(current_day, x, y, active_colour, inactive_colour):
    """Draw a row of seven 1x2 day indicators, highlighting current_day."""
    for i in range(7):
        _g.set_pen(active_colour if i == current_day else inactive_colour)
        _g.rectangle(x + i * 2, y, 1, 2)


def draw_big_weekdays(current_day, x, y, active_colour, inactive_colour):
    """Draw a row of seven 2x1 day bars at (x, y), highlighting current_day."""
    for i in range(7):
        _g.set_pen(active_colour if i == current_day else inactive_colour)
        _g.rectangle(x + i * 3, y, 2, 1)


def draw_icon(icon_type, x, y):
    """Draw a small status icon (alert/home/check) at (x, y) with explicit pixels.

    Pixel-only (no triangle/line) so device and preview render identically.
    """
    if icon_type == "alert":
        _g.set_pen(_RED)
        _g.rectangle(x + 2, y, 1, 5)
        _g.pixel(x + 2, y + 6)
    elif icon_type == "home":
        _g.set_pen(_CYAN)
        _g.pixel(x + 2, y)                       # roof apex
        for px in (x + 1, x + 2, x + 3):
            _g.pixel(px, y + 1)
        for px in range(x, x + 5):
            _g.pixel(px, y + 2)
        _g.rectangle(x, y + 3, 5, 4)             # body
    elif icon_type == "check":
        _g.set_pen(_GREEN)
        for i in range(3):                       # down-stroke
            _g.pixel(x + i, y + 1 + i)
        for i in range(1, 4):                    # up-stroke
            _g.pixel(x + 2 + i, y + 3 - i)


def get_time_string():
    """Return the current time as an 'HH:MM' string."""
    t = time.localtime()
    return f"{t[3]:02d}:{t[4]:02d}"
