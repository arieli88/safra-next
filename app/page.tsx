import type { Metadata } from "next";

import { HomeLanding } from "@/components/site/home-landing";
import { getChronicleInfo } from "@/lib/calendar";
import {
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  createPageMetadata,
  stringifyJsonLd,
} from "@/lib/seo";
import { getHomePageData } from "@/lib/site-content-data";

export async function generateMetadata(): Promise<Metadata> {
  const { content } = await getHomePageData();

  return createPageMetadata({
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
  });
}

export default async function HomePage() {
  const { content, tickerItems, aboutIntro, address, hours } = await getHomePageData();
  const chronicle = getChronicleInfo();
  const faqJsonLd = buildFaqJsonLd();
  const organizationJsonLd = buildOrganizationJsonLd(content);
  const websiteJsonLd = buildWebsiteJsonLd(content);

  return (
    <>
      <section
        aria-label="מידע מקדים"
        className="sr-only"
      >
        <p>{aboutIntro}</p>
        <p>כתובת: {address}</p>
        <p>זמני פעילות:</p>
        <ul>
          {hours.map((hour) => (
            <li key={hour}>{hour}</li>
          ))}
        </ul>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(faqJsonLd) }}
      />
      <HomeLanding
        content={content}
        chronicle={chronicle}
        initialTickerItems={tickerItems}
      />
    </>
  );
}
