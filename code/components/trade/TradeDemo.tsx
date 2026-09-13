"use client";

import GlassPane from "@/components/GlassPane";
import { TRADE_DEMO } from "@/lib/trade";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

const EMBED_SRC = `https://www.youtube-nocookie.com/embed/${TRADE_DEMO.youtubeId}?rel=0`;

export default function TradeDemo() {
  const { ref, inView } = useInView<HTMLElement>(0.28, "0px 0px -8% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="industry-partner relative px-6 py-16 sm:px-16 sm:py-20"
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      <div className="mx-auto max-w-5xl">
        <p className="industry-in font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          {TRADE_DEMO.eyebrow}
        </p>
        <h2 className="industry-in mt-4 font-display text-4xl tracking-tight sm:text-5xl">
          {TRADE_DEMO.title}
        </h2>
        <GlassPane className="industry-in mt-8 overflow-hidden p-2 sm:p-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-[18px]">
            <iframe
              src={EMBED_SRC}
              title={TRADE_DEMO.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </GlassPane>
      </div>
    </section>
  );
}
