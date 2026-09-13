"use client";

import type { CSSProperties } from "react";
import GlassPane from "@/components/GlassPane";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { PARTNER_HOW } from "@/lib/partner";

export default function IndustryPartnerHow() {
  const { ref, inView } = useInView<HTMLElement>(0.28, "0px 0px -8% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="industry-partner relative px-6 py-20 sm:px-16 sm:py-28"
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="industry-in font-display text-4xl tracking-tight sm:text-5xl">
          {PARTNER_HOW.title}
        </h2>
        <p className="industry-in mt-5 max-w-[65ch] font-body text-noah-ink-dim sm:text-lg">
          {PARTNER_HOW.body}
        </p>
      </div>

      <ol className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {PARTNER_HOW.steps.map((step, index) => (
          <li
            key={step.rank}
            className="industry-partner-step h-full"
            style={{ "--i": index } as CSSProperties}
          >
            <GlassPane tilt className="partner-step-pane flex h-full flex-col p-7 text-left sm:p-8">
              <span className="partner-step-border" aria-hidden>
                <span className="partner-step-border-spin" />
              </span>
              <span className="font-display text-sm text-noah-orange">
                {step.rank}
              </span>
              <h3 className="mt-3 font-display text-xl tracking-tight sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-4 font-body text-sm leading-relaxed text-noah-ink-dim">
                {step.body}
              </p>
            </GlassPane>
          </li>
        ))}
      </ol>
    </section>
  );
}
