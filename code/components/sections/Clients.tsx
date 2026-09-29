"use client";

import { useEffect, useRef } from "react";
import GlassPane from "@/components/GlassPane";
import { useReducedMotion } from "@/lib/useReducedMotion";

export type Testimonial = {
  company: string;
  figure: string;
  label: string;
  quote: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    company: "ADB Safegate",
    figure: "1 week",
    label: "to executive buy-in",
    quote:
      "Production teams used noah's insights to convince management and kick off high-ROI AI builds within 2 weeks.",
  },
  {
    company: "UCB",
    figure: "€250k+",
    label: "consulting saved",
    quote:
      "QA team identified top AI opportunities in 1 week, replacing months of external consulting. Moving forward with other teams.",
  },
  {
    company: "Vekoma",
    figure: "€350k+",
    label: "consulting saved",
    quote:
      "20 interviews in 1 day. Clear AI roadmap delivered the next day. Now company wide roll-out.",
  },
  {
    company: "Sweco",
    figure: "2,500",
    label: "employees interviewed",
    quote:
      "Company-wide AI insights on a continuous basis. Already €500k+ saved on consultants.",
  },
  {
    company: "Credendo",
    figure: "€100k+",
    label: "consulting saved",
    quote:
      "AI opportunities mapped across teams in under a week. Straight into execution. Now in T&C stage.",
  },
];

const COPIES = 3;

export default function Clients({
  id = "clients",
  eyebrow = "Clients",
  title = "Teams already changing how they work.",
  testimonials = TESTIMONIALS,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  testimonials?: Testimonial[];
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wrappingRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const scrollerNode = scrollerRef.current;
    if (!scrollerNode) return;
    const scroller: HTMLDivElement = scrollerNode;

    function stride() {
      const first = cardRefs.current[0];
      if (!first) return 0;
      const gap = parseFloat(getComputedStyle(scroller).columnGap);
      return first.offsetWidth + (Number.isFinite(gap) ? gap : 0);
    }

    function setWidth() {
      return stride() * testimonials.length;
    }

    function wrap() {
      const w = setWidth();
      if (!w) return;
      const x = scroller.scrollLeft;
      if (x < w) {
        wrappingRef.current = true;
        scroller.scrollLeft = x + w;
        wrappingRef.current = false;
      } else if (x >= w * 2) {
        wrappingRef.current = true;
        scroller.scrollLeft = x - w;
        wrappingRef.current = false;
      }
    }

    function paint() {
      const track = scrollerRef.current;
      if (!track) return;
      const trackRect = track.getBoundingClientRect();
      const mid = trackRect.left + trackRect.width / 2;
      for (const card of cardRefs.current) {
        if (!card) continue;
        const rect = card.getBoundingClientRect();
        const cardMid = rect.left + rect.width / 2;
        const t = Math.max(
          -1.15,
          Math.min(1.15, (cardMid - mid) / Math.max(rect.width, 1))
        );
        const abs = Math.abs(t);
        if (reducedMotion) {
          card.style.transform = "none";
          card.style.opacity = String(1 - Math.min(0.35, abs * 0.28));
          continue;
        }
        const compact = window.matchMedia("(max-width: 639px)").matches;
        const rotate = t * (compact ? -10 : -28);
        const rise = (1 - abs) * (compact ? 8 : 36);
        const scale = 1 - abs * (compact ? 0.04 : 0.06);
        card.style.transform = `perspective(1100px) rotateY(${rotate}deg) translateZ(${rise}px) scale(${scale})`;
        card.style.opacity = String(1 - Math.min(0.18, abs * 0.16));
      }
    }

    function onScroll() {
      paint();
      if (!wrappingRef.current) wrap();
    }

    wrappingRef.current = true;
    scroller.scrollLeft = setWidth();
    wrappingRef.current = false;
    paint();

    scroller.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      const w = setWidth();
      if (!w) return;
      const n = testimonials.length;
      const index = Math.round(scroller.scrollLeft / stride()) % n;
      wrappingRef.current = true;
      scroller.scrollLeft = w + ((index + n) % n) * stride();
      wrappingRef.current = false;
      paint();
    });
    ro.observe(scroller);

    let drag: { id: number; x: number; left: number; moved: boolean } | null =
      null;

    function settle() {
      const step = stride();
      if (!step) return;
      const index = Math.round(scroller.scrollLeft / step);
      scroller.scrollTo({
        left: index * step,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        left: scroller.scrollLeft,
        moved: false,
      };
      try {
        scroller.setPointerCapture(event.pointerId);
      } catch {
        /* capture isn't available on every pointer type */
      }
      scroller.classList.add("quote-carousel--dragging");
    }

    function onPointerMove(event: PointerEvent) {
      if (!drag) return;
      if (event.pointerId && event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 3) return;
      event.preventDefault();
      drag.moved = true;
      scroller.scrollLeft = drag.left - dx;
      wrap();
      paint();
    }

    function onPointerUp(event: PointerEvent) {
      if (!drag) return;
      if (event.pointerId && event.pointerId !== drag.id) return;
      const moved = drag.moved;
      drag = null;
      scroller.classList.remove("quote-carousel--dragging");
      if (moved) settle();
    }

    function onScrollEnd() {
      if (wrappingRef.current) return;
      wrap();
    }

    scroller.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    scroller.addEventListener("scrollend", onScrollEnd);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      scroller.removeEventListener("scrollend", onScrollEnd);
      ro.disconnect();
    };
  }, [reducedMotion, testimonials]);

  return (
    <section id={id} className="relative px-0 py-16 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-16">
        <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          {eyebrow}
        </p>
        <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
          {title}
        </h2>
      </div>

      <div
        ref={scrollerRef}
        className="quote-carousel mt-8 [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-16 [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: COPIES }, (_, copy) =>
          testimonials.map((item, index) => ({
            ...item,
            key: `${copy}-${index}`,
          }))
        )
          .flat()
          .map((item, index) => (
          <div
            key={item.key}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            className="quote-carousel-card"
          >
            <GlassPane className="flex h-full min-h-[16rem] flex-col justify-between gap-6 px-6 py-6 sm:min-h-[18rem] sm:px-8 sm:py-7">
              <div>
                <p className="font-display text-4xl tracking-tight sm:text-5xl">
                  {item.figure}
                </p>
                <p className="mt-2 font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
                  {item.label}
                </p>
                <p className="mt-5 font-body text-base leading-snug sm:text-lg">
                  {item.quote}
                </p>
              </div>
              <p className="font-display text-lg tracking-tight sm:text-xl">
                {item.company}
              </p>
            </GlassPane>
          </div>
        ))}
      </div>
    </section>
  );
}
