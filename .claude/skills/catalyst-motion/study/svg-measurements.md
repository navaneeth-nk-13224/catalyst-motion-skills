# Catalyst — Motion Guidelines (reference measurements · archive)

> **For creating new motion, use the skill `.claude/skills/catalyst-motion/`.** This file records what the
> reference SVGs *do*, as measured. Treat it as evidence for the skill's rules, not as choreography to reproduce.

Derived from the 15 animated SVGs in `References/animated-svg/` (all exported from SVGator).
For colors, gradients and type, see `dna/visual-aesthetics.md`.

There are **two motion families**:

| | **Type 1 — Ambient infrastructure** | **Type 2 — UI build-up** |
|---|---|---|
| Files | 13 isometric gradient scenes (product banners, Signals/Slate tabs, home header lines) | `ask-anything 2nd type`, `profile-collections 2nd type` |
| Feels like | A living system: light and data flowing through still hardware | A product assembling itself, then resting |
| Structure | Continuous, overlapping, always something moving | Staggered build in the first ~2s, then a long hold |
| Main properties | translate (floats, travel), opacity, stroke-draw, motion paths | scale pops, scaleX wipes, short rises, opacity |
| Loop | 4–12s, seamless | 6–7s, restarts from empty |

---

## 0. Shared foundations

**Technique (both types)**
- CSS `@keyframes` on nested wrapper `<g>`s, one property per wrapper: `_to` = translate, `_ts` = scale, `_tr` = rotate, `_c_o` = opacity, `__do` = stroke-dashoffset, `__p` = offset-path.
- `animation: <name> <dur>ms linear infinite normal forwards`. Easing is set **per keyframe** with `animation-timing-function`, so a single track can mix eases.
- Every element in a file shares the **same loop duration**; timing is expressed as % of that loop.
- Transforms pivot at the element's own center (translate-to-origin → scale/rotate → translate back).

**Easing tokens**

| Token | Curve | Character | Use |
|---|---|---|---|
| `ease-float` | `cubic-bezier(0.42, 0, 0.58, 1)` | standard in-out | Bobbing, pops, breathing glows — **the default** (most used) |
| `ease-rise` | `cubic-bezier(0, 0, 0.285, 1.005)` | fast start, long glide | Light pillars, particles appearing |
| `ease-shoot` | `cubic-bezier(0, 0, 0.14, 1)` | expo-out | Dots shooting along iso axes |
| `ease-wipe` | `cubic-bezier(0.39, 0.575, 0.565, 1)` | sine-out | Skeleton bar wipes (scaleX) |
| `ease-enter` | `cubic-bezier(0.215, 0.61, 0.355, 1)` | cubic-out | Cards rising in |
| `ease-arrive` | `cubic-bezier(0.165, 0.84, 0.44, 1)` | quart-out | Window/panel entrance |
| `ease-turn` | `cubic-bezier(0.645, 0.045, 0.355, 1)` | cubic in-out | Icon rotation steps |
| `ease-slide` | `cubic-bezier(0.77, 0, 0.175, 1)` | quart in-out | Heavy blocks gliding (Slate) |
| `ease-snap` | `cubic-bezier(0.735, -0.02, 0.24, 0.995)` | expo in-out | Data blocks sliding into slots (NoSQL) |
| `linear` | — | constant | Data packets travelling along lines (Signals) |

**Universal rules**
- Loops are seamless: first and last keyframes match, or the element is invisible at both ends.
- Gradients and colors are **never animated** — only geometry and opacity.
- No bounce beyond a single small overshoot (max 1.2 on tiny dots, 1.02–1.05 on UI pieces).
- No blur-in, no color shifts, no 3D rotation.

---

## 1. Type 1 — Ambient infrastructure (gradient isometric scenes)

### 1.1 Character
Hardware stays calm; **energy is shown as light**. A Type 1 scene is never "done": at any frame something is rising, travelling or breathing, but nothing demands attention.

### 1.2 Layers of motion (build a scene from these)

