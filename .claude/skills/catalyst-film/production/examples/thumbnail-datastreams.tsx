import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { ACCENT, C, FONT, gradientText } from "./theme";

/*
 * The YouTube thumbnail (1280×720) for the Data Streams feature video, in the catalyst.zoho.com theme (black surface,
 * the cyan→yellow→red accent) rather than the channel's deep blue. The channel's layout stays (logo, tag pill, big
 * two-tone headline); the hero is the product: a publisher, one channel, the live apps the film shows.
 */

type Theme = { bg: string; text: string; sub: string; grid: string; wire: string; card: string; cardBorder: string; bar: string; logo: string };
const DARK: Theme = { bg: "#000", text: C.white, sub: "rgba(255,255,255,0.7)", grid: "rgba(255,255,255,0.05)", wire: "rgba(125,244,255,0.6)", card: C.window, cardBorder: "rgba(255,255,255,0.14)", bar: "rgba(255,255,255,0.1)", logo: "brand/catalyst-logo-on-dark.png" };

const Backdrop: React.FC<{ t: Theme; glowAt: string }> = ({ t, glowAt }) => (
  <>
    <div style={{ position: "absolute", inset: 0, background: t.bg }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: "64px 64px" }} />
    {/* a soft wash of the accent behind the hero */}
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(40% 55% at ${glowAt}, rgba(125,244,255,${t === DARK ? 0.16 : 0.22}), transparent 70%)` }} />
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(35% 45% at ${glowAt.replace(/^\d+/, (n) => String(Number(n) + 8))}, rgba(255,70,70,${t === DARK ? 0.1 : 0.1}), transparent 70%)` }} />
  </>
);


const Hub: React.FC<{ t: Theme; x: number; y: number; r?: number }> = ({ t, x, y, r = 62 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, padding: 3, borderRadius: r, background: ACCENT, boxSizing: "border-box", boxShadow: "0 0 60px rgba(125,244,255,0.35)" }}>
    <div style={{ width: "100%", height: "100%", borderRadius: r, background: t.card, display: "grid", placeItems: "center" }}>
      <div style={{ width: r * 0.94, height: r * 0.94, borderRadius: 14, background: "#fff", display: "grid", placeItems: "center" }}>
        <Img src={staticFile("icons/datastreams.svg")} style={{ width: r * 0.58, height: r * 0.58, objectFit: "contain" }} />
      </div>
    </div>
  </div>
);


