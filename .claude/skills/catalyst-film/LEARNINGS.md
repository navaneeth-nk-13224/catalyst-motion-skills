# Learnings — every lesson from the films so far, as checks

Each line was learned the hard way on a real film: Catalyst v1/v2, Slate 10s, CloudScale 1 and 2, Slate 30s and AppSail.
Add to this file whenever a film teaches something new.

## Direction (user feedback — these override defaults)
- **Never emulate the references.** Learn the rules, draw fresh art in code, and never trace or re-time an SVG. *(v2)*
- **No PPT films.** No text-left / art-right in every scene. Vary the layouts, anchors, scales and transitions. *(CloudScale 1)*
- **Arcs must be organic.** Pick the shape from the material, don't default to problem → solution, and don't repeat the last film's arc. *(after Slate 30s)*
- **Don't repeat ourselves.** The agent terminal and the box, cylinder and packet kit got stale. Run the freshness gate against the ledger. *(after AppSail)*
- **Ship only the final film.** One file, `outputs/<film>/<slug>.mp4`, with the full mix. No music-only, alternate cuts or `.srt` unless asked. *(after the pipeline)*
- **Same style, not exact copies.** The repo exists so others make *new* films in this style. Never re-render existing films to reproduce them. *(repo setup)*
- **Never render or rebuild a video unless asked.** A forced rebuild during repo setup replaced the approved Stratus videos. Config and docs work never needs a render; ask first. *(repo setup)*
- **Show 7–8 key stills before the final render.** Approval on stills avoided post-render rework on "One file" (lowest token cost of any film). *(Stratus One file)*
- **Fresh words too.** Every script drifted to the same shape (6 narrator lines, "ask your agent", Q→A, name lists, "Pay for what you ___"). Run `story/script-freshness.md` against `story/copy-ledger.md`. *(all scripts same)*
- **No captions, ever.** Not burned in, not as `.srt`. On-screen type carries the key words; the VO carries the rest. *(Stratus corporate)*
- **Visuals must be literally relevant.** If someone in the product's category can't name the hero object without labels in about 2 seconds, it's the wrong object. Abstract stacked slabs, plain cubes and lattices are not "object storage". See `catalyst-motion/create/relevance.md`. *(Stratus corporate)*
- **Clean clear space, always.** Text must never touch or overlap art and must keep generous whitespace: ≥ 56px from any solid's real outline (side faces included), cables and cards; ≥ 40px between text blocks. v2's panel labels were measured from the front face, so the side face swallowed the gap; tool chips sat on cables. Measure from the projected outline, or move the label into the card it describes. *(Progressive MCP v2, user)*
- **The voice must sound human.** Kokoro `af_heart` replaced the macOS voices. *(v2)*

## Script and voice
- The script check's *estimates* run ~25% long. A ✗ on an estimate can pass once measured. If the **measured** duration still fails, cut words. Raise the speed only as far as 1.1×. *(Slate 30s)*
- Print phonemes for brand words before writing VO. *(AppSail)*
  - "AppSail" reads correctly.
  - "PaaS" reads as "pah-ess", so keep it on screen only.
  - "backend" is stressed oddly, so write "back end".
  - "Next.js" is safer spoken as "Next".
- Name lists race by (~0.2s per name). Make on-screen reactions *highlights on the name*, not entrance staggers, because LottieFiles caps stagger at < 500ms total. *(Slate 30s)*

