# Type 1 grammar — ambient isometric systems (important features)

**Idea:** show a capability as a *system*: solid infrastructure with energy moving through it in a way
that explains what the feature does. It's a diagram that breathes.

## 1. Sentence structure
A Type 1 scene is a sentence: **[solids] + [carrier of light] + [verb] + [rhythm]**.

| Slot | Choose | Rules |
|---|---|---|
| **Solids** | 1 hero, plus 0–6 satellites | The hero is the biggest and is never cropped. Satellites are ≤ 40% of the hero's size. Everything sits on iso coordinates. |
| **Carrier** | pillar · dot · packet · trace · ripple · scan · beam · glow field | Use 1 primary carrier. Add 1–2 secondary carriers only if they mean something different. |
| **Verb** | From `create/verb-library.md` | One primary verb per scene. Secondary verbs react to it. |
| **Rhythm** | loop period + beat offsets | Use incommensurate periods. Events land on the 500ms grid. Never more than 4 events at once. |

## 2. Layer roles (map to the LottieFiles three layers)
| Layer | Type 1 meaning | Amplitude | Tempo |
|---|---|---|---|
| **Primary** | The feature's verb, e.g. data being sorted, deployed or replicated | Largest light travel (100–430px) | 500–1500ms per event |
| **Secondary** | Reaction: ripples on arrival, a face highlight, a satellite lifting | 10–30% of primary | 100–300ms after the primary lands |
| **Ambient** | Floats (solids ±5–12px), breathing glows (opacity 0.85–1 or 0 → 0.3–0.7), stray pillars | 10–20% of primary | 3.5–6s sines |

## 3. Narrative arc
Applies to a linear film beat; a loop repeats the action and reaction.

1. **Setup** (0–500ms):
   - The grid and glows fade up.
   - Solids assemble: 40px rise and fade, `enter`, 800ms, ~100ms stagger.
   - **Spatial origin is consistent:** everything enters from the same side or depth.
2. **Action** (from about 500ms): the primary verb runs once, clearly, at full amplitude.
3. **Reaction** (+100–300ms): secondary layer responds where the energy arrives.
4. **Resolution:** floats settle in over 500ms (multiply the sine by an ease-in ramp so nothing jumps). Ambient light keeps going.

## 4. Writing new Type 1 motion (generative rules)
> **Freshness first:** the shared kit (boxes, cylinders, packets on traces, ripples, tile floor, the left/right glow pair) is a starting point, not the vocabulary. Each film draws at least 2 new primitives. See `create/freshness.md` §3.

- **Make the data flow true to the concept.**
  - Energy must go from where the concept says input comes from to where the output goes.
  - If the concept has no flow (e.g. "security"), give it one: threat → gate → filtered.
- **One idea per carrier.**
  - If two things in the concept differ, they get different carriers or hues. Example: requests = dots, responses = traces.
  - If they are the same kind of thing, they share a carrier.
- **Hierarchy of motion = hierarchy of meaning.**
  - The most important change gets the biggest light travel.
  - Solids never out-move the light.
- **Imply scale with repetition.** Use 3–7 copies of one carrier, offset on the beat grid. Never use one huge object.
- **Silence is part of the rhythm.** Leave 300–800ms gaps between primary events in a loop.

## 5. Forbidden in Type 1
- Rotating solids in 3D, perspective, camera spins
- Color tweening; gradient fills that move across faces
- Fast solids (anything with a face moving faster than ~120px/s)
- Bounce or overshoot on solids
- Long text *inside* the isometric world. Labels are leader-line callouts (uppercase, `#A3A3A3`, 600 weight). The exceptions are one Type 2 UI plane set into the world (layout L10) and giant type that the art sits on (layout L4). See `create/frame-layouts.md`.
- More than one hero
