import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Turbo Tides — Swim Lessons in Danville, CA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0F2B46 0%, #1A3A5C 40%, #1565C0 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Wave decoration */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: "rgba(64, 224, 208, 0.15)",
            borderRadius: "100% 100% 0 0",
            display: "flex",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-2px",
            }}
          >
            Turbo
          </span>
          <span
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#40E0D0",
              letterSpacing: "-2px",
            }}
          >
            Tides
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.85)",
            marginBottom: 40,
            display: "flex",
          }}
        >
          Private Swim Lessons in Danville, CA
        </div>

        {/* Info pills */}
        <div style={{ display: "flex", gap: 24 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 16,
              padding: "12px 28px",
              color: "white",
              fontSize: 22,
              display: "flex",
            }}
          >
            $25 / Lesson
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 16,
              padding: "12px 28px",
              color: "white",
              fontSize: 22,
              display: "flex",
            }}
          >
            20 Minutes
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 16,
              padding: "12px 28px",
              color: "white",
              fontSize: 22,
              display: "flex",
            }}
          >
            1-on-1
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 20,
            color: "rgba(64, 224, 208, 0.8)",
            display: "flex",
          }}
        >
          turbotides.us
        </div>
      </div>
    ),
    { ...size }
  );
}
