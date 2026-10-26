"use client";

import { useSyncExternalStore } from "react";
import { classifyCookie, SITE_SERVICES, type ConsentGroup } from "@/lib/cookieCatalog";
import { cookieNamesFromHeader } from "@/lib/cookieScan";

/**
 * The one owner of cookie consent: what the visitor chose, where it is
 * stored, and what happens when they change their mind. Scripts and embeds
 * read from here and never touch storage themselves.
 */

export type ConsentCategory = Exclude<ConsentGroup, "essential">;

export type ConsentChoices = Record<ConsentCategory, boolean>;

export type ConsentRecord = {
  version: string;
  /** ISO timestamp of the moment the visitor chose. */
  timestamp: string;
  choices: ConsentChoices;
};

export const CONSENT_CATEGORIES: ConsentCategory[] = ["analytics", "marketing", "media"];

export const CONSENT_STORAGE_KEY = "noah-consent";

/** Ask again after 12 months. */
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

/** Bump by hand when the banner's meaning changes without the service list changing. */
const SCHEMA = 1;

const CHANGE_EVENT = "noah:consent-change";
const OPEN_EVENT = "noah:consent-open";

export const NO_CONSENT: ConsentChoices = { analytics: false, marketing: false, media: false };
export const ALL_CONSENT: ConsentChoices = { analytics: true, marketing: true, media: true };

function hash(value: string) {
  let h = 5381;
  for (let i = 0; i < value.length; i++) h = ((h << 5) + h + value.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Derived from the service list, so adding a script or cookie re-asks everyone. */
export const CONSENT_VERSION = `${SCHEMA}.${hash(
  JSON.stringify(
    SITE_SERVICES.map((service) => [service.id, service.consent, service.cookieNames]),
  ),
)}`;

function isValid(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ConsentRecord>;
  if (record.version !== CONSENT_VERSION || typeof record.timestamp !== "string") return false;
  const time = Date.parse(record.timestamp);
  if (Number.isNaN(time) || Date.now() - time > MAX_AGE_MS) return false;
  const choices = record.choices as Partial<ConsentChoices> | undefined;
  return CONSENT_CATEGORIES.every((category) => typeof choices?.[category] === "boolean");
}

let cachedRaw: string | null | undefined;
let cachedRecord: ConsentRecord | null = null;

/** The stored choice, or null when there is none, it expired, or the service list changed. */
export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedRecord;
  cachedRaw = raw;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    cachedRecord = isValid(parsed) ? parsed : null;
  } catch {
    cachedRecord = null;
  }
  return cachedRecord;
}

function matchesService(name: string, category: ConsentCategory) {
  const lower = name.toLowerCase();
  return SITE_SERVICES.some((service) => {
    if (service.consent !== category) return false;
    if (service.storagePrefixes?.some((prefix) => lower.startsWith(prefix.toLowerCase()))) {
      return true;
    }
    return service.cookieNames.some((cookie) => {
      if (cookie === name) return true;
      const entry = classifyCookie(cookie);
      return Boolean(entry.wildcard) && name.startsWith(cookie);
    });
  });
}

function expireCookie(name: string) {
  const parts = window.location.hostname.split(".");
  // Try the host itself, then every parent domain (.noah.support), since
  // trackers set cookies on the widest domain they can.
  const domains = [""];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join(".")}`);
  for (const domain of domains) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
  }
}

/** Deletes the first-party cookies and storage of the given categories. */
function clearCategories(categories: ConsentCategory[]) {
  for (const category of categories) {
    for (const name of cookieNamesFromHeader(document.cookie)) {
      if (matchesService(name, category)) expireCookie(name);
    }
    for (const store of [window.localStorage, window.sessionStorage]) {
      try {
        for (const key of Object.keys(store)) {
          if (matchesService(key, category)) store.removeItem(key);
        }
      } catch {
        // Storage blocked. Nothing of ours to clean up there either.
      }
    }
  }
}

/**
 * Deletes leftovers of every category that is not allowed. Runs on each page
 * load, because some scripts write their storage again while the page that
 * withdrew consent is unloading.
 */
export function purgeDeniedStorage() {
  const choices = readConsent()?.choices ?? NO_CONSENT;
  clearCategories(CONSENT_CATEGORIES.filter((category) => !choices[category]));
}

/**
 * Stores a choice. If it withdraws anything that was allowed, the category's
 * cookies are deleted and the page reloads, so its scripts stop running.
 */
export function saveConsent(choices: ConsentChoices) {
  const previous = readConsent();
  const record: ConsentRecord = {
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
    choices: { ...choices },
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Private mode with storage blocked: the choice holds for this page only.
    cachedRaw = JSON.stringify(record);
    cachedRecord = record;
  }

  const withdrawn = CONSENT_CATEGORIES.filter(
    (category) => previous?.choices[category] && !choices[category],
  );
  if (withdrawn.length > 0) {
    clearCategories(withdrawn);
    window.location.reload();
    return;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Allows one category without touching the others. Used by embed placeholders. */
export function allowCategory(category: ConsentCategory) {
  const current = readConsent()?.choices ?? NO_CONSENT;
  saveConsent({ ...current, [category]: true });
}

/** Opens the cookie settings from anywhere: footer link, policy page, console. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenCookieSettings(callback: () => void) {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === CONSENT_STORAGE_KEY) callback();
  };
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}

/** The stored choice. Null on the server and before the visitor has chosen. */
export function useConsent() {
  return useSyncExternalStore(subscribe, readConsent, () => null);
}

/** True once the visitor allowed this category. Always false on the server. */
export function useConsentFor(category: ConsentCategory) {
  return useConsent()?.choices[category] ?? false;
}

declare global {
  interface Window {
    noahCookieSettings?: () => void;
  }
}
