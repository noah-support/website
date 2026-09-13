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

export function isHomeSectionHash(hash: string) {
  const id = hash.replace("#", "");
  return Boolean(id) && id !== "top";
}

export function scrollToHash(hash: string) {
  const id = hash.replace("#", "");
  const target = document.getElementById(id);
  if (!target) return;

  beginProgrammaticScroll();
  ScrollTrigger.refresh();
  requestAnimationFrame(() => {
    const top = target.getBoundingClientRect().top + window.scrollY;

    // refresh() only positions pins correctly for the scroll offset that's
    // current when it runs — call it again once we've actually arrived,
    // so whichever trigger we land inside gets evaluated at the right spot
    // instead of wherever the page happened to be when we kicked this off.
    function onArrive() {
      window.removeEventListener("scrollend", onArrive);
      ScrollTrigger.refresh();
      ScrollTrigger.update();
    }
    window.addEventListener("scrollend", onArrive);
    window.setTimeout(onArrive, 1500);

    window.scrollTo({ top, behavior: "smooth" });
  });
}
