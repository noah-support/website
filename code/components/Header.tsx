"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlassPane from "./GlassPane";
import MenuIcon from "./MenuIcon";
import { scrollToTop } from "@/lib/scrollToHash";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Industries", href: "/industries" },
  { label: "About us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Documentation", href: "/documentation" },
];

const MENU_ACTIONS = [
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
  { label: "Questions?", href: "/contact" },
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
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-noah-cream px-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-16 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <nav className="flex flex-col gap-1">
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
              className="group flex items-baseline gap-4 border-b border-noah-ink-hairline py-3 font-display text-[13vw] leading-[0.95] tracking-tight text-noah-ink transition-colors hover:text-noah-orange sm:text-[6vw]"
              style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
            >
              <span className="font-body text-xs text-noah-ink-dim">
                0{index + 1}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {MENU_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="glass glass-pill flex h-12 w-fit items-center px-6 text-sm font-medium tracking-[0.01em] text-noah-ink transition-colors hover:text-noah-orange sm:h-14 sm:px-8"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
