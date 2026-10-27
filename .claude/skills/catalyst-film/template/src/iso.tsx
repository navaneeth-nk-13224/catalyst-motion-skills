import React from "react";
import { seeded } from "./motion";

/*
 * Hand-built isometric kit (no existing SVGs reused).
 * Look follows catalyst-motion/dna/visual-aesthetics.md: near-black faces, hairline gradient edges,
 * dot-matrix textures, ambient teal/ember glows, dashed ground grid.
 */
export type Vec3 = [number, number, number];
export type Iso = { ox: number; oy: number; u: number };

export const project = (iso: Iso, [x, y, z]: Vec3): [number, number] => [
  iso.ox + (x - y) * iso.u * 0.866,
  iso.oy + (x + y) * iso.u * 0.5 - z * iso.u,
];

const pts = (iso: Iso, list: Vec3[]) => list.map((p) => project(iso, p).join(",")).join(" ");

export const EDGE = "url(#isoEdge)";

// Shared defs: edge gradient spans the whole frame (cool bottom-left → warm top-right)
export const IsoDefs: React.FC = () => (
  <defs>
    <linearGradient id="isoEdge" x1="700" y1="1000" x2="1900" y2="80" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#81F4FC" />
      <stop offset="63%" stopColor="#FFF394" />
      <stop offset="71%" stopColor="#FFD988" />
      <stop offset="88%" stopColor="#FF996B" />
      <stop offset="100%" stopColor="#FF6755" />
    </linearGradient>
    <linearGradient id="faceTeal" x1="0" y1="0" x2="0.6" y2="1">
      <stop offset="0%" stopColor="#123030" />
      <stop offset="100%" stopColor="#000" />
    </linearGradient>
    <linearGradient id="faceLeft" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#0B1A1A" />
      <stop offset="100%" stopColor="#000" />
    </linearGradient>
    <linearGradient id="faceEmber" x1="1" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#3D200E" />
      <stop offset="55%" stopColor="#140A04" />
      <stop offset="100%" stopColor="#000" />
    </linearGradient>
    <radialGradient id="glowTeal">
      <stop offset="0%" stopColor="#27B6BA" stopOpacity="0.55" />
      <stop offset="40%" stopColor="#358282" stopOpacity="0.25" />
      <stop offset="100%" stopColor="#50201A" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="glowEmber">
      <stop offset="0%" stopColor="#D3712F" stopOpacity="0.5" />
      <stop offset="45%" stopColor="#9C4F26" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#50201A" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="gridFade">
      <stop offset="0%" stopColor="#fff" stopOpacity="1" />
      <stop offset="70%" stopColor="#fff" stopOpacity="0.35" />
      <stop offset="100%" stopColor="#fff" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="pillarGold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ECC87E" />
      <stop offset="45%" stopColor="#7E6A43" stopOpacity="0.5" />
      <stop offset="100%" stopColor="#000" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="pillarTeal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#4C8E92" />
      <stop offset="100%" stopColor="#000" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="pillarCoral" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F56652" />
      <stop offset="100%" stopColor="#000" stopOpacity="0" />
    </linearGradient>
  </defs>
);

// Dot-matrix texture printed on the right (+x) face
const DotFace: React.FC<{ iso: Iso; a: Vec3; b: Vec3; h: number; seed: number; density?: number }> = ({
  iso,
  a,
  b,
  h,
  seed,
  density = 1,
}) => {
  const rnd = seeded(seed);
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const cols = Math.max(2, Math.round(len * 6 * density));
  const rows = Math.max(2, Math.round(h * 6 * density));
  const palette = ["#71B6B7", "#8F9567", "#CA966B"];
  const dots: React.ReactNode[] = [];
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (rnd() < 0.28) continue;
      const t = (i + 0.5) / cols;
      const zt = (j + 0.5) / rows;
      const p: Vec3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + h * (0.06 + zt * 0.88)];
      const [sx, sy] = project(iso, p);
      dots.push(<circle key={`${i}-${j}`} cx={sx} cy={sy} r={1.1} fill={palette[Math.floor(rnd() * 3)]} opacity={0.75} />);
    }
  }
  return <g>{dots}</g>;
};

export const IsoBox: React.FC<{
  iso: Iso;
  at: Vec3;
  size: Vec3; // w (x), d (y), h (z)
  tone?: "teal" | "ember";
  dots?: boolean;
  seed?: number;
  edgeOpacity?: number;
  children?: React.ReactNode; // drawn on top face
}> = ({ iso, at, size, tone = "teal", dots = true, seed = 1, edgeOpacity = 1, children }) => {
  const [x, y, z] = at;
  const [w, d, h] = size;
  const zt = z + h;
  const top = pts(iso, [[x, y, zt], [x + w, y, zt], [x + w, y + d, zt], [x, y + d, zt]]);
  const right = pts(iso, [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, zt], [x + w, y, zt]]);
  const left = pts(iso, [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, zt], [x, y + d, zt]]);
  const sideFill = tone === "ember" ? "url(#faceEmber)" : "url(#faceTeal)";
  return (
    <g>
      <polygon points={left} fill="url(#faceLeft)" />
      <polygon points={right} fill={sideFill} />
      <polygon points={top} fill={tone === "ember" ? "url(#faceEmber)" : "url(#faceTeal)"} />
      {dots && h > 0.35 ? <DotFace iso={iso} a={[x + w, y, z]} b={[x + w, y + d, z]} h={h} seed={seed} /> : null}
      <g fill="none" stroke={EDGE} strokeWidth={1.3} strokeLinejoin="round" opacity={edgeOpacity}>
        <polygon points={top} />
        <polygon points={right} opacity={0.7} />
        <polygon points={left} opacity={0.55} />
      </g>
      {children}
    </g>
  );
};

