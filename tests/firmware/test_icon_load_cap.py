"""The on-device icon loader bounds RAM: it caps frame count and total decoded bytes."""
import base64
import importlib
import json


def _write(tmp_path, monkeypatch, name, payload):
    icons = importlib.import_module("icons")
    monkeypatch.setattr(icons, "_ICON_DIR", str(tmp_path))
    icons._user_cache.clear()
    (tmp_path / f"{name}.json").write_text(json.dumps(payload))
    return icons


def test_load_caps_total_bytes(tmp_path, monkeypatch):
    """A heavy 32x32 animation loads only the frames that fit the byte budget."""
    frame = base64.b64encode(bytes(32 * 32 * 3)).decode()  # 3072 bytes decoded
    icons = _write(tmp_path, monkeypatch, "big",
                   {"frames": [frame] * 20, "durations": [100] * 20, "w": 32, "h": 32})
    frames, durations, w, h = icons._load_user_icon("big")
    assert (w, h) == (32, 32)
    assert len(frames) == icons._MAX_LOAD_BYTES // (32 * 32 * 3)  # 8 frames
    assert len(durations) == len(frames)


def test_load_caps_frame_count(tmp_path, monkeypatch):
    """Many tiny frames stay under the byte budget but hit the hard frame cap."""
    frame = base64.b64encode(bytes(3)).decode()  # 1x1 pixel
    icons = _write(tmp_path, monkeypatch, "many",
                   {"frames": [frame] * 200, "durations": [50] * 200, "w": 1, "h": 1})
    frames, _durations, _w, _h = icons._load_user_icon("many")
    assert len(frames) == icons._MAX_LOAD_FRAMES  # 64


def test_small_icon_loads_whole(tmp_path, monkeypatch):
    """A normal small icon is unaffected by the caps."""
    frame = base64.b64encode(bytes(8 * 8 * 3)).decode()
    icons = _write(tmp_path, monkeypatch, "ok",
                   {"frames": [frame] * 3, "durations": [100] * 3, "w": 8, "h": 8})
    frames, durations, w, h = icons._load_user_icon("ok")
    assert len(frames) == 3
    assert (w, h) == (8, 8)
