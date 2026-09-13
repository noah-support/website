"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";
import HeroKpi from "@/components/HeroKpi";
import HeroAura from "@/components/HeroAura";
import ScrollCue from "@/components/ScrollCue";
import SplitWords from "@/components/SplitWords";
import { isHomeSectionHash, scrollToHash } from "@/lib/scrollToHash";

const OPENING_QUOTE = "“You're either growing or you're dying.”";

export default function OpeningHero() {
  const [revealed, setRevealed] = useState(false);
  const [fromHash, setFromHash] = useState(false);
  const [clip, setClip] = useState<string | null>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const quoteBoxRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // After the quote lifts, wait until the KPIs have been scrolled into
  // view before dissolving. On a tall phone the cards sit below the fold;
  // pinning from the top would fade them as they arrived.
  useLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current || !revealed) return;

    const compact = window.matchMedia("(max-width: 639px)").matches;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: compact ? "bottom bottom" : "top top",
        end: "+=100%",
        scrub: true,
        pin: true,
        pinType: "fixed",
        pinSpacing: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (fadeRef.current) {
            fadeRef.current.style.opacity = String(1 - self.progress);
          }
        },
      });
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reducedMotion, revealed]);

  // The quote types itself in on load — the same word-stagger the later
  // pins use, just clocked to time rather than scroll, so the first thing
  // on the page arrives the same way the rest of the story does.
  useLayoutEffect(() => {
    if (reducedMotion || !quoteBoxRef.current) return;
    const words = quoteBoxRef.current.querySelectorAll(".split-word");
    const cite = quoteBoxRef.current.querySelector("[data-cite]");
    gsap.set(words, { opacity: 0, y: 14 });
    gsap.set(cite, { opacity: 0, y: 10 });
    const tl = gsap.timeline();
    tl.to(words, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: 0.055,
      ease: "power2.out",
    }).to(
      cite,
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.1"
    );
    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const hash = window.location.hash;
    if (!isHomeSectionHash(hash)) return;
    setFromHash(true);
    setRevealed(true);
    const id = window.setTimeout(() => scrollToHash(hash), 320);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (revealed) return;
    function onMove(event: PointerEvent) {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [revealed]);

  useEffect(() => {
    if (revealed) return;

    const html = document.documentElement;
    html.classList.add("noah-gate");
    window.scrollTo(0, 0);

    function onKey(event: KeyboardEvent) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        reveal({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        return;
      }
      if (
        event.key === "ArrowDown" ||
        event.key === "ArrowUp" ||
        event.key === "PageDown" ||
        event.key === "PageUp" ||
        event.key === "Home" ||
        event.key === "End"
      ) {
        event.preventDefault();
      }
    }

    function preventScroll(event: Event) {
      const target = event.target;
      if (target instanceof Node) {
        const menu = document.getElementById("site-menu");
        if (menu?.contains(target)) return;
      }
      event.preventDefault();
    }

    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    return () => {
      html.classList.remove("noah-gate");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  function reveal(origin?: { x: number; y: number }) {
    if (revealed) return;
    if (origin && !reducedMotion) {
      const maxRadius = Math.hypot(window.innerWidth, window.innerHeight);
      setClip(`circle(${maxRadius}px at ${origin.x}px ${origin.y}px)`);
    }
    setRevealed(true);
  }

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    reveal({ x: event.clientX, y: event.clientY });
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      className={`relative flex w-full flex-col ${
        revealed
          ? "min-h-[100dvh] lg:h-[100dvh] lg:items-end lg:overflow-hidden"
          : "h-[100dvh] overflow-hidden"
      }`}
    >
      {/* Hero layer — always mounted, revealed once the quote gate lifts,
          then dissolved by the pin above as the next section takes over. */}
      <div
        ref={fadeRef}
        className="flex min-h-[100dvh] flex-col lg:absolute lg:inset-0"
      >
        <div className="flex shrink-0 justify-center pt-24 lg:contents">
          <HeroAura speak={revealed && !fromHash} />
        </div>

        <div
          className={`relative z-10 flex w-full flex-col px-6 pb-16 pt-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-16 sm:pb-20 lg:h-full lg:justify-end lg:pt-0 ${
            revealed ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl text-left">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-noah-ink-dim">
                Process intelligence, one department at a time
              </p>
              <h1 className="mt-6 font-display text-4xl leading-[1.05] tracking-tight text-noah-ink sm:text-6xl">
                Turn how your teams actually work into how they should.
              </h1>
              <p className="mt-6 max-w-md font-body text-base text-noah-ink-dim sm:text-lg">
                Noah interviews, maps, and prices the fix — before you spend a
                single day on consultants or new hires.
              </p>
              <a
                href="#problem"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToHash("#problem");
                }}
                className="glass glass-pill mt-10 flex h-12 w-fit items-center px-7 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
              >
                See how it works
              </a>
            </div>

            <HeroKpi />
          </div>
        </div>

        {revealed && <ScrollCue label="Let us explain" />}
      </div>

      {/* Quote gate */}
      <div
        ref={openingRef}
        onClick={handleClick}
        aria-hidden={revealed}
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center overscroll-none touch-none transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          revealed
            ? "pointer-events-none opacity-0"
            : `cursor-pointer bg-noah-cream opacity-100 ${
                reducedMotion ? "" : "no-native-cursor"
              }`
        }`}
        style={
          clip && !reducedMotion
            ? {
                clipPath: clip,
                transition:
                  "clip-path 950ms cubic-bezier(0.22,1,0.36,1), opacity 700ms cubic-bezier(0.22,1,0.36,1)",
              }
            : undefined
        }
      >
        <div
          ref={quoteBoxRef}
          className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            revealed ? "-translate-y-24 opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <SplitWords
            as="blockquote"
            text={OPENING_QUOTE}
            className="max-w-3xl font-display text-3xl italic leading-snug text-noah-ink sm:text-5xl"
          />
          <p
            data-cite
            className="mt-6 font-body text-sm uppercase tracking-[0.18em] text-noah-ink-dim"
          >
            — Abraham Maslow
          </p>
          <p
            data-tap
            className="mt-10 inline-flex items-center rounded-full border border-noah-orange px-3.5 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-noah-orange sm:hidden"
          >
            Tap anywhere to start
          </p>
        </div>
      </div>

      {!revealed && !reducedMotion && (
        <div
          ref={cursorRef}
          className="pointer-events-none fixed left-0 top-0 z-30 hidden h-16 w-16 items-center justify-center rounded-full border border-noah-ink/40 sm:flex"
          style={{ transform: "translate3d(-100px, -100px, 0)" }}
          aria-hidden
        >
          <span className="font-body text-[9px] uppercase tracking-[0.14em] text-noah-ink/70">
            start
          </span>
        </div>
      )}
    </section>
  );
}
