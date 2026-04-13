"use client";

import dynamic from "next/dynamic";

import type { SiteContent } from "@/lib/types";

const HomeHeroTagline = dynamic(
  () =>
    import("@/components/site/home-hero-tagline").then(
      (module) => module.HomeHeroTagline,
    ),
  { ssr: false },
);

const HomeHeroMediaExtras = dynamic(
  () =>
    import("@/components/site/home-hero-media-extras").then(
      (module) => module.HomeHeroMediaExtras,
    ),
  { ssr: false },
);

export function HomeHeroTaglineIsland() {
  return <HomeHeroTagline />;
}

export function HomeHeroMediaExtrasIsland({
  heroImages,
}: Readonly<{
  heroImages: SiteContent["hero"]["images"];
}>) {
  return <HomeHeroMediaExtras heroImages={heroImages} />;
}
