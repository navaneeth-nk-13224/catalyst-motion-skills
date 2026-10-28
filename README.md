# Catalyst Motion Skills

Catalyst (Zoho) motion films, made with a three-skill suite and one pipeline.

**Start here → [.claude/skills/catalyst-film/PIPELINE.md](.claude/skills/catalyst-film/PIPELINE.md)**

```sh
sh .claude/skills/catalyst-film/bin/setup.sh                           # once per machine
sh .claude/skills/catalyst-film/bin/new-film.sh "<folder>" <CompId> <slug>
cd "outputs/<folder>/video" && ./film check                      # …then vo · words · stills · sound · mix · render · verify
```

| Path | What |
|---|---|
| `.claude/skills/motion-design/` | LottieFiles motion-design skill. **Top authority** for timing and easing. |
| `.claude/skills/catalyst-motion/` | Catalyst style. Start with `QUICKREF.md` and `ledger.md`. Then DNA, the Type 1/2 grammars, layouts, originality and freshness. |
| `.claude/skills/catalyst-film/` | Production: `PIPELINE.md`, `LEARNINGS.md`, story arcs, the brief template, audio/captions/verify docs, `bin/`, `template/` |
| `References/animated-svg/` | 15 catalyst.zoho.com SVGs. Study only, never reused. |

## Outputs
`outputs/` is empty in the repo, and everything inside it is git-ignored. Each film you make lands in its own folder:
`outputs/<film>/` → `<slug>-brief.md` · `video/` (code) · `<slug>.mp4` · `preview/` (key stills) · `build/`.

Open the repo in Claude Code and ask for a film. It checks the prerequisites, gets the setup ready, writes the script,
shows key stills for approval, builds with every rule, and saves the film in `outputs/<film>/` (see `CLAUDE.md`).

`catalyst-visual-aesthetics.md` and `catalyst-motion-guidelines.md` are stubs pointing into the skills.
