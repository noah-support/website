"use client";

import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import GlassPane from "@/components/GlassPane";
import PartSlider, { holdPartGate } from "@/components/PartSlider";
import SplitWords from "@/components/SplitWords";
import ScrollCue from "@/components/ScrollCue";
import BusinessCases from "@/components/sections/BusinessCases";

const INTRO_TITLE = "But there is a third option, called Noah.";
const INTRO_SUBLINE =
  "A digital transformation agent that interviews your team, maps how the work actually flows, and hands you priced business cases you can act on.";

/** One mapped process, step by step. */
const PROCESS_STEPS = [
  { label: "Invoice received" },
  { label: "Manual check" },
  { label: "Payment approved" },
];

/**
 * Timeline units allotted to each beat. Mapping is longer so the process
 * steps have to be scrolled into place rather than arriving in a burst.
 */
const SPAN = 2.3;
const MAPPING_SPAN = 3.7;

/**
 * The outgoing beat fades out first and the incoming one only starts after
 * this gap, instead of both crossing at once. Costs a moment of empty cream
 * at each handover, which is what keeps two scenes from reading on top of
 * each other.
 */
const HANDOVER = 0.45;
const FADE = 0.55;

/**
 * Extra timeline units after the last beat has finished assembling, before
 * it dissolves. The part gate arms across this hold, so the reader is held
 * on the cases — the same shape as the gate at the end of part 2.
 */
const HOLD = 1.2;

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
    <div
      className={`flex min-h-screen flex-col ${
        reverse ? "sm:flex-row-reverse" : "sm:flex-row"
      }`}
    >
      <div className="flex w-full items-center px-6 py-20 sm:w-1/2 sm:px-16">
        <div className={`max-w-lg ${reverse ? "" : "ml-auto"}`}>
          <p
            data-roll
            className="font-display text-4xl tracking-tight sm:text-5xl"
          >
            {title}
          </p>
          <p data-roll className="mt-4 font-body text-noah-ink-dim sm:text-lg">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="relative w-full sm:w-1/2">{media}</div>
    </div>
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
 * The 3D tilt and the Z rotation live on two separate elements on purpose.
 * GSAP rewrites the whole transform of whatever it animates, and it cannot
 * recover rotateY/rotateX cleanly from a composed 3D matrix — so the tilt
 * stays untouched on the outer element and the scroll tween only ever
 * touches the inner one's plain 2D rotation.
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
        <div data-phone className="relative" style={{ transform: "rotate(-1.5deg)" }}>
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

