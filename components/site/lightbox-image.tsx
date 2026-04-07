/* eslint-disable @next/next/no-img-element */

"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { getDisplayImageSrc, getProxiedImageSrc } from "@/lib/image-proxy";

type LightboxImageProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  aspectClassName?: string;
};

export function LightboxImage({
  src,
  alt,
  className = "",
  imageClassName = "",
  aspectClassName = "aspect-[4/3]",
}: Readonly<LightboxImageProps>) {
  const safeSrc = src.trim();
  const displaySrc = getDisplayImageSrc(safeSrc);
  const proxiedSrc = getProxiedImageSrc(safeSrc);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSrc, setActiveSrc] = useState(displaySrc);

  useEffect(() => {
    setActiveSrc(displaySrc);
  }, [displaySrc]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const fullscreenLayer =
    typeof window !== "undefined" && isOpen && activeSrc
      ? createPortal(
          <div className="fixed inset-0 z-[999] bg-black" onClick={() => setIsOpen(false)}>
            <button
              type="button"
              aria-label="סגירת תצוגת תמונה"
              className="absolute left-4 top-4 z-[1000] inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-full w-full items-center justify-center p-2 sm:p-6" onClick={(event) => event.stopPropagation()}>
              <img
                src={activeSrc}
                alt={alt}
                className="h-full w-full object-contain"
                onError={(event) => {
                  if (proxiedSrc && event.currentTarget.src !== new URL(proxiedSrc, window.location.origin).toString()) {
                    setActiveSrc(proxiedSrc);
                  }
                }}
              />
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      {!activeSrc ? (
        <div className={`group block w-full text-right ${className}`}>
          <div className={`image-hover-shell relative flex items-center justify-center overflow-hidden ${aspectClassName}`}>
            <span className="px-4 text-center text-sm font-semibold text-muted">לא הוגדרה תמונה</span>
          </div>
        </div>
      ) : (
        <button type="button" className={`group block w-full text-right ${className}`} onClick={() => setIsOpen(true)}>
          <div className={`image-hover-shell relative overflow-hidden ${aspectClassName}`}>
            <img
              src={activeSrc}
              alt={alt}
              className={`h-full w-full image-hover-media ${imageClassName}`}
              loading="lazy"
              onError={(event) => {
                if (proxiedSrc && event.currentTarget.src !== new URL(proxiedSrc, window.location.origin).toString()) {
                  setActiveSrc(proxiedSrc);
                }
              }}
            />
            <div className="pointer-events-none absolute inset-0 bg-black/8 opacity-0 transition group-hover:opacity-100" />
          </div>
        </button>
      )}

      {fullscreenLayer}
    </>
  );
}
