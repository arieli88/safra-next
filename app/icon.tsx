import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
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
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 22,
            borderRadius: 52,
            border: "6px solid rgba(122,47,11,0.16)",
          }}
        />
        <div
          style={{
            display: "flex",
            height: 280,
            width: 280,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9999,
            background: "rgba(255,250,243,0.82)",
            boxShadow: "0 18px 46px rgba(95,45,16,0.14)",
            fontSize: 168,
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
