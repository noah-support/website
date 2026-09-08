"use client";

import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

const SPOTLIGHTS = [
  {
    eyebrow: "Grounded in reality",
    title: "Built from real interviews.",
    body: "Every recommendation traces back to something a real person on your team said, not a template pulled from a generic playbook.",
    alt: "A team member speaking into a phone during a Noah interview.",
    image: "/interview.jpg",
  },
  {
    eyebrow: "No guesswork",
    title: "Priced, not theoretical.",
    body: "Every fix ships with a time estimate and a money estimate attached, ranked, so you know exactly what to do first.",
    alt: "A priced Noah impact dashboard open on a laptop.",
    image: "/figures.jpg",
  },
  {
    eyebrow: "Fully autonomous",
    title: "Fully autonomous.",
    body: "Noah runs the interviews, the mapping, and the business cases without a consultant in the room. You get the work done — not another person sitting in.",
    alt: "Noah running the transformation work on its own.",
    image: "/autonomous.jpg",
  },
];

function FeatureRow({
  item,
  index,
}: {
  item: (typeof SPOTLIGHTS)[number];
  index: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25, "0px 0px -12% 0px");
  const reducedMotion = useReducedMotion();
  const imageRight = index % 2 === 0;

  return (
    <div className="-mt-px grid min-h-[70vh] grid-cols-1 border-y border-noah-ink-hairline lg:h-[78vh] lg:min-h-0 lg:grid-cols-2">
      <div
        className={`flex items-center border-b border-noah-ink-hairline px-6 py-16 sm:px-16 lg:border-b-0 ${
          imageRight
            ? "lg:order-1 lg:border-r lg:border-noah-ink-hairline"
            : "lg:order-2 lg:border-l lg:border-noah-ink-hairline"
        }`}
      >
        <div
          ref={ref}
          className="feature-copy max-w-lg"
          data-visible={inView || reducedMotion ? "" : undefined}
        >
          <p className="feature-reveal font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
            {item.eyebrow}
          </p>
          <h3 className="feature-reveal mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
            {item.title}
          </h3>
          <p className="feature-reveal mt-5 font-body text-noah-ink-dim sm:text-lg">
            {item.body}
          </p>
        </div>
      </div>
      <div
        className={`relative min-h-[44vh] overflow-hidden lg:min-h-0 ${
          imageRight ? "lg:order-2" : "lg:order-1"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.alt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

export default function Features() {
  return (
    <section className="relative flex flex-col">
      {SPOTLIGHTS.map((item, index) => (
        <FeatureRow key={item.title} item={item} index={index} />
      ))}
    </section>
  );
}
