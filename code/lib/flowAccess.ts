import { cookies } from "next/headers";
import { readToken, signToken } from "@/lib/signed";

const COOKIE = "noah_flow";
const MAX_AGE_MS = 12 * 60 * 60 * 1000;

type FlowToken = { flows: string[]; exp: number };

function secret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || "";
}

export async function unlockedFlows() {
  const key = secret();
  if (!key) return [];
  const jar = await cookies();
  const token = readToken<FlowToken>(jar.get(COOKIE)?.value, key);
  if (!token || token.exp < Date.now() || !Array.isArray(token.flows)) return [];
  return token.flows.filter((slug) => typeof slug === "string");
}

export async function hasFlowAccess(slug: string) {
  const flows = await unlockedFlows();
  return flows.includes(slug);
}

export async function grantFlowAccess(slug: string) {
  const key = secret();
  if (!key) return;
  const current = await unlockedFlows();
  const flows = [slug, ...current.filter((item) => item !== slug)].slice(0, 20);
  const jar = await cookies();
  jar.set(COOKIE, signToken({ flows, exp: Date.now() + MAX_AGE_MS }, key), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(MAX_AGE_MS / 1000),
  });
}
