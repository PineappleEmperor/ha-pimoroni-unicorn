"""Notification sound sequences for the Pimoroni Unicorn."""
import time

from hardware import Channel, HAS_AUDIO

NOTIFY_SOUNDS = {
    "beep":  [(880, 0.18), (0, 0.08)],
    "chime": [(523, 0.12), (659, 0.12), (784, 0.25), (0, 0.08)],
    "alert": [(1000, 0.08), (0, 0.04), (1000, 0.08), (0, 0.04), (1200, 0.18), (0, 0.08)],
}

_unicorn       = None
_synth_ch      = None
_sound_step    = 0
_sound_step_ms = 0


def init(unicorn_instance):
    """Initialise sounds module with the Unicorn hardware instance."""
    global _unicorn
    _unicorn = unicorn_instance


def _init_synth():
    global _synth_ch
    if not HAS_AUDIO or _synth_ch is not None:
        return
    _synth_ch = _unicorn.synth_channel(0)
    _synth_ch.configure(
        waveforms=Channel.SQUARE,
        attack=0.01, decay=0.1, sustain=0.5, release=0.1,
        volume=0.4,
    )


def _start_sound(sound_name):
    global _sound_step, _sound_step_ms
    if not HAS_AUDIO:
        return
    steps = NOTIFY_SOUNDS.get(sound_name)
    if not steps:
        return
    _init_synth()
    _sound_step    = 0
    _sound_step_ms = time.ticks_ms()
    freq, _ = steps[0]
    if freq > 0:
        _synth_ch.frequency(freq)
        _synth_ch.trigger_attack()
        _unicorn.play_synth()


def _tick_sound(sound_name):
    global _sound_step, _sound_step_ms
    if not HAS_AUDIO:
        return
    steps = NOTIFY_SOUNDS.get(sound_name)
    if not steps or _sound_step >= len(steps):
        return
    _, dur = steps[_sound_step]
    if time.ticks_diff(time.ticks_ms(), _sound_step_ms) < int(dur * 1000):
        return
    _sound_step += 1
    if _sound_step >= len(steps):
        return
    _sound_step_ms = time.ticks_ms()
    freq, _ = steps[_sound_step]
    if freq > 0:
        _synth_ch.frequency(freq)
        _synth_ch.trigger_attack()
    else:
        _synth_ch.trigger_release()
