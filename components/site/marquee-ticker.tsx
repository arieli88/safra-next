"use client";

import { useEffect, useState } from "react";

import type { TickerItem } from "@/lib/types";

export function MarqueeTicker({ items }: Readonly<{ items: TickerItem[] }>) {
  const [paused, setPaused] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reducedByToolbar = document.documentElement.dataset.accessibilityMotion === "reduced";
    return reducedMotion || reducedByToolbar;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new MutationObserver(() => {
      const reducedByToolbar = document.documentElement.dataset.accessibilityMotion === "reduced";
      setPaused(mediaQuery.matches || reducedByToolbar);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-accessibility-motion"],
    });

    const handleMotionChange = (event: MediaQueryListEvent) => {
      const reducedByToolbar = document.documentElement.dataset.accessibilityMotion === "reduced";
      setPaused(event.matches || reducedByToolbar);
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  if (items.length === 0) {
    return null;
  }

  const duplicatedItems = [...items, ...items];

  return (
    <section className="border-b border-brand/10 bg-brand text-white" aria-label="עדכונים שוטפים">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-2 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold">עדכונים שוטפים</p>

        <div className="sr-only">
          <ul>
            {items.map((item) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
        </div>

        <div className="overflow-hidden" aria-hidden="true">
          <div className="marquee-track flex min-w-max items-center gap-4" data-paused={paused ? "true" : "false"}>
            {duplicatedItems.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center gap-4 whitespace-nowrap text-sm font-semibold">
                <span className="text-accent">•</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
