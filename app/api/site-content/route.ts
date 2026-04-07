import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/auth";
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

  return NextResponse.json(saved);
}
