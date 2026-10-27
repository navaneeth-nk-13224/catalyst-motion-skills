"""Catalyst film synth library (48 kHz stereo) — the same for every film; don't edit per film.
A film's score lives in audio-src/make_sound.py:   from synth import *   … add(...) …   finish()
Buffers: music · drums · sfx (2×N). Times in seconds; CUE("name") reads src/cues.json (same names as the visuals)."""
import json, sys, wave
from pathlib import Path
import numpy as np

TL = json.load(open(sys.argv[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
from timeline_tools import cue as _cue, word as _word  # noqa: E402
_CUES = json.load(open(Path(sys.argv[1]).with_name("cues.json"))) if Path(sys.argv[1]).with_name("cues.json").exists() else {}
CUE = lambda name: _cue(TL, _CUES, name)  # same names as src/cues.ts → visuals and sound never drift
WORD = lambda line, text, nth=0: _word(TL, line, text, nth)
SR, DUR = 48000, float(TL["cuts"][-1])
from toolchain import AUDIO_DIR  # noqa: E402
OUT = AUDIO_DIR  # outputs/<film>/build/audio
OUT.mkdir(parents=True, exist_ok=True)
N = int(SR * DUR)
rng = np.random.default_rng(23)
music, drums, sfx = (np.zeros((2, N)) for _ in range(3))


def t_axis(s):
    return np.arange(int(s * SR)) / SR


def hz(n):
    k = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4, "F#": -3, "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2}
    return 440.0 * 2 ** ((k[n[:-1]] + (int(n[-1]) - 4) * 12) / 12)


def add(b, start, sig, gain=1.0, pan=0.0):
    i = int(round(start * SR))
    if not 0 <= i < N:
        return
    sig = sig[: N - i]
    b[0, i : i + len(sig)] += sig * gain * np.cos((pan + 1) * np.pi / 4)
    b[1, i : i + len(sig)] += sig * gain * np.sin((pan + 1) * np.pi / 4)


def band(x, lo, hi):
    s = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    s[(f < lo) | (f > hi)] = 0
    return np.fft.irfft(s, len(x))


def lp(x, c):
    s = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(s / np.sqrt(1 + (f / c) ** 4), len(x))


def fade(x, a=0.003, r=0.01):
    e = np.ones(len(x))
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return x * e


def pad_voice(fr, d):
    t = t_axis(d)
    return sum(np.sin(2 * np.pi * fr * n * (1 + det) * t + n) / n ** 1.6 for det in (-0.004, 0, 0.0035) for n in range(1, 7))


def pluck(fr, d=0.45, bright=1.0):
    t = t_axis(d)
    s = sum(np.sin(2 * np.pi * fr * n * t) * np.exp(-t * (6 + n * 5 / bright)) / n for n in range(1, 6))
    return fade(s * (1 - np.exp(-t * 400)), 0.001, 0.05)


def bass(fr, d):
    t = t_axis(d)
    s = np.sin(2 * np.pi * fr * t) + 0.25 * np.sin(4 * np.pi * fr * t)
    return fade(s * (1 - np.exp(-t * 80)) * np.exp(-t * 1.2), 0.002, 0.06)


def kick(g=1.0):
    t = t_axis(0.45)
    f = 45 + 110 * np.exp(-t * 28)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5) + band(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-t * 300) * 0.15
    return fade(s * g, 0.0005, 0.03)


def hat(open_=False):
    d = 0.18 if open_ else 0.05
    t = t_axis(d)
    return fade(band(rng.standard_normal(len(t)), 7000, 16000) * np.exp(-t * (18 if open_ else 70)), 0.0005, 0.01)


def clap():
    t = t_axis(0.3)
    env = sum(np.exp(-np.clip(t - k * 0.011, 0, None) * 60) * (t >= k * 0.011) for k in range(3)) + np.exp(-t * 14) * 0.6
    return fade(band(rng.standard_normal(len(t)), 900, 5000) * env * 0.5, 0.0005, 0.03)


def riser(d):
    t = t_axis(d)
    x = t / d
    n = rng.standard_normal(len(t))
    out = np.zeros(len(t))
    for i in range(0, len(t), 2048):
        c = 400 + 7000 * x[i] ** 2
        out[i : i + 2048] = band(n[i : i + 2048], c * 0.5, c * 1.6)
    return (out + np.sin(2 * np.pi * np.cumsum(220 + 660 * x ** 2) / SR) * 0.25) * x ** 2.2


def impact(d=1.6):
    t = t_axis(d)
    f = 38 + 60 * np.exp(-t * 9)
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3) + lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 5) * 0.5, 0.001, 0.2)


