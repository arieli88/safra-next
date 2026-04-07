export function getDisplayImageSrc(src: string): string {
  const trimmed = src.trim();

  if (!trimmed) {
    return "";
  }

  return trimmed;
}

export function getProxiedImageSrc(src: string): string {
  const trimmed = src.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return `/api/image?src=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}
