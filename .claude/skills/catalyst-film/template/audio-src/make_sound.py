"""Catalyst film score + SFX (48 kHz stereo). TEMPLATE: the synth library (top) is reusable; the
`# ── music ──` and `# ── sfx ──` sections are an EXAMPLE (the CloudScale 30s film) — rewrite them per film,
taking event times from the scene constants (cut time + ms() offsets), never by ear.
Example score:
Music: 120 BPM (beat = 500ms = skill STANDARD), A major, A | F#m7 | Dmaj7 | E cycle, resolve to A at 27.0s.
  0–5 pad + arp · 5–10 kick 1&3, hats, bass · 9–10 riser → 10.0 drop, four-on-floor (components) ·
  17–23.5 groove without claps (booking) · 23.5–26.5 break (pricing) · 26.5 riser → 27.0 resolve + tail.
Usage: python audio-src/make_sound.py src/timeline.json   → outputs/<film>/build/audio/music.wav, sfx.wav"""
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


# ── music ──
A_ = (["A2", "E3", "A3", "B3", "C#4"], "A1")
FS = (["F#2", "C#3", "F#3", "A3", "E4"], "F#1")
D_ = (["D2", "A2", "D3", "F#3", "C#4"], "D2")
E_ = (["E2", "B2", "E3", "G#3", "B3"], "E1")
AR = (["A2", "E3", "A3", "C#4", "E4"], "A1")
CH = [(t, *c) for t, c in [(0, A_), (2, FS), (4, D_), (6, E_), (8, A_), (10, FS), (12, D_), (14, E_), (16, A_), (18, FS), (20, D_), (22, E_), (24, A_), (26, E_), (27, AR)]]
ARP = {"A1": ["A4", "C#5", "E5", "B4"], "F#1": ["F#4", "A4", "C#5", "E5"], "D2": ["D4", "F#4", "A4", "C#5"], "E1": ["E4", "G#4", "B4", "E5"]}
GROOVE = (5.0, 23.5)
for i, (t0, notes, root) in enumerate(CH):
    if t0 >= DUR:  # example score is 30s; skip what falls past this film's end
        continue
    d = (CH[i + 1][0] if i + 1 < len(CH) else DUR) - t0 + 0.6
    s = sum(pad_voice(hz(n), d) for n in notes) / len(notes)
    tt = t_axis(d)
    s = lp(s * np.minimum(1, tt / 0.5) * np.clip((d - tt) / 0.6, 0, 1), 2400 if 10 <= t0 < 17 else 1700)
    add(music, t0, s, 0.4, -0.2)
    add(music, t0 + 0.012, s, 0.4, 0.2)
    for b in range(int(min(d - 0.6, 2))):
        st = t0 + b
        if GROOVE[0] <= st < GROOVE[1]:
            add(music, st, bass(hz(root), 0.95), 0.55)
add(music, 27.0, bass(hz("A1"), 2.5), 0.5)


def chord_at(t):
    return [c for c in CH if c[0] <= t][-1][2]


