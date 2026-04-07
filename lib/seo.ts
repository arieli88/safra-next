import type { Metadata } from "next";

import type { SiteContent } from "@/lib/types";

import { getSiteUrl } from "./site-url";

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
};

function getAbsoluteUrl(path = "/") {
  const siteUrl = getSiteUrl();
  return new URL(path, `${siteUrl}/`).toString();
}

function getEmailAddress(mailtoOrEmail: string) {
  return mailtoOrEmail.replace(/^mailto:/i, "");
}

function getTelephone(content: SiteContent) {
  return content.contactPage.lecturers.find((lecturer) => !lecturer.hidden)?.phone ?? "";
}

export function createPageMetadata({ title, description, path = "/", keywords = [] }: PageSeoInput): Metadata {
  const absoluteUrl = getAbsoluteUrl(path);
  const socialImage = getAbsoluteUrl("/opengraph-image");
  const titleWithBrand = path === "/" ? title : `${title} | בית מדרש ספרא`;

  return {
    title: titleWithBrand,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: titleWithBrand,
      description,
      url: absoluteUrl,
      siteName: "בית מדרש ספרא",
      locale: "he_IL",
      type: "website",
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: "בית מדרש ספרא",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titleWithBrand,
      description,
      images: [socialImage],
    },
  };
}

export function buildOrganizationJsonLd(content: SiteContent) {
  const email = getEmailAddress(content.meta.email);
  const telephone = getTelephone(content);
  const sameAs = [content.meta.instagramUrl, content.meta.facebookUrl].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "ReligiousOrganization",
    "@id": getAbsoluteUrl("/#organization"),
    name: content.nav.title,
    url: getAbsoluteUrl("/"),
    description: content.meta.description,
    logo: getAbsoluteUrl("/icons/icon-512.png"),
    image: getAbsoluteUrl("/opengraph-image"),
    email,
    telephone,
    address: {
      "@type": "PostalAddress",
      streetAddress: content.meta.address,
      addressLocality: "תל אביב-יפו",
      addressCountry: "IL",
    },
    sameAs,
  };
}

export function buildWebsiteJsonLd(content: SiteContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": getAbsoluteUrl("/#website"),
    url: getAbsoluteUrl("/"),
    name: content.nav.title,
    description: content.meta.description,
    inLanguage: "he-IL",
  };
}

export function buildPlaceJsonLd(content: SiteContent) {
  const email = getEmailAddress(content.meta.email);
  const telephone = getTelephone(content);

  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": getAbsoluteUrl("/contact#place"),
    name: content.footer.title,
    description: content.contactPage.description,
    url: getAbsoluteUrl("/contact"),
    image: getAbsoluteUrl("/opengraph-image"),
    address: {
      "@type": "PostalAddress",
      streetAddress: content.meta.address,
      addressLocality: "תל אביב-יפו",
      addressCountry: "IL",
    },
    telephone,
    email,
    hasMap: content.contactPage.mapEmbedUrl,
    openingHoursSpecification: content.contactPage.hours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      description: hours,
    })),
  };
}
