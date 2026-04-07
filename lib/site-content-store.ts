import { kv } from "@vercel/kv";
import { createClient, type RedisClientType } from "redis";
import { revalidateTag, unstable_cache, unstable_noStore as noStore } from "next/cache";

import { defaultSiteContent } from "@/lib/default-site-content";
import { normalizeNestedDriveLinks } from "@/lib/drive";
import { siteContentSchema, type SiteContent, type TickerItem } from "@/lib/types";

const SITE_CONTENT_KEY = "safra:site-content:v1";
const SITE_CONTENT_CACHE_TAG = "site-content";

function invalidateSiteContentCache() {
  revalidateTag(SITE_CONTENT_CACHE_TAG, "max");
}

declare global {
  var __SAFRA_SITE_CONTENT__: SiteContent | undefined;
  var __SAFRA_REDIS_CLIENT__: RedisClientType | undefined;
}

function hasRedisConfig() {
  return Boolean(process.env.REDIS_URL?.trim());
}

function hasKvConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function assertProductionStoreConfig() {
  if (process.env.NODE_ENV === "production" && !hasRedisConfig() && !hasKvConfig()) {
    throw new Error("Missing REDIS_URL or KV_REST_API_URL / KV_REST_API_TOKEN in production environment.");
  }
}

function normalizeSiteContent(content: SiteContent): SiteContent {
  const merged = {
    ...defaultSiteContent,
    ...content,
    meta: { ...defaultSiteContent.meta, ...content.meta },
    nav: { ...defaultSiteContent.nav, ...content.nav },
    hero: { ...defaultSiteContent.hero, ...content.hero },
    about: { ...defaultSiteContent.about, ...content.about },
    community: {
      ...defaultSiteContent.community,
      ...content.community,
      tracks: content.community?.tracks?.length ? content.community.tracks : defaultSiteContent.community.tracks,
    },
    history: {
      ...defaultSiteContent.history,
      ...content.history,
      media: content.history?.media?.length ? content.history.media : defaultSiteContent.history.media,
    },
    gallery: {
      ...defaultSiteContent.gallery,
      ...content.gallery,
      carousels: content.gallery?.carousels?.length ? content.gallery.carousels : defaultSiteContent.gallery.carousels,
    },
    footer: { ...defaultSiteContent.footer, ...content.footer },
    contactPage: {
      ...defaultSiteContent.contactPage,
      ...content.contactPage,
      cardSettings: {
        ...defaultSiteContent.contactPage.cardSettings,
        ...content.contactPage?.cardSettings,
      },
      lecturers: content.contactPage?.lecturers?.length ? content.contactPage.lecturers : defaultSiteContent.contactPage.lecturers,
      hours: content.contactPage?.hours?.length ? content.contactPage.hours : defaultSiteContent.contactPage.hours,
      navButtons: content.contactPage?.navButtons?.length ? content.contactPage.navButtons : defaultSiteContent.contactPage.navButtons,
    },
  };

  return siteContentSchema.parse(normalizeNestedDriveLinks(merged));
}

async function getRedisClient() {
  if (!hasRedisConfig()) {
    return undefined;
  }

  if (!globalThis.__SAFRA_REDIS_CLIENT__) {
    globalThis.__SAFRA_REDIS_CLIENT__ = createClient({
      url: process.env.REDIS_URL,
    });
    globalThis.__SAFRA_REDIS_CLIENT__.on("error", () => {
      // Keep silent and let callers fallback to KV/local behavior.
    });
  }

  const client = globalThis.__SAFRA_REDIS_CLIENT__;
  if (!client.isOpen) {
    await client.connect();
  }

  return client;
}

async function readSiteContentFromDataSource(): Promise<SiteContent> {
  assertProductionStoreConfig();

  const redisClient = await getRedisClient();
  if (redisClient) {
    const storedContent = await redisClient.get(SITE_CONTENT_KEY);
    if (storedContent) {
      return normalizeSiteContent(JSON.parse(storedContent) as SiteContent);
    }

    const seededContent = normalizeSiteContent(defaultSiteContent);
    await redisClient.set(SITE_CONTENT_KEY, JSON.stringify(seededContent));
    return seededContent;
  }

  if (hasKvConfig()) {
    const storedContent = await kv.get<SiteContent>(SITE_CONTENT_KEY);
    if (storedContent) {
      return normalizeSiteContent(storedContent);
    }

    const seededContent = normalizeSiteContent(defaultSiteContent);
    await kv.set(SITE_CONTENT_KEY, seededContent);
    return seededContent;
  }

  if (!globalThis.__SAFRA_SITE_CONTENT__) {
    globalThis.__SAFRA_SITE_CONTENT__ = normalizeSiteContent(defaultSiteContent);
  }

  return normalizeSiteContent(globalThis.__SAFRA_SITE_CONTENT__);
}

const getCachedSiteContentInternal = unstable_cache(
  async () => readSiteContentFromDataSource(),
  [SITE_CONTENT_CACHE_TAG],
  { tags: [SITE_CONTENT_CACHE_TAG] },
);

export async function getSiteContent(): Promise<SiteContent> {
  return getCachedSiteContentInternal();
}

export async function getHotAlerts(): Promise<TickerItem[]> {
  noStore();
  const content = await readSiteContentFromDataSource();
  return content.ticker;
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  assertProductionStoreConfig();
  const normalizedContent = normalizeSiteContent(content);

  const redisClient = await getRedisClient();
  if (redisClient) {
    await redisClient.set(SITE_CONTENT_KEY, JSON.stringify(normalizedContent));
    invalidateSiteContentCache();
    return normalizedContent;
  }

  if (hasKvConfig()) {
    await kv.set(SITE_CONTENT_KEY, normalizedContent);
    invalidateSiteContentCache();
    return normalizedContent;
  }

  globalThis.__SAFRA_SITE_CONTENT__ = normalizedContent;
  invalidateSiteContentCache();
  return normalizedContent;
}

export async function refreshSiteContentCache() {
  invalidateSiteContentCache();
}
