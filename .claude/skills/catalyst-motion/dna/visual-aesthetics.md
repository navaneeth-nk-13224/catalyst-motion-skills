# Catalyst — Visual Aesthetics

How catalyst.zoho.com *looks*: color, gradients, typography, surfaces, iconography and illustration style.
Derived from a crawl of 351 pages, 83 stylesheets and computed styles on live pages (Oct 2026).
For animation, see `../SKILL.md` and `../QUICKREF.md` (measurements archive: `../study/svg-measurements.md`).

> **One-line summary:** pure black canvas, white type in Zoho Puvi Medium, and a single signature gradient — ice-cyan → pale-yellow → coral-red — used as *light*, never as fill.

---

## 1. Design principles

1. **Dark-first, always.** The page is `#000`. There is no light theme in the current system.
2. **Light, not paint.** Brand color appears as glowing edges, gradient text and particles. Large color fills are avoided.
3. **One accent, used sparingly.** The cyan→yellow→red gradient marks the *one* important phrase, number or edge in a view.
4. **Flat and quiet.** No drop shadows, minimal radii, 1px borders. Depth comes from contrast and glow.
5. **Precise and technical.** Hairlines, dot grids, isometric geometry — the visual language of infrastructure.

---

## 2. Color

### 2.1 Neutrals (the 95%)

| Token | Hex | Role |
|---|---|---|
| `--clr-black` | `#000000` | Page background |
| `--clr-gray-900` | `#0D0D0D` | Card / panel surface |
| surface-1 | `#101010` | Form panel, pricing surface |
| surface-2 | `#121212` | App windows inside illustrations |
| surface-3 | `#181818` | Chips, pills, tags |
| card-float | `#252527` @ 90% | Floating UI cards in vignettes |
| border-subtle | `#252525` | Input outline, chip stroke |
| `--clr-gray-650` | `#303030` | Card borders, dividers, rules |
| `--clr-gray-550` | `#4F4F4F` | Disabled, slider fill |
| icon-muted | `#747474` | Muted dots/avatars in UI mocks |
| `--clr-gray-400` | `#A3A3A3` | Body copy, descriptions |
| `--clr-white` | `#FFFFFF` | Headlines, primary text, icons |

Contrast rule: headlines white, body `#A3A3A3`, never pure gray-on-gray below `#A3A3A3` for readable text.

### 2.2 Brand accents

| Token | Hex | |
|---|---|---|
| `--clr-accent-1` | `#7DF4FF` | Ice cyan |
| `--clr-accent-2` | `#FFFD99` | Pale yellow |
| `--clr-accent-3` | `#FF4646` | Coral red |
| `--clr-accent-4` | `#F6FDA1` | Lime highlight (soft `#CCD47E`) |

### 2.3 Functional

| Role | Hex |
|---|---|
| Primary CTA fill | `#E42527` |
| Alert / required `*` | `#FF4646` |
| Focus ring, form links | `#0047FF` |
| Success | text `#4ADE80` on `rgba(74,222,128,0.12)` |
| Warning / amber | `#E8A33D` |

---

## 3. Gradients

All gradients go **cool → warm, left → right** (or bottom-left → top-right on isometric art).

| Name | Definition | Where |
|---|---|---|
| **Accent (primary)** | `linear-gradient(90deg, #7DF4FF 0%, #FFFD99 53.365%, #FF4646 100%)` | Gradient text, active tab border, nav pill border, step numerals |
| **Illustration edge** | `#81F4FC 0% → #FFF394 63% → #FFD988 71% → #FF996B 88% → #FF6755 100%` at ~-24° | Hairline edges of isometric objects |
| **AI sparkle stroke** | `#80F4FD 0% → #FFE58E 51% → #FF5A4F 100%` | Sparkle / "Ask anything" icon strokes |
| **Pricing rim** | `linear-gradient(135deg, #B9E389, #F3DD7E 32%, #F0956A 68%, #E8544A)` | Border of highlighted pricing card |
| **Teal glow** | radial `#27B6BA → rgba(53,130,130,.65) 32% → transparent` @ 30% | Ambient light on the left of iso scenes |
| **Ember glow** | radial `#D3712F → rgba(156,79,38,.59) 36% → transparent` @ 30% | Ambient light on the right of iso scenes |
| **Face shade (teal)** | linear `#102929 → #000` | Lit faces of isometric blocks |
| **Face shade (brown)** | linear `#391E0D → #150B04 → #000` | Warm faces of isometric blocks |
| **Light-pillar tail** | linear `#ECC87E → rgba(126,106,67,.53) 44% → transparent` (also teal `#4C8E92`, rust `#903C2F`, coral `#F56652` variants) | Vertical particle trails |
| **Fade-to-black** | `linear-gradient(180deg, transparent, #000)` | Bottom of UI vignettes / section ends |

