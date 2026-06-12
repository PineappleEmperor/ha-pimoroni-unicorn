#!/usr/bin/env python3
"""Interactive terminal emulator for Pimoroni Unicorn firmware modules.

Runs the real firmware rendering code (notify_animations, icons,
animations/*.py) against a CPython PicoGraphics shim and draws the LED
matrix in the terminal with 24-bit half-block characters.

Usage:
  python scripts/emulate.py animations                  cycle animation modules
  python scripts/emulate.py notify '{"v":2,"text":"hi","icon":"check"}'
  python scripts/emulate.py icons                       cycle built-in + installed icons
  python scripts/emulate.py display                     main display (clock/calendar/solar/weather)
  --model galactic|cosmic|stellar (default galactic), --frames N (headless)

Keys: [space] pause  [r] restart  [n]/[p] next/prev  [+]/[-] speed  [q] quit
display mode: [w] weather  [e] energy mode  [d] day/night  [c] charging
              [n]/[p] battery %  [+]/[-] solar power
Edits to watched firmware files (notify_animations, icons, drawing,
weather_fx, bitfonts, animations/*) hot-reload automatically.
"""

import argparse
import json
import sys
import time

from emulator import loader, term
from emulator.shim import PicoGraphics

MODELS = {"galactic": (53, 11), "cosmic": (32, 32), "stellar": (16, 16)}


WEATHER_CONDITIONS = ["clear", "light_rain", "rain", "thunderstorm", "light_snow", "snow"]
ENERGY_MODES       = ["Net", "Solar", "Consumption"]


def run_display(args):
    width, height = MODELS[args.model]
    g = PicoGraphics(width, height)
    loader.install_mocks()
    drawing, weather_fx = loader.load_display(g, width, height)

    state = {
        "solar": 2500.0, "consumption": 800.0, "soc": 75, "charging": True,
        "sun_below": False, "energy_mode": 0, "weather": 0, "anim": True,
    }
    pens = {
        "postit_red": g.create_pen(200, 0, 0),
        "blue2":      g.create_pen(0, 0, 128),
        "grey":       g.create_pen(60, 60, 60),
    }
    sensors = {
        "demo_a": {"state": True,  "on_rgb": (140, 192, 80), "off_rgb": (35, 48, 20), "x": 37, "y": 1, "spacing": 4, "name": "a"},
        "demo_b": {"state": False, "on_rgb": (247, 190, 18), "off_rgb": (62, 48, 5),  "x": 41, "y": 1, "spacing": 4, "name": "b"},
    }

    def render():
        g.set_pen(g.create_pen(0, 0, 0))
        g.clear()
        t = time.localtime()
        drawing.draw_clock(10, t)
        drawing.draw_calendar(t[2], 0, 0, pens["postit_red"])
        drawing.draw_big_weekdays(t[6], 12, 7, pens["blue2"], pens["grey"])
        drawing.draw_solar_quadrant(
            state["solar"], state["soc"], state["charging"], state["sun_below"],
            mode=ENERGY_MODES[state["energy_mode"]], consumption=state["consumption"],
            battery_animation=state["anim"],
        )
        drawing.draw_display_sensors(sensors)
        weather_fx.weather_overlay(WEATHER_CONDITIONS[state["weather"]])

    if args.frames:
        for _ in range(args.frames):
            render()
        nonblack = sum(1 for p in g.buffer if p != (0, 0, 0))
        print(f"rendered {args.frames} display frames; {nonblack} lit pixels in last frame")
        return

    if not term.is_tty():
        sys.exit("not a tty — use --frames N for headless rendering")

    mtimes = loader.watched_mtimes()
    last_watch = time.monotonic()
    with term.TerminalRenderer(width, height) as renderer, term.Keyboard() as kb:
        while True:
            now = time.monotonic()
            if now - last_watch > 1.0:
                last_watch = now
                current = loader.watched_mtimes()
                if current != mtimes:
                    mtimes = current
                    drawing, weather_fx = loader.reload_display(g, width, height)

            key = kb.poll()
            if key == "q":
                return
            if key == "w":
                state["weather"] = (state["weather"] + 1) % len(WEATHER_CONDITIONS)
                weather_fx.init_weather_drops(WEATHER_CONDITIONS[state["weather"]])
            elif key == "e":
                state["energy_mode"] = (state["energy_mode"] + 1) % len(ENERGY_MODES)
            elif key == "d":
                state["sun_below"] = not state["sun_below"]
            elif key == "c":
                state["charging"] = not state["charging"]
            elif key == "n":
                state["soc"] = min(100, state["soc"] + 5)
            elif key == "p":
                state["soc"] = max(0, state["soc"] - 5)
            elif key in ("+", "="):
                state["solar"] += 250
            elif key == "-":
                state["solar"] = max(0.0, state["solar"] - 250)

            render()
            renderer.draw(
                g.buffer,
                f"{WEATHER_CONDITIONS[state['weather']]} {ENERGY_MODES[state['energy_mode']]}"
                f" solar={state['solar']:.0f}W soc={state['soc']}%"
                f"{' chg' if state['charging'] else ''}{' night' if state['sun_below'] else ''}  "
                "w=weather e=energy d=day/night c=chg n/p=soc +/-=solar q=quit",
            )
            time.sleep(0.02)


