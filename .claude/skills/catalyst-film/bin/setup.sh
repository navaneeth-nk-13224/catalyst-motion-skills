#!/bin/sh
# One-time setup for the catalyst-film pipeline (macOS / Homebrew). Idempotent — safe to re-run.
#   sh .claude/skills/catalyst-film/bin/setup.sh
# Installs the EXACT pinned toolchain (bin/toolchain.json):
#   · a persistent venv at ~/.catalyst-film/venv with every package from requirements.lock (no floating versions)
#   · the Kokoro-82M model at the pinned Hugging Face revision
#   · checks node and espeak-ng versions
set -e
HERE="$(cd "$(dirname "$0")" && pwd)"
VENV="${CATALYST_VENV:-$HOME/.catalyst-film/venv}"
REV=$(python3 -c "import json;print(json.load(open('$HERE/toolchain.json'))['kokoro']['revision'])")
command -v node >/dev/null || { echo "✗ node missing → brew install node"; exit 1; }
[ -f /opt/homebrew/lib/libespeak-ng.dylib ] || { echo "✗ espeak-ng missing → brew install espeak-ng"; exit 1; }
ESV=$(espeak-ng --version 2>/dev/null | sed -E 's/.*: ([0-9.]+).*/\1/')
[ "$ESV" = "1.52.0" ] || echo "⚠ espeak-ng $ESV (pinned 1.52.0) — VO may differ for words outside Kokoro's lexicon"
PY=$(command -v python3.11 || true)
[ -n "$PY" ] || { echo "✗ need Python 3.11 → brew install python@3.11"; exit 1; }
[ -x "$VENV/bin/python" ] || { mkdir -p "$(dirname "$VENV")"; "$PY" -m venv "$VENV"; }
"$VENV/bin/pip" install -q --timeout 120 --retries 5 -r "$HERE/requirements.lock"
"$VENV/bin/python" -c "from huggingface_hub import snapshot_download as d; print('✓ kokoro @', d('hexgrad/Kokoro-82M', revision='$REV', allow_patterns=['config.json','kokoro-v1_0.pth','voices/*.pt']))"
command -v ffmpeg >/dev/null || echo "· (optional) brew install ffmpeg — only for review contact sheets"
echo "✓ venv: $VENV"
