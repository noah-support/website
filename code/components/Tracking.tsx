"use client";

import { useEffect } from "react";
import Script from "next/script";
import {
  purgeDeniedStorage,
  useConsent,
  type ConsentCategory,
  type ConsentChoices,
} from "@/lib/consent";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_MEASUREMENT_ID = "G-DSY99F6FMK";
const HUBSPOT_PORTAL_ID = "49102601";

type TrackedScript = {
  id: string;
  category: ConsentCategory;
  src?: string;
  /** Inline code. Receives the current choices so it can describe them to the vendor. */
  inline?: (choices: ConsentChoices) => string;
};

const grant = (allowed: boolean) => (allowed ? "granted" : "denied");

/**
 * Every non-essential script on the site. Nothing here renders until the
 * visitor allows its category. Withdrawing consent reloads the page, so a
 * script that already ran is gone after that.
 */
const SCRIPTS: TrackedScript[] = [
  {
    id: "google-tag",
    category: "analytics",
    // Consent Mode v2, basic implementation: gtag never loads before consent,
    // and when it does, the defaults are denied before the update is applied.
    inline: (choices) => `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied'
      });
      gtag('consent', 'update', {
        ad_storage: '${grant(choices.marketing)}',
        ad_user_data: '${grant(choices.marketing)}',
        ad_personalization: '${grant(choices.marketing)}',
        analytics_storage: '${grant(choices.analytics)}'
      });
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}');
    `,
  },
  {
    id: "google-tag-loader",
    category: "analytics",
    src: `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
  },
  {
    id: "snitcher",
    category: "analytics",
    inline: () => `
      !function(e){"use strict";var t=e&&e.namespace;if(t&&e.profileId&&e.cdn){var i=window[t];if(i&&Array.isArray(i)||(i=window[t]=[]),!i.initialized&&!i._loaded)if(i._loaded)console&&console.warn("[Radar] Duplicate initialization attempted");else{i._loaded=!0;["track","page","identify","group","alias","ready","debug","on","off","once","trackClick","trackSubmit","trackLink","trackForm","pageview","screen","reset","register","setAnonymousId","addSourceMiddleware","addIntegrationMiddleware","addDestinationMiddleware","giveCookieConsent"].forEach((function(e){var a;i[e]=(a=e,function(){var e=window[t];if(e.initialized)return e[a].apply(e,arguments);var i=[].slice.call(arguments);return i.unshift(a),e.push(i),e})})),-1===e.apiEndpoint.indexOf("http")&&(e.apiEndpoint="https://"+e.apiEndpoint),i.bootstrap=function(){var t,i=document.createElement("script");i.async=!0,i.type="text/javascript",i.id="__radar__",i.setAttribute("data-settings",JSON.stringify(e)),i.src=[-1!==(t=e.cdn).indexOf("http")?"":"https://",t,"/releases/latest/radar.min.js"].join("");var a=document.scripts[0];a.parentNode.insertBefore(i,a)},i.bootstrap()}}else"undefined"!=typeof console&&console.error("[Radar] Configuration incomplete")}({
        "apiEndpoint": "radar.snitcher.com",
        "cdn": "cdn.snitcher.com",
        "namespace": "Snitcher",
        "profileId": "sRiL6NQAwQ"
      });
    `,
  },
  {
    id: "hs-script-loader",
    category: "marketing",
    src: `https://js.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`,
  },
];

/** Loads the tracking scripts the visitor allowed, and only those. */
export default function Tracking() {
  const consent = useConsent();

  useEffect(() => {
    purgeDeniedStorage();
  }, []);

  // next/script runs each id once, so a choice made after gtag loaded is
  // passed on here instead of through the inline script.
  useEffect(() => {
    if (!consent || typeof window.gtag !== "function") return;
    window.gtag("consent", "update", {
      ad_storage: grant(consent.choices.marketing),
      ad_user_data: grant(consent.choices.marketing),
      ad_personalization: grant(consent.choices.marketing),
      analytics_storage: grant(consent.choices.analytics),
    });
  }, [consent]);

  if (!consent) return null;

  return (
    <>
      {SCRIPTS.filter((script) => consent.choices[script.category]).map((script) =>
        script.src ? (
          <Script key={script.id} id={script.id} src={script.src} strategy="afterInteractive" />
        ) : (
          <Script key={script.id} id={script.id} strategy="afterInteractive">
            {script.inline?.(consent.choices) ?? ""}
          </Script>
        ),
      )}
    </>
  );
}
