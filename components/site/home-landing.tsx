import dynamic from "next/dynamic";

import { Footer } from "@/components/site/footer";
import { getHeroImage } from "@/components/site/home-content";
import { HomeHero } from "@/components/site/home-hero";
import { HomeTopBar } from "@/components/site/home-top-bar";
import { getChronicleInfo, type ChronicleInfo } from "@/lib/calendar";
import type { SiteContent, TickerItem } from "@/lib/types";

type HomeLandingProps = {
  content: SiteContent;
  chronicle: ChronicleInfo;
  initialTickerItems: TickerItem[];
};

const HomeDeferredSections = dynamic(
  () =>
    import("@/components/site/home-deferred-sections").then(
      (module) => module.HomeDeferredSections,
    ),
  {
    loading: () => null,
  },
);

function getShortGregorianDate() {
  return new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Jerusalem",
  }).format(new Date());
}

function buildInfoLines(chronicle: ChronicleInfo) {
  const safeChronicle =
    chronicle.weekdayLabel && chronicle.hebrewDate && chronicle.parshaLabel
      ? chronicle
      : getChronicleInfo(new Date());

  return {
    mobile: `${safeChronicle.weekdayLabel || "יום שישי"} | ${safeChronicle.hebrewDate || "כ״ז באדר תשפ״ו"} | ${getShortGregorianDate()} | ${safeChronicle.parshaLabel || "פרשת השבוע"}`,
    desktop: `${safeChronicle.weekdayLabel || "יום שישי"} | ${safeChronicle.hebrewDate || "כ״ז באדר תשפ״ו"} | ${getShortGregorianDate()} | פרשת: ${safeChronicle.parshaLabel || "פרשת השבוע"}`,
  };
}

export function HomeLanding({
  content,
  chronicle,
  initialTickerItems,
}: Readonly<HomeLandingProps>) {
  const heroImage = getHeroImage(content);
  const infoLines = buildInfoLines(chronicle);

  return (
    <div className="relative bg-[#fbf6ef] text-[#2d2118]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_34%),linear-gradient(180deg,#fdf9f3_0%,#f8f1e7_48%,#f5ecdf_100%)]"
      />
      <div aria-hidden="true" className="landing-grain absolute inset-0 opacity-35" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-6%] top-[8rem] h-[18rem] w-[18rem] rounded-full bg-[#ffe7cb] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-6%] top-[28rem] h-[24rem] w-[24rem] rounded-full bg-[#fff6e9] blur-3xl"
      />

      <HomeTopBar
        content={content}
        infoLineMobile={infoLines.mobile}
        infoLineDesktop={infoLines.desktop}
        initialTickerItems={initialTickerItems}
      />

      <main className="relative z-10">
        <HomeHero content={content} heroImage={heroImage} />
        <HomeDeferredSections content={content} />
      </main>

      <div className="relative z-10 bg-[#fbf6ef]">
        <Footer footer={content.footer} />
      </div>
    </div>
  );
}
