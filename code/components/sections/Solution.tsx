"use client";

import { Fragment, type CSSProperties, type ReactNode } from "react";
import GlassPane from "@/components/GlassPane";
import PartSlider from "@/components/PartSlider";
import BusinessCases from "@/components/sections/BusinessCases";
import InnovationMap from "@/components/sections/InnovationMap";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

const INTRO_TITLE = "Introducing a third option: Noah.";
const INTRO_SUBLINE =
  "A digital transformation agent that does the heavy lifting for you. Noah interviews your teams, maps workflows, and uncovers innovation opportunities. Then, you receive a prioritised, ready-to-execute roadmap, with Noah right by your side to help build the fixes.";
/** One mapped process, step by step. */
const PROCESS_STEPS = [
  { label: "Invoice received" },
  { label: "Manual check" },
  { label: "Payment approved" },
];

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

function SolutionSplit({
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
  return (
    <ScrollBlock
      className={`flex min-h-[80vh] flex-col ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      }`}
    >
      <div className="flex w-full items-center px-6 py-16 sm:w-1/2 sm:px-16 sm:py-20">
        <div
          className={`industry-how-copy max-w-lg ${reverse ? "" : "ml-auto"}`}
        >
          <p className="industry-in font-display text-4xl tracking-tight sm:text-5xl">
            {title}
          </p>
          <p className="industry-in mt-4 font-body text-noah-ink-dim sm:text-lg">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="industry-how-media relative w-full sm:w-1/2">{media}</div>
    </ScrollBlock>
  );
}

/**
 * Coded phone, rather than a picture of one: a liquid-glass shell held at a
 * fixed 3D angle with a dynamic island, wrapping the interviewer screenshot.
 *
 * The screen keeps the screenshot's own 998×1648 ratio instead of a real
 * iPhone's 19.5:9 — that shot has the "noah." mark and "Logout" hard against
 * its left and right edges, and any crop tight enough to make the silhouette
 * properly phone-shaped clips them both.
 *
 * The 3D tilt stays on the outer element. The entrance rotation lives on
 * the inner one, so the two transforms never overwrite each other.
 */
function InterviewPhone() {
  return (
    <div
      className="flex h-full items-center justify-center px-6 py-20 sm:justify-start sm:pl-4 sm:pr-12"
      style={{ perspective: "1100px" }}
    >
      <div
        className="w-full max-w-[270px] sm:max-w-[320px]"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateY(-19deg) rotateX(5deg)",
        }}
      >
        <div data-phone className="relative">
          {/* Side buttons, tucked against the frame edge */}
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

          {/* Glass shell — same material as the other panes, but with the
              tint tokens overridden to a dark device frame. */}
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
            {/* Screen */}
            <div className="relative aspect-[998/1648] overflow-hidden rounded-[2.15rem] bg-noah-cream">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/interviewer-screenshot.png"
                alt="Noah conducting an interview session"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Dynamic island */}
              <span
                className="absolute left-1/2 top-[10px] h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-noah-navy-deep"
                aria-hidden
              />

              {/* Specular sheen across the glass */}
              <span
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(115deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.06) 26%, transparent 46%)",
                }}
                aria-hidden
              />
            </div>

            {/* Bright rim along the top-left edge, where the light catches */}
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
  const marked = index === 1;
  return (
    <div
      className="relative flex w-full flex-col items-center py-2 sm:py-3"
      style={{ "--i": index } as CSSProperties}
    >
      <svg
        data-arrow
        viewBox="0 0 24 128"
        className="h-16 w-6 text-noah-ink-faint sm:h-20"
        fill="none"
        aria-hidden
      >
        <path
          d="M12 2v112m0 0-7-8m7 8 7-8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {marked ? (
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div
            data-pain
            className="flex items-center gap-2.5 rounded-full border border-noah-orange/20 bg-noah-cream py-1.5 pl-1.5 pr-4 shadow-[0_10px_28px_-14px_rgba(20,23,42,0.45)]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-noah-orange/10 text-noah-orange">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="whitespace-nowrap font-body text-xs font-semibold uppercase tracking-[0.16em] text-noah-orange">
              Painpoint found
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ProcessDiagram() {
  return (
    <div className="flex h-full items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-md flex-col items-center">
        {PROCESS_STEPS.map((step, index) => (
          <Fragment key={step.label}>
            <div
              data-step
              className="w-full"
              style={{ "--i": index } as CSSProperties}
            >
              <GlassPane className="flex w-full items-center justify-center gap-3.5 px-10 py-7 sm:py-8">
                <span
                  data-dot
                  className="h-3 w-3 shrink-0 rounded-full bg-noah-orange"
                  aria-hidden
                />
                <span className="font-body text-lg font-medium tracking-[0.01em] text-noah-ink sm:text-xl">
                  {step.label}
                </span>
              </GlassPane>
            </div>
            {index < PROCESS_STEPS.length - 1 && <StepArrow index={index} />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default function Solution() {
  return (
    <div id="solution" className="relative flex flex-col">
      <ScrollBlock className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <div className="industry-how-copy max-w-4xl">
          <h2 className="industry-in font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl">
            {INTRO_TITLE}
          </h2>
          <p className="industry-in mt-6 font-body text-noah-ink-dim sm:text-lg">
            {INTRO_SUBLINE}
          </p>
        </div>
      </ScrollBlock>

      <SolutionSplit
        title="Interviews"
        subtitle="First, Noah interviews an entire department in 24 hours, surfacing the day-to-day operational insights from the people on the workfloor."
        media={<InterviewPhone />}
      />
      <SolutionSplit
        reverse
        title="Mapping"
        subtitle="Next, Noah maps those interviews across your entire workflow, highlighting the exact friction points slowing you down."
        media={<ProcessDiagram />}
      />

      <ScrollBlock className="flex min-h-[80vh] flex-col items-center justify-center">
        <BusinessCases />
        <InnovationMap />
      </ScrollBlock>
      <PartSlider nextPart={3} />
    </div>
  );
}
