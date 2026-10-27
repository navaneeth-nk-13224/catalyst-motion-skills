# Script freshness — don't let the words repeat

Visual freshness lives in `catalyst-motion/create/freshness.md`. This file does the same for **the words**. Every
film so far drifted into the same script: 6 narrator lines, one feature per line, an "ask your agent" beat,
Q→A pairs, name lists, and "Catalyst ___." with "Pay for what you ___. Nothing else." at the end. The rules below stop that.

**User briefs win.** If the user asks for a specific mode (for example "a corporate narrator explainer"), do it. Then vary
everything else this file allows.

## 1. The copy ledger gate (run when drafting the script)
Read [copy-ledger.md](copy-ledger.md) before writing.
- **Benched** (used in either of the last 2 films): can't be the opening, the closing or the hero line.
- **Retired** (used in 3 or more films): not used at all until 3 films pass without it.
- After the film is done, append its openings, closings, voice mode, devices and key phrases to the copy ledger (pipeline step 11).

## 2. Rotate the voice mode
| Mode | What it sounds like |
|---|---|
| Narrator | One calm voice explaining |
| Dialogue | Two Kokoro voices (for example a user and the agent, or dev and finance) |
| First person (product) | The product speaks: "I keep every file…" |
| First person (object) | A file, a request or an app tells its own story |
| Letter / note | Read aloud: a breakup letter, a memo, a changelog |
| Type and music only | No voice at all; on-screen type and sound carry it |
| Mostly silent | One or two spoken lines; the rest is sound design |

Don't use the same mode as the previous film.

## 3. Rotate openings and endings
- **Openings:** a question · a line of code or a command · a number · a sound first (no voice for 1–3s) · a single word · mid-sentence · a salutation · a statement.
- **Endings:** a callback to the opening · a command ("Go ship it.") · the product name alone · silence and the logo · a P.S. · an open question.
- The opening and the ending must each differ from the last 2 films' openings and endings.
- The brand line doesn't have to be spoken last. On-screen-only is fine.

## 4. One rhetorical device per film
Choose one device, and don't use the same one as the previous film:
- a triplet ("Store it. Serve it. Forget it.")
- repetition at the start of lines
- contrast pairs ("Theirs: … Yours: …")
- a countdown
- one-word lines
- a sustained metaphor
- a callback
- one character finishing the other's sentence

## 5. Structure is not fixed
- Use 3–9 lines, not always 6.
- Include at least one beat of 2.5s or more with no voice, carried by picture and sound.
- One line may exist only as on-screen type.
- Not every line needs a feature. Leave room to breathe.

## 6. Site copy
- Site taglines ("Pay for what you ship", "agent-ready", "built for the agent era") are used **word for word at most once across the series**. After that, paraphrase them or show them visually.
- Facts must still be traceable to the site. Freshness changes the words, never the claims.

## 7. The swap test
For every line, ask whether it could move into a previous film's script unchanged. If yes, rewrite it, until each line belongs to this film's product, metaphor and story.

## 8. Brief block (add to `<film>-brief.md` §3)
```
Voice mode        : <mode> — previous film used <mode>
Opening / Ending  : <type> / <type> — differ from last 2 films ✓
Device            : <device> — previous film used <device>
Lines / silences  : <n> lines · <n> silent beats ≥ 2.5 s
Copy ledger check : no benched/retired phrases as opening, closing or hero line ✓
Swap test         : every line belongs to this film ✓
```
