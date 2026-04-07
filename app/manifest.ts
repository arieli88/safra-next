import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "בית מדרש ספרא",
    short_name: "ספרא",
    description: "בית מדרש ספרא - לימוד תורה, קהילה וחיבור לחיילים ולחיילות בתל אביב.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf6ef",
    theme_color: "#7a2f0b",
    lang: "he-IL",
    dir: "rtl",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
