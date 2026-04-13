import { ImageResponse } from "next/og";

/** 1200×630 PNG for LinkedIn / Twitter (raster; SVG is not used for link previews). */
export function buildOgImageResponse() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(145deg, #1e1b4b 0%, #5b21b6 45%, #7c3aed 100%)",
          padding: 56,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          Draftora
        </div>
        <div
          style={{
            fontSize: 34,
            fontWeight: 500,
            color: "rgba(255,255,255,0.92)",
            marginTop: 20,
            maxWidth: 980,
            lineHeight: 1.35,
          }}
        >
          LinkedIn posts in plain text · Unicode styling · Live feed preview
        </div>
        <div
          style={{
            fontSize: 22,
            color: "rgba(255,255,255,0.75)",
            marginTop: 28,
          }}
        >
          draftora.pages.dev
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
