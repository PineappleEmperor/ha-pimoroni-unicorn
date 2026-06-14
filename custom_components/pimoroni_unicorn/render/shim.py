"""CPython PicoGraphics shim backed by a plain RGB framebuffer.

Implements the subset of the PicoGraphics API the firmware uses:
pens, pixel, rectangle, line, circle, clear, clip, bitmap8 text.
Renderers (terminal, web) consume .buffer — a width*height list of
(r, g, b) tuples.
"""

from . import font8

LETTER_SPACING = 1


class PicoGraphics:
    def __init__(self, width, height):
        self.width  = width
        self.height = height
        self.buffer = [(0, 0, 0)] * (width * height)
        self._pen   = (255, 255, 255)
        self._font  = "bitmap8"
        self._clip  = None

    def create_pen(self, r, g, b):
        return (int(r) & 255, int(g) & 255, int(b) & 255)

    def set_pen(self, pen):
        self._pen = pen if isinstance(pen, tuple) else (255, 255, 255)

    def set_font(self, name):
        self._font = name

    def set_clip(self, x, y, w, h):
        self._clip = (x, y, w, h)

    def remove_clip(self):
        self._clip = None

    def clear(self):
        if self._clip:
            self.rectangle(*self._clip)
        else:
            self.buffer = [self._pen] * (self.width * self.height)

    def pixel(self, x, y):
        if self._clip:
            cx, cy, cw, ch = self._clip
            if not (cx <= x < cx + cw and cy <= y < cy + ch):
                return
        if 0 <= x < self.width and 0 <= y < self.height:
            self.buffer[y * self.width + x] = self._pen

    def rectangle(self, x, y, w, h):
        for py in range(y, y + h):
            for px in range(x, x + w):
                self.pixel(px, py)

    def line(self, x1, y1, x2, y2):
        dx, dy = abs(x2 - x1), -abs(y2 - y1)
        sx, sy = (1 if x1 < x2 else -1), (1 if y1 < y2 else -1)
        err = dx + dy
        while True:
            self.pixel(x1, y1)
            if x1 == x2 and y1 == y2:
                return
            e2 = 2 * err
            if e2 >= dy:
                err += dy
                x1 += sx
            if e2 <= dx:
                err += dx
                y1 += sy

    def circle(self, cx, cy, r):
        for py in range(cy - r, cy + r + 1):
            for px in range(cx - r, cx + r + 1):
                if (px - cx) ** 2 + (py - cy) ** 2 <= r * r:
                    self.pixel(px, py)

    def measure_text(self, text, scale=2, letter_spacing=LETTER_SPACING, fixed_width=False):
        width = 0
        for ch in text:
            idx = ord(ch) - 32
            if 0 <= idx < len(font8.WIDTHS):
                width += (font8.MAX_WIDTH if fixed_width else font8.WIDTHS[idx]) * scale
                width += letter_spacing * scale
        return width - letter_spacing * scale if width else 0

    def text(self, text, x, y, wordwrap=-1, scale=2, angle=0, spacing=LETTER_SPACING, fixed_width=False):
        cx = x
        for ch in text:
            idx = ord(ch) - 32
            if not 0 <= idx < len(font8.WIDTHS):
                continue
            data  = font8.DATA[idx]
            cwidth = font8.WIDTHS[idx]
            for col in range(cwidth):
                bits = data[col]
                for row in range(font8.HEIGHT):
                    if bits & (1 << row):
                        for oy in range(scale):
                            for ox in range(scale):
                                self.pixel(cx + col * scale + ox, y + row * scale + oy)
            cx += (cwidth + spacing) * scale
