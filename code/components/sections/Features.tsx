"use client";

import Image from "next/image";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

export type FeatureItem = {
  eyebrow: string;
  title: string;
  body: string;
  alt: string;
  image: string;
  quote?: string;
};

const SPOTLIGHTS: FeatureItem[] = [
  {
    eyebrow: "AI-based interviews",
    title: "Grounded in reality",
    body: "We did more than 8,000 client interviews, every recommendation traces back to something a real person on your team said. Not a generic template.",
    alt: "A team member speaking into a phone during a Noah interview.",
    image: "/interview.jpg",
  },
  {
    eyebrow: "Business cases",
    title: "Actionable, not theoretical",
    body: "Every fix ships with a time estimate and a money estimate attached, ranked, so you know exactly what to do first.",
    alt: "A priced Noah impact dashboard open on a laptop.",
    image: "/figures.jpg",
  },
  {
    eyebrow: "Real world examples",
    title: "Grounded by market insights",
    body: "Noah bases all its findings on what the market is already doing with AI. In our curated database of over 10,000 examples, there is a solution to every problem in the world.",
    alt: "Noah looks at market insights",
    image: "/rwc.jpg",
  },
  {
    eyebrow: "New way of working",
    title: "Fully autonomous",
    body: "Noah runs the interviews, asks the follow-up questions, and builds the PoC. You and your team just have to make the decisions.",
    alt: "Noah running the transformation work on its own.",
    image: "/autonomous.jpg",
  },
];

function FeatureRow({ item, index }: { item: FeatureItem; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.25, "0px 0px -12% 0px");
  const reducedMotion = useReducedMotion();
  const imageRight = index % 2 === 0;

  if (item.quote) {
    return (
      <div className="-mt-px grid min-h-[70vh] grid-cols-1 border-y border-noah-ink-hairline lg:h-[78vh] lg:min-h-0 lg:grid-cols-2">
        <div className="flex items-center border-b border-noah-ink-hairline px-6 py-16 sm:px-16 lg:border-b-0 lg:border-r lg:border-noah-ink-hairline">
          <div
            ref={ref}
            className="feature-copy max-w-lg"
            data-visible={inView || reducedMotion ? "" : undefined}
          >
            <p className="feature-reveal font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
              {item.eyebrow}
            </p>
            <h2 className="feature-reveal mt-4 font-display text-4xl leading-tight tracking-tight sm:text-5xl">
              {item.title}
            </h2>
            <p className="feature-reveal mt-5 font-body text-noah-ink-dim sm:text-lg">
              {item.body}
            </p>
          </div>
        </div>
        <div className="flex items-center px-6 py-16 sm:px-16">
          <blockquote className="max-w-lg">
            <p className="font-display text-3xl leading-snug tracking-tight sm:text-4xl">
              &ldquo;{item.quote}&rdquo;
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/noah-logo-mark.svg"
              alt="Noah"
              className="mt-8 h-8 w-auto object-contain object-left"
            />
          </blockquote>
        </div>
      </div>
    );
  }

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
        <Image
          src={item.image}
          alt={item.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}

const QUOTES = [
  "The interviews alone surfaced problems our own process owners hadn't named out loud yet.",
  "We had a mapped, priced business case for our finance department before our usual vendor had finished the discovery call.",
  "No slide decks. Just a clear map of where our process actually breaks, and three ways to fix it.",
];

export default function Features({
  id,
  items = SPOTLIGHTS,
  quotes = false,
}: {
  id?: string;
  items?: FeatureItem[];
  quotes?: boolean;
}) {
  const rows = quotes
    ? items.map((item, index) => ({
        ...item,
        quote: item.quote ?? QUOTES[index],
      }))
    : items;

  return (
    <section id={id} className="relative flex flex-col">
      {rows.map((item, index) => (
        <FeatureRow key={item.title} item={item} index={index} />
      ))}
    </section>
  );
}
