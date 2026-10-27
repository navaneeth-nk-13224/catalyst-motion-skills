# Concept → motion: the method

Works for any input: a Catalyst service, an abstract idea ("trust", "speed"), a campaign line, or a
non-Catalyst topic that needs to look like Catalyst.

## 1. Decompose
Write one line each:

| Slot | Question | Becomes |
|---|---|---|
| **Subject** | What *thing* is this about? | Solids (Type 1) or the container (Type 2) |
| **Flow** | What moves through it, or between which places? | The primary carrier and its path |
| **Change** | What happens to what flows? Sorted, filtered, stored, multiplied… | The primary verb |
| **Outcome** | What does the user get at the end? | The reaction and resolution: ripple, lit face, result card |

If a slot is empty, the concept is abstract. Invent a flow that is true to it:
- "Trust" becomes requests that pass a gate untouched.
- "Speed" becomes a packet crossing a pipeline with no pauses while ghost packets lag behind.

## 2. Find a metaphor (diverge, then pick)
Make **three** candidates, one from each lens:
1. **Literal** — the actual architecture. For example, a function receives a request and returns a response.
2. **Physical** — a mechanism from the real world: a lock, a loom, a relay race, a prism, terraces, tides.
3. **Abstract** — pure light behaviour: converge, condense, a pulse-clock.

Score each from 1 to 3 on:
- **Clarity:** is the flow obvious without labels?
- **DNA fit:** can it be built from iso solids and light?
- **Freshness:** is it far from every reference? See `originality-check.md`.

Pick the highest score. If two tie, the one with the more distinctive **silhouette** wins.

## 3. Assign type per beat
| Beat is… | Type | Why |
|---|---|---|
| The headline feature, the system, the "why it matters" | **Type 1** | Important features get the system view |
| A proof the feature works: UI, command, result | **Type 2** | Small animations |
| A transition, chip or label | Type 2 micro, using the Lottie entrance/exit patterns | |

Use the Lottie page transition between scenes: the old scene exits left over 300ms; the new one enters from the right 100ms later.

## 4. Compose
- Pick an archetype from `composition-library.md`.
- Place the flow along the dominant diagonal.
- Decide where the outcome lands, since that is where the reaction and the glow go.
- **Lay out the screen** (`frame-layouts.md`):
  - Pick a frame layout per beat and plan the **text-anchor path** across the film.
  - Pick the transition into each scene.
  - Then run the film-level layout check in `originality-check.md`.

### Layout rhythm example — the CloudScale 30s film, re-planned
The first cut used text left / art right in all 5 content scenes, with slide transitions everywhere. That fails the
anti-PPT check. The same beats with layout rhythm:

| Beat | Layout | Text anchor | Art scale | Transition in |
|---|---|---|---|---|
| Hook | **L4 type as stage**: "agent-ready" at 200px, with YOU / AGENTS packets running along the baseline into the platform under the words | centre | mid | — (emerge from void) |
| Agents | **Full-frame UI**: the agent window fills 80%, with the headline as a small eyebrow top-left | top-left | close-up | **push-in** into the platform tile the last packet lit |
| Components | **L9 annotated world**: the hub & ring is centred and large, the 3 categories become callouts around it, no headline block | around | wide | **shared-element morph**: the window's Data Store node becomes the ring's Data Store block |
| Booking | **L5 headline over panorama**: the pipeline spans the full width with a camera glide along +x, and the ladder becomes callouts under each stage | top | wide (pan) | **camera glide** from the ring's API gateway block into the pipeline's gate |
| Pricing | **L12 big number**: ₹0.00 at 280px in the centre, with the usage bars as thin lines that fill and stop beneath it | centre | minimal | **light wipe** |
| CTA | **L3 centre stage** over a quiet reprise | centre | mid | **breath cut** |

## 5. Score the motion
Write the timings in ms, layer by layer, on the beat grid (see `dna/style-dna.md` §3).
- **Check the 1/3 rules:**
  - Primary moves the most.
  - Secondary is 10–30% of primary.
  - Ambient is 10–20%.
  - At most 3 things start in the same 100ms.

## 6. Motion brief template
```
Concept:      <one line>
Decompose:    Subject … | Flow … | Change … | Outcome …
Metaphors:    literal … (c/d/f) · physical … (c/d/f) · abstract … (c/d/f)  → chosen: …
Beats:        [t0–t1] Type 1|2 — what happens
Composition:  <iso archetype>, flow direction
Layout:       <frame layout L1–L14>, text anchor, type scale, art scale (close-up / mid / wide)
Transition:   <into this scene: slide | morph | glide | push-in | light wipe | type hand-off | breath cut>
Layers:       Primary <verb + carrier + ms> | Secondary <reaction> | Ambient <floats/glows>
Hue lead:     teal | gold | ember — why
Originality:  nearest refs + score (see originality-check.md)
```

---

## Worked examples
These concepts are not in the references. They show the method; don't treat them as new templates.

### A. "Cron jobs" (Catalyst Job Scheduling) — Type 1
- **Decompose:**
  - Subject: a scheduler.
  - Flow: time → jobs.
  - Change: jobs fire on a cadence.
  - Outcome: the work gets done, on time.
- **Metaphors:**
  - Literal: a clock face. This is weak in iso.
  - Physical: a carousel of bells (c3 d2 f3).
  - Abstract: **pulse-clock** (c3 d3 f3). Chosen.
- **Composition:** hub & ring. A low cylinder hub sits on the floor, with a ring of 8 short pillars on the grid around it.
- **Primary:** pillars fire in clockwise order every 500ms. Each one `rise`s 120px and dissolves. Every 4th pillar is gold and also sends a dot `shoot`ing outward to a small worker block.
- **Secondary:** the worker block ripples when a dot arrives (+150ms). The hub ripples once per full round, every 4s.
- **Ambient:** worker blocks float ±6px on 4.0 / 5.5 / 3.5s periods; two glows breathe.
- **Why it's new:** the radial sequence and the fixed cadence don't exist anywhere in the references.

### B. "Vector search" — Type 1 → Type 2
- **Decompose:**
  - Subject: an index of embeddings.
  - Flow: a query into the index.
  - Change: the nearest neighbours are found.
  - Outcome: ranked results.
- **Composition:** field. There are 9×9 low cells on the floor, and a query dot hovers above them.
- **Type 1 beat (2.5s):**
  - A scan line sweeps the field (1.2s).
  - As it passes, 5 cells light up and *stay* lit at 0.6.
  - Short traces draw from those cells up to the query dot (300ms each, 80ms stagger). They are the "neighbours".
- **Type 2 beat (2s):**
  - A search pill takes the frame and the query types on.
  - Three result rows build with anchor → extend. Each one has a relevance bar wiping to a different length.
  - The top result gets the 5% overshoot.

### C. "Rate limiting" — Type 1
- **Decompose:**
  - Subject: an API.
  - Flow: requests.
  - Change: excess is held back.
  - Outcome: a stable service.
- **Composition:** gate. A lane runs left-low → right-high, with a thin frame halfway along it.
- **Primary:**
  - Dots arrive in an accelerating burst of 6 at 80ms.
  - The first 3 pass.
  - The 4th to 6th slow to a stop at the gate (ease to rest, 300ms) and dim to 0.3.
  - They are released one by one on the 500ms beat.
- **Secondary:** the gate face flashes on each release, and the server block past the gate floats calmly the whole time. That calm is the outcome.
