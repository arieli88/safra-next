import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get("src")?.trim();

  if (!src) {
    return NextResponse.json({ message: "Missing src" }, { status: 400 });
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(src);
  } catch {
    return NextResponse.json({ message: "Invalid image URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json({ message: "Unsupported protocol" }, { status: 400 });
  }

  const response = await fetch(parsedUrl.toString(), {
    headers: {
      "user-agent": "Mozilla/5.0 SafraImageProxy/1.0",
    },
    redirect: "follow",
    cache: "no-store",
  });

  if (!response.ok) {
    return NextResponse.json({ message: "Failed to fetch image" }, { status: response.status });
  }

  const contentType = response.headers.get("content-type") ?? "image/jpeg";
  const buffer = await response.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
