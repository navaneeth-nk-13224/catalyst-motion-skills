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
- **Simple mode is the default** (`story/simple-script.md`, printed by `start.sh`): one Time · Voiceover · Motion table
  (rows scale with length), shown for **one** approval, then the "Script given" run below. No story, no storyboard, no
  key-stills pause. **Advanced mode** = the full stage table below (stages 1–8b with both approvals), **only when the user
  says "advanced mode"**.
- **Every film starts in a fresh chat session.** If this session already holds other work, don't start building: ask the user to open a new chat in this folder and give them a ready-to-paste prompt with their request. Continue here only if they insist. After delivering a film, remind them the next one belongs in a new chat. (A fresh session halved tokens: 4.5M vs 8.8M for the same film.)
- **Same style, not exact copies.** Never re-render existing films to reproduce them.
- **Never render or rebuild a video unless asked.** Setup, docs and config work never needs a render.
- **One folder per film: `outputs/<film>/`** (brief · `video/` · `<slug>.mp4` · `preview/` · `build/`). Nothing in `outputs/` goes in git.
- **One deliverable,** `outputs/<film>/<slug>.mp4`, with the full mix. **No captions, ever.** No variants unless asked.
- **Advanced mode only:** script + storyboard approved, then 7–8 key stills approved, before any sound, mix or final render.
- **Script given → skip to building.** A pasted VO script and/or timed shot list (not a loose idea) skips stages 1, 3, 7 and 8b: no research, no story, no approvals. VO given → verbatim; no VO lines → write VO to the given timings (freshness gate, `./film check`), no approval. Stage 6 = transcribe: moments → brief §4 + `cues.json`, timestamps = cuts, on-screen text exact; fill only what's left open. Their script beats conflicting house rules (note in brief §6). Still run 0, 2, 5, 8 (`./film layout` ✓ + self-review), 9–11, then deliver the `.mp4` path.
- **User briefs win** (their words, timestamps, mode). Vary everything else the rules allow.

## Simple mode run (default)
0 start → 1 lean research (one fetch, or reuse an earlier brief §1) → table (`simple-script.md`, copy-ledger gate) →
**user approves the table** → 2 scaffold → 5 voice → cues + 8 build (`./film layout` ✓ + self-review) → 9–10 sound/mix/render/verify → 11 log.

