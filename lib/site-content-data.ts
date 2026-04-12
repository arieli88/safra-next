import { cache } from "react";

import { getSiteContent } from "@/lib/site-content-store";
import { withStaticSiteCopy } from "@/lib/static-site-copy";
import type { SiteContent } from "@/lib/types";

export const getRawSiteContent = cache(async (): Promise<SiteContent> => getSiteContent());

export const getStaticSiteContent = cache(async (): Promise<SiteContent> => {
  const content = await getRawSiteContent();
  return withStaticSiteCopy(content);
});

export const getHomePageData = cache(async () => {
  const content = await getStaticSiteContent();

  return {
    content,
    tickerItems: content.ticker,
    aboutIntro: content.about.body.trim(),
    address: content.about.addressText || content.meta.address,
    hours: content.contactPage.hours.filter((hour) => hour.trim()),
  };
});

export const getContactPageData = cache(async () => {
  const content = await getStaticSiteContent();

  return {
    content,
    placeJsonLdSource: content,
  };
});

export const getAccessibilityPageData = cache(async () => {
  const content = await getStaticSiteContent();

  return {
    content,
    visibleLecturers: content.contactPage.lecturers.filter((lecturer) => !lecturer.hidden),
  };
});

export const getAdminPageData = cache(async () => {
  const [content, viewContent] = await Promise.all([getRawSiteContent(), getStaticSiteContent()]);

  return {
    content,
    viewContent,
  };
});
