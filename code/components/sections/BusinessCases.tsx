import type { CSSProperties } from "react";
import GlassPane from "@/components/GlassPane";

const CASES = [
  {
    rank: "01",
    title: "Invoice reconciliation",
    time: "−65%",
    timeLabel: "processing time",
    money: "€120k",
    moneyLabel: "saved per year",
    explanation:
      "Purchase orders are matched to invoices automatically instead of checked line by line.",
  },
  {
    rank: "02",
    title: "Customer onboarding",
    time: "−40%",
    timeLabel: "time to first value",
    money: "€85k",
    moneyLabel: "saved per year",
    explanation:
      "Six handoffs across four systems become one guided intake flow.",
  },
  {
    rank: "03",
    title: "Support ticket triage",
    time: "−30%",
    timeLabel: "resolution time",
    money: "€54k",
    moneyLabel: "saved per year",
    explanation:
      "Tickets route themselves by intent instead of waiting on a human dispatcher.",
  },
];

export default function BusinessCases() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-8 px-6 py-16 sm:gap-12 sm:px-16 sm:py-20">
      <div className="industry-how-copy max-w-2xl text-center">
        <p className="industry-in font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          What you get
        </p>
        <h2 className="industry-in mt-4 font-display text-4xl tracking-tight sm:text-5xl">
          Business cases, ready for implement.
        </h2>
        <p className="industry-in mt-5 font-body text-noah-ink-dim sm:text-lg">
          Finally, every business case is ranked and traced straight back to
          your team&apos;s feedback
        </p>
      </div>
      <div
        className="grid w-full max-w-md grid-cols-1 gap-8 sm:max-w-6xl sm:grid-cols-3"
        style={{ perspective: "1400px" }}
      >
        {CASES.map((item, index) => (
          <div
            data-case
            key={item.rank}
            className="h-full"
            style={{ "--i": index, zIndex: index + 1 } as CSSProperties}
          >
            <BusinessCaseCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
}

function BusinessCaseCard({
  rank,
  title,
  time,
  timeLabel,
  money,
  moneyLabel,
  explanation,
}: (typeof CASES)[number]) {
  return (
    <GlassPane tilt className="flex h-full flex-col p-8 text-left sm:p-9">
      <span className="font-display text-sm text-noah-orange">{rank}</span>
      <p className="mt-3 font-display text-2xl tracking-tight">{title}</p>

      <div className="mt-6 flex gap-6">
        <div>
          <p className="font-display text-3xl text-noah-ink">{time}</p>
          <p className="mt-1 font-body text-xs text-noah-ink-dim">
            {timeLabel}
          </p>
        </div>
        <div>
          <p className="font-display text-3xl text-noah-ink">{money}</p>
          <p className="mt-1 font-body text-xs text-noah-ink-dim">
            {moneyLabel}
          </p>
        </div>
      </div>

      <p className="mt-6 font-body text-sm leading-relaxed text-noah-ink-dim">
        {explanation}
      </p>
    </GlassPane>
  );
}
