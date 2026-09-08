"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Aura } from "@/components/Aura";
import SplitWords from "@/components/SplitWords";
import ScrollCue from "@/components/ScrollCue";
import PartSlider, { holdPartGate } from "@/components/PartSlider";

const QUOTE_TITLE = "But we're not stopping there.";
const QUOTE_SUBLINE = "Real change doesn't end with a business case.";

const PAYOFF_TITLE = "Noah takes the work of transformation and does it for you.";
const PAYOFF_SUBLINE =
  "Noah is going to take charge of everything — from discovery and building the first MVP to management and support of the final build.";

/** Everything after discovery is on the roadmap, not on sale. */
const AVAILABILITY_NOTE = "Coming end of 2026";

const STAGES = [
  {
    title: "Discovery",
    description:
      "We interview a whole department bottom-up, surface real operational insight, and turn it into concrete business cases.",
    available: true,
  },
  {
    title: "Scoping",
    description:
      "We prepare the organisation to act — who champions the change, who needs convincing, and what a first experiment should actually test.",
    available: false,
  },
  {
    title: "MVP experiment",
    description:
      "We build and run a live proof of concept, measuring both the numbers and how the team experiences the change.",
    available: false,
  },
  {
    title: "Evaluate",
    description:
      "We read the experiment back with you and decide: build the business case out into a production version, or leave it at that.",
    available: false,
  },
] as const;

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const PARTICLE_COUNT = 26;

/**
 * Pin length in viewport heights. The first PLAY share is quote → circle →
 * spin → morph; the remainder is the held zone the part gate sits in, so
 * the pin does not release the moment the payoff arrives.
 */
const PIN_VH = 11;
const PLAY = 9 / PIN_VH;

function beat(start: number, end: number) {
  return [start * PLAY, end * PLAY] as const;
}

/**
 * Scroll progress breakpoints inside the pin. Written in the original 9vh
 * play units, then scaled by PLAY so extra pin length lands after the morph
 * instead of stretching every beat.
 */
const QUOTE_OUT = beat(0.15, 0.21);
// A beat of empty cream between the quote leaving and the circle arriving —
// overlapping the two left both scenes readable at once.
const CIRCLE_IN = beat(0.26, 0.32);
const CIRCLE_RUN = beat(0.32, 0.64);
const SPIN = beat(0.64, 0.95);
const TEXT_OUT = beat(0.64, 0.71);
const CIRCLE_OUT = beat(0.88, 0.96);
// The morph only starts once the circle has been spinning for most of the
// spin beat, so the reader has to keep scrolling through the spin-up before
// the shape gives way to the aura.
const AURA_IN = beat(0.84, 0.96);
const PAYOFF_IN = beat(0.94, 0.99);

/**
 * The aura + copy have finished assembling. From here the part gate holds
 * the scene until the reader fills the slider — the extra pin length is
 * that held zone, not free scroll into Clients.
 */
const GATE_AT = PAYOFF_IN[1];
const GATE_RELEASE = PAYOFF_IN[0] - 0.06;
/** Remaining pin after the gate, plus a beat to land in Clients. */
const GATE_RELEASE_VH = PIN_VH * (1 - GATE_AT) + 0.45;

/** How much wider the circle throws itself at full spin. */
const SWELL = 1.1;

/** How far the aura lifts off centre to make room for the payoff copy. */
const AURA_LIFT_VH = 13;

/** Rate at which the eased scalars below chase their scroll-driven target. */
const FOLLOW = 12;

/** Faster on the way back: the reset should read as a snap, not a fade. */
const RESET_FOLLOW = 26;

/** Sustained backward scroll, in pixels, that counts as turning back. */
const REVERSE_PX = 120;

/**
 * Forward scroll needed to re-arm the spin after the reader has turned back
 * into it — enough that nudging the page cannot restart the spin.
 */
const RE_ARM_PX = 200;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

/**
 * Eased chase that actually arrives: an exponential ease alone leaves a
 * couple of percent hanging around, which on display type reads as a ghost
 * of the beat that was supposed to be gone.
 */
function approach(value: number, target: number, k: number) {
  const next = value + (target - value) * k;
  return Math.abs(target - next) < 0.002 ? target : next;
}

/** Progress within a [start, end] window, clamped outside it. */
function span(p: number, range: readonly [number, number]) {
  return clamp01((p - range[0]) / (range[1] - range[0]));
}

