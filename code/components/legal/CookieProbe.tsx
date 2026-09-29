"use client";

import { useEffect } from "react";
import {
  COOKIE_SCAN_KEY,
  cookieNamesFromHeader,
  hostFromUrl,
  mergeScanLog,
  readScanLog,
  writeScanLog,
} from "@/lib/cookieScan";

function currentHosts() {
  const hosts = new Set<string>();
  const pageHost = window.location.hostname.toLowerCase();

  const add = (value: string | null | undefined) => {
    if (!value) return;
    const host = hostFromUrl(value);
    if (!host || host === pageHost || host === "localhost" || host === "127.0.0.1") return;
    hosts.add(host);
  };

  for (const entry of performance.getEntriesByType("resource")) {
    add(entry.name);
  }

  document
    .querySelectorAll<HTMLScriptElement | HTMLIFrameElement>("script[src], iframe[src]")
    .forEach((node) => add(node.src));

  return [...hosts];
}

function snapshot() {
  const cookies = cookieNamesFromHeader(document.cookie).filter(
    (name) => name !== COOKIE_SCAN_KEY,
  );
  const current = readScanLog();
  const next = mergeScanLog(current, { cookies, hosts: currentHosts() });
  const changed =
    next.cookies.length !== current.cookies.length ||
    next.hosts.length !== current.hosts.length ||
    next.cookies.some((name, index) => name !== current.cookies[index]) ||
    next.hosts.some((host, index) => host !== current.hosts[index]);
  if (changed) writeScanLog(next);
}

export default function CookieProbe() {
  useEffect(() => {
    snapshot();
    const timers = [1500, 5000].map((delay) => window.setTimeout(snapshot, delay));
    const onHide = () => {
      if (document.visibilityState === "hidden") snapshot();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      document.removeEventListener("visibilitychange", onHide);
    };
  }, []);

  return null;
}
