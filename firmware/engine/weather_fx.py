"""Weather overlay animations for the Pimoroni Unicorn."""
import random
import time

_g      = None
_width  = 0
_height = 0

_WHITE      = None
_RAIN_BLUE  = None
_RAIN_HEAVY = None
_SNOW_WHITE = None

_rain_drops       = []
_snow_drops       = []
_weather_last_tick = 0
_lightning_active  = False
_lightning_tick    = 0


def init(graphics, width, height):
    global _g, _width, _height
    global _WHITE, _RAIN_BLUE, _RAIN_HEAVY, _SNOW_WHITE
    _g      = graphics
    _width  = width
    _height = height
    _WHITE      = graphics.create_pen(255, 255, 255)
    _RAIN_BLUE  = graphics.create_pen(100, 149, 237)
    _RAIN_HEAVY = graphics.create_pen(50,  100, 200)
    _SNOW_WHITE = graphics.create_pen(200, 220, 255)


def map_owm_code(code):
    """Map an OWM condition code to a simplified weather string."""
    if 200 <= code <= 232:
        return "thunderstorm"
    if 300 <= code <= 321 or code in (500, 501):
        return "light_rain"
    if code in (502, 503, 504, 511, 520, 521, 522):
        return "rain"
    if code in (600, 601, 620, 621):
        return "light_snow"
    if code in (602, 611, 612, 613, 615, 616, 622):
        return "snow"
    return "clear"


def init_weather_drops(condition):
    """Initialise rain/snow drop lists for the given weather condition."""
    global _rain_drops, _snow_drops
    if condition == "light_rain":
        _rain_drops = [
            [random.randint(0, _width - 1), random.randint(-_height, _height - 1), random.randint(1, 2), 1]
            for _ in range(10)
        ]
        _snow_drops = []
    elif condition == "rain":
        _rain_drops = [
            [random.randint(0, _width - 1), random.randint(-_height, _height - 1), random.randint(1, 3), random.randint(1, 2)]
            for _ in range(20)
        ]
        _snow_drops = []
    elif condition == "thunderstorm":
        _rain_drops = [
            [random.randint(0, _width - 1), random.randint(-_height, _height - 1), random.randint(2, 3), 2]
            for _ in range(25)
        ]
        _snow_drops = []
    elif condition == "light_snow":
        _rain_drops = []
        _snow_drops = [
            [random.randint(0, _width - 1), random.randint(0, _height - 1), random.randint(0, 3), random.choice([-1, 1])]
            for _ in range(8)
        ]
    elif condition == "snow":
        _rain_drops = []
        _snow_drops = [
            [random.randint(0, _width - 1), random.randint(0, _height - 1), random.randint(0, 3), random.choice([-1, 1])]
            for _ in range(15)
        ]
    else:
        _rain_drops = []
        _snow_drops = []


def weather_overlay(condition):
    """Draw animated weather particles over the current frame."""
    global _rain_drops, _snow_drops, _weather_last_tick, _lightning_active, _lightning_tick

    if condition == "clear":
        return

    tick = time.ticks_ms()

    if condition == "thunderstorm":
        if not _lightning_active and random.randint(0, 500) == 0:
            _lightning_active = True
            _lightning_tick   = tick
        if _lightning_active:
            if time.ticks_diff(tick, _lightning_tick) < 80:
                _g.set_pen(_WHITE)
                _g.clear()
                return
            else:
                _lightning_active = False

    update_ms = {"light_rain": 30, "rain": 10, "thunderstorm": 10, "light_snow": 40}.get(condition, 30)
    should_update = time.ticks_diff(tick, _weather_last_tick) >= update_ms

    if _rain_drops:
        _g.set_pen(_RAIN_HEAVY if condition == "thunderstorm" else _RAIN_BLUE)
        for drop in _rain_drops:
            x, y, length, speed = drop
            for i in range(length):
                dy = y + i
                if 0 <= dy < _height:
                    _g.pixel(x, dy)
            if should_update:
                drop[1] += speed
                if drop[1] >= _height:
                    drop[0] = random.randint(0, _width - 1)
                    drop[1] = -drop[2]

    if _snow_drops:
        _g.set_pen(_SNOW_WHITE)
        for drop in _snow_drops:
            x, y, drift_count, drift_dir = drop
            if 0 <= x < _width and 0 <= y < _height:
                _g.pixel(x, y)
            if should_update:
                drop[1] += 1
                drop[2] += 1
                if drop[2] >= 3:
                    drop[0] = max(0, min(_width - 1, drop[0] + drop[3]))
                    drop[2] = 0
                    if random.randint(0, 4) == 0:
                        drop[3] = -drop[3]
                if drop[1] >= _height:
                    drop[0] = random.randint(0, _width - 1)
                    drop[1] = 0

    if should_update:
        _weather_last_tick = tick
