import type { CSSProperties } from "react";
import { continueRender, delayRender, staticFile } from "remotion";

// Tokens from catalyst-motion/dna/visual-aesthetics.md
export const C = {
  black: "#000000",
  surface: "#0D0D0D",
  window: "#121212",
  chip: "#181818",
  cardFloat: "rgba(37,37,39,0.9)",
  borderSubtle: "#252525",
  border: "#303030",
  iconMuted: "#747474",
  muted: "#A3A3A3",
  white: "#FFFFFF",
  cta: "#E42527",
  success: "#4ADE80",
  successBg: "rgba(74,222,128,0.12)",
};

export const ACCENT = "linear-gradient(90deg, #7DF4FF 0%, #FFFD99 53.365%, #FF4646 100%)";

export const FONT = "ZohoPuvi, sans-serif";

export const gradientText: CSSProperties = {
  backgroundImage: ACCENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

export const heading = (size: number): CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 500,
  fontSize: size,
  lineHeight: 1.125,
  letterSpacing: "-0.02em",
  color: C.white,
  margin: 0,
});

export const eyebrow: CSSProperties = {
  fontFamily: FONT,
  fontWeight: 600,
  fontSize: 18,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: C.white,
  display: "flex",
  alignItems: "center",
  gap: 16,
};

const fonts: [string, number][] = [
  ["Zoho_Puvi_Regular.woff2", 400],
  ["Zoho_Puvi_Medium.woff2", 500],
  ["Zoho_Puvi_Semibold.woff2", 600],
];

const fontHandle = delayRender("Loading Zoho Puvi");
Promise.all(
  fonts.map(([file, weight]) => {
    const face = new FontFace("ZohoPuvi", `url(${staticFile(`fonts/${file}`)})`, {
      weight: String(weight),
    });
    document.fonts.add(face);
    return face.load();
  }),
).then(() => continueRender(fontHandle));
