"use client";

import { useEffect, useRef } from "react";
import GlassPane from "@/components/GlassPane";
import { useReducedMotion } from "@/lib/useReducedMotion";

export type Testimonial = {
  quote: string;
  role: string;
  org: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We had a mapped, priced business case for our finance department before our usual vendor had finished the discovery call.",
    role: "Head of Operations",
    org: "logistics group",
  },
  {
    quote:
      "No slide decks. Just a clear map of where our process actually breaks, and three ways to fix it.",
    role: "COO",
    org: "mid-market insurer",
  },
  {
    quote:
      "The interviews alone surfaced problems our own process owners hadn't named out loud yet.",
    role: "VP Transformation",
    org: "manufacturing",
  },
  {
    quote:
      "Cheaper than the consultancy we almost hired, and we kept the knowledge in-house.",
    role: "Director of Operations",
    org: "healthcare network",
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
      const gap =
        parseFloat(getComputedStyle(scroller).columnGap || "0") || 20;
      return first.offsetWidth + gap;
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
      const mid = track.scrollLeft + track.clientWidth / 2;
      for (const card of cardRefs.current) {
        if (!card) continue;
        const cardMid = card.offsetLeft + card.offsetWidth / 2;
        const t = Math.max(
          -1.15,
          Math.min(1.15, (cardMid - mid) / Math.max(card.offsetWidth, 1))
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
    let settleTimer = 0;

    function settle() {
      window.clearTimeout(settleTimer);
      const step = stride();
      if (!step) return;
      const index = Math.round(scroller.scrollLeft / step);
      scroller.scrollTo({
        left: index * step,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }

    function settleSoon() {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(settle, 90);
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0) return;
      window.clearTimeout(settleTimer);
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
    }

    function onPointerUp(event: PointerEvent) {
      if (!drag) return;
      if (event.pointerId && event.pointerId !== drag.id) return;
      const moved = drag.moved;
      drag = null;
      scroller.classList.remove("quote-carousel--dragging");
      if (moved) settle();
    }

    function onWheel(event: WheelEvent) {
      const dx = event.deltaX !== 0 ? event.deltaX : event.deltaY;
      if (dx === 0) return;
      if (event.cancelable) event.preventDefault();
      scroller.scrollLeft += dx;
      wrap();
      settleSoon();
    }

    function onScrollEnd() {
      if (wrappingRef.current) return;
      wrap();
    }

    scroller.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("scrollend", onScrollEnd);

    return () => {
      window.clearTimeout(settleTimer);
      scroller.removeEventListener("scroll", onScroll);
      scroller.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      scroller.removeEventListener("wheel", onWheel);
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
        className="quote-carousel mt-8 cursor-grab overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:mt-16 [&::-webkit-scrollbar]:hidden"
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
            <GlassPane className="flex h-full min-h-[9rem] flex-col justify-between gap-5 px-6 py-5 sm:min-h-[11.5rem] sm:gap-6 sm:px-8 sm:py-6">
              <p className="font-display text-lg leading-snug tracking-tight sm:text-xl">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="font-body text-sm text-noah-ink-dim">
                <span className="block text-noah-ink">{item.role}</span>
                <span>{item.org}</span>
              </p>
            </GlassPane>
          </div>
        ))}
      </div>
    </section>
  );
}
