# Verb library — in-style motion beyond the references

The references use about 8 verbs: float, breathe, rise, shoot, travel, draw, stream and ripple. Concepts need more. Each verb
below is **built only from DNA-legal parts**:
- iso-axis travel
- light life cycle
- opacity-only brightness
- calm solids

Use them, or write new ones with the recipe at the bottom.

## Type 1 verbs (systems)
| Verb | Concept fits | Motion spec |
|---|---|---|
| **Converge** | aggregation, ingestion, events → one sink | 4–6 dots `shoot` along different iso axes into one node, 80ms apart. On the last arrival the node ripples (scale 0.8 → 1.4, opacity 1 → 0, 500ms). |
| **Fan-out** | broadcast, CDN, notifications, publish | 1 packet reaches a hub. After a 100ms hold, 3–5 copies leave along different axes at the same time, each fading at 70% of its path. |
| **Filter / gate** | auth, firewall, validation, rate limit | Dots travel toward a thin frame (ring or doorway solid). Most pass and continue. 1 in 3 dims to 0 at the gate (300ms `exit`). The gate face flashes opacity 0.3 → 0.6 → 0.3 on each pass. |
| **Sort / lane** | queues, routing, load balancing, priority | Mixed dots enter on one trace. At a junction each one takes one of 2–3 parallel lanes. Hue is assigned before the junction and never tweened. Lanes are offset on the iso axis. |
| **Stack / accrue** | storage growth, versions, logs, backups | Thin slabs `enter` onto a pile, 300ms apart, 40px drop. The pile itself stays still and only the newest slab floats. |
| **Replicate** | redundancy, multi-region, scaling | A ghost copy of a solid (outline only, opacity 0.4) slides 1 unit along an iso axis (`glide`, 800ms), then fills in. Repeat up to 3 copies. |
| **Scan** | search, indexing, ML inference, monitoring | A gradient line sweeps across a top face along one iso axis (1.2s, `signature`). Cells it passes light up to 0.5 and dissolve after 400ms. |
| **Pulse-clock** | cron, schedules, timers, heartbeats | A ring of 6–12 pillars around a hub fires *in sequence* on a fixed beat (500ms). Each pillar rises and dissolves. The hub ripples once per full round. |
| **Hand-off** | pipelines, CI/CD, workflows | A packet travels along a staircase of solids. At each solid it pauses 150ms while that solid's top face brightens, then moves on. |
| **Condense** | compression, caching, summarizing, AI answers | Many faint dots drift slowly toward a centre (2s, `float`), fade as they meet, and one bright dot is born at the centre (`rise`, 5% overshoot allowed on the dot). |
| **Bridge** | integration, connectors, APIs | A trace draws between two separated solids (500ms `enter`). A packet then crosses and both solids lift 6px in turn (secondary). |
| **Charge** | provisioning, warm-up, cold start, training | A vertical beam inside a translucent frame fills from bottom to top (scaleY, 1.2s, `signature`). At full height, the frame's edges brighten and the beam dissolves. |

## Type 2 verbs (UI)
| Verb | Concept fits | Motion spec |
|---|---|---|
| **Type-and-answer** | AI, search, CLI | Placeholder fades, the query types on (mask wipe), a 300ms pause, then the answer card rises 35px from below |
| **Fill the form** | onboarding, config, setup | Fields appear one row at a time with anchor → extend (label → field). Values type on into the first 1–2 fields only, then a toggle slides and the submit button breathes. |
| **Chart grows** | analytics, metrics, logs | Axes draw (350ms), bars scaleY from the baseline with a 50ms micro cascade, then one value label rises over the tallest bar |
| **Status ladder** | deploy, build, jobs | Rows appear at 80ms each, each with a spinner dot. Ticks replace the dots, 66ms after each row settles. The final row resolves with a 5% overshoot. |
| **Graph wires up** | relations, workflows, Circuits | Nodes pop (scale 0 → 1, under 24px), then edges draw node to node (300ms each, macro beat), and a highlight dot runs the finished path once |
| **Card shuffle** | lists, kanban, prioritization | A card lifts 4px, glides to its new slot (`glide`, 500ms) while the others close the gap (100ms delay) |

## Recipe: inventing a new verb
1. **Name the change** in the concept as a plain verb: merge, wait, approve, expire, learn…
2. **Pick the carrier**:
   - something that moves → dot or packet
   - something that connects → trace
   - something that happens at a place → ripple or face highlight
   - something that grows → beam, stack or bar
3. **Constrain it to the DNA**:
   - It travels along iso axes.
   - Light is born, then travels, then dissolves.
   - Only opacity carries brightness.
   - Solids move less than light.
4. **Give it a beat.** Set the event length (350–1500ms), the stagger (micro or macro) and the rest gap.
5. **Add a reaction.** Say what responds at the destination 100–300ms later.
6. **Test it without labels:** the motion alone should suggest the concept to someone who knows the domain.
7. Add it to this table once it works.
