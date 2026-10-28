import React from "react";
import { Sequence, cancelRender, continueRender, delayRender, staticFile } from "remotion";
import { Lottie, type LottieAnimationData } from "@remotion/lottie";
import { TL } from "./timeline";

/* Official Catalyst lockup (catalyst-assets/logo-animations, permanent brand file): played at its own 30 fps timing,
 * never redrawn, recoloured or retimed. 928×244 → shown uniformly scaled at `width`.
 * Timing: 3.0s; draws on, then rests from +2.0s — leave ≥ 3.0s from `at` to the film's end (hold ≥ 1s). */
const Lockup: React.FC<{ file: string; width: number }> = ({ file, width }) => {
  const [data, setData] = React.useState<LottieAnimationData | null>(null);
  const [handle] = React.useState(() => delayRender("lockup"));
  React.useEffect(() => {
    fetch(staticFile(file)).then((r) => r.json()).then((j) => { setData(j); continueRender(handle); }).catch((e) => cancelRender(e));
  }, [file, handle]);
  return data ? <Lottie animationData={data} loop={false} style={{ width, height: (width * 244) / 928 }} /> : null;
};

export const EndLockup: React.FC<{ at: number; width?: number; light?: boolean }> = ({ at, width = 760, light = false }) => (
  <div style={{ width, height: (width * 244) / 928 }}>
    <Sequence from={Math.round(at * TL.fps)} layout="none">
      <Lockup file={light ? "brand/catalyst-lockup-animation.json" : "brand/catalyst-lockup-animation-darkBG.json"} width={width} />
    </Sequence>
  </div>
);
