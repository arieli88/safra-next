"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

import { LightboxImage } from "@/components/site/lightbox-image";
import { Reveal } from "@/components/site/reveal";
import type { Carousel } from "@/lib/types";

export function ImageCarousel({ carousel }: Readonly<{ carousel: Carousel }>) {
  const visibleImages = carousel.images.filter((image) => !image.hidden && image.src.trim());
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    direction: "rtl",
    loop: visibleImages.length > 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || visibleImages.length < 2) {
      return;
    }

    const interval = window.setInterval(() => emblaApi.scrollNext(), 4200);
    return () => window.clearInterval(interval);
  }, [visibleImages.length, emblaApi]);

  if (visibleImages.length === 0) {
    return null;
  }

  return (
    <Reveal className="h-full">
      <div className="glass-card h-full overflow-hidden rounded-[2rem] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4 text-center sm:text-right">
          <div className="w-full sm:w-auto">
            <h3 className="font-serif text-2xl font-bold text-foreground">{carousel.title}</h3>
            <p className="mt-2 max-w-2xl text-base leading-7 text-muted">{carousel.description}</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand/15 bg-white text-xl text-brand transition hover:border-brand/35"
              aria-label="הקודם"
              onClick={() => emblaApi?.scrollPrev()}
            >
              ‹
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand/15 bg-white text-xl text-brand transition hover:border-brand/35"
              aria-label="הבא"
              onClick={() => emblaApi?.scrollNext()}
            >
              ›
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden" ref={emblaRef}>
          <div className="-mr-4 flex">
            {visibleImages.map((image, index) => (
              <div key={`${image.src}-${index}`} className="min-w-0 flex-[0_0_100%] pr-4 md:flex-[0_0_50%] xl:flex-[0_0_33.333%]">
                <LightboxImage src={image.src} alt={image.alt} aspectClassName="h-56 sm:h-80" imageClassName="object-cover" />
                {image.caption ? <p className="mt-3 text-center text-sm text-muted sm:text-right">{image.caption}</p> : null}
              </div>
            ))}
          </div>
        </div>

        {visibleImages.length > 1 ? (
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {visibleImages.map((image, index) => (
              <button
                key={`${image.src}-dot`}
                type="button"
                className={`h-2.5 rounded-full transition ${index === selectedIndex ? "w-8 bg-brand" : "w-2.5 bg-brand/30"}`}
                aria-label={`מעבר לשקופית ${index + 1}`}
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}