function StepArrow() {
  return (
    <svg
      data-arrow
      viewBox="0 0 24 40"
      className="my-3 h-8 w-6 text-noah-ink-faint"
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

function ProcessDiagram() {
  return (
    <div className="flex h-full items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-xs flex-col items-center">
        {PROCESS_STEPS.map((step, index) => (
          <Fragment key={step.label}>
            <div data-step className="w-full">
              <GlassPane className="flex w-full items-center justify-center gap-3 px-6 py-5">
                {/* Marker for the step currently arriving. Always rendered so
                    the label never shifts when it lights up. */}
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
            {index < PROCESS_STEPS.length - 1 && <StepArrow />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function Intro() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <SplitWords
        text={INTRO_TITLE}
        className="max-w-4xl font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl"
      />
      <p data-roll className="max-w-xl font-body text-noah-ink-dim sm:text-lg">
        {INTRO_SUBLINE}
      </p>
    </div>
  );
}

export default function Solution() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const [gateActive, setGateActive] = useState(false);
  const releasedRef = useRef(false);

  const beats: ReactNode[] = [
    <Intro key="intro" />,
    <SolutionSplit
      key="interviews"
      title="Interviews"
      subtitle="First, it interviews a whole department bottom-up in 24 hours, surfacing the operational insight only the people doing the work actually have."
      media={<InterviewPhone />}
    />,
    <SolutionSplit
      key="mapping"
      reverse
      title="Mapping"
      subtitle="Then it maps those conversations onto your processes end to end, and marks exactly where they break down."
      media={<ProcessDiagram />}
    />,
    <BusinessCases key="cases" />,
  ];

  // The beats sit stacked on top of each other inside one pinned stage and
  // cross-fade, so nothing ever slides vertically — the same in-place
  // dissolve the part-1 quotes use. Fades are matched-rate and start
  // together; mismatched durations leave two beats readable at once.
  // Each beat then plays its own entrance inside its own span.
  useLayoutEffect(() => {
    if (reducedMotion || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      const stage = beatRefs.current.filter(Boolean) as HTMLDivElement[];
      if (stage.length < 2) return;

      gsap.set(stage.slice(1), { opacity: 0 });

      // Progress at which the cases have finished assembling and the hold
      // begins. Mapping is a longer beat so its steps take more scroll.
      // Cases on small screens need extra length: each card flies in and
      // the deck restacks, instead of three landing in a row.
      const stackedCases = window.matchMedia("(max-width: 639px)").matches;
      const spans = stage.map((_, index) => {
        if (index === 2) return MAPPING_SPAN;
        if (index === 3 && stackedCases) return 3.6;
        return SPAN;
      });
      const totalSpan = spans.reduce((sum, n) => sum + n, 0);
      const duration = totalSpan + HOLD + FADE;
      const gateAt = totalSpan / duration;
      // Hysteresis: once armed the gate stays armed until well below
      // gateAt, so holding the page right on the threshold cannot flicker
      // the gauge back to zero (see the same guard in Problem).
      const gateRelease = gateAt - 0.06;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          // Keep pinSpacing on. With it off, GSAP holds the stage in place
          // by translating it down as you scroll, and that translate stays
          // applied on release — parking the stage exactly on top of the
          // next section instead of clearing out of the way.
          // One extra screen on top of the per-beat allowance, for the
          // held zone the gate sits in.
          end: `+=${Math.round(duration * 80 + 120)}%`,
          scrub: 0.6,
          pin: true,
          pinType: "fixed",
          anticipatePin: 1,
          onUpdate: (self) => {
            holdPartGate(self, gateAt, gateRelease, releasedRef, setGateActive);
          },
        },
      });

      stage.forEach((beat, index) => {
        const at = spans.slice(0, index).reduce((sum, n) => sum + n, 0);
        const span = spans[index];

        // Beat 0 is lit from the start — its words are its entrance.
        // Every other beat waits out the handover gap first.
        const entrance = index === 0 ? 0.35 : at + HANDOVER;
        if (index > 0) tl.to(beat, { opacity: 1, duration: FADE }, entrance);
        // Every beat dissolves as the next one arrives. For the last beat
        // that position is the end of the pin: pinning always leaves one
        // screen in which the released stage travels up and off, and a lit
        // beat would ride up alongside the next section coming in.
        // The last beat holds while the gate is armed, then dissolves.
        const isLast = index === stage.length - 1;
        tl.to(beat, { opacity: 0, duration: FADE }, at + span + (isLast ? HOLD : 0));

        buildBeat(tl, beat, entrance);
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <div id="solution" className="relative">
        {beats}
      </div>
    );
  }

  return (
    // Transparent, so the viewport-fixed blobs on <body> show through here
    // like they do everywhere else.
    <div id="solution" className="relative">
      <div ref={wrapperRef} className="relative h-screen overflow-hidden">
        {beats.map((beat, index) => (
          <div
            key={index}
            ref={(el) => {
              beatRefs.current[index] = el;
            }}
            className="absolute inset-0"
          >
            {beat}
          </div>
        ))}
        <ScrollCue />
      </div>

      <PartSlider
        nextPart={4}
        forceActive={gateActive}
        onReleaseChange={(value) => {
          releasedRef.current = value;
        }}
      />
    </div>
  );
}

/**
 * Scroll-linked entrance for one beat. `at` is when the beat starts fading
 * in, not when its span starts — the content follows the fade rather than
 * playing under it.
 */
function buildBeat(tl: gsap.core.Timeline, beat: HTMLDivElement, at: number) {
  const q = <T extends HTMLElement | SVGElement>(sel: string) =>
    Array.from(beat.querySelectorAll<T>(sel));

  // Intro: words first, then the subline once the title is fully readable.
  const words = q<HTMLElement>(".split-word");
  if (words.length) {
    gsap.set(words, { opacity: 0, y: 14 });
    tl.to(words, { opacity: 1, y: 0, duration: 0.6, stagger: 0.035 }, at);
  }

  // All other copy in this part fades in from above, scroll-linked.
  const copy = q<HTMLElement>("[data-roll]");
  if (copy.length) {
    gsap.set(copy, { opacity: 0, y: -42 });
    tl.to(
      copy,
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power2.out" },
      // Behind the words when there are words to wait for.
      at + (words.length ? 1.15 : 0.15)
    );
  }

  // Interviews: the phone floats down into frame, turning clockwise as it
  // comes, and lands on the resting angle the static layout already used.
  const phone = q<HTMLElement>("[data-phone]")[0];
  if (phone) {
    gsap.set(phone, { opacity: 0, y: -360, rotation: -30 });
    tl.to(
      phone,
      {
        opacity: 1,
        y: 0,
        rotation: -1.5,
        duration: 1.2,
        ease: "power2.out",
      },
      at + 0.1
    );
  }

  // Mapping: steps arrive one by one with a small pop, and the orange marker
  // rides along with whichever step is currently arriving — then goes out
  // once the whole process is on screen.
  const steps = q<HTMLElement>("[data-step]");
  if (steps.length) {
    const arrows = q<SVGElement>("[data-arrow]");
    const dots = q<HTMLElement>("[data-dot]");
    gsap.set(steps, { opacity: 0, y: -48, scale: 0.9 });
    gsap.set(arrows, { opacity: 0 });
    gsap.set(dots, { opacity: 0, scale: 0.4 });

    steps.forEach((step, i) => {
      const t = at + 0.25 + i * 0.75;
      tl.to(dots[i], { opacity: 1, scale: 1, duration: 0.22 }, t)
        .to(step, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, t)
        .to(step, { scale: 1.07, duration: 0.22, ease: "power2.out" }, t + 0.18)
        .to(step, { scale: 1, duration: 0.28, ease: "power2.inOut" }, t + 0.4)
        .to(dots[i], { opacity: 0, scale: 0.4, duration: 0.22 }, t + 0.62);
      if (arrows[i]) {
        tl.to(arrows[i], { opacity: 1, duration: 0.3 }, t + 0.42);
      }
    });
  }

  // Business cases: the same leaf tumble the part-2 option panes use — a
  // fall-and-drift, then a settle — one card after the other. On small
  // screens they share one cell and land as a deck: first card alone,
  // then the others fly in on top and the earlier ones recede.
  const cards = q<HTMLElement>("[data-case]");
  if (cards.length) {
    const stacked = window.matchMedia("(max-width: 639px)").matches;
    cards.forEach((card, i) => {
      const fromLeft = i % 2 === 0;
      const side = fromLeft ? -1 : 1;
      if (stacked) {
        // Stay solid the whole flight. Fading glass over the card below
        // lets two titles read at once.
        gsap.set(card, {
          opacity: 1,
          x: 40 * side,
          y: 240,
          rotate: 14 * side,
          scale: 0.92,
        });
        const t = at + 0.2 + i * 0.72;
        tl.to(
          card,
          {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          t
        );
        if (i > 0) {
          cards.slice(0, i).forEach((back, j) => {
            const depth = i - j;
            tl.to(
              back,
              {
                y: depth * 14,
                scale: 1 - depth * 0.045,
                duration: 0.5,
                ease: "power2.out",
              },
              t
            );
          });
        }
        return;
      }
      gsap.set(card, {
        opacity: 0,
        x: 34 * side,
        y: -200,
        rotate: 18 * side,
        rotateY: 22 * side,
        scale: 0.86,
      });
      const t = at + 0.1 + i * 0.32;
      tl.to(
        card,
        {
          opacity: 1,
          y: -46,
          x: -14 * side,
          rotate: -6 * side,
          duration: 0.35,
          ease: "power1.out",
        },
        t
      ).to(
        card,
        {
          x: 0,
          y: 0,
          rotate: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.55,
          ease: "power2.out",
        },
        t + 0.35
      );
    });
  }
}
