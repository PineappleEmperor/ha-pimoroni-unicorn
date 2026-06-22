"""Marketplace catalog: built-in widget/font units and install resolution."""

import ast
import hashlib
import json
from pathlib import Path

_DIR = Path(__file__).parent / "catalog"
_WIDGETS = _DIR / "widgets"
_FONTS = _DIR / "fonts"
_OVERLAYS = _DIR / "overlays"
_LAYOUTS = _DIR / "layouts"

# Logical font dependency name (font:<name>) -> unit filename.
FONT_FILES = {
    "digits":       "monospace_digits.py",
    "digits_serif": "monospace_digits_serif.py",
    "big_digits":   "monospace_big_digits.py",
    "blocky":       "monospace_blocky.py",
    "blocky_serif": "monospace_blocky_serif.py",
    "tall":         "monospace_tall.py",
    "tall_bold":    "monospace_tall_bold.py",
    "humanist":     "monospace_humanist.py",
}


def _short_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()[:16]


def _parse_descriptor(path: Path, name: str) -> dict | None:
    """Extract a top-level dict literal (WIDGET/OVERLAY) from a unit file."""
    for node in ast.parse(path.read_text()).body:
        if isinstance(node, ast.Assign) and any(
                isinstance(t, ast.Name) and t.id == name for t in node.targets):
            try:
                return ast.literal_eval(node.value)
            except (ValueError, SyntaxError):
                return None
    return None


def _parse_widget(path: Path) -> dict | None:
    return _parse_descriptor(path, "WIDGET")


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


def builtin_overlays() -> list[dict]:
    """Catalogue of shipped overlay units with metadata + install hash."""
    out = []
    for p in sorted(_OVERLAYS.glob("overlay_*.py")):
        meta = _parse_descriptor(p, "OVERLAY")
        if not meta:
            continue
        out.append({
            "id": meta["id"], "kind": "overlay",
            "label": meta.get("label", meta["id"]),
            "requires": meta.get("requires", []),
            "device_file": p.name,
            "hash": _short_hash(p.read_bytes()),
        })
    return out


# On-device content dirs (foldered layout). Widgets/overlays live in /widgets,
# fonts in /assets/fonts; the device manifest still keys units by basename.
_DIR_WIDGETS = "/widgets"
_DIR_FONTS = "/assets/fonts"


def device_path(basename: str) -> str:
    """Full on-device path for a content unit, by its basename."""
    if basename.startswith("monospace_"):
        return _DIR_FONTS + "/" + basename
    return _DIR_WIDGETS + "/" + basename


def unit_device_file(item_id: str, custom_dir=None) -> str | None:
    """Resolve a catalogue item id to its on-device path (for removal)."""
    if _widget_path(item_id).is_file():
        return device_path("widget_" + item_id + ".py")
    if custom_dir and (Path(custom_dir) / ("widget_" + item_id + ".json")).is_file():
        return device_path("widget_" + item_id + ".json")
    if (_OVERLAYS / ("overlay_" + item_id + ".py")).is_file():
        return device_path("overlay_" + item_id + ".py")
    return None


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
            files.append((device_path(fu["device_file"]), fu["path"].read_text()))
    return files


def resolve_install(widget_id: str, device_files: dict | None = None,
                    custom_dir=None) -> list[tuple[str, str]]:
    """(device_path, content) for a widget plus any font deps the device lacks."""
    device_files = device_files or {}
    builtin = _widget_path(widget_id)
    if builtin.is_file():
        files = [(device_path(builtin.name), builtin.read_text())]
        requires = (_parse_widget(builtin) or {}).get("requires", [])
    elif custom_dir and (cp := Path(custom_dir) / ("widget_" + widget_id + ".json")).is_file():
        files = [(device_path(cp.name), cp.read_text())]
        try:
            requires = json.loads(cp.read_text()).get("requires", [])
        except (ValueError, OSError):
            requires = []
    elif (op := _OVERLAYS / ("overlay_" + widget_id + ".py")).is_file():
        files = [(device_path(op.name), op.read_text())]
        requires = (_parse_descriptor(op, "OVERLAY") or {}).get("requires", [])
    else:
        return []
    return files + _font_deps(requires, device_files)


def widgets_dir(config_dir) -> Path:
    """Directory holding user-authored declarative widget specs."""
    return Path(config_dir) / "pimoroni_unicorn" / "widgets"


_VALID_OPS = {"rect", "pixel", "icon", "value", "bar", "dot"}


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
    for w in builtin_widgets() + custom_widgets(custom_dir) + builtin_overlays():
        dev = files.get(w["device_file"])
        status = "installed" if dev == w["hash"] else ("outdated" if dev else "not_installed")
        out.append({**w, "status": status})
    return out


# --- Layout & screenset units -------------------------------------------------

