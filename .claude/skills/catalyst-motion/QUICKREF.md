# Catalyst Motion — QUICKREF (one page of hard rules)

These are the *musts* from the full skill, for everyday use. When a rule needs detail or a gate fails, open its
source file. The source files win over this page if they ever disagree.

## Authority
LottieFiles `motion-design` → this skill → `dna/visual-aesthetics.md`.
- **Type 1** (ambient isometric system) is for **important features**.
- **Type 2** (UI assembly) is for **small animations**.

## DNA invariants (`dna/style-dna.md`)
- **The world:** a `#000` void in true isometric (±30° and vertical; no perspective, no camera rotation).
- **Solids:** dark matte with 1px gradient edges.
- **Colour:** light is the only colour. The accent gradient `#7DF4FF → #FFFD99 → #FF4646` is never animated, and brightness comes from opacity only.
- **Motion:**
  - Matter is calm, energy is busy. Solids move slowly and gently (≤ ~120px/s, no overshoot).
  - Light travels along iso axes, turning only at right-angle corners.
  - Light is born, travels, then dissolves. It never pops off.
- **Rhythm:** polyrhythmic loops; 2–4 light events at once; starts on a ~500ms grid.

## Timing (LottieFiles Premium)
| Token | Value |
|---|---|
| Signature easing | `(0.4, 0, 0.2, 1)` |
| Enter | `(0, 0, 0.2, 1)` |
| Exit | `(0.4, 0, 1, 1)`, 30–50% shorter than the entrance |
| Durations | 350 / 500 / 800ms |
| Stagger | total < 500ms per group |
| Overshoot | 0%, except 5% on one success moment |
| Spatial motion | never linear; chain segments with corners as keyframes |

Three layers per scene:
- **Primary:** the verb.
- **Secondary:** the reaction, 10–30% of primary, at +100–300ms.
- **Ambient:** 10–20% of primary.

## Type 2 grammar (`dna/type2-grammar.md`)
- **Phases:** frame → build (≤ 2.5s, in reading order) → resolve (the outcome arrives last) → hold (≥ 1.5s, with at most one heartbeat accent).
- **Patterns:** anchor → extend; two-speed cascade (33–50ms siblings / ~300ms groups); placeholder → truth.

## Layout and transitions (`create/frame-layouts.md`)
- Use the 14 layouts. Never repeat one in adjacent scenes, and use a split in at most 1 of every 4 scenes.
- Each film needs:
  - a giant-type scene and a quiet scene
  - a wide shot and a close-up
  - a text anchor that moves between scenes
- A plain slide on at most every other cut. The rest: morph · camera glide · push-in / pull-out · light wipe · type hand-off · breath cut · focus pull.

## Originality and freshness (`create/originality-check.md`, `create/freshness.md`, `ledger.md`)
- **References:** each scene differs on ≥ 4/6 axes (composition, verb, carrier, topology, silhouette, rhythm) from its 2 nearest references.
- **Our own films:** read `ledger.md`. Benched motifs (last 2 films) and retired ones (3+ films) can't be heroes.
- **Every film:**
  - ≥ 2 new Type 1 primitives
  - ≥ 1 new Type 2 pattern (surface × framing × interaction × outcome)
  - a new hero silhouette, light carrier, lead material and glow placement
  - one named **signature moment**
- **The agent prompt:** at most once per film, re-imagined every time. Show the outcome, not a log.

## Relevance (`create/relevance.md`)
- **The 2-second test:** without labels, someone in the product's category names the hero object correctly ("a bucket of files", "a database table").
- Use the service's real objects (the vocabulary map). **Banned as heroes:** stacked rhombus slabs / layers / lattices, plain cubes as services, platforms or tile floors as "the cloud", bare cylinders, portals with nothing recognisable passing through.

## Story (catalyst-film `story/arcs.md`)
- **Shapes:** problem → solution · launch teaser · demo-first · customer story · manifesto (blends of at most 2).
- **Pick from the material.** Every link is a *but* or a *therefore*; never announce the structure; the ending rhymes with the opening.
- **Only two stages are mandatory:** the core idea and the ending.

## Scripts (catalyst-film `story/script-freshness.md`)
- Read the **copy ledger** first. Rotate the voice mode (narrator · dialogue · first person · letter · type-only · mostly silent), the opening, the ending and the device.
- No benched or retired phrases. Site taglines verbatim at most once per series. 3–9 lines, with at least one silent beat. Run the swap test.

## Fill-in block for every brief
```
Core idea · Arc (+why) · Turns · Rhyme
Layout rhythm · Transitions
Benched · New primitives (≥2) · New Type 2 pattern · Hero silhouette · Carrier · Material · Signature moment · Relevance (2-second test)
```
