import { Composition } from "remotion";
import { Film } from "./Film";
import { DURATION, TL } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <Composition id={TL.id} component={Film} durationInFrames={DURATION} fps={TL.fps} width={TL.width} height={TL.height} defaultProps={{ audio: "" }} />
);
