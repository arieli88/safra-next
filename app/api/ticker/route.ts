import { NextResponse } from "next/server";

import { getHotAlerts } from "@/lib/site-content-store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const items = await getHotAlerts();

  return NextResponse.json(items, {
    headers: {
      "cache-control": "no-store, no-cache, max-age=0, must-revalidate",
    },
  });
}
