"use client";

import { Fragment, type CSSProperties, type ReactNode } from "react";
import GlassPane from "@/components/GlassPane";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Industry, IndustryCase } from "@/lib/industries";

function InterviewPhone() {
  return (
    <div
      className="flex h-full items-center justify-center px-6 py-16 sm:justify-start sm:py-20 sm:pl-4 sm:pr-12"
      style={{ perspective: "1100px" }}
    >
      <div
        data-phone-stage
        className="w-full max-w-[270px] sm:max-w-[320px]"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateY(-19deg) rotateX(5deg)",
        }}
      >
        <div data-phone className="relative">
          <span
            className="absolute -left-px top-[23%] h-11 w-[2px] rounded-l-full bg-noah-ink/40"
            aria-hidden
          />
          <span
            className="absolute -left-px top-[34%] h-16 w-[2px] rounded-l-full bg-noah-ink/40"
            aria-hidden
          />
          <span
            className="absolute -right-px top-[29%] h-14 w-[2px] rounded-r-full bg-noah-ink/40"
            aria-hidden
          />
          <div
            className="glass relative rounded-[2.75rem] p-[10px] shadow-[0_40px_80px_-20px_rgba(20,23,42,0.45)]"
            style={
              {
                "--glass-tint-top": "rgba(18, 20, 34, 0.88)",
                "--glass-tint-bottom": "rgba(10, 12, 22, 0.95)",
                "--glass-border": "rgba(8, 10, 18, 0.9)",
                "--glass-rim": "rgba(255, 255, 255, 0.32)",
              } as CSSProperties
            }
          >
            <div className="relative aspect-[998/1648] overflow-hidden rounded-[2.15rem] bg-noah-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/interviewer-screenshot.png"
                alt="Noah conducting an interview session"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <span
                className="absolute left-1/2 top-[10px] h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-noah-navy-deep"
                aria-hidden
              />
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.06) 26%, transparent 46%)",
                }}
                aria-hidden
              />
            </div>
            <span
              className="pointer-events-none absolute inset-0 rounded-[2.75rem]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.55), transparent 34%)",
                mixBlendMode: "overlay",
              }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StepArrow({ index }: { index: number }) {
  return (
    <svg
      data-arrow
      viewBox="0 0 24 40"
      className="my-3 h-8 w-6 text-noah-ink-faint"
      style={{ "--i": index } as CSSProperties}
      fill="none"
      aria-hidden
    >
      <path
        d="M12 2v30m0 0-6-7m6 7 6-7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProcessDiagram({ steps }: { steps: { label: string }[] }) {
  return (
    <div className="flex h-full items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-xs flex-col items-center">
        {steps.map((step, index) => (
          <Fragment key={step.label}>
            <div
              data-step
              className="w-full"
              style={{ "--i": index } as CSSProperties}
            >
              <GlassPane className="flex w-full items-center justify-center gap-3 px-6 py-5">
                <span
                  data-dot
                  className="h-2 w-2 shrink-0 rounded-full bg-noah-orange"
                  aria-hidden
                />
                <span className="font-body text-sm font-medium tracking-[0.01em] text-noah-ink sm:text-base">
                  {step.label}
                </span>
              </GlassPane>
            </div>
            {index < steps.length - 1 && <StepArrow index={index} />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function CaseCard(item: IndustryCase) {
  return (
    <GlassPane tilt className="flex h-full min-h-min flex-col p-8 text-left sm:p-9">
      <span className="font-display text-sm text-noah-orange">{item.rank}</span>
      <p className="mt-3 font-display text-2xl tracking-tight">{item.title}</p>
      <div className="mt-6 flex gap-6">
        <div>
          <p className="font-display text-3xl text-noah-ink">{item.time}</p>
          <p className="mt-1 font-body text-xs text-noah-ink-dim">
            {item.timeLabel}
          </p>
        </div>
        <div>
          <p className="font-display text-3xl text-noah-ink">{item.money}</p>
          <p className="mt-1 font-body text-xs text-noah-ink-dim">
            {item.moneyLabel}
          </p>
        </div>
      </div>
      <p className="mt-6 font-body text-sm leading-relaxed text-noah-ink-dim">
        {item.explanation}
      </p>
    </GlassPane>
  );
}

function HowBlock({
  title,
  subtitle,
  media,
  reverse = false,
}: {
  title: string;
  subtitle: string;
  media: ReactNode;
  reverse?: boolean;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.28, "0px 0px -10% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <div
      ref={ref}
      className={`industry-how-block flex min-h-[80vh] flex-col ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      }`}
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      <div className="flex w-full items-center px-6 py-16 sm:w-1/2 sm:px-16">
        <div className={`industry-how-copy max-w-lg ${reverse ? "" : "ml-auto"}`}>
          <p className="industry-in font-display text-4xl tracking-tight sm:text-5xl">
            {title}
          </p>
          <p className="industry-in mt-4 font-body text-noah-ink-dim sm:text-lg">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="industry-how-media relative w-full sm:w-1/2">{media}</div>
    </div>
  );
}

export default function IndustryHow({ industry }: { industry: Industry }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.2, "0px 0px -8% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <section id="what-we-do" className="relative flex flex-col">
      <HowBlock
        title={industry.interviews.title}
        subtitle={industry.interviews.subtitle}
        media={<InterviewPhone />}
      />
      <HowBlock
        title={industry.mapping.title}
        subtitle={industry.mapping.subtitle}
        reverse
        media={<ProcessDiagram steps={industry.mapping.steps} />}
      />
      <div
        ref={ref}
        className="industry-how-block relative flex min-h-[80vh] flex-col items-center justify-center gap-8 px-6 py-16 sm:gap-12 sm:px-16 sm:py-20"
        data-visible={inView || reducedMotion ? "" : undefined}
      >
        <div className="industry-how-copy max-w-2xl text-center">
          <h2 className="industry-in font-display text-4xl tracking-tight sm:text-5xl">
            {industry.casesTitle}
          </h2>
          <p className="industry-in mt-5 font-body text-noah-ink-dim sm:text-lg">
            {industry.casesBody}
          </p>
        </div>
        <div className="industry-how-cases grid w-full max-w-md grid-cols-1 items-stretch gap-6 sm:max-w-6xl sm:grid-cols-4 sm:gap-8 lg:grid-cols-3">
          {industry.cases.map((item, index) => (
            <div
              key={item.rank}
              className={`industry-how-case ${
                index === 2
                  ? "sm:col-span-2 sm:col-start-2 lg:col-span-1 lg:col-start-auto"
                  : "sm:col-span-2 lg:col-span-1"
              }`}
            >
              <div
                data-case
                className="flex min-h-min flex-1 flex-col"
                style={{ "--i": index } as CSSProperties}
              >
                <CaseCard {...item} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
