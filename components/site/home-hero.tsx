import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

import {
  getHeroImages,
  getPrimaryCta,
  splitHeroTitle,
  splitLeadWord,
  type HomeHeroImage,
} from "@/components/site/home-content";
import {
  HomeHeroMediaExtrasIsland,
  HomeHeroTaglineIsland,
} from "@/components/site/home-hero-client-enhancements";
import type { SiteContent } from "@/lib/types";

type HomeHeroProps = {
  content: SiteContent;
  heroImage?: HomeHeroImage;
};

export function HomeHero({ content, heroImage }: Readonly<HomeHeroProps>) {
  const cta = getPrimaryCta(content);
  const heroTitle = splitHeroTitle(content.hero.title);
  const leadWords = splitLeadWord(heroTitle.lead);
  const heroImages = getHeroImages(content);
  const primaryHeroImage = heroImages[0] ?? heroImage;

  return (
    <section
      id="home"
      className="site-section relative isolate overflow-hidden pb-8 pt-7 sm:pb-12 sm:pt-9 lg:pb-[4rem]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_34%),linear-gradient(180deg,#fdf9f3_0%,#f8f1e7_48%,#f5ecdf_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[6%] top-6 z-0 h-[18rem] w-[18rem] rounded-full bg-[#f8d8b6]/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-8 right-[10%] z-0 h-[22rem] w-[22rem] rounded-full bg-[#fff8ed]/80 blur-3xl"
      />

      <div className="site-shell relative z-10 grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="relative z-10">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.34em] text-[#9f8065] sm:text-[0.66rem]">
            {content.hero.eyebrow || "בית מדרש"}
          </p>

          <h1 className="mt-5 max-w-4xl font-serif text-[3rem] font-bold leading-[1.02] text-[#2f2118] sm:text-[3.7rem] lg:text-[4.56rem]">
            {leadWords.first ? (
              <span className="inline-block text-[1.3em] sm:text-[1.2em]">
                <span className="hero-aurora-text">{leadWords.first}</span>
              </span>
            ) : null}
            {leadWords.rest ? <> {leadWords.rest}</> : null}
            <span className="block">
              <span className="hero-aurora-text">{heroTitle.glow}</span>
            </span>
          </h1>

          <div className="mt-5 max-w-xl">
            <HomeHeroTaglineIsland />
          </div>

          <p className="mt-6 max-w-2xl whitespace-pre-line text-[1rem] leading-8 text-[#6b5849] sm:text-[1.05rem] sm:leading-9">
            {content.hero.body}
          </p>

          <div className="mt-10">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[#d7b390] px-5.5 py-3 text-[0.95rem] font-bold text-[#3c2a1e] shadow-[0_18px_44px_rgba(178,138,102,0.18)] transition hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-[#e2c3a4]"
            >
              {cta.label}
              <ArrowUpLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="contents sm:relative sm:block">
          <div className="pointer-events-none absolute inset-x-0 -top-10 bottom-[-2.5rem] -z-10 max-w-full overflow-hidden rounded-[2rem] opacity-30 sm:pointer-events-auto sm:relative sm:inset-auto sm:bottom-auto sm:top-auto sm:z-auto sm:block sm:overflow-visible sm:rounded-none sm:opacity-100">
            <div className="relative mx-auto h-full w-full overflow-hidden rounded-[2rem] bg-[#f4eadf] shadow-none sm:aspect-[4/5] sm:rounded-[2.4rem] sm:shadow-[0_30px_80px_rgba(142,110,84,0.15)]">
              {primaryHeroImage?.src ? (
                <Image
                  src={primaryHeroImage.src}
                  alt={primaryHeroImage.alt}
                  fill
                  priority
                  fetchPriority="high"
                  quality={82}
                  sizes="(max-width: 639px) 100vw, (max-width: 1024px) 76vw, 42vw"
                  className="object-cover"
                />
              ) : null}
              <HomeHeroMediaExtrasIsland heroImages={heroImages} />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,246,239,0.94),rgba(251,246,239,0.58),rgba(251,246,239,0.96))] sm:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.62),transparent_34%),linear-gradient(180deg,rgba(255,249,241,0.02),rgba(65,44,30,0.22))]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
