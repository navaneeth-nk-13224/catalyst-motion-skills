import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { IsoDefs } from "./iso";
import { sceneTransform } from "./motion";
import { OVERLAP } from "./timeline";

/* Scene shell with the baseline LottieFiles page transition (exit left 300ms ease-in → enter from right
 * 400ms ease-out, 100ms later) and a 25% background counter-move. `f` passed to children is 0 at the cut.
 * Per frame-layouts.md use this plain transition on at most every other cut — pass transition="none"
 * and choreograph a morph / glide / push-in / light wipe inside the scenes instead. */
export const Stage: React.FC<{
  dur: number;
  hasEnter: boolean;
  hasExit: boolean;
  transition?: "slide" | "none";
  bg?: (f: number) => React.ReactNode;
  children: (f: number) => React.ReactNode;
}> = ({ dur, hasEnter, hasExit, transition = "slide", bg, children }) => {
  const raw = useCurrentFrame();
  const f = raw - (hasEnter ? OVERLAP : 0);
  const { opacity, x } = transition === "slide" ? sceneTransform(raw, dur, hasEnter, hasExit) : { opacity: 1, x: 0 };
  return (
    <AbsoluteFill style={{ opacity }}>
      {bg ? (
        <svg width={1920} height={1080} style={{ position: "absolute", transform: `translateX(${-x * 0.25}px)` }}>
          <IsoDefs />
          {bg(f)}
        </svg>
      ) : null}
      <AbsoluteFill style={{ transform: `translateX(${x}px)` }}>{children(f)}</AbsoluteFill>
    </AbsoluteFill>
  );
};
