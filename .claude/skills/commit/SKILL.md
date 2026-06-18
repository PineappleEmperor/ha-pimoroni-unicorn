---
name: commit
description: Stage relevant files and create a Conventional Commit for ha-pimoroni-unicorn, honoring repo conventions and the commit-msg githook.
---

# Commit

Stage the relevant files and create a Conventional Commit. **Propose the message and the
file list, then commit.**

## Type

- `fix:` — behavior change to existing code (bug fix, corrected logic).
- `feat:` / `feat!:` — new feature / breaking change. `feat!:` (or a `BREAKING CHANGE:`
  footer) for breaking.
- `docs:` — **doc-only** changes (README, comments, this skill text). Never `docs:` if any
  `.py`/`.ts`/firmware behavior changed.
- `chore:` / `refactor:` / `perf:` / `test:` / `ci:` / `build:` — as applicable.

## Subject

- Format `<type>: <imperative summary>` — **no scope** (plain `feat:`/`fix:`, not
  `feat(panel):`). Imperative mood. No trailing period. **Hard cap 72 chars.**

## Body

- **None.** The `commit-msg` githook rejects narrative body lines. Put detail in the PR /
  release notes, not the commit. Only allowed below the subject: trailers (`Co-Authored-By:`,
  `Refs #N`) and a `BREAKING CHANGE:` footer.

## Before staging

- If any `firmware/` render module changed, run `python scripts/sync_render.py` first so
  `render/` + `catalog/` stay in sync (CI guards this).
- **Never stage** `secrets.py`, real Wi-Fi/MQTT credentials, or hardware IDs (device id stays
  the `pimoroni_unicorn_1` placeholder). These are gitignored — confirm none slipped in.
- Stage only files relevant to this change; don't `git add -A` blindly.

## Trailers

End the message with:

```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

Use the GitHub noreply email for the author identity.

## Versioning (reminder, not per-commit)

Bump `manifest.json` once per PR (not per commit): `git fetch origin`, compare to
`origin/main`, match the bump to PR type (feat→minor, fix/chore→patch, breaking→major).
