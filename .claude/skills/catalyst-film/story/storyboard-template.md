# Storyboard template

Fill in one block per scene inside `<film>-script.md`. One idea per scene: if a scene holds two ideas, split it.

```
SCENE 03 · How #1 — "Every component, one place"      t = 10.0–17.0s (f300–510)
ARC        : How it works (mechanism 1) — THEREFORE from scene 2   TYPE : 1 (important feature)
VO (10.3s) : "Data store, cache, search, auth, an API gateway, push, and mail. Every component, in one place."
METAPHOR   : light fans out from one hub and comes home          (same as the film metaphor)
COMPOSITION: hub & ring                                           (catalyst-motion/composition-library)
LAYOUT     : L9 annotated world — art centred and wide, categories as callouts, no headline block
TEXT ANCHOR: around the art (previous scene: top-left → eye moves to centre)
TRANSITION : IN = shared-element morph (window's "Data Store" node → ring block), lands on the word "Data"
LAYERS     : primary   fan-out by group on VO words (Storage 0.4s · Security 2.1s · Notify 3.5s)
             secondary block tops light + labels rise (+60ms)
             ambient   floats 3.5–5.6s, glows breathing
RESOLVE    : "in one place" → all 8 send packets home, hub ripples (4.9s)
SFX        : sparkle run per group · blips per block · riser → impact at 15.7s
ORIGINALITY: nearest = stratus-banner, header-lines → 5/6, 5/6 ✓
FRESHNESS  : new = <primitive / UI pattern introduced here> · avoids benched <motif> (ledger)
```

## Rules
- **Each VO line maps to exactly one visual intent.** If the picture needs explaining, the line or the picture is wrong.
- **Every transition lands on a named word.** Morphs and push-ins land on a noun, and hits land on the stressed last word.
- **Visual cues follow the real VO.** After the VO is generated, re-time every cue against the measured audio. See `production/audio.md` §1.
- **The brief carries the freshness block** from `catalyst-motion/create/freshness.md` §4: benched motifs, at least 2 new primitives, at least 1 new Type 2 pattern, hero silhouette, carrier, material and signature moment.
- **A thumbnail column belongs in the brief.** List L-codes in order, for example `L4 → full-UI → L9 → L5 → L12 → L3`. If two neighbours match, change one.
- **Assets list per scene.** Everything is drawn in code, so this is a list of components to build, not files to find.
