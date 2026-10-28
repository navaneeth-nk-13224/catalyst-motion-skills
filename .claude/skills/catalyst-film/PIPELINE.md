# Catalyst Film Pipeline — run card

**Start with `SKILL.md` (the film-start digest)** — it condenses this card and the rule files. This card is the full reference.
**Read only what each stage lists.** Deep files are for when a gate fails or a
choice needs detail.

**Delivery rule:** each film ships **one file**, `outputs/<film>/<slug>.mp4`, the final film with the full mix. **No captions, ever** (user rule, 2026-10-27): no burned-in subtitles, no `.srt`. No music-only or alternate cuts unless the user asks for one for a specific film.

**Two standing rules:**
- **Same style, not exact copies.** The goal is new films in the same style, not byte-identical re-renders of existing ones.
- **Never render or rebuild a video unless the user asks.** Setup, docs and config work never needs a render. If a change would need one, ask first.

**Authorities:**
1. LottieFiles `motion-design` (timing, easing)
2. `catalyst-motion` (look, motion grammar, layouts, originality, freshness)
3. `catalyst-film` (story, production)

**Lessons from every film so far:** [LEARNINGS.md](LEARNINGS.md). Skim it before stage 4 and stage 8.

## 0 · One-time setup (per machine)
```sh
sh .claude/skills/catalyst-film/bin/setup.sh      # persistent venv ~/.catalyst-film/venv (Kokoro + numpy), checks ffmpeg/node/espeak
```

## Stages
| # | Stage | Read | Do (commands run inside `outputs/<film>/video`) | Gate | Output |
|---|---|---|---|---|---|
| 1 | **Research** | — | Pull the product page (Playwright): headlines, real names, numbers. Note site bugs. | Every claim is traceable to the page or flagged "my wording" | Brief §1 |
| 2 | **Scaffold** | — | `sh .claude/skills/catalyst-film/bin/new-film.sh "<folder>" <CompId> <slug>` | `tsc` clean (the script checks) | `outputs/<folder>/video`, `outputs/<folder>/<slug>-brief.md` |
| 3 | **Story** | `story/arcs.md`, `catalyst-motion/ledger.md` (last arcs) | Draft the VO as a story, then name its shape. Write the core idea, arc, turns and rhyme. | One-sentence idea · arc from the material and ≠ last film · every link is a *but* / *therefore* · the ending rhymes | Brief §2 |
| 4 | **Script** | `story/story-and-script.md` §3–4, **`story/script-freshness.md`**, **`story/copy-ledger.md`** | Put the lines in `src/timeline.json` (cuts, `vo[]`). Run `./film check`. | No ✗ slots. Budget ≤ +10% (~2.1 words/s of runtime). **Script freshness:** voice mode, opening, ending and device differ from recent films; no benched or retired phrases; swap test passes. | timeline.json |
| 5 | **Voice** | — | `./film vo`, then `./film words` | Measured check passes. Pronunciation checked for brand words (see LEARNINGS §Voice). | `vo[].dur`, `vo[].words` |
| 6 | **Storyboard** | `catalyst-motion/QUICKREF.md`, `ledger.md`; deep files only as needed | Fill the brief §4: metaphor, layout rhythm, transitions, a block per scene, the **freshness block**. Put every SFX-relevant event in `src/cues.json`, pinned to VO words (`"vo3:Claude"`). | Originality ≥ 4/6 · anti-PPT film check · freshness (no benched/retired heroes, ≥ 2 new primitives, ≥ 1 new UI pattern, signature moment) · **relevance** (every hero passes the 2-second test, `catalyst-motion/create/relevance.md`) | Brief §4, cues.json |
| 7 | **Show the user** | — | Present the script and storyboard | Approved (skip only if told "just make it") | — |
| 8 | **Build** | `catalyst-motion` grammar files for the chosen verbs/layouts | Write `src/art.tsx` (new primitives) and `src/Film.tsx`. Use `cue()` / `word()` for every timing. `npx tsc --noEmit`, then `./film stills`. Look at `outputs/<film>/preview/sheet.png`, fix, repeat. | Sheet passes LEARNINGS §Stills checklist | Scenes |
| 8b | **Key stills** (after stage 8 Build, before stage 9) | — | Render 7–8 stills of the most important moments: `./film stills <frames>` (writes `outputs/<film>/preview/`). Open them, wait. | **The user approves the stills.** No sound, mix or final render before that. | `outputs/<film>/preview/` |
| 9 | **Sound** | `production/audio.md` §2–3 | Write `audio-src/make_sound.py` (score + SFX only; instruments come from `synth.py`) using `CUE()` / `WORD()`. Run `./film sound`, then `mix`. | Music follows the arc's music line. Breath-cut silence is real silence. | `outputs/<film>/build/audio/mix*.wav` |
| 10 | **Render + verify** | `production/verify.md` | `./film render`, then `verify`. | `verify` ALL PASS (spec, duration, −14 ±0.5 LUFS, TP ≤ −1 dB, words, **single deliverable**, no captions) | **`outputs/<film>/<slug>.mp4` only** |
| 11 | **Log + report** | — | Paste brief §7 into `catalyst-motion/ledger.md` **and** the film's openings, endings, mode, device and phrases into `catalyst-film/story/copy-ledger.md`; update both status tables. Fill brief §5–6. Open the MP4. | `verify` shows ✓ ledger_entry | Ledgers, final message |

