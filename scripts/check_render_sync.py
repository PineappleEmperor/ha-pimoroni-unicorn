#!/usr/bin/env python3
"""CI guard: assert render/ copies match firmware/ (see sync_render.py)."""

import sys

from sync_render import do_check

if __name__ == "__main__":
    sys.exit(do_check())
