// Review stills + contact sheet from ONE bundle and ONE browser (vs. one `remotion still` per frame).
//   node scripts/stills.mjs                 → auto frames: entry, middle and hold of every scene + last frame
//   node scripts/stills.mjs 60 240 610      → specific frames
// Output: outputs/<film>/preview/f<frame>.png + sheet.png (4 columns) — the key stills the user approves. Uses the shipped props.
import { bundle } from "@remotion/bundler";
import { openBrowser, renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tl = JSON.parse(readFileSync(path.join(root, "src/timeline.json"), "utf8"));
let project = root;
while (!existsSync(path.join(project, ".claude/skills/catalyst-film")) && path.dirname(project) !== project) project = path.dirname(project);
const outDir = path.join(path.dirname(root), "preview"); // outputs/<film>/preview
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const fps = tl.fps;
const cuts = tl.cuts.map((c) => Math.round(c * fps));
const last = cuts[cuts.length - 1] - 1;
let frames = process.argv.slice(2).map(Number).filter((n) => Number.isFinite(n));
if (!frames.length) {
  for (let i = 0; i < cuts.length - 1; i++) {
    const a = cuts[i];
    const b = cuts[i + 1];
    frames.push(Math.min(b - 1, a + Math.round(0.8 * fps)), Math.round((a + b) / 2), Math.max(a, b - Math.round(0.45 * fps)));
  }
  frames.push(last);
}
frames = [...new Set(frames)].sort((x, y) => x - y);

const t0 = Date.now();
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), rspack: true }); // same bundler as remotion.config.ts (CLI); 0.7s vs 4.4s webpack
const inputProps = { audio: "" };
const browser = await openBrowser("chrome");
const composition = await selectComposition({ serveUrl, id: tl.id, inputProps, puppeteerInstance: browser });
// render in parallel pages of the same browser (identical pixels; ~4 at a time keeps memory flat)
const queue = [...frames];
const worker = async () => {
  for (let frame = queue.shift(); frame !== undefined; frame = queue.shift()) {
    await renderStill({ composition, serveUrl, frame, inputProps, puppeteerInstance: browser, output: path.join(outDir, `f${String(frame).padStart(4, "0")}.png`) });
  }
};
await Promise.all(Array.from({ length: Math.min(4, frames.length) }, worker));
await browser.close({ silent: true });
// contact sheet is a review aid only: system FFmpeg if present (the bundled one lacks the tile filter)
let sheet = "";
try {
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-pattern_type", "glob", "-i", path.join(outDir, "f*.png"), "-vf", `scale=480:-1,tile=4x${Math.ceil(frames.length / 4)}`, "-frames:v", "1", path.join(outDir, "sheet.png")]);
  sheet = " + sheet";
} catch {
  sheet = " (no contact sheet: brew install ffmpeg to get one)";
}
console.log(`✓ ${frames.length} stills${sheet} → ${path.relative(project, outDir)}/  (${((Date.now() - t0) / 1000).toFixed(1)}s) frames: ${frames.join(" ")}`);
