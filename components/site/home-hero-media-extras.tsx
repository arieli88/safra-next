"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import type { SiteContent } from "@/lib/types";

type HomeHeroMediaExtrasProps = {
  heroImages: SiteContent["hero"]["images"];
};

export function HomeHeroMediaExtras({
  heroImages,
}: Readonly<HomeHeroMediaExtrasProps>) {
  const overlayImages = heroImages.slice(1);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (overlayImages.length === 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % (overlayImages.length + 1));
    }, 7000);

    return () => window.clearInterval(intervalId);
  }, [overlayImages.length]);

  if (overlayImages.length === 0) {
    return null;
  }

  return (
    <>
      {overlayImages.map((image, index) => {
        const isVisible = activeIndex === index + 1;

        return (
          <motion.div
            key={`${image.src}-${index}`}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: isVisible ? 1 : 0,
              scale: isVisible ? 1 : 1.02,
            }}
            transition={{ duration: 1.4, ease: "easeInOut" }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1024px) 76vw, 42vw"
              loading="lazy"
              quality={82}
              className="object-cover"
            />
          </motion.div>
        );
      })}
    </>
  );
}
