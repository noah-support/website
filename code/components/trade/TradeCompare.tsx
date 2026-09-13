"use client";

import GlassPane from "@/components/GlassPane";
import { TRADE_COMPARE } from "@/lib/trade";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

function PointList({
  label,
  items,
  winner,
}: {
  label: string;
  items: string[];
  winner: boolean;
}) {
  return (
    <>
      <p className="mt-8 font-body text-[11px] uppercase tracking-[0.16em] text-noah-ink-faint">
        {label}
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li
            key={item}
            className={`font-body text-sm leading-relaxed ${
              winner ? "text-noah-ink" : "text-noah-ink-dim"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </>
  );
}

export default function TradeCompare() {
  const { ref, inView } = useInView<HTMLElement>(0.28, "0px 0px -8% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      id="what-you-get"
      className="industry-compare relative px-6 py-20 sm:px-16 sm:py-28"
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="industry-in font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          {TRADE_COMPARE.eyebrow}
        </p>
        <h2 className="industry-in mt-4 font-display text-4xl tracking-tight sm:text-5xl">
          {TRADE_COMPARE.title}
        </h2>
        <p className="industry-in mx-auto mt-5 max-w-xl font-body text-noah-ink-dim sm:text-lg">
          {TRADE_COMPARE.body}
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 items-stretch gap-5 p-3 sm:mt-16 sm:p-5 lg:grid-cols-2 lg:gap-6">
        {TRADE_COMPARE.options.map((option) => (
          <div
            key={option.id}
            className="industry-compare-item"
            data-winner={option.winner ? "" : undefined}
          >
            <div className="industry-in flex min-h-min flex-1 flex-col">
              <GlassPane
                tilt={option.winner}
                className={`flex h-full min-h-min flex-col p-7 text-left sm:p-9 ${
                  option.winner
                    ? "industry-compare-card industry-compare-card--winner"
                    : "industry-compare-card industry-compare-card--muted"
                }`}
              >
                <p className="font-body text-[11px] uppercase tracking-[0.16em] text-noah-ink-faint">
                  {option.kicker}
                </p>
                <p className="mt-3 font-display text-2xl tracking-tight sm:text-3xl">
                  {option.title}
                </p>
                <p
                  className={`mt-2 font-display text-xl leading-snug tracking-tight sm:text-2xl ${
                    option.winner ? "text-noah-orange" : "text-noah-ink"
                  }`}
                >
                  {option.tag}
                </p>
                <p className="mt-5 font-body text-sm leading-relaxed text-noah-ink-dim sm:text-base">
                  {option.desc}
                </p>
                <PointList label="Pros" items={option.pros} winner={option.winner} />
                <PointList label="Cons" items={option.cons} winner={option.winner} />
              </GlassPane>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
