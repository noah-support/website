"use client";

import { ScrollTrigger } from "@/lib/gsap";

/**
 * Menu / footer jumps fire a long smooth scroll. ScrollCue would otherwise
 * treat that as the reader already scrolling and dismiss itself before
 * they land on the empty first frame of a pin.
 */
let programmaticUntil = 0;

export function isProgrammaticScroll() {
  return performance.now() < programmaticUntil;
}

function beginProgrammaticScroll(ms = 1800) {
  programmaticUntil = Math.max(programmaticUntil, performance.now() + ms);
}

/**
 * Jumping straight to a hash anchor (menu click, deep link) can land short
 * inside a pinned section: earlier pinned sections haven't "played" yet,
 * so their spacer heights are still whatever they were computed as at
 * mount, not what they'll be once scrubbed. A refresh recomputes every
 * trigger's start/end against the current DOM before we jump.
 *
 * Known limitation: a pinned section whose own pin was still being set up
 * asynchronously at the moment of the jump (the two interview/mapping
 * canvases pin themselves only once their AVIF finishes decoding) can
 * render blank until the next scroll input, because GSAP's pin transform
 * is recomputed from a live stream of scroll events, not from a single
 * instant jump. It self-corrects on the reader's very next scroll.
 */
/**
 * Logo click: jump to the very first pixel, skipping every pin gate. Smooth
 * scroll through forty thousand pixels of pin spacers never actually
 * arrives; an instant jump plus a refresh does.
 */
export function scrollToTop() {
  beginProgrammaticScroll(2000);
  ScrollTrigger.refresh();
  window.scrollTo({ top: 0, behavior: "auto" });
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    ScrollTrigger.update();
  });
}

/** Hash-only home sections become `/#id` when the reader is on another page. */
export function homeSectionHref(href: string, pathname: string) {
  if (!href.startsWith("#")) return href;
  return pathname === "/" ? href : `/${href}`;
}

export function sectionIdFromHref(href: string) {
  const hashAt = href.indexOf("#");
  if (hashAt === -1) return "";
  return decodeURIComponent(href.slice(hashAt + 1).split(/[?&]/)[0] ?? "");
}

/** The hash in `href` points at a section of the page the reader is already on. */
export function isSamePageSection(href: string, pathname: string) {
  const id = sectionIdFromHref(href);
  if (!id) return false;
  const hashAt = href.indexOf("#");
  const path = hashAt === 0 ? pathname : href.slice(0, hashAt) || "/";
  return path === pathname;
}

export function isHomeSectionHash(hash: string) {
  const id = sectionIdFromHref(hash);
  return Boolean(id) && id !== "top";
}

export function scrollToHash(hash: string) {
  const id = sectionIdFromHref(hash.includes("#") ? hash : `#${hash}`);
  if (!id) return;

  // Pinned sections mount a moment after a client navigation. A smooth
  // scroll through those pin spacers also never arrives, so jump once the
  // target exists and let ScrollTrigger recompute at the landing offset.
  let tries = 0;
  const attempt = () => {
    const target = document.getElementById(id);
    if (!target) {
      if (tries++ < 40) window.setTimeout(attempt, 50);
      return;
    }

    beginProgrammaticScroll(600);
    ScrollTrigger.refresh();
    const header = document.querySelector("header");
    const offset = header?.getBoundingClientRect().height ?? 0;
    const top = Math.max(
      0,
      target.getBoundingClientRect().top + window.scrollY - offset,
    );
    const nextHash = `#${id}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(
        null,
        "",
        `${window.location.pathname}${nextHash}`,
      );
    }
    window.scrollTo({ top, behavior: "auto" });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      ScrollTrigger.update();
    });
  };

  attempt();
}
