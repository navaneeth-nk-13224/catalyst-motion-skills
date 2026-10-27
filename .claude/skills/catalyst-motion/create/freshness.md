# Freshness — don't repeat yourself

`originality-check.md` keeps us from copying the 15 reference SVGs. This file keeps us from **copying our own
films**. A style becomes a template the moment its favourite moves show up in every film. Same DNA, new
vocabulary, every time.

> **Fresh is not enough — it must be relevant.** Every new primitive must pass `relevance.md` (the 2-second test). New-but-generic, like stacked slabs as "a bucket", fails.

## 1. The ledger gate (run at storyboard time)
Every finished film is logged in [`../ledger.md`](../ledger.md) under three headings: UI pattern, Type 1 primitives and signature moment.
1. **Benched motifs.** A motif used in **either of the last 2 films** may not be the *hero* of a scene. It can still appear briefly as a supporting element.
2. **Retired motifs.** A motif used in **3 or more films** is retired from hero use until 3 films pass without it. The ledger marks these.
3. **New vocabulary.** Every film introduces **at least 2 new Type 1 primitives** (geometry never drawn before) and **at least 1 new Type 2 pattern**.
4. **Signature moment.** Every film has one image that could not appear in any other film, because it comes only from *this* product's metaphor.
   - Slate 30s: the clean-slate wipe that erases an invoice.
   - AppSail: the terminal shrinking into the block it deployed.
   - Name it in the brief.
5. **After render,** append the film's motifs to the ledger. A film isn't done until its ledger entry exists.

## 2. Type 2 — UI moments without the agent-terminal cliché
**Currently retired as a hero:** the agent window with a row of tool tabs, a typed prompt, a 3-row ✓ ladder and a "Live / ready" chip with a 5% overshoot. Used in CloudScale 2, Slate 30s and AppSail.

Build each Type 2 beat by picking **one option from each column**. The combination must not appear in the ledger.

| Surface | Framing | Interaction | Outcome device |
|---|---|---|---|
| Browser preview of the user's *actual app* appearing | Flat window | Cursor path (eased, with click ripples) | The app itself working (a page renders, a form submits) |
| IDE side panel / file tree | **Window in world** (iso plane) | Drag and drop | A toast stack arriving |
| Code diff: lines added and removed | **Cropped close-up**: one field or one line fills the frame | Scroll (eased, momentum feel) | A number that changes |
| Dashboard / metrics tiles | **Exploded UI**: the interface split into iso layers (chrome, panels, content) that separate and re-stack | Toggle or switch | A map or region lighting up |
| Request ↔ response pair (API) | **Floating fragments**: 3–5 UI shards in space, not a whole window | Hover reveal | A before/after slider |
| Phone / notification preview | Split screen, before vs after | Select / multi-select | A state badge **without** a check icon |
| Schema / table editor | A UI that **becomes** Type 1 (a card folds into an iso block) | Typing (max once per film) | Someone else receiving it (an email, a push) |
| Timeline / logs streaming | Over-the-shoulder: UI on a device in the world | Pinch / zoom into a detail | A link or URL resolving into the page |
| Kanban / list, calendar, PR / commit | Picture-in-picture | Paste / drop a file | Silence: the UI just holds, and the next scene is the outcome |

**Rules:**
- **The agent prompt appears at most once per film,** and it is re-imagined each time: a voice waveform, a single floating line in the void, a sticky note on a world surface, a cursor writing into the world itself. It is never the same window twice.
- **Show the outcome, not the process.** Prefer the user's app *working* over a log saying it worked. A ✓ ladder can be used in at most one film in three.
- **Vary success language.** Rotate through: the app renders, a number settles, a region lights up, a person receives something, a sound plus a held frame. A green check is one option, not the default.
- **Real names, varied presentation.** Agent and framework names can be shown as logos-free word marks, a typed list, a spoken-and-lit sequence, a carousel, chips orbiting a ring. Don't use a tab row twice running.
- **Monospace terminals at most one film in three.**

## 3. Type 1 — new vocabulary, same DNA
**Overused kit (benched as heroes):** `IsoBox` slabs and cubes, `IsoCylinder` "data stores", `Packet` dots on `Trace` lines, ripples, the floor grid of tiles, and the teal + ember glow pair placed left and right.

**Primitive library.** Build what the metaphor needs. Each primitive stays DNA-legal: isometric, dark faces, edge-lit, light as the only colour.

| Family | Primitives to draw (new code each time) | Good for |
|---|---|---|
| Rings and orbits | Iso circles, concentric rings, orbiting satellites, a torus as stacked ellipses | Cycles, schedulers, global reach, AI |
| Steps and terraces | Stairs, ziggurats, stepped plateaus | Growth, tiers, plans, migration paths |
| Frames and scaffolds | Wireframe-only solids, lattice towers, scaffolding that fills in | Building, provisioning, "before it exists" |
| Glass | Translucent panes (faces at 0.15–0.3 opacity), stacked glass layers, light passing through | UI layers, security, transparency, previews |
| Surfaces | A height-field grid that swells into a wave, a liquid level rising in a vessel, a terrain | Traffic, load, tides, usage |
| Iso type | Extruded 3D letters and numerals on the grid, a word built as architecture | Brand moments, prices, big claims |
| Icons as architecture | A lock, an envelope, a bell, a gear built as iso solids | Auth, mail, push, settings (instead of labelled boxes) |
| Particles | Dust fields, sparks along an iso axis, swarms that condense and disperse | AI, data, events |
| Beams and ribbons | Wide light ribbons folding at right angles, scan planes sweeping a volume | Pipelines, deploys, search |
| Shadows and silhouettes | A solid known only by its lit edges, a hero revealed by light | Teasers, reveals |

**Rules:**
- **At least 2 new primitives per film,** logged in the ledger. If the art could be built entirely from the shared kit, it isn't fresh enough.
- **The hero's silhouette must differ from the last 2 films' heroes.** For example: platform with blocks (CloudScale 2, AppSail), then a tile field (Slate), so next try a ring, a tower, a terrace or 3D type.
- **Rotate the light carrier.** If the last film's main carrier was packets on traces, this film's is something else: a ribbon, a swelling surface, an orbit, a scan plane, liquid fill or sparks.
- **Rotate materials.** Each film leads with one: wireframe, glass, dot-matrix, solid dark, or silhouette. Don't lead with solid dark twice in a row.
- **Rotate the glows.** Glows don't have to be teal left and ember right. Use one glow, a glow under the hero, a glow that travels with the flow, or a gold-led glow.
- **Labels can't be the only way to explain.** If a block needs the label "AUTH" to be understood, draw the idea instead: a lock-shaped solid, a gate, a key.
- **Retire the grid tile floor as a hero.** The floor can be absent, a single line, a horizon of dots, or a terrain.

## 4. Freshness check (add to the brief)
```
Benched (last 2 films)  : <motifs from ledger>
New primitives (≥2)     : <names>
New Type 2 pattern (≥1) : <surface × framing × interaction × outcome>
Hero silhouette         : <shape>  — differs from <last two heroes>
Main light carrier      : <carrier> — last film used <carrier>
Lead material           : <material>
Signature moment        : <the one image only this film could have>
Relevance (2-sec test)  : scene → hero object → what a viewer would name it (no labels)
```
