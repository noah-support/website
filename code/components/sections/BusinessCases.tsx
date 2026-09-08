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
    <section className="relative flex min-h-screen flex-col items-center justify-center gap-8 px-6 py-16 sm:gap-12 sm:px-16 sm:py-20">
      <div className="max-w-2xl text-center">
        <p
          data-roll
          className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim"
        >
          What you get
        </p>
        <h2
          data-roll
          className="mt-4 font-display text-4xl tracking-tight sm:text-5xl"
        >
          Business cases, ready to implement.
        </h2>
        <p data-roll className="mt-5 font-body text-noah-ink-dim sm:text-lg">
          Finally, each one ranked, priced, and traced straight back to what
          your team told us.
        </p>
      </div>
      <div
        className="grid w-full max-w-md grid-cols-1 sm:max-w-6xl sm:grid-cols-3 sm:gap-8"
        style={{ perspective: "1400px" }}
      >
        {CASES.map((item, index) => (
          // Wrapper carries the scroll-linked tumble; the pane inside carries
          // the pointer-tracked tilt. Two elements, so the two transforms
          // never overwrite each other.
          // Inside the pinned stage, every card shares one grid cell so they
          // can stack into a deck. Outside it (reduced motion) they stay a list.
          <div
            data-case
            key={item.rank}
            className="h-full [.h-screen_&]:max-sm:col-start-1 [.h-screen_&]:max-sm:row-start-1"
            style={{ zIndex: index + 1 }}
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
