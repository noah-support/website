"use client";

import { openCookieSettings } from "@/lib/consent";

/** Opens the cookie settings. For server components such as the policy page. */
export default function CookieSettingsButton({ className = "consent-button" }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={openCookieSettings}>
      Cookie settings
    </button>
  );
}
