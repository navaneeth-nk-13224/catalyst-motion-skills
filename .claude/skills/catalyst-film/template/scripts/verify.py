"""Delivery checks + reproducibility lock.

  ./film verify        checks the deliverable; if film.lock.json exists, compares every stage to it
  ./film lock          (optional dev tool) checksum this build to confirm a refactor changed nothing — git-ignored

Deliverable: outputs/<film>/<slug>.mp4 — size · fps · duration (±1 frame) · h264+aac · −14 ±0.5 LUFS · TP ≤ −1 dBTP,
exactly one video, measured VO (dur + words), logged in the motif ledger.
Optional lock (developer tool, not part of the pipeline): `film.py lock` records checksums of a build so you can
confirm a refactor changed nothing. The pipeline's goal is the same style for new films — not byte-identical copies.
Tools: Remotion's bundled ffprobe/ffmpeg (pinned by package-lock) for probing/decoding; pyloudnorm for loudness."""
import hashlib
import json
import platform
import subprocess
import sys
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
from scipy.signal import resample_poly

sys.path.insert(0, str(Path(__file__).resolve().parent))
from toolchain import AUDIO_DIR, BUILD, OUTPUTS, PREVIEW, ROOT, TOOLCHAIN, VIDEO, VO_DIR, FILM_DIR, slug  # noqa: E402

LOCK = VIDEO / "film.lock.json"
tl = json.loads((VIDEO / "src/timeline.json").read_text())
D, FPS = tl["cuts"][-1], tl["fps"]
MP4 = OUTPUTS / f"{slug()}.mp4"


def remotion(tool, *args, binary=False):
    r = subprocess.run(["npx", "--no-install", "remotion", tool, *map(str, args)], cwd=VIDEO, capture_output=True)
    return r.stdout if binary else r.stdout.decode()


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


TMP = BUILD / "review"  # verify scratch


def stream_sha(mp4):  # hash of the encoded packets — independent of container metadata
    TMP.mkdir(parents=True, exist_ok=True)
    out = TMP / "_streams.sha"
    remotion("ffmpeg", "-v", "error", "-y", "-i", mp4, "-map", "0", "-c", "copy", "-f", "hash", "-hash", "sha256", out)
    return out.read_text().strip().split("=", 1)[-1] if out.exists() else "unavailable"


def artifacts():
    files = sorted(VO_DIR.glob("t*.wav"))
    files += [AUDIO_DIR / f"{n}.wav" for n in ("music", "sfx", "voiceover", "mix")]
    files += sorted(PREVIEW.glob("f*.png"))
    arts = {str(p.relative_to(ROOT)): sha(p) for p in files if p.exists()}
    if MP4.exists():
        arts[f"{MP4.relative_to(ROOT)} (streams)"] = stream_sha(MP4)
    return arts


def versions():
    v = {"platform": f"{platform.system()} {platform.machine()}", "python": platform.python_version()}
    try:
        import kokoro, numpy, scipy, torch  # noqa: F401

        v.update({"torch": torch.__version__, "numpy": numpy.__version__, "scipy": scipy.__version__, "kokoro": "0.9.4"})
    except Exception:
        pass
    v["remotion"] = json.loads((VIDEO / "package.json").read_text())["dependencies"]["remotion"]
    v["kokoro_revision"] = TOOLCHAIN["kokoro"]["revision"]
    v["seed"] = TOOLCHAIN["kokoro"]["seed"]
    return v


