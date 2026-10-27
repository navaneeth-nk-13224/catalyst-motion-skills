import React from "react";
import { AbsoluteFill, Html5Audio, Img, Sequence, staticFile } from "remotion";
import "./theme";
import { C, FONT, gradientText, heading } from "./theme";
import { Stage } from "./Stage";
import { cue } from "./cues";
import { EASE, QUICK, STD, breathe, emerge, enter, ms, prog } from "./motion";
import { TL, sceneDur, sceneFrom } from "./timeline";

/* Example film — REPLACE these scenes. Art for every film is drawn fresh in src/art.tsx
 * (catalyst-motion skill); the template ships no art so nothing is reused by accident.
 * Scenes receive `f` = frames since their cut. One entry per timeline.json scene. */

// L3 centre stage (example)
const Hook: React.FC = () => (
  <Stage dur={sceneDur(0)} hasEnter={false} hasExit>
    {(f) => (
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <h1 style={{ ...heading(120) }}>
          <span style={{ display: "block", ...enter(f, ms(cue("hook.title") * 1000), 24) }}>Your core idea,</span>
          <span style={{ display: "block", ...enter(f, ms(cue("hook.title") * 1000) + ms(100), 24) }}>
            <span style={gradientText}>in one line.</span>
          </span>
        </h1>
      </AbsoluteFill>
    )}
  </Stage>
);

// L3 CTA (example)
const Cta: React.FC = () => (
  <Stage dur={sceneDur(1)} hasEnter hasExit={false}>
    {(f) => {
      const settled = ms(400) + QUICK;
      const pulse = f > settled ? breathe(f - settled, 2500, 0.985, 1.015, 0.75) : 1;
      const fadeOut = 1 - prog(f, sceneDur(1) - ms(400) - 6, ms(400), EASE.accelerate);
      return (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: fadeOut }}>
          <Img src={staticFile("brand/logo-catalyst-dark.svg")} style={{ width: 320, ...emerge(f, ms(100), 0.97, STD, 14) }} />
          <div style={{ marginTop: 56, ...emerge(f, ms(400), 0.97, QUICK, 10) }}>
            <div style={{ background: C.cta, color: C.white, fontFamily: FONT, fontWeight: 600, fontSize: 24, padding: "24px 56px", borderRadius: 4, transform: `scale(${pulse})` }}>GET STARTED</div>
          </div>
        </AbsoluteFill>
      );
    }}
  </Stage>
);

const SCENES: React.FC[] = [Hook, Cta];

export const Film: React.FC<{ audio?: string }> = ({ audio = "" }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {audio ? <Html5Audio src={staticFile(audio)} /> : null}
    {SCENES.map((Scene, i) => (
      <Sequence key={i} from={sceneFrom(i)} durationInFrames={sceneDur(i)} name={TL.scenes[i]?.name ?? `Scene ${i + 1}`}>
        <Scene />
      </Sequence>
    ))}
  </AbsoluteFill>
);
