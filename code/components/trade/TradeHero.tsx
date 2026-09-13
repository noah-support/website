"use client";

import { useLayoutEffect, useRef } from "react";
import GlassPane from "@/components/GlassPane";
import SplitWords from "@/components/SplitWords";
import { TradeHeroForm } from "@/components/trade/TradeForm";
import { gsap } from "@/lib/gsap";
import { TRADE_HERO } from "@/lib/trade";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function TradeHero({
  recaptchaSiteKey,
}: {
  recaptchaSiteKey: string;
}) {
  const copyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (!copyRef.current) return;
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
  }, [reducedMotion]);

  return (
    <section className="relative w-full">
      <div className="relative z-10 w-full px-6 pb-16 pt-28 sm:px-16 sm:pb-20 sm:pt-32">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-start gap-10 lg:flex-row lg:gap-14">
          <div className="w-full shrink-0 lg:w-[min(100%,32rem)]">
            <TradeHeroForm recaptchaSiteKey={recaptchaSiteKey} />
          </div>

          <div
            ref={copyRef}
            className="industry-title flex min-w-0 flex-1 flex-col text-left lg:pt-2"
          >
            <p
              data-roll
              className="font-body text-xs uppercase tracking-[0.2em] text-noah-ink-dim"
            >
              {TRADE_HERO.eyebrow}
            </p>
            <SplitWords
              as="h1"
              text={TRADE_HERO.title}
              className="mt-6 font-display text-4xl leading-[1.1] tracking-tight text-noah-ink sm:text-6xl"
            />
            <p
              data-roll
              className="mt-6 max-w-md font-body text-base text-noah-ink-dim sm:text-lg"
            >
              {TRADE_HERO.lede}
            </p>
            <p
              data-roll
              className="mt-4 max-w-md font-body text-base text-noah-ink-dim sm:text-lg"
            >
              {TRADE_HERO.body}
            </p>
            <div data-roll className="mt-10 w-full max-w-md">
              <GlassPane tilt className="flex flex-col gap-2 p-6 sm:p-8">
                <p className="font-body text-[11px] uppercase tracking-[0.16em] text-noah-ink-dim">
                  {TRADE_HERO.offerLabel}
                </p>
                <p className="font-display text-4xl tracking-tight text-noah-orange sm:text-5xl">
                  {TRADE_HERO.offerValue}
                </p>
                <p className="mt-2 font-body text-sm leading-relaxed text-noah-ink-dim sm:text-base">
                  {TRADE_HERO.offerBody}
                </p>
              </GlassPane>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
