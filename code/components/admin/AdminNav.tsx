"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/adminActions";

const LINKS = [
  { href: "/admin", label: "Analytics" },
  { href: "/admin/flows", label: "Flows" },
  { href: "/admin/submissions", label: "Submissions" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-noah-ink-hairline bg-noah-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
        <Link href="/admin" className="font-display text-xl tracking-tight text-noah-ink">
          Noah
        </Link>
        <nav className="flex flex-1 items-center gap-4 text-sm">
          {LINKS.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? "text-noah-ink" : "text-noah-ink-dim hover:text-noah-ink"}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <form action={logout}>
          <button type="submit" className="text-sm text-noah-ink-dim hover:text-noah-ink">
            Log out
          </button>
        </form>
      </div>
    </header>
  );
}
