"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import GlassPane from "@/components/GlassPane";
import SplitWords from "@/components/SplitWords";
import PartSlider, { holdPartGate } from "@/components/PartSlider";
import ScrollCue from "@/components/ScrollCue";

const DIY_CONS = [
  "No internal expertise to draw on",
  "Your best people's time, spent elsewhere",
  "Takes months to see anything",
  "Reinvents a wheel someone already built",
];

const CONSULTANT_CONS = [
  "Day rates that outprice the fix",
  "Takes months to see anything",
  "A subjective read of your business",
  "The knowledge leaves when they do",
];

const STAGE_A_TEXT =
  "No organisation's processes are perfect — the goal is to get as close as possible.";
const STAGE_B_TEXT = "Big organisations only have two options to get there.";
const STAGE_C_TEXT = "Two options. Neither is good enough.";

/**
 * Scroll progress at which both option panes have finished settling. From
 * here to the end of the pin the scene just holds — which is exactly where
 * the part-2 gate takes over and stops the page moving.
 * 10.9 / 13.5 of the timeline below.
 */
const GATE_AT = 0.81;
/**
 * Once armed the gate stays armed until well below GATE_AT. Without that
 * hysteresis, holding the page at the gate line leaves progress hovering
 * right on the threshold, and the arm/disarm flicker resets the gauge to
 * zero every few frames — so the gate could never be filled.
 */
const GATE_RELEASE = 0.74;

