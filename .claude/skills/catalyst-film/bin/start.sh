#!/bin/sh
# Film start in ONE call: prerequisites + everything the digest says to read before writing a script.
#   sh .claude/skills/catalyst-film/bin/start.sh
# Prints: doctor · template/KIT.md · both ledgers' status (Benched/Retired rows only) · story/script-freshness.md.
# Read this output instead of opening those files one by one; the full ledgers stay on disk for deep checks.
SKILL="$(cd "$(dirname "$0")/.." && pwd)"
MOTION="$SKILL/../catalyst-motion"
sh "$SKILL/bin/doctor.sh" || echo "  (fix the ✗ items above before building)"

status() {  # header line, "Last 2 films", and only the table rows that still constrain a new film
  echo; echo "════ $1 — status (Available rows hidden; full table: $3) ════"
  grep -m1 "^Last 2 films" "$2"
  awk '/^## Status/{on=1; next} /^## /{on=0} on && /^\|/ && !/Available \|$/ && !/^\|---/' "$2"
}

echo; echo "════ template/KIT.md ════"; cat "$SKILL/template/KIT.md"
status "Motif ledger" "$MOTION/ledger.md" "catalyst-motion/ledger.md"
status "Copy ledger" "$SKILL/story/copy-ledger.md" "catalyst-film/story/copy-ledger.md"
echo; echo "════ story/script-freshness.md ════"; cat "$SKILL/story/script-freshness.md"
