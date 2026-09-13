"use client";

import { useLayoutEffect, useRef } from "react";
import SplitWords from "@/components/SplitWords";
import { ABOUT_MANIFESTO, ABOUT_QUOTE } from "@/lib/about";
import { gsap } from "@/lib/gsap";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function AboutMission() {
  const quoteBoxRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { ref: manifestoRef, inView } = useInView<HTMLDivElement>(
    0.25,
    "0px 0px -12% 0px"
  );

  useLayoutEffect(() => {
    if (reducedMotion || !quoteBoxRef.current) return;
    const words = quoteBoxRef.current.querySelectorAll(".split-word");
    const cite = quoteBoxRef.current.querySelector("[data-cite]");
    gsap.set(words, { opacity: 0, y: 14 });
    gsap.set(cite, { opacity: 0, y: 10 });
    const tl = gsap.timeline();
    tl.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.055,
      ease: "power2.out",
    }).to(
      cite,
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.1"
    );
    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  return (
    <section className="relative px-6 pb-24 pt-32 sm:px-16 sm:pb-32 sm:pt-36">
      {/* One idea: why we exist. */}
      <div ref={quoteBoxRef}>
        <SplitWords
          as="blockquote"
          text={ABOUT_QUOTE}
          className="max-w-3xl pb-1 font-display text-3xl italic leading-[1.15] tracking-tight text-noah-ink sm:text-5xl lg:text-6xl"
        />
        <p
          data-cite
          className="mt-6 font-body text-sm uppercase tracking-[0.18em] text-noah-ink-dim"
        >
          Noah
        </p>
      </div>

      <div
        ref={manifestoRef}
        className="feature-copy mt-16 max-w-2xl sm:mt-24"
        data-visible={inView || reducedMotion ? "" : undefined}
      >
        {ABOUT_MANIFESTO.map((paragraph, index) => (
          <p
            key={paragraph}
            className="feature-reveal mt-6 font-body text-base leading-relaxed text-noah-ink-dim first:mt-0 sm:text-lg"
            style={{ transitionDelay: `${index * 90}ms` }}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
