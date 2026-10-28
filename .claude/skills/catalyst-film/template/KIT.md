# Template kit — complete API (read this, never the kit sources)

**Rule:** don't open `src/kit.tsx`, `iso.tsx`, `theme.ts`, `motion.ts`, `cues.ts`, `timeline.ts`, `Stage.tsx`,
`audio-src/synth.py` or the template `make_sound.py` — every signature you need is below. If something is genuinely
missing, `grep -n "export const <name>"` that one line; don't print the file. Everything here is **supporting**:
hero objects and new primitives are drawn fresh in `src/art.tsx`.

## Film skeleton (one film clock; worked well on Progressive MCP v1/v2)
```tsx
import { AbsoluteFill, Html5Audio, Img, staticFile, useCurrentFrame } from "remotion";
import "./theme";
import { ACCENT, C, FONT, gradientText, heading } from "./theme";
import { Glow, IsoDefs, Iso, project } from "./iso";
import { EASE, breathe } from "./motion";
import { cue } from "./cues";
import { TL } from "./timeline";
import { Eyebrow, MONO, Meter, P, Thread, card, clearRight, isoRoute, lerp, lerpRect, pop, rise, win } from "./kit";
const K = cue;                                           // event seconds from src/cues.json
const SceneA: React.FC<{ t: number }> = ({ t }) => { if (t > 12) return null; /* … */ return <AbsoluteFill>…</AbsoluteFill>; };
export const Film: React.FC<{ audio?: string }> = ({ audio = "" }) => {
  const t = useCurrentFrame() / TL.fps;
  return <AbsoluteFill style={{ background: "#000" }}>{audio ? <Html5Audio src={staticFile(audio)} /> : null}<SceneA t={t} /></AbsoluteFill>;
};
```
- Shared element across cuts: one element, `lerpRect(a, b, P(t, K("x.move"), 0.6))`.
- Camera glide or pull: one world container, `transformOrigin "960px 540px"`, `translate…scale…`.
- SVG layers: `<svg width={1920} height={1080} style={{position:"absolute"}}><IsoDefs/>…</svg>`.
- Never spread an entrance style (`rise`, `pop`) after a `transform` you set; it overrides it. Multiply the scale instead.

## `src/kit.tsx` (seconds)
| Export | Signature → use |
|---|---|
| `P` | `(t, at, dur, ease = EASE.signature) → 0..1` clamped progress |
| `win` | `(t, a, b, fin = 0.5, fout = 0.35) → 0..1` ease-out in at `a`, ease-in out ending at `b` |
| `lerp`, `lerpRect` | `(a, b, k)`; `Rect = {x, y, w, h}` |
| `rise`, `pop` | `(k, dy = 16) → CSS` from below + opacity; `(k) → CSS` 97 → 100% scale + opacity |
| `Eyebrow` | `<Eyebrow style?>text</Eyebrow>`: 18px, 600, uppercase, muted |
| `card` | `(rect, extra?) → CSS`: absolute window shell (radius 18, `C.window`, subtle border) |
| `isoRoute` | `(a, b, firstUp = true) → Pt[]`: two legs on the 30° iso directions, a right-angle corner; straight if impossible (keep \|dy\| ≤ \|dx\|/1.73) |
| `along` | `(path, k) → Pt` |
| `Thread` | `<Thread path draw opacity? head?>`: light line drawn 0..1; head born → travels → dissolves (SVG) |
| `Chip` | `<Chip name light x y w? size? opacity? scale? hot?>`: mono tag centred on x,y; `hot` → ember |
| `Meter` | `<Meter value w h? ember?>`: accent-gradient bar (DOM) |
| `clearRight`, `clearLeft`, `clearAbove`, `clearBelow`, `CLEAR` | `(outlinePts, gap = 56) → x` (label's left / right edge) or `→ y` (label's bottom / top edge); `CLEAR = {art: 56, text: 40}` |
| `SPACE`, `SAFE` | `{xs 8, s 16, m 24, text 40, art 56, margin 120}`: every gap comes from it · `SAFE` = the 120px safe-area `Rect` |
| `TYPE` | roles → CSS: `eyebrow` 18 caps · `label` 24 mono · `sub` 32 muted · `title` 56 · `headline` 80 · `display` 180 · `number` 260. Pick a role, not a size; ≤ 3 roles a frame, one headline/display (other display sizes: `heading(160–240)`) |
| `Stack` | `<Stack x y anchor?="tl"\|"tr"\|"bl"\|"br"\|"l"\|"r"\|"c" align? width? gap?={n \| n[]} eyebrow?>{lines}</Stack>`: one text unit with rhythm gaps (eyebrow → 16 → headline → 24 → sub), `data-block` for `./film layout`; lines keep their own `rise`/`enter` |
| `MONO` | `"'SF Mono', Menlo, monospace"` |

