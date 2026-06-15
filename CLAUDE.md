# Contributing to ha-pimoroni-unicorn

Guidance for contributors (and for Claude/AI sessions) working on this repo. If you're
using Claude, also invoke the `ha-integration` skill before changing integration code.

## What this is

A Home Assistant custom integration **plus** MicroPython firmware for Pimoroni Unicorn LED
matrix displays (Galactic 53×11, Cosmic 32×32, Stellar 16×16), talking over local MQTT.

The firmware is split into a stable **engine** (runtime/loader: WiFi, MQTT, render loop,
OTA) and **content** (widgets, fonts, layout, live data) managed independently — including a
widget/font **marketplace**. See the README for the user-facing view.

## Repo layout

- `custom_components/pimoroni_unicorn/` — the HA integration (config flow, websocket API,
  render service, marketplace, panel). Shipped by HACS.
  - `render/` — CPython-runnable copies of firmware render modules (import-transformed) for
    the pixel-accurate preview. **Generated — do not edit by hand.**
  - `catalog/` — verbatim, device-installable widget/font units. **Generated.**
  - `panel/editor.js` — built Lit/TS bundle. **Generated from `frontend/`.**
- `firmware/` — MicroPython for the Pico W (the source of truth for render code).
- `frontend/` — Lit + TypeScript panel source; `npm run build` → `panel/editor.js`.
- `scripts/` — sync + CI-guard tooling and the terminal emulator.

## The core rule: one render path, kept in sync

Device and emulator must render **identically**. The firmware render modules in `firmware/`
are the source; `scripts/sync_render.py` copies them into `render/` (import-transformed) and
`catalog/` (verbatim). After editing any firmware render module, run:

```
python scripts/sync_render.py
```

CI guards enforce it — these must pass:
- `python scripts/check_render_sync.py` — `render/` + `catalog/` match `firmware/`
- `python scripts/check_widget_boxes.py` — declared widget boxes == lit-pixel bbox
- `python scripts/check_engine_manifest.py` — every engine module is in `OTA_SOURCE_FILES`
- `ruff check custom_components/` and `pyright custom_components/` (firmware/, render/,
  catalog/ are excluded — lint the source in `firmware/`)
- frontend: `cd frontend && npm run build`, committed `editor.js` must match

**Emulator faithfulness:** only draw with primitives the shim reproduces exactly —
`pixel`, `rectangle`, and the bitmask fonts. No `circle`/`triangle`/non-bitmap fonts in
firmware draw code (build shapes from pixels instead), or device and emulator diverge.

## Widgets & fonts

- A **code widget** is `firmware/widget_<id>.py` exposing `WIDGET` (descriptor), optional
  `box(cfg)`, and `render(g, x, y, w, h, cfg, state)`. `widgets.py` is the loader.
- A **declarative widget** is a JSON spec (`widget_<id>.json`) interpreted by
  `declarative.py` — safe data, the preferred import/share format. Ops: `value`, `bar`,
  `rect`, `pixel`, `icon` with state `bind` + `fmt`.
- Fonts are installable units; a widget declares `requires: ["font:<name>"]` and install
  resolves them. Add built-ins to the lists in `scripts/sync_render.py` so they ship.
- The device reports an `ENGINE_VERSION` + file-hash manifest on connect; the marketplace
  diffs against it to show installed/outdated/missing.

## Notifications

`notify.pimoroni_unicorn_<device_id>` is the canonical surface (rich options via `data:`).
`pimoroni_unicorn.send_notification` is a guided form builder for the same payload (kept
because HA only renders a form for a custom action, not an entity's `data:`). The payload
model is heavily inspired by AWTRIX.

## Conventions

- **Docstrings:** short, single-line only (module and function). No multi-paragraph or
  padded docstrings. No inline comments unless the *why* is non-obvious.
- **Commits:** Conventional Commits (`feat`/`fix`/`docs`/`refactor`/`chore`…). `feat!` or a
  `BREAKING CHANGE:` footer for breaking changes. PR title drives the squash-merge subject.
- **Versioning:** bump `manifest.json` once per PR. `git fetch origin` first, compare to
  `origin/main`, and match the bump to the PR type (feat→minor, fix/chore→patch, breaking→
  major). Don't bump per commit. Check the branch isn't already merged before adding to it.
- **Never commit** `secrets.py` (gitignored), real Wi-Fi/MQTT credentials, or hardware IDs.
  Use the GitHub noreply email for commits.

## Testing without hardware

- `python scripts/emulate.py` — terminal emulator (renders via the same shim).
- `render_service.render_layout_png` / `render_widget_png` — the panel's backend preview,
  byte-faithful to the device.
- First device flash is physical (USB/Thonny) once; everything after is OTA.
