"""Engine version, reported to Home Assistant for update tracking.

Versioned independently of the HA integration (manifest.json). 1.1.0 introduced the
foldered on-device layout (/engine, /widgets, /assets, /settings) — a one-time USB
reflash from any 1.0.x build, since OTA cannot relocate main.py or restructure paths.
"""
ENGINE_VERSION = "1.2.6"
