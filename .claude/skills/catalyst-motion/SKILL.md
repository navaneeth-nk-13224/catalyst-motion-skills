---
name: catalyst-motion
description: >
  Generative Catalyst (Zoho) motion style. Use when designing any Catalyst / Zoho Catalyst animation, video,
  illustration loop or product vignette for ANY concept — new features, abstract ideas, campaigns — so it
  feels unmistakably Catalyst without copying the reference SVGs. Teaches the style's DNA (what never changes),
  the Type 1 (ambient isometric system — important features) and Type 2 (UI assembly — small animations)
  grammars, a concept-to-motion method, an in-style verb library, and an originality gate.
  Works on top of the LottieFiles `motion-design` skill, which stays the top authority.
---

# Catalyst Motion — generative style skill

The 15 SVGs in `References/animated-svg/` are **study material, not templates**. This skill pulls the
*rules* out of them so you can invent new scenes for any concept that a viewer would place as Catalyst, even though
no reference contains that scene.

> **Goal:** same hand, new drawing. Someone who knows catalyst.zoho.com should say "that's Catalyst" and
> also "I haven't seen that one before."

> **Every film, read these two first:** [QUICKREF.md](QUICKREF.md) (all hard rules on one page) and [ledger.md](ledger.md) (what our films already used). Open the deeper files below only for the stage or gate you're on.

## Authority order
1. **LottieFiles `motion-design` skill** (`.claude/skills/motion-design/`) — timing, easing, choreography, 1/3 rules,
   three motion layers, quality checklist. If it conflicts with anything below, it wins.
2. **This skill** — Catalyst style DNA + Type 1 / Type 2 grammars.
   - **Type 1** for important features, **Type 2** for small animations.
3. `dna/visual-aesthetics.md` — palette, gradient, type, surfaces.

> **Making a video?** Start from the `catalyst-film` skill. It runs the whole pipeline (story → script → VO →
> build → mix → verify) and calls this skill for the look and the motion.

## What to read
| Need | File |
|---|---|
| What makes it Catalyst (never changes) | [dna/style-dna.md](dna/style-dna.md) |
| Type 1 grammar — ambient isometric systems | [dna/type1-grammar.md](dna/type1-grammar.md) |
| Type 2 grammar — UI assembly | [dna/type2-grammar.md](dna/type2-grammar.md) |
| Turn a concept into a scene (the method) | [create/concept-to-motion.md](create/concept-to-motion.md) |
| In-style motion verbs beyond the references | [create/verb-library.md](create/verb-library.md) |
| Composition archetypes inside the iso world | [create/composition-library.md](create/composition-library.md) |
| **Frame layouts, layout rhythm and transitions (anti-PPT)** | [create/frame-layouts.md](create/frame-layouts.md) |
| Originality gate (run before building) | [create/originality-check.md](create/originality-check.md) |
| **Freshness: don't repeat our own films** (new UI patterns, new primitives, signature moment) | [create/freshness.md](create/freshness.md) · [ledger.md](ledger.md) |
| **Relevance: draw the real thing** (2-second test, vocabulary per service, banned stand-ins) | [create/relevance.md](create/relevance.md) |
| What each reference teaches (rules only, no layouts) | [study/reference-study.md](study/reference-study.md) |

## Workflow (every new concept)
1. **Decompose** the concept into Subject / Flow / Change / Outcome. See `concept-to-motion.md` §1.
2. **Classify** each beat:
   - Use Type 1 if it is the important idea, the system or the "why".
   - Use Type 2 if it is a small proof, a UI moment or the "how".
3. **Find a metaphor.** Generate 3 candidate metaphors and keep the one with the clearest *flow*. Concept-to-motion §2.
4. **Pick a composition** from `composition-library.md`.
   - Don't use *central monolith + pillars* unless the concept is literally one thing.
5. **Lay out the screen** for each beat with `frame-layouts.md`. Choose the frame layout, text anchor, type scale and art scale, and the transition into the scene.
   - Never use the same layout twice in a row.
   - Use "text left, art right" at most once per film.
6. **Choose verbs** from `verb-library.md`, or invent one with the verb recipe. Each scene gets one primary verb.
7. **Fill the three layers.** Primary is the verb, secondary is the reaction, ambient is breathing and floats. Respect the DNA invariants.
8. **Pass the originality gate.** Score each scene against its nearest references. Then run the film-level layout check (anti-PPT) and the **freshness gate** against `ledger.md`.
   - Benched and retired motifs are not heroes.
   - Add at least 2 new primitives and 1 new Type 2 pattern.
   - Name the signature moment.
9. **Pass the Lottie checks.** Run `motion-design/reference/quality-checklist.md`, then build.
   - Draw all art fresh in code. Never import or trace a reference SVG.

## Output contract
For any concept, first produce a short **motion brief** (template in `concept-to-motion.md` §6):
- the metaphor
- the composition
- the frame layout and transition per scene
- the verbs per layer
- the timings in ms
- the type tag per beat
- the originality score

Build the scene only after the brief.
