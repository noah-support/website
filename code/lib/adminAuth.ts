import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readToken, secretsMatch, signToken } from "@/lib/signed";

const COOKIE = "noah_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

type AdminToken = { role: "admin"; exp: number };

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD?.trim() && sessionSecret());
}

export async function isAdmin() {
  const secret = sessionSecret();
  if (!secret) return false;
  const jar = await cookies();
  const token = readToken<AdminToken>(jar.get(COOKIE)?.value, secret);
  return Boolean(token && token.role === "admin" && token.exp > Date.now());
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function loginAdmin(password: string) {
  const expected = process.env.ADMIN_PASSWORD?.trim() || "";
  const secret = sessionSecret();
  if (!expected || !secret) return { ok: false as const, error: "Admin login is not configured." };
  if (!password || !secretsMatch(password, expected)) {
    return { ok: false as const, error: "Wrong password." };
  }
  const jar = await cookies();
  jar.set(COOKIE, signToken({ role: "admin", exp: Date.now() + MAX_AGE * 1000 }, secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return { ok: true as const };
}

export async function logoutAdmin() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
