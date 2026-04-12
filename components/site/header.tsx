"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import type { SiteContent } from "@/lib/types";

type HeaderProps = {
  nav: SiteContent["nav"];
  logoUrl: string;
  linksOverride?: SiteContent["nav"]["links"];
};

export function Header({ nav, logoUrl, linksOverride }: Readonly<HeaderProps>) {
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return undefined;

    const triggerElement = triggerRef.current;
    const selectors = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "[tabindex]:not([tabindex='-1'])",
    ].join(", ");

    const getFocusableElements = () =>
      Array.from(drawerRef.current?.querySelectorAll<HTMLElement>(selectors) ?? []).filter(
        (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
      );

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerElement?.focus();
    };
  }, [open]);

  const links = linksOverride ?? nav.links;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d9cabb]/70 bg-[#fbf6ef]/97 shadow-[0_10px_24px_rgba(137,105,80,0.06)]">
        <div className="site-section site-shell contents">
          <div className="flex items-center justify-between px-5 py-2.5">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-transparent shadow-[0_12px_24px_rgba(134,101,74,0.08)] sm:h-[3.25rem] sm:w-[3.25rem]">
                <Image
                  src={logoUrl}
                  alt={nav.title}
                  fill
                  sizes="(max-width: 640px) 48px, 52px"
                  className="object-contain p-1 transition duration-300 ease-out group-hover:scale-110"
                />
              </div>
              <div>
                <p className="font-serif text-[1.15rem] leading-none text-[#3f2b1f] sm:text-[1.28rem]">{nav.title}</p>
                <p className="hidden text-[0.76rem] text-[#8a7461] sm:block">{nav.subtitle}</p>
              </div>
            </Link>

            <nav
              className="hidden items-center gap-1.5 rounded-full border border-[#e6d8ca] bg-white p-1.5 text-[0.82rem] font-medium text-[#6e5848] shadow-[0_12px_24px_rgba(134,101,74,0.06)] md:flex"
              aria-label="ניווט ראשי"
            >
              {links.map((link) => (
                <Link
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="whitespace-nowrap rounded-full px-3.5 py-1.5 transition hover:bg-[#fffdf9] hover:text-[#2c2018]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <button
              ref={triggerRef}
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d6ca] bg-white text-[#3f2b1f] shadow-[0_12px_24px_rgba(134,101,74,0.08)] md:hidden"
              aria-controls={drawerId}
              aria-expanded={open}
              aria-haspopup="dialog"
              aria-label={open ? "סגירת תפריט ניווט" : "פתיחת תפריט ניווט"}
              onClick={() => setOpen((current) => !current)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      <div aria-hidden="true" className="h-[4.5rem] sm:h-[5rem]" />

      {open ? (
        <>
          <div className="fixed inset-0 z-[60] bg-foreground/30 transition" aria-hidden="true" onClick={() => setOpen(false)} />
          <aside
            id={drawerId}
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="תפריט ניווט לנייד"
            className="fixed inset-x-4 top-4 z-[70] flex max-h-[calc(100vh-2rem)] flex-col gap-6 overflow-y-auto rounded-[1.7rem] border border-[#e6d8ca] bg-[#fff9f3] p-5 shadow-2xl transition duration-300 md:left-auto md:right-4 md:w-[19.2rem]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-[1.45rem] font-bold text-foreground">{nav.title}</p>
                <p className="mt-1 text-[0.8rem] text-muted">ניווט מהיר ונגיש</p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e3d6ca] bg-white text-[#3f2b1f]"
                aria-label="סגירת תפריט הניווט"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-3" aria-label="קישורי ניווט">
              {links.map((link) => (
                <Link
                  key={`${link.label}-${link.href}-mobile`}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="rounded-[1.1rem] border border-[#e6d8ca] bg-white px-3.5 py-2.5 text-[0.95rem] font-semibold text-[#5f4b3d] transition hover:bg-[#fffdf9] hover:text-[#2c2018]"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      ) : null}
    </>
  );
}
