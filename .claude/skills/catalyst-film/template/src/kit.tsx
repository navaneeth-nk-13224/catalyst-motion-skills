import React from "react";
import { interpolate } from "remotion";
import { EDGE } from "./iso";
import { EASE } from "./motion";
import { ACCENT, C, FONT } from "./theme";

/* Shared SUPPORTING pieces (timing, type entrances, cards, routing, a light thread, chip, meter).
 * They are never a scene's hero: hero objects and new primitives are drawn fresh per film in src/art.tsx
 * (freshness gate). API summary: template/KIT.md. */

export const MONO = "'SF Mono', Menlo, monospace";

// ── film-clock timing (seconds) ─────────────────────────────────────────────────────────────────────────
/** 0→1 progress from `at` over `dur` seconds (clamped). Spatial motion is never linear. */
export const P = (t: number, at: number, dur: number, easing = EASE.signature) =>
  interpolate(t, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
/** Visible window: enters at `a` (ease-out), exits ending at `b` (ease-in, shorter). */
export const win = (t: number, a: number, b: number, fin = 0.5, fout = 0.35) =>
  P(t, a, fin, EASE.decelerate) * (1 - P(t, b - fout, fout, EASE.accelerate));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export type Rect = { x: number; y: number; w: number; h: number };
export const lerpRect = (a: Rect, b: Rect, k: number): Rect => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k) });

// ── type ────────────────────────────────────────────────────────────────────────────────────────────────
/** Direct entrance from below + opacity, driven by a 0→1 progress. */
export const rise = (k: number, dy = 16): React.CSSProperties => ({ opacity: k, transform: `translateY(${(1 - k) * dy}px)` });
/** Emergent entrance: 97% → 100% scale + opacity. */
export const pop = (k: number): React.CSSProperties => ({ opacity: k, transform: `scale(${lerp(0.97, 1, k)})` });

export const Eyebrow: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 18, letterSpacing: "0.08em", textTransform: "uppercase", color: C.muted, ...style }}>{children}</div>
);

/** Absolute-positioned window/card shell (Type 2 surface). */
export const card = (r: Rect, extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: 18, background: C.window,
  border: `1px solid ${C.borderSubtle}`, fontFamily: FONT, letterSpacing: "-0.02em", boxSizing: "border-box", ...extra,
});

// ── clear space (user rule: text never touches art; ≥ 56px from any outline) ────────────────────────────
/** x for a label to the right of an object: its rightmost projected outline point + gap. Pass every corner
 *  (front AND side/depth faces), never just the anchor. */
export const clearRight = (outline: [number, number][], gap = 56) => Math.max(...outline.map((q) => q[0])) + gap;
/** x for a right-aligned label to the left of an object (label's right edge). */
export const clearLeft = (outline: [number, number][], gap = 56) => Math.min(...outline.map((q) => q[0])) - gap;
export const CLEAR = { art: 56, text: 40 };

// ── routing on the screen's iso axes ────────────────────────────────────────────────────────────────────
type Pt = [number, number];
/** Two-leg route a → corner → b along the two 30° iso directions (light turns only at right-angle corners). */
export const isoRoute = (a: Pt, b: Pt, firstUp = true): Pt[] => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const sum = Math.abs(dx) / 0.866;
  const sx = Math.sign(dx) || 1;
  const up = (sum - 2 * dy) / 2;
  const down = sum - up;
  if (up < 0 || down < 0) return [a, b];
  const c: Pt = firstUp ? [a[0] + sx * 0.866 * up, a[1] - 0.5 * up] : [a[0] + sx * 0.866 * down, a[1] + 0.5 * down];
  return [a, c, b];
};

/** Point at fraction k (0–1) of a polyline's length. */
export const along = (p: Pt[], k: number): Pt => {
  const segs = p.slice(1).map((q, i) => Math.hypot(q[0] - p[i][0], q[1] - p[i][1]));
  let d = k * segs.reduce((a, b) => a + b, 0);
  for (let i = 1; i < p.length; i++) {
    const seg = segs[i - 1];
    if (d <= seg || i === p.length - 1) {
      const u = seg ? Math.min(1, d / seg) : 0;
      return [lerp(p[i - 1][0], p[i][0], u), lerp(p[i - 1][1], p[i][1], u)];
    }
    d -= seg;
  }
  return p[p.length - 1];
};

/** A thin thread of light (SVG; needs <IsoDefs/> in the same svg): draws from its start; its head is born,
 *  travels and dissolves — never pops off. */
export const Thread: React.FC<{ path: Pt[]; draw: number; opacity?: number; head?: boolean }> = ({ path, draw, opacity = 1, head = true }) => {
  if (draw <= 0) return null;
  const [hx, hy] = along(path, draw);
  const headOp = head ? Math.sin(Math.min(1, draw) * Math.PI) ** 0.6 : 0;
  return (
    <g opacity={opacity}>
      <polyline points={path.map((q) => q.join(",")).join(" ")} fill="none" stroke={EDGE} strokeWidth={1.6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={hx} cy={hy} r={10} fill="#FFFD99" opacity={0.16 * headOp} />
      <circle cx={hx} cy={hy} r={3} fill="#FFFD99" opacity={headOp} />
    </g>
  );
};

// ── generic Type 2 pieces ───────────────────────────────────────────────────────────────────────────────
/** Monospace tag chip centred on (x, y) with a light dot. `hot` 0–1 tints it toward the ember end (error). */
export const Chip: React.FC<{ name: string; light: string; x: number; y: number; w?: number; opacity?: number; scale?: number; hot?: number; size?: number }> = ({
  name, light, x, y, w = 196, opacity = 1, scale = 1, hot = 0, size = 14,
}) => (
  <div
    style={{
      position: "absolute", left: x, top: y, width: w, height: size * 2.1, marginLeft: -w / 2, marginTop: -size * 1.05, borderRadius: 6,
      background: hot ? `rgba(${40 * hot + 18},18,18,0.96)` : "rgba(18,18,18,0.96)", border: `1px solid ${hot > 0.5 ? "#7A2A22" : C.border}`,
      display: "flex", alignItems: "center", gap: 8, padding: "0 10px", boxSizing: "border-box", fontFamily: MONO, fontSize: size,
      color: hot > 0.5 ? "#FF8A75" : C.muted, whiteSpace: "nowrap", overflow: "hidden", opacity, transform: `scale(${scale})`,
    }}
  >
    <span style={{ width: 6, height: 6, borderRadius: 3, flex: "none", background: hot > 0.5 ? "#FF4646" : light }} />
    {name}
  </div>
);

/** Progress / usage meter filled with the accent gradient (fixed to the track, so the colour shows the level). */
export const Meter: React.FC<{ value: number; w: number; h?: number; ember?: number }> = ({ value, w, h = 8, ember = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: h / 2, background: "#1C1C1C", overflow: "hidden" }}>
    <div style={{ width: `${Math.min(1, value) * 100}%`, height: h, borderRadius: h / 2, backgroundImage: ACCENT, backgroundSize: `${w}px ${h}px`, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, background: "#FF4646", opacity: ember }} />
    </div>
  </div>
);