def check_deliverable():
    rows, fails = [], 0
    if not MP4.exists():
        print(f"✗ missing {MP4.relative_to(ROOT)} — run: ./film render")
        return 1
    p = json.loads(remotion("ffprobe", "-v", "error", "-show_entries", "stream=codec_type,codec_name,width,height,r_frame_rate:format=duration", "-of", "json", MP4) or "{}")
    v = next(s for s in p["streams"] if s["codec_type"] == "video")
    a = next((s for s in p["streams"] if s["codec_type"] == "audio"), None)
    num, den = map(int, v["r_frame_rate"].split("/"))
    dur = float(p["format"]["duration"])
    TMP.mkdir(parents=True, exist_ok=True)
    dec = TMP / "_decoded.wav"  # Remotion's ffmpeg wrapper doesn't pass binary stdout, so decode to a file
    remotion("ffmpeg", "-v", "error", "-y", "-i", MP4, "-f", "wav", "-ac", "2", "-ar", "48000", dec)
    import soundfile as sf

    pcm, _ = sf.read(dec, dtype="float64")
    lufs = pyln.Meter(48000).integrated_loudness(pcm)
    tp = 20 * np.log10(np.max(np.abs(resample_poly(pcm, 4, 1, axis=0))) + 1e-12)
    checks = {
        "size": (v["width"], v["height"]) == (tl["width"], tl["height"]),
        "fps": abs(num / den - FPS) < 0.01,
        "dur": abs(dur - D) <= 1 / FPS + 0.03,
        "codec": v["codec_name"] == "h264" and a is not None and a["codec_name"] == "aac",
        "loud": abs(lufs + 14) <= 0.5,
        "peak": tp <= -1.0,
    }
    bad = [k for k, ok in checks.items() if not ok]
    fails += 1 if bad else 0
    print(f"{MP4.name:40} {v['width']}x{v['height']}  {num / den:.0f}fps  {dur:.3f}s  {lufs:6.2f} LUFS  {tp:5.2f} dBTP  {'PASS' if not bad else 'FAIL ' + ','.join(bad)}")
    extra = {
        "single_deliverable": sorted(p.name for p in OUTPUTS.iterdir() if p.suffix in {".mp4", ".srt", ".mov", ".webm"}) == [MP4.name],
        "vo_measured": all(l.get("dur") for l in tl["vo"]),
        "vo_words": all(l.get("words") for l in tl["vo"]),
    }
    ledgers = [ROOT / ".claude/skills/catalyst-motion" / n for n in ("ledger.md", "ledger-archive.md")]
    extra["ledger_entry"] = any(l.exists() and f"{FILM_DIR.name}/`" in l.read_text() for l in ledgers)
    for k, ok in extra.items():
        print(f"  {'✓' if ok else '✗'} {k}" + ("" if ok or k != "ledger_entry" else "  ← append this film to catalyst-motion/ledger.md (pipeline step 11)"))
    fails += sum(1 for k, ok in extra.items() if not ok and k != "ledger_entry")
    rows.append({"file": MP4.name, "lufs": lufs, "tp": tp, "dur": dur, "checks": checks, "extra": extra})
    json.dump(rows, open(TMP / "verify.json", "w"), indent=2, default=str)
    return fails


def compare_lock():
    lock = json.loads(LOCK.read_text())
    now = artifacts()
    diffs = 0
    print(f"── reproducibility vs film.lock.json (built on {lock['versions'].get('platform')}) ──")
    for k, want in lock["artifacts"].items():
        got = now.get(k)
        ok = got == want
        diffs += 0 if ok else 1
        print(f"  {'MATCH' if ok else ('MISSING' if got is None else 'DIFF ')}  {k}")
    mine = versions()
    for k, want in lock["versions"].items():
        if mine.get(k) != want:
            print(f"  ⚠ toolchain {k}: lock {want} · here {mine.get(k)}")
    print("REPRODUCED ✓ (byte-identical)" if diffs == 0 else f"{diffs} artifact(s) differ — the first DIFF row shows where the build diverged")
    return diffs


if __name__ == "__main__":
    if "--write-lock" in sys.argv:
        LOCK.write_text(json.dumps({"_doc": "Optional dev checksums of one local build (git-ignored). Not a goal: the pipeline aims for the same style, not identical files.", "versions": versions(), "frames": sorted(int(p.stem[1:]) for p in PREVIEW.glob("f*.png")), "artifacts": artifacts()}, indent=2) + "\n")
        print(f"✓ wrote {LOCK.relative_to(ROOT)} ({len(artifacts())} artifacts)")
        sys.exit(0)
    fails = check_deliverable()
    if LOCK.exists():
        fails += compare_lock()
    print("ALL PASS" if fails == 0 else f"{fails} FAIL(S)")
    sys.exit(1 if fails else 0)
