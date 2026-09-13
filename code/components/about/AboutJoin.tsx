"use client";

import Image from "next/image";
import Link from "next/link";
import {
  JOIN_BODY,
  JOIN_CTA,
  JOIN_IMAGE,
  JOIN_IMAGE_ALT,
  JOIN_TITLE,
} from "@/lib/about";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function AboutJoin() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25, "0px 0px -12% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <section
      className="relative -mt-px grid min-h-[70vh] grid-cols-1 border-y border-noah-ink-hairline lg:h-[78vh] lg:min-h-0 lg:grid-cols-2"
      aria-labelledby="about-join-heading"
    >
      {/* One idea: come work here. */}
      <div className="flex items-center border-b border-noah-ink-hairline px-6 py-16 sm:px-16 lg:border-b-0 lg:border-r lg:border-noah-ink-hairline">
        <div
          ref={ref}
          className="feature-copy max-w-lg"
          data-visible={inView || reducedMotion ? "" : undefined}
        >
          <h2
            id="about-join-heading"
            className="feature-reveal font-display text-4xl leading-tight tracking-tight sm:text-5xl"
          >
            {JOIN_TITLE}
          </h2>
          <p className="feature-reveal mt-5 max-w-md font-body text-noah-ink-dim sm:text-lg">
            {JOIN_BODY}
          </p>
          <Link
            href="/jobs"
            className="feature-reveal glass glass-pill mt-10 inline-flex h-14 w-fit items-center justify-center px-9 text-center text-sm font-medium tracking-[0.01em] text-noah-ink transition-colors hover:text-noah-orange active:scale-[0.98]"
          >
            {JOIN_CTA}
          </Link>
        </div>
      </div>
      <div className="relative min-h-[44vh] overflow-hidden lg:min-h-0">
        <Image
          src={JOIN_IMAGE}
          alt={JOIN_IMAGE_ALT}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          loading="eager"
        />
      </div>
    </section>
  );
}
