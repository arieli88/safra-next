import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #fff4e4 0%, #f3dcc0 52%, #d9ae7c 100%)",
          color: "#5e2507",
          fontFamily: '"Frank Ruhl Libre", serif',
          borderRadius: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            height: 112,
            width: 112,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9999,
            background: "rgba(255,250,243,0.88)",
            boxShadow: "0 10px 28px rgba(95,45,16,0.14)",
            fontSize: 72,
            fontWeight: 700,
          }}
        >
          ס
        </div>
      </div>
    ),
    size,
  );
}
