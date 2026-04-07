import { getSiteUrl } from "@/lib/site-url";

const DEFAULT_INDEXNOW_KEY = "9feebe91b2d84e268323b003a90915cc";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

function getIndexNowKey() {
  return process.env.INDEXNOW_KEY?.trim() || DEFAULT_INDEXNOW_KEY;
}

function getKeyLocation() {
  const siteUrl = getSiteUrl();
  const key = getIndexNowKey();
  return `${siteUrl}/${key}.txt`;
}

export function getDefaultIndexNowUrls() {
  const siteUrl = getSiteUrl();

  return [`${siteUrl}/`, `${siteUrl}/contact`, `${siteUrl}/accessibility`];
}

export async function submitIndexNowUrls(urls: string[]) {
  const dedupedUrls = [...new Set(urls.filter(Boolean))];
  if (!dedupedUrls.length) {
    return { ok: true as const };
  }

  const siteUrl = new URL(getSiteUrl());
  const key = getIndexNowKey();

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host: siteUrl.host,
      key,
      keyLocation: getKeyLocation(),
      urlList: dedupedUrls,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`IndexNow submission failed with status ${response.status}.`);
  }

  return { ok: true as const };
}

export async function submitDefaultIndexNowUrls() {
  return submitIndexNowUrls(getDefaultIndexNowUrls());
}
