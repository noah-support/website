"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type PartSliderProps = {
  nextPart: number;
  /**
   * Pinned scenes turn the hint on from their own scroll progress.
   * Unpinned sections use the sentinel at the bottom of the section.
   */
  forceActive?: boolean;
};

/**
 * A hint that the next part is ahead. It does not catch the wheel, fill
 * a gauge, or jump the page — scrolling stays native the whole time.
 */
export default function PartSlider({ nextPart, forceActive }: PartSliderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [observedActive, setObservedActive] = useState(false);
  const reducedMotion = useReducedMotion();
  const active = (forceActive ?? observedActive) && !reducedMotion;

  useEffect(() => {
    if (forceActive !== undefined) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setObservedActive(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [forceActive]);

  return (
    <>
      <div
        ref={sentinelRef}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full"
        aria-hidden
      />
      <div
        className={`pointer-events-none fixed bottom-6 left-5 z-30 transition-all duration-300 sm:bottom-10 sm:left-8 ${
          active
            ? "translate-y-0 opacity-100"
            : "translate-y-2 opacity-0"
        }`}
        aria-hidden={!active}
      >
        <div className="part-slider glass glass-pill flex h-14 items-center gap-4 pl-2 pr-7 sm:h-16">
          <span className="part-slider-circle part-slider-circle--locked">
            <svg viewBox="0 0 24 24" className="h-4 w-4">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="relative z-10 flex flex-col leading-tight">
            <span className="whitespace-nowrap font-body text-sm font-semibold tracking-[0.01em] text-noah-ink sm:text-base">
              Go to part {nextPart}
            </span>
            <span className="whitespace-nowrap font-body text-[10px] uppercase tracking-[0.16em] text-noah-ink-dim">
              Keep scrolling
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
