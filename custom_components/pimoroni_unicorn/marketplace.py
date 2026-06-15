"""Marketplace catalog: built-in widget/font units and install resolution."""

import ast
import hashlib
from pathlib import Path

_DIR = Path(__file__).parent / "catalog"
_WIDGETS = _DIR / "widgets"
_FONTS = _DIR / "fonts"

# Logical font dependency name (font:<name>) -> unit filename.
FONT_FILES = {
    "digits":     "monospace_digits.py",
    "big_digits": "monospace_big_digits.py",
    "blocky":     "monospace_blocky.py",
    "tall":       "monospace_tall.py",
    "humanist":   "monospace_humanist.py",
}


def _short_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:16]


def _parse_widget(path: Path) -> dict | None:
    """Extract the WIDGET descriptor literal from a unit file."""
    for node in ast.parse(path.read_text()).body:
        if isinstance(node, ast.Assign) and any(
                isinstance(t, ast.Name) and t.id == "WIDGET" for t in node.targets):
            try:
                return ast.literal_eval(node.value)
            except (ValueError, SyntaxError):
                return None
    return None


def builtin_widgets() -> list[dict]:
    """Catalogue of shipped widget units with metadata + install hash."""
    out = []
    for p in sorted(_WIDGETS.glob("widget_*.py")):
        meta = _parse_widget(p)
        if not meta:
            continue
        out.append({
            "id": meta["id"], "kind": "code",
            "label": meta.get("label", meta["id"]),
            "requires": meta.get("requires", []),
            "device_file": p.name,
            "hash": _short_hash(p.read_bytes()),
        })
    return out


def font_unit(name: str) -> dict | None:
    """Resolve a font dependency name to its installable unit, if known."""
    fn = FONT_FILES.get(name)
    p = _FONTS / fn if fn else None
    if p is None or not p.is_file():
        return None
    return {"name": name, "device_file": fn, "hash": _short_hash(p.read_bytes()), "path": p}


def _widget_path(widget_id: str) -> Path:
    return _WIDGETS / ("widget_" + widget_id + ".py")


def resolve_install(widget_id: str, device_files: dict | None = None) -> list[tuple[str, str]]:
    """(device_path, content) for a widget plus any font deps the device lacks."""
    device_files = device_files or {}
    p = _widget_path(widget_id)
    if not p.is_file():
        return []
    files = [("/" + p.name, p.read_text())]
    meta = _parse_widget(p) or {}
    for req in meta.get("requires", []):
        if not req.startswith("font:"):
            continue
        fu = font_unit(req[5:])
        if fu and device_files.get(fu["device_file"]) != fu["hash"]:
            files.append(("/" + fu["device_file"], fu["path"].read_text()))
    return files


def device_diff(manifest: dict | None) -> list[dict]:
    """Per built-in widget: installed / outdated / not_installed vs a device manifest."""
    files = (manifest or {}).get("files", {})
    out = []
    for w in builtin_widgets():
        dev = files.get(w["device_file"])
        status = "installed" if dev == w["hash"] else ("outdated" if dev else "not_installed")
        out.append({**w, "status": status})
    return out