## Stages — advanced mode (commands run in `outputs/<film>/video` as `./film <stage>`, the venv wrapper — never bare `python`)
| # | Stage | Do | Gate |
|---|---|---|---|
| 0 | Start | `sh .claude/skills/catalyst-film/bin/start.sh` — ONE call: doctor + KIT.md + both ledgers' Benched/Retired rows + script-freshness. Don't open those files separately | `✓ ready to build` |
| 1 | Research | Product page (or the user's reference): real names, numbers. Same product filmed before → reuse that brief's §1 (`outputs/*/*-brief.md`) instead of fetching again | Every claim traceable, or "my wording" in brief §6 |
| 2 | Scaffold | `sh .claude/skills/catalyst-film/bin/new-film.sh "<folder>" <CompId> <slug>` (also runs the film doctor) | tsc clean · `✓ doctor` |
| 3 | Story | Core idea (1 sentence) · arc picked from the material | Every link *but/therefore* · ending rhymes with opening · arc ≠ last film (ledger) |
| 4 | Script | `vo[]` + cuts in `src/timeline.json`; `./film check` | No ✗ slot; ~2.1 words/s of runtime; script freshness ✓ |
| 5 | Voice | `./film vo` then `./film words` | Measured check passes; overruns → show numbers, user chooses (longer · trim · ≤1.1×) |
| 6 | Storyboard | Brief §4 + `src/cues.json` (events pinned to VO words) | Layout rhythm · freshness · relevance (below) |
| 7 | **Show the user** | Script + storyboard | Approved |
| 8 | Build | `src/art.tsx` (new primitives) + `src/Film.tsx`; **`./film layout`** until ✓ (clear space in numbers, no images), then `./film stills [frames]` (→ `build/review/stills/`); review lean (below), fix, repeat | `✓ layout` · stills checklist (below) |
| 8b | **Key stills** | `./film keystills <7–8 frames>` → `outputs/<film>/preview/` (only this writes preview/), `open`, wait | **User approves** |
| 9 | Sound | Write `audio-src/make_sound.py` (score only; library is `synth.py`), then **one call:** `./film sound && ./film mix && ./film render && ./film verify` | −14 LUFS ±0.5 · TP ≤ −1 dBTP |
| 10 | Render + verify | (in the stage-9 call) | ALL PASS |
| 11 | Log | Fill `video/ledger.md` (rows + entries; format is in the stub) and brief §5–7, then `./film log && ./film verify` in one call — it rolls "Last 2 films" and moves stale Benched rows to Available | `verify` shows ✓ ledger_entry |

## Look and motion (catalyst-motion DNA)
- `#000` void, no perspective, no camera rotation. Dark matte solids, 1px gradient edges.
- **The view fits the idea (user rule) — don't default to isometric.** Iso only where depth carries meaning (systems, flows between parts, scale). Code, UI, type, numbers, single objects → flat front-on; schedules/timelines/sequences → plan; details → macro. **Iso ≤ half the scenes, ≥ 2 non-iso scenes;** text/UI never skewed onto iso planes (except one L10). Name each scene's VIEW in the storyboard. (`catalyst-motion/dna/style-dna.md` §1a)
- **Light is the only colour.** Accent `#7DF4FF → #FFFD99 → #FF4646`, never animated; brightness via opacity only.
- Matter calm (≤ ~120px/s, no overshoot); energy busy. Light travels on the view's axes, turns only at right angles, is born → travels → dissolves.
- **Type 1** (ambient iso system) for important features; **Type 2** (UI assembly: frame → build ≤2.5s → resolve → hold ≥1.5s) for small ones.
- Easing `(0.4,0,0.2,1)`; enter `(0,0,0.2,1)`; exit `(0.4,0,1,1)` 30–50% shorter. Durations 350/500/800ms. Stagger < 500ms per group (two-speed cascade: 33–50ms siblings, ~300ms groups). 0% overshoot except 5% on one success moment.
- Layers per scene: primary verb · secondary reaction (10–30%, +100–300ms) · ambient (10–20%).
- **Logo = the official animation, never redrawn.** End card: `<EndLockup at={s} />` from `src/EndLockup.tsx` (template ships it, `@remotion/lottie` pinned) plays `catalyst-lockup-animation-darkBG.json` (`light` → the light-BG lockup). Leave **≥ 3.0s from `at` to the film's end** (rests at +2.0s, hold ≥ 1s) — plan it in the cuts.

## Layouts and transitions
L1 split (max 1/film) · L2 mirror split · L3 centre stage · L4 type as stage (160–240px) · L5 headline over panorama ·
L6 lower third · L7 no type · L8 diagonal · L9 annotated world · L10 window in world · L11 triptych · L12 big number (200–320px) · L13 close-up · L14 focus pull (static blur only).
- Never the same layout twice in a row; splits ≤ 1 in 4 scenes. Each film: a giant-type scene, a quiet scene, a wide shot, a close-up. Move the text anchor every scene.
- Plain slide on at most every other cut. Otherwise: shared-element morph (400–600ms) · camera glide (800–1200ms) · push-in / pull-out · type hand-off · focus pull. (Light wipe and breath cut are retired — check the ledger.)
- Type on ≥ 85% black (vignette, never a box). Margins 96–120px. Nothing passes in front of text.
- **Design system, not free numbers:** text sizes from `TYPE` roles (≤ 3 per frame, one headline), every gap from `SPACE`, each text unit in a `<Stack>` (hierarchy + rhythm), labels next to art with `clearRight/Left/Above/Below`. Where things go stays free: the layouts, anchors and transitions above still rotate per scene.
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
- **Clear space is checked in numbers first: `./film layout [frames]`** (default: every 0.5s of each scene's resolved part, ~15–30s). It measures the real DOM: text vs every visible SVG outline, image and UI card (≥ 56px; ≥ 40px for ≤ 20px labels), text vs text (≥ 40px), clipped headlines. It prints one ✗ line per problem with frame, gap and boxes (`build/review/layout.json` has the rest). Fix and re-run until ✓ **before** any stills round; stills are then for look and recognisability, not for measuring. ⚠ lines (margin < 96px, a headline wrapping, a ticker cut by its window) are judgement calls.
- Text in the card it describes, chip pieces, text hidden under a stacked card and things sharing one card are handled. Mark intended closeness in code: `data-block` on a wrapper = one unit (eyebrow + headline, label + its meter); `data-layout="ignore"` on ambient art that may sit behind type. A cursor over a button label is a real ✗.
- Per review round: read **one** contact sheet (`build/review/stills/sheet.png`, 480px tiles). For detail use `./film look <frame> [x y w h]` (a crop or a ≤ 1000px downscale), never a full-size still.
- Crop only the areas you are checking (labels, transitions, clear space). Several checks → **one** call and one image: `./film look 330 1000 280 400 220 + 735 300 240 1500 420 + 875` (tiled 2-up; re-renders frames older than the code). Never re-read images you already checked.
- The user's key stills are opened **for the user** (`open`); don't read them again unless a fix needs re-checking.

## Build lessons (stills checklist + traps)
- [ ] No wrapped/clipped headline (76–84px in ≥ 860px columns, or `nowrap`); labels in open space, never toward text
- [ ] **Clear space:** `./film layout` says ✓ (re-run after any layout or camera change); crop only what it can't judge (glow bodies, art inside a Lottie or a raster)
- [ ] Hero recognisable without labels; fills its zone; one hero per Type 1 scene
- [ ] **Cards dressed, not bare (user rule):** each meaningful card has ≥ 2 structure details (icon header, divider, port, skeleton bars, dot grid) and one light treatment by state: idle border · working = comet looping the border (2.5–4s/lap, ≤ 2 at once) · done = static gradient rim + glow (opacity only). `catalyst-motion/dna/visual-aesthetics.md` §5
- [ ] View mix: iso in ≤ half the scenes; every iso scene needs depth to make its point; code/UI/type read flat
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
