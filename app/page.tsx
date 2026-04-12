import type { Metadata } from "next";

import { HomeLanding } from "@/components/site/home-landing";
import { getChronicleInfo } from "@/lib/calendar";
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import { getHotAlerts, getSiteContent } from "@/lib/site-content-store";
import { withStaticSiteCopy } from "@/lib/static-site-copy";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = withStaticSiteCopy(await getSiteContent());

  return createPageMetadata({
    title: content.meta.title,
    description: content.meta.description,
    keywords: content.meta.keywords,
  });
}

export default async function HomePage() {
  const [content, hotAlerts] = await Promise.all([getSiteContent(), getHotAlerts()]);
  const chronicle = getChronicleInfo();
  const staticContent = withStaticSiteCopy(content);
  const organizationJsonLd = buildOrganizationJsonLd(staticContent);
  const websiteJsonLd = buildWebsiteJsonLd(staticContent);
  const aboutIntro = staticContent.about.body.trim();
  const address = staticContent.about.addressText || staticContent.meta.address;
  const hours = staticContent.contactPage.hours.filter((hour) => hour.trim());

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <HomeLanding content={{ ...staticContent, ticker: hotAlerts }} chronicle={chronicle} />
    </>
  );
}
