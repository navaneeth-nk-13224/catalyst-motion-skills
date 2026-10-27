---
name: catalyst-film
description: >
  End-to-end pipeline for Catalyst (Zoho) videos: core idea → story arc → word-budgeted script → storyboard →
  Remotion build → Kokoro voice-over → original score + synced SFX → mix → render → verify. No captions (user rule).
  Use whenever the user asks for a Catalyst / Zoho Catalyst video, film, explainer, promo, teaser or
  product short (any length, e.g. 10s / 30s / 60s). Ships a Remotion starter template whose single
  timeline.json drives scene cuts, VO, cues and the mix. Visual style comes from the `catalyst-motion`
  skill; timing authority is the LottieFiles `motion-design` skill.
---

# Catalyst Film — production pipeline

> **Start here → [PIPELINE.md](PIPELINE.md)**: the one-page run card (stages, commands, gates, what to read).
> Lessons from every film so far → [LEARNINGS.md](LEARNINGS.md). Script freshness → [story/script-freshness.md](story/script-freshness.md) + [story/copy-ledger.md](story/copy-ledger.md).
> **Same style, not exact copies. Never render or rebuild a video unless the user asks. Show 7–8 key stills before the final render.** The hard style rules on one page → `catalyst-motion/QUICKREF.md`.
> New film: `sh .claude/skills/catalyst-film/bin/new-film.sh "<folder>" <CompId> <slug>`, then `python scripts/film.py <stage>`.

**Division of labour:**
- **This skill** decides *what to say, in what order, and how it gets made*.
- `catalyst-motion` decides *how it looks and moves*.
- `motion-design` (LottieFiles) is the final word on timing and easing.

**Authority order:**
1. LottieFiles `motion-design`
2. `catalyst-motion` (style DNA, Type 1 for important features / Type 2 for small animations, frame layouts, originality)
3. This skill (story, script, production)
4. `catalyst-motion/dna/visual-aesthetics.md`

Some story ideas here were adapted from iart-ai/explainer-video-skills (MIT): the problem → solution arc, the core idea, the word budget. The other arcs and the organic rules are our own. Its easing and transition advice is **not** used, because it conflicts with authorities 1–2.

## Pipeline (each step has a gate — don't move on until it passes)
| # | Step | Read | Gate |
|---|---|---|---|
| 1 | **Research** the message on catalyst.zoho.com: headlines, the real component names, the real numbers | — | Every claim in the script is traceable to the site, or flagged as "my wording" |
| 2 | **Core idea and arc**: draft the VO as a story, *then* name its shape | [story/story-and-script.md](story/story-and-script.md) §1, [story/arcs.md](story/arcs.md) | The core idea fits in one sentence. The arc is picked from the material, not by default, and differs from the previous film's unless the brief demands it. Every link is a *but* or a *therefore*. The ending rhymes with the opening. Every beat has a Type 1/2 tag. |
| 3 | **Script**, word-budgeted | story-and-script §3–4 | `python scripts/timeline_tools.py check src/timeline.json` passes: no line overflows its slot, and the total is within budget |
| 4 | **Storyboard**: metaphor, iso composition, frame layout, transition word, verbs, **new primitives and signature moment** | [story/storyboard-template.md](story/storyboard-template.md) and `catalyst-motion` (incl. `create/freshness.md`) | Originality gate, film-level layout check (anti-PPT) and **freshness gate vs `catalyst-motion/ledger.md`** all pass |
| 5 | **Show the user** the script and storyboard | — | Approved. Skip this step only if the user said "just make it". |
| 6 | **Scaffold** from the template | [production/scaffold.md](production/scaffold.md) | `npx tsc --noEmit` is clean |
| 7 | **VO first**, then lock timings | [production/audio.md](production/audio.md) §1 | Measured VO durations are written back. Cuts and visual cues follow the real words. |
| 8 | **Build scenes** | `catalyst-motion` | Stills at each scene's hold look right (verify §1) |
| 9 | **Score, SFX, mix** | audio.md §2–4 | −14 LUFS ±0.5, true peak ≤ −1.5 dB |
| 10 | **Render and verify** | [production/verify.md](production/verify.md) | All checks green. Report with honest notes on anything unverified. |
| 11 | **Log it** | `catalyst-motion/ledger.md` | The film's UI patterns, primitives, transitions and signature moment are appended, and the status table is updated. |

## Output contract
Everything for one film lives in its own folder, for example `<project>/<film-name>/`:
```
<film>/
  <film>-script.md        ← brief: core idea, arc, script, storyboard, originality + layout checks, assumptions
  video/                  ← Remotion project copied from template/
    src/timeline.json     ← SINGLE SOURCE OF TRUTH: cuts, VO lines + word timestamps, voice
    src/…                 ← scenes, art, kit
    audio-src/            ← VO / score / mix scripts
    out/<slug>.mp4        ← THE deliverable (picture + VO + music + SFX). **No captions, ever.** No variants:
                            no music-only, no alternate cuts, no .srt, unless the user asks for one for a specific film.
```
