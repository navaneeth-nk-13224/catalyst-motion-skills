"""One command per pipeline stage, with caching so nothing slow re-runs unless its inputs changed.

  ./film check      word budget + slot overflow (fast gate; run after every script edit)
  ./film vo         Kokoro VO → dur + word timestamps            (skipped if VO text/voice/speed unchanged)
  ./film words      print every VO word with its film-clock time (for cues.json / scene constants)
  ./film sound      score + SFX (make_sound.py + synth.py)                 (skipped if script/timeline/cues unchanged)
  ./film mix        duck + loudnorm → outputs/<film>/build/audio/mix.wav      (skipped if inputs unchanged)
  ./film stills     key stills + contact sheet → outputs/<film>/preview/  [frames…]  (skipped if no visual change)
  ./film look       <frame> [x y w h] → one small crop/downscale for review (build/review/look-*.png)
  ./film render     the ONE deliverable: outputs/<film>/<slug>.mp4 (git-ignored)  (skipped if picture + mix unchanged)
  ./film verify     delivery checks + compare every stage to film.lock.json (if present)
  ./film lock       (optional, developer tool) checksum this build to confirm a refactor changed nothing — don't commit
  ./film doctor     check every prerequisite; prints the exact fix for anything missing
  ./film all        check → vo → sound → mix → stills → render → verify
  add --force to bypass the cache.
Kokoro/numpy run in the persistent venv: $CATALYST_VENV or ~/.catalyst-film/venv (create with catalyst-film/bin/setup.sh)."""
import hashlib
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
from toolchain import AUDIO_DIR, BUILD, OUTPUTS, PREVIEW, ROOT as PROJECT, VO_DIR, slug  # noqa: E402
TL = ROOT / "src/timeline.json"
STATE = BUILD / "state.json"
VENV_PY = Path(os.environ.get("CATALYST_VENV", Path.home() / ".catalyst-film/venv")) / "bin/python"
FORCE = "--force" in sys.argv
args = [a for a in sys.argv[1:] if a != "--force"]


def sh(*cmd, py=False):
    exe = [str(VENV_PY)] if py else []
    if py and not VENV_PY.exists():
        sys.exit(f"✗ {VENV_PY} missing — run: sh .claude/skills/catalyst-film/bin/setup.sh")
    r = subprocess.run([*exe, *map(str, cmd)], cwd=ROOT)
    if r.returncode:
        sys.exit(r.returncode)


def digest(*parts):
    h = hashlib.sha256()
    for p in parts:
        h.update(p.read_bytes() if isinstance(p, Path) and p.exists() else str(p).encode())
    return h.hexdigest()[:16]


def cached(stage, key, run, outputs=()):
    """Skip a stage when its INPUT key is unchanged and its outputs exist (keys never include a stage's own outputs)."""
    state = json.loads(STATE.read_text()) if STATE.exists() else {}
    if not FORCE and state.get(stage) == key and all(Path(o).exists() for o in outputs):
        print(f"· {stage}: inputs unchanged — skipped (use --force to re-run)")
        return
    run()
    state = json.loads(STATE.read_text()) if STATE.exists() else {}
    state[stage] = key
    STATE.parent.mkdir(parents=True, exist_ok=True)
    STATE.write_text(json.dumps(state, indent=2))


def tl():
    return json.loads(TL.read_text())


def vo_key():  # what the voice depends on
    t = tl()
    return digest(json.dumps([[l["text"], l["at"]] for l in t["vo"]]), t.get("voice"), t.get("speed"), ROOT / "audio-src/kokoro_vo.py")


def sound_key():  # score + SFX depend on the script, the cue sheet, the cuts and the (deterministic) VO words
    t = tl()
    return digest(ROOT / "audio-src/synth.py", ROOT / "audio-src/make_sound.py", ROOT / "src/cues.json", json.dumps(t["cuts"]), vo_key())


def mix_key():
    return digest(ROOT / "audio-src/mix.py", sound_key(), vo_key())


def visual_key():  # everything that can change a frame (src includes timeline.json + cues.json)
    files = sorted(p for d in ("src", "public/fonts", "public/brand") for p in (ROOT / d).rglob("*") if p.is_file())
    return digest(*files, *[str(p.relative_to(ROOT)) for p in files])


