"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "@/lib/gsap";
import AnimatedBackdrop from "@/components/AnimatedBackdrop";
import HeroKpi from "@/components/HeroKpi";
import SplitWords from "@/components/SplitWords";
import { scrollToHash } from "@/lib/scrollToHash";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { Industry } from "@/lib/industries";

export default function IndustryHero({ industry }: { industry: Industry }) {
  const copyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setReady(true), 2500);
    return () => window.clearTimeout(timeout);
  }, [industry.slug]);

  useLayoutEffect(() => {
    if (!ready || !copyRef.current) return;
    const words = copyRef.current.querySelectorAll(".split-word");
    const rest = copyRef.current.querySelectorAll("[data-roll]");
    if (reducedMotion) {
      gsap.set([words, rest], { opacity: 1, y: 0 });
      return;
    }
    gsap.set(words, { opacity: 0, y: 14 });
    gsap.set(rest, { opacity: 0, y: 10 });
    const tl = gsap.timeline();
    tl.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.055,
      ease: "power2.out",
    }).to(
      rest,
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
      "-=0.1"
    );
    return () => {
      tl.kill();
    };
  }, [ready, reducedMotion, industry.slug]);

  return (
    <section className="relative flex min-h-[100dvh] w-full flex-col lg:items-end">
      <AnimatedBackdrop
        poster={industry.poster}
        motion={industry.video}
        animate={!reducedMotion}
        onReady={() => setReady(true)}
      />
      <div className="absolute inset-0 bg-noah-cream/58" />

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col px-6 pb-16 pt-24 sm:px-16 sm:pb-20 lg:h-full lg:justify-end lg:pt-0">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div ref={copyRef} className="industry-title max-w-xl text-left">
            <p
              data-roll
              className="font-body text-xs uppercase tracking-[0.2em] text-noah-ink-dim"
            >
              {industry.eyebrow}
            </p>
            <SplitWords
              as="h1"
              text={industry.title}
              className="mt-6 font-display text-4xl leading-[1.1] tracking-tight text-noah-ink sm:text-6xl"
            />
            <p
              data-roll
              className="mt-6 max-w-md font-body text-base text-noah-ink-dim sm:text-lg"
            >
              {industry.body}
            </p>
            <a
              data-roll
              href="#comparison"
              onClick={(event) => {
                event.preventDefault();
                scrollToHash("#comparison");
              }}
              className="glass glass-pill mt-10 flex h-12 w-fit items-center px-7 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
            >
              See how it works
            </a>
          </div>

          <HeroKpi
            moneyStart={industry.moneyStart}
            hoursStart={industry.hoursStart}
            alerts={industry.alerts}
          />
        </div>
      </div>
    </section>
  );
}