for k in range(1, int(26.5 / 0.25)):
    t0 = k * 0.25
    root = chord_at(t0)
    seq = ARP.get(root, ARP["A1"])
    note = seq[k % 4] if (k // 4) % 2 == 0 else seq[(3 - k) % 4]
    full = 10 <= t0 < 23.5
    g = 0.1 if t0 < 5 else (0.07 if t0 >= 23.5 else 0.13)
    add(music, t0, pluck(hz(note), 0.5, 1.8 if full else 1.0), g, 0.35 if k % 2 else -0.35)
for b in range(10, 47):  # beats 5.0s … 23.0s
    t0 = b * 0.5
    ff = 10.0 <= t0 < 23.5
    if ff or b % 2 == 0:
        add(drums, t0, kick(0.85 if ff else 0.6))
    add(drums, t0 + 0.25, hat(), 0.13 if not ff else 0.16, 0.3)
    if 10.0 <= t0 < 17.0 and b % 2 == 1:
        add(drums, t0, clap(), 0.2, -0.1)
    if 17.0 <= t0 < 23.5 and b % 4 == 3:
        add(drums, t0 + 0.25, hat(True), 0.08, -0.3)
add(music, 9.0, riser(1.0), 0.22)
add(music, 26.0, riser(1.0), 0.18)
add(music, 0.0, impact(1.8), 0.3)
add(music, 10.0, impact(1.6), 0.42)
add(music, 27.0, impact(1.4), 0.38)
add(drums, 27.0, kick(1.0))
for j, n in enumerate(["A5", "C#6", "E6", "A6"]):
    add(music, 27.55 + j * 0.05, bell(hz(n), 1.4, 1.6), 0.08, -0.3 + j * 0.2)

# ── sfx (synced to Film.tsx / art.tsx timings; scene-local f=0 sits on each cut) ──
for cut in (5.0, 10.0, 17.0, 23.5, 27.0):  # 300ms ease-in exits
    add(sfx, cut - 0.3, whoosh(0.45), 0.18, -0.3)
# 1 · hook — platform + sources land, traces draw, call-and-response packets
for i, t0 in enumerate([0.8, 0.9, 1.0]):
    add(sfx, t0, settle(140 + i * 40), 0.32, 0.3)
add(sfx, 1.1, sparkle_run(2349, 4), 0.04, 0.3)
for t0 in (0.4, 0.5, 0.6, 0.7):
    add(sfx, t0, air(), 0.035, -0.4)
for n in range(4):
    for who, t in (("you", 1.5 + n + 0.7), ("agent", 2.0 + n + 0.7)):
        if t < 4.75:
            add(sfx, t, blip(1320 if who == "you" else 990, 0.06), 0.07, 0.35 if who == "you" else -0.2)
# 2 · agents
A2 = 5.0
add(sfx, A2 + 0.05, whoosh(0.4), 0.07, 0.4)
for i in range(6):
    add(sfx, A2 + 0.3 + i * 0.033, blip(1000 + i * 90, 0.045), 0.06, 0.2 + i * 0.05)
PROMPT = "Add sign-in and a bookings table."
for k in range(1, len(PROMPT) + 1, 2):
    tt = A2 + 0.85 + 0.9 * (np.arccos(1 - 2 * (k / len(PROMPT))) / np.pi)
    add(sfx, tt, tick(rng.uniform(3200, 4800)), rng.uniform(0.06, 0.1), 0.35)
for i in range(4):
    add(sfx, A2 + 1.9 + i * 0.05, blip(880 + i * 120, 0.05), 0.07, 0.3)
for i in range(3):
    add(sfx, A2 + 2.1 + i * 0.3, sparkle_run(2093 + i * 200, 3, 0.04), 0.03, 0.3)
add(sfx, A2 + 3.05, blip(700, 0.12), 0.16, 0.4)
add(sfx, A2 + 3.15, bell(hz("E5")), 0.12, 0.4)
add(sfx, A2 + 3.25, bell(hz("B5")), 0.1, 0.45)
for g in (2.95, 3.45, 4.0):
    add(sfx, A2 + g, air(0.35), 0.05, 0.4)
# 3 · components — hub & ring
C3 = 10.0
add(sfx, C3 + 0.8, settle(130), 0.32, 0.2)
for i in range(8):
    add(sfx, C3 + 0.95 + i * 0.06, tick(5200 + i * 150, 0.02), 0.05, -0.3 + i * 0.08)
for gi, (t0, n) in enumerate(((0.4, 4), (2.1, 2), (3.5, 2))):
    add(sfx, C3 + t0, sparkle_run([2349, 2637, 2960][gi], 4), 0.045, 0.3)
    for k in range(n):
        add(sfx, C3 + t0 + 0.5 + k * 0.08, blip([1100, 1320, 1480][gi] + k * 60, 0.06), 0.07, 0.3)
add(sfx, C3 + 4.9, riser(0.8) * 0.6, 0.1, 0.2)
add(sfx, C3 + 5.7, impact(1.0), 0.2)
for j, n in enumerate(["A4", "E5", "A5"]):
    add(sfx, C3 + 5.7 + j * 0.04, bell(hz(n), 1.2, 2.2), 0.07, -0.2 + j * 0.2)
# 4 · booking — two waves (W = 1.2s, 4.3s)
B4 = 17.0
for i in range(5):
    add(sfx, B4 + 0.8 + i * 0.1, settle(150 + i * 25), 0.24, 0.3)
for wi, W in enumerate((1.2, 4.3)):
    g = 1.0 if wi == 0 else 0.6
    for n in range(3):
        add(sfx, B4 + W + n * 0.1, tick(4400, 0.02), 0.05 * g, -0.3)
    add(sfx, B4 + W + 0.7, blip(330, 0.14), 0.12 * g, -0.2)  # rejected at the gate
    add(sfx, B4 + W + 1.1, settle(220), 0.2 * g, 0.1)
    add(sfx, B4 + W + 1.3, settle(240), 0.16 * g, 0.1)
    for k in range(3):
        add(sfx, B4 + W + 2.1 + k * 0.25, blip([1175, 1397, 1760][k], 0.07), 0.09 * g, 0.2 + k * 0.1)
add(sfx, B4 + 1.2 + 2.6, bell(hz("E6"), 1.0, 2.6), 0.08, 0.3)
for i in range(5):
    add(sfx, B4 + 0.4 + i * 0.08, tick(6000, 0.02), 0.04, -0.4)
# 5 · pricing
P5 = 23.5
add(sfx, P5 + 0.05, whoosh(0.4), 0.06, 0.4)
for i in range(4):
    add(sfx, P5 + 0.5 + i * 0.05, air(0.45), 0.04, 0.3)
add(sfx, P5 + 1.25, blip(700, 0.12), 0.15, 0.4)
add(sfx, P5 + 1.4, bell(hz("C#6")), 0.1, 0.4)
# 6 · CTA
add(sfx, 27.1, air(0.4), 0.05)
add(sfx, 27.55, blip(780, 0.12), 0.18)
add(sfx, 28.0, sparkle_run(2637, 5, 0.05), 0.05, 0.1)


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


tail = np.ones(N)
tail[-int(0.4 * SR):] = np.linspace(1, 0, int(0.4 * SR))
write(str(OUT / "music.wav"), (reverb(music, 2.0, 0.22) + drums * 0.9) * tail)
write(str(OUT / "sfx.wav"), reverb(sfx, 1.4, 0.25) * tail)
print("ok")
