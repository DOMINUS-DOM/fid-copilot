import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FID Copilot — Assistant juridique pour directions d'école";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          position: "relative",
        }}
      >
        {/* Top-left glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)",
          }}
        />
        {/* Bottom-right glow */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
          }}
        />

        {/* Shield icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 88,
            height: 88,
            borderRadius: 24,
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            marginBottom: 32,
          }}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 8v11M11 11l5-2 5 2M9 14l2.5-3 2.5 3M18 14l2.5-3 2.5 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 22l3-3 3 3"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 700,
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            FID
          </span>
          <span
            style={{
              fontSize: 52,
              fontWeight: 700,
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-1px",
            }}
          >
            Copilot
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 24,
            color: "#94a3b8",
            margin: 0,
            maxWidth: 700,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          {"L'assistant IA des directions scolaires"}
        </p>

        {/* Trust badges */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {["Sources officielles", "Citations exactes", "Aucune hallucination"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: 999,
                  padding: "8px 20px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
                <span style={{ fontSize: 16, color: "#e2e8f0" }}>{badge}</span>
              </div>
            )
          )}
        </div>

        {/* Domain */}
        <p
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 16,
            color: "#64748b",
            margin: 0,
          }}
        >
          www.fid-copilot.com
        </p>
      </div>
    ),
    { ...size }
  );
}
