import { Composition } from "remotion";
import { Film } from "./Film";
import { LayoutProbe } from "./LayoutProbe";
import { DURATION, TL } from "./timeline";

// layout: true only from ./film layout (scripts/layout.mjs) — stills and the final render never mount the probe
const Main: React.FC<{ audio?: string; layout?: boolean }> = ({ audio = "", layout = false }) =>
  layout ? <LayoutProbe><Film audio={audio} /></LayoutProbe> : <Film audio={audio} />;

export const RemotionRoot: React.FC = () => (
  <Composition id={TL.id} component={Main} durationInFrames={DURATION} fps={TL.fps} width={TL.width} height={TL.height} defaultProps={{ audio: "", layout: false }} />
);
