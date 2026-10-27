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

# Catalyst Film — the film-start digest

**This page is all you need to start a film.** It condenses PIPELINE, QUICKREF, LEARNINGS, layouts, relevance and
script freshness. Open a deep file **only when a gate below fails or a choice needs detail** (map at the bottom).
Of the ledgers, read **only the status tables** (`catalyst-motion/ledger.md`, `story/copy-ledger.md`); entries are history.
Code: read **only** `template/KIT.md` — never open the kit sources (`kit.tsx`, `iso.tsx`, `theme.ts`, `motion.ts`, `cues.ts`, `timeline.ts`, `Stage.tsx`, `synth.py`, the template `make_sound.py`) or another film's code; KIT.md has every signature plus Film and score skeletons. Missing detail → `grep -n` the one export line.

**Authority:** LottieFiles `motion-design` (timing, easing) → `catalyst-motion` (look, motion, layouts, relevance, freshness) → this skill (story, script, production).

## Standing rules (user)
- **Every film starts in a fresh chat session.** If this session already holds other work, don't start building: ask the user to open a new chat in this folder and give them a ready-to-paste prompt with their request. Continue here only if they insist. After delivering a film, remind them the next one belongs in a new chat. (A fresh session halved tokens: 4.5M vs 8.8M for the same film.)
- **Same style, not exact copies.** Never re-render existing films to reproduce them.
- **Never render or rebuild a video unless asked.** Setup, docs and config work never needs a render.
- **One folder per film: `outputs/<film>/`** (brief · `video/` · `<slug>.mp4` · `preview/` · `build/`). Nothing in `outputs/` goes in git.
- **One deliverable,** `outputs/<film>/<slug>.mp4`, with the full mix. **No captions, ever.** No variants unless asked.
- **Script + storyboard approved, then 7–8 key stills approved,** before any sound, mix or final render.
- **User briefs win** (their words, timestamps, mode). Vary everything else the rules allow.

