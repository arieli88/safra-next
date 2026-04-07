import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
import { submitDefaultIndexNowUrls } from "@/lib/indexnow";
import { saveSiteContent, getSiteContent } from "@/lib/site-content-store";
import { siteContentSchema } from "@/lib/types";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json();
  const parsed = siteContentSchema.parse(payload);
  const saved = await saveSiteContent(parsed);

  try {
    await submitDefaultIndexNowUrls();
  } catch (error) {
    console.error("IndexNow submission failed", error);
  }

  return NextResponse.json(saved);
}
