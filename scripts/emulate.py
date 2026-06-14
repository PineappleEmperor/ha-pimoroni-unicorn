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
  python scripts/emulate.py display '{"v":2,"text":"hi"}'   custom takeover payloads for [t]
  --model galactic|cosmic|stellar (default galactic), --frames N (headless)

Keys: [space] pause  [r] restart  [n]/[p] next/prev  [+]/[-] speed  [q] quit
display mode: [t] send notification (cycles payloads, demo set if none given)
              [x] dismiss  [X] dismiss all  [w] weather  [e] energy mode
              [d] day/night  [c] charging  [n]/[p] battery %  [+]/[-] solar power
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


DEMO_PAYLOADS = [
    {"v": 2, "text": "hello world", "icon": "check", "sound": "chime"},
    {"v": 2, "text": "a longer scrolling message", "effect": "fire", "repeat": 1},
    {"v": 2, "text": "slide in", "icon": "alert", "entrance": "slide_left"},
    {"v": 2, "text": "holding", "icon": "home", "hold": True},
    {"v": 2, "text": "replace!", "stack": False, "bg_color": [60, 0, 0]},
    {"mode": "simple", "text": "legacy payload", "icon": "sun"},
]


def _handle_state_key(key, state, weather_fx):
    if key == "w":
        state["weather"] = (state["weather"] + 1) % len(WEATHER_CONDITIONS)
        weather_fx.init_weather_drops(WEATHER_CONDITIONS[state["weather"]])
    elif key == "e":
        state["energy_mode"] = (state["energy_mode"] + 1) % len(ENERGY_MODES)
    elif key == "d":
        state["sun_below"] = not state["sun_below"]
        if state["sun_below"]:
            state["day_solar"] = state["solar"]
            state["solar"] = 0.0
        else:
            state["solar"] = state.get("day_solar", 2.5)
    elif key == "c":
        state["charging"] = not state["charging"]
    elif key == "n":
        state["soc"] = min(100, state["soc"] + 5)
    elif key == "p":
        state["soc"] = max(0, state["soc"] - 5)
    elif key in ("+", "="):
        state["solar"] += 0.25
    elif key == "-":
        state["solar"] = max(0.0, state["solar"] - 0.25)


def run_display(args):
    width, height = MODELS[args.model]
    g = PicoGraphics(width, height)
    loader.install_mocks()
    na, _icons = loader.load_notify(g, width, height)
    drawing, weather_fx = loader.load_display(g, width, height)
    payloads = [json.loads(p) for p in args.payloads] or DEMO_PAYLOADS

    state = {
        "solar": 2.5, "consumption": 0.8, "soc": 75, "charging": True,
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
    notify_queue = []
    notify_active = None
    notify_start = 0.0
    notify_end_ms = 0
    payload_idx = 0

    with term.TerminalRenderer(width, height) as renderer, term.Keyboard() as kb:
        while True:
            now = time.monotonic()
            if now - last_watch > 1.0:
                last_watch = now
                current = loader.watched_mtimes()
                if current != mtimes:
                    mtimes = current
                    na, _icons = loader.reload_notify(g, width, height)
                    drawing, weather_fx = loader.reload_display(g, width, height)

            key = kb.poll()
            if key == "q":
                return
            if key == "t":
                payload = payloads[payload_idx % len(payloads)]
                payload_idx += 1
                if payload.get("stack") is False:
                    notify_queue.clear()
                    notify_active = None
                if len(notify_queue) < 5:
                    notify_queue.append(payload)
            elif key == "x":
                notify_active = None
            elif key == "X":
                notify_active = None
                notify_queue.clear()
            elif key:
                _handle_state_key(key, state, weather_fx)

            # Notification takeover — mirrors firmware main_loop
            if notify_active is None and notify_queue:
                notify_active = notify_queue.pop(0)
                notify_start = now
                notify_end_ms = na.compute_duration_ms(notify_active)
                na.reset_fire_heat()

            if notify_active is not None:
                elapsed = int((now - notify_start) * 1000)
                expired = notify_end_ms is not None and elapsed >= notify_end_ms
                if expired or (notify_end_ms is None and notify_queue):
                    notify_active = None
                else:
                    na._draw_notification(notify_active, elapsed)
                    remaining = "hold" if notify_end_ms is None else f"{(notify_end_ms - elapsed) / 1000:.1f}s"
                    renderer.draw(
                        g.buffer,
                        f"NOTIFY [{remaining}] queue={len(notify_queue)}  "
                        f"{json.dumps(notify_active)[:50]}  t=send x=dismiss X=all q=quit",
                    )
                    time.sleep(0.02)
                    continue

            render()
            net = state["solar"] - state["consumption"]
            renderer.draw(
                g.buffer,
                f"time={time.strftime('%H:%M')}  day={time.localtime().tm_mday}"
                f"  weather={WEATHER_CONDITIONS[state['weather']]}"
                f"  {'night (moon if solar=0)' if state['sun_below'] else 'day'}\n"
                f"energy mode={ENERGY_MODES[state['energy_mode']]}"
                f"  solar={state['solar']:.2f}kW  load={state['consumption']:.2f}kW"
                f"  net={net:+.2f}kW  battery={state['soc']}%"
                f"  charging={'yes' if state['charging'] else 'no'}"
                f"  queue={len(notify_queue)}\n"
                "[t]notify [x/X]dismiss [w]weather [e]energy [d]day/night "
                "[c]charging [n/p]battery [+/-]solar [q]quit",
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
