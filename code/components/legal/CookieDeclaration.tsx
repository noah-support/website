"use client";

import { useCallback, useEffect, useState } from "react";
import {
  classifyCookie,
  hostMatches,
  lookupCookie,
  serviceForHost,
  SITE_SERVICES,
  type CatalogCookie,
  type CookieCategory,
} from "@/lib/cookieCatalog";
import {
  cookieNamesFromHeader,
  hostFromUrl,
  readScanLog,
  type ScanLog,
} from "@/lib/cookieScan";

type Presence = "checking" | "stored" | "seen" | "absent";

type Row = CatalogCookie & {
  presence: Presence;
};

type Group = {
  id: string;
  platform: string;
  summary?: string;
  categories: CookieCategory[];
  rows: Row[];
};

const PRESENCE_LABEL: Record<Presence, string> = {
  checking: "Checking this browser",
  stored: "In this browser",
  seen: "Seen earlier in this browser",
  absent: "Not stored in this browser",
};

function presenceFor(name: string, live: Set<string>, seen: Set<string>): Presence {
  if (live.has(name)) return "stored";
  if (seen.has(name)) return "seen";
  return "absent";
}

function buildGroups(live: Set<string> | null, log: ScanLog | null): {
  groups: Group[];
  unknownHosts: string[];
} {
  const seen = new Set(log?.cookies ?? []);
  const claimed = new Set<string>();
  const groups: Group[] = SITE_SERVICES.map((service) => {
    const rows = service.cookieNames.map((name) => {
      claimed.add(name);
      const cookie = lookupCookie(name);
      return {
        ...cookie,
        presence: live ? presenceFor(name, live, seen) : "checking",
      };
    });
    const categories = [...new Set(rows.map((row) => row.category))];
    return {
      id: service.id,
      platform: service.platform,
      summary: service.summary,
      categories,
      rows,
    };
  });

  if (live) {
    const extras = [...new Set([...live, ...seen])].filter((name) => !claimed.has(name));
    const byPlatform = new Map<string, Row[]>();
    for (const name of extras) {
      const cookie = classifyCookie(name);
      const row: Row = {
        ...cookie,
        presence: presenceFor(name, live, seen),
      };
      const list = byPlatform.get(cookie.platform) ?? [];
      list.push(row);
      byPlatform.set(cookie.platform, list);
    }
    for (const [platform, rows] of byPlatform) {
      groups.push({
        id: `detected-${platform}`,
        platform,
        summary: "Found by scanning this browser. It is not one of the services listed above.",
        categories: [...new Set(rows.map((row) => row.category))],
        rows,
      });
    }
  }

  const pageHost = typeof window === "undefined" ? "" : window.location.hostname;
  const unknownHosts = (log?.hosts ?? []).filter((host) => {
    if (!host || host === pageHost) return false;
    if (hostMatches(host, "noah.support")) return false;
    return !serviceForHost(host);
  });

  return { groups, unknownHosts };
}

function collectLive() {
  const names = new Set(cookieNamesFromHeader(document.cookie));
  const hosts: string[] = [];

  for (const entry of performance.getEntriesByType("resource")) {
    const host = hostFromUrl(entry.name);
    if (host) hosts.push(host);
  }
  document
    .querySelectorAll<HTMLScriptElement | HTMLIFrameElement>("script[src], iframe[src]")
    .forEach((node) => {
      const host = hostFromUrl(node.src);
      if (host) hosts.push(host);
    });

  const log = readScanLog();
  return {
    live: names,
    log: {
      cookies: [...new Set([...log.cookies, ...names])],
      hosts: [...new Set([...log.hosts, ...hosts])],
    },
  };
}

export default function CookieDeclaration() {
  const [groups, setGroups] = useState<Group[]>(() => buildGroups(null, null).groups);
  const [unknownHosts, setUnknownHosts] = useState<string[]>([]);
  const [scannedAt, setScannedAt] = useState<Date | null>(null);

  const scan = useCallback(() => {
    const { live, log } = collectLive();
    const next = buildGroups(live, log);
    setGroups(next.groups);
    setUnknownHosts(next.unknownHosts);
    setScannedAt(new Date());
  }, []);

  useEffect(() => {
    scan();
  }, [scan]);

  const storedCount = groups.reduce(
    (count, group) => count + group.rows.filter((row) => row.presence === "stored").length,
    0,
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <p className="max-w-xl font-body text-sm leading-relaxed text-noah-ink-dim">
          {scannedAt
            ? `Scanned this browser at ${scannedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}. ${storedCount} ${storedCount === 1 ? "cookie is" : "cookies are"} stored right now.`
            : "Scanning this browser…"}
        </p>
        <button
          type="button"
          onClick={scan}
          className="glass glass-pill inline-flex h-10 items-center px-4 font-body text-sm text-noah-ink transition-colors hover:text-noah-orange"
        >
          Scan again
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-10">
        {groups.map((group) => (
          <section key={group.id} aria-label={group.platform}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-noah-ink-hairline pb-3">
              <h3 className="font-display text-2xl tracking-tight">{group.platform}</h3>
              <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
                {group.categories.join(" · ")}
              </p>
            </div>
            {group.summary ? (
              <p className="mt-3 font-body text-sm leading-relaxed text-noah-ink-dim">
                {group.summary}
              </p>
            ) : null}
            <ul className="mt-2">
              {group.rows.map((row) => (
                <li
                  key={row.name}
                  className="grid gap-2 border-b border-noah-ink-hairline py-4 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-8"
                >
                  <div>
                    <p className="font-body text-sm font-semibold text-noah-ink">{row.name}</p>
                    <p className="mt-1 font-body text-sm leading-relaxed text-noah-ink-dim">
                      {row.description}
                    </p>
                    <p className="mt-2 font-body text-xs text-noah-ink-faint">
                      {row.retention === "Not listed"
                        ? "Retention not listed"
                        : `Kept for ${row.retention}`}
                      {row.controller ? ` · ${row.controller}` : ""}
                      {row.privacyUrl ? (
                        <>
                          {" · "}
                          <a
                            href={row.privacyUrl}
                            className="underline decoration-noah-ink-hairline underline-offset-2 transition-colors hover:text-noah-orange"
                          >
                            Privacy
                          </a>
                        </>
                      ) : null}
                    </p>
                  </div>
                  <p
                    className={`font-body text-sm sm:text-right ${
                      row.presence === "stored" ? "text-noah-ink" : "text-noah-ink-dim"
                    }`}
                  >
                    {PRESENCE_LABEL[row.presence]}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {unknownHosts.length > 0 ? (
        <p className="mt-8 font-body text-sm leading-relaxed text-noah-ink-dim">
          This browser also contacted {unknownHosts.join(", ")}. Cookies set
          on those domains cannot be read from this page, so they are not
          named above.
        </p>
      ) : null}
    </div>
  );
}
