/** Names only. Cookie values are never stored. */
export const COOKIE_SCAN_KEY = "noah-cookie-scan";

export type ScanLog = {
  cookies: string[];
  hosts: string[];
};

const EMPTY: ScanLog = { cookies: [], hosts: [] };

function unique(values: string[], limit: number) {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const value of values) {
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    next.push(trimmed);
    if (next.length >= limit) break;
  }
  return next;
}

export function cookieNamesFromHeader(header: string) {
  return unique(
    header.split(";").map((part) => part.split("=")[0] ?? ""),
    80,
  );
}

export function hostFromUrl(value: string) {
  try {
    return new URL(value, "https://noah.support").hostname.toLowerCase();
  } catch {
    return "";
  }
}

export function readScanLog(): ScanLog {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(COOKIE_SCAN_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ScanLog>;
    return {
      cookies: unique(
        Array.isArray(parsed.cookies)
          ? parsed.cookies.filter((item): item is string => typeof item === "string")
          : [],
        80,
      ),
      hosts: unique(
        Array.isArray(parsed.hosts)
          ? parsed.hosts.filter((item): item is string => typeof item === "string")
          : [],
        40,
      ),
    };
  } catch {
    return EMPTY;
  }
}

export function writeScanLog(log: ScanLog) {
  const next: ScanLog = {
    cookies: unique(log.cookies, 80),
    hosts: unique(log.hosts, 40),
  };
  window.localStorage.setItem(COOKIE_SCAN_KEY, JSON.stringify(next));
  return next;
}

export function mergeScanLog(current: ScanLog, extra: ScanLog): ScanLog {
  return {
    cookies: unique([...current.cookies, ...extra.cookies], 80),
    hosts: unique([...current.hosts, ...extra.hosts], 40),
  };
}
