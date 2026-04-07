"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import { SiGooglemaps, SiWaze } from "react-icons/si";

import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { RabbiCardGrid } from "@/components/site/rabbi-card-grid";
import { Reveal } from "@/components/site/reveal";
import { getDisplayImageSrc } from "@/lib/image-proxy";
import type { SiteContent } from "@/lib/types";

function SectionEyebrow({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-[#9f8065]">{children}</p>;
}

function MoovitAppIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-5 w-5 items-center justify-center rounded-[0.4rem] bg-white text-[0.56rem] font-bold text-[#00a9b4]"
    >
      M
    </span>
  );
}

function DirectionLink({
  href,
  label,
  tone,
  icon,
}: Readonly<{
  href: string;
  label: string;
  tone: "waze" | "moovit" | "google";
  icon: React.ReactNode;
}>) {
  const styles =
    tone === "waze"
      ? "bg-[#2f6ef7] text-white"
      : tone === "moovit"
        ? "bg-[#00a9b4] text-white"
        : "border border-[#eadfd4] bg-[#fffaf4] text-[#4f3b2e]";

  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-between rounded-[1.35rem] px-4 py-4 text-sm font-semibold shadow-[0_16px_36px_rgba(157,120,92,0.08)] transition hover:-translate-y-0.5 ${styles}`}
    >
      <span className="inline-flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
          {icon}
        </span>
        {label}
      </span>
      <span className="text-xs opacity-70">
        {"\u05e4\u05ea\u05d9\u05d7\u05d4"}
      </span>
    </Link>
  );
}

function HomeLikeFooter({ content }: Readonly<{ content: SiteContent }>) {
  return <Footer footer={content.footer} />;
}

function LazyMapEmbed({ src, title }: Readonly<{ src: string; title: string }>) {
  return (
    <iframe
      title={title}
      src={src}
      className="h-[20rem] w-full sm:h-[28rem]"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      allowFullScreen
    />
  );
}

export function ContactExperience({ content }: Readonly<{ content: SiteContent }>) {
  const homeHeaderLinks = [
    { label: "\u05d1\u05d9\u05ea", href: "/#home" },
    { label: "\u05d0\u05d5\u05d3\u05d5\u05ea", href: "/#about" },
    { label: "\u05e7\u05d4\u05d9\u05dc\u05d4", href: "/#community" },
    { label: "\u05d4\u05d9\u05e1\u05d8\u05d5\u05e8\u05d9\u05d4", href: "/#history" },
    { label: "\u05d2\u05dc\u05e8\u05d9\u05d4", href: "/#gallery" },
    { label: "\u05e6\u05d5\u05e8 \u05e7\u05e9\u05e8", href: "/contact" },
  ];
  const visibleLecturers = content.contactPage.lecturers.filter((lecturer) => !lecturer.hidden);
  const googleMapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.footer.address)}`;
  const cardSettings = content.contactPage.cardSettings;
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const smoothSpotlightX = useSpring(spotlightX, { stiffness: 130, damping: 24, mass: 0.6 });
  const smoothSpotlightY = useSpring(spotlightY, { stiffness: 130, damping: 24, mass: 0.6 });
  const sectionSpotlight = useMotionTemplate`radial-gradient(34rem circle at ${smoothSpotlightX}% ${smoothSpotlightY}%, rgba(255,255,255,0.52), rgba(219,186,149,0.18) 26%, transparent 60%)`;
  const lecturerCards = useMemo(
    () =>
      visibleLecturers.map((lecturer) => ({
        id: lecturer.id,
        name: lecturer.name,
        phone: lecturer.phone,
        description: lecturer.bio,
        imageSrc: getDisplayImageSrc(lecturer.image.src),
        imageAlt: lecturer.image.alt,
      })),
    [visibleLecturers],
  );

  return (
    <div className="min-h-screen bg-[#fbf6ef] text-[#2d2118]">
      <Header nav={content.nav} logoUrl={content.meta.logoUrl} linksOverride={homeHeaderLinks} />

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.78),transparent_32%),linear-gradient(180deg,#fdf9f3_0%,#f8f1e7_50%,#f5ecdf_100%)]" />
        <div className="pointer-events-none absolute left-[-6%] top-[6rem] h-[18rem] w-[18rem] rounded-full bg-[#f7ddbf] blur-3xl" />
        <div className="pointer-events-none absolute right-[-8%] top-[26rem] h-[24rem] w-[24rem] rounded-full bg-[#fff4e5] blur-3xl" />

        <section className="site-section relative px-4 pb-4 pt-6 sm:px-6 sm:pb-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Reveal className="max-w-4xl">
              <SectionEyebrow>{content.contactPage.eyebrow}</SectionEyebrow>
              <h1 className="mt-4 font-serif text-[2.2rem] leading-[1.08] text-[#2f2118] sm:text-[3.05rem] lg:text-[3.55rem]">
                {content.contactPage.title}
              </h1>
              <p className="mt-4 max-w-3xl text-[0.98rem] leading-7 text-[#6b5849] sm:text-[1.02rem] sm:leading-8">{content.contactPage.description}</p>
            </Reveal>
          </div>
        </section>

        <section id="lecturers" className="site-section relative px-4 pb-10 sm:px-6 sm:pb-12 lg:px-8">
          <div
            className="relative mx-auto w-full max-w-7xl"
            onPointerMove={(event) => {
              if (!cardSettings.spotlightEnabled) return;
              const bounds = event.currentTarget.getBoundingClientRect();
              spotlightX.set(((event.clientX - bounds.left) / bounds.width) * 100);
              spotlightY.set(((event.clientY - bounds.top) / bounds.height) * 100);
            }}
            onPointerLeave={() => {
              spotlightX.set(50);
              spotlightY.set(50);
            }}
          >
            {cardSettings.spotlightEnabled ? (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0 opacity-90"
                style={{ backgroundImage: sectionSpotlight }}
              />
            ) : null}
            <Reveal className="max-w-3xl">
              <SectionEyebrow>
                {"\u05e6\u05d5\u05d5\u05ea \u05d4\u05de\u05e8\u05e6\u05d9\u05dd"}
              </SectionEyebrow>
              <h2 className="mt-4 font-serif text-[2.2rem] text-[#2f2118] sm:text-[2.8rem]">
                {"\u05d0\u05e0\u05e9\u05d9\u05dd \u05e9\u05d0\u05e4\u05e9\u05e8 \u05dc\u05e4\u05e0\u05d5\u05ea \u05d0\u05dc\u05d9\u05d4\u05dd \u05d1\u05e7\u05dc\u05d5\u05ea"}
              </h2>
            </Reveal>
            <div className="relative z-10">
              <RabbiCardGrid items={lecturerCards} settings={cardSettings} />
            </div>
          </div>
        </section>

        <section id="directions" className="site-section relative px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
          <div className="mx-auto w-full max-w-7xl">
            <Reveal className="max-w-3xl">
              <SectionEyebrow>
                {"\u05d3\u05e8\u05db\u05d9 \u05d4\u05d2\u05e2\u05d4"}
              </SectionEyebrow>
              <h2 className="mt-4 font-serif text-[2.2rem] text-[#2f2118] sm:text-[2.8rem]">
                {"\u05dc\u05d1\u05d5\u05d0 \u05d1\u05e7\u05dc\u05d5\u05ea, \u05dc\u05d4\u05e8\u05d2\u05d9\u05e9 \u05e9\u05db\u05d1\u05e8 \u05d4\u05d2\u05e2\u05ea\u05dd"}
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#6b5849] sm:text-lg sm:leading-9">{content.contactPage.directionsText}</p>
            </Reveal>

            <div className="mt-8 grid gap-6 lg:grid-cols-[0.96fr_1.04fr]">
              <div className="order-1 grid content-start gap-5 lg:order-2">
                <Reveal>
                  <div className="rounded-[2rem] border border-[#eadfd4] bg-[linear-gradient(180deg,rgba(255,251,246,0.94),rgba(246,237,228,0.88))] p-6 shadow-[0_24px_55px_rgba(157,120,92,0.1)]">
                    <SectionEyebrow>{content.contactPage.hoursTitle}</SectionEyebrow>
                    <div className="mt-5 grid gap-3">
                      {content.contactPage.hours.map((hour, index) => (
                        <div key={`${hour}-${index}`} className="rounded-[1.15rem] border border-white/80 bg-white/70 px-4 py-3 text-sm text-[#6b5849] sm:text-base">
                          {hour}
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                <Reveal>
                  <div className="rounded-[2rem] border border-[#eadfd4] bg-white/74 p-6 shadow-[0_24px_55px_rgba(157,120,92,0.1)]">
                    <SectionEyebrow>
                      {"\u05dc\u05e4\u05ea\u05d5\u05d7 \u05e0\u05d9\u05d5\u05d5\u05d8"}
                    </SectionEyebrow>
                    <div className="mt-5 grid gap-3">
                      {content.contactPage.navButtons.map((button) => (
                        <DirectionLink
                          key={button.id}
                          href={button.href}
                          label={button.label}
                          tone={button.kind}
                          icon={button.kind === "waze" ? <SiWaze className="h-5 w-5" /> : <MoovitAppIcon />}
                        />
                      ))}
                      <DirectionLink href={googleMapsHref} label="Google Maps" tone="google" icon={<SiGooglemaps className="h-5 w-5" />} />
                    </div>
                  </div>
                </Reveal>
              </div>

              <Reveal className="order-2 lg:order-1">
                <div className="overflow-hidden rounded-[2.1rem] bg-[linear-gradient(135deg,rgba(217,188,158,0.9),rgba(255,245,231,0.95),rgba(188,149,113,0.88))] p-[1px] shadow-[0_28px_68px_rgba(157,120,92,0.14)]">
                  <div className="overflow-hidden rounded-[calc(2.1rem-1px)] bg-[linear-gradient(180deg,rgba(255,252,247,0.94),rgba(245,235,223,0.88))]">
                    <div className="flex items-center justify-between px-5 py-4">
                      <div>
                        <SectionEyebrow>
                          {"\u05ea\u05e6\u05d5\u05d2\u05ea \u05d4\u05de\u05d9\u05e7\u05d5\u05dd"}
                        </SectionEyebrow>
                        <p className="mt-2 font-serif text-[1.9rem] text-[#2f2118]">{content.contactPage.directionsTitle}</p>
                      </div>
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#eadfd4] bg-white text-[#8e6847]">
                        <SiGooglemaps className="h-5 w-5" />
                      </div>
                    </div>
                    <LazyMapEmbed
                      title={
                        "\u05de\u05e4\u05ea \u05d3\u05e8\u05db\u05d9 \u05d4\u05d2\u05e2\u05d4 \u05dc\u05d1\u05d9\u05ea \u05de\u05d3\u05e8\u05e9 \u05e1\u05e4\u05e8\u05d0"
                      }
                      src={content.contactPage.mapEmbedUrl}
                    />
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <HomeLikeFooter content={content} />
    </div>
  );
}
