"""Display drawing utilities for the Pimoroni Unicorn."""
import time

from bitfonts import font3x5
from monospace_big_digits import BIG_DIGITS
from monospace_digits import DIGITS

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


def lerp_colour(rgb_a, rgb_b, t):
    """Interpolate between two (r,g,b) tuples; t=0→rgb_a, t=1→rgb_b."""
    return (
        int(rgb_a[0] + (rgb_b[0] - rgb_a[0]) * t),
        int(rgb_a[1] + (rgb_b[1] - rgb_a[1]) * t),
        int(rgb_a[2] + (rgb_b[2] - rgb_a[2]) * t),
    )


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
    """Draw a sun (day) or moon (night) pip filling the w*h box at (x, y)."""
    if solar >= 0.1:
        _g.set_pen(_SUN_YELLOW)
    elif sun_below_horizon:
        _g.set_pen(_MOON_SILVER)
    else:
        return
    r = (min(w, h) - 1) // 2
    _g.circle(x + r, y + r, r)


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


BIG_DIGIT_W = 5
BIG_DIGIT_STEP = BIG_DIGIT_W + 1


def draw_clock(x, t=None, y=1, variant="big", color=None):
    """Draw the time at (x, y). variant: big (HHMM row), small (3x5 row), stacked (HH over MM)."""
    if t is None:
        t = time.localtime()
    pen = _g.create_pen(*color) if color else _WHITE
    digits = (t[3] // 10, t[3] % 10, t[4] // 10, t[4] % 10)
    if variant == "small":
        for i, digit in enumerate(digits):
            draw_custom_digit(digit, x + i * 4, y, pen)
        return
    if variant == "wide":
        draw_custom_digit(digits[0], x,      y, pen)
        draw_custom_digit(digits[1], x + 4,  y, pen)
        _g.set_pen(pen)
        _g.pixel(x + 7, y + 1)
        _g.pixel(x + 7, y + 3)
        draw_custom_digit(digits[2], x + 9,  y, pen)
        draw_custom_digit(digits[3], x + 13, y, pen)
        return
    if variant == "stacked":
        draw_big_custom_digit(digits[0], x,                  y,     pen)
        draw_big_custom_digit(digits[1], x + BIG_DIGIT_STEP, y,     pen)
        draw_big_custom_digit(digits[2], x,                  y + 8, pen)
        draw_big_custom_digit(digits[3], x + BIG_DIGIT_STEP, y + 8, pen)
        return
    for i, digit in enumerate(digits):
        draw_big_custom_digit(digit, x + i * BIG_DIGIT_STEP, y, pen)


def draw_tiny_clock():
    """Draw HH:MM in the top-left corner using the bitmap6 font."""
    t = time.localtime()
    _g.set_font("bitmap6")
    _g.set_pen(_WHITE)
    _g.text(f"{t[3]:02d}:{t[4]:02d}", 1, 0, scale=1)


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


def draw_display_sensors(display_sensors):
    """Draw a square dot (configurable size, default 2) for each display sensor at its x/y."""
    for sensor in display_sensors.values():
        rgb = sensor.get("on_rgb", (0, 255, 0)) if sensor.get("state") else sensor.get("off_rgb", (20, 20, 20))
        sz = int(sensor.get("size", 2))
        _g.set_pen(_g.create_pen(*rgb))
        _g.rectangle(sensor.get("x", 37), sensor.get("y", 1), sz, sz)


def draw_icon(icon_type, x, y):
    """Draw a small icon (alert/home/check) at (x, y)."""
    if icon_type == "alert":
        _g.set_pen(_RED)
        _g.rectangle(x + 2, y, 1, 5)
        _g.pixel(x + 2, y + 6)
    elif icon_type == "home":
        _g.set_pen(_CYAN)
        _g.triangle(x + 2, y, x, y + 3, x + 4, y + 3)
        _g.rectangle(x, y + 3, 5, 4)
    elif icon_type == "check":
        _g.set_pen(_GREEN)
        _g.line(x, y + 3, x + 2, y + 5)
        _g.line(x + 2, y + 5, x + 5, y)


def draw_outlined_text(text, x, y, color):
    """Draw text with a single-pixel black outline at (x, y)."""
    _g.set_pen(_BLACK)
    for ox, oy in ((-1, 0), (1, 0), (0, -1), (0, 1)):
        _g.text(text, x + ox, y + oy, scale=1)
    _g.set_pen(color)
    _g.text(text, x, y, scale=1)


def get_time_string():
    """Return the current time as an 'HH:MM' string."""
    t = time.localtime()
    return f"{t[3]:02d}:{t[4]:02d}"
