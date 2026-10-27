# Story & script

## 1. Core idea (decide first)
Write **one sentence** a viewer could repeat afterwards. Examples:
- "CloudScale is one backend that both you and your agents can build on."
- "Slate deploys any frontend from any coding agent, free until you ship."

If it takes two sentences, cut scope. Every beat must serve this sentence. Anything that doesn't is **cut, not shrunk**.

## 2. Arc — a film is an argument, not a feature tour
**Choose the shape in [arcs.md](arcs.md).** There are five shapes: problem → solution, launch teaser, demo-first, customer story and manifesto, plus blends. It also covers the organic rules: "but / therefore", only the core idea and the ending are fixed, and the ending must answer the opening. The table below is the **problem → solution** shape in detail. The other shapes reuse its type and layout thinking.

| Stage | Job | Viewer thinks | Typical type | Typical layout (`catalyst-motion/create/frame-layouts.md`) |
|---|---|---|---|---|
| **Problem** | Name the pain in the viewer's words | "That's me." | Type 1, in a *broken* state: tangled traces, stalled packets, dim blocks | L4 type as stage, L13 close-up |
| **Stakes** | What the pain costs: time, money, risk | "I need this fixed." | Type 2 micro: a counter climbing, a failing ladder | L12 big number, L6 lower third |
| **Solution** | The product as the fix, in one line | "Oh — that solves it." | Type 1 hero: the broken system *resolves* | L3 centre stage |
| **How it works** | 1–3 concrete mechanisms, one per scene | "I get how." | Type 1 for each important mechanism, Type 2 for each proof | L5, L9, L10, L14 |
| **Payoff / CTA** | The after-state plus **one** action | "I'll try it." | Type 2 over a Type 1 reprise | L3, L4 |

**Runtime shares** (a sanity check only; beat lengths come from the script, see `arcs.md` §3.4):
- Problem + stakes: 20–25%
- Solution: 10–15%
- How: 40–50%
- Payoff: 15–20%

**Short films:**
- **≤ 10s:** use problem → solution → payoff. Stakes can be implied in the problem line.
- **30s:** 1–2 mechanisms.
- **60s:** up to 3 mechanisms.

**Visual arc trick (Catalyst-specific):** the problem scene shows the *same* system as the solution scene, but broken. Traces stop mid-draw, packets pile up at a gate, blocks sit unlit and the glows are dim. The solution is the same world *resolving*, which is a natural shared-element morph. The DNA still applies to the broken state: no colour change, so it uses opacity, stillness and disorder.

**One metaphor, the whole film.** It comes from `catalyst-motion/create/concept-to-motion.md` §2. Reuse it in both the visuals and the VO wording. If the metaphor needs its own explanation, it's the wrong one.

## 3. Word budget (Kokoro `af_heart` at 1.05×, measured)
| | Value |
|---|---|
| Speech rate inside a line | ~2.9 words/s (short, punchy lines run faster; brand names slower) |
| **Budget across the runtime**, with breathing room | **~2.1 words/s** |
| 10s | ~20 words |
| 30s | ~62 words |
| 60s | ~125 words |
| Slot for a line | `words / 2.9 + 0.4s` breathing room; a visual-only beat needs ≥ 1.0s |
| VO offset | First line starts 0.3–0.5s after its cut. Leave ≥ 0.3s between a line ending and the next cut. |

`python scripts/timeline_tools.py check src/timeline.json` checks this automatically. After the VO is generated, the check uses the measured durations.

## 4. Writing VO for Kokoro
> **First run the script-freshness gate** (`script-freshness.md` + `copy-ledger.md`): rotate the voice mode, opening, ending and device; no benched or retired phrases; run the swap test. The rules below are about *how* lines sound, not *what* they say.

- Use spoken language: contractions, short sentences, one idea per line.
- **Punctuation is the direction.**
  - A full stop gives a ~0.35s pause and a comma ~0.15s.
  - Lists read best as "A, B, and C."
  - Avoid dashes and semicolons, which read flat.
- **Spell out the sound when needed:**
  - "back end" (not "backend", which Kokoro stresses oddly)
  - "API" is fine
  - "₹0" becomes "zero rupees", or avoid saying the number at all
- **Name lists** need ≥ 0.5s per name if visuals cue on them (the tab glide in CloudScale).
- Put the stressed word last in the line, where the visual hit lands: "…Nothing **else**."
- The brand line is its own final line: "Catalyst CloudScale."
- Every factual line comes from the site. Mark invented copy in the brief as "my wording".
