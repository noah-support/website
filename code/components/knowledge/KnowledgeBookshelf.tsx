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
import { KNOWLEDGE_ITEMS } from "@/lib/knowledge";
import { useReducedMotion } from "@/lib/useReducedMotion";

const TITLE = "Knowledge";

function preloadImage(src: string) {
  return new Promise<void>((resolve) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => resolve();
    image.src = src;
  });
}

export default function KnowledgeBookshelf() {
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(KNOWLEDGE_ITEMS[0]?.slug ?? "");
  const titleRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true);
    }, 8000);

    void Promise.all(
      KNOWLEDGE_ITEMS.flatMap((item) => [
        preloadImage(item.poster),
        preloadImage(item.video),
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
    <main className="relative flex min-h-[100dvh] flex-col bg-noah-cream max-xl:h-[100dvh] max-xl:overflow-hidden xl:h-[100dvh] xl:overflow-hidden xl:bg-noah-navy-deep">
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
        className="industry-title relative z-20 shrink-0 bg-noah-cream px-6 pb-4 pt-24 xl:pointer-events-none xl:absolute xl:inset-x-0 xl:top-0 xl:bg-transparent xl:px-12 xl:pt-28"
      >
        <SplitWords
          as="h1"
          text={TITLE}
          className="font-display text-4xl leading-[1.1] tracking-tight text-noah-ink sm:text-5xl xl:text-[9rem] xl:text-noah-fog"
        />
        <p
          data-sub
          className="mt-3 max-w-md font-body text-sm text-noah-ink-dim sm:text-base xl:text-noah-fog-dim"
        >
          Writing from the floor, plus the docs when they are ready.
        </p>
      </div>

      <div className="knowledge-shelf industry-shelf xl:absolute xl:inset-0">
        {KNOWLEDGE_ITEMS.map((item) => {
          const isActive = item.slug === active;
          const inner = (
            <>
              <AnimatedBackdrop
                poster={item.poster}
                motion={item.video}
                animate={ready && isActive && !reducedMotion}
              />
              <span className="industry-shelf-scrim" aria-hidden />
              <span className="relative z-10 mt-auto flex flex-col items-start gap-3 px-5 py-6 sm:px-7 sm:py-8">
                {item.comingSoon ? (
                  <span className="glass glass-pill glass-on-dark px-3 py-1.5 font-body text-[11px] uppercase tracking-[0.16em] text-noah-fog">
                    Coming soon
                  </span>
                ) : null}
                <span className="font-display text-2xl leading-[1.1] tracking-tight text-noah-fog sm:text-3xl xl:text-8xl xl:leading-[1.05]">
                  {item.name}
                </span>
              </span>
            </>
          );
          const shellProps = {
            onPointerEnter: () => setActive(item.slug),
            onMouseEnter: () => setActive(item.slug),
            onFocus: () => setActive(item.slug),
            "data-active": isActive ? "" : undefined,
            "data-soon": item.comingSoon ? "" : undefined,
            className: "industry-shelf-item",
          };

          if (item.comingSoon || !item.href) {
            return (
              <div key={item.slug} {...shellProps}>
                {inner}
              </div>
            );
          }

          return (
            <Link
              key={item.slug}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              {...shellProps}
            >
              {inner}
            </Link>
          );
        })}
      </div>
      <BookshelfScrollHint />
    </main>
  );
}
