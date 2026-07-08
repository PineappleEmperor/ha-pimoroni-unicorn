#!/usr/bin/env python3
"""Gate: if any OTA engine file changed vs the base, ENGINE_VERSION must be bumped."""
from __future__ import annotations

import argparse
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
EXCLUDE = {"secrets.py", "secrets.example.py", "__init__.py", "version.py"}
_SRC_DIRS = ["firmware", "firmware/engine", "firmware/widgets", "firmware/assets/fonts"]


def engine_paths() -> set[str]:
    """Repo-relative paths of OTA engine .py files (excludes version.py itself)."""
    out: set[str] = set()
    for rel in _SRC_DIRS:
        for p in (ROOT / rel).glob("*.py"):
            if p.name not in EXCLUDE:
                out.add(f"{rel}/{p.name}")
    return out


def _git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True,
                          text=True, check=False).stdout


def _engine_version(text: str) -> str | None:
    for line in text.splitlines():
        if line.strip().startswith("ENGINE_VERSION"):
            return line.split("=", 1)[1].strip().strip("\"'")
    return None


def evaluate(changed_engine: list[str], base_version: str | None,
             head_version: str | None) -> tuple[bool, str]:
    """Pure decision: engine files changed but version unchanged -> fail."""
    if not changed_engine:
        return True, "no engine files changed"
    if head_version is None:
        return False, "could not read ENGINE_VERSION at HEAD"
    if base_version is not None and head_version == base_version:
        files = ", ".join(sorted(changed_engine)[:8])
        more = "" if len(changed_engine) <= 8 else f" (+{len(changed_engine) - 8} more)"
        return False, (f"engine files changed but ENGINE_VERSION is still {head_version}; "
                       f"bump firmware/engine/version.py + const.py. Changed: {files}{more}")
    return True, f"engine bumped to {head_version} (base {base_version})"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base-ref", default="origin/main")
    args = parser.parse_args(argv)

    base = args.base_ref
    changed = [f for f in _git("diff", "--name-only", f"{base}...HEAD").splitlines()
               if f in engine_paths()]
    head_ver = _engine_version((ROOT / "firmware" / "engine" / "version.py").read_text())
    base_ver = _engine_version(_git("show", f"{base}:firmware/engine/version.py")) or None

    ok, msg = evaluate(changed, base_ver, head_ver)
    print(msg if ok else f"ENGINE_VERSION gate: {msg}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
