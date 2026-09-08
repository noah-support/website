"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

type GlassPaneProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "button" | "nav" | "article";
  tilt?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

/**
 * Chrome-only glass surface (level 1 frosted baseline, see liquid-glass.md).
 * `tilt` adds a subtle pointer-tracked 3D rotation — reserved for standalone
 * panes (option cards, business cases), never for nav chrome.
 */
export default function GlassPane({
  children,
  className = "",
  as = "div",
  tilt = false,
  onClick,
  style,
}: GlassPaneProps) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.setProperty("--tilt-x", `${(-py * 8).toFixed(2)}deg`);
    ref.current.style.setProperty("--tilt-y", `${(px * 10).toFixed(2)}deg`);
    ref.current.style.setProperty("--glow-x", `${(px * 0.5 + 0.5) * 100}%`);
    ref.current.style.setProperty("--glow-y", `${(py * 0.5 + 0.5) * 100}%`);
  }

  function handlePointerLeave() {
    if (!tilt || !ref.current) return;
    ref.current.style.setProperty("--tilt-x", "0deg");
    ref.current.style.setProperty("--tilt-y", "0deg");
  }

  const Comp = as as "div";

  return (
    <Comp
      ref={ref}
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`glass ${tilt ? "glass-tilt" : ""} ${className}`}
      style={style}
    >
      {tilt && <span className="glass-glow" aria-hidden />}
      {children}
    </Comp>
  );
}
