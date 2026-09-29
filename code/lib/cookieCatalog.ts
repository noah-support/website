export type CookieCategory =
  | "Functional"
  | "Preferences"
  | "Statistics"
  | "Marketing"
  | "Unclassified";

export type CatalogCookie = {
  name: string;
  platform: string;
  category: CookieCategory;
  description: string;
  retention: string;
  controller: string;
  privacyUrl?: string;
  /** When true, the name is a prefix (Open Cookie Database wildcard). */
  wildcard?: boolean;
};

/**
 * Descriptions and retention periods are taken from the Open Cookie Database
 * (cookiedatabase.org), the same source the previous policy was synced with.
 * Only cookies this website can actually place, plus a few common trackers
 * so a newly detected cookie can still be named.
 */
export const COOKIE_CATALOG: CatalogCookie[] = [
  {
    name: "_GRECAPTCHA",
    platform: "Google reCAPTCHA",
    category: "Functional",
    description:
      "Set when reCAPTCHA runs its risk analysis, so form submissions can be checked for abuse.",
    retention: "179 days",
    controller: "Google",
    privacyUrl: "https://business.safety.google/privacy/",
  },
  {
    name: "__hstc",
    platform: "HubSpot",
    category: "Marketing",
    description: "Main HubSpot cookie for tracking visitors.",
    retention: "13 months",
    controller: "HubSpot",
    privacyUrl: "https://legal.hubspot.com/privacy-policy",
  },
  {
    name: "hubspotutk",
    platform: "HubSpot",
    category: "Marketing",
    description:
      "Keeps track of a visitor’s identity. HubSpot uses it to recognise the same browser across visits.",
    retention: "13 months",
    controller: "HubSpot",
    privacyUrl: "https://legal.hubspot.com/privacy-policy",
  },
  {
    name: "__hssc",
    platform: "HubSpot",
    category: "Marketing",
    description: "Keeps track of sessions.",
    retention: "30 minutes",
    controller: "HubSpot",
    privacyUrl: "https://legal.hubspot.com/privacy-policy",
  },
  {
    name: "__hssrc",
    platform: "HubSpot",
    category: "Marketing",
    description:
      "Set whenever HubSpot changes the session cookie, to tell whether the browser was restarted.",
    retention: "Session",
    controller: "HubSpot",
    privacyUrl: "https://legal.hubspot.com/privacy-policy",
  },
  {
    name: "YSC",
    platform: "YouTube",
    category: "Functional",
    description:
      "Registers a unique ID to keep statistics of which YouTube videos you have watched. On this site it is only set after you play an embedded video.",
    retention: "Session",
    controller: "Google",
    privacyUrl: "https://business.safety.google/privacy/",
  },
  {
    name: "VISITOR_INFO1_LIVE",
    platform: "YouTube",
    category: "Marketing",
    description:
      "Tries to estimate bandwidth on pages with an embedded YouTube video. Also used for marketing. Set after you play the video.",
    retention: "179 days",
    controller: "Google",
    privacyUrl: "https://business.safety.google/privacy/",
  },
  {
    name: "PREF",
    platform: "YouTube",
    category: "Preferences",
    description:
      "Stores player preferences, such as language and playback settings, for embedded YouTube videos.",
    retention: "10 years",
    controller: "Google",
    privacyUrl: "https://business.safety.google/privacy/",
  },
  {
    name: "GPS",
    platform: "YouTube",
    category: "Marketing",
    description:
      "Registers a unique ID on mobile devices to enable location-based tracking of embedded YouTube playback.",
    retention: "1 day",
    controller: "Google",
    privacyUrl: "https://business.safety.google/privacy/",
  },
  {
    name: "_ga",
    platform: "Google Analytics",
    category: "Statistics",
    description: "Identifies a browser so visits can be measured.",
    retention: "2 years",
    controller: "Google",
    privacyUrl: "https://business.safety.google/privacy/",
  },
  {
    name: "_ga_",
    platform: "Google Analytics",
    category: "Statistics",
    description: "Identifies a browser for a specific Google Analytics property.",
    retention: "2 years",
    controller: "Google",
    privacyUrl: "https://business.safety.google/privacy/",
    wildcard: true,
  },
  {
    name: "_gid",
    platform: "Google Analytics",
    category: "Statistics",
    description: "Identifies a browser for 24 hours after the last activity.",
    retention: "24 hours",
    controller: "Google",
    privacyUrl: "https://business.safety.google/privacy/",
  },
  {
    name: "_gat",
    platform: "Google Analytics",
    category: "Statistics",
    description: "Limits how often analytics requests are sent.",
    retention: "1 minute",
    controller: "Google",
    privacyUrl: "https://business.safety.google/privacy/",
    wildcard: true,
  },
  {
    name: "__cf_bm",
    platform: "Cloudflare",
    category: "Functional",
    description:
      "Distinguishes people from automated traffic so the site can be protected from bots.",
    retention: "Session",
    controller: "Cloudflare",
    privacyUrl: "https://www.cloudflare.com/privacypolicy/",
  },
  {
    name: "bcookie",
    platform: "LinkedIn",
    category: "Marketing",
    description: "Used by LinkedIn to track the use of embedded services.",
    retention: "1 year",
    controller: "LinkedIn",
    privacyUrl: "https://www.linkedin.com/legal/privacy-policy",
  },
  {
    name: "li_gc",
    platform: "LinkedIn",
    category: "Functional",
    description: "Stores a guest’s cookie consent for LinkedIn.",
    retention: "2 years",
    controller: "LinkedIn",
    privacyUrl: "https://www.linkedin.com/legal/privacy-policy",
  },
  {
    name: "lidc",
    platform: "LinkedIn",
    category: "Functional",
    description: "Used by LinkedIn for routing and embedded-service features.",
    retention: "1 day",
    controller: "LinkedIn",
    privacyUrl: "https://www.linkedin.com/legal/privacy-policy",
  },
];

