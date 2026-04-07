import { createHash } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_COOKIE_NAME = "safra_admin_session";

function getAdminPassword() {
  const password = process.env.ADMIN_PASSWORD?.trim();
  if (password) {
    return password;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing ADMIN_PASSWORD in production environment.");
  }

  return "123";
}

function getSessionToken() {
  return createHash("sha256").update(`${getAdminPassword()}::beit-midrash-safra`).digest("hex");
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE_NAME)?.value === getSessionToken();
}

export async function requireAdminAuth() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }
}

export function validateAdminPassword(password: string) {
  return password === getAdminPassword();
}

export async function setAdminSession() {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
