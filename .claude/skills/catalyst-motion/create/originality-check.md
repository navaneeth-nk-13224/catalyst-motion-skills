# Originality gate

Run this **before building** any scene. It is meant to stop "almost the same as the reference" work.

## Hard rules
1. **Never import, trace, re-time or re-colour a reference SVG.** All art is drawn fresh in code.
2. **Never copy a reference timeline.** That means the same set of elements firing in the same order at the same offsets.
3. **Never use a reference's object set.** "4 iso blocks + 10 pillars + 2 glow rays + 4 shooters" belongs to `home-new__catalyst-header-lines`. Don't rebuild it.
4. Within one film, **don't use the same composition archetype twice**, except for a reprise at ≤ 40% opacity.

## Distance score
Find the 2 nearest references (`study/reference-study.md`). For each one, mark which of these axes your scene
**differs** on:

| Axis | Differs if… |
|---|---|
| **Composition** | It uses a different archetype from `composition-library.md` |
| **Primary verb** | A different verb carries the main idea |
| **Carrier** | A different main carrier of light, or a different combination of carriers |
| **Path topology** | Light takes a different route: radial vs linear vs branching vs looping |
| **Silhouette** | At a glance, its outline as a black shape at 10% size is different |
| **Rhythm** | A different cadence shape: burst, sequence, steady stream or call-and-response |

- **Pass:** differs on **at least 4 of 6** from *each* of the 2 nearest references.
- **Fail:** change the composition first, then the verb, then the carrier. Re-score.

## Self-repetition gate
References aren't the only thing to avoid copying. Run `freshness.md` §1 against `../ledger.md`. A scene that only reuses motifs from our last two films fails, just as a traced reference would.

## Film-level layout check (anti-PPT)
Run this once the beats are laid out:
- [ ] No frame layout is used twice in a row. Split layouts (L1/L2) are used in at most 1 of every 4 scenes.
- [ ] At least one giant-type scene (L4/L12) and one quiet scene (L6/L7)
- [ ] The text anchor moves between scenes (left / centre / top / corner / bottom)
- [ ] There is at least one wide shot and one close-up
- [ ] At most every other cut is the plain slide transition. The others carry something across (morph, glide, push-in, light wipe, type hand-off).
- [ ] **Thumbnail test:** at 10% size, the scene thumbnails in a row don't look like slides from one template

## Style-fidelity check (the other side)
Originality must not drift off-brand. All of these must stay **yes**:
- [ ] Black void with true isometric projection; dark matte solids with 1px edges
- [ ] Light is the only colour; the gradient is untouched; only opacity carries brightness
- [ ] Solids calm, light busy; travel follows iso axes
- [ ] Light born → travels → dissolves
- [ ] Polyrhythmic ambience, 2–4 concurrent light events
- [ ] Lottie Premium timing and easing, three layers, 1/3 rules

**Self-test:** blur your eyes on a still frame. It should read as Catalyst, and it should *not* read as any single reference.
