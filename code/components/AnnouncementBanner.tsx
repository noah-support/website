import Link from "next/link";

export default function AnnouncementBanner({ hidden }: { hidden: boolean }) {
  return (
    <div
      className="announce-wrap"
      data-hidden={hidden ? "" : undefined}
      inert={hidden}
    >
      <div className="announce-shell">
        <span aria-hidden className="announce-ring" />
        <Link
          href="/f/announcement"
          className="announce glass glass-pill glass-orange group inline-flex items-center gap-2.5 py-1.5 pl-1.5 pr-3.5 font-body text-[13px] text-noah-cream sm:pr-4 sm:text-sm"
        >
          <span className="rounded-full bg-noah-cream px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-noah-orange">
            New
          </span>
          <span className="whitespace-nowrap font-medium">
            We raised €800.000
          </span>
          <span
            aria-hidden
            className="hidden h-3.5 w-px bg-noah-cream/40 sm:block"
          />
          <span className="hidden whitespace-nowrap text-noah-cream/85 underline-offset-4 group-hover:underline sm:inline">
            Read the announcement
          </span>
          <svg
            viewBox="0 0 16 16"
            aria-hidden
            className="announce-arrow h-3.5 w-3.5 text-noah-cream"
          >
            <path
              d="M6 3.5L10.5 8 6 12.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
