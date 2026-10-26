"use client";

import type { ReactNode } from "react";
import { allowCategory, openCookieSettings, useConsentFor, type ConsentCategory } from "@/lib/consent";

type ConsentGateProps = {
  category: ConsentCategory;
  /** What the embed is, e.g. "This video is hosted by YouTube." */
  description: string;
  /** Button label, e.g. "Load video". */
  action: string;
  className?: string;
  children: ReactNode;
};

/** Renders an embed only after its category is allowed. A placeholder of the same size stands in until then. */
export default function ConsentGate({
  category,
  description,
  action,
  className = "",
  children,
}: ConsentGateProps) {
  const allowed = useConsentFor(category);
  if (allowed) return <>{children}</>;

  return (
    <div className={`consent-placeholder ${className}`}>
      <p className="max-w-sm font-body text-sm leading-relaxed text-noah-ink-dim">
        {description} It can set its own cookies, so it loads only when you ask.
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <button type="button" className="consent-button" onClick={() => allowCategory(category)}>
          {action}
        </button>
        <button type="button" className="consent-text-button" onClick={openCookieSettings}>
          Cookie settings
        </button>
      </div>
    </div>
  );
}
