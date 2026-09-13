"use client";

import GlassPane from "@/components/GlassPane";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { PARTNER_FIT } from "@/lib/partner";

function FitList({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 flex flex-col gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 font-body text-sm leading-relaxed text-noah-ink-dim sm:text-base"
        >
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-noah-orange" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function IndustryPartnerFit() {
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
          {PARTNER_FIT.title}
        </h2>
        <p className="industry-in mt-5 max-w-[65ch] font-body text-noah-ink-dim sm:text-lg">
          {PARTNER_FIT.body}
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-2">
        <div className="industry-partner-item h-full">
          <div className="industry-in h-full">
            <GlassPane tilt className="flex h-full flex-col p-7 text-left sm:p-9">
              <h3 className="font-display text-2xl tracking-tight sm:text-3xl">
                {PARTNER_FIT.fitTitle}
              </h3>
              <FitList items={PARTNER_FIT.fit} />
            </GlassPane>
          </div>
        </div>
        <div className="industry-partner-item h-full">
          <div className="industry-in h-full">
            <GlassPane tilt className="flex h-full flex-col p-7 text-left sm:p-9">
              <h3 className="font-display text-2xl tracking-tight sm:text-3xl">
                {PARTNER_FIT.getTitle}
              </h3>
              <FitList items={PARTNER_FIT.get} />
            </GlassPane>
          </div>
        </div>
      </div>
    </section>
  );
}