MODEL_DIMS = {"galactic": (53, 11), "cosmic": (32, 32), "stellar": (16, 16)}


def compatible(compat, model) -> bool:
    """Universal if no compat tags or no device to gate against (mock); else model must be listed."""
    return (not compat) or (model is None) or (model in compat)


def _layout_widget_types(layout: dict) -> list[str]:
    """Distinct widget types referenced by a layout's entries (type or legacy id)."""
    types = []
    for w in layout.get("widgets", []):
        t = w.get("type", w.get("id"))
        if t and t not in types:
            types.append(t)
    return types


def _widget_requires(widget_type: str, custom_dir=None) -> list:
    """Dependency tokens a widget/overlay type declares (e.g. font:tall)."""
    bp = _widget_path(widget_type)
    if bp.is_file():
        return (_parse_widget(bp) or {}).get("requires", [])
    if custom_dir:
        cp = Path(custom_dir) / ("widget_" + widget_type + ".json")
        if cp.is_file():
            try:
                return json.loads(cp.read_text()).get("requires", [])
            except (ValueError, OSError):
                return []
    op = _OVERLAYS / ("overlay_" + widget_type + ".py")
    if op.is_file():
        return (_parse_descriptor(op, "OVERLAY") or {}).get("requires", [])
    return []


def layout_requires(layout: dict, custom_dir=None) -> list[str]:
    """Dependency tokens for a layout: widget:<type> plus each widget's font:<name>."""
    reqs: list[str] = []
    for t in _layout_widget_types(layout) + list(layout.get("overlays", [])):
        token = "widget:" + t
        if token not in reqs:
            reqs.append(token)
        for r in _widget_requires(t, custom_dir):
            if r not in reqs:
                reqs.append(r)
    return reqs


def layout_unit(name: str, layout: dict, custom_dir=None) -> dict:
    """Marketplace descriptor for a stored layout (one app/screen)."""
    model = layout.get("model")
    return {
        "id": name, "kind": "layout", "label": layout.get("name", name),
        "model": model, "compat": [model] if model else [],
        "requires": layout_requires(layout, custom_dir),
        "screens": 1,
        "hash": _short_hash(json.dumps(layout, sort_keys=True).encode()),
    }


def layout_units(layouts: dict, custom_dir=None) -> list[dict]:
    """Descriptors for every stored layout (name -> layout dict)."""
    return [layout_unit(n, lay, custom_dir) for n, lay in sorted(layouts.items())]


def builtin_layouts() -> dict:
    """Shipped starter pages: name -> layout dict."""
    out = {}
    if _LAYOUTS.is_dir():
        for p in sorted(_LAYOUTS.glob("*.json")):
            try:
                lay = json.loads(p.read_text())
            except (ValueError, OSError):
                continue
            out[lay.get("name", p.stem)] = lay
    return out


def screenset_unit(sid: str, ss: dict, layouts: dict) -> dict:
    """Marketplace descriptor for a screenset (references apps + rotation + triggers)."""
    refs = ss.get("layouts", [])
    models = sorted({layouts[n].get("model") for n in refs if n in layouts and layouts[n].get("model")})
    return {
        "id": sid, "kind": "screenset", "label": ss.get("label", sid),
        "compat": models, "requires": ["layout:" + n for n in refs],
        "layouts": refs, "dwell": ss.get("dwell"), "transition": ss.get("transition"),
        "triggers": ss.get("triggers", []), "screens": len(refs),
        "hash": _short_hash(json.dumps(ss, sort_keys=True).encode()),
    }


def screenset_units(screensets: dict, layouts: dict) -> list[dict]:
    """Descriptors for every stored screenset."""
    return [screenset_unit(sid, ss, layouts) for sid, ss in sorted(screensets.items())]


def resolve_layout_install(layout: dict, device_files: dict | None = None,
                           custom_dir=None) -> list[tuple[str, str]]:
    """All (device_path, content) widget/font files the device lacks for a layout."""
    device_files = device_files or {}
    seen: set[str] = set()
    out: list[tuple[str, str]] = []
    for t in _layout_widget_types(layout) + list(layout.get("overlays", [])):
        for path, content in resolve_install(t, device_files, custom_dir):
            if path not in seen:
                seen.add(path)
                out.append((path, content))
    return out


def resolve_screenset_install(screenset: dict, layouts: dict, device_files: dict | None = None,
                              custom_dir=None) -> list[tuple[str, str]]:
    """Union of the install files needed by every layout a screenset references."""
    device_files = device_files or {}
    seen: set[str] = set()
    out: list[tuple[str, str]] = []
    for name in screenset.get("layouts", []):
        lay = layouts.get(name)
        if not lay:
            continue
        for path, content in resolve_layout_install(lay, device_files, custom_dir):
            if path not in seen:
                seen.add(path)
                out.append((path, content))
    return out
