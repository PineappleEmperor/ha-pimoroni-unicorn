# AUTO-GENERATED from firmware/ by scripts/sync_render.py — do not edit.
"""8×8 pixel icons for Pimoroni Unicorn notification display."""

import json

import ubinascii
import uos

_g = None

ICON_SIZE  = 8
_ICON_DIR  = "/icons"
_CACHE_MAX = 8

_user_cache = {}
_code_alias = {}

_K = (0,   0,   0)    # black / transparent
_W = (255, 255, 255)  # white
_G = (0,   180, 50)   # green
_Y = (220, 180, 0)    # yellow
_R = (220, 50,  30)   # red
_O = (220, 100, 0)    # orange
_B = (50,  130, 220)  # blue
_C = (160, 210, 255)  # light blue (cloud)
_Z = (70,  70,  70)   # grey


def _b(*rows):
    return bytes([v for row in rows for rgb in row for v in rgb])


STATIC_ICONS = {
    "battery_full": _b(
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_W, _W, _W, _W, _W, _W, _W, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _W, _W, _W, _W, _W, _W, _W),
    ),
    "battery_half": _b(
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_W, _W, _W, _W, _W, _W, _W, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _G, _G, _G, _G, _G, _G, _W),
        (_W, _Z, _Z, _Z, _Z, _Z, _Z, _W),
        (_W, _Z, _Z, _Z, _Z, _Z, _Z, _W),
        (_W, _W, _W, _W, _W, _W, _W, _W),
    ),
    "battery_low": _b(
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_W, _W, _W, _W, _W, _W, _W, _W),
        (_W, _K, _K, _K, _K, _K, _K, _W),
        (_W, _K, _K, _K, _K, _K, _K, _W),
        (_W, _K, _K, _K, _K, _K, _K, _W),
        (_W, _R, _R, _R, _R, _R, _R, _W),
        (_W, _W, _W, _W, _W, _W, _W, _W),
    ),
    "battery_charging": _b(
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_K, _K, _W, _W, _K, _K, _K, _K),
        (_W, _W, _W, _W, _W, _W, _W, _W),
        (_W, _G, _G, _Y, _G, _G, _G, _W),
        (_W, _G, _Y, _Y, _G, _G, _G, _W),
        (_W, _G, _G, _Y, _Y, _G, _G, _W),
        (_W, _G, _G, _G, _Y, _G, _G, _W),
        (_W, _W, _W, _W, _W, _W, _W, _W),
    ),
    "solar": _b(
        (_K, _K, _K, _K, _K, _K, _K, _K),
        (_B, _Z, _B, _Z, _B, _Z, _K, _K),
        (_Z, _B, _Z, _B, _Z, _B, _K, _K),
        (_B, _Z, _B, _Z, _B, _Z, _K, _K),
        (_Z, _B, _Z, _B, _Z, _B, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
        (_K, _K, _K, _W, _K, _K, _K, _K),
        (_K, _W, _W, _W, _W, _W, _K, _K),
    ),
    "alert": _b(
        (_K, _K, _K, _O, _K, _K, _K, _K),
        (_K, _K, _O, _O, _O, _K, _K, _K),
        (_K, _K, _O, _W, _O, _K, _K, _K),
        (_K, _O, _O, _W, _O, _O, _K, _K),
        (_K, _O, _K, _W, _K, _O, _K, _K),
        (_O, _O, _K, _K, _K, _O, _O, _K),
        (_O, _O, _K, _W, _K, _O, _O, _K),
        (_O, _O, _O, _O, _O, _O, _O, _K),
    ),
    "home": _b(
        (_K, _K, _K, _W, _K, _K, _K, _K),
        (_K, _K, _W, _W, _W, _K, _K, _K),
        (_K, _W, _W, _W, _W, _W, _K, _K),
        (_W, _W, _K, _K, _K, _W, _W, _K),
        (_K, _K, _W, _W, _W, _W, _K, _K),
        (_K, _K, _W, _K, _K, _W, _K, _K),
        (_K, _K, _W, _K, _K, _W, _K, _K),
        (_K, _K, _W, _W, _W, _W, _K, _K),
    ),
    "lock": _b(
        (_K, _K, _Y, _Y, _Y, _K, _K, _K),
        (_K, _Y, _K, _K, _K, _Y, _K, _K),
        (_K, _Y, _K, _K, _K, _Y, _K, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_Y, _Y, _K, _W, _K, _Y, _Y, _K),
        (_Y, _Y, _K, _W, _K, _Y, _Y, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
    ),
    "unlock": _b(
        (_K, _K, _K, _K, _Y, _Y, _K, _K),
        (_K, _K, _K, _K, _K, _Y, _K, _K),
        (_K, _K, _K, _K, _K, _Y, _K, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_Y, _Y, _K, _W, _K, _Y, _Y, _K),
        (_Y, _Y, _K, _W, _K, _Y, _Y, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
    ),
    "thermometer": _b(
        (_K, _K, _K, _W, _W, _K, _K, _K),
        (_K, _K, _K, _W, _K, _K, _K, _K),
        (_K, _K, _K, _W, _K, _K, _K, _K),
        (_K, _K, _K, _W, _K, _K, _K, _K),
        (_K, _K, _K, _R, _K, _K, _K, _K),
        (_K, _K, _R, _R, _R, _K, _K, _K),
        (_K, _W, _R, _R, _R, _W, _K, _K),
        (_K, _K, _W, _W, _W, _K, _K, _K),
    ),
    "sun": _b(
        (_K, _Y, _K, _Y, _K, _Y, _K, _K),
        (_K, _K, _Y, _Y, _Y, _K, _K, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_K, _Y, _Y, _Y, _Y, _Y, _K, _K),
        (_Y, _Y, _Y, _Y, _Y, _Y, _Y, _K),
        (_K, _K, _Y, _Y, _Y, _K, _K, _K),
        (_K, _Y, _K, _Y, _K, _Y, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
    ),
    "cloud": _b(
        (_K, _K, _C, _C, _C, _K, _K, _K),
        (_K, _C, _C, _C, _C, _C, _K, _K),
        (_C, _C, _C, _C, _C, _C, _C, _K),
        (_C, _C, _C, _C, _C, _C, _C, _K),
        (_C, _C, _C, _C, _C, _C, _C, _K),
        (_K, _C, _C, _C, _C, _C, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
    ),
    "rain": _b(
        (_K, _K, _C, _C, _C, _K, _K, _K),
        (_K, _C, _C, _C, _C, _C, _K, _K),
        (_C, _C, _C, _C, _C, _C, _K, _K),
        (_K, _C, _C, _C, _C, _K, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
        (_B, _K, _B, _K, _B, _K, _K, _K),
        (_K, _B, _K, _B, _K, _B, _K, _K),
        (_B, _K, _B, _K, _B, _K, _K, _K),
    ),
    "check": _b(
        (_K, _K, _K, _K, _K, _K, _G, _K),
        (_K, _K, _K, _K, _K, _G, _G, _K),
        (_G, _K, _K, _K, _G, _G, _K, _K),
        (_G, _G, _K, _G, _G, _K, _K, _K),
        (_K, _G, _G, _G, _K, _K, _K, _K),
        (_K, _K, _G, _K, _K, _K, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
        (_K, _K, _K, _K, _K, _K, _K, _K),
    ),
}


def init(graphics):
    global _g
    _g = graphics
    _build_code_alias()


def install(name, data):
    """Write an icon JSON file pushed over MQTT and refresh lookup state."""
    try:
        uos.mkdir(_ICON_DIR)
    except OSError:
        pass
    payload = {
        "code":      data.get("code"),
        "frames":    data["frames"],
        "durations": data.get("durations", []),
    }
    with open(_ICON_DIR + "/" + name + ".json", "w") as f:
        json.dump(payload, f)
    _user_cache.pop(name, None)
    if payload["code"] is not None:
        _code_alias[str(payload["code"])] = name


def remove(name):
    """Delete an installed icon file and clear lookup state."""
    _user_cache.pop(name, None)
    try:
        uos.remove(_ICON_DIR + "/" + name + ".json")
    except OSError:
        pass
    for code in [c for c, n in _code_alias.items() if n == name]:
        del _code_alias[code]


def _build_code_alias():
    """Map LaMetric code strings to installed icon names by scanning /icons/."""
    _code_alias.clear()
    try:
        files = uos.listdir(_ICON_DIR)
    except OSError:
        return
    for fname in files:
        if not fname.endswith(".json"):
            continue
        try:
            with open(_ICON_DIR + "/" + fname) as f:
                code = json.load(f).get("code")
            if code is not None:
                _code_alias[str(code)] = fname[:-5]
        except Exception:
            pass


def _load_user_icon(name):
    cached = _user_cache.get(name)
    if cached is not None:
        return cached
    try:
        with open(_ICON_DIR + "/" + name + ".json") as f:
            data = json.load(f)
        icon = (
            [ubinascii.a2b_base64(fr) for fr in data["frames"]],
            [int(d) for d in data.get("durations", [])],
        )
    except Exception:
        return None
    if len(_user_cache) >= _CACHE_MAX:
        _user_cache.pop(next(iter(_user_cache)))
    _user_cache[name] = icon
    return icon


def _resolve(icon):
    """Return (frames, durations) for a name, code, or raw [r,g,b] list."""
    if not isinstance(icon, str):
        return [bytes([v for rgb in icon for v in rgb])], [0]
    data = STATIC_ICONS.get(icon)
    if data is not None:
        if isinstance(data, bytes):
            return [data], [0]
        return data
    user = _load_user_icon(icon)
    if user is None:
        alias = _code_alias.get(icon)
        if alias:
            user = _load_user_icon(alias)
    return user


def _frame_at(frames, durations, elapsed_ms):
    if len(frames) == 1:
        return frames[0]
    total = 0
    for d in durations:
        total += d if d > 0 else 100
    if total <= 0:
        return frames[0]
    t   = elapsed_ms % total
    acc = 0
    for fr, d in zip(frames, durations):
        acc += d if d > 0 else 100
        if t < acc:
            return fr
    return frames[-1]


def draw_icon(icon, x, y, elapsed_ms=0):
    """Draw an 8×8 icon at (x, y). icon is a name, LaMetric code, or flat [r,g,b] list."""
    resolved = _resolve(icon)
    if resolved is None:
        return False
    data = _frame_at(resolved[0], resolved[1], elapsed_ms)

    for i in range(ICON_SIZE * ICON_SIZE):
        r = data[i * 3]
        g = data[i * 3 + 1]
        b = data[i * 3 + 2]
        if r or g or b:
            _g.set_pen(_g.create_pen(r, g, b))
            _g.pixel(x + (i % ICON_SIZE), y + (i // ICON_SIZE))
    return True
