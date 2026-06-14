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

### 1. Generate secrets

Call **Developer Tools → Services → `pimoroni_unicorn.generate_secrets`**.

A `secrets_<device_id>.py` file is written to `<config>/pimoroni_unicorn/`. Open it and fill in `SSID`, `PASSWORD`, and `MQTT_PASSWORD`, then rename to `secrets.py`.

### 2. Copy firmware to the Pico W

Copy to the root of your Pico W using Thonny or similar:
- `secrets.py`
- `main.py`
- `hardware.py`
- all other `.py` files from `firmware/`

After the first version of the firmware is deployed you can use **`pimoroni_unicorn.push_firmware`** to push files over-the-air once the device is already running.

### 3. Boot

The Pico W connects to Wi-Fi, syncs NTP, connects to MQTT, and starts displaying.

## Features

### Display
- Clock and calendar (large digit rendering)
- Solar generation, consumption, net, and battery SoC indicator
- Weather overlay (rain, snow, sun, moon, cloud — driven by OWM condition code)
- Brightness up/down buttons (hardware buttons or HA button entities)
- Sleep/wake toggle

### Notifications

Trigger via `notify.pimoroni_unicorn_<device_id>` or MQTT topic `<device_id>/notify`.

**Animations:** `rainbow`, `fire`, `matrix`, `scanner`, `comet`, `snow`, `confetti`, `flash`, `pulse`, `bounce`, `supercomputer`, `retroprompt`

**Sounds** (Galactic/Cosmic only — models with audio): `beep`, `chime`, `alert`

Message text scrolls alongside the animation. Supports `color`, `bg_color`, `animation`, `sound`, and `duration` data fields.

### Icons

8×8 icons render in a left panel beside notification text. A small built-in set ships with the firmware; more can be installed from the [LaMetric icon gallery](https://developer.lametric.com/icons) via **Configure → Install LaMetric icon**: enter a gallery code, preview, name, install. Installed icons (animated GIFs included) are stored on the device and usable in notifications by name or by gallery code. Gallery icons are community-contributed; check the gallery page for individual icon credits.

For bulk preview or generating firmware built-ins there is a dev-side helper: `python scripts/fetch_lametric_icon.py 100-160` renders a labelled preview grid; `--json`/`--builtin` emit device and firmware formats.

### Layout editor

Each Unicorn model has a configurable display layout (which widgets — clock, calendar, weekday bars, solar/energy — sit where, with per-widget variant and colour). Edit it visually from the **Unicorn Layout** panel in the HA sidebar: pick a device, drag widgets on a pixel-accurate preview (rendered by the device's own code in the backend), then **Save & Push** to store the named layout and send it to the device over MQTT — no reflash. Layouts can also be authored in the terminal emulator (`scripts/emulate.py layout`) and imported under **Configure → Import layout**.

The panel frontend is a Lit/TypeScript bundle built from `frontend/` (`npm run build`) into `custom_components/pimoroni_unicorn/panel/editor.js`.

### Energy mode

Cycle display between **Solar**, **Consumption**, and **Net** via the `<device_id>/energy_mode/set` MQTT topic or HA select entity.

## Services

### `pimoroni_unicorn.generate_secrets`

Writes pre-filled `secrets_<device_id>.py` files to `<config>/pimoroni_unicorn/` for each configured device. Pulls broker address and credentials from the HA MQTT integration automatically.

### `pimoroni_unicorn.push_firmware`

Stages firmware files in `www/pimoroni_unicorn/<device_id>/` and publishes an OTA command to `<device_id>/ota`. The device downloads the files and reboots.

| Field | Description |
|-------|-------------|
| `files` | List of file keys to push (e.g. `["main", "hardware"]`) |
| `file_content` | Optional map of key → content to push inline without reading from disk, however it will replace the file on disk to keep parity |


## Development

`scripts/emulate.py` runs the real firmware rendering code against a CPython PicoGraphics shim and draws the LED matrix in the terminal (24-bit ANSI, two pixels per character row) — no hardware needed:

```bash
python scripts/emulate.py animations                                # cycle animation modules
python scripts/emulate.py notify '{"v":2,"text":"hi","icon":"check"}'
python scripts/emulate.py icons                                     # built-in + installed icons
python scripts/emulate.py display --model cosmic                    # main screen, per-model layout
python scripts/emulate.py layout  --model cosmic                    # visual layout editor
```

Keys: `space` pause, `r` restart, `n`/`p` cycle, `+`/`-` speed, `q` quit. In `display` mode press `t` to fire a notification over the running screen (takeover, like the device). In `layout` mode the arrow keys move the selected widget (snapped to the grid), `tab` selects the next, `v` cycles its variant, `space` enables/disables it, `a`/`r` add/remove, and `s` saves to `scripts/emulator/layouts/<model>.json`. Apply that JSON to a device either by importing it under **Configure → Import layout** (stored by name, selectable per device, pushed over MQTT) or by publishing it directly to the `<device_id>/layout` topic.

Edits to watched firmware files (`notify_animations.py`, `icons.py`, `drawing.py`, `weather_fx.py`, `bitfonts.py`, `widgets.py`, `layouts.py`, `animations/*.py`) hot-reload live. `--model cosmic|stellar` switches matrix size; `--frames N` renders headless (CI-friendly). The renderer consumes a plain RGB framebuffer, so alternative frontends (e.g. a web canvas) can reuse the same shim. Note: the shim has no `bitmap6` font, so the `tiny` clock variant renders approximately (font8 substituted); `big`/`small` are exact.

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
