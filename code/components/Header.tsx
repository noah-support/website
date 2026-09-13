"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlassPane from "./GlassPane";
import MenuIcon from "./MenuIcon";
import { scrollToTop } from "@/lib/scrollToHash";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Industries", href: "/industry" },
  { label: "About us", href: "/about" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Questions", href: "/contact" },
  { label: "Jobs", href: "/jobs" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
        <GlassPane
          as="div"
          className="flex h-12 items-center px-4 sm:h-14 sm:px-5"
        >
          <Link
            href="/"
            aria-label="Noah, home"
            onClick={(event) => {
              setOpen(false);
              if (window.location.pathname === "/") {
                event.preventDefault();
                scrollToTop();
              }
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/noah-logo-mark.svg"
              alt="Noah"
              className="h-4 w-auto sm:h-5"
            />
          </Link>
        </GlassPane>

        <GlassPane
          as="div"
          className="glass-pill flex h-12 items-center gap-1 p-1 sm:h-14"
        >
          <Link
            href="/login"
            className="glass-pill flex h-full cursor-pointer items-center px-4 text-[13px] font-medium tracking-[0.01em] text-noah-ink transition-colors hover:text-noah-orange sm:px-5 sm:text-sm"
          >
            Log in
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="glass-pill relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center text-noah-ink sm:h-12 sm:w-12"
          >
            <MenuIcon open={open} className="h-4 w-4" />
          </button>
        </GlassPane>
      </header>

      <div
        id="site-menu"
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col bg-noah-cream px-6 pb-6 pt-24 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-16 sm:pb-8 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="flex flex-1 flex-col justify-center gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(event) => {
                setOpen(false);
                if (item.href === "/" && window.location.pathname === "/") {
                  event.preventDefault();
                  window.setTimeout(() => scrollToTop(), 350);
                }
              }}
              tabIndex={open ? 0 : -1}
              className="group flex items-start gap-3 border-b border-noah-ink-hairline py-2 font-display text-[8vw] leading-[1.08] tracking-tight text-noah-ink transition-colors hover:text-noah-orange sm:items-baseline sm:gap-4 sm:py-2.5 sm:text-[4.4vw] sm:leading-[1.05]"
              style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
            >
              <span className="mt-[0.42em] shrink-0 font-body text-xs text-noah-ink-dim sm:mt-0">
                0{index + 1}
              </span>
              <span className="min-w-0 whitespace-normal text-balance">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
