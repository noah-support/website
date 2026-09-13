"use client";

import { useEffect, useRef } from "react";

/**
 * A hairline at the top of the viewport that tracks how far the reader
 * has travelled. The native scrollbar is hidden, so this is the only
 * remaining sense of place on a long pinned page.
 */
export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fillNode = fillRef.current;
    if (!fillNode) return;
    const fill: HTMLDivElement = fillNode;

    function update() {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      fill.style.setProperty("--p", p.toFixed(4));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden>
      <div ref={fillRef} className="scroll-progress-fill" />
    </div>
  );
}
