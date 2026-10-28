# Catalyst Motion Skills — instructions for Claude

This repo makes Catalyst (Zoho) motion films. The goal is that **anyone who uses it makes new films in the same style**:
the same aesthetics, motion, voice and sound quality. The goal is **not** to reproduce the existing videos byte for byte.
The skills carry the style; the pinned toolchain keeps rendering, voice and mix consistent across machines.

## One film per chat session (user rule)
Every new video generation starts in a **fresh chat session**. If the user asks for a film here and this session already
holds other work (an earlier film, setup, docs, reports), don't start: say a new chat roughly halves the tokens (4.5M vs
8.8M for the same film), ask them to open a new chat in this folder, and give them a ready-to-paste prompt containing
their request. Continue here only if they insist. After delivering a film, remind them to start the next one in a new chat.

## When someone clones this repo and asks for a film — always this order
`outputs/` is empty in the repo. The skills and `.claude/skills/catalyst-film/template/` carry the style; every film is made fresh.

1. **Check prerequisites.** Before anything else, every time, in ONE call:
   ```sh
   sh .claude/skills/catalyst-film/bin/start.sh   # doctor + KIT.md + ledger Benched/Retired rows + script-freshness.md
   ```
2. **Get the setup ready.** If anything shows ✗, list the failing items and the doctor's exact `fix:` commands.
   - System installs change the machine, so ask once, then run them: `brew install node python@3.11 espeak-ng` (`ffmpeg` optional, for contact sheets).
   - Then run `sh .claude/skills/catalyst-film/bin/setup.sh`, which builds the pinned Python venv (`requirements.lock`) and the pinned Kokoro model.
   - Re-run the doctor until it says `✓ ready to build`. Treat ⚠ (e.g. not macOS arm64) as "works, but voice and rendering may differ slightly", and tell the user.
3. **Generate the script.** Start from the film-start digest `.claude/skills/catalyst-film/SKILL.md` (loaded with the skill)
   and `template/KIT.md`; open deep rule files only when a gate fails. Stages 1–7:
   - Research, then scaffold with `new-film.sh "<folder>" <CompId> <slug>`. This creates `outputs/<folder>/` and runs `npm ci` for the pinned Remotion.
   - `new-film.sh` runs the film doctor itself. Film commands are `./film <stage>` inside `outputs/<folder>/video`.
   - Story, then the script. The script goes through the freshness gate (`script-freshness.md` + `copy-ledger.md`).
   - Storyboard, then **show the script and storyboard and wait for approval**.
4. **Show sample images.** Build the scenes (stage 8), then render 7–8 key stills of the most important moments
   (`./film stills <frames>` → `outputs/<folder>/preview/`). Open them and **wait for approval** (stage 8b).
5. **Build with every rule below.** Sound, mix, render, verify (stages 9–10). Verify must say ALL PASS.
   Then log the film in both ledgers (stage 11).
6. **Store it in its own folder under `outputs/`.** Everything for the film ends up in `outputs/<folder>/`: brief, `video/` code,
   `<slug>.mp4`, `preview/` and `build/`. Give the user the path to the `.mp4`.

## Rules that always apply
- **Keep token use lean without touching quality.** One film per session (suggest a fresh session if this one is long).
  Every call re-reads the whole context, so cost ≈ calls × context: batch independent commands into one call, don't retry blindly.
  `start.sh` prints the digest's reading list in one call — never the kit sources, old films' code or `synth.py`.
  Review stills lean: one contact sheet per round, details via `./film look <frame> [x y w h]` crops, never full-size stills.
  Never skip the approvals, self-review stills or key stills.
- **Same style, not exact copies.** Films made on this machine are worked examples (style, motion, structure, code patterns); a clone
  learns the same things from the skills and ledgers. Never re-render them to "reproduce" them, and never treat byte-identical output as a goal.
- **Never render or rebuild a video unless the user asks.** That includes existing films, re-renders "to check" and
  forced rebuilds (`./film all --force`, `render`). Setup, docs, skill and config work never needs a render. If a
  change would require re-rendering, say so and ask first; re-rendering replaces the previous video in `outputs/`.
- **Show key stills before the final render.** After the script and storyboard are approved and the scenes are built,
  render 7–8 stills of the film's most important moments (`./film stills <frames>`), save them to
  `outputs/<film>/preview/`, open them, and wait for approval. Only then do sound, mix and the final render.
- **Fresh words, not just fresh pictures.** Before writing any script, read `catalyst-film/story/script-freshness.md` and
  `story/copy-ledger.md`. Rotate the voice mode, opening, ending and device; no benched or retired phrases; run the swap test.
- **One folder per film, inside `outputs/`.** Every film lives in `outputs/<film>/` and holds *everything* for that
  render: `<slug>-brief.md`, `video/` (the Remotion code), `<slug>.mp4`, `preview/` (key stills) and `build/` (vo,
  audio, review, cache). Nothing about a film lives outside its folder. Run film commands inside `outputs/<film>/video`.
- **Nothing in `outputs/` goes in git.** The whole folder is git-ignored and ships empty (only `outputs/.gitkeep`).
  What carries the style into a clone: `.claude/skills/` (rules, ledgers, template, pinned toolchain). One video per film, no variants.
- **Clear space.** Text never touches or overlaps illustrations: ≥ 56px from any art outline, cable or card, ≥ 40px between
  text blocks. Check every text block at full size on the stills before showing them.
- **The view fits the idea — don't always use isometric.** Iso only where depth carries the meaning (systems, flows
  between parts, scale). Code, UI, type, numbers and single objects go flat front-on; schedules and timelines go plan view.
  Iso in at most half the scenes, at least 2 non-iso scenes per film; name each scene's view in the storyboard.
- **No captions.** Ever.
- **Use the official logo animations** in `catalyst-assets/logo-animations/` (dark-BG lockup for end cards). Permanent brand files: never redraw, recolour or retime them. See `catalyst-assets/README.md`.
- **Authorities:** LottieFiles `motion-design` → `catalyst-motion` (style, relevance, freshness, ledger) → `catalyst-film` (story, scripts, production).
- **Don't change pinned versions** (`bin/toolchain.json`, `bin/requirements.lock`, `package-lock.json`) unless asked. They keep the look and sound consistent across machines.
