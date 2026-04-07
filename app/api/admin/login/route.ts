import { NextResponse } from "next/server";

import { setAdminSession, validateAdminPassword } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };

  if (!body.password || !validateAdminPassword(body.password)) {
    return NextResponse.json({ message: "סיסמה שגויה." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ success: true });
}
