"""Unit tests for the engine-version bump gate decision logic."""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))

from check_engine_bump import evaluate  # noqa: E402


def test_no_engine_change_passes():
    ok, _ = evaluate([], "1.5.0", "1.5.0")
    assert ok


def test_engine_change_without_bump_fails():
    ok, msg = evaluate(["firmware/engine/icons.py"], "1.5.0", "1.5.0")
    assert not ok
    assert "icons.py" in msg


def test_engine_change_with_bump_passes():
    ok, _ = evaluate(["firmware/engine/icons.py"], "1.5.0", "1.6.0")
    assert ok


def test_missing_head_version_fails():
    ok, _ = evaluate(["firmware/engine/icons.py"], "1.5.0", None)
    assert not ok


def test_no_base_version_allows_bumped_change():
    ok, _ = evaluate(["firmware/widgets/widget_icon.py"], None, "1.6.0")
    assert ok
