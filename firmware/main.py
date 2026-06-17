"""Root entrypoint: ensure the foldered layout is on sys.path, then run the engine.

The device tree is /engine (runtime), /widgets, /assets/{fonts,icons,sounds} and
/settings. boot.py sets these first; this repeats it idempotently so the engine still
starts if boot.py was skipped. Root (/) stays on sys.path as a fallback."""
import sys

for _p in ("/settings", "/assets/sounds", "/assets/icons", "/assets/fonts", "/widgets", "/engine"):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import app  # noqa: E402  engine entrypoint — runs asyncio.run(main()) on import
