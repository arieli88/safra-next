import type { Metadata } from "next";

import { ContactExperience } from "@/components/site/contact-experience";
import { buildPlaceJsonLd, createPageMetadata, stringifyJsonLd } from "@/lib/seo";
import { getContactPageData } from "@/lib/site-content-data";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getContactPageData();

  return createPageMetadata({
    title: "צור קשר, דרכי הגעה ושעות פעילות",
    description: content.contactPage.description,
    path: "/contact",
    keywords: [...content.meta.keywords, "צור קשר", "דרכי הגעה", "שעות פעילות"],
  });
}

export default async function ContactPage() {
  const { content } = await getContactPageData();
  const placeJsonLd = buildPlaceJsonLd(content);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(placeJsonLd) }}
      />
      <ContactExperience content={content} />
    </>
  );
}
