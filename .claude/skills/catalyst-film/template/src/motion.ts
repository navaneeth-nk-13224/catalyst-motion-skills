import type { CSSProperties } from "react";
import { Easing, interpolate } from "remotion";

/*
 * Motion tokens — LottieFiles motion-design skill is the top authority.
 * Personality: PREMIUM (elegant, minimal, technical) — 0% overshoot, no squash/stretch.
 * Brand motion identity (skill: three constants):
 *   1. Signature easing  (0.4, 0, 0.2, 1)   — 80% of motion
 *   2. Duration palette  350 / 500 / 800ms  — QUICK / STD / SLOW
 *   3. Entrance pattern  direct, from below, 16–24px + opacity
 * Directional rules: entrance = ease-out, exit = ease-in (65–75% of entrance), on-screen = ease-in-out,
 * loops = sine. Never linear for spatial movement.
 */
export const FPS = 30;
export const ms = (v: number) => (v / 1000) * FPS;

export const QUICK = ms(350);
export const STD = ms(500);
export const SLOW = ms(800);
export const EXIT = ms(300); // ~65% of a 450–500ms entrance

export const EASE = {
  signature: Easing.bezier(0.4, 0, 0.2, 1), // premium on-screen + entrance
  decelerate: Easing.bezier(0, 0, 0.2, 1), // ease-out for heavy/dramatic entrances
  accelerate: Easing.bezier(0.4, 0, 1, 1), // ease-in for exits
  successBack: Easing.bezier(0.3, 1.25, 0.5, 1), // ~5% overshoot — success context only
};

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const prog = (f: number, start: number, dur: number, easing = EASE.signature) =>
  interpolate(f, [start, start + dur], [0, 1], { ...clamp, easing });

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Direct entrance (premium): from below + opacity
export const enter = (f: number, start: number, dy = 20, dur = STD): CSSProperties => {
  const p = prog(f, start, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * dy}px)` };
};

// Emergent entrance (premium): scale 96–98% → 100% + opacity (+ small rise)
export const emerge = (f: number, start: number, from = 0.97, dur = QUICK, dy = 12): CSSProperties => {
  const p = prog(f, start, dur);
  return { opacity: p, transform: `translateY(${(1 - p) * dy}px) scale(${lerp(from, 1, p)})` };
};

// Page transition (skill): exit slides left + fades (ease-in), entrance from right (ease-out, 100ms later)
export const sceneTransform = (raw: number, dur: number, hasEnter: boolean, hasExit: boolean) => {
  const inP = hasEnter ? prog(raw, 0, ms(400), EASE.decelerate) : 1;
  const outP = hasExit ? prog(raw, dur - EXIT, EXIT, EASE.accelerate) : 0;
  const x = (1 - inP) * 48 - outP * 48;
  return { opacity: Math.min(inP, 1 - outP), x };
};

// Looping float (skill: ±5–15px, sine, 3–5.5s, layered periods so elements never sync)
export const float = (f: number, periodMs: number, amp: number, phase = 0) =>
  amp * Math.sin(((f / FPS) * 1000 * 2 * Math.PI) / periodMs + phase * 2 * Math.PI);

// Breathing (skill: background element 0.99–1.01 / opacity 0.9–1.0, 4s)
export const breathe = (f: number, periodMs: number, lo: number, hi: number, phase = 0) =>
  lo + (hi - lo) * (0.5 + 0.5 * Math.sin(((f / FPS) * 1000 * 2 * Math.PI) / periodMs + phase * 2 * Math.PI));

// Sparkle (skill: opacity 0→1→0 over 500–1500ms, random stagger)
export const sparkle = (f: number, start: number, durMs: number, period: number) => {
  if (f < start) return 0;
  const local = (f - start) % period;
  const d = ms(durMs);
  if (local > d) return 0;
  return Math.sin((local / d) * Math.PI) ** 2;
};

// Seeded RNG for deterministic decoration
export const seeded = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};
