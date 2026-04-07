/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LightboxImage } from "@/components/site/lightbox-image";
import { getDisplayImageSrc, getProxiedImageSrc } from "@/lib/image-proxy";
import type { SiteContent } from "@/lib/types";

type HeroProps = {
  hero: SiteContent["hero"];
  address: string;
  resourcesLink: string;
};

export function Hero({ hero, address, resourcesLink }: Readonly<HeroProps>) {
  const visibleImages = hero.images.filter((image) => !image.hidden && image.src.trim());
  const [activeIndex, setActiveIndex] = useState(0);
  const safeActiveIndex = visibleImages.length === 0 ? 0 : activeIndex % visibleImages.length;

  useEffect(() => {
    if (visibleImages.length < 2) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % visibleImages.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [visibleImages.length]);

  const infoCards = hero.infoCards.length > 0
    ? hero.infoCards.filter((card) => !card.hidden)
    : [
        {
          id: "resources-fallback",
          eyebrow: "חומרים",
          title: "גישה מהירה לקבצים ולתכנים",
          href: resourcesLink,
          hidden: false,
        },
      ];

  return (
    <section className="relative isolate overflow-hidden px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
        <div className="relative min-h-[52vh] overflow-hidden rounded-[2.25rem] soft-ring sm:min-h-[64vh]">
          <div className="absolute inset-0 z-10 bg-gradient-to-tr from-foreground/75 via-foreground/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-10 h-52 bg-gradient-to-t from-black/45 to-transparent" />

          {visibleImages.map((image, index) => (
            <div key={`${image.src}-${index}`} className={`hero-fade absolute inset-0 ${index === safeActiveIndex ? "opacity-100" : "opacity-0"}`}>
              <img
                src={getDisplayImageSrc(image.src)}
                alt={image.alt}
                className="h-full w-full object-cover"
                loading={index === 0 ? "eager" : "lazy"}
                onError={(event) => {
                  const proxied = getProxiedImageSrc(image.src);
                  if (proxied && event.currentTarget.src !== new URL(proxied, window.location.origin).toString()) {
                    event.currentTarget.src = proxied;
                  }
                }}
              />
            </div>
          ))}

          <div className="relative z-20 flex h-full flex-col justify-end p-6 text-center sm:p-8 sm:text-right lg:p-10">
            <div className="inline-flex w-fit items-center self-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold text-white backdrop-blur sm:self-auto">
              {hero.eyebrow}
            </div>
            <h1 className="mt-4 max-w-2xl self-center font-serif text-3xl font-bold leading-tight text-white sm:self-auto sm:text-5xl lg:text-6xl">
              {hero.title}
            </h1>
            <p className="mt-4 max-w-xl self-center whitespace-pre-line text-base leading-8 text-white/90 sm:self-auto sm:text-lg">{hero.body}</p>
          </div>

          {visibleImages[safeActiveIndex] ? (
            <div className="absolute left-6 top-6 z-20 hidden w-28 md:block">
              <LightboxImage
                src={visibleImages[safeActiveIndex].src}
                alt={visibleImages[safeActiveIndex].alt}
                aspectClassName="aspect-square"
                className="rounded-[1.2rem]"
                imageClassName="object-cover"
              />
            </div>
          ) : null}

          {visibleImages.length > 1 ? (
            <div className="absolute bottom-6 left-6 z-20 flex gap-2">
              {visibleImages.map((image, index) => (
                <button
                  key={image.src}
                  type="button"
                  aria-label={`מעבר לתמונה ${index + 1}`}
                  className={`h-2.5 rounded-full transition ${index === safeActiveIndex ? "w-10 bg-white" : "w-2.5 bg-white/45"}`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="hero-card relative overflow-hidden rounded-[2.25rem] p-6 sm:p-8 lg:p-10">
          <div className="absolute -left-10 top-6 h-32 w-32 rounded-full bg-brand-soft/70 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.35em] text-brand sm:text-right">{hero.infoEyebrow}</p>
            <p className="mt-6 rounded-[1.5rem] border border-brand/10 bg-white/82 p-5 text-center text-base leading-8 text-muted sm:text-right sm:text-lg">
              {address}
            </p>

            {!hero.ctaHidden || !hero.secondaryCtaHidden ? (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {!hero.ctaHidden ? (
                  <Link
                    href={hero.ctaHref}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-l from-brand to-brand-dark px-6 py-3 text-base font-bold text-white shadow-lg shadow-brand/20 transition hover:-translate-y-0.5"
                  >
                    {hero.ctaLabel}
                  </Link>
                ) : null}
                {!hero.secondaryCtaHidden ? (
                  <Link
                    href={hero.secondaryCtaHref}
                    className="inline-flex items-center justify-center rounded-full border border-brand/15 bg-white px-6 py-3 text-base font-bold text-foreground transition hover:border-brand/35 hover:text-brand"
                  >
                    {hero.secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {infoCards.map((card) => {
                const href = card.id === "resources-fallback" ? resourcesLink : card.href;
                const isExternal = href.startsWith("http");

                return (
                  <Link
                    key={card.id}
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noreferrer" : undefined}
                    className="rounded-[1.5rem] border border-brand/10 bg-white/88 p-5 transition hover:-translate-y-0.5 hover:border-brand/25"
                  >
                    <p className="text-center text-sm font-semibold text-brand sm:text-right">{card.eyebrow}</p>
                    <p className="mt-2 text-center text-base font-bold text-foreground sm:text-right">{card.title}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
