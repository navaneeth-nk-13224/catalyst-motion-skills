#!/bin/sh
# Scaffold a new Catalyst film in seconds.
#   sh .claude/skills/catalyst-film/bin/new-film.sh "<folder>" <CompositionId> [slug]
#   e.g. sh .claude/skills/catalyst-film/bin/new-film.sh "quickml" QuickML30 quickml-30s
# Creates outputs/<folder>/ — one folder per film holding everything: video/ (Remotion project from the template),
# <slug>-brief.md (every gate pre-headed), and later <slug>.mp4, preview/ and build/.
set -e
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
PROJECT="$(cd "$SKILL/../../.." && pwd)"
FOLDER="$1"; ID="$2"; SLUG="${3:-$(echo "$ID" | tr '[:upper:]' '[:lower:]')}"
[ -n "$FOLDER" ] && [ -n "$ID" ] || { echo "usage: new-film.sh <folder> <CompositionId> [slug]"; exit 1; }
DEST="$PROJECT/outputs/$FOLDER"
[ -e "$DEST/video" ] && { echo "✗ $DEST/video already exists"; exit 1; }
mkdir -p "$DEST"
cp -R "$SKILL/template" "$DEST/video"
python3 - "$DEST/video/src/timeline.json" "$ID" "$SLUG" <<'PY'
import json, sys
p, cid, slug = sys.argv[1:]
tl = json.load(open(p)); tl["id"], tl["slug"] = cid, slug
json.dump(tl, open(p, "w"), indent=2); open(p, "a").write("\n")
PY
# node_modules: APFS clone from any existing film (instant), else npm ci
SRC=$(find "$PROJECT" -maxdepth 4 -type d -name node_modules -path "*/video/node_modules" -not -path "$DEST/*" 2>/dev/null | head -1)
if [ -n "$SRC" ]; then cp -c -R "$SRC" "$DEST/video/" 2>/dev/null || cp -R "$SRC" "$DEST/video/"; else (cd "$DEST/video" && npm ci --silent); fi
sed "s/{{SLUG}}/$SLUG/g; s/{{ID}}/$ID/g; s#{{FOLDER}}#$FOLDER#g" "$SKILL/story/brief-template.md" > "$DEST/$SLUG-brief.md"
(cd "$DEST/video" && npx tsc --noEmit) && echo "✓ outputs/$FOLDER/video ready · brief: outputs/$FOLDER/$SLUG-brief.md"
sh "$SKILL/bin/doctor.sh" "$DEST/video" --quiet >/dev/null 2>&1 && echo "✓ doctor: film project ready" || sh "$SKILL/bin/doctor.sh" "$DEST/video"
echo "  next: fill the brief → edit src/timeline.json → ./film check   (commands run in outputs/$FOLDER/video)"