def whoosh(d=0.45):
    t = t_axis(d)
    x = t / d
    n = rng.standard_normal(len(t))
    return (band(n, 200, 1500) * (1 - x) + band(n, 1500, 8000) * x) * np.sin(np.pi * x) ** 2


def tick(b=4200, d=0.016):
    t = t_axis(d)
    return fade(band(rng.standard_normal(len(t)), b, 12000) * np.exp(-t * 320) + np.sin(2 * np.pi * b * 0.6 * t) * np.exp(-t * 500) * 0.35, 0.0005, 0.004)


def blip(fr=900, d=0.08):
    t = t_axis(d)
    f = fr * (1 - 0.3 * (1 - np.exp(-t * 60)))
    return fade(np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 40), 0.001, 0.01)


def settle(fr=180):
    t = t_axis(0.35)
    return fade(np.sin(2 * np.pi * fr * t) * np.exp(-t * 18) + lp(rng.standard_normal(len(t)), 1200) * np.exp(-t * 30) * 0.3, 0.001, 0.03)


def bell(fr, d=1.6, dec=2.6):
    t = t_axis(d)
    return fade(sum(a * np.sin(2 * np.pi * fr * m * t) * np.exp(-t * dec * k) for m, a, k in [(1, 1, 1), (2, 0.3, 1.6), (2.76, 0.18, 2.2), (5.4, 0.06, 3.4)]), 0.002, 0.05)


def air(d=0.3):
    t = t_axis(d)
    return band(rng.standard_normal(len(t)), 3000, 11000) * np.sin(np.pi * t / d) ** 2 * 0.5


def sparkle_run(base, n=5, gap=0.035):
    out = np.zeros(int(1.0 * SR))
    for k, r in enumerate([1, 9 / 8, 5 / 4, 3 / 2, 2][:n]):
        b = bell(base * r, 0.8, 6.0) * (1 - k * 0.12)
        i = int(k * gap * SR)
        out[i : i + len(b)] += b[: len(out) - i]
    return out



def chord(notes, t0, d, g=0.38, cutoff=1700):
    """Detuned pad chord, faded in/out, low-passed, spread L/R."""
    s = sum(pad_voice(hz(n), d) for n in notes) / len(notes)
    tt = t_axis(d)
    s = lp(s * np.minimum(1, tt / 0.6) * np.clip((d - tt) / 0.6, 0, 1), cutoff)
    add(music, t0, s, g, -0.2)
    add(music, t0 + 0.012, s, g, 0.2)


def reverb(b, secs=1.6, wet=0.25):
    n = int(secs * SR)
    out = np.zeros_like(b)
    for ch in range(2):
        ir = band(rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.4), 200, 9000)
        ir /= np.sqrt(np.sum(ir ** 2))
        size = 1 << int(np.ceil(np.log2(N + n)))
        out[ch] = b[ch] * (1 - wet) + np.fft.irfft(np.fft.rfft(b[ch], size) * np.fft.rfft(ir, size), size)[:N] * wet
    return out


def write(path, x):
    x = np.tanh(x * 1.3) / np.tanh(1.3)
    x *= 0.89 / max(1e-9, np.max(np.abs(x)))
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x.T, -1, 1) * 32767).astype("<i2").tobytes())


def finish(music_reverb=(2.0, 0.22), sfx_reverb=(1.4, 0.25), tail_s=0.4):
    """Reverb, 0.4s tail fade, write music.wav + sfx.wav into outputs/<film>/build/audio."""
    tail = np.ones(N)
    tail[-int(tail_s * SR):] = np.linspace(1, 0, int(tail_s * SR))
    write(str(OUT / "music.wav"), (reverb(music, *music_reverb) + drums * 0.9) * tail)
    write(str(OUT / "sfx.wav"), reverb(sfx, *sfx_reverb) * tail)
    print("ok")
