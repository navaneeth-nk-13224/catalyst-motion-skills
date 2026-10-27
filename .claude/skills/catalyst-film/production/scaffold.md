# Scaffold a new film

```sh
sh .claude/skills/catalyst-film/bin/setup.sh                                    # once per machine (persistent Kokoro venv)
sh .claude/skills/catalyst-film/bin/new-film.sh "<folder>" <CompositionId> <slug>
#   → <folder>/video          Remotion project from template/ (node_modules APFS-cloned from any existing film)
#   → <folder>/<slug>-brief.md brief with every pipeline gate pre-headed (story/brief-template.md)
```

## Run order (inside `outputs/<folder>/video`)
```sh
python scripts/film.py check      # word budget gate — after every script edit
python scripts/film.py vo         # Kokoro → dur + word timestamps (cached)
python scripts/film.py words      # every VO word with its film-clock time → pin cues in src/cues.json
# … build src/art.tsx + src/Film.tsx with cue()/word() …
python scripts/film.py stills     # stills + sheet → outputs/<film>/preview/ (one bundle)   [frames…]
# … write make_sound.py (score + SFX only) with CUE()/WORD() …
python scripts/film.py sound      # score + SFX (cached)
python scripts/film.py mix        # ducking + two-pass loudnorm (cached)
python scripts/film.py render     # the ONE deliverable → outputs/<film>/<slug>.mp4 (picture + full mix, no captions)
python scripts/film.py verify     # automatic delivery checks → ALL PASS
python scripts/film.py all        # everything above in order, cached stages skipped (--force to redo)
```

## What's in the template
| File | Role |
|---|---|
| `src/timeline.json` | **Single source of truth:** id, slug, fps, size, `cuts` (s), `scenes[]` (name), voice and speed, `vo[]` (`at`, `text`). Written back: `dur`, `words`. |
| `src/cues.json` + `src/cues.ts` | Named film events (seconds, or `"vo3:Claude+0.1"`), read by **both** the scenes (`cue()`, `word()`) and `make_sound.py` (`CUE()`, `WORD()`) |
| `src/timeline.ts` | Typed access: `TL`, `CUT_FRAMES`, `sceneFrom(i)`, `sceneDur(i)`, `OVERLAP` |
| `src/Stage.tsx` | Scene shell with the baseline page transition; pass `transition="none"` to choreograph your own |
| `src/Film.tsx` | Example scenes. **Replace them.** |
| `src/kit.tsx` | Supporting helpers: `P`/`win` timing, `rise`/`pop`, `Eyebrow`, `card`, `isoRoute`/`Thread`, `Chip`, `Meter` (API: `KIT.md`) |
| `src/iso.tsx` · `motion.ts` · `theme.ts` | Starter iso kit (**benched as heroes**, see `catalyst-motion/create/freshness.md`), LottieFiles Premium tokens, Catalyst tokens + Zoho Puvi |
| `audio-src/kokoro_vo.py` | VO + measured durations + word timestamps |
| `audio-src/synth.py` | Synth library (instruments, reverb, writer). Same for every film. |
| `audio-src/make_sound.py` | This film's score and SFX only (`from synth import *` … `finish()`). Rewrite per film. |
| `audio-src/mix.py` | VO placement, side-chain ducking, **two-pass** loudnorm to −14 LUFS / −1.5 dBTP → `mix.wav` |
| `scripts/film.py` | Stage runner with content-hash cache (`outputs/<film>/build/state.json`) |
| `scripts/timeline_tools.py` | `check` · `word()` / `cue()` resolvers |
| `scripts/stills.mjs` | Review stills from one bundle and one browser, with auto frames per scene, plus the contact sheet |
| `scripts/render.mjs` | One render: the final film with the full mix (no captions). Removes any stray variants from `outputs/<film>/`. |
| `scripts/verify.py` | Spec, duration, loudness and peak of the one deliverable; single-deliverable rule; VO words; ledger entry → `outputs/<film>/build/review/verify.json` |

The art (`src/art.tsx`) is **always new per film.** The template ships none.
