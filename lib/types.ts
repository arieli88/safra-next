import { z } from "zod";

export const linkSchema = z.object({
  label: z.string(),
  href: z.string(),
  external: z.boolean().optional(),
});

export const heroInfoCardSchema = z.object({
  id: z.string(),
  eyebrow: z.string(),
  title: z.string(),
  href: z.string(),
  hidden: z.boolean().optional(),
});

export const imageAssetSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
  hidden: z.boolean().optional(),
});

export const tickerItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  hidden: z.boolean().optional(),
});

export const communityTrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  schedule: z.string(),
  description: z.string(),
  flyerImage: imageAssetSchema.optional(),
  whatsappLabel: z.string(),
  whatsappUrl: z.string(),
  hidden: z.boolean().optional(),
});

export const historyMediaSchema = z.object({
  id: z.string(),
  image: imageAssetSchema,
  linkLabel: z.string().optional(),
  linkHref: z.string().optional(),
});

export const carouselSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  images: z.array(imageAssetSchema),
});

export const lecturerSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  program: z.string(),
  bio: z.string(),
  image: imageAssetSchema,
  hidden: z.boolean().optional(),
});

export const travelButtonSchema = z.object({
  id: z.string(),
  label: z.string(),
  href: z.string(),
  kind: z.enum(["waze", "moovit"]),
});

export const contactCardSettingsSchema = z.object({
  imageBlurPx: z.number(),
  tiltStrength: z.number(),
  spotlightEnabled: z.boolean(),
  mobileColumns: z.enum(["1", "2"]),
});

export const siteContentSchema = z.object({
  meta: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    ogImage: z.string(),
    logoUrl: z.string(),
    address: z.string(),
    email: z.string(),
    resourcesLink: z.string(),
    instagramUrl: z.string(),
    facebookUrl: z.string(),
  }),
  nav: z.object({
    title: z.string(),
    subtitle: z.string(),
    links: z.array(linkSchema),
  }),
  ticker: z.array(tickerItemSchema),
  hero: z.object({
    eyebrow: z.string(),
    title: z.string(),
    body: z.string(),
    ctaLabel: z.string(),
    ctaHref: z.string(),
    ctaHidden: z.boolean().optional(),
    secondaryCtaLabel: z.string(),
    secondaryCtaHref: z.string(),
    secondaryCtaHidden: z.boolean().optional(),
    infoEyebrow: z.string(),
    infoCards: z.array(heroInfoCardSchema),
    images: z.array(imageAssetSchema),
  }),
  about: z.object({
    eyebrow: z.string(),
    title: z.string(),
    body: z.string(),
    cardEyebrow: z.string(),
    cardTitle: z.string(),
    cardBody: z.string(),
    addressLabel: z.string(),
    addressText: z.string(),
  }),
  community: z.object({
    eyebrow: z.string(),
    title: z.string(),
    footnote: z.string(),
    lecturersCtaLabel: z.string(),
    lecturersCtaHref: z.string(),
    tracks: z.array(communityTrackSchema),
  }),
  history: z.object({
    eyebrow: z.string(),
    title: z.string(),
    body: z.string(),
    media: z.array(historyMediaSchema),
  }),
  gallery: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    carousels: z.array(carouselSchema),
  }),
  footer: z.object({
    title: z.string(),
    address: z.string(),
    quickLinks: z.array(linkSchema),
    socialLinks: z.array(linkSchema),
    mapEmbedUrl: z.string(),
    copyright: z.string(),
  }),
  contactPage: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    backLabel: z.string(),
    cardSettings: contactCardSettingsSchema,
    lecturers: z.array(lecturerSchema),
    hoursTitle: z.string(),
    hours: z.array(z.string()),
    directionsTitle: z.string(),
    directionsText: z.string(),
    navButtons: z.array(travelButtonSchema),
    mapEmbedUrl: z.string(),
  }),
});

export type LinkItem = z.infer<typeof linkSchema>;
export type HeroInfoCard = z.infer<typeof heroInfoCardSchema>;
export type ImageAsset = z.infer<typeof imageAssetSchema>;
export type TickerItem = z.infer<typeof tickerItemSchema>;
export type CommunityTrack = z.infer<typeof communityTrackSchema>;
export type HistoryMedia = z.infer<typeof historyMediaSchema>;
export type Carousel = z.infer<typeof carouselSchema>;
export type Lecturer = z.infer<typeof lecturerSchema>;
export type TravelButton = z.infer<typeof travelButtonSchema>;
export type SiteContent = z.infer<typeof siteContentSchema>;
