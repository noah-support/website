"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import GlassPane from "@/components/GlassPane";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

type BurstStyle = CSSProperties & {
  "--dx": string;
  "--dy": string;
  "--from-rot": string;
  "--rest": string;
  "--i": number;
};

const PANES: { className: string; style: BurstStyle; node: ReactNode }[] = [
  {
    className: "left-[3%] top-24 w-[8.75rem] sm:left-[4%] sm:top-[9%] sm:w-56",
    style: {
      "--dx": "34vw",
      "--dy": "52vh",
      "--from-rot": "22deg",
      "--rest": "-8deg",
      "--i": 0,
    },
    node: (
      <KpiPane label="Potential money savings identified" value="€482,000" />
    ),
  },
  {
    className:
      "right-[3%] bottom-6 w-[8.75rem] sm:right-[5%] sm:top-[12%] sm:bottom-auto sm:w-56",
    style: {
      "--dx": "-32vw",
      "--dy": "46vh",
      "--from-rot": "-18deg",
      "--rest": "7deg",
      "--i": 1,
    },
    node: <KpiPane label="Potential time saved identified" value="1,240 hrs" />,
  },
  {
    className:
      "bottom-[6%] left-[1%] hidden w-[15.5rem] md:block md:bottom-[8%] md:left-[3.5%] md:w-[19rem]",
    style: {
      "--dx": "28vw",
      "--dy": "22vh",
      "--from-rot": "14deg",
      "--rest": "-5deg",
      "--i": 2,
    },
    node: (
      <CasePane
        rank="01"
        title="Invoice reconciliation"
        time="−65%"
        timeLabel="processing time"
        money="€120k"
        moneyLabel="saved per year"
      />
    ),
  },
  {
    className:
      "bottom-[9%] right-[1%] hidden w-[15.5rem] md:right-[4%] md:bottom-[11%] md:block md:w-[18rem]",
    style: {
      "--dx": "-26vw",
      "--dy": "26vh",
      "--from-rot": "-16deg",
      "--rest": "6deg",
      "--i": 3,
    },
    node: (
      <CasePane
        rank="02"
        title="Customer onboarding"
        time="−40%"
        timeLabel="time to first value"
        money="€85k"
        moneyLabel="saved per year"
      />
    ),
  },
];

export default function FinalCTA({
  eyebrow = "Ready when you are",
  title = "One department. Twenty-four hours. No guesswork.",
}: {
  eyebrow?: string;
  title?: string;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.35, "0px 0px -10% 0px");
  const { ref: bottomRef, inView: burst } = useInView<HTMLDivElement>(0);
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="cta-stage relative flex min-h-[80vh] flex-col items-center justify-center gap-10 overflow-hidden bg-noah-ink/5 px-6 text-center"
      data-visible={inView || reducedMotion ? "" : undefined}
      data-burst={burst || reducedMotion ? "" : undefined}
    >
      <div
        ref={bottomRef}
        className="pointer-events-none absolute inset-x-0 bottom-8 h-8"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {PANES.map((pane) => (
          <div
            key={pane.className}
            className={`cta-burst absolute ${pane.className}`}
            style={pane.style}
          >
            {pane.node}
          </div>
        ))}
      </div>
      <div
        className="cta-glow absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(235,92,28,0.16), transparent 65%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <p className="cta-reveal font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          {eyebrow}
        </p>
        <h2 className="cta-reveal mt-6 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          {title}
        </h2>
        <Link
          href="/book"
          className="cta-reveal glass glass-orange glass-pill mt-10 inline-flex h-14 w-fit items-center justify-center px-9 text-center text-sm font-medium tracking-[0.01em] text-white transition-colors"
        >
          Book a call
        </Link>
      </div>
    </section>
  );
}

function KpiPane({ label, value }: { label: string; value: string }) {
  return (
    <GlassPane
      as="div"
      className="flex flex-col gap-1.5 p-3 text-left sm:gap-2 sm:p-5"
    >
      <p className="font-body text-[10px] leading-snug text-noah-ink-dim sm:text-[11px]">
        {label}
      </p>
      <p className="font-body text-base font-semibold tabular-nums whitespace-nowrap text-noah-ink sm:text-3xl">
        {value}
      </p>
      <p className="font-body text-[10px] text-noah-orange sm:text-[11px]">
        ▲ live, updating
      </p>
    </GlassPane>
  );
}

function CasePane({
  rank,
  title,
  time,
  timeLabel,
  money,
  moneyLabel,
}: {
  rank: string;
  title: string;
  time: string;
  timeLabel: string;
  money: string;
  moneyLabel: string;
}) {
  return (
    <GlassPane as="div" className="flex flex-col p-4 text-left sm:p-6">
      <span className="font-display text-xs text-noah-orange sm:text-sm">
        {rank}
      </span>
      <p className="mt-2 font-display text-lg tracking-tight sm:text-2xl">
        {title}
      </p>
      <div className="mt-4 flex gap-4 sm:mt-5 sm:gap-6">
        <div>
          <p className="font-display text-xl text-noah-ink sm:text-3xl">
            {time}
          </p>
          <p className="mt-1 font-body text-[10px] text-noah-ink-dim sm:text-xs">
            {timeLabel}
          </p>
        </div>
        <div>
          <p className="font-display text-xl text-noah-ink sm:text-3xl">
            {money}
          </p>
          <p className="mt-1 font-body text-[10px] text-noah-ink-dim sm:text-xs">
            {moneyLabel}
          </p>
        </div>
      </div>
    </GlassPane>
  );
}
