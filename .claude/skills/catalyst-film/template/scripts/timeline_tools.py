"""Timeline tools — the word-budget gate and the cue resolvers shared by the scenes and the sound script.

  python scripts/timeline_tools.py check    src/timeline.json   # word budget + slot overflow (exit 1 on error)

Budget (Kokoro af_heart @1.05, measured): ~2.9 words/s inside a line, ~2.1 words/s across the runtime."""
import json
import re
import sys

SPEECH_WPS, RUNTIME_WPS = 2.9, 2.1


def load(p):
    with open(p) as f:
        return json.load(f)


def save(p, tl):
    with open(p, "w") as f:
        json.dump(tl, f, indent=2, ensure_ascii=False)
        f.write("\n")


def word(tl, line, text, nth=0, end=False):
    """Film-clock onset (or offset) of a VO word; falls back to the line start before the VO exists."""
    norm = lambda w: re.sub(r"[^a-z0-9.]", "", w.lower())
    l = tl["vo"][line - 1]
    hits = [w for w in l.get("words", []) if norm(w["w"]) == norm(text)]
    if nth < len(hits):
        return hits[nth]["t1" if end else "t0"]
    return l["at"]


def cue(tl, cues, name):
    """Resolve a cues.json entry: a number, or 'vo<N>:<word>[#k][+/-sec]'."""
    v = cues[name]
    if isinstance(v, (int, float)):
        return float(v)
    m = re.match(r"^vo(\d+):([^#+-]+)(?:#(\d+))?([+-][\d.]+)?$", v)
    if not m:
        raise ValueError(f"bad cue {name}: {v}")
    return word(tl, int(m[1]), m[2], int(m[3] or 0)) + float(m[4] or 0)


def est(line):
    return line.get("dur") or len(line["text"].split()) / SPEECH_WPS


def check(tl):
    errors, cuts, vo = 0, tl["cuts"], tl["vo"]
    total = cuts[-1]
    words = sum(len(l["text"].split()) for l in vo)
    budget = RUNTIME_WPS * total
    print(f"words {words} / budget ~{budget:.0f} for {total:.1f}s")
    if words > budget * 1.1:
        print("  ✗ over budget by >10% — cut words, not speed"); errors += 1
    for i, l in enumerate(vo):
        end = l["at"] + est(l)
        nxt_cut = next((c for c in cuts if c > l["at"]), total)
        nxt_vo = vo[i + 1]["at"] if i + 1 < len(vo) else total
        slot = min(nxt_cut - 0.3, nxt_vo - 0.2)
        src = "measured" if l.get("dur") else "estimated"
        flag = "✓" if end <= slot else "✗"
        if end > slot:
            errors += 1
        print(f"  {flag} vo{i + 1} {l['at']:5.2f}→{end:5.2f}s ({src}) slot ends {slot:5.2f}s · {l['text']}")
    return errors


if __name__ == "__main__":
    cmd, p = sys.argv[1], sys.argv[2]
    tl = load(p)
    if cmd == "check":
        sys.exit(1 if check(tl) else 0)
