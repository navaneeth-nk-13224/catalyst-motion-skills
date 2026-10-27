"""Shared paths + the pinned toolchain (catalyst-film/bin/toolchain.json) for every film script."""
import json
from pathlib import Path

VIDEO = Path(__file__).resolve().parent.parent  # outputs/<film>/video


def project_root():
    for p in [VIDEO, *VIDEO.parents]:
        if (p / ".claude/skills/catalyst-film").exists():
            return p
    raise SystemExit("✗ can't find the project root (.claude/skills/catalyst-film)")


ROOT = project_root()
TOOLCHAIN = json.loads((ROOT / ".claude/skills/catalyst-film/bin/toolchain.json").read_text())
FILM_DIR = VIDEO.parent  # <film>


def slug():
    tl = json.loads((VIDEO / "src/timeline.json").read_text())
    return tl.get("slug") or tl["id"].lower()


# A film is one folder, outputs/<film>/, holding everything for that render:
#   <slug>-brief.md · video/ (this code) · <slug>.mp4 · preview/ (key stills + sheet) · build/{vo,audio,review,state.json}
# Generated media (mp4, preview/, build/) is git-ignored; the brief and code are tracked.
OUTPUTS = FILM_DIR
BUILD = OUTPUTS / "build"
PREVIEW = OUTPUTS / "preview"
VO_DIR, AUDIO_DIR = BUILD / "vo", BUILD / "audio"
