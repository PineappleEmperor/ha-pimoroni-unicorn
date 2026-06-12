#!/usr/bin/env python3
"""Fetch LaMetric gallery icons for preview and firmware/device formats.

Usage:
  python scripts/fetch_lametric_icon.py 1234 5678 887        preview grid -> icons_preview.png
  python scripts/fetch_lametric_icon.py 100-160              code ranges allowed
  python scripts/fetch_lametric_icon.py 1234 --json check    device JSON -> check.json
  python scripts/fetch_lametric_icon.py 1234 --builtin check STATIC_ICONS snippet -> stdout
"""

import argparse
import base64
import io
import json
import sys
import time
import urllib.error
import urllib.request

from PIL import Image, ImageDraw

THUMB_URL = "https://developer.lametric.com/content/apps/icon_thumbs/{code}"
ICON_SIZE = 8
SCALE     = 12
PAD       = 4
LABEL_H   = 10


def fetch(code):
    req = urllib.request.Request(
        THUMB_URL.format(code=code), headers={"User-Agent": "Mozilla/5.0"}
    )
    with urllib.request.urlopen(req, timeout=15) as r:
        return r.read()


def decode(raw):
    """Return (frames as RGB Images, durations ms)."""
    img = Image.open(io.BytesIO(raw))
    frames, durations = [], []
    for i in range(getattr(img, "n_frames", 1)):
        img.seek(i)
        rgba = img.convert("RGBA")
        if rgba.size != (ICON_SIZE, ICON_SIZE):
            rgba = rgba.resize((ICON_SIZE, ICON_SIZE), Image.Resampling.NEAREST)
        black = Image.new("RGBA", rgba.size, (0, 0, 0, 255))
        frames.append(Image.alpha_composite(black, rgba).convert("RGB"))
        durations.append(int(img.info.get("duration", 100)))
    return frames, durations


def preview_grid(icons, out_path, columns=10):
    """Render labelled grid of first frames at SCALE x."""
    cell_w = ICON_SIZE * SCALE + PAD
    cell_h = ICON_SIZE * SCALE + LABEL_H + PAD
    rows   = (len(icons) + columns - 1) // columns
    grid   = Image.new("RGB", (columns * cell_w + PAD, rows * cell_h + PAD), (30, 30, 30))
    draw   = ImageDraw.Draw(grid)
    for idx, (code, frames, _durations) in enumerate(icons):
        cx = PAD + (idx % columns) * cell_w
        cy = PAD + (idx // columns) * cell_h
        big = frames[0].resize((ICON_SIZE * SCALE, ICON_SIZE * SCALE), Image.Resampling.NEAREST)
        grid.paste(big, (cx, cy))
        label = str(code) + ("*" if len(frames) > 1 else "")
        draw.text((cx, cy + ICON_SIZE * SCALE), label, fill=(200, 200, 200))
    grid.save(out_path)
    print(f"wrote {out_path} ({len(icons)} icons, * = animated)")


def emit_json(code, frames, durations, name):
    payload = {
        "code":      code,
        "frames":    [base64.b64encode(f.tobytes()).decode() for f in frames],
        "durations": durations,
    }
    path = f"{name}.json"
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh)
    print(f"wrote {path}")


def emit_builtin(code, frames, durations, name):
    b64 = [base64.b64encode(f.tobytes()).decode() for f in frames]
    if len(frames) == 1:
        print(f'    "{name}": _lm("{b64[0]}"),  # lametric {code}')
    else:
        frame_lines = ",\n        ".join(f'_lm("{s}")' for s in b64)
        print(f'    "{name}": (  # lametric {code}')
        print(f"        [{frame_lines}],")
        print(f"        {durations},")
        print("    ),")


def parse_codes(args):
    codes = []
    for a in args:
        if "-" in a:
            lo, hi = a.split("-", 1)
            codes.extend(range(int(lo), int(hi) + 1))
        else:
            codes.append(int(a))
    return codes


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("codes", nargs="+", help="icon codes or ranges (100-160)")
    ap.add_argument("--json", metavar="NAME", help="write device JSON for a single code")
    ap.add_argument("--builtin", metavar="NAME", help="print STATIC_ICONS snippet for a single code")
    ap.add_argument("--out", default="icons_preview.png", help="preview grid output path")
    ap.add_argument("--delay", type=float, default=0.25, help="seconds between fetches")
    args = ap.parse_args()

    codes = parse_codes(args.codes)
    if (args.json or args.builtin) and len(codes) != 1:
        sys.exit("--json/--builtin take exactly one code")

    icons = []
    for code in codes:
        try:
            frames, durations = decode(fetch(code))
        except (urllib.error.URLError, OSError, ValueError) as err:
            print(f"skip {code}: {err}", file=sys.stderr)
            continue
        icons.append((code, frames, durations))
        if len(codes) > 1:
            time.sleep(args.delay)

    if not icons:
        sys.exit("nothing fetched")

    if args.json:
        code, frames, durations = icons[0]
        emit_json(code, frames, durations, args.json)
    elif args.builtin:
        code, frames, durations = icons[0]
        emit_builtin(code, frames, durations, args.builtin)
    else:
        preview_grid(icons, args.out)


if __name__ == "__main__":
    main()
