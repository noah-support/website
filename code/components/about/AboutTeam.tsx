"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { TEAM, TEAM_HEADING, TEAM_SLOGAN, type TeamMember } from "@/lib/about";
import { useReducedMotion } from "@/lib/useReducedMotion";

function LongArrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      viewBox="0 0 88 16"
      className="h-4 w-[5.5rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      aria-hidden
    >
      {dir === "prev" ? (
        <>
          <path d="M86 8H4" strokeLinecap="round" />
          <path
            d="M12 2 2 8l10 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path d="M2 8h82" strokeLinecap="round" />
          <path
            d="M76 2l10 6-10 6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function TeamCard({
  member,
  pos,
  open,
  onToggle,
}: {
  member: TeamMember;
  pos: number;
  open: boolean;
  onToggle: () => void;
}) {
  const front = pos === 0;

  return (
    <article
      className="team-card"
      data-open={open ? "" : undefined}
      data-front={front ? "" : undefined}
      aria-current={front ? "true" : undefined}
      aria-hidden={front ? undefined : true}
      style={{ "--deck-pos": String(pos) } as React.CSSProperties}
    >
      <button
        type="button"
        onClick={onToggle}
        tabIndex={front ? 0 : -1}
        disabled={!front}
        className="relative block aspect-square w-full overflow-hidden bg-noah-cream-soft text-left shadow-[0_18px_40px_rgba(20,23,42,0.14)] outline-none focus-visible:ring-2 focus-visible:ring-noah-orange focus-visible:ring-offset-2 focus-visible:ring-offset-noah-cream active:scale-[0.98] disabled:pointer-events-none"
        aria-expanded={open}
        aria-label={`${open ? "Hide" : "Show"} bio for ${member.name}`}
      >
        <Image
          src={member.image}
          alt={front ? member.alt : ""}
          fill
          sizes="(min-width: 1024px) 40vw, 72vw"
          className="object-cover object-top"
        />
        <span className="team-bio absolute inset-0 flex items-end bg-noah-ink/80 p-5 sm:p-6">
          <span className="font-body text-sm leading-relaxed text-noah-fog sm:text-base">
            {member.bio}
          </span>
        </span>
      </button>
    </article>
  );
}

export default function AboutTeam() {
  const reducedMotion = useReducedMotion();
  const slotRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const count = TEAM.length;

  const measure = useCallback(() => {
    const slot = slotRef.current;
    if (!slot) return;
    setCardWidth(slot.offsetWidth);
  }, []);

  useEffect(() => {
    measure();
    const slot = slotRef.current;
    if (!slot) return;
    const ro = new ResizeObserver(measure);
    ro.observe(slot);
    return () => ro.disconnect();
  }, [measure]);

  function go(dir: -1 | 1) {
    setIndex((current) => (current + dir + count) % count);
    setOpenSlug(null);
  }

  function toggleBio(slug: string) {
    const fineHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    if (fineHover) return;
    setOpenSlug((current) => (current === slug ? null : slug));
  }

  const active = TEAM[index];

  return (
    <section
      className="relative border-y border-noah-ink-hairline px-6 py-16 sm:px-16 lg:px-0 lg:py-0"
      aria-labelledby="about-team-heading"
    >
      {/* One idea: who we are. */}
      <div className="grid gap-10 lg:min-h-[80vh] lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)] lg:grid-rows-[auto_1fr_auto] lg:gap-0">
        <h2
          id="about-team-heading"
          className="font-display text-6xl leading-[0.88] tracking-tighter sm:text-7xl lg:px-16 lg:pt-16 lg:text-8xl xl:text-9xl"
        >
          {TEAM_HEADING.split(" ").map((word, i) => (
            <span
              key={word}
              className={
                i === 0
                  ? "block text-noah-ink"
                  : i === 1
                    ? "block text-noah-orange"
                    : "block text-noah-ink"
              }
            >
              {word}
            </span>
          ))}
        </h2>

        <div className="min-w-0 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:flex lg:flex-col lg:justify-center lg:py-16">
          <div className="team-deck" aria-live="polite">
            <div ref={slotRef} className="team-deck-slot" />
            {TEAM.map((member, i) => {
              const pos = (i - index + count) % count;
              return (
                <TeamCard
                  key={member.slug}
                  member={member}
                  pos={pos}
                  open={openSlug === member.slug}
                  onToggle={() => toggleBio(member.slug)}
                />
              );
            })}
          </div>

          <div
            className="team-caption mt-5"
            style={{ width: cardWidth ? cardWidth : "var(--team-card-w)" }}
          >
            <div
              key={active.slug}
              className={reducedMotion ? undefined : "team-caption-in"}
            >
              <h3 className="font-display text-2xl leading-tight tracking-tight text-noah-ink sm:text-3xl">
                {active.name}
              </h3>
              <p className="team-role glass glass-pill mt-3 inline-flex h-8 items-center px-3.5 font-body text-[11px] uppercase tracking-[0.16em] text-noah-ink">
                {active.role}
              </p>
            </div>
          </div>

          <div
            className="mt-4 flex items-center justify-center gap-8"
            style={{ width: cardWidth ? cardWidth : "var(--team-card-w)" }}
          >
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={`Previous teammate, currently ${active.name}`}
              className="text-noah-ink transition-colors duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-noah-orange active:scale-[0.97]"
            >
              <LongArrow dir="prev" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={`Next teammate, currently ${active.name}`}
              className="text-noah-ink transition-colors duration-160 ease-[cubic-bezier(0.23,1,0.32,1)] hover:text-noah-orange active:scale-[0.97]"
            >
              <LongArrow dir="next" />
            </button>
          </div>
        </div>

        <p className="max-w-[18ch] font-body text-base text-noah-ink-dim sm:text-lg lg:col-start-1 lg:row-start-3 lg:px-16 lg:pb-16">
          {TEAM_SLOGAN}
        </p>
      </div>
    </section>
  );
}