export default function Problem() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageARef = useRef<HTMLDivElement>(null);
  const stageBRef = useRef<HTMLDivElement>(null);
  const stageCRef = useRef<HTMLDivElement>(null);
  const paneDiyRef = useRef<HTMLDivElement>(null);
  const paneConsultantRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [gateActive, setGateActive] = useState(false);
  const releasedRef = useRef(false);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      const wordsA = stageARef.current?.querySelectorAll(".split-word") ?? [];
      const wordsB = stageBRef.current?.querySelectorAll(".split-word") ?? [];

      gsap.set(wordsA, { opacity: 0, y: 14 });
      gsap.set(stageBRef.current, { opacity: 0 });
      gsap.set(wordsB, { opacity: 0, y: 14 });
      gsap.set(stageCRef.current, { opacity: 0 });
      gsap.set(paneDiyRef.current, {
        opacity: 0,
        x: -30,
        y: -170,
        rotate: -20,
        rotateY: -25,
        scale: 0.85,
      });
      gsap.set(paneConsultantRef.current, {
        opacity: 0,
        x: 30,
        y: -170,
        rotate: 20,
        rotateY: 25,
        scale: 0.85,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=540%",
          scrub: 0.6,
          pin: true,
          pinType: "fixed",
          anticipatePin: 1,
          onUpdate: (self) => {
            holdPartGate(self, GATE_AT, GATE_RELEASE, releasedRef, setGateActive);
          },
        },
      });

      // Words appear gracefully rather than instantly — a soft, scroll-linked
      // typewriter, staggered rather than character-by-character.
      tl.to(wordsA, { opacity: 1, y: 0, duration: 0.7, stagger: 0.035 }, 0)
        // Quote A holds after the typewriter, then leaves completely
        // before B starts — overlapping the two left both quotes readable
        // at once and cut the typewriter short.
        .to(stageARef.current, { opacity: 0, y: -40, duration: 1 }, 2.6)
        .to(stageBRef.current, { opacity: 1, duration: 1 }, 3.9)
        .to(wordsB, { opacity: 1, y: 0, duration: 0.7, stagger: 0.035 }, 4.15)
        .to(stageBRef.current, { opacity: 0, y: -40, duration: 1 }, 6.0)
        .to(stageCRef.current, { opacity: 1, duration: 1 }, 6.0)
        // Panes tumble in like falling leaves — a fall-and-drift step, then
        // a settle — instead of sliding in on a straight line. Staggered
        // far enough that each pane gets its own stretch of scroll.
        .to(
          paneDiyRef.current,
          { y: -40, x: 16, rotate: 6, duration: 0.8, ease: "power1.out" },
          7.2
        )
        .to(
          paneDiyRef.current,
          {
            y: 0,
            x: 0,
            rotate: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            duration: 1.3,
            ease: "power2.out",
          },
          8.0
        )
        .to(
          paneConsultantRef.current,
          { y: -40, x: -16, rotate: -6, duration: 0.8, ease: "power1.out" },
          8.8
        )
        .to(
          paneConsultantRef.current,
          {
            y: 0,
            x: 0,
            rotate: 0,
            rotateY: 0,
            scale: 1,
            opacity: 1,
            duration: 1.3,
            ease: "power2.out",
          },
          9.6
        )
        // Empty spacer: holds both panes settled and readable across the
        // tail of the pin. 10.9 / 13.5 = GATE_AT, so the gate arms exactly
        // as the second pane lands, and the rest of the pin is the held zone.
        .to({}, { duration: 2.6 }, 10.9);
    }, wrapperRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section
        id="problem"
        className="relative flex flex-col gap-24 px-6 py-32 text-center"
      >
        <h2 className="mx-auto max-w-3xl font-display text-4xl leading-tight">
          {STAGE_A_TEXT}
        </h2>
        <h2 className="mx-auto max-w-2xl font-display text-4xl leading-tight">
          {STAGE_B_TEXT}
        </h2>
        <OptionPanes />
      </section>
    );
  }

  return (
    <section id="problem" className="relative">
      <div ref={wrapperRef} className="relative h-screen overflow-hidden">
        <div
          ref={stageARef}
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
        >
          <SplitWords
            text={STAGE_A_TEXT}
            className="max-w-4xl font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl"
          />
        </div>

        <div
          ref={stageBRef}
          className="absolute inset-0 flex items-center justify-center px-6 text-center"
        >
          <SplitWords
            text={STAGE_B_TEXT}
            className="max-w-3xl font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl"
          />
        </div>

        <div
          ref={stageCRef}
          className="absolute inset-0 flex flex-col items-center justify-center gap-10 px-6 py-24 sm:gap-14"
          style={{ perspective: "1400px" }}
        >
          <h2 className="max-w-3xl text-center font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {STAGE_C_TEXT}
          </h2>
          <div className="grid w-full max-w-5xl gap-6 sm:grid-cols-2 sm:gap-8">
            <div ref={paneDiyRef}>
              <OptionPane title="DIY" cons={DIY_CONS} />
            </div>
            <div ref={paneConsultantRef}>
              <OptionPane title="Consultant" cons={CONSULTANT_CONS} />
            </div>
          </div>
        </div>
        <ScrollCue />
      </div>

      <PartSlider
        nextPart={3}
        forceActive={gateActive}
        onReleaseChange={(value) => {
          releasedRef.current = value;
        }}
      />
    </section>
  );
}

function OptionPanes() {
  return (
    <div className="flex flex-col items-center gap-10">
      <h2 className="max-w-3xl font-display text-3xl leading-tight tracking-tight sm:text-4xl">
        {STAGE_C_TEXT}
      </h2>
      <div className="mx-auto grid w-full max-w-5xl gap-6 sm:grid-cols-2 sm:gap-8">
        <OptionPane title="DIY" cons={DIY_CONS} />
        <OptionPane title="Consultant" cons={CONSULTANT_CONS} />
      </div>
    </div>
  );
}

function OptionPane({ title, cons }: { title: string; cons: string[] }) {
  return (
    <GlassPane tilt className="h-full p-8 text-left sm:p-10">
      <p className="font-display text-2xl tracking-tight sm:text-3xl">
        {title}
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {cons.map((con) => (
          <li
            key={con}
            className="flex items-start gap-3 font-body text-sm text-noah-ink-dim sm:text-base"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-noah-orange" />
            {con}
          </li>
        ))}
      </ul>
    </GlassPane>
  );
}
