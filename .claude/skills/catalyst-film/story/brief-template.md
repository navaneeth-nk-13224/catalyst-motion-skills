# {{FOLDER}} — Film Brief (`{{SLUG}}`)

Made with the `catalyst-film` pipeline. Style comes from `catalyst-motion`; timing and easing from LottieFiles `motion-design` (Premium).
Composition `{{ID}}` · project `outputs/{{FOLDER}}/video` · deliverable `outputs/{{FOLDER}}/{{SLUG}}.mp4`

## 1. Research (step 1)
- **Source URL + date:**
- **Real names and numbers used:** (agents, frameworks, components, free-tier figures, verbatim lines)
- **Site issues spotted:** (copy bugs, outdated lists; report them, don't use them)

## 2. Story (step 2 · `story/arcs.md`)
```
Core idea : <one sentence a viewer could repeat>
Arc       : <shape or blend> — why THIS material has this shape; differs from the last film's arc? (ledger)
Turns     : beat1 → BUT/THEREFORE → beat2 → …
Rhyme     : how the ending answers the opening
```

## 3. Script (step 3 · word budget ~2.1 w/s of runtime)
| # | Cut | Beat | VO line | On-screen type (key words only) |
|---|---|---|---|---|

`./film check` → paste the result line.

### Script freshness (`story/script-freshness.md` §8, vs `story/copy-ledger.md`)
```
Voice mode        :            — previous film used
Opening / Ending  :            — differ from last 2 films ✓
Device            :            — previous film used
Lines / silences  :
Copy ledger check : no benched/retired phrases as opening, closing or hero line ✓
Swap test         : every line belongs to this film ✓
```

### Key stills (before sound and the final render)
7–8 stills of the most important moments → `outputs/<film>/preview/` → approved by the user on: <date>

## 4. Storyboard (step 4 · `story/storyboard-template.md`, `catalyst-motion`)
**Metaphor:**
**Layout rhythm:** L? → L? → … (no repeats; ≤ 1 split per 4 scenes; giant-type + quiet scenes; wide + close-up)
**Transitions:** (≤ every other cut a plain slide)

One block per scene: ARC · TYPE · VO · VIEW (iso · flat · plan · macro — why) · LAYOUT · TEXT ANCHOR · TRANSITION (lands on word …) · LAYERS · RESOLVE · SFX · ORIGINALITY · FRESHNESS

### Freshness block (`catalyst-motion/create/freshness.md` §4, checked against `ledger.md`)
```
Benched (last 2 films)  :
New primitives (≥2)     :
New Type 2 pattern (≥1) : surface × framing × interaction × outcome
Hero silhouette         :            — differs from
Main light carrier      :            — last film used
Lead material           :
Signature moment        :
```

## 5. Checks (fill after render · `./film verify`)
- **Originality:** the nearest references, and how many axes each scene differs on
- **Anti-PPT film check:**
- **Arc check:** every link is a but/therefore · the structure is never announced · the ending rhymes · it reads aloud without visuals
- **Audio:** key, tempo, arrangement per arc · LUFS / TP from verify
- **Verify:** paste the `film.py verify` table

## 6. Assumptions (my wording / illustrative)
-

## 7. Ledger entries (step 11 · paste into `catalyst-motion/ledger.md` and `catalyst-film/story/copy-ledger.md`)
```
### <Film name> (`outputs/{{FOLDER}}/`)
- **Arc:**
- **UI:**
- **Type 1:**
- **Signature:**
```
