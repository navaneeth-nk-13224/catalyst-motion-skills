import raw from "./cues.json";
import { TL } from "./timeline";

/* Film-clock cue helpers (seconds). Pair with cues.json so visuals and sound share one source of truth.
 *   word(3, "Claude")      → onset of "Claude" in VO line 3 (measured by kokoro_vo.py)
 *   cue("agents.claude")   → a named event from cues.json (number, or "vo3:Claude+0.1")
 * Before the VO exists, word() falls back to the line's start so the film still renders. */
const norm = (w: string) => w.toLowerCase().replace(/[^a-z0-9.]/g, "");

export const word = (line: number, text: string, nth = 0, end = false): number => {
  const l = TL.vo[line - 1];
  if (!l) throw new Error(`cue: no VO line ${line}`);
  const hits = (l.words ?? []).filter((w) => norm(w.w) === norm(text));
  const hit = hits[nth];
  if (!hit) return l.at;
  return end ? hit.t1 : hit.t0;
};

const CUES = raw as Record<string, number | string>;
export const cue = (name: string): number => {
  const v = CUES[name];
  if (v === undefined) throw new Error(`cue: "${name}" is not in cues.json`);
  if (typeof v === "number") return v;
  const m = /^vo(\d+):([^#+-]+)(?:#(\d+))?([+-][\d.]+)?$/.exec(v);
  if (!m) throw new Error(`cue: bad reference "${v}"`);
  return word(Number(m[1]), m[2], m[3] ? Number(m[3]) : 0) + (m[4] ? Number(m[4]) : 0);
};
