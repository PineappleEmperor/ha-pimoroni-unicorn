#!/usr/bin/env python3
"""Interactive terminal emulator for Pimoroni Unicorn firmware modules.

Runs the real firmware rendering code (notify_animations, icons,
animations/*.py) against a CPython PicoGraphics shim and draws the LED
matrix in the terminal with 24-bit half-block characters.

Usage:
  python scripts/emulate.py animations                  cycle animation modules
  python scripts/emulate.py notify '{"v":2,"text":"hi","icon":"check"}'
  python scripts/emulate.py icons                       cycle built-in + installed icons
  --model galactic|cosmic|stellar (default galactic), --frames N (headless)

Keys: [space] pause  [r] restart  [n]/[p] next/prev  [+]/[-] speed  [q] quit
Edits to firmware/notify_animations.py, icons.py, or animations/*.py
hot-reload automatically.
"""

import argparse
import json
import sys
import time

from emulator import loader, term
from emulator.shim import PicoGraphics

MODELS = {"galactic": (53, 11), "cosmic": (32, 32), "stellar": (16, 16)}


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
    ap.add_argument("mode", choices=["animations", "notify", "icons"])
    ap.add_argument("payloads", nargs="*", help="notify payload JSON strings")
    ap.add_argument("--model", choices=MODELS, default="galactic")
    ap.add_argument("--frames", type=int, help="render N frames headless and exit")
    args = ap.parse_args()
    run(args)


if __name__ == "__main__":
    main()
