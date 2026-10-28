"""Mix — REPRODUCIBLE (pure NumPy / SciPy / pyloudnorm, pinned in requirements.lock; no system FFmpeg).

  ./film mix

Same chain the films have always used:
  VO   : placed at vo[].at → high-pass 80 Hz → compressor (−20 dB, 3:1, 5 ms / 120 ms) → +5.6 dB
  music: −5.2 dB → side-chain ducked by the VO (thr 0.03, 6:1, 20 ms / 350 ms)
  sfx  : × 0.8
  sum  → two-pass loudness: measure (ITU-R BS.1770-4) → linear gain to −14 LUFS → true-peak ceiling −1.5 dBTP
Inputs: outputs/<film>/build/audio/music.wav, sfx.wav (make_sound.py), build/vo/t<N>.wav (kokoro_vo.py)
Outputs: outputs/<film>/build/audio/voiceover.wav, mix.wav (16-bit PCM, no dither → deterministic)."""
import json
import sys
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from scipy.ndimage import minimum_filter1d
from scipy.signal import butter, resample_poly, sosfilt

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
from toolchain import AUDIO_DIR, VO_DIR  # noqa: E402

SR = 48000
TARGET_LUFS, CEIL_DBTP = -14.0, -1.5
tl = json.load(open(sys.argv[1]))
N = int(round(tl["cuts"][-1] * SR))
A = AUDIO_DIR


def read(p):
    x, sr = sf.read(p, always_2d=True, dtype="float64")
    x = x.T
    if sr != SR:
        x = resample_poly(x, SR, sr, axis=1)
    return x


def fit(x, n=N):
    out = np.zeros((x.shape[0], n))
    m = min(n, x.shape[1])
    out[:, :m] = x[:, :m]
    return out


def envelope(level, attack_ms, release_ms):
    """One-pole attack/release follower on a (mono) detector signal."""
    a = np.exp(-1.0 / (SR * attack_ms / 1000))
    r = np.exp(-1.0 / (SR * release_ms / 1000))
    env = np.empty_like(level)
    e = 0.0
    for n, v in enumerate(level):
        e = (a if v > e else r) * e + (1 - (a if v > e else r)) * v
        env[n] = e
    return env


def comp_gain(key, thr_lin, ratio, attack_ms, release_ms):
    """RMS-style detector on the key; returns the linear gain to apply (≤ 1)."""
    rms = np.sqrt(envelope(key ** 2, attack_ms, release_ms) + 1e-20)
    over = np.maximum(0.0, 20 * np.log10(rms / thr_lin))
    return 10 ** (-(over * (1 - 1 / ratio)) / 20)


def true_peak_db(x):
    return 20 * np.log10(np.max(np.abs(resample_poly(x, 4, 1, axis=1))) + 1e-12)


# ── VO bus ──
vo = np.zeros(N)
for i, line in enumerate(tl["vo"], 1):
    y = read(VO_DIR / f"t{i}.wav")[0]
    s0 = int(round(line["at"] * SR))
    e = min(N, s0 + len(y))
    vo[s0:e] += y[: e - s0]
vo = sosfilt(butter(2, 80, "highpass", fs=SR, output="sos"), vo)
vo = vo * comp_gain(vo, 10 ** (-20 / 20), 3, 5, 120) * 1.9
vo2 = np.vstack([vo, vo])
sf.write(A / "voiceover.wav", np.clip(vo2.T, -1, 1), SR, subtype="PCM_16")

# ── music ducked by the VO, plus SFX ──
music = fit(read(A / "music.wav")) * 0.55
duck = music * comp_gain(vo, 0.03, 6, 20, 350)
sfx = fit(read(A / "sfx.wav")) * 0.8
mix = duck + vo2 + sfx

# ── two-pass loudness: linear gain to target, then a look-ahead true-peak ceiling ──
meter = pyln.Meter(SR)
ceil = 10 ** (CEIL_DBTP / 20)
for _ in range(4):
    mix *= 10 ** ((TARGET_LUFS - meter.integrated_loudness(mix.T)) / 20)
    if true_peak_db(mix) <= CEIL_DBTP:
        break
    peak = np.max(np.abs(resample_poly(mix, 4, 1, axis=1)), axis=0).reshape(-1, 4).max(axis=1)[:N]
    g = minimum_filter1d(np.minimum(1.0, ceil * 0.995 / np.maximum(peak, 1e-12)), size=int(0.003 * SR) | 1)
    g = 1 - envelope(1 - g, 0.5, 60)  # smooth release, no clicks
    mix *= np.minimum(g, 1.0)
lufs = meter.integrated_loudness(mix.T)
tp = true_peak_db(mix)
sf.write(A / "mix.wav", np.clip(mix.T, -1, 1), SR, subtype="PCM_16")
print(f"mixed → {A / 'mix.wav'}  ({lufs:.2f} LUFS, {tp:.2f} dBTP)")
