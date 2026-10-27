// The ONE deliverable: outputs/<film>/<slug>.mp4 — final picture + the full mix. No captions, no variants.
// Each film's folder in outputs/ holds everything for that render; the mp4 is git-ignored (user rule: videos never go in the repo).
// Picture + encode use Remotion's pinned Chrome Headless Shell and bundled FFmpeg (package-lock.json) → reproducible.
//   node scripts/render.mjs [--concurrency=8]
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let project = root;
while (!existsSync(path.join(project, ".claude/skills/catalyst-film")) && path.dirname(project) !== project) project = path.dirname(project);
const tl = JSON.parse(readFileSync(path.join(root, "src/timeline.json"), "utf8"));
const slug = tl.slug ?? tl.id.toLowerCase();
const outDir = path.dirname(root); // outputs/<film>
const concurrency = Number((process.argv.find((a) => a.startsWith("--concurrency=")) ?? "--concurrency=8").split("=")[1]);
const mix = path.join(outDir, "build/audio/mix.wav");
if (!existsSync(mix)) throw new Error(`missing ${path.relative(project, mix)} — run: python scripts/film.py mix`);
mkdirSync(outDir, { recursive: true });
for (const f of readdirSync(outDir)) if (/\.(mp4|srt|mov|webm)$/.test(f) && f !== `${slug}.mp4`) rmSync(path.join(outDir, f)); // single deliverable

const t0 = Date.now();
const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts"), rspack: true });
// the mix lives in outputs/<film>/build/, not in public/ — drop it into the throwaway bundle so staticFile("audio/mix.wav") resolves
mkdirSync(path.join(serveUrl, "public/audio"), { recursive: true });
copyFileSync(mix, path.join(serveUrl, "public/audio/mix.wav"));
const inputProps = { audio: "audio/mix.wav" };
const composition = await selectComposition({ serveUrl, id: tl.id, inputProps });
await renderMedia({ composition, serveUrl, codec: "h264", inputProps, concurrency, outputLocation: path.join(outDir, `${slug}.mp4`) });
console.log(`✓ ${path.relative(project, path.join(outDir, `${slug}.mp4`))}  (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
