"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import GlassPane from "@/components/GlassPane";

const PLANS = [
  {
    name: "One-time",
    price: "Single fee",
    audience: "For single departments",
    features: [
      "~10 personalised AI opportunities",
      "Results within 24 hours",
      "Max 20 employee interviews",
    ],
    cta: "Get started now",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom Pricing",
    audience: "For organisations going all in on AI",
    features: [
      "Continuously updated AI opportunities",
      "Unlimited employee interviews",
      "Real-world examples from 10,000+ proven cases",
    ],
    cta: "Get started now",
    href: "/book",
    highlighted: true,
  },
  {
    name: "Partner",
    price: "Pay/project",
    audience: "For consultants and agencies",
    features: [
      "Run AI discovery at your clients in hours, not months",
      "White-labeled environment per client",
      "Customizable interviews & output",
    ],
    cta: "Contact us",
    href: "/contact",
    highlighted: false,
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-plan]");
      cards.forEach((card, i) => {
        const fromLeft = i % 2 === 0;
        const side = fromLeft ? -1 : 1;
        gsap.set(card, {
          opacity: 0,
          x: 34 * side,
          y: -200,
          rotate: 18 * side,
          rotateY: 22 * side,
          scale: 0.86,
        });
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            end: "top 58%",
            scrub: 0.6,
          },
        });
        tl.to(card, {
          opacity: 1,
          y: -46,
          x: -14 * side,
          rotate: -6 * side,
          duration: 0.35,
          ease: "power1.out",
        }).to(card, {
          x: 0,
          y: 0,
          rotate: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.55,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center gap-12 px-6 py-28 sm:px-16"
    >
      <div className="max-w-2xl text-center">
        <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          Pricing
        </p>
        <h2 className="mt-4 font-display text-4xl tracking-tight sm:text-5xl">
          Three ways to start.
        </h2>
        <p className="mt-5 font-body text-noah-ink-dim sm:text-lg">
          One department, the whole organisation, or the work you run for
          clients.
        </p>
      </div>
      <div
        className="grid w-full max-w-6xl gap-6 sm:grid-cols-3 sm:gap-8"
        style={{ perspective: "1400px" }}
      >
        {PLANS.map((plan) => (
          <div data-plan key={plan.name} className="h-full">
            <PricingCard {...plan} />
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingCard({
  name,
  price,
  audience,
  features,
  cta,
  href,
  highlighted,
}: (typeof PLANS)[number]) {
  return (
    <GlassPane tilt className="flex h-full flex-col p-8 text-left sm:p-9">
      <span className="font-display text-sm text-noah-orange">{name}</span>
      <p className="mt-3 font-display text-3xl tracking-tight text-noah-ink">
        {price}
      </p>
      <p className="mt-1 font-body text-xs text-noah-ink-dim">{audience}</p>
      <ul className="mt-6 flex flex-col gap-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-3 font-body text-sm leading-relaxed text-noah-ink-dim sm:text-base"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-noah-orange" />
            {feature}
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-8">
        <Link
          href={href}
          className={
            highlighted
              ? "glass glass-pill glass-orange flex h-12 w-full items-center justify-center text-sm font-medium tracking-[0.01em] text-noah-cream"
              : "glass glass-pill flex h-12 w-full items-center justify-center text-sm font-medium tracking-[0.01em] text-noah-ink transition-colors hover:text-noah-orange"
          }
        >
          {cta}
        </Link>
      </div>
    </GlassPane>
  );
}
