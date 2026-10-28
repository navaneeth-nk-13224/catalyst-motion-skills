"""Score + SFX for THIS film (rewrite per film). The instruments live in audio-src/synth.py — don't copy them here.
Music: <tempo> BPM, <key> (new key per film), arrangement following the arc (production/audio.md §2).
Every event time comes from src/cues.json via CUE() — the same names the visuals use.
Usage: ./film sound   → outputs/<film>/build/audio/music.wav, sfx.wav"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from synth import *  # noqa: E402,F401,F403

# ── music (example — replace) ──
for k, t0 in enumerate(np.arange(0, DUR, 2.0)):
    chord([["C3", "G3", "D#4"], ["G#2", "D#3", "C4"]][k % 2], t0, min(2.6, DUR - t0), 0.34)
for b in np.arange(1.0, DUR - 1.0, 0.5):
    add(drums, b, kick(0.5 if b % 1 else 0.7))
    add(drums, b + 0.25, hat(), 0.12, 0.3)
add(music, CUE("cta.button"), impact(1.4), 0.3)
add(music, CUE("cta.button") + 0.05, bell(hz("D#5"), 1.6, 1.8), 0.08)

# ── sfx (example — replace) ──
add(sfx, CUE("hook.title"), whoosh(0.45), 0.12)
add(sfx, CUE("cta.button"), blip(780, 0.12), 0.18)

finish()