def run(args):
    width, height = MODELS[args.model]
    g = PicoGraphics(width, height)
    loader.install_mocks()
    na, icons = loader.load_notify(g, width, height)

    if args.mode == "animations":
        items = sorted(na.NOTIFY_ANIMATIONS)
        label = lambda i: f"animation: {items[i]}"
    elif args.mode == "icons":
        import os
        installed = [f[:-5] for f in sorted(os.listdir(loader.ICONS_DIR)) if f.endswith(".json")]
        items = sorted(icons.STATIC_ICONS) + installed
        label = lambda i: f"icon: {items[i]}"
    else:
        items = [json.loads(p) for p in args.payloads] or [{"v": 2, "text": "hello world", "icon": "check"}]
        label = lambda i: f"payload: {json.dumps(items[i])[:60]}"

    idx, speed, paused = 0, 1.0, False
    start = time.monotonic()
    pause_at = 0.0
    mtimes = loader.watched_mtimes()
    last_watch = time.monotonic()

    def elapsed_ms():
        t = pause_at if paused else (time.monotonic() - start)
        return int(t * 1000 * speed)

    def render(ms):
        if args.mode == "animations":
            na.NOTIFY_ANIMATIONS[items[idx]](ms, 0, 0, width, height, (255, 255, 255), (0, 0, 0))
        elif args.mode == "icons":
            g.set_pen(g.create_pen(0, 0, 0))
            g.clear()
            icons.draw_icon(items[idx], (width - icons.ICON_SIZE) // 2,
                            (height - icons.ICON_SIZE) // 2, ms)
        else:
            na._draw_notification(items[idx], ms)

    if args.frames:
        for n in range(args.frames):
            render(n * 33)
        nonblack = sum(1 for p in g.buffer if p != (0, 0, 0))
        print(f"rendered {args.frames} frames of {label(idx)}; {nonblack} lit pixels in last frame")
        return

    if not term.is_tty():
        sys.exit("not a tty — use --frames N for headless rendering")

    with term.TerminalRenderer(width, height) as renderer, term.Keyboard() as kb:
        while True:
            now = time.monotonic()
            if now - last_watch > 1.0:
                last_watch = now
                current = loader.watched_mtimes()
                if current != mtimes:
                    mtimes = current
                    na, icons = loader.reload_notify(g, width, height)
                    if args.mode == "animations":
                        items = sorted(na.NOTIFY_ANIMATIONS)
                        idx = min(idx, len(items) - 1)

            key = kb.poll()
            if key == "q":
                return
            if key == " ":
                if paused:
                    start = time.monotonic() - pause_at
                else:
                    pause_at = time.monotonic() - start
                paused = not paused
            elif key == "r":
                start = time.monotonic()
                pause_at = 0.0
                na.reset_fire_heat()
            elif key in ("n", "p"):
                idx = (idx + (1 if key == "n" else -1)) % len(items)
                start = time.monotonic()
                pause_at = 0.0
                na.reset_fire_heat()
            elif key in ("+", "="):
                speed = min(8.0, speed * 2)
            elif key == "-":
                speed = max(0.125, speed / 2)

            render(elapsed_ms())
            state = "paused" if paused else f"x{speed:g}"
            renderer.draw(
                g.buffer,
                f"[{idx + 1}/{len(items)}] {label(idx)} ({state})  "
                "space=pause r=restart n/p=cycle +/-=speed q=quit",
            )
            time.sleep(0.02)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("mode", choices=["animations", "notify", "icons", "display"])
    ap.add_argument("payloads", nargs="*", help="notify payload JSON strings")
    ap.add_argument("--model", choices=MODELS, default="galactic")
    ap.add_argument("--frames", type=int, help="render N frames headless and exit")
    args = ap.parse_args()
    if args.mode == "display":
        run_display(args)
    else:
        run(args)


if __name__ == "__main__":
    main()
