"use client";

import Script from "next/script";

const MEETING_SRC = "https://meetings.hubspot.com/denis-leysen?embed=true";
const EMBED_SCRIPT =
  "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";

export default function BookMeeting() {
  return (
    <>
      <div
        className="meetings-iframe-container min-h-[690px] w-full"
        data-src={MEETING_SRC}
      />
      <Script
        id="hubspot-meetings-embed"
        src={EMBED_SCRIPT}
        strategy="afterInteractive"
      />
    </>
  );
}
