[![release][release-badge]][release-url]
[![commits-since-latest][commits-badge]][commits-url]
![stars][stars-badge]
![HACS][hacs-badge]
\
![python][python-badge]
![hassfest][hassfest-badge]
![hacs valid][hacs-valid-badge]

# Pimoroni Unicorn Integration for Home Assistant

Unofficial Home Assistant integration for [Pimoroni Unicorn](https://shop.pimoroni.com/collections/unicorn) LED matrix displays running on a Raspberry Pi Pico W. Communicates over local MQTT — no cloud required.

Includes MicroPython firmware for the Pico W and a HA config flow for device setup, live data publishing, and over-the-air firmware updates.

The notification system is heavily inspired by [AWTRIX](https://github.com/Blueforcer/awtrix3) — its payload model (text, icon, effect, colour, duration, stacking) shaped this integration's `notify` schema. Credit and thanks to the AWTRIX project.

> **AI assistance:** I'm a programmer; this project is built with AI (Claude, via Claude Code) for implementation, code review, and QA — under human direction. We challenge each other's choices: I review and push back on the AI's output, and it questions my decisions and flags trade-offs. Architecture and final review are mine; every change is human-reviewed before it merges.

## Supported hardware

| Model | Resolution |
|-------|-----------|
| Galactic Unicorn | 53 × 11 |
| Cosmic Unicorn | 32 × 32 |
| Stellar Unicorn | 16 × 16 |
| Unicorn Pack | 16 × 7 |
| Unicorn Mini Pack | 11 × 7 |
| Custom | configurable |

## Prerequisites

- Raspberry Pi Pico W flashed with [Pimoroni MicroPython](https://github.com/pimoroni/pimoroni-pico/releases)
- Home Assistant with the MQTT integration configured

## Installation

### HACS (recommended)
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=pineappleemperor&repository=ha-pimoroni-unicorn&category=Integration)

### Manual
Copy `custom_components/pimoroni_unicorn` into your Home Assistant `custom_components` folder and restart.

## Configuration

**Settings → Devices & Services → Add Integration → Pimoroni Unicorn**

Enter a device ID (must match `DEVICE_ID` in `secrets.py`) and select your Unicorn model.

After setup, open **Configure** to set optional data sources, currently these consist of:

| Option | Description |
|--------|-------------|
| Solar entity | Sensor reporting solar generation (W) |
| Consumption entity | Sensor reporting home consumption (W) |
| Battery SoC entity | Sensor reporting battery state of charge (%) |
| Battery charging entity | Binary sensor for charging state |
| Sun entity | Sun entity for day/night (default: `sun.sun`) |
| Weather condition entity | Sensor reporting OWM condition code |
| Extra sensors | One `entity_id topic_suffix` pair per line |

## Firmware setup

### 1. Fill in secrets

The firmware release zip already contains a ready-to-edit **`settings/secrets.py`** — just
open it and fill in your Wi-Fi credentials, MQTT broker details, `DEVICE_ID`, and `MODEL`
(`galactic`/`cosmic`/`stellar`). (Working from the repo instead? Copy
`firmware/settings/secrets.example.py` to `firmware/settings/secrets.py`.) `secrets.py` is
gitignored and stays on your machine/device only. The device shows an alert and won't
connect until `SSID`/`MQTT_SERVER` are set.

### 2. First flash (once, over USB)

A blank Pico has no network, so the first load must be physical. Copy the **whole
`firmware/` tree** to the Pico W using Thonny or similar, preserving the folder layout:
`boot.py` + `main.py` at the root, the runtime under `engine/`, widgets under `widgets/`,
fonts under `assets/fonts/`, and your `secrets.py` under `settings/`. This is the only
manual flash — everything after is over-the-air.

### 3. Boot, then manage over the air

The Pico W connects to Wi-Fi, syncs NTP, connects to MQTT, starts displaying, and
publishes its firmware version + a file manifest (`<device_id>/fw/manifest`). From then
on the integration owns updates: **`pimoroni_unicorn.push_firmware`** pushes the complete
engine file set (download-and-reboot, no reflash), and widgets are installed/removed
independently from the panel's Marketplace tab.

The firmware is split into a stable **engine** (the runtime/loader, rarely updated) and
**content** — widgets, fonts and layout — which are managed separately. See *Widgets &
marketplace* below.

## Features

### Display
- Clock and calendar (large digit rendering)
- Solar generation, consumption, net, and battery SoC indicator
- Weather overlay (rain, snow, sun, moon, cloud — driven by OWM condition code)
- Brightness up/down buttons (hardware buttons or HA button entities)
- Sleep/wake toggle

### Notifications

Two front doors to the same notification:

- **`notify.pimoroni_unicorn_<device_id>`** — the canonical surface. Standard HA notify, works with `notify.*` blueprints/scripts. Pass the message directly and the rich options under `data:` (see fields below).
- **`pimoroni_unicorn.send_notification`** — a guided builder with a sectioned form (basics, plus collapsed Appearance and Behaviour) and a device picker. Same result as the entity; exists because HA can only render a form for a custom action, not for an entity's free-form `data:`.

To clear the current notification, call **`pimoroni_unicorn.dismiss_notification`**; pass `all: true` to also empty the queue.

```yaml
action: notify.send_message
target:
  entity_id: notify.pimoroni_unicorn_1
data:
  message: "Garage open"
  data:
    icon: home
    effect: rainbow
    color: [0, 255, 0]
    duration: 8
```

A notification with an `icon` shows it in a left panel beside the text; an `effect` plays a full-screen background animation.

**Effects:** `rainbow`, `fire`, `matrix`, `scanner`, `comet`, `snow`, `confetti`, `flash`, `pulse`, `bounce`, `supercomputer`, `retroprompt`
**Sounds** (Galactic/Cosmic only): `beep`, `chime`, `alert`

`data:` fields: `icon`, `effect`, `effect_speed`, `sound`, `color`, `bg_color`, `duration`, `scroll_speed`, `entrance`, `outlined`, plus behaviour — `hold` (stay until dismissed/replaced), `repeat` (full scroll passes), `stack` (off = replace immediately), `wakeup` (show while asleep). Duration auto-extends so overflowing text completes its scroll.

### Icons

8×8 icons render in a left panel beside notification text. A small built-in set ships with the firmware; more can be installed from the [LaMetric icon gallery](https://developer.lametric.com/icons) via **Configure → Install LaMetric icon**: enter a gallery code, preview, name, install. Installed icons (animated GIFs included) are stored on the device and usable in notifications by name or by gallery code. Gallery icons are community-contributed; check the gallery page for individual icon credits.

For bulk preview or generating firmware built-ins there is a dev-side helper: `python scripts/fetch_lametric_icon.py 100-160` renders a labelled preview grid; `--json`/`--builtin` emit device and firmware formats.

### The panel — Designer, Marketplace, Widget editor, Playlists

The **Unicorn** sidebar panel has a persistent device selector (model + size shown) above four tabs. The frontend is a Lit/TypeScript bundle built from `frontend/` (`npm run build`) into `custom_components/pimoroni_unicorn/panel/editor.js`, and follows your HA light/dark theme.

- **Designer** — a **page** is one configured screen (which widgets sit where, with per-widget config/colour). Drag widgets on a pixel-accurate preview (rendered by the device's own code), then **Save & Push** to the device over MQTT (no reflash), or **Publish** to list it in the marketplace. Unsaved edits are guarded before switching page/device. Sensor widgets take an **entity** (lookup), can be added multiple times, and named per instance. Pick **Mock (preview only)** to design for any model without hardware, then **Export JSON** to share a page or import one under **Configure → Import layout**.
- **Widget editor** — author a *declarative* widget in a **Form** (add/edit draw ops via fields) or raw **YAML/JSON** (toggle), with a live device-faithful preview; **Import** a pasted spec and **Save** to your custom catalogue (`<config>/pimoroni_unicorn/widgets/`). Draw ops: `value`, `bar`, `rect`, `pixel`, `icon`, `dot`, with state `bind` + `fmt`.
- **Playlists** — compose a **playlist**: an ordered, timed cycle of pages (dwell + `fade` transition), reorder with ▲ ▼, preview the rotation, then **Push to device** or **Save as playlist**. Drive the live page/playlist from automations with the `show_page` / `set_playlist` services.

### Marketplace

The **Marketplace** tab lists installable content for the selected device in collapsible sections, with rendered thumbnails and per-device status; a **show all models** toggle reveals content for other models.

- **Pages** & **Playlists** — built-in starters plus your published ones. **Deploy** resolves and installs any widgets/fonts/icons the unit needs over the air, then pushes the page/playlist; a unit built for another model is blocked (with an explicit override).
- **Widgets & fonts** — built-in + custom widgets with install status and the device's engine version; Install/Update/Remove over the air (installing pulls required fonts, declared via `requires: ["font:<name>"]`). *Code* widgets are MicroPython modules (`widget_<id>.py`); *declarative* widgets are a safe JSON spec (`widget_<id>.json`) interpreted on-device — the preferred format to share.
- **Icons** — built-in 8×8 icons ship with the engine; add **LaMetric gallery icons by code** (preview, name, install). Installed icons are selectable in the **icon widget** and usable in notifications (animated GIFs included).

Engine modules and the shipped catalogue are kept byte-identical to `firmware/` by `scripts/sync_render.py`, guarded in CI (`check_render_sync.py`, `check_engine_manifest.py`).

### Energy mode

Cycle display between **Solar**, **Consumption**, and **Net** via the `<device_id>/energy_mode/set` MQTT topic or HA select entity.

## Services

### `pimoroni_unicorn.push_firmware`

Stages firmware files in `www/pimoroni_unicorn/<device_id>/` and publishes an OTA command to `<device_id>/ota`. The device downloads the files and reboots.

| Field | Description |
|-------|-------------|
| `files` | List of file keys to push (e.g. `["main", "hardware"]`) |
| `file_content` | Optional map of key → content to push inline without reading from disk, however it will replace the file on disk to keep parity |

### `pimoroni_unicorn.show_page`

Pin a specific page on a device (by `index` or `name`), or `clear` the pin to resume the playlist. Use from automations to switch the display on a trigger (time of day, an event, …).

### `pimoroni_unicorn.set_playlist`

Define a device's playlist from named `pages` (in order), with `dwell` seconds and a `transition`. The `notify.pimoroni_unicorn_<device_id>` entity remains the canonical notification surface.


## Development

All rendering runs in CPython with no hardware: `render_service.py` executes the real firmware draw code against a `PicoGraphics` shim (`render/` package) and returns PNGs. This powers the panel's **Designer** preview and Marketplace thumbnails, and the same path is used by `scripts/check_widget_boxes.py`, which renders every widget headless and asserts its lit-pixel bounding box (CI guard).

Author layouts in the **Designer** tab — pick a device, or **Mock (preview only)** to design for any model without hardware. Arrange widgets on the pixel-accurate preview, then **Export JSON** to share a layout, or **Save & Push** it to a device. Shared JSON is applied under **Configure → Import layout** (stored by name, selectable per device, pushed over MQTT) or published directly to the `<device_id>/layout` topic.

Because device and preview must render identically, firmware draw code uses only shim-faithful primitives (`pixel`, `rectangle`, bitmask fonts — no `circle`/`triangle`/non-bitmap fonts). Note: the shim has no `bitmap6` font, so the `tiny` clock variant renders approximately (font8 substituted); `big`/`small` are exact.

<!-- Badges -->

[commits-badge]: https://img.shields.io/github/commits-since/PineappleEmperor/ha-pimoroni-unicorn/latest?style=flat-square
[hacs-badge]: https://img.shields.io/badge/dynamic/regex?url=https%3A%2F%2Fraw.githubusercontent.com%2Fhacs%2Fdefault%2Frefs%2Fheads%2Fmaster%2Fintegration&search=(%22PineappleEmperor%2Fha-pimoroni-unicorn%22)&replace=default&style=flat-square&label=hacs&link=https%3A%2F%2Fgithub.com%2Fhacs%2Fintegration
[hacs-valid-badge]: https://img.shields.io/github/actions/workflow/status/PineappleEmperor/ha-pimoroni-unicorn/hacs_validate.yml?style=flat-square&label=hacs%20valid
[hassfest-badge]: https://img.shields.io/github/actions/workflow/status/PineappleEmperor/ha-pimoroni-unicorn/hassfest_validate.yml?style=flat-square&label=hassfest
[python-badge]: https://img.shields.io/github/actions/workflow/status/PineappleEmperor/ha-pimoroni-unicorn/python_validate.yml?style=flat-square&label=python
[release-badge]: https://img.shields.io/github/v/release/PineappleEmperor/ha-pimoroni-unicorn?style=flat-square
[stars-badge]: https://img.shields.io/github/stars/PineappleEmperor/ha-pimoroni-unicorn?style=flat-square

<!-- References -->

[commits-url]: https://github.com/PineappleEmperor/ha-pimoroni-unicorn/commits/main/
[release-url]: https://github.com/PineappleEmperor/ha-pimoroni-unicorn/releases
