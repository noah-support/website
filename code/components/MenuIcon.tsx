type MenuIconProps = {
  open: boolean;
  className?: string;
};

/**
 * Hamburger/close morph built from two identical, symmetric SVG rects
 * (equal thickness, equal length, equal offset from centre) so the crossed
 * state lands exactly on-centre. The previous DOM-span version had the two
 * bars at different vertical offsets before their transforms, so the "X"
 * never quite lined up.
 */
export default function MenuIcon({ open, className = "" }: MenuIconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect
        x="4"
        y="8.2"
        width="16"
        height="1.6"
        rx="0.8"
        className="menu-icon-bar"
        style={{
          transform: open ? "translateY(3px) rotate(45deg)" : "none",
        }}
      />
      <rect
        x="4"
        y="14.2"
        width="16"
        height="1.6"
        rx="0.8"
        className="menu-icon-bar"
        style={{
          transform: open ? "translateY(-3px) rotate(-45deg)" : "none",
        }}
      />
    </svg>
  );
}
