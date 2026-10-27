# Reference study — principles, not layouts

The SVGs live in `References/animated-svg/` (SVGator exports, CSS keyframes). Each one is listed here with the
**principle it proves**, so it can be applied elsewhere, and the **signature to avoid copying**, so new work
does not echo it. The full timing measurements are in `study/svg-measurements.md` (archive).

## Type 1
| Reference | Principle it teaches | Signature — don't copy |
|---|---|---|
| `home-new__catalyst-header-lines` (6s) | Layered ambience: floats + breathing rays + pillars + shooters at once, each on its own clock | 4 bobbing blocks, 10 pillars, 2 diagonal rays |
| `appsail__appsail-banner` (4s) | Repetition implies scale: one carrier copied at uneven offsets (0 / 35 / 72.5%) reads as a stream | Containers on a conveyor |
| `cloudscale__banner-hero` (12s) | Long loops can be nearly still; fading things in on a 500ms beat is enough life | 8 gentle floats |
| `nosql__nosql-banner` (5s) | Snap-into-place (expo in-out) says "structured storage" | Blocks sliding into slots |
| `quickml__quickml-banner` (4.9s) | Pulsing glows on a fast beat (300ms) read as computation | Glow pulse grid |
| `signal__zwc-banner` (7s) | Launch times tell a story: staggered sends at irregular times read as real events | Signals along circuit lines |
| `signal__zwc-tab-1/3/4` | Sequential reveal can narrate a process step by step | Tab-specific flows |
| `slate__zwc-banner` (8s) | Heavy solids glide slowly (quart in-out, 4s); one 6% pulse carries the emphasis | The glide set |
| `slate__zwc-bluting` (10.3s) | Line-draw connectors explain relationships | 40px rises plus drawn connectors |
| `smartbrowz__smartbrowz-banner` (6.1s) | Large floats spanning the whole loop give a dreamy, weightless feel | 50px floats |
| `stratus__stratus-banner` (12s) | Density through many small tracks (83 dash draws, 16 paths) without chaos; ripples mark arrival | Circuit-board storage |

## Type 2
| Reference | Principle it teaches | Signature — don't copy |
|---|---|---|
| `ask-anything 2nd type` (6s) | Placeholder → truth. A single heartbeat accent during the hold. Micro-cascade chips. | Ask pill + chips + 90° sparkle turns |
| `profile-collections 2nd type` (7s) | Anchor → extend. Interleaved columns. The outcome card arrives last, from below. | Sidebar rows + collection cards |

## Measured constants (use as ranges, not as exact copies)
| Quantity | Observed range |
|---|---|
| Solid float amplitude | 5–12px; hero drift up to 27px (50px only in smartbrowz) |
| Pillar rise | 130–330px |
| Shooter travel | 300–430px |
| Data travel | 70–430px |
| Loop length | 4–12s (Type 1), 6–7s (Type 2) |
| Type 2 build | finishes ≤ 2.4s |
| Stagger beats | 50ms (chips), ~300ms (rows), ~500ms (scene events) |
| Overshoot | 1.02–1.05 UI, up to 1.2 on tiny dots |
