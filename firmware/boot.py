"""Boot-time OTA rollback guard. Runs before main.py imports the app, so it can
recover even when a bad engine module crashes import. Counts boot attempts after
an OTA; main.py clears the counter once it boots healthy, so repeated failures
restore the .bak files an OTA kept."""
import json
import machine
import sys
import time
import uos

# Foldered layout: put engine + content dirs on sys.path before main.py imports them.
for _p in ("/settings", "/assets/sounds", "/assets/icons", "/assets/fonts", "/widgets", "/engine"):
    if _p not in sys.path:
        sys.path.insert(0, _p)

OTA_PENDING = "/ota_pending"
BOOT_COUNT = "/boot_attempts"
MAX_BOOT_ATTEMPTS = 3


def _read(path):
    try:
        with open(path) as f:
            return f.read()
    except OSError:
        return None


_raw = _read(OTA_PENDING)
if _raw is not None:
    try:
        _pending = json.loads(_raw)
    except ValueError:
        _pending = []
    try:
        _n = int(_read(BOOT_COUNT) or 0) + 1
    except (ValueError, TypeError):
        _n = 1
    if _n > MAX_BOOT_ATTEMPTS:
        for _p in _pending:
            try:
                uos.rename(_p + ".bak", _p)
            except OSError:
                pass
        for _f in (OTA_PENDING, BOOT_COUNT):
            try:
                uos.remove(_f)
            except OSError:
                pass
        time.sleep(1)
        machine.reset()
    else:
        try:
            with open(BOOT_COUNT, "w") as f:
                f.write(str(_n))
        except OSError:
            pass
