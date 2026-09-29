"use client";

import type { CSSProperties, ReactNode } from "react";
import GlassPane from "@/components/GlassPane";
import PartSlider from "@/components/PartSlider";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

const DIY_CONS = [
  "Manual interviews that take weeks",
  "No data to prove a problem matters",
  "Zero alignment on which department to optimize first",
  "Result: Six months go by with zero results",
];

const CONSULTANT_CONS = [
  "Static advice that is instantly outdated",
  "Generic frameworks disguised as custom advice",
  "Advice shaped to sell you their next project",
  "Result: a 500K invoice with only theories",
];

const STAGE_TITLE =
  "Big organisations only have two options for transformation.";

function ScrollBlock({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.28, "0px 0px -10% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className={`industry-how-block ${className ?? ""}`}
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      {children}
    </div>
  );
}

export default function Problem() {
  return (
    <section id="problem" className="relative flex flex-col">
      <ScrollBlock className="flex flex-col items-center justify-center gap-8 px-6 py-24 sm:gap-10 sm:px-16 sm:py-20">
        <h2 className="industry-in max-w-4xl text-center font-display text-3xl leading-[1.08] tracking-tight sm:text-5xl">
          {STAGE_TITLE}
        </h2>
        <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-2 sm:gap-8">
          <div data-case style={{ "--i": 0 } as CSSProperties}>
            <OptionPane title="In-house" cons={DIY_CONS} />
          </div>
          <div data-case style={{ "--i": 1 } as CSSProperties}>
            <OptionPane title="Consultants" cons={CONSULTANT_CONS} />
          </div>
        </div>
      </ScrollBlock>
      <PartSlider nextPart={2} />
    </section>
  );
}

function OptionPane({ title, cons }: { title: string; cons: string[] }) {
  return (
    <GlassPane tilt className="h-full p-5 text-left sm:p-10">
      <p className="font-display text-xl tracking-tight sm:text-3xl">{title}</p>
      <ul className="mt-3 flex flex-col gap-1.5 sm:mt-6 sm:gap-3">
        {cons.map((con) => (
          <li
            key={con}
            className="flex items-start gap-2 font-body text-[13px] leading-snug text-noah-ink-dim sm:gap-3 sm:text-base"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-noah-orange" />
            {con}
          </li>
        ))}
      </ul>
    </GlassPane>
  );
}
