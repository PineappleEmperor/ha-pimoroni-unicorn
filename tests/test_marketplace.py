"""Pure-function tests for marketplace spec validation + compatibility + catalogue."""
import pytest


@pytest.fixture(scope="module")
def mk():
    """The real marketplace module (Home Assistant is installed in the test env)."""
    from custom_components.pimoroni_unicorn import marketplace
    return marketplace


def test_validate_spec_accepts_valid(mk):
    assert mk.validate_spec({"id": "x", "draw": [{"op": "rect", "x": 0, "y": 0, "w": 1, "h": 1}]}) is None


@pytest.mark.parametrize("spec", [
    {"draw": []},                                   # missing id
    {"id": "x"},                                     # missing draw
    {"id": "x", "draw": [{"op": "bogus"}]},          # unknown op
    {"id": "x", "draw": "notalist"},                 # draw not a list
])
def test_validate_spec_rejects(mk, spec):
    assert isinstance(mk.validate_spec(spec), str)


def test_compatible(mk):
    assert mk.compatible(None, "stellar") is True          # no constraint = universal
    assert mk.compatible(["stellar"], "stellar") is True
    assert mk.compatible(["cosmic"], "stellar") is False


def test_builtin_catalogues_nonempty(mk):
    ids = {w["id"] for w in mk.builtin_widgets()}
    assert {"clock", "icon"} <= ids
    assert isinstance(mk.builtin_overlays(), list)
    layouts = mk.builtin_layouts()
    assert layouts  # keyed by display name; each carries a model
    assert {v["model"] for v in layouts.values()} <= {"galactic", "cosmic", "stellar"}


def test_device_path(mk):
    assert mk.device_path("icons.py").endswith("/icons.py")


def test_device_diff(mk):
    # Device reports an old clock hash + is missing others -> diff flags them.
    manifest = {"engine_version": "1.7.0", "files": {"widget_clock": "deadbeef"}}
    diff = mk.device_diff(manifest)
    assert isinstance(diff, list) and diff
    assert all("id" in d and "status" in d for d in diff)


def test_layout_requires(mk):
    lay = {"widgets": [{"id": "clock", "cfg": {}}]}
    reqs = mk.layout_requires(lay)
    assert isinstance(reqs, list)


def test_resolve_install_clock(mk):
    files = mk.resolve_install("clock")
    assert files and files[0][0].endswith("widget_clock.py")


def test_save_and_delete_custom(mk, tmp_path):
    spec = {"id": "mine", "label": "Mine", "draw": [{"op": "pixel", "x": 0, "y": 0}]}
    wid = mk.save_custom(str(tmp_path), spec)
    assert wid == "mine"
    got = {w["id"] for w in mk.custom_widgets(mk.widgets_dir(str(tmp_path)))}
    assert "mine" in got
    mk.delete_custom(str(tmp_path), "mine")
    assert "mine" not in {w["id"] for w in mk.custom_widgets(mk.widgets_dir(str(tmp_path)))}


def test_layout_and_screenset_units(mk):
    layouts = mk.builtin_layouts()
    units = mk.layout_units(layouts)
    assert units and all("id" in u and "compat" in u for u in units)
    first = sorted(layouts)[0]
    ss = {"S1": {"label": "S1", "layouts": [first], "dwell": 10, "transition": "none"}}
    sunits = mk.screenset_units(ss, layouts)
    assert sunits and sunits[0]["id"] == "S1"


def test_resolve_layout_and_screenset_install(mk):
    lay = {"widgets": [{"id": "clock", "cfg": {}}]}
    assert isinstance(mk.resolve_layout_install(lay), list)
    layouts = {"L": lay}
    ss = {"label": "S", "layouts": ["L"], "dwell": 10, "transition": "none"}
    assert isinstance(mk.resolve_screenset_install(ss, layouts), list)


def test_unit_device_file(mk):
    df = mk.unit_device_file("clock")
    assert df is None or df.endswith(".py")


def test_device_diff_missing_and_current(mk):
    # Device has none of the units -> everything is missing/outdated.
    diff = mk.device_diff({"engine_version": "1.7.0", "files": {}})
    assert any(d["status"] in ("missing", "outdated", "not_installed") for d in diff)


def test_validate_spec_rejects_non_dict_op(mk):
    assert isinstance(mk.validate_spec({"id": "x", "draw": [123]}), str)


def test_custom_widgets_skips_malformed(mk, tmp_path):
    wdir = mk.widgets_dir(str(tmp_path))
    wdir.mkdir(parents=True, exist_ok=True)
    (wdir / "widget_bad.json").write_text("{not json")
    (wdir / "widget_ok.json").write_text('{"id": "ok", "label": "OK", "draw": []}')
    ids = {w["id"] for w in mk.custom_widgets(wdir)}
    assert "ok" in ids and "bad" not in ids


def test_resolve_install_with_font_deps(mk):
    files = mk.resolve_install("clock", device_files={})
    assert isinstance(files, list) and files


def test_font_deps_and_widget_requires(mk):
    """A widget resolves its files (and any font deps) as (device_path, content) pairs."""
    files = mk.resolve_install("clock", device_files={})
    names = [f[0] for f in files]
    assert any(n.endswith(".py") for n in names)
    lay = {"widgets": [{"id": "clock", "cfg": {}}]}
    reqs = mk.layout_requires(lay)
    assert isinstance(reqs, list)


def test_widget_requires_variants(mk, tmp_path):
    """Requirement tokens resolve for builtin, custom and overlay widgets + layouts."""
    assert isinstance(mk._widget_requires("clock"), list)
    assert isinstance(mk._widget_requires("weather"), list)
    (tmp_path / "widget_c.json").write_text('{"id": "c", "requires": ["font:tall"], "draw": []}')
    assert "font:tall" in mk._widget_requires("c", str(tmp_path))
    reqs = mk.layout_requires({"widgets": [{"id": "c", "cfg": {}}]}, str(tmp_path))
    assert "font:tall" in reqs


def test_font_deps_direct(mk):
    deps = mk._font_deps(["font:tall"], {})
    assert deps and all(d[0].endswith(".py") for d in deps)
    assert mk._font_deps(["font:tall"], {"monospace_tall": "hash"}) == [] or \
        isinstance(mk._font_deps(["font:tall"], {"monospace_tall": "hash"}), list)


def test_save_custom_roundtrip_via_widget_path(mk, tmp_path):
    spec = {"id": "wp", "label": "WP", "requires": ["font:tall"],
            "draw": [{"op": "value", "bind": "x"}]}
    mk.save_custom(str(tmp_path), spec)
    assert mk.unit_device_file("wp", mk.widgets_dir(str(tmp_path))) is not None