| Layer | What moves | Motion | Typical values |
|---|---|---|---|
| **A. Float** | Hero block, satellites, floating icons | translateY yoyo (start = end) | ±5–12px over half-loop each way, `ease-float`; hero block may also drift 15–27px on the iso diagonal |
| **B. Breathe** | Diagonal glow rays, ambient glows | scale 0→1→0 or opacity 0→0.3–0.7→0 | full loop, `ease-float` |
| **C. Light pillars** | 0.5px vertical lines with dot heads | scale 0→1 (≈1s) while rising 130–330px, fade out at the end | `ease-rise`; start opacity 0.69 → 1 → 0 |
| **D. Shooters** | 1.4–1.7px dots | translate 300–430px along an iso axis, fade in ~30%, out ~60% of loop | `ease-shoot` |
| **E. Data travel** | Packets/chips along circuit lines | translate 70–430px **linear**, or `offset-path` motion | Signals, Stratus |
| **F. Line draw** | Circuit traces, connectors | `stroke-dashoffset` from dash length → 0 | Stratus (83 tracks), Slate bluting |
| **G. Streams** | Repeated items on one path | same translate, staggered at 0 / 35 / 72.5% of loop | AppSail (4s conveyor) |
| **H. Ripples** | Rings on nodes | scale 0.8 → 1.37 / 1.7 with opacity 1 → 0 | Stratus, 100–400ms blips |

### 1.3 Timing pattern
- **Loop:** 4–12s. Short (4–6s) for simple hero loops; long (10–12s) for complex system scenes.
- **Stagger:** start times are spaced in **~500ms beats** (0 / 0.5 / 1.0 / 1.3 / 1.5 / 2.0s …), so pillars and shooters never fire together.
- **Active span:** most tracks are active 1–4s; floats span the whole loop.
- **Density:** 2–4 light events visible at any moment; at least one float always running.

### 1.4 Per-file reference

| File | Loop | What it does | Signature |
|---|---|---|---|
| `home-new__catalyst-header-lines` | 6s | 4 iso blocks bob ±12px; 10 light pillars rise; 2 diagonal glow rays breathe; 4 dots shoot along iso axes | Layers A, B, C, D |
| `appsail__appsail-banner` | 4s | Containers stream along a track (3 copies at 0/35/72.5%); particles rise 130px and fade | Layer G |
| `cloudscale__banner-hero` | 12s | 8 gentle 5–7px floats; elements fade in on 500ms beats | Slow A + opacity |
| `nosql__nosql-banner` | 5s | Data blocks slide 80–214px into place with expo in-out, fade in | `ease-snap` |
| `quickml__quickml-banner` | 4.9s | 21–37px nudges; 10 soft glows pulse to 0.3 opacity on 300ms beats | Layer B as pulse |
| `signal__zwc-banner` | 7s | Signals travel 70–410px **linearly**, launched at 2.8 / 3.2 / 3.7 / 5.8s | Layer E |
| `signal__zwc-tab-1` | 7.4s | Linear travels of 30–295px; bursts at 1.4–1.6s and 5s | Layer E |
| `signal__zwc-tab-3` | 8s | Sequential reveals: each element 0.4–1.8s, starting 0.3s → 6.2s | Narrative sequence |
| `signal__zwc-tab-4` | 11s | Long linear journeys of 110–429px | Layer E (slow) |
| `slate__zwc-banner` | 8s | Heavy quart in-out glides of 6–40px over 4s; one 1.06 scale pulse | `ease-slide` |
| `slate__zwc-bluting` | 10.3s | 40px rises over 4s; connector lines draw on | Layers A, F |
| `smartbrowz__smartbrowz-banner` | 6.1s | 50px floats spanning the loop; glows pulse 0.21↔0.4 | A + B |
| `stratus__stratus-banner` | 12s | Particles on 16 motion paths; 83 dash-draw tracks; node ripples to 1.7× | Layers E, F, H |

### 1.5 Type 1 recipe

```css
/* Float — hero object */
@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(12px) } }
.block { animation: float 6s cubic-bezier(.42,0,.58,1) infinite; }

/* Light pillar — rise, then fade */
@keyframes pillar {
  0%   { transform: translateY(0) scaleY(0); opacity: .69 }
  16%  { transform: translateY(-40px) scaleY(1); opacity: 1 }
  25%  { opacity: 1 }
  42%  { transform: translateY(-146px) scaleY(1); opacity: 0 }
  100% { transform: translateY(-146px); opacity: 0 }
}
.pillar { transform-origin: bottom; animation: pillar 6s cubic-bezier(0,0,.285,1.005) infinite; }
.pillar:nth-child(2) { animation-delay: -.5s } /* 500ms beats */
```

---

## 2. Type 2 — UI build-up (product vignettes)

### 2.1 Character
**Assemble → hold → restart.** The interface constructs itself piece by piece like a fast-loading app, then holds still for most of the loop so people can read it. It feels responsive and crafted, not decorative.

### 2.2 Timeline anatomy

| Phase | Share of loop | What happens |
|---|---|---|
| Enter | 0–12% | Container appears (window slides up / pill already present) |
| Build | 0–35% | Children stagger in: pops, wipes, rises |
| Hold | 35–100% | Everything static (optional idle accent, e.g. sparkle turns) |
| Reset | at loop end | Instant restart from the empty state |

