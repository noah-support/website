"use client";

import Link from "next/link";
import { scrollToHash, scrollToTop } from "@/lib/scrollToHash";

const COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "The problem", href: "#problem" },
      { label: "The solution", href: "#solution" },
      { label: "Our way of working", href: "#vision" },
    ],
  },
  {
    title: "Work with us",
    links: [
      { label: "Clients", href: "#clients" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Book a call", href: "/book" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-noah-ink-hairline bg-noah-ink/5 px-6 pb-8 pt-16 sm:px-10 sm:pt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <div className="flex flex-col justify-between gap-12 sm:flex-row">
          <div className="max-w-md">
            <Link
              href="/"
              aria-label="Noah, home"
              onClick={(event) => {
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
                className="h-20 w-auto sm:h-28"
              />
            </Link>
            <p className="mt-6 font-body text-sm leading-relaxed text-noah-ink-dim">
              We interview, we map, we ship. One department at a time.
            </p>
          </div>

          <div className="flex flex-wrap gap-16 sm:gap-24">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
                  {column.title}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={
                          link.href.startsWith("#")
                            ? (event) => {
                                event.preventDefault();
                                scrollToHash(link.href);
                              }
                            : undefined
                        }
                        className="font-body text-sm text-noah-ink transition-colors hover:text-noah-orange"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-noah-ink-hairline pt-8 text-xs text-noah-ink-dim sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Noah. All rights reserved.</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              href="/terms"
              className="transition-colors hover:text-noah-ink"
            >
              Terms &amp; conditions
            </Link>
            <Link
              href="/ai-audit"
              className="transition-colors hover:text-noah-ink"
            >
              AI audit
            </Link>
            <Link
              href="/cookies"
              className="transition-colors hover:text-noah-ink"
            >
              Cookie Policy (EU)
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
