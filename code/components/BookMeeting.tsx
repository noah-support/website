"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const MEETING_SRC =
  "https://meetings.hubspot.com/denis-leysen/introduction-to-noah?embed=true";
const EMBED_SCRIPT =
  "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

function isMeetingFrame(iframe: HTMLIFrameElement) {
  const src = iframe.getAttribute("src") ?? "";
  return src.includes("meetings.hubspot.com");
}

export default function BookMeeting() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const cleanups: Array<() => void> = [];

    const watch = (iframe: HTMLIFrameElement) => {
      if (iframe.dataset.noahWatch === "1") return;
      iframe.dataset.noahWatch = "1";

      const onLoad = () => {
        if (!isMeetingFrame(iframe)) return;
        setLoaded(true);
      };

      iframe.addEventListener("load", onLoad);
      cleanups.push(() => iframe.removeEventListener("load", onLoad));

      if (isMeetingFrame(iframe)) {
        try {
          if (iframe.contentDocument?.readyState === "complete") onLoad();
        } catch {
          // Cross-origin once HubSpot has navigated the frame. The load
          // event is the signal in that case.
        }
      }
    };

    const scan = () => {
      root.querySelectorAll("iframe").forEach((node) => watch(node));
    };

    scan();
    const observer = new MutationObserver(scan);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["src"],
    });

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div className="relative min-h-[690px] w-full">
      {loaded ? null : (
        <div
          className="absolute inset-0 z-10 flex flex-col items-center justify-center"
          role="status"
          aria-live="polite"
          aria-label="Loading booking form"
        >
          <div className="industry-loader-track" aria-hidden>
            <span className="industry-loader-bar" />
          </div>
          <p className="mt-5 font-body text-[11px] uppercase tracking-[0.2em] text-noah-ink-dim">
            Loading
          </p>
        </div>
      )}
      <div
        ref={containerRef}
        className="meetings-iframe-container min-h-[690px] w-full"
        data-src={MEETING_SRC}
      />
      <Script
        id="hubspot-meetings-embed"
        src={EMBED_SCRIPT}
        strategy="afterInteractive"
      />
    </div>
  );
}
