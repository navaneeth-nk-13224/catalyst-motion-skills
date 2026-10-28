"""Voice-over from timeline.json with Kokoro-82M (Apache-2.0, github.com/hexgrad/kokoro) — REPRODUCIBLE.

  ./film vo

Pinned model revision + local voice file (bin/toolchain.json) and a fixed seed per line: same text → same samples.
Writes outputs/<film>/build/vo/l<N>.wav (raw) and t<N>.wav (silence-trimmed, 24 kHz mono), then writes back into timeline.json:
  vo[i].dur    measured length of the trimmed line
  vo[i].words  [{w, t0, t1}] word onsets/offsets on the FILM clock (Kokoro token timestamps, trim-corrected)
macOS: needs ESPEAK_DATA_PATH=/opt/homebrew/share/espeak-ng-data and PHONEMIZER_ESPEAK_LIBRARY=/opt/homebrew/lib/libespeak-ng.dylib."""
import os
import random
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))
import timeline_tools as tt  # noqa: E402
from toolchain import TOOLCHAIN, VO_DIR  # noqa: E402

os.environ.setdefault("ESPEAK_DATA_PATH", "/opt/homebrew/share/espeak-ng-data")
os.environ.setdefault("PHONEMIZER_ESPEAK_LIBRARY", "/opt/homebrew/lib/libespeak-ng.dylib")
import torch  # noqa: E402
from huggingface_hub import snapshot_download  # noqa: E402
from kokoro import KModel, KPipeline  # noqa: E402

SR = 24000
PUNCT = set(".,!?;:—–-\"'()")
K = TOOLCHAIN["kokoro"]
torch.use_deterministic_algorithms(True)


def trim_bounds(x, thresh_db=-45.0, pad=0.02):
    idx = np.where(np.abs(x) > 10 ** (thresh_db / 20))[0]
    if len(idx) == 0:
        return 0, len(x)
    p = int(pad * SR)
    return max(0, idx[0] - p), min(len(x), idx[-1] + p)


path = sys.argv[1]
tl = tt.load(path)
out = VO_DIR
out.mkdir(parents=True, exist_ok=True)
voice, speed = tl.get("voice", "af_heart"), tl.get("speed", 1.05)
snap = Path(snapshot_download(K["repo"], revision=K["revision"], allow_patterns=["config.json", "kokoro-v1_0.pth", "voices/*.pt"]))
model = KModel(repo_id=K["repo"], config=str(snap / "config.json"), model=str(snap / "kokoro-v1_0.pth")).eval()
pipe = KPipeline(lang_code="b" if voice.startswith("b") else "a", repo_id=K["repo"], model=model)
voice_file = str(snap / "voices" / f"{voice}.pt")
for i, line in enumerate(tl["vo"], 1):
    torch.manual_seed(K["seed"] + i)  # the vocoder injects noise — seed it per line
    np.random.seed(K["seed"] + i)
    random.seed(K["seed"] + i)
    chunks, words, offset = [], [], 0.0
    with torch.no_grad():
        for r in pipe(line["text"], voice=voice_file, speed=speed):
            a = np.asarray(r.audio)
            for tok in r.tokens or []:
                if tok.text.strip() and tok.text not in PUNCT and tok.start_ts is not None:
                    words.append((tok.text, offset + tok.start_ts, offset + (tok.end_ts or tok.start_ts)))
            chunks.append(a)
            offset += len(a) / SR
    audio = np.concatenate(chunks)
    sf.write(out / f"l{i}.wav", audio, SR, subtype="PCM_16")
    a0, a1 = trim_bounds(audio)
    sf.write(out / f"t{i}.wav", audio[a0:a1], SR, subtype="PCM_16")
    lead = a0 / SR
    line["dur"] = round((a1 - a0) / SR, 3)
    line["words"] = [{"w": w, "t0": round(line["at"] + max(0.0, s0 - lead), 3), "t1": round(line["at"] + max(0.0, s1 - lead), 3)} for w, s0, s1 in words]
    print(f"vo{i}: {line['dur']:.2f}s  " + "  ".join(f"{w['w']}@{w['t0']:.2f}" for w in line["words"]))
tt.save(path, tl)
print("durations + word timestamps written →", path)
sys.exit(1 if tt.check(tl) else 0)
