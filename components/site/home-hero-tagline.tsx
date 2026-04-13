"use client";

import dynamic from "next/dynamic";

const TrueFocus = dynamic(() => import("@/components/site/true-focus"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[2.8rem] flex-wrap items-center gap-[0.65em] sm:min-h-[3.2rem]">
      {["לימוד", "שיחה", "קהילה"].map((word) => (
        <span
          key={word}
          className="text-[1.15rem] font-black leading-[1.2] text-[#473122] sm:text-[clamp(1.35rem,2vw,1.9rem)]"
        >
          {word}
        </span>
      ))}
    </div>
  ),
});

export function HomeHeroTagline() {
  return (
    <TrueFocus
      sentence="לימוד שיחה קהילה"
      manualMode={false}
      blurAmount={0}
      borderColor="#7a5334"
      glowColor="rgba(122, 83, 52, 0.24)"
      animationDuration={0.5}
      pauseBetweenAnimations={0.5}
    />
  );
}