## Stages (commands run in `outputs/<film>/video`)
| # | Stage | Do | Gate |
|---|---|---|---|
| 0 | Prereqs | `sh .claude/skills/catalyst-film/bin/doctor.sh` | `✓ ready to build` |
| 1 | Research | Product page (or the user's reference): real names, numbers | Every claim traceable, or "my wording" in brief §6 |
| 2 | Scaffold | `sh .claude/skills/catalyst-film/bin/new-film.sh "<folder>" <CompId> <slug>` | tsc clean |
| 3 | Story | Core idea (1 sentence) · arc picked from the material | Every link *but/therefore* · ending rhymes with opening · arc ≠ last film (ledger) |
| 4 | Script | `vo[]` + cuts in `src/timeline.json`; `python scripts/film.py check` | No ✗ slot; ~2.1 words/s of runtime; script freshness ✓ |
| 5 | Voice | `film.py vo` then `film.py words` | Measured check passes; overruns → show numbers, user chooses (longer · trim · ≤1.1×) |
| 6 | Storyboard | Brief §4 + `src/cues.json` (events pinned to VO words) | Layout rhythm · freshness · relevance (below) |
| 7 | **Show the user** | Script + storyboard | Approved |
| 8 | Build | `src/art.tsx` (new primitives) + `src/Film.tsx`; `film.py stills <frames>`; review lean (below), fix, repeat | Stills checklist (below) |
| 8b | **Key stills** | 7–8 most important moments → `outputs/<film>/preview/`, open, wait | **User approves** |
| 9 | Sound | Write `audio-src/make_sound.py` (score only; library is `synth.py`); `film.py sound`, `film.py mix` | −14 LUFS ±0.5 · TP ≤ −1 dBTP |
| 10 | Render + verify | `film.py render`, `film.py verify` | ALL PASS |
| 11 | Log | Append the film to both ledgers (status table rows + one entry); fill brief §5–7 | `verify` shows ✓ ledger_entry |

## Look and motion (catalyst-motion DNA)
- `#000` void, true isometric (±30° + vertical; no perspective, no camera rotation). Dark matte solids, 1px gradient edges.
- **Light is the only colour.** Accent `#7DF4FF → #FFFD99 → #FF4646`, never animated; brightness via opacity only.
- Matter calm (≤ ~120px/s, no overshoot); energy busy. Light travels on iso axes, turns only at right angles, is born → travels → dissolves.
- **Type 1** (ambient iso system) for important features; **Type 2** (UI assembly: frame → build ≤2.5s → resolve → hold ≥1.5s) for small ones.
- Easing `(0.4,0,0.2,1)`; enter `(0,0,0.2,1)`; exit `(0.4,0,1,1)` 30–50% shorter. Durations 350/500/800ms. Stagger < 500ms per group (two-speed cascade: 33–50ms siblings, ~300ms groups). 0% overshoot except 5% on one success moment.
- Layers per scene: primary verb · secondary reaction (10–30%, +100–300ms) · ambient (10–20%).

## Layouts and transitions
L1 split (max 1/film) · L2 mirror split · L3 centre stage · L4 type as stage (160–240px) · L5 headline over panorama ·
L6 lower third · L7 no type · L8 diagonal · L9 annotated world · L10 window in world · L11 triptych · L12 big number (200–320px) · L13 close-up · L14 focus pull (static blur only).
- Never the same layout twice in a row; splits ≤ 1 in 4 scenes. Each film: a giant-type scene, a quiet scene, a wide shot, a close-up. Move the text anchor every scene.
- Plain slide on at most every other cut. Otherwise: shared-element morph (400–600ms) · camera glide (800–1200ms) · push-in / pull-out · type hand-off · focus pull. (Light wipe and breath cut are retired — check the ledger.)
- Type on ≥ 85% black (vignette, never a box). Margins 96–120px. Nothing passes in front of text.
- **Clear space (user rule):** text never touches or overlaps art. Keep ≥ 56px between any text and the real outline of a solid (all faces, including side/depth faces), a cable/trace/thread, a glow body or a UI card; ≥ 40px between separate text blocks; small labels (≤ 20px) ≥ 40px. Measure from the projected outline, never from an anchor point. If it doesn't fit, move the label to open space, put it inside the card it describes, or cut it. Place labels with `clearRight(outlinePts, 56)` from `kit.tsx`.

## Freshness and relevance (gates)
- **Ledger status table:** benched (last 2 films) and retired (3+ films) motifs can't be heroes.
- Every film: **≥ 2 new Type 1 primitives · ≥ 1 new Type 2 pattern · new hero silhouette, light carrier, lead material · one named signature moment.**
- **2-second test:** without labels, someone in the category names the hero object ("a server", "a bucket of files", "an invoice"). Banned as heroes: stacked rhombus slabs/layers/lattices, plain cubes as services, tile floors as "the cloud", bare cylinders, portals with nothing recognisable passing through. Vocabulary map per service: `catalyst-motion/create/relevance.md`.
- Each scene differs from its 2 nearest reference SVGs on ≥ 4/6 axes. Never trace or re-time a reference.

## Script freshness (vs the copy-ledger status table)
- Rotate voice mode (narrator · dialogue · first person · letter · type-only · mostly silent), opening, ending and device vs the last films.
- No benched/retired phrase as opening, closing or hero line. Site taglines verbatim at most once per series. 3–9 lines, ≥ 1 silent beat ≥ 2.5s. Swap test: no line fits a previous film.
- Kokoro `af_heart` @1.05: ~2.9 words/s inside a line; slot = words/2.9 + 0.4s. Punctuation directs pauses. "back end" not "backend"; brand words checked with phonemes. Name lists → on-screen highlights on each name, not staggers.

## Reviewing stills lean (images stay in the context and are re-read every turn)
- Per review round: read **one** contact sheet (`preview/sheet.png`, 480px tiles). For detail use `python scripts/film.py look <frame> [x y w h]` (a crop or a ≤ 1000px downscale), never a full-size still.
- Crop only the areas you are checking (labels, transitions, clear space). Several checks → one `look` crop each, or one composite you build with ffmpeg; never re-read images you already checked.
- The user's key stills are opened **for the user** (`open`); don't read them again unless a fix needs re-checking.

## Build lessons (stills checklist + traps)
- [ ] No wrapped/clipped headline (76–84px in ≥ 860px columns, or `nowrap`); labels in open space, never toward text
- [ ] **Clear space:** crop every text block at full size — nothing touches art, cables or other text (≥ 56px from art, ≥ 40px between texts). Check after any layout or camera change.
- [ ] Hero recognisable without labels; fills its zone; one hero per Type 1 scene
- [ ] Transitions show content; every resolve on screen ≥ 0.7s before its exit
- [ ] Thumbnail row doesn't look like one template; nothing benched/retired is a hero
- Re-frame the camera per layout (the 55–65% mid shot reads small in wide layouts). Off-screen solids emerge as the camera arrives.
- Objects leaving a solid exit from the face pointing at their destination. Counters hand over without overlap (out 120ms, in 180ms).
- Window-in-world text ≥ 20px. Camera pans ≤ 120px/s except during a transition. Never animate blur.
- Sound: pick a new key per film; breath-cut silence is true silence; every SFX time comes from `cues.json` via `CUE()`.

## Deep files (open only when needed)
| Need | File |
|---|---|
| Full stage table, automation notes | `PIPELINE.md` |
| Every lesson with its source film | `LEARNINGS.md` |
| Arc shapes in detail | `story/arcs.md`, `story/story-and-script.md` |
| Script rules in detail | `story/script-freshness.md` |
| Layout and transition details | `catalyst-motion/create/frame-layouts.md` |
| Freshness / originality / verbs / concept method | `catalyst-motion/create/*.md` |
| DNA, Type 1/2 grammars, aesthetics tokens | `catalyst-motion/dna/*.md` |
| Audio chain, verify, scaffold | `production/*.md` |
| Kit API | `template/KIT.md` |