export type SiteService = {
  id: string;
  platform: string;
  summary: string;
  hosts: string[];
  cookieNames: string[];
};

/** Third parties this website actually loads. The scanner marks which of their cookies are present. */
export const SITE_SERVICES: SiteService[] = [
  {
    id: "recaptcha",
    platform: "Google reCAPTCHA",
    summary:
      "Loaded on the contact form, the partner form, and the trade form to block spam.",
    hosts: ["google.com", "gstatic.com", "recaptcha.net"],
    cookieNames: ["_GRECAPTCHA"],
  },
  {
    id: "google-analytics",
    platform: "Google Analytics",
    summary: "The Google tag loads on every page and measures how the site is used.",
    hosts: [
      "googletagmanager.com",
      "google-analytics.com",
      "analytics.google.com",
    ],
    cookieNames: ["_ga", "_ga_", "_gid", "_gat"],
  },
  {
    id: "hubspot",
    platform: "HubSpot",
    summary:
      "The HubSpot tracking script loads on every page. The booking page also embeds the meeting calendar.",
    hosts: [
      "hubspot.com",
      "hsappstatic.net",
      "hs-scripts.com",
      "hs-analytics.net",
      "hs-banner.com",
      "hsforms.com",
    ],
    cookieNames: ["__hstc", "hubspotutk", "__hssc", "__hssrc"],
  },
  {
    id: "snitcher",
    platform: "Snitcher",
    summary: "Identifies companies that visit the website.",
    hosts: ["snitcher.com", "cdn.snitcher.com"],
    cookieNames: [],
  },
  {
    id: "youtube",
    platform: "YouTube",
    summary:
      "The trade-page demo is an embedded video. It uses the privacy-enhanced player, which does not set cookies until you press play.",
    hosts: ["youtube.com", "youtube-nocookie.com", "ytimg.com", "googlevideo.com"],
    cookieNames: ["YSC", "VISITOR_INFO1_LIVE", "PREF", "GPS"],
  },
];

export function classifyCookie(name: string): CatalogCookie & { matched: boolean } {
  const exact = COOKIE_CATALOG.find((entry) => !entry.wildcard && entry.name === name);
  if (exact) return { ...exact, matched: true };

  const wildcard = COOKIE_CATALOG.filter(
    (entry) => entry.wildcard && name.startsWith(entry.name),
  ).sort((a, b) => b.name.length - a.name.length)[0];

  if (wildcard) return { ...wildcard, name, matched: true };

  return {
    name,
    platform: "Detected in this browser",
    category: "Unclassified",
    description:
      "Found while scanning this browser. It is not in the cookie database, so its purpose is not known yet.",
    retention: "Not listed",
    controller: "Unknown",
    matched: false,
  };
}

export function lookupCookie(name: string): CatalogCookie {
  const classified = classifyCookie(name);
  return classified;
}

export function hostMatches(host: string, pattern: string) {
  return host === pattern || host.endsWith(`.${pattern}`);
}

export function serviceForHost(host: string) {
  return SITE_SERVICES.find((service) =>
    service.hosts.some((pattern) => hostMatches(host, pattern)),
  );
}
