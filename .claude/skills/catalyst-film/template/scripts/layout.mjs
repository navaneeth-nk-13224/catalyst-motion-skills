// Clear-space check in numbers, not pictures: measures text blocks against art, cards and each other in the real DOM
// (src/LayoutProbe.tsx, mounted only here) and prints ✓/✗ — no image enters the review.
//   node scripts/layout.mjs                → every 0.5s of each scene's resolved part (0.8s after the cut → 0.45s before the next)
//   node scripts/layout.mjs 330 735 875    → specific frames
//   --step=0.25                            → denser default sampling
// Output: one line per issue (repeats over consecutive frames collapsed to a range), full detail in build/review/layout.json.
// Exit 1 if any ✗ (clear space, a clipped headline); ⚠ (a headline wrapping on its own, text inside the 96px margin,
// smaller text cut by an overflow window) doesn't fail.
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tl = JSON.parse(readFileSync(path.join(root, "src/timeline.json"), "utf8"));
const film = path.dirname(root); // outputs/<film>
const fps = tl.fps;
const cuts = tl.cuts.map((c) => Math.round(c * fps));
const step = Number((process.argv.find((a) => a.startsWith("--step=")) ?? "--step=0.5").split("=")[1]);
let frames = process.argv.slice(2).filter((a) => !a.startsWith("--")).map(Number).filter((n) => Number.isFinite(n));
if (!frames.length) {
  for (let i = 0; i < cuts.length - 1; i++) {
    const a = cuts[i] + Math.round(0.8 * fps);
    const b = cuts[i + 1] - Math.round(0.45 * fps);
    for (let f = a; f <= b; f += Math.max(1, Math.round(step * fps))) frames.push(f);
    if (b >= a) frames.push(b);
  }
}
frames = [...new Set(frames)].sort((x, y) => x - y);

const t0 = Date.now();
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), rspack: true });
const inputProps = { audio: "", layout: true };
const browser = await openBrowser("chrome");
const composition = await selectComposition({ serveUrl, id: tl.id, inputProps, puppeteerInstance: browser });
const results = new Map();
const onBrowserLog = (log) => {
  if (!log.text.startsWith("LAYOUT ")) return;
  const r = JSON.parse(log.text.slice(7));
  results.set(r.frame, r); // last measurement of a frame wins (after fonts / Lottie settle)
};
const queue = [...frames];
const worker = async () => {
  for (let frame = queue.shift(); frame !== undefined; frame = queue.shift()) {
    // the screenshot itself is thrown away: tiny JPEG, same CSS layout (scale only changes device pixels)
    await renderStill({ composition, serveUrl, frame, inputProps, puppeteerInstance: browser, imageFormat: "jpeg", scale: 0.25, onBrowserLog });
  }
};
await Promise.all(Array.from({ length: Math.min(4, frames.length) }, worker));
await browser.close({ silent: true });

const sceneOf = (f) => Math.max(0, cuts.findIndex((c, i) => f >= c && f < (cuts[i + 1] ?? Infinity)));
const groups = new Map(); // same issue over neighbouring frames → one line with its worst frame
for (const f of frames) {
  for (const is of results.get(f)?.issues ?? []) {
    // one line per text block and kind (art/card: the closest offender stands for the rest)
    const key = `${sceneOf(f)}|${is.kind}|${is.text.replace(/[\d.,]+/g, "#")}${is.kind === "text" ? "|" + is.other.replace(/ @.*/, "") : ""}`;
    const g = groups.get(key) ?? { ...is, from: f, to: f, worst: f, others: new Set() };
    g.to = f;
    g.others.add(is.other.replace(/ @.*/, ""));
    if (is.gap < g.gap) Object.assign(g, is, { worst: f });
    groups.set(key, g);
  }
}
const missing = frames.filter((f) => !results.has(f));
const list = [...groups.values()].sort((a, b) => a.from - b.from);
const WARN = ["wraps", "margin", "cut"]; // layout guidance, not the clear-space rule
const bad = list.filter((g) => !WARN.includes(g.kind));
const what = { art: "art", card: "card", text: "text", edge: "own card edge", margin: "margin", clipped: "headline clipped by its window", wraps: "wraps" };
const lines = list.map((g) => {
  const span = g.from === g.to ? `f${g.from}` : `f${g.from}–${g.to}`;
  const scene = tl.scenes[sceneOf(g.worst)]?.name ?? `scene ${sceneOf(g.worst) + 1}`;
  const gap = g.need ? ` ${g.gap}px < ${g.need}` : "";
  const at = `text @${g.at.join(",")}`;
  if (g.kind === "wraps") return `⚠ ${span} [${scene}] "${g.text}" wraps onto ${">"}1 line @${g.at.join(",")} — nowrap or a wider column`;
  if (g.kind === "cut") return `⚠ ${span} [${scene}] "${g.text}" is cut by its window (fine for a ticker or log; not for a label) @${g.at.join(",")}`;
  if (g.kind === "margin") return `⚠ ${span} [${scene}] "${g.text}" ${g.gap}px from the frame edge (margins 96–120px) @${g.at.join(",")}`;
  const more = g.others.size > 1 ? ` (+${g.others.size - 1} more)` : "";
  return `✗ ${span} [${scene}] "${g.text}" ↔ ${what[g.kind]} ${g.other}${gap}${more} (worst f${g.worst}, ${at})`;
});
mkdirSync(path.join(film, "build/review"), { recursive: true });
writeFileSync(path.join(film, "build/review/layout.json"), JSON.stringify({ frames, results: Object.fromEntries(results), issues: list.map(({ others, ...g }) => ({ ...g, others: [...others] })) }, null, 1));
const texts = [...results.values()].reduce((s, r) => s + r.texts, 0);
const MAX = 30;
for (const l of lines.slice(0, MAX)) console.log(l);
if (lines.length > MAX) console.log(`… ${lines.length - MAX} more in build/review/layout.json`);
if (missing.length) console.log(`✗ no measurement for frame(s) ${missing.join(" ")} (probe not mounted? Root.tsx must wrap Film in <LayoutProbe> when layout is true)`);
const secs = ((Date.now() - t0) / 1000).toFixed(1);
console.log(`${bad.length || missing.length ? "✗" : "✓"} layout: ${frames.length} frames · ${texts} text checks · ${bad.length} clear-space issue(s)${list.length - bad.length ? ` · ${list.length - bad.length} ⚠` : ""}  (${secs}s)`);
process.exit(bad.length || missing.length ? 1 : 0);
