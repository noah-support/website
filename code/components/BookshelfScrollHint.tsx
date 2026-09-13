"use client";

import { useEffect, useState } from "react";

/**
 * Phone/tablet cue that a bookshelf continues below the fold.
 * Hidden on xl, where the shelf is a full-viewport row.
 */
export default function BookshelfScrollHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function update() {
      if (window.matchMedia("(min-width: 1280px)").matches) {
        setShow(false);
        return;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setShow(max > 48 && window.scrollY < max - 40);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed bottom-5 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center xl:hidden ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{ transition: "opacity 280ms var(--ease-out)" }}
    >
      <svg
        viewBox="0 0 24 24"
        className="scroll-cue-chevron h-5 w-5 text-noah-fog drop-shadow-[0_1px_8px_rgba(5,7,15,0.8)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