export const ThumbF: React.FC = () => {
  const t = DARK;
  const PAD = 80;
  const HUB = { x: 872, y: 390 };
  const R = 48;
  const BUS = 990;
  const SUB = { x: 1062, w: 168, h: 100 };
  const SUBS = [190, 340, 490].map((top) => ({ top, cy: top + SUB.h / 2 }));
  const PUB = { x: 596, y: HUB.y - 62, w: 136, h: 124 };
  const label = (text: string, x: number, w: number) => (
    <div style={{ position: "absolute", left: x, width: w, top: 616, textAlign: "center", fontFamily: FONT, fontSize: 16, fontWeight: 600, letterSpacing: "0.12em", color: C.iconMuted }}>{text}</div>
  );
  const sub = (i: number, children: React.ReactNode) => (
    <div style={{ position: "absolute", left: SUB.x, top: SUBS[i].top, width: SUB.w, height: SUB.h, borderRadius: 22, background: C.window, border: "2px solid rgba(255,255,255,0.12)", boxSizing: "border-box", padding: "18px 22px", boxShadow: "0 0 40px rgba(125,244,255,0.10), 0 24px 50px rgba(0,0,0,0.6)" }}>{children}</div>
  );
  // an update on its way: a soft trail behind a bright head
  const pulse = (x0: number, x1: number, y: number) => (
    <g key={`${x0}-${y}`}>
      <line x1={x0} y1={y} x2={x1} y2={y} stroke="url(#trail)" strokeWidth={5} strokeLinecap="round" />
      <circle cx={x1} cy={y} r={13} fill="#7DF4FF" opacity={0.25} />
      <circle cx={x1} cy={y} r={6.5} fill="#7DF4FF" />
    </g>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Backdrop t={t} glowAt="72% 54%" />
      <Img src={staticFile(t.logo)} style={{ position: "absolute", left: PAD, top: 64, height: 76 }} />

      {/* tag: top right, as on the channel's other thumbnails */}
      <div style={{ position: "absolute", right: 60, top: 76, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: C.cta, fontFamily: FONT, fontSize: 19, fontWeight: 600, letterSpacing: "0.06em", color: C.white }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, border: "2.5px solid #fff", boxSizing: "border-box" }} />
        FEATURE OVERVIEW
      </div>

      <div style={{ position: "absolute", left: PAD, top: 0, bottom: 0, width: 540, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 60 }}>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 116, lineHeight: 1.0, letterSpacing: "-0.035em", color: t.text }}>
          Data
          <br />
          <span style={gradientText}>Streams</span>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 500, lineHeight: 1.25, color: t.sub, marginTop: 26 }}>Real-time messaging for your Catalyst apps</div>
      </div>

      <svg width={1280} height={720} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="wire" x1={PUB.x + PUB.w} y1="0" x2={SUB.x} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7DF4FF" />
            <stop offset="0.55" stopColor="#FFFD99" />
            <stop offset="1" stopColor="#FF4646" />
          </linearGradient>
          <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#7DF4FF" stopOpacity="0" />
            <stop offset="1" stopColor="#7DF4FF" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* a stream running out of the title into the publisher */}
        <path d={`M528 ${HUB.y + 4} H${PUB.x - 8}`} stroke="rgba(125,244,255,0.22)" strokeWidth={2} strokeDasharray="2 10" strokeLinecap="round" />
        {/* wires */}
        <path d={`M${PUB.x + PUB.w} ${HUB.y} H${HUB.x - R}`} fill="none" stroke="url(#wire)" strokeWidth={3} opacity={0.85} />
        {SUBS.map((s) => (
          <path key={s.top} d={`M${HUB.x + R} ${HUB.y} H${BUS} V${s.cy} H${SUB.x}`} fill="none" stroke="url(#wire)" strokeWidth={3} strokeLinejoin="round" opacity={0.85} />
        ))}
        {/* ripples off the channel */}
        <circle cx={HUB.x} cy={HUB.y} r={R + 16} fill="none" stroke="#7DF4FF" strokeWidth={2} opacity={0.35} />
        <circle cx={HUB.x} cy={HUB.y} r={R + 34} fill="none" stroke="#7DF4FF" strokeWidth={1.5} opacity={0.14} />
        {/* the update riding into the channel, then out to every subscriber at once */}
        {pulse(PUB.x + PUB.w + 2, HUB.x - R - 24, HUB.y)}
        {SUBS.map((s) => pulse(BUS + 4, SUB.x - 20, s.cy))}
      </svg>

      {/* the message on its way in */}
      <div style={{ position: "absolute", left: PUB.x - 4, top: PUB.y - 64, padding: "8px 14px", borderRadius: 10, background: "#181818", border: "1px solid rgba(255,255,255,0.12)", fontFamily: "SF Mono, Menlo, monospace", fontSize: 17, color: "#BDBDBD", whiteSpace: "nowrap" }}>
        {"{ "}<span style={{ color: "#7DF4FF" }}>"score"</span>: <span style={{ color: "#FFFD99" }}>"2–1"</span>{" }"}
      </div>

      {/* publisher */}
      <div style={{ position: "absolute", left: PUB.x, top: PUB.y, width: PUB.w, height: PUB.h, borderRadius: 22, background: C.window, border: "2px solid rgba(255,255,255,0.12)", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, boxShadow: "0 24px 50px rgba(0,0,0,0.6)" }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff", display: "grid", placeItems: "center" }}>
          <Img src={staticFile("icons/functions.svg")} style={{ width: 30, height: 30, objectFit: "contain" }} />
        </div>
        <span style={{ fontFamily: FONT, fontSize: 18, fontWeight: 500, color: t.sub, whiteSpace: "nowrap" }}>Backend</span>
      </div>

      <Hub t={t} x={HUB.x} y={HUB.y} r={R} />

      {sub(0, (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: C.cta }} />
            <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 600, letterSpacing: "0.08em", color: C.muted }}>LIVE</span>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 40, color: t.text, letterSpacing: "-0.02em" }}>2 – 1</div>
        </>
      ))}
      {sub(1, (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: "100%" }}>
          {[0.35, 0.55, 0.45, 0.7, 0.95].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h * 100}%`, borderRadius: 5, background: i === 4 ? ACCENT : "rgba(255,255,255,0.14)" }} />
          ))}
        </div>
      ))}
      {sub(2, (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, justifyContent: "center", height: "100%" }}>
          <div style={{ width: "70%", height: 22, borderRadius: 11, background: "rgba(255,255,255,0.12)" }} />
          <div style={{ alignSelf: "flex-end", width: "60%", height: 22, borderRadius: 11, background: "rgba(125,244,255,0.85)" }} />
        </div>
      ))}

      {label("PUBLISHER", PUB.x, PUB.w)}
      {label("CHANNEL", HUB.x - 90, 180)}
      {label("SUBSCRIBERS", SUB.x, SUB.w)}
    </AbsoluteFill>
  );
};
