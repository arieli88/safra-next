"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import type { TickerItem } from "@/lib/types";

const fallbackItems = [
  "יום ראשון | 19:00 | ערב לימוד פתוח",
  "שיח, ארוחה ומפגש באמצע תל אביב",
  "פרשת השבוע נלמדת יחד, לאט ובלי רעש",
];

function getVisibleTickerItems(items: TickerItem[]) {
  const visibleItems = items
    .filter((item) => !item.hidden && item.text.trim())
    .map((item) => item.text.trim());

  return visibleItems.length > 0 ? visibleItems : fallbackItems;
}

export function LiveTickerStrip({
  initialItems,
}: Readonly<{
  initialItems: TickerItem[];
}>) {
  const reduceMotion = useReducedMotion();
  const [items, setItems] = useState(() => getVisibleTickerItems(initialItems));

  useEffect(() => {
    let active = true;

    const refreshTicker = async () => {
      try {
        const response = await fetch("/api/ticker", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const nextItems = (await response.json()) as TickerItem[];
        if (active) {
          setItems(getVisibleTickerItems(nextItems));
        }
      } catch {
        // Keep the current ticker items if the refresh fails.
      }
    };

    refreshTicker();

    return () => {
      active = false;
    };
  }, []);

  const tickerItems = [...items, ...items];

  return (
    <div className="border-b border-[#e6d8ca]/70 bg-[#fbf6ef]/82">
      <div className="site-section site-shell py-2">
        <div className="live-strip-mask overflow-hidden rounded-full bg-white/75 px-3 py-2 shadow-[0_8px_24px_rgba(163,129,98,0.08)]">
          <motion.div
            className="flex w-max gap-8 whitespace-nowrap text-[0.74rem] text-[#7d6552] sm:text-[0.82rem]"
            initial={{ x: 0 }}
            animate={reduceMotion ? undefined : { x: ["0%", "42%"] }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {tickerItems.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d1a676]" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
