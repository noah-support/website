"use client";

import { useEffect, useState } from "react";
import HeroKpi from "@/components/HeroKpi";
import HeroAura from "@/components/HeroAura";
import ScrollCue from "@/components/ScrollCue";
import { isHomeSectionHash, scrollToHash } from "@/lib/scrollToHash";

export default function OpeningHero() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let cap = 0;
    const finish = () => {
      if (cancelled) return;
      window.clearTimeout(cap);
      setReady(true);
    };
    cap = window.setTimeout(finish, 1600);
    void (document.fonts?.ready ?? Promise.resolve()).then(finish);
    return () => {
      cancelled = true;
      window.clearTimeout(cap);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const hash = window.location.hash;
    if (!isHomeSectionHash(hash)) return;
    const id = window.setTimeout(() => scrollToHash(hash), 80);
    return () => window.clearTimeout(id);
  }, [ready]);

  return (
    <>
      <div
        className={`industry-loader ${ready ? "industry-loader--done" : ""}`}
        role="status"
        aria-hidden={ready}
        aria-label={ready ? undefined : "Loading"}
      >
        <div className="industry-loader-track" aria-hidden>
          <span className="industry-loader-bar" />
        </div>
        <p className="mt-5 font-body text-[11px] uppercase tracking-[0.2em] text-noah-ink-dim">
          Loading
        </p>
      </div>

      <section
        id="top"
        className="relative flex min-h-[100dvh] w-full flex-col lg:h-[100dvh] lg:items-end lg:overflow-hidden"
      >
        <div className="flex min-h-[100dvh] flex-col lg:absolute lg:inset-0">
          <div className="flex shrink-0 justify-center pt-24 lg:contents">
            <HeroAura speak={ready} />
          </div>

          <div className="relative z-10 flex w-full flex-col px-6 pb-16 pt-6 sm:px-16 sm:pb-20 lg:h-full lg:justify-end lg:pt-0">
            <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl text-left">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-noah-ink-dim">
                  Process intelligence, within 24 hours.
                </p>
                <h1 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight text-noah-ink sm:text-6xl">
                  Noah, right hand of every transformation manager.
                </h1>
                <p className="mt-6 max-w-md font-body text-base text-noah-ink-dim sm:text-lg">
                  Noah interviews your teams to identify problems, suggests
                  solutions, and helps you build the fixes.
                </p>
                <div className="flex space-x-3">
                  <a
                    href="/book"
                    className="glass glass-orange glass-pill mt-10 flex h-12 w-fit items-center px-7 text-sm font-medium transition-colors text-white"
                  >
                    Book a demo
                  </a>
                  <a
                    href="/why-noah"
                    className="glass glass-pill mt-10 flex h-12 w-fit items-center px-7 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
                  >
                    Why Noah?
                  </a>
                </div>
              </div>

              <HeroKpi />
            </div>
          </div>

          <ScrollCue label="Let us explain" />
        </div>
      </section>
    </>
  );
}