def frame_args():
    frames = [a for a in args[1:] if a.lstrip("-").isdigit()]
    t = tl()
    last = round(t["cuts"][-1] * t["fps"]) - 1
    bad = [f for f in frames if not 0 <= int(f) <= last]
    if bad:  # fail before Remotion starts (frame = seconds × fps)
        sys.exit(f"✗ frame(s) {' '.join(bad)} out of range — valid 0..{last} ({t['fps']} fps · {t['cuts'][-1]}s; frame = seconds × {t['fps']})")
    return frames


def stage(name):
    if name == "check":
        sh(sys.executable, "scripts/timeline_tools.py", "check", TL)
    elif name == "vo":
        n = len(tl()["vo"])
        cached("vo", vo_key(), lambda: sh("audio-src/kokoro_vo.py", TL, py=True), [VO_DIR / f"t{i}.wav" for i in range(1, n + 1)])
    elif name == "words":
        for i, l in enumerate(tl()["vo"], 1):
            print(f"vo{i} @{l['at']}: " + "  ".join(f"{w['w']} {w['t0']:.2f}" for w in l.get("words", [])) or "(run vo first)")
    elif name == "sound":
        a = AUDIO_DIR
        cached("sound", sound_key(), lambda: sh("audio-src/make_sound.py", TL, py=True), [a / "music.wav", a / "sfx.wav"])
    elif name == "mix":
        a = AUDIO_DIR
        cached("mix", mix_key(), lambda: sh("audio-src/mix.py", TL, py=True), [a / "mix.wav"])
    elif name == "stills":
        cached("stills", digest(visual_key(), ROOT / "scripts/stills.mjs", *frame_args()), lambda: sh("node", "scripts/stills.mjs", *frame_args()), [PREVIEW / "sheet.png"])
    elif name == "look":  # one small review image (crop and/or downscale) instead of reading full-size stills
        n = [int(v) for a in args[1:] for v in a.split() if v.lstrip("-").isdigit()]  # accepts "x y w h" quoted or not
        if len(n) not in (1, 5):
            sys.exit("usage: ./film look <frame> [x y w h]   e.g. ./film look 276 960 200 640 420")
        last = round(tl()["cuts"][-1] * tl()["fps"]) - 1
        if not 0 <= n[0] <= last:
            sys.exit(f"✗ frame {n[0]} out of range — valid 0..{last}")
        src = PREVIEW / f"f{n[0]:04d}.png"
        if not src.exists():
            sh("node", "scripts/stills.mjs", n[0])
        crop = f"crop={n[3]}:{n[4]}:{n[1]}:{n[2]}," if len(n) == 5 else ""
        out = BUILD / "review" / f"look-{n[0]}{'-' + '-'.join(map(str, n[1:])) if crop else ''}.png"
        out.parent.mkdir(parents=True, exist_ok=True)
        sh("npx", "--no-install", "remotion", "ffmpeg", "-v", "error", "-y", "-i", src, "-vf", f"{crop}scale='min(1000,iw)':-2", out)
        print(f"✓ {out.relative_to(PROJECT)}")
    elif name == "render":
        cached("render", digest(visual_key(), mix_key(), ROOT / "scripts/render.mjs"), lambda: sh("node", "scripts/render.mjs"), [OUTPUTS / f"{slug()}.mp4"])
    elif name == "verify":
        lock = ROOT / "film.lock.json"
        if lock.exists():  # make sure the locked review frames exist so they can be compared
            frames = [str(n) for n in json.loads(lock.read_text()).get("frames", [])]
            have = {int(p.stem[1:]) for p in PREVIEW.glob("f*.png")}
            if frames and set(map(int, frames)) != have:
                sh("node", "scripts/stills.mjs", *frames)
        sh("scripts/verify.py", py=True)
    elif name == "lock":
        sh("node", "scripts/stills.mjs")  # the default review frames are part of the lock
        sh("scripts/verify.py", "--write-lock", py=True)
    elif name == "doctor":
        sh("sh", str(PROJECT / ".claude/skills/catalyst-film/bin/doctor.sh"), str(ROOT))
    else:
        sys.exit(__doc__)


if not args:
    sys.exit(__doc__)
if args[0] == "all":  # never build on a broken setup
    if subprocess.run(["sh", str(PROJECT / ".claude/skills/catalyst-film/bin/doctor.sh"), str(ROOT), "--quiet"]).returncode:
        sys.exit("✗ prerequisites missing — fix the items above (./film doctor), then re-run")
for s in (["check", "vo", "sound", "mix", "stills", "render", "verify"] if args[0] == "all" else [args[0]]):
    print(f"── {s} ──")
    stage(s)
