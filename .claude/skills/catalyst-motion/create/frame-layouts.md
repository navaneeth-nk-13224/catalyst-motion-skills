# Frame layouts — how text and art share the screen

**View first (user rule):** each scene picks its view (isometric · flat · plan · macro, `dna/style-dna.md` §1a) before its layout. Most layouts work in any view; iso ≤ half the scenes of a film.

`composition-library.md` arranges objects *inside* the isometric world. This file is about the
**screen**: where type sits, how large it is, how much of the frame the art takes, and how scenes hand over.

> **Anti-pattern: the PPT film.** Every scene is "text left, art right" with a slide transition. Each frame
> looks fine and the film reads as a deck. One split per film is enough.

## Layout library
`T` = type, `A` = art, `·` = void.

| # | Layout | Thumbnail | Use for | Notes |
|---|---|---|---|---|
| L1 | **Split** | `[T T │ A A]` | One explanatory beat | The website banner layout. **Max 1 per film.** |
| L2 | **Mirror split** | `[A A │ T T]` | Answering or contrasting the previous split | Flow should point *toward* the text |
| L3 | **Centre stage** | `[· A(T)A ·]` | Hooks, claims, CTAs | Art fills the frame behind. A radial black vignette (0.85 → 0) keeps the type readable. |
| L4 | **Type as stage** | `[ T T T T ]` + art on the baseline | Big statements: 2–5 words | Headline 160–240px. The art sits on, under or between the letters: a trace runs along the baseline, a pillar rises between words. |
| L5 | **Headline over panorama** | top `[ T ]` / bottom `[A A A A]` | Pipelines, timelines, wide systems | Wide iso world across the full width, type in the top 30%. Pans well. |
| L6 | **Lower third** | `[A A A A]` + small `T` bottom-left | Letting a system breathe | Art at 80–100% of the frame. Text 36–48px. Cinematic. |
| L7 | **No type** | `[A A A A]` | A pause, a transition, a VO-only beat | The VO carries the meaning. 1.5–3s. It resets the viewer's attention. |
| L8 | **Diagonal** | `T` top-left ↘ `A` ↗ `T` bottom-right | Flows with a clear start and end | Art runs along the iso diagonal. The eyebrow is in one corner, the headline in the opposite one. |
| L9 | **Annotated world** | `A` centre, callouts around | Lists of parts (components, features) | The copy is split into 3–6 leader-line callouts. There is no headline block; the list *is* the art's labels. |
| L10 | **Window in world** | Type 2 UI set *into* the iso scene | Merging a proof with a system | The UI card sits on an iso plane (CSS `matrix()` with the projection) or floats in front of the world. Only 1 per scene, with strings ≥ 28px effective. |
| L11 | **Triptych / grid** | `[A│A│A]` with labels | Three parallel ideas | Three small iso vignettes, each with its own verb, and stagger between panels (macro beat). Each panel stays minimal. |
| L12 | **Big number** | `[ ₹0.00 ]` | Prices, stats, speed, scale | A huge numeral (200–320px) in the centre, with sparse art around it reacting to it |
| L13 | **Close-up** | One element fills 70% of the frame | Detail, the moment of change | The camera is "inside" the system: one block, one gate, one packet, scaled up |
| L14 | **Focus pull** | Art blurred behind, sharp UI or type in front | A Type 2 beat over a Type 1 world | Use a static depth blur at the cut only, never animated blur. The Type 1 ambience behind is at ≤ 45%. |

## Layout rhythm (film-level rules)
1. **Never use the same layout twice in a row.** L1 + L2 count as the same family.
2. **Use split layouts (L1, L2) for at most 1 in 4 scenes.**
3. **Vary the type scale.** Each film has at least one **giant-type** scene (L4 or L12, ≥ 160px) and at least one **quiet** scene (L6 or L7, small or no type).
4. **Move the anchor.** The text position moves between scenes: left → centre → top → corner → bottom. Plan it as a path the eye follows, so the next scene's text is near where the last scene's motion ended.
5. **Vary the art scale.** Use at least one wide shot (L5, L6) and one close-up (L13) per film. The 55–65% mid shot is not the default.
6. **Alternate density.** Busy, then airy, then busy. A scene with 8 components needs a calm scene after it.
7. **Let the Type 2 frame vary too.** Use:
   - a centred window (L3 variant)
   - a window in the world (L10)
   - a focus pull (L14)
   - a full-frame UI close-up, where the window fills 80% and the camera is "on the screen"

   Don't always use "UI card at the right".

## Transitions (beyond the slide)
The LottieFiles page transition (exit left 300ms ease-in → enter from the right 400ms ease-out, 100ms later) is the
**baseline**. Use it on at most every other cut. The rest should carry something across the cut:

| Transition | How | Lottie basis |
|---|---|---|
| **Shared-element morph** | An object from scene A becomes an object in scene B, e.g. the hub cylinder becomes the Data Store. It moves and scales over 400–600ms, ease-in-out, while the rest exits. | "Shared elements morph (400ms, ease-in-out)" |
| **Camera glide** | Both scenes live in one large iso world. The camera pans along an iso axis (800–1200ms, `glide`), so the next scene is already there. | On-screen motion = ease-in-out |
| **Push-in** | The camera scales into one element (100 → 300%+, 600–800ms, ease-in, under 0 → 1 opacity of the next scene). The next scene is "inside" it. | Dramatic reveal 600–1200ms |
| **Light wipe** | A trace draws across the frame along an iso axis (500ms). The new scene is revealed behind its head (mask). | Line-draw + entrance |
| **Type hand-off** | The last word of scene A stays and becomes the first word or number of scene B, and everything else changes around it | Shared element |
| **Breath cut** | A plain cut to black void for 200–300ms, then the next scene emerges (97 → 100%). Use it for tonal shifts. | Emergent entrance |

The camera rules in `dna/style-dna.md` (no rotation, no perspective) still apply during transitions. Only
**scale and pan** may exceed the in-scene limits, and only while the transition runs.

## Text ↔ art integration (make them one picture)
- **Underline of light:** a trace draws under the gradient words, then its packet runs off the baseline into the art.
- **Shared axis:** align the text block's edge to an iso grid line, so the type looks like it is sitting *in* the world.
- **Art reacts to type:** when the headline lands, the nearest solid ripples or a pillar rises (secondary layer, +100–300ms).
- **Occlusion:** a solid or glow may pass *behind* a headline. Nothing ever passes in front of text.
- **Contrast floor:** text sits on ≥ 85% black. Use a vignette or a local radial mask, never a box behind the type.
- **Safe area:** keep 96–120px margins. Giant type may bleed to the edges only in L4.
- **Spacing and type come from the kit** (`SPACE`, `TYPE`, `Stack` in `catalyst-film/template/KIT.md`): consistent sizes and gaps, so the variety comes from layout, scale and view, never from random font sizes.
- **Clear space (user rule):** text never touches or overlaps art. Keep ≥ 56px between any text and the real outline of a solid (all faces, including side/depth faces), a cable/trace/thread, a glow body or a UI card; ≥ 40px between separate text blocks; small labels (≤ 20px) ≥ 40px. Measure from the projected outline, never from an anchor point. If it doesn't fit, move the label to open space, put it inside the card it describes, or cut it.

## Choosing a layout for a beat
| Beat | Good layouts |
|---|---|
| Hook / claim | L3, L4, L8 |
| System explanation (Type 1) | L5, L6, L9, L13 |
| UI proof (Type 2) | L10, L14, full-frame UI, L2 |
| List of parts | L9, L11 |
| Price / stat | L12 |
| Pause or breath | L7, L6 |
| CTA | L3, L4 |
