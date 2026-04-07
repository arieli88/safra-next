import type { ChronicleInfo } from "@/lib/calendar";

export function ChronicleBar({ chronicle }: Readonly<{ chronicle: ChronicleInfo }>) {
  return (
    <section className="border-b border-brand/10 bg-[#f8f1e8] px-4 py-2 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs font-semibold text-foreground sm:text-sm">
          <span>{chronicle.weekdayLabel}</span>
          <span className="text-brand/50">|</span>
          <span>{chronicle.hebrewDate}</span>
          <span className="text-brand/50">|</span>
          <span>{chronicle.gregorianDate}</span>
          <span className="text-brand/50">|</span>
          <span className="font-bold text-brand">פרשת השבוע: {chronicle.parshaLabel}</span>
        </p>
      </div>
    </section>
  );
}
