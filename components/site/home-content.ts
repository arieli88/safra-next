import type { SiteContent } from "@/lib/types";

export type HomeHeroImage =
  | SiteContent["hero"]["images"][number]
  | SiteContent["gallery"]["carousels"][number]["images"][number];

export type HistoryStep = {
  id: string;
  image: SiteContent["history"]["media"][number]["image"];
  href?: string;
  hrefLabel?: string;
};

export function getPrimaryCta(content: SiteContent) {
  if (
    content.hero.ctaLabel.trim() &&
    content.hero.ctaHref.trim() &&
    !content.hero.ctaHidden
  ) {
    return { label: content.hero.ctaLabel, href: content.hero.ctaHref };
  }

  return { label: "בואו לפגוש את ספרא", href: "/contact" };
}

export function getHeroImages(content: SiteContent) {
  return content.hero.images.filter(
    (image) => !image.hidden && image.src.trim(),
  );
}

export function getHeroImage(content: SiteContent): HomeHeroImage | undefined {
  return (
    getHeroImages(content)[0] ??
    content.gallery.carousels
      .flatMap((carousel) => carousel.images)
      .find((image) => !image.hidden && image.src.trim()) ??
    content.history.media.find((media) => media.image.src.trim())?.image
  );
}

export function splitHeroTitle(title: string) {
  const cleaned = title.trim();
  const lastSpace = cleaned.lastIndexOf(" ");

  return lastSpace > 0
    ? { lead: cleaned.slice(0, lastSpace), glow: cleaned.slice(lastSpace + 1) }
    : { lead: cleaned, glow: "להתחבר." };
}

export function splitLeadWord(text: string) {
  const [first, ...rest] = text.trim().split(/\s+/);
  return { first: first ?? "", rest: rest.join(" ") };
}

export function getGalleryImages(content: SiteContent) {
  return content.gallery.carousels
    .flatMap((carousel) => carousel.images)
    .filter((image) => !image.hidden && image.src.trim())
    .slice(0, 6);
}

export function getHistorySteps(content: SiteContent): HistoryStep[] {
  return content.history.media.slice(0, 3).map((media) => ({
    id: media.id,
    image: media.image,
    href: media.linkHref,
    hrefLabel: media.image.caption || media.linkLabel,
  }));
}
