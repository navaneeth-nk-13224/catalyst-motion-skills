import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, gradientText } from "./theme";

/*
 * The film's YouTube thumbnail (1280×720), in the Catalyst channel layout: logo top left, tag top right, the
 * product name big and two-tone on the left, one plain line under it, and the product's real flow on the right.
 * Dark theme. Replace <Hero /> with the film's own picture (it must pass the 2-second relevance test). Rules and
 * a worked example: .claude/skills/catalyst-film/production/thumbnail.md.
 * Export at 2×:  npx remotion still Thumbnail ../<slug>-thumbnail-2x.png --image-format=png --scale=2
 */

export type ThumbnailProps = { first: string; second: string; line: string; tag: string };

// a faint grid and a soft accent wash behind the hero
const Backdrop: React.FC = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "#000" }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
    {/* a soft wash of the accent behind the hero */}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(40% 55% at 72% 54%, rgba(125,244,255,0.16), transparent 70%)" }} />
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(35% 45% at 80% 54%, rgba(255,70,70,0.1), transparent 70%)" }} />
  </>
);

// placeholder: the product's real thing (Data Streams used publisher → channel → three live subscribers)
const Hero: React.FC = () => (
  <div style={{ position: "absolute", left: 640, top: 170, width: 580, height: 400, borderRadius: 22, border: `2px dashed ${C.border}`, display: "grid", placeItems: "center", fontFamily: FONT, fontSize: 22, color: C.iconMuted }}>
    the product's flow goes here
  </div>
);

export const Thumbnail: React.FC<ThumbnailProps> = ({ first, second, line, tag }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <Backdrop />
    <Img src={staticFile("brand/catalyst-logo-on-dark.png")} style={{ position: "absolute", left: 80, top: 64, height: 76 }} />

    {/* tag: top right, as on the channel's other thumbnails */}
    <div style={{ position: "absolute", right: 60, top: 76, display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 999, background: C.cta, fontFamily: FONT, fontSize: 19, fontWeight: 600, letterSpacing: "0.06em", color: C.white }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, border: "2.5px solid #fff", boxSizing: "border-box" }} />
      {tag}
    </div>

    <div style={{ position: "absolute", left: 80, top: 0, bottom: 0, width: 540, display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: 60 }}>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 116, lineHeight: 1.0, letterSpacing: "-0.035em", color: C.white }}>
        {first}
        <br />
        <span style={gradientText}>{second}</span>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 500, lineHeight: 1.25, color: "rgba(255,255,255,0.7)", marginTop: 26 }}>{line}</div>
    </div>

    <Hero />
  </AbsoluteFill>
);
