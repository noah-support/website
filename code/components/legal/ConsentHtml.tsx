"use client";

import { useEffect, useMemo, useRef } from "react";
import { allowCategory, openCookieSettings, useConsentFor } from "@/lib/consent";

const PLACEHOLDER = `<div class="consent-placeholder aspect-video w-full" data-consent-placeholder>
  <p class="max-w-sm font-body text-sm leading-relaxed text-noah-ink-dim">This embed is hosted by another company. It can set its own cookies, so it loads only when you ask.</p>
  <div class="mt-5 flex flex-wrap items-center justify-center gap-3">
    <button type="button" class="consent-button" data-consent-allow>Load embed</button>
    <button type="button" class="consent-text-button" data-consent-settings>Cookie settings</button>
  </div>
</div>`;

/**
 * Parks every iframe in CMS HTML: its src moves to data-consent-src, so the
 * browser fetches nothing, and a placeholder sits in front of it.
 */
function deferIframes(html: string) {
  return html.replace(
    /<iframe\b([^>]*?)\ssrc=(["'])(.*?)\2([^>]*)>/gi,
    (_match, before: string, quote: string, src: string, after: string) =>
      `${PLACEHOLDER}<iframe${before} data-consent-src=${quote}${src}${quote}${after}>`,
  );
}

type ConsentHtmlProps = {
  html: string;
  className?: string;
};

/** WordPress post content, with embedded iframes held back until external media is allowed. */
export default function ConsentHtml({ html, className }: ConsentHtmlProps) {
  const ref = useRef<HTMLDivElement>(null);
  const allowed = useConsentFor("media");
  const deferred = useMemo(() => deferIframes(html), [html]);

  useEffect(() => {
    const root = ref.current;
    if (!root || !allowed) return;
    root.querySelectorAll("[data-consent-placeholder]").forEach((node) => node.remove());
    root.querySelectorAll<HTMLIFrameElement>("iframe[data-consent-src]").forEach((iframe) => {
      iframe.src = iframe.dataset.consentSrc ?? "";
      iframe.removeAttribute("data-consent-src");
    });
  }, [allowed, deferred]);

  return (
    <div
      ref={ref}
      className={className}
      onClick={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("[data-consent-allow]")) allowCategory("media");
        else if (target.closest("[data-consent-settings]")) openCookieSettings();
      }}
      dangerouslySetInnerHTML={{ __html: deferred }}
    />
  );
}
