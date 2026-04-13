"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { LiveTickerStrip } from "@/components/site/live-ticker-strip";
import type { SiteContent, TickerItem } from "@/lib/types";

type HomeTopBarProps = {
  content: SiteContent;
  infoLineMobile: string;
  infoLineDesktop: string;
  initialTickerItems: TickerItem[];
};

const homeLinks = [
  { label: "בית", href: "#home" },
  { label: "אודות", href: "#about" },
  { label: "קהילה", href: "#community" },
  { label: "היסטוריה", href: "#history" },
  { label: "גלריה", href: "#gallery" },
  { label: "צור קשר", href: "/contact" },
];

export function HomeTopBar({
  content,
  infoLineMobile,
  infoLineDesktop,
  initialTickerItems,
}: Readonly<HomeTopBarProps>) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d9cabb]/70 bg-[#fbf6ef]/97 shadow-[0_10px_24px_rgba(137,105,80,0.06)]">
        <div className="site-section site-shell contents">
          <div className="flex items-center justify-between px-5 py-2.5">
            <Link href="#home" className="group flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-transparent shadow-[0_12px_24px_rgba(134,101,74,0.08)] sm:h-[3.25rem] sm:w-[3.25rem]">
                <Image
                  src={content.meta.logoUrl}
                  alt={content.nav.title}
                  fill
                  sizes="(max-width: 640px) 48px, 52px"
                  className="object-contain p-1 transition duration-300 ease-out group-hover:scale-110"
                />
              </div>
              <div>
                <p className="font-serif text-[1.15rem] leading-none text-[#3f2b1f] sm:text-[1.28rem]">
                  {content.nav.title}
                </p>
                <p className="hidden text-[0.76rem] text-[#8a7461] sm:block">
                  {content.nav.subtitle}
                </p>
              </div>
            </Link>

            <nav
              className="hidden items-center gap-1.5 rounded-full border border-[#e6d8ca] bg-white p-1.5 text-[0.82rem] font-medium text-[#6e5848] shadow-[0_12px_24px_rgba(134,101,74,0.06)] md:flex"
              aria-label="ניווט ראשי"
            >
              {homeLinks.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  className="whitespace-nowrap rounded-full px-3.5 py-1.5 transition hover:bg-[#fffdf9] hover:text-[#2c2018]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d6ca] bg-white text-[#3f2b1f] shadow-[0_12px_24px_rgba(134,101,74,0.08)] md:hidden"
              aria-label={menuOpen ? "סגירת תפריט ניווט" : "פתיחת תפריט ניווט"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {menuOpen ? (
            <nav
              className="grid gap-2 border-t border-[#e6d8ca]/80 pb-4 pt-3 md:hidden"
              aria-label="תפריט ניווט"
            >
              {homeLinks.map((link) => (
                <Link
                  key={`${link.label}-${link.href}-mobile`}
                  href={link.href}
                  className="rounded-[1.1rem] bg-white px-3.5 py-2.5 text-[0.85rem] font-medium text-[#5f4b3d] transition hover:bg-[#fffdf9]"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </header>

      <div className="pt-[4.5rem] sm:pt-[5rem]">
        <div className="border-b border-[#d4a373] bg-[linear-gradient(180deg,#fff3df_0%,#f4dcc1_100%)] shadow-[0_10px_22px_rgba(137,105,80,0.1)]">
          <div className="site-section px-3 py-2 text-center font-black text-[#7a2f0b] sm:px-2">
            <p className="mx-auto max-w-full whitespace-nowrap text-[clamp(0.52rem,2.95vw,0.96rem)] leading-none tracking-[-0.034em] drop-shadow-[0_1px_0_rgba(255,248,240,0.72)] sm:hidden">
              {infoLineMobile}
            </p>
            <p className="mx-auto hidden max-w-full whitespace-nowrap text-[clamp(0.86rem,1.72vw,1.14rem)] leading-none tracking-[-0.018em] drop-shadow-[0_1px_0_rgba(255,248,240,0.72)] sm:block">
              {infoLineDesktop}
            </p>
          </div>
        </div>
        <LiveTickerStrip initialItems={initialTickerItems} />
      </div>
    </>
  );
}
