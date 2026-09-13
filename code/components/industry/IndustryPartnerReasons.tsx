"use client";

import GlassPane from "@/components/GlassPane";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { PARTNER_REASONS } from "@/lib/partner";

export default function IndustryPartnerReasons() {
  const { ref, inView } = useInView<HTMLElement>(0.28, "0px 0px -8% 0px");
  const reducedMotion = useReducedMotion();
  const [lead, ...rest] = PARTNER_REASONS;

  return (
    <section
      ref={ref}
      className="industry-partner relative px-6 py-20 sm:px-16 sm:py-28"
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="industry-in font-display text-4xl tracking-tight sm:text-5xl">
          Three reasons the best consultancies partner with noah.
        </h2>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-2">
        <div className="industry-partner-item lg:col-span-2">
          <div className="industry-in h-full">
            <GlassPane tilt className="flex h-full flex-col p-7 text-left sm:p-10">
              <span className="font-display text-sm text-noah-orange">
                {lead.rank}
              </span>
              <h3 className="mt-3 font-display text-2xl tracking-tight sm:text-4xl">
                {lead.title}
              </h3>
              <p className="mt-5 max-w-3xl font-body text-sm leading-relaxed text-noah-ink-dim sm:text-base">
                {lead.body}
              </p>
              <p className="mt-8 font-display text-xl leading-snug tracking-tight text-noah-orange sm:text-2xl">
                {lead.footer}
              </p>
            </GlassPane>
          </div>
        </div>
        {rest.map((reason) => (
          <div key={reason.rank} className="industry-partner-item h-full">
            <div className="industry-in h-full">
              <GlassPane tilt className="flex h-full flex-col p-7 text-left sm:p-9">
                <span className="font-display text-sm text-noah-orange">
                  {reason.rank}
                </span>
                <h3 className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">
                  {reason.title}
                </h3>
                <p className="mt-5 font-body text-sm leading-relaxed text-noah-ink-dim sm:text-base">
                  {reason.body}
                </p>
                <p className="mt-8 font-display text-xl leading-snug tracking-tight text-noah-ink sm:text-2xl">
                  {reason.footer}
                </p>
              </GlassPane>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
