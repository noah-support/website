"use client";

import GlassPane from "@/components/GlassPane";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

const OPTIONS = [
  {
    id: "diy",
    title: "DIY",
    winner: false,
    entails:
      "Your own people, no outside map, and months of workshops you run yourselves.",
    resultLabel: "What you get",
    result: "A slower, messier version of the process you already have.",
  },
  {
    id: "consultants",
    title: "Consultants",
    winner: false,
    entails:
      "A team on day rates, a long discovery phase, then a slide deck that leaves with them.",
    resultLabel: "What you get",
    result: "€800.000 for the PDF.",
  },
  {
    id: "noah",
    title: "Noah",
    winner: true,
    entails:
      "Interviews, a process map, and priced cases in 24 hours. Then it keeps watching the work.",
    resultLabel: "What you get",
    result: "Dynamic, 24/7 up-to-date business cases.",
  },
];

export default function IndustryCompare() {
  const { ref, inView } = useInView<HTMLElement>(0.28, "0px 0px -8% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      id="comparison"
      className="industry-compare relative px-6 py-20 sm:px-16 sm:py-28"
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="industry-in font-display text-4xl tracking-tight sm:text-5xl">
          Three ways in. One that keeps working.
        </h2>
        <p className="industry-in mx-auto mt-5 max-w-xl font-body text-noah-ink-dim sm:text-lg">
          Same problem. Three ways to spend the next year. Only one of them
          stays current.
        </p>
      </div>

      <div
        className="mx-auto mt-12 grid max-w-6xl grid-cols-1 items-stretch gap-5 p-3 sm:mt-16 sm:p-5 lg:grid-cols-[0.9fr_0.9fr_1.2fr] lg:gap-6"
      >
        {OPTIONS.map((option) => (
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
                <p className="font-display text-2xl tracking-tight sm:text-3xl">
                  {option.title}
                </p>
                <p className="mt-5 font-body text-sm leading-relaxed text-noah-ink-dim sm:text-base">
                  {option.entails}
                </p>
                <p className="mt-8 font-body text-[11px] uppercase tracking-[0.16em] text-noah-ink-faint">
                  {option.resultLabel}
                </p>
                <p
                  className={`mt-2 font-display text-xl leading-snug tracking-tight sm:text-2xl ${
                    option.winner ? "text-noah-orange" : "text-noah-ink"
                  }`}
                >
                  {option.result}
                </p>
              </GlassPane>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
