#!/bin/sh
# Prerequisite check for the catalyst-film pipeline. Prints ✓ / ✗ / ⚠ with the EXACT command to fix each item.
#   sh .claude/skills/catalyst-film/bin/doctor.sh [outputs/<film>/video] [--quiet]
# Exit 1 if anything REQUIRED is missing (film.py all refuses to build until this passes).
HERE="$(cd "$(dirname "$0")" && pwd)"
VIDEO="${1:-}"; [ "$VIDEO" = "--quiet" ] && VIDEO=""
QUIET=""; case " $* " in *" --quiet "*) QUIET=1;; esac
VENV="${CATALYST_VENV:-$HOME/.catalyst-film/venv}"
FAIL=0
ok()   { [ -n "$QUIET" ] || printf "  ✓ %s\n" "$1"; }
bad()  { printf "  ✗ %s\n      fix: %s\n" "$1" "$2"; FAIL=1; }
warn() { printf "  ⚠ %s\n      %s\n" "$1" "$2"; }
[ -n "$QUIET" ] || echo "catalyst-film doctor — prerequisites"

# platform (byte-identical results are guaranteed on the reference platform)
if [ "$(uname -s)" = "Darwin" ] && [ "$(uname -m)" = "arm64" ]; then ok "macOS arm64 (reference platform)"; else warn "$(uname -s) $(uname -m) — not the reference platform" "builds work, but results are only byte-identical on macOS arm64 (Apple Silicon)"; fi
command -v brew >/dev/null && ok "Homebrew" || bad "Homebrew missing" '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
# node
if command -v node >/dev/null; then NV=$(node -p "process.versions.node.split('.')[0]"); [ "$NV" -ge 20 ] && ok "node $(node --version)" || bad "node $(node --version) is too old (need ≥ 20)" "brew install node"; else bad "node missing" "brew install node"; fi
# python 3.11
command -v python3.11 >/dev/null && ok "python3.11" || bad "python3.11 missing" "brew install python@3.11"
# espeak-ng (Kokoro's phonemizer fallback)
if [ -f /opt/homebrew/lib/libespeak-ng.dylib ] && command -v espeak-ng >/dev/null; then
  ESV=$(espeak-ng --version 2>/dev/null | sed -E 's/.*: ([0-9.]+).*/\1/')
  [ "$ESV" = "1.52.0" ] && ok "espeak-ng 1.52.0" || warn "espeak-ng $ESV (pinned 1.52.0)" "voice may differ for words outside Kokoro's lexicon; pin with: brew install espeak-ng (1.52.0)"
else bad "espeak-ng missing" "brew install espeak-ng"; fi
# venv matches the lock exactly
if [ -x "$VENV/bin/python" ]; then
  DIFF=$("$VENV/bin/pip" freeze 2>/dev/null | grep -v '^en_core_web_sm' | sort | comm -3 - "$(grep -v '^en_core_web_sm' "$HERE/requirements.lock" | sort | sed 's/^/x/;s/^x//' > /tmp/.cf_lock.$$; echo /tmp/.cf_lock.$$)" | head -5)
  rm -f /tmp/.cf_lock.$$
  [ -z "$DIFF" ] && ok "Python venv matches requirements.lock ($VENV)" || bad "venv differs from requirements.lock: $(echo $DIFF | head -c 120)" "sh .claude/skills/catalyst-film/bin/setup.sh"
else bad "Python venv missing ($VENV)" "sh .claude/skills/catalyst-film/bin/setup.sh"; fi
# Kokoro model at the pinned revision
REV=$(python3 -c "import json;print(json.load(open('$HERE/toolchain.json'))['kokoro']['revision'])")
if [ -x "$VENV/bin/python" ] && "$VENV/bin/python" -c "from huggingface_hub import snapshot_download as d; d('hexgrad/Kokoro-82M', revision='$REV', local_files_only=True, allow_patterns=['config.json','kokoro-v1_0.pth','voices/*.pt'])" >/dev/null 2>&1; then ok "Kokoro-82M @ ${REV%"${REV#???????}"}"; else bad "Kokoro-82M model (pinned revision) not downloaded" "sh .claude/skills/catalyst-film/bin/setup.sh"; fi
# per-film node_modules + Remotion's pinned browser
if [ -n "$VIDEO" ]; then
  if [ -d "$VIDEO/node_modules/remotion" ]; then
    WANT=$(python3 -c "import json;print(json.load(open('$VIDEO/package.json'))['dependencies']['remotion'])")
    HAVE=$(python3 -c "import json;print(json.load(open('$VIDEO/node_modules/remotion/package.json'))['version'])" 2>/dev/null)
    [ "$WANT" = "$HAVE" ] && ok "node_modules (remotion $HAVE)" || bad "node_modules has remotion $HAVE, package.json pins $WANT" "cd \"$VIDEO\" && npm ci"
  else bad "node_modules missing in $VIDEO" "cd \"$VIDEO\" && npm ci"; fi
  if (cd "$VIDEO" 2>/dev/null && npx --no-install remotion browser ensure >/dev/null 2>&1); then ok "Remotion Chrome Headless Shell"; else bad "Remotion's browser not installed" "cd \"$VIDEO\" && npx remotion browser ensure"; fi
fi
command -v ffmpeg >/dev/null && ok "ffmpeg (optional: contact sheets)" || [ -n "$QUIET" ] || warn "ffmpeg not installed (optional)" "brew install ffmpeg — only for review contact sheets"
[ "$FAIL" = 0 ] && { [ -n "$QUIET" ] || echo "✓ ready to build"; exit 0; } || { echo "✗ fix the items above, then run doctor again"; exit 1; }