## Visual build
- **User-supplied VO with fixed timestamps:** record it first and measure. If a line overruns its slot or the runtime, show the numbers and let the user choose: a longer film, trimmed lines (show the wording, record it, then approve), or faster speech (≤ 1.1×). *(Progressive MCP)*
- **Recreating a reference film:** keep its acts and beats, redraw everything in the DNA. Its flat white diagrams become iso objects and Type 2 cards; its brand-colour logos become wordmarks. *(Progressive MCP)*
- Objects flying out of a solid must leave from the face that points at their destination. Chips crossing in front of the server's body read as clutter. *(Progressive MCP)*
- A solid that waits off-screen for a camera glide should emerge as the camera arrives, not sit at the frame edge from frame 1. *(Progressive MCP)*
- Headlines wrap unexpectedly at 88–92px in 760px columns. Use 76–84px in ≥ 860px, or `whiteSpace: nowrap`. Check on stills. *(CloudScale 1)*
- Leader labels collide with neighbouring solids and copy. Put labels in open space (a front foot, above the top face). Never point toward the text column. *(CloudScale 1, AppSail)*
- Crossfading counters overlap when values change faster than the fade. Hand over without overlap (out 120ms, then in 180ms). Keep static glyphs (like "×") still, and space events ≥ 400ms. *(AppSail)*
- A light wipe must **reveal content** behind its edge. If the new scene's content enters after the wipe, the viewer sees black. Pre-enter the hero element during the wipe. *(CloudScale 2)*
- Short-lived payoffs get cut off by exits. Give a resolve ≥ 0.7s on screen before the scene's exit. *(Slate 30s, condense vignette)*
- Art framed for the default (55–65% mid shot) reads small in wide layouts. Re-frame the camera per layout. Check that the platform or field fills its zone. *(CloudScale 2, AppSail)*
- Windows-in-world on a 30° iso plane: text stays legible at ≥ 20px DOM. Anchor the window's foot to a world edge so it looks grounded. *(Slate 30s)*
- Blur only as a **static** focus pull at the cut (L14). Never animate blur. *(AppSail)*
- Camera pans in tracking shots: ≤ 120px/s peak (sine in-out), with a shorter range if the scale grows. *(CloudScale 2)*
- Paths with spaces break Node `new URL().pathname` (it gives `%20`). Use `fileURLToPath`. *(pipeline)*

## Stills checklist (stage 8, on `outputs/<film>/preview/sheet.png`)
- [ ] No wrapped or clipped headline; no label colliding with art or copy
- [ ] **Relevance:** the hero object is recognisable as the product's thing without labels (`catalyst-motion/create/relevance.md`)
- [ ] Each scene's hero fills its zone (not tiny, not cropped); only one hero per Type 1 scene
- [ ] Transitions show content (wipe edge, pull-out target, morph endpoints)
- [ ] Every resolve is visible ≥ 0.7s before its exit
- [ ] Thumbnail row doesn't look like one template (anti-PPT); nothing benched or retired in the ledger is a hero

## Audio
- Single-pass loudnorm misses on short or dynamic mixes (−13.1 to −13.9). `mix.py` now runs **two-pass linear** loudnorm. *(pipeline)*
- Breath cuts need true silence. Zero the music, drums and SFX buffers for 150–200ms, after a 300ms fade. *(CloudScale 2 onward)*
- Pick the key and arrangement per film so a series doesn't sound alike: D for Slate 30s, E for AppSail, A for CloudScale. Demo-first films start the groove on frame 1. *(AppSail)*
- Mirror surge and traffic schedules exactly in Python (same algorithm), so the tick texture matches the pillars and packets. Better still, put the times in `cues.json`. *(Slate 30s)*

## Tooling
- **Fresh session per film, measured:** the same v2 film cost 8.8M tokens processed in a long session (≈395K re-read per request) and 4.5M in a fresh one (≈117K). The test session still opened the kit sources despite KIT.md, and every full-size still it read stayed in context (47K → 165K) → KIT.md now carries every signature and skeleton, and stills are reviewed with `film.py look` crops. *(token test)*
- **Token budget (after Progressive MCP, 158K):** start from `SKILL.md` (digest) and `template/KIT.md`; open deep rule files only when a gate fails; read only the ledgers' status tables; never re-read an old film's code or `synth.py`. Start a **fresh session per film** — a long session re-reads its whole history every turn. Keep the stills rounds: they prevent re-renders. *(token audit)*
- The Remotion **Node API ignores `remotion.config.ts`**. Pass `rspack: true` to `bundle()` (and any other config) explicitly, or the scripts silently differ from the CLI. *(pipeline audit)*
- Render concurrency above 8 gains nothing on this machine (150 frames: 10.2s at 8 vs 10.3s at 14). Rendering isn't CPU-bound, so leave it at 8. *(pipeline audit)*
- Cache keys must hash a stage's **inputs only**, never files the stage rewrites, or the cache never hits. *(pipeline audit)*
- Keep the Kokoro venv **outside** the session temp dir: `~/.catalyst-film/venv` via `bin/setup.sh`. *(pipeline)*
- Clone node_modules with `cp -c -R` (an APFS clone) from any existing film. It's instant. *(all films)*
- Equal file sizes across render variants are normal (constant-bitrate audio). Verify by loudness, not by size. *(CloudScale 1)*
- Port 3000 may be held by an old Remotion Studio. Use `npx remotion studio --port=3001`. *(Slate 10s)*
