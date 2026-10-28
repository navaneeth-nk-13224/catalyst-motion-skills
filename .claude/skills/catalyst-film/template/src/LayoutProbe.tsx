import React from "react";
import { continueRender, delayRender, useCurrentFrame } from "remotion";
import { CLEAR } from "./kit";

/* ./film layout — measures every frame it is asked for and logs one "LAYOUT {json}" line (scripts/layout.mjs reads it).
 * Only mounted when inputProps.layout is true (Root.tsx), so stills and the final render never include it.
 * Text blocks vs art: ≥ CLEAR.art (56px; 40px for labels ≤ 20px) from any visible SVG shape (real outline, sampled
 * every 4px, fills included), image or UI card; ≥ CLEAR.text (40px) between text blocks; text inside the card it
 * describes only must not touch that card's edge. Things that share a card only must not touch (8px).
 * Opt-outs in the film code: data-layout="ignore" on art that may sit behind text (ambient floor, vignette),
 * data-block on a wrapper to make it one unit: its text is one block (a heading + its subline, a legend) and the art
 * inside it only must not touch that text (a label + its meter). */

type R = { x: number; y: number; w: number; h: number };
type Issue = { kind: string; text: string; other: string; gap: number; need: number; at: number[] };

const MIN_TEXT_OP = 0.3; // fading text still counts once it reads
const MIN_ART_OP = 0.15; // ambient layers below this are background
const MARGIN = 96;
const SKIP = "defs,clipPath,mask,pattern,marker,symbol,linearGradient,radialGradient,title,style,script";

const rectGap = (a: R, b: R) =>
  Math.hypot(Math.max(0, a.x - (b.x + b.w), b.x - (a.x + a.w)), Math.max(0, a.y - (b.y + b.h), b.y - (a.y + a.h)));
const ptGap = (p: [number, number], r: R) => Math.hypot(Math.max(0, r.x - p[0], p[0] - (r.x + r.w)), Math.max(0, r.y - p[1], p[1] - (r.y + r.h)));
const union = (rs: R[]): R => {
  const x = Math.min(...rs.map((r) => r.x)), y = Math.min(...rs.map((r) => r.y));
  return { x, y, w: Math.max(...rs.map((r) => r.x + r.w)) - x, h: Math.max(...rs.map((r) => r.y + r.h)) - y };
};
const clip = (t: R, c: R): R | null => {
  const x = Math.max(t.x, c.x), y = Math.max(t.y, c.y), x2 = Math.min(t.x + t.w, c.x + c.w), y2 = Math.min(t.y + t.h, c.y + c.h);
  return x2 - x > 1 && y2 - y > 1 ? { x, y, w: x2 - x, h: y2 - y } : null;
};
const box = (r: R) => [r.x, r.y, r.w, r.h].map(Math.round);
const alpha = (c: string) => (c === "transparent" ? 0 : c.startsWith("rgba") ? parseFloat(c.split(",")[3]) : c.startsWith("rgb") ? 1 : 0);

