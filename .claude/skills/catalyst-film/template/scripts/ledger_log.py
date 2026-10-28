"""./film log — stage 11 in one step: append this film to both ledgers from video/ledger.md.

For each ledger (catalyst-motion/ledger.md, catalyst-film/story/copy-ledger.md):
  · "Last 2 films: **A, B**."  →  "Last 2 films: **B, <film>**."
  · status rows whose Films cell is exactly A and whose status starts with "Benched" → "Available" (any note kept)
  · this film's rows go at the end of the status table (just before "## Entries")
  · this film's entry goes at the end of the file
Safe to re-run: a film whose entry heading is already in a ledger is skipped for that ledger."""
import re
import sys
from pathlib import Path

src = Path(sys.argv[1])
text = src.read_text()
film = re.search(r"^film:\s*(.+)$", text, re.M)
if not film or "<" in text:
    sys.exit(f"✗ fill {src.name} first: film name and the four sections (no <placeholders> left)")
film = film.group(1).strip()
project = next((p for p in src.resolve().parents if (p / ".claude/skills/catalyst-film").exists()), None)
if not project:
    sys.exit("✗ run inside outputs/<film>/video of the Catalyst Motion Skills repo")
LEDGERS = {"motion": project / ".claude/skills/catalyst-motion/ledger.md", "copy": project / ".claude/skills/catalyst-film/story/copy-ledger.md"}
sec = {m.group(1): m.group(2).strip() for m in re.finditer(r"^## (motion rows|motion entry|copy rows|copy entry)\n(.*?)(?=^## |\Z)", text, re.M | re.S)}

for kind, path in LEDGERS.items():
    rows, entry = sec.get(f"{kind} rows", ""), sec.get(f"{kind} entry", "")
    if not rows or not entry.startswith("### "):
        sys.exit(f"✗ {src.name}: '## {kind} rows' needs table rows and '## {kind} entry' must start with '### <film> (`outputs/<folder>/`)'")
    s = path.read_text()
    if entry.splitlines()[0] in s:
        print(f"· {path.name}: {film} already logged — skipped")
        continue
    m = re.search(r"Last 2 films: \*\*(.+?), (.+?)\*\*\.", s)
    if m:
        dropped, kept = m.group(1), m.group(2)
        s = s.replace(m.group(0), f"Last 2 films: **{kept}, {film}**.")
        s = re.sub(rf"^(\|[^\n]*\| {re.escape(dropped)} \| )Benched\b", r"\1Available", s, flags=re.M)
    i = s.index("\n## Entries")
    s = s[:i].rstrip("\n") + "\n" + rows + "\n" + s[i:]
    path.write_text(s.rstrip("\n") + "\n\n" + entry + "\n")
    print(f"✓ {path.relative_to(project)}: {len(rows.splitlines())} rows + entry · last 2 films → {kept if m else '?'}, {film}")