**Shortcut:** once the key stills are approved and the sound is written, `./film all` runs check → vo → sound → mix → stills → render → verify. Unchanged stages are skipped from cache. Use `--force` only when the user asks for a rebuild.

## What the automation replaced (same quality, less time)
| Before | Now | Effect |
|---|---|---|
| Copy the template, find node_modules, write the brief headers by hand | `new-film.sh` (9s) | Brief has every gate pre-headed, so none can be skipped |
| Kokoro venv in a session temp dir | `~/.catalyst-film/venv` (setup.sh) | Survives sessions |
| `silencedetect` per line, guessing word onsets | Kokoro token timestamps → `vo[].words`; `word()` / `cue()` | Exact cues, no manual step |
| The same event time typed in TS and in Python | `src/cues.json` read by both | Visuals and sound can't drift |
| One `remotion still` (full bundle) per frame | `stills.mjs`: 1 Rspack bundle, 1 browser, 4 parallel pages, auto frames per scene + sheet | 7 stills + sheet in 4.1s (was 14.6s sequential), byte-identical pixels |
| Node scripts bundled with webpack (4.4s) | `rspack: true`, the same bundler `remotion.config.ts` gives the CLI (0.7s) | 3.7s saved per bundle, same output as the CLI-made films |
| 3 full renders (main / no-captions / music-only) + `.srt` + burned-in captions | `render.mjs`: **one render, one file**, the final film | 2 renders less; nothing to sort through |
| Single-pass loudnorm (−13.1 to −13.9) | Two-pass linear loudnorm | Every cut lands on −14.0 ±0.1 |
| Eyeballing ffprobe / ebur128 output | `verify.py` table + `outputs/<film>/build/review/verify.json` | Objective pass/fail, ledger reminder |
| Re-running VO, score, stills and render after every edit | Content-hash cache in `film.py` on each stage's **inputs**: VO (text, voice, speed), sound (script, cues, cuts, VO), mix, stills (src + fonts + brand), render (picture + mix) | Nothing changed: 0.4s. Sound-only tweak: ~12s (no VO, no stills). |

## File map
```
.claude/skills/
  motion-design/               LottieFiles (top authority)
  catalyst-motion/
    QUICKREF.md                one-page hard rules  ← read every film
    ledger.md                  motifs used per film ← read every film, append after
    dna/                       style-dna · type1-grammar · type2-grammar · visual-aesthetics
    create/                    concept-to-motion · verb-library · composition-library · frame-layouts · originality-check · freshness
    study/                     reference-study · svg-measurements (archive)
  catalyst-film/
    PIPELINE.md (this) · LEARNINGS.md · SKILL.md
    story/                     arcs · story-and-script · storyboard-template · brief-template
    production/                audio · verify · scaffold
    bin/                       setup.sh · new-film.sh · requirements.txt
    template/                  Remotion project: timeline.json · cues.json/ts · Stage · iso/motion/theme kit
                               scripts/ film.py · timeline_tools.py · stills.mjs · render.mjs · verify.py
                               audio-src/ kokoro_vo.py · synth.py (library) · make_sound.py (score) · mix.py
                               KIT.md (kit API) · src/kit.tsx (supporting helpers)
```
