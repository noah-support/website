"use client";

import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuIcon from "./MenuIcon";
import {
  isSamePageSection,
  scrollToHash,
  scrollToTop,
} from "@/lib/scrollToHash";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Industries", href: "/industry" },
  { label: "Why Noah", href: "/why-noah" },
  { label: "Knowledge", href: "/knowledge" },
  { label: "Questions", href: "/contact" },
];

function isCurrent(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isShelf(pathname: string) {
  return pathname === "/industry" || pathname === "/knowledge";
}

export function ShelfBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        const sameOrigin =
          document.referrer.startsWith(window.location.origin) &&
          document.referrer !== window.location.href;
        if (sameOrigin) router.back();
        else router.push("/");
      }}
      className="shelf-back glass glass-pill glass-orange pointer-events-auto top-24 right-6 z-30 inline-flex h-11 items-center gap-2 px-4 font-body text-[15px] font-medium text-noah-cream xl:top-28 xl:right-12"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
        <path
          d="M14 6l-6 6 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Back
    </button>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);

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

  useEffect(() => {
    function onScroll() {
      setCompact(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onHomeClick(event: MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    if (window.location.pathname === "/") {
      event.preventDefault();
      scrollToTop();
    }
  }

  if (isShelf(pathname)) return null;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-5 py-4 sm:px-8 sm:py-6">
        <div className="nav-split" data-compact={compact ? "" : undefined}>
          <div className="nav-fill" aria-hidden />
          <div className="nav-piece nav-piece-start glass">
            <Link href="/" aria-label="Noah, home" onClick={onHomeClick}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/noah-logo-mark.svg"
                alt="Noah"
                className="h-4 w-auto sm:h-5"
              />
            </Link>
          </div>

          <div className="nav-spacer" aria-hidden />

          <nav className="nav-links items-center gap-1" inert={compact}>
            {NAV_ITEMS.map((item) => {
              const current = isCurrent(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  onClick={(event) => {
                    if (item.href === "/") {
                      onHomeClick(event);
                      return;
                    }
                    if (!isSamePageSection(item.href, pathname)) return;
                    event.preventDefault();
                    scrollToHash(item.href);
                  }}
                  className={`whitespace-nowrap rounded-full px-2 py-2 font-display text-base tracking-[0.01em] transition-colors xl:px-3 xl:text-base ${
                    current
                      ? "text-noah-orange"
                      : "text-noah-ink hover:text-noah-orange"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="nav-piece nav-piece-end glass">
            <a
              href="https://hub.noah.support/login"
              className={`${
                compact ? "flex" : "hidden sm:flex"
              } relative z-10 h-10 items-center px-3 font-display text-base font-medium text-noah-ink transition-colors hover:text-noah-orange sm:px-4 xl:text-base`}
            >
              Log in
            </a>
            <div
              className={`grid transition-[grid-template-columns,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                compact
                  ? "grid-cols-[0fr] opacity-0"
                  : "grid-cols-[1fr] opacity-100"
              }`}
            >
              <div
                className={`pointer-events-none min-w-0 overflow-hidden ${
                  compact ? "" : "-mx-12 -mt-8 -mb-16 px-12 pb-16 pt-8"
                }`}
              >
                <a
                  href="https://hub.noah.support/sign-up"
                  tabIndex={compact ? -1 : 0}
                  className="glass glass-pill glass-orange pointer-events-auto flex h-10 items-center whitespace-nowrap px-4 font-display text-base font-medium text-noah-cream sm:h-11 sm:px-5 xl:text-base"
                >
                  Try noah now
                </a>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className={`${
                compact ? "flex" : "flex lg:hidden"
              } glass-pill relative h-10 w-10 shrink-0 items-center justify-center text-noah-ink`}
            >
              <MenuIcon open={open} className="h-4 w-4" />
            </button>
          </div>
        </div>
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
                  return;
                }
                if (!isSamePageSection(item.href, window.location.pathname)) {
                  return;
                }
                event.preventDefault();
                window.setTimeout(() => scrollToHash(item.href), 350);
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
