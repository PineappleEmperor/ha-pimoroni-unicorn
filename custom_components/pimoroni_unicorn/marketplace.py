"""Marketplace catalog: built-in widget/font units and install resolution."""

import ast
import hashlib
import json
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


def custom_widgets(custom_dir) -> list[dict]:
    """User-authored declarative widget units stored under custom_dir."""
    out = []
    d = Path(custom_dir) if custom_dir else None
    if d is None or not d.is_dir():
        return out
    for p in sorted(d.glob("widget_*.json")):
        try:
            spec = json.loads(p.read_text())
        except (ValueError, OSError):
            continue
        out.append({
            "id": spec.get("id", p.stem[7:]), "kind": "declarative",
            "label": spec.get("label", p.stem[7:]),
            "requires": spec.get("requires", []),
            "device_file": p.name, "hash": _short_hash(p.read_bytes()),
        })
    return out


def _font_deps(requires, device_files) -> list[tuple[str, str]]:
    files = []
    for req in requires or []:
        if not req.startswith("font:"):
            continue
        fu = font_unit(req[5:])
        if fu and device_files.get(fu["device_file"]) != fu["hash"]:
            files.append(("/" + fu["device_file"], fu["path"].read_text()))
    return files


def resolve_install(widget_id: str, device_files: dict | None = None,
                    custom_dir=None) -> list[tuple[str, str]]:
    """(device_path, content) for a widget plus any font deps the device lacks."""
    device_files = device_files or {}
    builtin = _widget_path(widget_id)
    if builtin.is_file():
        files = [("/" + builtin.name, builtin.read_text())]
        requires = (_parse_widget(builtin) or {}).get("requires", [])
    elif custom_dir and (cp := Path(custom_dir) / ("widget_" + widget_id + ".json")).is_file():
        files = [("/" + cp.name, cp.read_text())]
        try:
            requires = json.loads(cp.read_text()).get("requires", [])
        except (ValueError, OSError):
            requires = []
    else:
        return []
    return files + _font_deps(requires, device_files)


def widgets_dir(config_dir) -> Path:
    """Directory holding user-authored declarative widget specs."""
    return Path(config_dir) / "pimoroni_unicorn" / "widgets"


_VALID_OPS = {"rect", "pixel", "icon", "value", "bar"}


def validate_spec(spec) -> str | None:
    """Return an error string for an invalid declarative spec, or None if OK."""
    if not isinstance(spec, dict):
        return "spec must be an object"
    if not isinstance(spec.get("id"), str) or not spec["id"]:
        return "missing string 'id'"
    if not spec["id"].replace("_", "").isalnum():
        return "'id' must be alphanumeric/underscore"
    if not isinstance(spec.get("draw"), list):
        return "'draw' must be a list of ops"
    for op in spec["draw"]:
        if not isinstance(op, dict) or op.get("op") not in _VALID_OPS:
            return f"invalid op: {op.get('op') if isinstance(op, dict) else op}"
    return None


def save_custom(config_dir, spec) -> str:
    """Validate and persist a custom declarative widget; returns its id."""
    err = validate_spec(spec)
    if err:
        raise ValueError(err)
    if spec["id"] in {w["id"] for w in builtin_widgets()}:
        raise ValueError(f"'{spec['id']}' is a built-in widget id; choose another")
    d = widgets_dir(config_dir)
    d.mkdir(parents=True, exist_ok=True)
    (d / ("widget_" + spec["id"] + ".json")).write_text(json.dumps(spec))
    return spec["id"]


def delete_custom(config_dir, widget_id) -> None:
    """Remove a custom declarative widget spec."""
    p = widgets_dir(config_dir) / ("widget_" + widget_id + ".json")
    if p.is_file():
        p.unlink()


def device_diff(manifest: dict | None, custom_dir=None) -> list[dict]:
    """Per catalogue widget: installed / outdated / not_installed vs a device manifest."""
    files = (manifest or {}).get("files", {})
    out = []
    for w in builtin_widgets() + custom_widgets(custom_dir):
        dev = files.get(w["device_file"])
        status = "installed" if dev == w["hash"] else ("outdated" if dev else "not_installed")
        out.append({**w, "status": status})
    return out
