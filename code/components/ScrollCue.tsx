"use client";

import { useEffect, useRef, useState } from "react";
import { isProgrammaticScroll } from "@/lib/scrollToHash";

type ScrollCueProps = {
  label?: string;
  tone?: "light" | "dark";
  className?: string;
};

/**
 * A small "keep scrolling" hint. Shows while its section dominates the
 * viewport, and dismisses itself the moment the reader actually scrolls
 * while it's showing — it's a nudge, not a nag.
 */
export default function ScrollCue({
  label = "Keep scrolling",
  tone = "light",
  className = "",
}: ScrollCueProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [dominant, setDominant] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setDominant(entry.intersectionRatio > 0.6);
        if (entry.intersectionRatio <= 0.6) setDismissed(false);
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Only scrolling *down* takes the hint — it dismissed on any input
  // before, which meant scrolling back up to the hero dismissed the cue on
  // the way in and it never reappeared. Coming back up makes it relevant
  // again, so it un-dismisses. Measured from scroll position rather than
  // wheel events so it behaves the same for trackpad, keyboard and
  // scrollbar, and inside pinned sections where the cue never leaves view.
  useEffect(() => {
    if (!dominant) return;
    let last = window.scrollY;
    let downward = 0;

    function onScroll() {
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      // A menu jump is a long downward scroll. Counting it would hide the
      // cue on the empty first frame of a pin, which is when it is needed.
      if (isProgrammaticScroll()) {
        downward = 0;
        setDismissed(false);
        return;
      }
      if (delta > 0) {
        downward += delta;
        if (downward > 24) setDismissed(true);
      } else if (delta < -24) {
        downward = 0;
        setDismissed(false);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dominant]);

  const visible = dominant && !dismissed;
  const color = tone === "dark" ? "text-noah-fog/70" : "text-noah-ink/45";

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      } ${className}`}
    >
      <span
        className={`font-body text-[10px] uppercase tracking-[0.18em] ${color}`}
      >
        {label}
      </span>
      <svg
        viewBox="0 0 24 24"
        className={`scroll-cue-chevron h-4 w-4 ${color}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
