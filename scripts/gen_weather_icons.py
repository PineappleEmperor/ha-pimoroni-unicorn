"""Generate firmware/engine/weather_icons.py from Dhole/weather-pixel-icons (CC BY-SA 4.0).

Fetches the 16x16 and 32x32 monochrome XBM icons, derives an 8x8 set by majority
downscale, and emits a bit-packed module. Re-run to refresh the art. Attribution lives
in NOTICE; this is a build tool, not shipped to the device.
"""
from pathlib import Path
import re
import urllib.error
import urllib.request

BASE = "https://raw.githubusercontent.com/Dhole/weather-pixel-icons/master"

# Weather bucket -> source xbm basename (no true 'fog' in the set; a soft cloud stands in).
ICONS = {
    "clear":         "sun",
    "partly_cloudy": "cloud_sun",
    "cloudy":        "clouds",
    "fog":           "cloud",
    "rain":          "rain1",
    "snow":          "snow",
    "storm":         "rain_lightning",
}

# Hand-drawn 8x8 glyphs — the 2x2 downscale of the detailed 16px art is too muddy at this size.
# '#' = lit; leftmost char is column 0.
OVERRIDE_8 = {
    "clear": [
        "..#..#..",
        "...##...",
        ".######.",
        "..####..",
        ".######.",
        "...##...",
        "..#..#..",
        "........",
    ],
    "partly_cloudy": [
        ".#......",
        "..#.##..",
        ".###..#.",
        "..#...#.",
        ".######.",
        "........",
        "........",
        "........",
    ],
    "cloudy": [
        "...##...",
        "..#..#..",
        ".#....#.",
        ".#....#.",
        ".######.",
        "........",
        "........",
        "........",
    ],
    "fog": [
        "........",
        "..####..",
        ".#....#.",
        ".######.",
        "........",
        ".######.",
        "........",
        ".######.",
    ],
    "rain": [
        "..###...",
        ".#...#..",
        ".#####..",
        "........",
        ".#.#.#..",
        ".#.#.#..",
        "........",
        "........",
    ],
    "snow": [
        "..###...",
        ".#...#..",
        ".#####..",
        "........",
        ".#.#.#..",
        "..#.#...",
        ".#.#.#..",
        "........",
    ],
    "storm": [
        "..###...",
        ".#...#..",
        ".#####..",
        "...#....",
        "..##....",
        "...#....",
        "..#.....",
        "........",
    ],
}


def _glyph(rows: list[str]) -> list[int]:
    """Convert an ASCII glyph (# = lit) to column-bit row masks."""
    return [sum(1 << c for c, ch in enumerate(row) if ch == "#") for row in rows]


def _fetch_xbm(name: str, size: int) -> list[int] | None:
    """Return `size` row bitmasks (bit c set => column c lit), or None if the file is absent."""
    url = f"{BASE}/{size}/{name}.xbm"
    try:
        text = urllib.request.urlopen(url, timeout=20).read().decode()
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return None
        raise
    body = text[text.index("{") + 1: text.rindex("}")]
    data = [int(h, 16) for h in re.findall(r"0x([0-9A-Fa-f]{2})", body)]
    bytes_per_row = (size + 7) // 8
    rows = []
    for r in range(size):
        mask = 0
        for k in range(bytes_per_row):
            mask |= data[r * bytes_per_row + k] << (8 * k)
        rows.append(mask & ((1 << size) - 1))
    return rows


def _downscale(rows: list[int], dst: int) -> list[int]:
    """Halve a square bitmap (src = 2*dst) by 2x2 majority (>=2 of 4 lit)."""
    out = []
    for r in range(dst):
        mask = 0
        for c in range(dst):
            lit = 0
            for dy in range(2):
                for dx in range(2):
                    if rows[r * 2 + dy] >> (c * 2 + dx) & 1:
                        lit += 1
            if lit >= 2:
                mask |= 1 << c
        out.append(mask)
    return out


def main() -> None:
    out = Path(__file__).resolve().parent.parent / "firmware" / "engine" / "weather_icons.py"
    lines = [
        '"""Monochrome weather icons at 8/16/32 px (bit c of each row mask = column c).',
        "",
        "Derived from Dhole/weather-pixel-icons (CC BY-SA 4.0) by scripts/gen_weather_icons.py.",
        "See NOTICE for attribution. Generated — do not edit by hand.",
        '"""',
        "WEATHER_ICONS = {",
    ]
    for bucket, src in ICONS.items():
        rows32 = _fetch_xbm(src, 32)
        if rows32 is None:
            raise SystemExit(f"missing 32/{src}.xbm")
        rows16 = _fetch_xbm(src, 16)
        if rows16 is None:
            rows16 = _downscale(rows32, 16)  # no 16px source; halve the 32px art
        rows8 = _glyph(OVERRIDE_8[bucket])
        lines.append(f"    {bucket!r}: {{")
        lines.append(f"        8: {rows8!r},")
        lines.append(f"        16: {rows16!r},")
        lines.append(f"        32: {rows32!r},")
        lines.append("    },")
        print(f"  {bucket:14s} <- {src}")
    lines.append("}")
    out.write_text("\n".join(lines) + "\n")
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
