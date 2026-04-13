"use client";

import { useEffect, useMemo, useState } from "react";

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

function runWhenIdle(callback: () => void) {
  const idleWindow = window as Window &
    typeof globalThis & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

  if (typeof idleWindow.requestIdleCallback === "function") {
    const idleId = idleWindow.requestIdleCallback(() => callback(), {
      timeout: 5000,
    });

    return () => idleWindow.cancelIdleCallback?.(idleId);
  }

  const timeoutId = window.setTimeout(callback, 1600);
  return () => window.clearTimeout(timeoutId);
}

export function LiveTickerStrip({
  initialItems,
}: Readonly<{
  initialItems: TickerItem[];
}>) {
  const initialVisibleItems = useMemo(
    () => getVisibleTickerItems(initialItems),
    [initialItems],
  );
  const [refreshedItems, setRefreshedItems] = useState<string[] | null>(null);

  useEffect(() => {
    let active = true;

    const disposeIdleTask = runWhenIdle(() => {
      void (async () => {
        try {
          const response = await fetch("/api/ticker", { cache: "no-store" });
          if (!response.ok) {
            return;
          }

          const nextItems = (await response.json()) as TickerItem[];
          if (active) {
            setRefreshedItems(getVisibleTickerItems(nextItems));
          }
        } catch {
          // Keep the server-rendered ticker items if refresh fails.
        }
      })();
    });

    return () => {
      active = false;
      disposeIdleTask();
    };
  }, []);

  const items = refreshedItems ?? initialVisibleItems;
  const tickerItems = [...items, ...items];

  return (
    <div className="border-b border-[#e6d8ca]/70 bg-[#fbf6ef]/82">
      <div className="site-section site-shell py-2">
        <div className="live-strip-mask overflow-hidden rounded-full bg-white/75 px-3 py-2 shadow-[0_8px_24px_rgba(163,129,98,0.08)]">
          <div className="marquee-track flex w-max gap-8 whitespace-nowrap text-[0.74rem] text-[#7d6552] sm:text-[0.82rem]">
            {tickerItems.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d1a676]" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
