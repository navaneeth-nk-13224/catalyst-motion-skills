# Simple mode — the script is one table (default)

Every film starts in **simple mode** unless the user says **"advanced mode"**. Claude writes one table; the table is
the script *and* the storyboard. Show it once, wait for one approval, then build like a user-given script
(`SKILL.md` → "Script given"): voice, build, `./film layout` ✓, self-review stills, sound + mix + render + verify, log.
No story stage, no separate storyboard, no key-stills pause. (QuickML 30s, built from a table like this: ~1.7M tokens,
vs 3–4.5M for the advanced pipeline.)

## The format (copy exactly)
```
**<Product> — <n>-second motion graphic script**
Style: <3 short phrases, e.g. Modern SaaS product animation · Smooth transitions · Confident, energetic voiceover>

| Time | Voiceover | Motion graphics |
|---|---|---|
| 0–5s | "<line>" | <one sentence: the literal product thing on screen + what moves> [flat] |
| … | … | … |
| 25–30s | "<line>" | <payoff> → official Catalyst lockup + tagline "<on-screen line>" [flat] |
```

## Rows scale with length
One row per ~5–7s. **10s: 2 · 15s: 3 · 20s: 4 · 30s: 5 · 45s: 7 · 60s: 9–10.**
Row times are the cuts (`timeline.json` `cuts`). The last row carries the end card: `<EndLockup>` needs ≥ 3.0s, so
the last row is ≥ 6s on films of 30s and longer (≥ 4s on shorter ones).

## Words
- ~2.6 words per second of the row; each line ends ≥ 0.4s before its row ends (Kokoro reads ~2.9 w/s). `./film check`
  then `./film vo` measures it; an overrun → pre-lap the line up to 0.7s into the previous row, or trim a word.
- Simple and direct: one idea per row, plain verbs, real product names (one product-page fetch, or reuse an earlier
  brief §1 for the same product). Brand words spelled for TTS in `timeline.json` (e.g. "Quick M L"), not in the table.
- **Fresh words, same format.** Check the copy-ledger status table printed by `start.sh`: no benched or retired phrase as
  the opening, closing or hero line; rotate the opening type and the ending (§3 of `script-freshness.md`) vs the last 2
  films. The table format itself never rotates.

## Motion column
- One sentence per row naming the **literal** thing (a dataset table, a training chart, a deploy button), so it passes
  the 2-second relevance test. Name the view in brackets: `[flat]` (UI, code, type, numbers — the usual), `[iso]` only where
  depth carries the idea, `[plan]` for timelines. Iso in ≤ half the rows.
- Mention the on-screen text only when it matters (product name, tagline). No captions, ever.
- Everything else (layouts, primitives, transitions, cues) is decided while building, with the normal rules.

## After approval
Brief: §1 source · §3 paste the table · §2 and §4 read "simple mode: see table". Then the "Script given" path,
start to `.mp4`, without stopping. Log both ledgers with `./film log`.
