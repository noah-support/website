"use client";

import type { CSSProperties } from "react";
import GlassPane from "@/components/GlassPane";
import { TRADE_HOW } from "@/lib/trade";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function TradeHow() {
  const { ref, inView } = useInView<HTMLElement>(0.28, "0px 0px -8% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="industry-partner relative px-6 py-20 sm:px-16 sm:py-28"
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      <div className="mx-auto max-w-3xl">
        <p className="industry-in font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          {TRADE_HOW.eyebrow}
        </p>
        <h2 className="industry-in mt-4 font-display text-4xl tracking-tight sm:text-5xl">
          {TRADE_HOW.title}
        </h2>
        <p className="industry-in mt-5 max-w-[65ch] font-body text-noah-ink-dim sm:text-lg">
          {TRADE_HOW.body}
        </p>
      </div>

      <ol className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {TRADE_HOW.steps.map((step, index) => (
          <li
            key={step.rank}
            className="industry-partner-step h-full"
            style={{ "--i": index } as CSSProperties}
          >
            <GlassPane
              tilt
              className="partner-step-pane flex h-full flex-col p-7 text-left sm:p-8"
            >
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
