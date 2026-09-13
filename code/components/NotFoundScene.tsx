"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import GlassPane from "@/components/GlassPane";
import SplitWords from "@/components/SplitWords";
import { useReducedMotion } from "@/lib/useReducedMotion";

const DIGITS = [
  { char: "4", rot: "-3.5deg", accent: false },
  { char: "0", rot: "2deg", accent: true },
  { char: "4", rot: "4deg", accent: false },
] as const;

const LINES = [
  { who: "Noah", text: "Has anyone seen this page?" },
  { who: "Ops", text: "Not in our process." },
  { who: "Finance", text: "Never crossed my desk." },
  { who: "Legal", text: "We'll need to map that." },
];

function shortenPath(path: string) {
  if (path.length <= 40) return path;
  return `${path.slice(0, 20)}…${path.slice(-16)}`;
}

function Digit({
  char,
  rot,
  accent,
  reducedMotion,
}: {
  char: string;
  rot: string;
  accent: boolean;
  reducedMotion: boolean;
}) {
  const dragRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const dragging = useRef(false);
  const pos = useRef({ x: 0, y: 0, s: 1 });
  const origin = useRef({ x: 0, y: 0, px: 0, py: 0 });

  function apply() {
    const el = dragRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) scale(${pos.current.s})`;
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    if (event.pointerType !== "mouse") return;
    tweenRef.current?.kill();
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging = "";
    origin.current = {
      x: pos.current.x,
      y: pos.current.y,
      px: event.clientX,
      py: event.clientY,
    };
    pos.current.s = reducedMotion ? 1 : 1.05;
    apply();
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    pos.current.x = origin.current.x + event.clientX - origin.current.px;
    pos.current.y = origin.current.y + event.clientY - origin.current.py;
    apply();
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!dragging.current) return;
    dragging.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    delete event.currentTarget.dataset.dragging;

    if (reducedMotion) {
      pos.current = { x: 0, y: 0, s: 1 };
      apply();
      return;
    }

    const state = pos.current;
    tweenRef.current = gsap.to(state, {
      x: 0,
      y: 0,
      s: 1,
      duration: 0.55,
      ease: "power3.out",
      onUpdate: apply,
    });
  }

  return (
    <div
      className="notfound-float relative"
      style={{ "--rest-rot": rot } as CSSProperties}
    >
      <div
        ref={dragRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="notfound-drag select-none"
      >
        <GlassPane
          tilt={!reducedMotion}
          className="flex h-[7.25rem] w-[6.25rem] items-center justify-center sm:h-[12.5rem] sm:w-[10.5rem]"
        >
          <span
            className={`font-display text-6xl leading-none sm:text-8xl ${
              accent ? "text-noah-orange" : "text-noah-ink"
            }`}
          >
            {char}
          </span>
        </GlassPane>
      </div>
    </div>
  );
}

export default function NotFoundScene() {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname() ?? "/";
  const stageRef = useRef<HTMLElement>(null);
  const [lineIndex, setLineIndex] = useState(0);

  useLayoutEffect(() => {
    if (!stageRef.current) return;
    const words = stageRef.current.querySelectorAll(".split-word");
    const rest = stageRef.current.querySelectorAll("[data-roll]");
    const digits = stageRef.current.querySelectorAll("[data-digit]");
    if (reducedMotion) {
      gsap.set([words, rest, digits], { opacity: 1, y: 0 });
      return;
    }
    gsap.set(words, { opacity: 0, y: 14 });
    gsap.set(rest, { opacity: 0, y: 10 });
    gsap.set(digits, { opacity: 0, y: 18 });
    const tl = gsap.timeline();
    tl.to(digits, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out",
    })
      .to(
        words,
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          stagger: 0.055,
          ease: "power2.out",
        },
        "-=0.35"
      )
      .to(
        rest,
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
        "-=0.15"
      );
    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setLineIndex((i) => (i + 1) % LINES.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const line = LINES[lineIndex] ?? LINES[0];

  return (
    <main
      ref={stageRef}
      className="notfound-scene relative flex min-h-[100dvh] items-center px-6 pb-16 pt-28 sm:px-16 sm:pt-24"
    >
      <div className="flex w-full flex-col-reverse gap-12 sm:flex-row sm:items-end sm:justify-between sm:gap-16">
        <div className="max-w-xl">
          <SplitWords
            as="h1"
            text="This one never made it onto the map."
            className="font-display text-4xl leading-[1.1] tracking-tight text-noah-ink sm:text-6xl"
          />
          <p
            data-roll
            className="mt-6 max-w-md font-body text-base text-noah-ink-dim sm:text-lg"
          >
            We asked around. Nobody in the building claims this URL.
          </p>
          <p
            data-roll
            className="mt-3 font-body text-xs text-noah-ink-faint"
          >
            Looking for {shortenPath(pathname)}
          </p>
          <Link
            data-roll
            href="/"
            className="glass glass-pill mt-10 flex h-12 w-fit items-center px-7 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
          >
            Back to home
          </Link>
        </div>

        <div
          className="flex w-full max-w-md flex-col gap-4 sm:max-w-lg"
          style={{ perspective: "1200px" }}
        >
          <div
            className="flex items-end justify-center gap-3 sm:justify-end sm:gap-4"
            aria-hidden
          >
            {DIGITS.map((digit, index) => (
              <div key={`${digit.char}-${index}`} data-digit className="relative">
                <Digit
                  char={digit.char}
                  rot={digit.rot}
                  accent={digit.accent}
                  reducedMotion={reducedMotion}
                />
              </div>
            ))}
          </div>

          <div data-roll>
            <GlassPane as="div" className="flex items-center gap-3 p-4 sm:p-5">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-noah-orange opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-noah-orange" />
              </span>
              <p
                key={lineIndex}
                className="alert-fade-in font-body text-[13px] leading-snug text-noah-ink"
              >
                <span className="text-noah-orange">{line.who}</span>{`: ${line.text}`}
              </p>
            </GlassPane>
          </div>
        </div>
      </div>
    </main>
  );
}
