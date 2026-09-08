"use client";

import { useEffect, useRef, useState } from "react";

type LiveCounterOptions = {
  minDelay?: number;
  maxDelay?: number;
  minStep?: number;
  maxStep?: number;
  reduced?: boolean;
};

/**
 * A number that climbs upward forever in small, randomly-timed steps —
 * meant to read as a live dashboard metric, never resetting down.
 */
export function useLiveCounter(start: number, options: LiveCounterOptions = {}) {
  const {
    minDelay = 1800,
    maxDelay = 4200,
    minStep = 0.004,
    maxStep = 0.018,
    reduced = false,
  } = options;
  const [value, setValue] = useState(start);
  const displayRef = useRef(start);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let raf = 0;
    let timeout: number;

    function scheduleNext() {
      const delay = minDelay + Math.random() * (maxDelay - minDelay);
      timeout = window.setTimeout(tick, delay);
    }

    function tick() {
      if (cancelled) return;
      const from = displayRef.current;
      const step = minStep + Math.random() * (maxStep - minStep);
      const to = from * (1 + step);
      const duration = 900;
      const startTs = performance.now();

      function animate(ts: number) {
        if (cancelled) return;
        const p = Math.min(1, (ts - startTs) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = from + (to - from) * eased;
        displayRef.current = current;
        setValue(current);
        if (p < 1) {
          raf = requestAnimationFrame(animate);
        } else {
          scheduleNext();
        }
      }
      raf = requestAnimationFrame(animate);
    }

    scheduleNext();
    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [reduced, minDelay, maxDelay, minStep, maxStep]);

  return value;
}
