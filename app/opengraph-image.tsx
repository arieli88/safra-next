import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(135deg, #fff7eb 0%, #f6e3ca 46%, #d0a36f 100%)",
          color: "#3c1805",
          fontFamily: '"Heebo", sans-serif',
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -110,
            right: -80,
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.34)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: 9999,
            background: "rgba(122,47,11,0.12)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "56px 64px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                height: 94,
                width: 94,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 9999,
                background: "rgba(255,252,247,0.92)",
                boxShadow: "0 14px 36px rgba(95,45,16,0.13)",
                fontFamily: '"Frank Ruhl Libre", serif',
                fontSize: 54,
                fontWeight: 700,
                color: "#7a2f0b",
              }}
            >
              ס
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ fontSize: 28, letterSpacing: 1, color: "#8f5a31" }}>בית מדרש ספרא</div>
              <div style={{ fontSize: 22, color: "#6f4424" }}>תל אביב</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              maxWidth: 780,
            }}
          >
            <div
              style={{
                fontFamily: '"Frank Ruhl Libre", serif',
                fontSize: 72,
                lineHeight: 1.1,
                fontWeight: 700,
              }}
            >
              לימוד תורה, שיח וקהילה
            </div>
            <div
              style={{
                fontSize: 31,
                lineHeight: 1.45,
                color: "#5a3419",
              }}
            >
              מרחב של לימוד, חיבור ואמונה לחיילים ולחיילות בלב תל אביב
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 18,
              color: "#6a3d1d",
              fontSize: 24,
            }}
          >
            <div>דרך השלום 11, תל אביב</div>
            <div>|</div>
            <div>bmsafra.vercel.app</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
