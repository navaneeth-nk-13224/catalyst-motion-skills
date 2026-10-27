import tl from "./timeline.json";

/* Typed access to timeline.json — the single source of truth for cuts and VO.
 * kokoro_vo.py writes measured `dur` and word timestamps back into the JSON. */
export type VoWord = { w: string; t0: number; t1: number };
export type VoLine = { at: number; text: string; dur?: number; words?: VoWord[] };
export type SceneMeta = { name: string };
export type Timeline = { id: string; fps: number; width: number; height: number; cuts: number[]; scenes: SceneMeta[]; voice: string; speed: number; vo: VoLine[] };

export const TL = tl as Timeline;
export const FPS = TL.fps;
export const OVERLAP = 6; // frames: exit 300ms ease-in, next enters 100ms later (LottieFiles page transition)
export const CUT_FRAMES = TL.cuts.map((s) => Math.round(s * FPS));
export const DURATION = CUT_FRAMES[CUT_FRAMES.length - 1];
export const sceneFrom = (i: number) => (i === 0 ? 0 : CUT_FRAMES[i] - OVERLAP);
export const sceneDur = (i: number) => CUT_FRAMES[i + 1] - sceneFrom(i);
export const sceneAt = (seconds: number) => Math.max(0, TL.cuts.findIndex((c, i) => seconds >= c && seconds < (TL.cuts[i + 1] ?? Infinity)));
