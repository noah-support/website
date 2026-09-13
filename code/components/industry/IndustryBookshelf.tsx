"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import AnimatedBackdrop from "@/components/AnimatedBackdrop";
import SplitWords from "@/components/SplitWords";
import BookshelfScrollHint from "@/components/BookshelfScrollHint";
import { INDUSTRIES } from "@/lib/industries";
import { useReducedMotion } from "@/lib/useReducedMotion";

const TITLE = "Industries";

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export default function IndustryBookshelf() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(INDUSTRIES[0]?.slug ?? "");
  const titleRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 8000);

    void Promise.all(
      INDUSTRIES.flatMap((industry) => [
        preloadImage(industry.poster),
        preloadImage(industry.video),
      ])
    ).then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, []);

  useLayoutEffect(() => {
    if (!ready || !titleRef.current) return;
    const words = titleRef.current.querySelectorAll(".split-word");
    const sub = titleRef.current.querySelector("[data-sub]");
    if (reducedMotion) {
      gsap.set([words, sub], { opacity: 1, y: 0 });
      return;
    }
    gsap.set(words, { opacity: 0, y: 14 });
    gsap.set(sub, { opacity: 0, y: 10 });
    const tl = gsap.timeline();
    tl.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.055,
      ease: "power2.out",
    }).to(sub, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.1");
    return () => {
      tl.kill();
    };
  }, [ready, reducedMotion]);

  return (
    <main className="relative bg-noah-cream xl:h-[100dvh] xl:overflow-hidden xl:bg-noah-navy-deep">
      <div
        aria-hidden={!ready}
        className={`industry-loader ${ready ? "industry-loader--done" : ""}`}
      >
        <div className="industry-loader-track" aria-hidden>
          <span className="industry-loader-bar" />
        </div>
        <p className="mt-5 font-body text-[11px] uppercase tracking-[0.2em] text-noah-ink-dim">
          Loading
        </p>
      </div>

      <div
        ref={titleRef}
        className="industry-title relative z-20 bg-noah-cream px-6 pb-5 pt-24 xl:pointer-events-none xl:absolute xl:inset-x-0 xl:top-0 xl:bg-transparent xl:px-12 xl:pt-28"
      >
        <SplitWords
          as="h1"
          text={TITLE}
          className="font-display text-4xl leading-[1.1] tracking-tight text-noah-ink sm:text-5xl xl:text-7xl xl:text-noah-fog"
        />
        <p
          data-sub
          className="mt-3 max-w-md font-body text-sm text-noah-ink-dim sm:text-base xl:text-noah-fog-dim"
        >
          Pick a floor. Noah interviews, maps, and prices the work from there.
        </p>
      </div>

      <div className="industry-shelf xl:absolute xl:inset-0">
        {INDUSTRIES.map((industry) => {
          const isActive = industry.slug === active;
          return (
            <Link
              key={industry.slug}
              href={`/industry/${industry.slug}`}
              aria-current={isActive ? "page" : undefined}
              onPointerEnter={() => setActive(industry.slug)}
              onMouseEnter={() => setActive(industry.slug)}
              onFocus={() => setActive(industry.slug)}
              data-active={isActive ? "" : undefined}
              className="industry-shelf-item"
            >
              <AnimatedBackdrop
                poster={industry.poster}
                motion={industry.video}
                animate={ready && isActive && !reducedMotion}
              />
              <span className="industry-shelf-scrim" aria-hidden />
              <span className="relative z-10 mt-auto px-5 py-6 sm:px-7 sm:py-8">
                <span className="font-display text-2xl leading-[1.1] tracking-tight text-noah-fog sm:text-3xl">
                  {industry.name}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
      <BookshelfScrollHint />
    </main>
  );
}
