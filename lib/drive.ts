const GOOGLE_DRIVE_PATTERNS = [
  /https?:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view(?:\?.*)?$/i,
  /https?:\/\/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)(?:&.*)?$/i,
  /https?:\/\/drive\.google\.com\/uc\?id=([a-zA-Z0-9_-]+)(?:&.*)?$/i,
];

export function normalizeDriveImageLink(value: string): string {
  const trimmed = value.trim();

  for (const pattern of GOOGLE_DRIVE_PATTERNS) {
    const match = trimmed.match(pattern);

    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
  }

  return trimmed;
}

export function normalizeNestedDriveLinks<T>(value: T): T {
  if (typeof value === "string") {
    return normalizeDriveImageLink(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeNestedDriveLinks(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeNestedDriveLinks(nestedValue)]),
    ) as T;
  }

  return value;
}