Rules:
- Gradient **text** only on 1–3 words per headline, never the whole line.
- Gradient **borders** are 1px, done with `background-clip` + mask, never thick.
- Never put the accent gradient behind body text or as a large background fill.

---

## 4. Typography

**Typeface:** Zoho Puvi (`static.zohocdn.com/zohofonts/zohopuvi/4.0/`). Single family; hierarchy through weight and size only.

| Weight | Used for |
|---|---|
| Medium | All headings (H1–H5, card titles) |
| Regular | Body, nav, captions |
| SemiBold | Buttons, labels, eyebrows |
| Mono (`zoho_puvi_mono`) | Code, CLI snippets |

### Type scale (desktop, measured)

| Style | Size / LH | Tracking | Color |
|---|---|---|---|
| Display H1 | 64 / 72 (1.125) | -0.02em | White + gradient phrase |
| H2 | 48 / 56 — `clamp(28px,4vw,48px)`; up to 56 on feature pages | -0.02em | White + gradient phrase |
| H5 / feature | `clamp(22px,2.3vw,32px)` / 1.25 | -0.02em | White |
| H3 / card | 20 / 30 | -0.02em | White |
| Hero sub | 24 Regular | — | `#A3A3A3` |
| Body L | 18 / 1.55 | -0.02em | `#A3A3A3` |
| Body | 16 / 1.625 | — | `#A3A3A3` |
| Caption | 14 / 1.43 | — | `#A3A3A3` |
| Eyebrow | 13–14 caps SemiBold | +0.06em | White, flanked by 1px `#303030` rules |
| Button | 15 SemiBold caps | -0.34px | White |

Rules: negative tracking everywhere except eyebrows; sentence case headlines; caps only for buttons and eyebrows; headlines max 2 lines; never Bold for headlines.

---

## 5. Layout, surfaces & components

- **Grid:** ~1280px container, 80px gutters; section padding `clamp(60px, 10.5vw, 150px)`; heading-to-content gap `clamp(40px, 5vw, 72px)`.
- **Radii:** 4px buttons/inputs · 8–10px cards & windows · 22px / full for pills. Nothing bubbly.
- **Cards:** `#0D0D0D` fill, 1px `#303030` border, no shadow. Numbered cards split by a 1px rule with a gradient numeral below.
- **Section texture:** faint dot grid (~12px pitch, low-alpha gray) inside bordered containers.
- **Buttons:** primary = solid `#E42527`, 4px radius, `16px 32–48px` padding, caps; ghost = 1px white border; text link = white with 1px underline.
- **Tabs:** full-width row, active tab gets the 1px accent-gradient border.
- **Inputs:** `#101010`/transparent fill, 1px `#303030`, 4px radius, `#A3A3A3` placeholder.

---

## 6. Iconography

- 24px line icons, **1.2px stroke**, round caps & joins.
- White by default; **gradient stroke** for AI / hero moments.
- Product icons: 48px SVG sprite (`zwc-sprite.svg`), monoline, same stroke logic.
- No filled, duotone or emoji-style icons.

---

## 7. Illustration look (static)

### Type 1 — Isometric infrastructure scenes
- True isometric (30°) objects: a hero block plus 3–5 satellites (database cylinders, discs, chips, platforms).
- Near-black faces with subtle teal/brown shading; **hairline gradient edges** define every form.
- Faces printed with micro dot-matrix / glyph patterns in muted tones: teal `#71B6B7`, olive `#8F9567`, tan `#CA966B`.
- Circuit traces along iso axes; dashed iso ground grid that fades out through a blurred mask.
- Ambient teal (left) and ember (right) glows; thin light pillars with glowing dot heads.
- Floating muted line icons in `#698C87 → #374A47`.

**Illustration palette:** `#000`, `#102929`, `#391E0D`, `#4E9193`, `#5B8FAA`, `#71B6B7`, `#8F9567`, `#CA966B`, `#ECC87E`, `#903C2F`, `#F56652`, `#757782`, plus the edge gradient.

### Type 2 — Product-UI vignettes
- Minimal dark app windows (`#121212`), three `#252525` window dots, sidebar/list/detail columns.
- 4px skeleton bars (2px radius) + 5px dots instead of real content; only key strings are real text.
- Floating `#252527` cards, pill inputs with `#252525` stroke, `#181818` chips, `#303033` icon buttons.
- The gradient sparkle is the only color; everything else is grayscale.
- Bottom fades to black so the vignette dissolves into the page.

---

## 8. Don'ts

- No light backgrounds, no navy (`#000E3B` era is legacy).
- No saturated color fills, no rainbow gradients beyond the defined stops.
- No drop shadows, glassmorphism or heavy blur on UI.
- No rounded "friendly" radii (>12px) except pills.
- No bold display type, no all-caps headlines.