## `src/theme.ts`
`C` = {black, surface #0D0D0D, window #121212, chip #181818, cardFloat, borderSubtle #252525, border #303030, iconMuted #747474, muted #A3A3A3, white, cta #E42527, success #4ADE80, successBg} ·
`ACCENT` (90° gradient #7DF4FF → #FFFD99 → #FF4646) · `FONT` (Zoho Puvi 400/500/600, auto-loaded) · `gradientText` (CSS) ·
`heading(px) → CSS` (500, lh 1.125, −0.02em, white) · `eyebrow` (CSS).

## `src/motion.ts` (frames)
`FPS = 30` · `ms(v)` ms → frames · `QUICK / STD / SLOW / EXIT` = 350 / 500 / 800 / 300 ms in frames ·
`EASE.signature (0.4,0,0.2,1) | decelerate (0,0,0.2,1) | accelerate (0.4,0,1,1) | successBack (~5%)` ·
`prog(f, start, dur, ease)` · `enter(f, start, dy = 20, dur = STD) → CSS` · `emerge(f, start, from = 0.97, dur = QUICK, dy = 12) → CSS` ·
`float(f, periodMs, amp, phase = 0)` · `breathe(f, periodMs, lo, hi, phase = 0)` (pass frames, e.g. `t * 30`) ·
`sparkle(f, start, durMs, period)` · `seeded(seed)()` deterministic 0..1.

## `src/iso.tsx` (SVG)
`type Vec3 = [x, y, z]` · `type Iso = {ox, oy, u}` · `project(iso, [x,y,z]) → [sx, sy]`: sx = ox + (x−y)·0.866u, sy = oy + (x+y)·0.5u − z·u ·
`EDGE` = `url(#isoEdge)` · `<IsoDefs/>` defines isoEdge, faceTeal, faceLeft, faceEmber, glowTeal, glowEmber, gridFade, pillarGold/Teal/Coral ·
`<IsoBox iso at size={[w,d,h]} tone?="teal"|"ember" dots? seed? edgeOpacity?>{topFaceChildren}</IsoBox>`: faces: top, right (x+w plane), left (y+d plane) ·
`<IsoCylinder iso at r h rings?>` · `<IsoGrid iso extent id opacity?>` · `<Pillar x y h color="gold"|"teal"|"coral" opacity>` ·
`alongPolyline(iso, path3d, t) → Pt` · `<Trace iso path={Vec3[]} draw opacity?>` · `<Packet x y opacity color?>` · `<Glow cx cy rx ry tone="teal"|"ember" opacity>`.
Plain boxes, cylinders and packets as heroes are retired (ledger).

## `src/cues.ts`, `src/timeline.ts`, `src/Stage.tsx`
`word(line, text, nth = 0, end = false) → s` · `cue(name) → s` (cues.json: a number, `"vo3:Claude+0.1"` or `"vo3:the#1"`; `#k` = k-th occurrence, 0-based) ·
`TL` {id, fps, width, height, cuts[], scenes[], voice, speed, vo[{at, text, dur, words[{w, t0, t1}]}]} · `CUT_FRAMES`, `DURATION`, `sceneFrom(i)`, `sceneDur(i)`, `OVERLAP = 6` ·
`<Stage dur hasEnter hasExit transition?="slide"|"none" bg?={(f) => svg}>{(f) => …}</Stage>`: plain LottieFiles slide (on at most every other cut).

## Audio — `audio-src/make_sound.py` skeleton (the instruments are in `synth.py`; don't open it)
```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from synth import *  # noqa  — gives np, DUR, SR, rng, CUE, WORD, music, drums, sfx, and the instruments below
# ── music ──
chord(["G2", "D3", "G3", "A#3"], 0.0, 2.6, g=0.34, cutoff=1700)    # sharps only (A#, not B♭)
add(drums, 1.0, kick(0.7)); add(drums, 1.25, hat(), 0.12, 0.3)     # add(buffer, t, sound, gain=1, pan=0)
# ── sfx ──
add(sfx, CUE("x.event"), blip(880, 0.08), 0.1, 0.3)
finish()                                                            # reverb + tail + writes build/audio
```
Instruments: `pad_voice(fr, d)` · `pluck(fr, d=0.45, bright=1)` · `bass(fr, d)` · `kick(g=1)` · `hat(open_=False)` · `clap()` · `riser(d)` · `impact(d=1.6)` ·
`whoosh(d=0.45)` · `tick(b=4200, d=0.016)` · `blip(fr=900, d=0.08)` · `settle(fr=180)` · `bell(fr, d=1.6, dec=2.6)` · `air(d=0.3)` · `sparkle_run(base, n=5, gap=0.035)` ·
helpers `hz("D#4")` · `t_axis(s)` · `lp(x, cutoff)` · `band(x, lo, hi)` · `fade(x, a, r)` · `chord(notes, t0, d, g=0.38, cutoff=1700)`.
Typing ticks: `CUE(start) + dur * (np.arccos(1 - 2*k/n) / np.pi)`, so ticks follow the eased curve.

## `src/EndLockup.tsx` (end card)
`<EndLockup at={seconds} width?={760} light?>`: the official lockup Lottie (928×244 → `width`), its own 30 fps timing, starts at `at`.
Draws on, rests from `at + 2.0`; leave **≥ 3.0s from `at` to the last cut**. Centre it; type below it ≥ 56px away, entering after `at + 2.0`.

## Project contract (don't open Root/index to check)
- `Root.tsx` registers `Film` (export from `src/Film.tsx`, props `{ audio?: string }`) with id, fps, size and duration from `timeline.json` (duration = last cut).
- `timeline.json`: `cuts` (s, last = film length) · `scenes[{name}]` (one per cut gap) · **one voice** (`voice`, `speed`) for every `vo[]` line — dialogue needs a second voice in `kokoro_vo.py` (not supported yet; pick another mode).
- Logos and brand files: `public/brand/` (`logo-catalyst-dark.svg`, both lockup JSONs). Fonts load from `theme.ts`.

## Scripts
`./film check | vo | words | sound | mix | layout [frames…] | stills [frames…] | keystills <frames…> | look … | render | verify | log | doctor | all` (cached on inputs).
- `stills` → self-review stills + sheet in `build/review/stills/`. `keystills` → the user's 7–8 key stills in `preview/` (the only writer of preview/).
- `layout [frames…] [--step=0.25]` → clear-space ✓/✗ in numbers (text vs art/cards/text, clipped headlines), no images; exit 1 on ✗. Opt-outs in film code: `data-block` (one unit), `data-layout="ignore"` (ambient art behind type). `Root.tsx` mounts `LayoutProbe` only for this.
- `look <frame> [x y w h] [+ <frame> [x y w h] …]` → ONE small review image (several crops tiled 2-up) in `build/review/`; re-renders frames older than the code.
- `log` → appends `video/ledger.md` to both ledgers (stage 11). After key-stills approval run `./film sound && ./film mix && ./film render && ./film verify` as one call.