function dotPosition(index: number) {
  const angle = (-90 + index * 90) * (Math.PI / 180);
  return {
    x: 100 + RADIUS * Math.cos(angle),
    y: 100 + RADIUS * Math.sin(angle),
  };
}

/** Fixed per-particle character, so the spray isn't a uniform starburst. */
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const golden = (i * 137.508 * Math.PI) / 180;
  return {
    angle: golden,
    // Staggered so they leave in waves rather than all at once.
    delay: ((i % 7) / 7) * 0.3,
    distance: 260 + ((i * 53) % 420),
    drift: (((i * 31) % 100) / 100 - 0.5) * 1.4,
    size: 2 + ((i * 17) % 5) * 0.7,
    warm: i % 3 !== 0,
  };
});

export default function Vision() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const circleLayerRef = useRef<HTMLDivElement>(null);
  const circleBoxRef = useRef<HTMLDivElement>(null);
  const stageTextRef = useRef<HTMLDivElement>(null);
  const stageNumberRef = useRef<HTMLDivElement>(null);
  const stageDotsRef = useRef<SVGGElement>(null);
  const progressCircleRef = useRef<SVGCircleElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const payoffTextRef = useRef<HTMLDivElement>(null);
  const particleRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [auraOn, setAuraOn] = useState(false);
  const [gateActive, setGateActive] = useState(false);
  const releasedRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      const words =
        quoteRef.current?.querySelectorAll(".split-word") ?? [];
      const quoteSub =
        quoteRef.current?.querySelector("[data-sub]") ?? [];

      gsap.set(words, { opacity: 0, y: 14 });
      gsap.set(quoteSub, { opacity: 0, y: 10 });

      // Distance from the circle's resting spot to the middle of the pinned
      // stage. Measured against the wrapper rather than the viewport so the
      // number is the same whether or not the section is currently pinned.
      let centerDx = 0;
      let centerDy = 0;
      function measure() {
        const box = circleBoxRef.current;
        const wrap = wrapperRef.current;
        if (!box || !wrap) return;
        const prev = box.style.transform;
        box.style.transform = "";
        const b = box.getBoundingClientRect();
        const w = wrap.getBoundingClientRect();
        centerDx = w.width / 2 - (b.left - w.left + b.width / 2);
        centerDy = w.height / 2 - (b.top - w.top + b.height / 2);
        box.style.transform = prev;
      }

      // Everything below is written by the rAF loop from an eased copy of
      // the scroll-driven target, so the reset on reverse reads as a snap
      // back rather than a teleport.
      let progress = 0;
      let lastScroll = 0;
      let forwardPx = 0;
      let backwardPx = 0;
      // Scrolling back up does not play the spin backwards — the circle
      // snaps back to its resting, unrotated state and the scene is just the
      // circle again (a reversed spin left the stage dots at a random angle).
      let reversed = false;

      let spinTarget = 0;
      let spinVisual = 0;
      let travel = 0;
      let rotation = 0;
      let auraValue = 0;
      let liftValue = 0;
      let circleValue = 0;
      let stageTextValue = 1;
      let payoffValue = 0;

      let last: number | null = null;
      let running = false;
      let raf = 0;

      // The spin is integrated over time rather than mapped straight from
      // scroll: scroll position sets the *speed*, so the circle keeps
      // accelerating away even while the reader holds still on the beat.
      function frame(now: number) {
        if (last == null) last = now;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const k = Math.min(1, dt * (reversed ? RESET_FOLLOW : FOLLOW));

        spinVisual = approach(spinVisual, reversed ? 0 : spinTarget, k);

        if (reversed) {
          // Unwind to the nearest whole turn: the stage dots have to land
          // back on 12/3/6/9 o'clock, not wherever the spin left them.
          const settled = Math.round(rotation / 360) * 360;
          rotation =
            Math.abs(settled - rotation) < 0.2
              ? settled
              : rotation + (settled - rotation) * k;
        } else {
          const ramp = spinVisual * spinVisual;
          // Once the aura owns the frame, stop adding speed so the hold
          // isn't a blender behind the copy.
          rotation +=
            dt * (spinVisual * 90 + ramp * 1500) * (1 - auraValue);
        }

        // The travel to centre finishes early in the spin, so the circle is
        // already sitting exactly where the aura appears while it is still
        // winding up — otherwise the two shapes never overlap.
        const t = clamp01(spinVisual / 0.35);
        travel = approach(travel, 1 - Math.pow(1 - t, 3), k);

        // It grows as it winds up: the faster it turns, the wider it throws
        // itself out, which is what hands the frame over to the aura.
        const swell = 1 + SWELL * spinVisual * spinVisual;

        const box = circleBoxRef.current;
        if (box) {
          box.style.transform = `translate3d(${centerDx * travel}px, ${
            centerDy * travel
          }px, 0) scale(${swell}) rotate(${rotation}deg)`;
        }

        for (let i = 0; i < PARTICLES.length; i += 1) {
          const el = particleRefs.current[i];
          const cfg = PARTICLES[i];
          if (!el || !cfg) continue;
          const local = clamp01((spinVisual - cfg.delay) / (1 - cfg.delay));
          if (local <= 0) {
            el.style.opacity = "0";
            continue;
          }
          const flight = local * local;
          const angle =
            cfg.angle + (rotation * Math.PI) / 180 * 0.15 + flight * cfg.drift;
          const r = RADIUS + flight * cfg.distance;
          el.style.transform = `translate3d(${Math.cos(angle) * r}px, ${
            Math.sin(angle) * r
          }px, 0)`;
          // In quickly, then gone before the aura has fully taken over.
          el.style.opacity = String(
            Math.min(1, local * 5) * (1 - clamp01((local - 0.55) / 0.45))
          );
        }

        // On the way back the circle scene is whole again: it neither fades
        // out nor loses its stage copy, and the aura and payoff are gone.
        const auraTarget = reversed ? 0 : span(progress, AURA_IN);
        const payoffTarget = reversed ? 0 : span(progress, PAYOFF_IN);
        const circleTarget = reversed
          ? span(progress, CIRCLE_IN)
          : span(progress, CIRCLE_IN) * (1 - span(progress, CIRCLE_OUT));
        const stageTextTarget = reversed ? 1 : 1 - span(progress, TEXT_OUT);

        auraValue = approach(auraValue, auraTarget, k);
        payoffValue = approach(payoffValue, payoffTarget, k);
        liftValue = approach(liftValue, payoffTarget, k);
        circleValue = approach(circleValue, circleTarget, k);
        stageTextValue = approach(stageTextValue, stageTextTarget, k);

        if (auraRef.current) {
          auraRef.current.style.opacity = String(auraValue);
          auraRef.current.style.transform = `translateY(${
            -AURA_LIFT_VH * liftValue
          }vh) scale(${0.35 + 0.65 * auraValue})`;
        }
        if (payoffTextRef.current) {
          payoffTextRef.current.style.opacity = String(payoffValue);
        }
        if (circleLayerRef.current) {
          circleLayerRef.current.style.opacity = String(circleValue);
        }
        if (stageTextRef.current) {
          stageTextRef.current.style.opacity = String(stageTextValue);
        }
        // The stage number and the stage dots ride inside the circle, so
        // they swell with it — both have to be gone before that reads as a
        // typo the size of a fist. The ring is the only thing left turning.
        const stageMarks = String(clamp01(1 - spinVisual * 3));
        if (stageNumberRef.current) {
          stageNumberRef.current.style.opacity = stageMarks;
        }
        if (stageDotsRef.current) {
          stageDotsRef.current.style.opacity = stageMarks;
        }

        raf = requestAnimationFrame(frame);
      }

      function start() {
        if (running) return;
        running = true;
        last = null;
        raf = requestAnimationFrame(frame);
      }
      function stop() {
        running = false;
        cancelAnimationFrame(raf);
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: `+=${PIN_VH * 100}%`,
          scrub: 0.5,
          pin: true,
          pinType: "fixed",
          anticipatePin: 1,
          onRefresh: measure,
          onUpdate: (self) => {
            const p = self.progress;
            progress = p;

            // Direction comes from the raw scroll position, not from
            // progress: with a smoothed scrub, progress keeps drifting after
            // the reader has stopped, and reading that as a reversal made
            // the reset flicker on and off. Both edges need sustained
            // travel, so a touchpad bounce settles nothing.
            const y = self.scroll();
            // The part gate clamps scroll at GATE_AT. That yank is
            // backward in the numbers, so without this guard a flick past
            // "Go to part 5" snaps the scene back to Evaluate.
            if (releasedRef.current || p >= GATE_AT - 0.01) {
              reversed = false;
              forwardPx = 0;
              backwardPx = 0;
            } else if (y < lastScroll - 1) {
              backwardPx += lastScroll - y;
              forwardPx = 0;
              if (backwardPx > REVERSE_PX) reversed = true;
            } else if (y > lastScroll + 1) {
              backwardPx = 0;
              forwardPx += y - lastScroll;
              if (forwardPx > RE_ARM_PX) reversed = false;
            }
            if (p <= SPIN[0]) {
              reversed = false;
              forwardPx = 0;
              backwardPx = 0;
            }
            lastScroll = y;

            const quoteOut = span(p, QUOTE_OUT);
            if (quoteRef.current) {
              quoteRef.current.style.opacity = String(1 - quoteOut);
              quoteRef.current.style.transform = `translateY(${-40 * quoteOut}px)`;
            }

            const t = span(p, CIRCLE_RUN);
            const index = Math.min(STAGES.length - 1, Math.floor(t * 4));
            setActiveIndex((prev) => (prev === index ? prev : index));
            if (progressCircleRef.current) {
              progressCircleRef.current.style.strokeDashoffset = String(
                CIRCUMFERENCE * (1 - t)
              );
            }

            spinTarget = span(p, SPIN);
            setAuraOn((prev) => prev || p > AURA_IN[0] - 0.1);
            holdPartGate(self, GATE_AT, GATE_RELEASE, releasedRef, setGateActive);
          },
        },
      });

      // The quote assembles inside the first tenth of the pin and the rest
      // of the timeline is an empty hold, so timeline units line up with the
      // progress breakpoints above (10 units = full progress) instead of
      // stretching the word reveal across the whole scene.
      tl.to(words, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0)
        .to(quoteSub, { opacity: 1, y: 0, duration: 0.6 }, 0.5)
        .to({}, { duration: 8.9 }, 1.1);

      measure();

      // The loop runs for as long as the section is mounted. Gating it on
      // visibility (or on the trigger's active state) left the scene frozen
      // mid-transition whenever the gate missed an edge, and the loop itself
      // is a handful of sums per frame.
      start();

      return stop;
    }, wrapperRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section id="vision" className="flex flex-col gap-16 px-6 py-28 sm:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            {QUOTE_TITLE}
          </h2>
          <p className="mt-5 font-body text-noah-ink-dim sm:text-lg">
            {QUOTE_SUBLINE}
          </p>
        </div>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-10">
          {STAGES.map((stage, index) => (
            <div
              key={stage.title}
              className={`flex gap-5 ${stage.available ? "" : "opacity-55"}`}
            >
              <span
                className={`font-display text-2xl ${
                  stage.available ? "text-noah-orange" : "text-noah-ink-faint"
                }`}
              >
                0{index + 1}
              </span>
              <div>
                <p className="font-display text-2xl tracking-tight">
                  {stage.title}
                </p>
                {!stage.available && (
                  <p className="mt-2 font-body text-xs uppercase tracking-[0.16em] text-noah-ink-faint">
                    {AVAILABILITY_NOTE}
                  </p>
                )}
                <p className="mt-2 font-body text-noah-ink-dim">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="font-display text-3xl leading-tight tracking-tight sm:text-4xl">
            {PAYOFF_TITLE}
          </h3>
          <p className="mt-5 font-body text-noah-ink-dim sm:text-lg">
            {PAYOFF_SUBLINE}
          </p>
        </div>
      </section>
    );
  }

  const stage = STAGES[activeIndex]!;

  return (
    <section id="vision" className="relative">
      <div
        ref={wrapperRef}
        className="relative h-screen overflow-hidden px-6 sm:px-16"
      >
        {/* Beat 1 — the turn into the vision. */}
        <div
          ref={quoteRef}
          className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
        >
          <SplitWords
            text={QUOTE_TITLE}
            className="max-w-4xl font-display text-4xl leading-[1.08] tracking-tight sm:text-6xl"
          />
          <p
            data-sub
            className="max-w-xl font-body text-noah-ink-dim sm:text-lg"
          >
            {QUOTE_SUBLINE}
          </p>
        </div>

        {/* Beat 2 — the way of working, one stage at a time. */}
        <div
          ref={circleLayerRef}
          className="absolute inset-0 flex flex-col items-center justify-center gap-12 opacity-0 sm:flex-row sm:gap-20"
        >
          <div
            ref={circleBoxRef}
            className="relative h-64 w-64 shrink-0 will-change-transform sm:h-80 sm:w-80"
          >
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <circle
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke="rgba(20,23,42,0.12)"
                strokeWidth="1"
              />
              <circle
                ref={progressCircleRef}
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke="var(--noah-orange)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE}
                transform="rotate(-90 100 100)"
              />
              <g ref={stageDotsRef}>
                {STAGES.map((item, index) => {
                  const { x, y } = dotPosition(index);
                  const visible = activeIndex >= index;
                  const current = activeIndex === index;
                  return (
                    <circle
                      key={item.title}
                      cx={x}
                      cy={y}
                      r={current ? 6 : 4}
                      fill={
                        current
                          ? item.available
                            ? "var(--noah-orange)"
                            : "var(--noah-ink-faint)"
                          : item.available
                            ? "var(--noah-ink)"
                            : "var(--noah-ink-faint)"
                      }
                      style={{
                        opacity: visible ? 1 : 0,
                        transition: "opacity 400ms ease, r 300ms ease",
                      }}
                    />
                  );
                })}
              </g>
            </svg>
            <div
              ref={stageNumberRef}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <span
                className={`font-display text-3xl ${
                  stage.available ? "text-noah-ink" : "text-noah-ink-faint"
                }`}
              >
                0{activeIndex + 1}
              </span>
            </div>

            {/* Sparks thrown off once the circle closes and spins up. */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {PARTICLES.map((particle, index) => (
                <span
                  key={index}
                  ref={(el) => {
                    particleRefs.current[index] = el;
                  }}
                  aria-hidden
                  className="absolute rounded-full opacity-0 will-change-transform"
                  style={{
                    width: particle.size,
                    height: particle.size,
                    background: particle.warm
                      ? "var(--noah-orange)"
                      : "var(--noah-indigo)",
                  }}
                />
              ))}
            </div>
          </div>

          <div
            ref={stageTextRef}
            className="w-full max-w-md text-center sm:text-left"
          >
            <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
              Our way of working — {activeIndex + 1} of {STAGES.length}
            </p>
            <div
              className={
                stage.available
                  ? ""
                  : "opacity-60 transition-opacity duration-500"
              }
            >
              <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
                {stage.title}
              </h2>
              {!stage.available && (
                <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-noah-ink-hairline px-3 py-1 font-body text-[10px] uppercase tracking-[0.16em] text-noah-ink-faint">
                  <span className="h-1 w-1 rounded-full bg-noah-ink-faint" />
                  {AVAILABILITY_NOTE}
                </span>
              )}
              <p className="mt-5 font-body text-noah-ink-dim sm:text-lg">
                {stage.description}
              </p>
            </div>
          </div>
        </div>

        {/* Beat 3 — the circle becomes the agent. */}
        <div className="pointer-events-none absolute inset-0">
          {/* Dead centre of the pinned stage — the circle is flown to exactly
              this spot, so the two shapes are on top of each other while one
              hands over to the other. */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              ref={auraRef}
              className="h-[min(120vw,82vh)] w-[min(120vw,82vh)] opacity-0 will-change-transform"
            >
              {auraOn && (
                <Aura agentState="thinking" className="h-full w-full" />
              )}
            </div>
          </div>
          {/* Positioned rather than stacked, so it can sit inside the aura's
              outer glow without shifting the aura off centre. */}
          <div
            ref={payoffTextRef}
            className="absolute inset-x-0 top-[58%] mx-auto max-w-2xl px-6 text-center opacity-0"
          >
            <h2 className="font-display text-3xl leading-[1.1] tracking-tight sm:text-5xl">
              {PAYOFF_TITLE}
            </h2>
            <p className="mt-5 font-body text-noah-ink-dim sm:text-lg">
              {PAYOFF_SUBLINE}
            </p>
          </div>
        </div>

        <ScrollCue />
      </div>

      <PartSlider
        nextPart={5}
        forceActive={gateActive}
        releaseVh={GATE_RELEASE_VH}
        onReleaseChange={(value) => {
          releasedRef.current = value;
        }}
      />
    </section>
  );
}