export const IsoCylinder: React.FC<{ iso: Iso; at: Vec3; r: number; h: number; rings?: number }> = ({
  iso,
  at,
  r,
  h,
  rings = 0,
}) => {
  const [cx0, cy0] = project(iso, at);
  const [, cyTop] = project(iso, [at[0], at[1], at[2] + h]);
  const rx = 1.2247 * r * iso.u;
  const ry = 0.7071 * r * iso.u;
  const body = `M${cx0 - rx},${cyTop} L${cx0 - rx},${cy0} A${rx},${ry} 0 0 0 ${cx0 + rx},${cy0} L${cx0 + rx},${cyTop}`;
  return (
    <g>
      <path d={body} fill="url(#faceTeal)" stroke={EDGE} strokeWidth={1.3} strokeOpacity={0.75} />
      {Array.from({ length: rings }, (_, i) => {
        const yy = cyTop + ((cy0 - cyTop) * (i + 1)) / (rings + 1);
        return <path key={i} d={`M${cx0 - rx},${yy} A${rx},${ry} 0 0 0 ${cx0 + rx},${yy}`} fill="none" stroke={EDGE} strokeWidth={1.1} strokeOpacity={0.55} />;
      })}
      <ellipse cx={cx0} cy={cyTop} rx={rx} ry={ry} fill="#0A1616" stroke={EDGE} strokeWidth={1.3} />
    </g>
  );
};

// Dashed iso ground grid fading out radially
export const IsoGrid: React.FC<{ iso: Iso; extent: number; id: string; opacity?: number }> = ({ iso, extent, id, opacity = 0.32 }) => {
  const lines: React.ReactNode[] = [];
  for (let k = -extent; k <= extent; k += 1) {
    const a = project(iso, [k, -extent, 0]);
    const b = project(iso, [k, extent, 0]);
    const c = project(iso, [-extent, k, 0]);
    const d = project(iso, [extent, k, 0]);
    lines.push(<line key={`a${k}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />);
    lines.push(<line key={`b${k}`} x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} />);
  }
  const [cx, cy] = project(iso, [0, 0, 0]);
  const rx = extent * iso.u * 1.2;
  return (
    <g>
      <mask id={id}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.58} fill="url(#gridFade)" />
      </mask>
      <g mask={`url(#${id})`} stroke="#fff" strokeOpacity={opacity} strokeWidth={0.8} strokeDasharray="4 6">
        {lines}
      </g>
    </g>
  );
};

// Light pillar: thin vertical line with glowing dot head (Type 1 particle)
export const Pillar: React.FC<{ x: number; y: number; h: number; color: "gold" | "teal" | "coral"; opacity: number }> = ({
  x,
  y,
  h,
  color,
  opacity,
}) => {
  const head = { gold: "#ECC87E", teal: "#4E9193", coral: "#FE7058" }[color];
  return (
    <g opacity={opacity}>
      <rect x={x - 0.6} y={y} width={1.2} height={h} fill={`url(#pillar${color[0].toUpperCase()}${color.slice(1)})`} />
      <circle cx={x} cy={y} r={2.4} fill={head} />
      <circle cx={x} cy={y} r={7} fill={head} opacity={0.18} />
    </g>
  );
};

// Point along an iso polyline at t∈[0,1] (corners act as intermediate keyframes — 1/3 rule)
export const alongPolyline = (iso: Iso, path: Vec3[], t: number): [number, number] => {
  const screen = path.map((p) => project(iso, p));
  const seg = screen.slice(1).map((p, i) => Math.hypot(p[0] - screen[i][0], p[1] - screen[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = t * total;
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const k = seg[i] === 0 ? 0 : Math.min(1, d / seg[i]);
      return [screen[i][0] + (screen[i + 1][0] - screen[i][0]) * k, screen[i][1] + (screen[i + 1][1] - screen[i][1]) * k];
    }
    d -= seg[i];
  }
  return screen[screen.length - 1];
};

export const Trace: React.FC<{ iso: Iso; path: Vec3[]; draw: number; opacity?: number }> = ({ iso, path, draw, opacity = 0.75 }) => (
  <polyline
    points={pts(iso, path)}
    fill="none"
    stroke={EDGE}
    strokeWidth={1.3}
    strokeOpacity={opacity}
    pathLength={1}
    strokeDasharray="1 1"
    strokeDashoffset={1 - draw}
    strokeLinejoin="round"
  />
);

export const Packet: React.FC<{ x: number; y: number; opacity: number; color?: string }> = ({ x, y, opacity, color = "#FFE08C" }) => (
  <g opacity={opacity}>
    <circle cx={x} cy={y} r={12} fill={color} opacity={0.14} />
    <circle cx={x} cy={y} r={3.4} fill={color} />
  </g>
);

export const Glow: React.FC<{ cx: number; cy: number; rx: number; ry: number; tone: "teal" | "ember"; opacity: number }> = ({
  cx,
  cy,
  rx,
  ry,
  tone,
  opacity,
}) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={tone === "teal" ? "url(#glowTeal)" : "url(#glowEmber)"} opacity={opacity} />;
