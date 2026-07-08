"""Pixel icons for Pimoroni Unicorn display (built-ins 8×8; imported icons up to full-screen)."""

import json

import ubinascii
import uos

_g = None

ICON_SIZE  = 8
_ICON_DIR  = "/icons"
_CACHE_MAX = 8
_MAX_LOAD_FRAMES = 64
_MAX_LOAD_BYTES  = 24 * 1024

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


STATIC_ICONS = {}


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
        "w":         int(data.get("w", ICON_SIZE)),
        "h":         int(data.get("h", ICON_SIZE)),
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
        frames = []
        total = 0
        for fr in data["frames"]:
            if len(frames) >= _MAX_LOAD_FRAMES:
                break
            b = ubinascii.a2b_base64(fr)
            total += len(b)
            if total > _MAX_LOAD_BYTES and frames:
                break
            frames.append(b)
        icon = (
            frames,
            [int(d) for d in data.get("durations", [])][:len(frames)],
            int(data.get("w", ICON_SIZE)),
            int(data.get("h", ICON_SIZE)),
        )
    except Exception:
        return None
    if len(_user_cache) >= _CACHE_MAX:
        _user_cache.pop(next(iter(_user_cache)))
    _user_cache[name] = icon
    return icon


def _resolve(icon):
    """Return (frames, durations, w, h) for a name, code, or raw [r,g,b] list."""
    if not isinstance(icon, str):
        return [bytes([v for rgb in icon for v in rgb])], [0], ICON_SIZE, ICON_SIZE
    data = STATIC_ICONS.get(icon)
    if data is not None:
        if isinstance(data, bytes):
            return [data], [0], ICON_SIZE, ICON_SIZE
        return data[0], data[1], ICON_SIZE, ICON_SIZE
    user = _load_user_icon(icon)
    if user is None:
        alias = _code_alias.get(icon)
        if alias:
            user = _load_user_icon(alias)
    return user


def icon_size(name):
    """(w, h) of a named icon; default 8×8 when unknown or built-in."""
    resolved = _resolve(name)
    if resolved is None:
        return (ICON_SIZE, ICON_SIZE)
    return (resolved[2], resolved[3])


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


def draw_icon(icon, x, y, elapsed_ms=0, scale=1):
    """Draw an icon at (x, y) at its native w×h, optionally scaled (pixel -> scale×scale block)."""
    resolved = _resolve(icon)
    if resolved is None:
        return False
    frames, durations, w, h = resolved
    data = _frame_at(frames, durations, elapsed_ms)
    scale = int(scale) if scale and scale > 1 else 1
    n = w * h
    if len(data) < n * 3:
        n = len(data) // 3

    for i in range(n):
        r = data[i * 3]
        g = data[i * 3 + 1]
        b = data[i * 3 + 2]
        if r or g or b:
            _g.set_pen(_g.create_pen(r, g, b))
            px = x + (i % w) * scale
            py = y + (i // w) * scale
            if scale == 1:
                _g.pixel(px, py)
            else:
                _g.rectangle(px, py, scale, scale)
    return True
