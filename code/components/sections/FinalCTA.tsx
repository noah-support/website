"use client";

import Link from "next/link";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function FinalCTA({
  eyebrow = "Ready when you are",
  title = "One department. Twenty-four hours. No guesswork.",
}: {
  eyebrow?: string;
  title?: string;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.35, "0px 0px -10% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="cta-stage relative flex min-h-[80vh] flex-col items-center justify-center gap-10 overflow-hidden bg-noah-ink/5 px-6 text-center"
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      <div
        className="cta-glow absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(235,92,28,0.16), transparent 65%)",
        }}
      />
      <div className="relative z-10 flex flex-col items-center">
        <p className="cta-reveal font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          {eyebrow}
        </p>
        <h2 className="cta-reveal mt-6 max-w-3xl font-display text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          {title}
        </h2>
        <Link
          href="/book"
          className="cta-reveal glass glass-pill mt-10 inline-flex h-14 w-fit items-center justify-center px-9 text-center text-sm font-medium tracking-[0.01em] text-noah-ink transition-colors hover:text-noah-orange"
        >
          Book a call
        </Link>
      </div>
    </section>
  );
}
