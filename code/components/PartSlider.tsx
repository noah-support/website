"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { isProgrammaticScroll } from "@/lib/scrollToHash";

type PartSliderProps = {
  nextPart: number;
  /**
   * When provided, visibility (and therefore the lock) is driven
   * externally — e.g. by a GSAP-pinned section's own scroll progress, so
   * the gate can engage the moment its scene has finished assembling
   * rather than at the end of the pin's scroll distance.
   */
  forceActive?: boolean;
  /**
   * Viewport heights to jump on release. Default matches the remaining
   * pin behind the Problem and Solution gates; a longer pin needs more.
   */
  releaseVh?: number;
  /**
   * Fired the instant the gauge fills (before the page jumps) and again
   * once the jump has settled. Parents use this to stop clamping the pin
   * at the gate line so the release scroll can actually leave.
   */
  onReleaseChange?: (released: boolean) => void;
};

type GateTrigger = {
  progress: number;
  isActive: boolean;
  start: number;
  end: number;
  scroll: (value?: number) => number;
};

/**
 * Keep a pinned scene from skipping its part gate on a fast flick.
 * `p >= 0.995` used to drop the lock the moment progress jumped to the
 * end of the pin; this instead clamps scroll at the gate line until the
 * slider has been filled, then lets the release jump through.
 */
export function holdPartGate(
  self: GateTrigger,
  gateAt: number,
  gateRelease: number,
  releasedRef: { current: boolean },
  setGateActive: (next: boolean | ((prev: boolean) => boolean)) => void
) {
  const p = self.progress;

  if (releasedRef.current || !self.isActive || isProgrammaticScroll()) {
    setGateActive((prev) => (prev ? false : prev));
    return;
  }

  if (p >= gateAt) {
    const target = self.start + gateAt * (self.end - self.start);
    if (self.scroll() > target + 1) {
      self.scroll(target);
    }
    setGateActive((prev) => (prev ? prev : true));
    return;
  }

  if (p <= gateRelease) {
    setGateActive((prev) => (prev ? false : prev));
  }
}

/**
 * Sits at the end of a "part". While it's armed, forward scroll is blocked
 * outright — the page does not move until the reader keeps scrolling long
 * enough in one go to fill the gauge. Scrolling back up is always free, and
 * stopping partway lets the fill decay and waits (see design-language.md on
 * scrolljacking — this is the one place on the page that deliberately
 * overrides scroll, gated behind sustained intent rather than a timer, and
 * always escapable by going back up).
 */
export default function PartSlider({
  nextPart,
  forceActive,
  releaseVh = 1.35,
  onReleaseChange,
}: PartSliderProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [observedActive, setObservedActive] = useState(false);
  // A release has to run to completion before the gate can arm again —
  // otherwise it would re-lock the reader the instant the release scroll
  // started moving them.
  const [released, setReleased] = useState(false);
  const reducedMotion = useReducedMotion();
  const active = (forceActive ?? observedActive) && !reducedMotion;
  const locked = active && !released;
  const valueRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const rafRef = useRef(0);
  const lockedRef = useRef(false);
  const openRef = useRef(false);
  const onReleaseChangeRef = useRef(onReleaseChange);
  lockedRef.current = locked;
  onReleaseChangeRef.current = onReleaseChange;

  useEffect(() => {
    if (forceActive !== undefined) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setObservedActive(entry.isIntersecting),
      { threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [forceActive]);

  // Always-on capture listeners. Attaching them only after React paints
  // `locked` left a frame where a fast flick could skip the gate before
  // preventDefault was even subscribed.
  useEffect(() => {
    function threshold() {
      // Touch deltas are smaller than a trackpad flick, so the same
      // pixel budget on a phone makes the gate feel stuck.
      return window.matchMedia("(max-width: 639px)").matches ? 420 : 1100;
    }

    function bump(delta: number) {
      if (!lockedRef.current || openRef.current || delta <= 0) return;
      valueRef.current = Math.min(1, valueRef.current + delta / threshold());
      if (valueRef.current >= 1) {
        openRef.current = true;
        onReleaseChangeRef.current?.(true);
        setReleased(true);
      }
    }

    // The lock works by cancelling the input at the source, so the page
    // never scrolls at all and nothing has to be corrected afterwards.
    // Clamping the scroll offset (in holdPartGate) is the backup for
    // uncancellable inertia that still gets through.
    function onWheel(event: WheelEvent) {
      if (!lockedRef.current || openRef.current || event.deltaY <= 0) return;
      if (event.cancelable) event.preventDefault();
      bump(event.deltaY);
    }
    let touchY: number | null = null;
    function onTouchStart(event: TouchEvent) {
      touchY = event.touches[0]?.clientY ?? null;
    }
    function onTouchMove(event: TouchEvent) {
      if (touchY == null || openRef.current || !lockedRef.current) return;
      const y = event.touches[0]?.clientY ?? touchY;
      const delta = touchY - y;
      touchY = y;
      if (delta <= 0) return;
      if (event.cancelable) event.preventDefault();
      bump(delta);
    }
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
    };
  }, []);

  // Fill decay + reset, only while the gate is actually holding.
  useEffect(() => {
    if (!locked) return;

    valueRef.current = 0;
    openRef.current = false;
    trackRef.current?.style.setProperty("--fill", "0");

    const DECAY_MS = 650;

    function tick(ts: number) {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = ts - lastTsRef.current;
      lastTsRef.current = ts;
      if (!openRef.current) {
        valueRef.current *= Math.exp(-dt / DECAY_MS);
        trackRef.current?.style.setProperty(
          "--fill",
          valueRef.current.toFixed(4)
        );
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [locked]);

  // Carry the reader through to the next part, then allow re-arming.
  useEffect(() => {
    if (!released) return;
    valueRef.current = 0;
    trackRef.current?.style.setProperty("--fill", "0");
    // Enough to clear the remaining pin distance behind the gate and land
    // inside the next part.
    window.scrollBy({
      top: window.innerHeight * releaseVh,
      behavior: "smooth",
    });
    const id = window.setTimeout(() => {
      onReleaseChangeRef.current?.(false);
      setReleased(false);
    }, 1300);
    return () => window.clearTimeout(id);
  }, [released, releaseVh]);

  return (
    <>
      <div
        ref={sentinelRef}
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full"
        aria-hidden
      />
      <div
        className={`fixed bottom-6 left-5 z-30 transition-all duration-300 sm:bottom-10 sm:left-8 ${
          active
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
        aria-hidden={!active}
      >
        <div
          ref={trackRef}
          className="part-slider glass glass-pill flex h-14 items-center gap-4 pl-2 pr-7 sm:h-16"
          style={{ "--fill": 0 } as CSSProperties}
        >
          <span className="part-slider-fill" aria-hidden />
          <span
            className={`part-slider-circle ${locked ? "part-slider-circle--locked" : ""}`}
          >
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
