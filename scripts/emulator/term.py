"""ANSI terminal renderer: two LED rows per text row via half-block chars.

Also provides raw-mode nonblocking keyboard input. A future web renderer
implements the same draw(buffer) contract against the shim framebuffer.
"""

import os
import select
import sys
import termios
import tty

_HIDE = "\x1b[?25l"
_SHOW = "\x1b[?25h"
_HOME = "\x1b[H"
_CLEAR = "\x1b[2J"
_RESET = "\x1b[0m"


class TerminalRenderer:
    def __init__(self, width, height, status_lines=2):
        self.width  = width
        self.height = height
        self.status_lines = status_lines
        self._last = None

    def __enter__(self):
        sys.stdout.write(_CLEAR + _HIDE)
        return self

    def __exit__(self, *exc):
        sys.stdout.write(_RESET + _SHOW + "\n")
        sys.stdout.flush()

    def draw(self, buffer, status=""):
        rows = []
        for y in range(0, self.height, 2):
            cells = []
            for x in range(self.width):
                tr, tg, tb = buffer[y * self.width + x]
                if y + 1 < self.height:
                    br, bg_, bb = buffer[(y + 1) * self.width + x]
                else:
                    br, bg_, bb = 0, 0, 0
                cells.append(
                    f"\x1b[38;2;{tr};{tg};{tb}m\x1b[48;2;{br};{bg_};{bb}m▀"
                )
            rows.append("".join(cells) + _RESET)
        status = status.replace("\n", "\x1b[K\n")
        frame = _HOME + "\n".join(rows) + "\n" + _RESET + "\x1b[K" + status + "\x1b[J"
        if frame != self._last:
            sys.stdout.write(frame)
            sys.stdout.flush()
            self._last = frame


class Keyboard:
    """Raw-mode nonblocking single-key reader."""

    def __enter__(self):
        self._fd = sys.stdin.fileno()
        self._saved = termios.tcgetattr(self._fd)
        tty.setcbreak(self._fd)
        return self

    def __exit__(self, *exc):
        termios.tcsetattr(self._fd, termios.TCSADRAIN, self._saved)

    def poll(self):
        if select.select([sys.stdin], [], [], 0)[0]:
            return sys.stdin.read(1)
        return None


def is_tty():
    return sys.stdin.isatty() and sys.stdout.isatty() and os.environ.get("TERM") != "dumb"