### 2.3 Motion vocabulary

| Move | Spec | Ease |
|---|---|---|
| **Window rise** | translateY +145px → 0, opacity 0→1, 600–800ms | `ease-arrive` |
| **Dot pop** | scale 0 → 1.2 → 1, 300ms + 300ms | `ease-float` |
| **Bar wipe** | scaleX 0 → 1 from the left edge, 500ms, starts as the dot settles | `ease-wipe` |
| **Card rise** | translateY +35px → 0, opacity 0→1, 700ms | `ease-enter` |
| **Chip pop** | scale 0 → 1.02–1.05 → 1, 300ms + 400ms | `ease-float` |
| **Type-on** | mask scaleX 0→1 over the text, ~1s, linear | linear |
| **Placeholder out** | opacity 0.5 → 0, 100ms, just before type-on | linear |
| **Sparkle turn** | rotate +90° in 600ms, every 2s (3 steps per 6s loop); squash 1→0.8→1; small `+` marks counter-rotate and squash 1→0.3→1 | `ease-turn` (first step `0.455,0.03,0.515,0.955`) |

### 2.4 Stagger rules
- **Rows/list items:** ~300ms apart, top to bottom.
- **Chips:** 50ms apart (fast cascade).
- **Parallel columns** (sidebar vs content) interleave: offset by half a step so the build feels continuous.
- **Floating cards** enter after their underlying rows (≈1.0s and 1.7s in `profile-collections`).
- The whole build finishes by **~2.3s**, whatever the loop length.

### 2.5 Per-file reference

**`ask-anything 2nd type` — 6s**
| Time | Event |
|---|---|
| 0–0.5s | Suggestion chips pop in, 50ms apart (overshoot 1.02–1.05) |
| 0–0.5s | Placeholder "Ask anything..." holds at 50% |
| 0.5–0.6s | Placeholder fades out |
| 0.6–1.6s | Query text revealed by a left-to-right mask (type-on) |
| 0 / 2 / 4s | Sparkle turns 90° + squash (600ms each); counter-rotating `+` marks |
| 1.6–6s | Hold |

**`profile-collections 2nd type` — 7s**
| Time | Event |
|---|---|
| 0–0.8s | App window rises 145px + fades in (`ease-arrive`) |
| 0–1.8s | Sidebar rows: dot pop → bar wipe, every ~300ms |
| 0.4–2.3s | Content bars wipe, interleaved with the sidebar |
| 1.0–1.7s | "Create a new collection" card rises 35px |
| 1.7–2.4s | "Setting up..." card rises 35px |
| 2.4–7s | Hold; static bottom fade to black |

### 2.6 Type 2 recipe

```css
@keyframes pop  { 0%{transform:scale(0)} 50%{transform:scale(1.2)} 100%{transform:scale(1)} }
@keyframes wipe { from{transform:scaleX(0)} to{transform:scaleX(1)} }
@keyframes rise { from{transform:translateY(35px);opacity:0} to{transform:none;opacity:1} }

.row .dot { animation: pop .6s cubic-bezier(.42,0,.58,1) both; }
.row .bar { transform-origin: left; animation: wipe .5s cubic-bezier(.39,.575,.565,1) both; }
.row:nth-child(n) .dot { animation-delay: calc(var(--i) * 300ms); }
.row:nth-child(n) .bar { animation-delay: calc(var(--i) * 300ms + 200ms); }
.card { animation: rise .7s cubic-bezier(.215,.61,.355,1) 1s both; }
/* Wrap the whole build in a 7s loop (SVGator style: keyframe % of the loop) to replay it. */
```

---

## 3. Choosing a type

| Situation | Use |
|---|---|
| Product hero, platform/infra story, section background | **Type 1** |
| Feature demo, AI interaction, a "how it works in the UI" moment | **Type 2** |
| Both in one view | Type 1 behind as ambient, Type 2 in the foreground — never two Type 2 builds at once |

## 4. Checklist
- [ ] Loop length 4–12s (Type 1) or 6–7s (Type 2); seamless restart
- [ ] Easing taken from the token table — default `ease-float`
- [ ] Staggers on 50 / 300 / 500ms beats
- [ ] Movement ≤ 40px for objects (travel paths excepted)
- [ ] Only transform, opacity, dashoffset or offset-path are animated; colors stay static
- [ ] Type 2: build finished by ~2.5s, then holds
- [ ] Respect `prefers-reduced-motion`: show the final (held) frame
