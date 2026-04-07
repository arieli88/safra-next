import type { ReactNode } from "react";

import { Reveal } from "@/components/site/reveal";

export function SectionShell({
  id,
  eyebrow = "בית מדרש ספרא",
  title,
  description,
  children,
}: Readonly<{
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
}>) {
  return (
    <section id={id} className="section-anchor section-frame px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col gap-5 text-center lg:flex-row lg:items-end lg:justify-between lg:text-right">
            <div className="mx-auto max-w-3xl lg:mx-0">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-brand">{eyebrow}</p>
              <h2 className="font-serif text-4xl font-bold text-foreground sm:text-5xl">{title}</h2>
            </div>
            {description ? <p className="mx-auto max-w-2xl text-base leading-8 text-muted sm:text-lg lg:mx-0">{description}</p> : null}
          </div>
        </Reveal>

        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