const measure = (root: HTMLElement, frame: number) => {
  const o = root.getBoundingClientRect();
  const W = o.width, H = o.height;
  const rel = (r: DOMRect): R => ({ x: r.x - o.x, y: r.y - o.y, w: r.width, h: r.height });
  const opCache = new Map<Element, number>();
  const op = (el: Element | null): number => {
    if (!el || el === root.parentElement) return 1;
    if (!opCache.has(el)) {
      const s = getComputedStyle(el);
      opCache.set(el, s.visibility === "hidden" || s.display === "none" ? 0 : parseFloat(s.opacity) * op(el.parentElement));
    }
    return opCache.get(el)!;
  };
  const ignored = (el: Element) => !!el.closest('[data-layout="ignore"]');
  const name = (el: Element) => {
    const path: string[] = [];
    for (let e: Element | null = el; e && e !== root && path.length < 4; e = e.parentElement) {
      path.unshift(`${e.tagName.toLowerCase()}${e.parentElement ? [...e.parentElement.children].indexOf(e) : ""}`);
    }
    return path.join(">");
  };

  const issues: Issue[] = [];
  // rotated text: its boxes are axis-aligned bounds, so fine checks inside its own card are skipped
  const tilted = (el: Element) => {
    for (let e: Element | null = el; e && e !== root; e = e.parentElement) {
      const t = getComputedStyle(e).transform;
      if (t !== "none") { const m = new DOMMatrix(t); if (Math.abs(m.b) > 1e-3 || Math.abs(m.c) > 1e-3) return true; }
    }
    return false;
  };

  // ── UI cards and images (HTML) ──
  type Card = { el: Element; r: R };
  const cards: Card[] = [];
  for (const el of root.querySelectorAll("*")) {
    if (el instanceof SVGElement || ignored(el)) continue;
    const s = getComputedStyle(el);
    const media = /^(IMG|CANVAS|VIDEO)$/.test(el.tagName);
    const painted = alpha(s.backgroundColor) > 0.05 || (s.backgroundImage !== "none" && !s.webkitBackgroundClip?.includes("text") && s.backgroundClip !== "text")
      || ["Top", "Right", "Bottom", "Left"].some((k) => parseFloat(s.getPropertyValue(`border-${k.toLowerCase()}-width`)) > 0 && alpha(s.getPropertyValue(`border-${k.toLowerCase()}-color`)) > 0.05);
    if (!media && !painted) continue;
    const r = rel(el.getBoundingClientRect());
    if (r.w < 8 || r.h < 4 || (r.w >= W * 0.9 && r.h >= H * 0.9) || op(el) < MIN_ART_OP) continue;
    cards.push({ el, r });
  }

  // ── text blocks ──
  type Block = { text: string; rects: R[]; r: R; font: number; els: Element[]; root: Element; label?: Card; tilted?: boolean; glyphs: R[]; cut?: boolean };
  const groups = new Map<Element, Block>();
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement;
    if (!el || !n.textContent?.trim() || el.closest(SKIP) || (el instanceof SVGElement && !el.closest("text")) || op(el) < MIN_TEXT_OP) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    let rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0).map(rel);
    // only the part an overflow:hidden window lets through counts (a ticker, a scrolling log)
    let cut = false;
    for (let p = el.parentElement; p && p !== root; p = p.parentElement) {
      if (getComputedStyle(p).overflow === "visible") continue;
      const c = rel(p.getBoundingClientRect());
      const kept = rects.map((t) => clip(t, c)).filter((t): t is R => !!t);
      cut ||= kept.length < rects.length || kept.some((t, i) => t.w < rects[i]?.w - 1 || t.h < rects[i]?.h - 1);
      rects = kept;
    }
    if (!rects.length) continue;
    let g: Element = el.closest("[data-block]") ?? el.closest("text") ?? el;
    if (!el.closest("[data-block]") && !el.closest("text")) {
      for (let e: Element | null = el; e && e !== root; e = e.parentElement) {
        g = e;
        const pos = getComputedStyle(e).position;
        if (pos === "absolute" || pos === "fixed" || cards.some((c) => c.el === e)) break;
      }
    }
    const b = groups.get(g) ?? { text: "", rects: [], r: rects[0], font: 0, els: [], root: g, glyphs: [] };
    b.text += (b.text ? " " : "") + n.textContent.trim();
    b.rects.push(...rects);
    b.font = Math.max(b.font, parseFloat(getComputedStyle(el).fontSize));
    b.els.push(el);
    b.tilted ||= tilted(el);
    b.cut ||= cut;
    groups.set(g, b);
    // a headline that wraps on its own (one text node, several lines) — usually unintended
    if (parseFloat(getComputedStyle(el).fontSize) >= 60 && new Set(rects.map((r) => Math.round(r.y))).size > 1) {
      issues.push({ kind: "wraps", text: n.textContent.trim().slice(0, 40), other: "", gap: 0, need: 0, at: box(union(rects)) });
    }
  }
  let blocks = [...groups.values()];
  const within = (r: R, c: R, tol = 2) => r.x >= c.x - tol && r.y >= c.y - tol && r.x + r.w <= c.x + c.w + tol && r.y + r.h <= c.y + c.h + tol;
  const area = (r: R) => r.w * r.h;
  for (const b of blocks) {
    b.r = union(b.rects);
    b.glyphs = b.rects;
    // a chip/tag/field: the small box the text sits in IS the label (DOM parent or drawn underneath)
    const tight = cards.filter((c) => c.r.h <= 72 && c.r.w <= 640 && (c.el === b.root || within(b.r, c.r))).sort((x, y) => area(x.r) - area(y.r))[0];
    if (tight) { b.label = tight; b.r = tight.r; b.rects = [tight.r]; }
  }
  for (const b of blocks) { // pieces of one chip (a name + its ⌄) are one label
    const twin = blocks.find((x) => x !== b && x.label && x.label === b.label);
    if (twin && blocks.includes(b)) {
      b.text += " " + twin.text; b.els.push(...twin.els); b.glyphs.push(...twin.glyphs); b.tilted ||= twin.tilted;
      blocks = blocks.filter((x) => x !== twin);
    }
  }
  // aligned blocks stacked closer than 1.6× the smaller font read as one block (list rows, eyebrow + headline)
  for (let merged = true; merged; ) {
    merged = false;
    for (const a of blocks) for (const b of blocks) {
      if (a === b || merged || a.label || b.label) continue;
      const aligned = Math.abs(a.r.x - b.r.x) < 4 || Math.abs(a.r.x + a.r.w / 2 - (b.r.x + b.r.w / 2)) < 4 || Math.abs(a.r.x + a.r.w - (b.r.x + b.r.w)) < 4;
      const dy = Math.max(a.r.y, b.r.y) - Math.min(a.r.y + a.r.h, b.r.y + b.r.h);
      if (aligned && dy >= -1 && dy < Math.min(a.font, b.font) * 1.6) { // list rows, eyebrow over its headline
        a.text += " / " + b.text; a.rects.push(...b.rects); a.glyphs.push(...b.glyphs); a.r = union([a.r, b.r]); a.els.push(...b.els);
        blocks = blocks.filter((x) => x !== b);
        merged = true;
      }
    }
  }
  // ── SVG art: real outlines (sampled), fills tested with isPointInFill ──
  type Art = { el: SVGGeometryElement | SVGGraphicsElement; pts: [number, number][]; r: R; filled: boolean; glow: boolean };
  const arts: Art[] = [];
  for (const el of root.querySelectorAll<SVGGraphicsElement>("path,polygon,polyline,line,rect,circle,ellipse,image,use")) {
    if (el.closest(SKIP) || ignored(el)) continue;
    const s = getComputedStyle(el);
    const fill = s.fill !== "none" && alpha(s.fill.startsWith("url") ? "rgb" : s.fill) > 0 ? parseFloat(s.fillOpacity) : 0;
    const stroke = s.stroke !== "none" && parseFloat(s.strokeWidth) > 0 ? parseFloat(s.strokeOpacity) : 0;
    const media = el.tagName === "image" || el.tagName === "use";
    if (op(el) * (media ? 1 : Math.max(fill, stroke)) < MIN_ART_OP) continue;
    const r = rel(el.getBoundingClientRect());
    if (r.w * r.h === 0 && r.w + r.h < 2) continue;
    if (r.w >= W * 0.9 && r.h >= H * 0.9) continue; // full-frame backdrops
    const ctm = el.getScreenCTM();
    if (!ctm) continue;
    const grad = s.fill.match(/url\("?#([^")]+)/)?.[1];
    const glow = !!grad && document.getElementById(grad)?.tagName === "radialGradient" && !stroke;
    const pts: [number, number][] = [];
    const push = (x: number, y: number) => { const p = new DOMPoint(x, y).matrixTransform(ctm); pts.push([p.x - o.x, p.y - o.y]); };
    if (!media && "getTotalLength" in el) {
      const g = el as SVGGeometryElement;
      const len = g.getTotalLength();
      const scale = Math.hypot(ctm.a, ctm.b) || 1;
      const n = Math.min(2000, Math.max(8, Math.ceil((len * scale) / 4)));
      for (let i = 0; i <= n; i++) { const p = g.getPointAtLength((len * i) / n); push(p.x, p.y); }
    } else {
      for (let i = 0; i <= 20; i++) pts.push([r.x + (r.w * i) / 20, r.y], [r.x + (r.w * i) / 20, r.y + r.h], [r.x, r.y + (r.h * i) / 20], [r.x + r.w, r.y + (r.h * i) / 20]);
    }
    if (glow) { // a glow's body is its bright inner half, not the faded bbox
      const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
      for (const p of pts) { p[0] = cx + (p[0] - cx) * 0.5; p[1] = cy + (p[1] - cy) * 0.5; }
    }
    arts.push({ el, pts, r, filled: fill > 0 && !media, glow });
  }

  const inFill = (a: Art, b: Block) => {
    if (!a.filled || a.r.w < 2 || a.r.h < 2 || !("isPointInFill" in a.el)) return false;
    const inv = a.el.getScreenCTM()!.inverse();
    return b.rects.some((t) => [[0.5, 0.5], [0, 0], [1, 0], [0, 1], [1, 1]].some(([u, v]) => {
      const p = new DOMPoint(o.x + t.x + t.w * u, o.y + t.y + t.h * v).matrixTransform(inv);
      return (a.el as SVGGeometryElement).isPointInFill(p);
    }));
  };

  // ── paint order: hit-test only painted things to see what is really on top ──
  const all = [root, ...root.querySelectorAll("*")] as (HTMLElement | SVGElement)[];
  const saved = all.map((e) => e.style.pointerEvents);
  const solid = new Set<Element>([...cards.map((c) => c.el), ...arts.filter((a) => a.filled && !a.glow).map((a) => a.el)]); // can hide what's under them
  const hits = new Set<Element>([...cards.map((c) => c.el), ...arts.map((a) => a.el)]);
  all.forEach((e) => { e.style.pointerEvents = hits.has(e) ? "auto" : "none"; });
  const top = (x: number, y: number) => document.elementFromPoint(o.x + x, o.y + y);
  // text under an opaque card or shape is hidden (a stacked deck, a window behind a window): not checked
  blocks = blocks.filter((b) => {
    b.els.forEach((e) => { (e as HTMLElement).style.pointerEvents = "auto"; });
    const centres = b.rects.map((t) => [t.x + t.w / 2, t.y + t.h / 2]);
    const covered = centres.filter(([x, y]) => {
      const h = top(x, y);
      return !!h && solid.has(h) && !b.els.some((e) => e === h || e.contains(h) || h.contains(e));
    }).length;
    b.els.forEach((e) => { (e as HTMLElement).style.pointerEvents = hits.has(e) ? "auto" : "none"; });
    return covered * 2 <= centres.length;
  });
  /** distance from a block to the VISIBLE part of an outline (points under another solid don't count) */
  const visibleGap = (b: Block, el: Element, pts: [number, number][], want: number) => {
    let gap = Infinity;
    for (const p of pts) {
      const d = Math.min(...b.rects.map((t) => ptGap(p, t)));
      if (d >= gap || d >= want) continue;
      const h = top(Math.min(W - 1, Math.max(0, p[0])), Math.min(H - 1, Math.max(0, p[1])));
      if (!h || h === el || el.contains(h) || !solid.has(h)) gap = d;
    }
    return gap;
  };
  const border = (r: R): [number, number][] => Array.from({ length: 21 }, (_, i) => i / 20).flatMap((k) => [
    [r.x + r.w * k, r.y], [r.x + r.w * k, r.y + r.h], [r.x, r.y + r.h * k], [r.x + r.w, r.y + r.h * k],
  ] as [number, number][]);

  const label = (b: Block) => b.text.slice(0, 40);
  // a data-block wrapper is one UI unit (a label + its meter): what's inside it only must not touch
  const units: Card[] = [...root.querySelectorAll("[data-block]")].map((el) => ({ el, r: rel(el.getBoundingClientRect()) }));
  // the cards a block sits in (by geometry: a window body is usually a sibling drawn underneath, not a parent)
  const holders = (b: Block): Card[] => [
    ...cards.filter((c) => c !== b.label && (within(b.r, c.r) || b.els.every((e) => c.el.contains(e)))),
    ...arts.filter((a) => a.filled && !a.glow && area(a.r) > area(b.r) * 1.5 && within(b.r, a.r) && inFill(a, b)),
    ...units.filter((u) => b.els.every((e) => u.el.contains(e))),
  ];
  // inside the same card = one UI: only touching counts (8px)
  const sameUI = (b: Block, r: R, el: Element) => holders(b).some((c) => c.el !== el && within(r, c.r));
  for (const b of blocks) {
    const need = b.font <= 20 ? CLEAR.text : CLEAR.art;
    const hold = holders(b);
    // art (SVG)
    for (const a of arts) {
      if (b.els.some((e) => a.el.contains(e)) || hold.includes(a) || (b.label && within(a.r, b.label.r))) continue; // its own surface, or an icon in its chip
      const want = sameUI(b, a.r, a.el) ? 8 : need;
      if ((want === 8 && b.tilted) || (want !== 8 && b.cut)) continue; // a log cut by its window: its window is the thing to check
      let gap = Infinity;
      for (const t of b.rects) for (const p of a.pts) gap = Math.min(gap, ptGap(p, t));
      if (gap > 0 && inFill(a, b)) gap = 0;
      if (gap < want) gap = visibleGap(b, a.el, gap === 0 && inFill(a, b) ? [...a.pts, ...b.rects.map((t): [number, number] => [t.x + t.w / 2, t.y + t.h / 2])] : a.pts, want);
      if (gap < want) issues.push({ kind: "art", text: label(b), other: `${a.el.tagName} ${name(a.el)} @${box(a.r).join(",")}`, gap: Math.round(gap), need: want, at: box(b.r) });
    }
    // cards and images (HTML)
    for (const c of cards) {
      if (c === b.label || (b.label && within(c.r, b.label.r))) continue; // the chip itself and what's drawn in it
      if (hold.includes(c)) {
        // text in the card it describes: only its innermost card's edge matters
        if (!b.label && !b.tilted && !b.cut && hold.every((h) => h === c || area(h.r) >= area(c.r))) {
          const pad = Math.min(...b.rects.map((t) => Math.min(t.x - c.r.x, c.r.x + c.r.w - t.x - t.w, t.y - c.r.y + 4, c.r.y + c.r.h - t.y - t.h + 4)));
          if (pad < 8) issues.push({ kind: "edge", text: label(b), other: `card ${name(c.el)} @${box(c.r).join(",")}`, gap: Math.round(pad), need: 8, at: box(b.r) });
        }
        continue;
      }
      if (b.els.some((e) => c.el.contains(e))) continue;
      const want = sameUI(b, c.r, c.el) ? 8 : need;
      if ((want === 8 && b.tilted) || (want !== 8 && b.cut)) continue; // a log cut by its window: its window is the thing to check
      let gap = Math.min(...b.rects.map((t) => rectGap(t, c.r)));
      if (gap < want) gap = visibleGap(b, c.el, border(c.r), want);
      if (gap < want) issues.push({ kind: "card", text: label(b), other: `${c.el.tagName.toLowerCase()} ${name(c.el)} @${box(c.r).join(",")}`, gap: Math.round(gap), need: want, at: box(b.r) });
    }
    // frame margin (only once the text is fully in)
    const edge = Math.min(b.r.x, b.r.y, W - b.r.x - b.r.w, H - b.r.y - b.r.h);
    if (edge < MARGIN && Math.min(...b.els.map(op)) > 0.9) issues.push({ kind: "margin", text: label(b), other: "frame edge", gap: Math.round(edge), need: MARGIN, at: box(b.r) });
    // cut by an overflow:hidden window: ✗ for a headline, ⚠ for anything else (tickers and logs do this on purpose)
    if (b.cut) issues.push({ kind: b.font >= 60 ? "clipped" : "cut", text: label(b), other: "", gap: 0, need: 0, at: box(b.r) });
  }
  // text vs text
  for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
    const a = blocks[i], b = blocks[j];
    const gap = Math.min(...a.rects.flatMap((t) => b.rects.map((u) => rectGap(t, u))));
    const want = holders(a).some((c) => holders(b).includes(c)) ? 8 : CLEAR.text;
    if (want === 8 && (a.tilted || b.tilted)) continue;
    if (gap < want) issues.push({ kind: "text", text: label(a), other: `"${label(b)}" @${box(b.r).join(",")}`, gap: Math.round(gap), need: want, at: box(a.r) });
  }
  all.forEach((e, i) => { e.style.pointerEvents = saved[i]; });
  console.log("LAYOUT " + JSON.stringify({ frame, texts: blocks.length, art: arts.length + cards.length, issues }));
};

export const LayoutProbe: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const ref = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const h = delayRender(`layout ${frame}`);
    // fonts and Lottie settle first; two rAFs = after React effects and the Lottie frame draw
    document.fonts.ready.then(() => requestAnimationFrame(() => requestAnimationFrame(() => {
      try { if (ref.current) measure(ref.current, frame); } finally { continueRender(h); }
    })));
  }, [frame]);
  return <div ref={ref} style={{ position: "absolute", inset: 0 }}>{children}</div>;
};
