import type { Metadata } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";

import { AccessibilityControls } from "@/components/site/accessibility-controls";
import { createPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew"],
  variable: "--font-heebo",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-frank-ruhl",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  ...createPageMetadata({
    title: "בית מדרש ספרא | לימוד תורה ושיח באמונה לחיילים בתל אביב",
    description:
      "בית מדרש ספרא הוא מרחב של לימוד, שיח וחיבור לחיילים ולחיילות בתל אביב. שיעורי תורה, תוכן ערכי וקהילה חמה.",
    keywords: ["בית מדרש", "ספרא", "חיילים", "חיילות", "תל אביב", "לימוד תורה", "קהילה"],
  }),
  metadataBase: new URL(getSiteUrl()),
  applicationName: "בית מדרש ספרא",
  category: "education",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon.svg", type: "image/svg+xml" },
      { url: "/icons/favicon-96x96.png", type: "image/png", sizes: "96x96" },
      { url: "/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      {
        url: "/icons/favicon-dark.png",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icons/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/icons/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
  },
  formatDetection: {
    email: true,
    telephone: true,
    address: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} ${frankRuhlLibre.variable}`} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          דילוג לתוכן הראשי
        </a>
        <div id="main-content">{children}</div>
        <AccessibilityControls />
      </body>
    </html>
  );
}
