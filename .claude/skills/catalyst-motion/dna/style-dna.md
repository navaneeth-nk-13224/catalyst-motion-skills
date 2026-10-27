# Catalyst style DNA — the invariants

These are what make a frame read as Catalyst. Keep **all** of them, whatever the concept. Everything not
listed here is free to change (see "Free variables" at the end).

## 1. World
- **Pure black void (`#000`).** Objects never sit on a scene or horizon. At most there is a faint isometric floor grid that fades out at the edges.
- **The view fits the idea — isometric is a choice, not the default (user rule).** Pick the view per scene (see §1a).
  Whatever the view: no perspective, no camera FOV, no free 3D rotation.

### 1a. Views (pick one per scene; switch when the idea changes)
| View | Use it for | Light travels |
|---|---|---|
| **Isometric** (30° left-up, 30° right-up, vertical) | Spatial ideas: parts of a system connecting, data moving between services, replication and scale, a "world" | Along iso axes |
| **Flat, front-on** | Code, UI, type, numbers, a single object or icon, cards, charts — anything read rather than explored | Horizontal / vertical |
| **Plan / diagram** (top-down, flat) | Time and order: schedules, timelines, sequences, maps, calendars | Horizontal / vertical |
| **Macro** (flat close-up, one object fills the frame) | A detail, a state change, the signature moment | Horizontal / vertical |
- **Isometric only when depth carries meaning.** Ask: "would a flat view say this as clearly?" If yes, go flat.
- **Text, code and UI stay flat.** Never skew them onto an iso plane, except one deliberate L10 window-in-world per film.
- **Per film:** isometric in **at most half** of the scenes, and **at least 2 non-iso scenes**. The storyboard names each scene's VIEW and why.
- **Switching views** happens on a cut or as a deliberate morph (e.g. flat type tilting into iso), never mid-hold.
- **Every other invariant holds in every view:** `#000` void, matte dark solids, 1px edge light, light as the only colour, right-angle turns.
- **Matte, dark solids.** Faces are `#0D0D0D`–`#181818` with 1px edge strokes in `#252525`–`#303030`.
  - Form comes from the *edges*, not from shading.
- **Light is the only color.** The accent gradient `#7DF4FF → #FFFD99 → #FF4646` lives only on:
  - light carriers: pillars, dots, traces, glows
  - one face highlight per hero
  - 1–3 headline words

## 2. Physics of the style
| Invariant | Meaning | Why it reads as Catalyst |
|---|---|---|
| **Matter is calm, energy is busy** | Solids only float or glide: small amplitude, slow, sine. Everything fast is light. | The "living infrastructure" feeling |
| **Motion follows the grid** | Every travel vector is parallel to an axis of the scene's view (iso axes in iso; horizontal/vertical in flat views). A path turns only at right-angle corners. | Engineered, circuit-like precision |
| **Light has a life cycle** | Born (scale or draw from 0), then travels, then *dissolves* (opacity → 0). It never pops off. | Soft, premium, never glitchy |
| **Color never animates** | Only geometry and opacity change. Brightness = opacity. | Calm; the gradient stays sacred |
| **Polyrhythm, not sync** | Loops have incommensurate periods (e.g. 4.0 / 5.5 / 3.5s). Starts are spaced on a ~500ms beat grid. | Never visibly repeats, never mechanical |
| **Sparse concurrency** | 2–4 light events visible at once, plus at least one float always running | Alive but quiet |
| **Small overshoot only** | ≤5% on UI, ≤20% on tiny dots. Zero on solids. | Restraint |

## 3. Shared timing tokens (reconciled with LottieFiles · Premium)
| Token | Value | Use |
|---|---|---|
| `signature` | `cubic-bezier(0.4, 0, 0.2, 1)` | 80% of motion; on-screen moves |
| `enter` | `cubic-bezier(0, 0, 0.2, 1)` | Arrivals and assembly |
| `exit` | `cubic-bezier(0.4, 0, 1, 1)` | Departures. These run 30–50% shorter than the entrance. |
| `rise` | `cubic-bezier(0, 0, 0.285, 1.005)` | Light born and rising (pillar, spark) |
| `shoot` | `cubic-bezier(0, 0, 0.14, 1)` | Fast light along an axis |
| `glide` | `cubic-bezier(0.77, 0, 0.175, 1)` | Heavy solids repositioning |
| `float` | sine in-out | Idle bobbing and breathing |
| Durations | 350 / 500 / 800ms, plus 1.2–1.5s for dramatic reveals | Lottie Premium palette |
| Beats | 33–50ms (micro) · 80–100ms (items) · 300ms (rows) · 500ms (scene events) | Stagger grid; total stagger < 500ms per group |

> **Reference vs authority:** the SVGs move data packets **linearly**. The LottieFiles skill forbids linear
> spatial motion, so packets use `signature` on each segment, with corners as intermediate keyframes.
> Keep the *look* of constant flow by chaining segments with no pause between them.

## 4. Free variables — change these freely
- **What the objects are:**
  - any solid that reads in iso: slab, tower, cylinder, ring, prism, stair, frame, lattice, sphere-as-disc
  - any UI: cards, terminals, graphs, chats, forms, timelines
- **Composition and layout.** See `create/composition-library.md`.
- **Which carriers of light are used,** and how many: pillars, dots, traces, ripples, scan lines, beams, particles, glow fields.
- **The primary verb.** Anything in `create/verb-library.md`, or a new verb that obeys §2.
- **Gradient placement and dominant hue.** Teal-led for calm or data, gold-led for build or AI, ember-led for action or alert. The gradient itself stays the same.
- **Scene tempo:** loop 4–12s, or a linear film beat of 1.5–4s.
- **Camera:**
  - Within a scene: static, a slow pan of at most 60px along an iso axis, or a slow scale of 100 → 104%.
  - During a transition: larger pans and push-ins are allowed (see `create/frame-layouts.md`).
  - The camera never rotates and never uses perspective.
- **Screen layout:** where the type sits, how big it is, and how much of the frame the art fills. Choose it per scene from `create/frame-layouts.md`, and vary it across the film.
- **Scale of the world:** macro (a data center) or micro (one packet's journey).
