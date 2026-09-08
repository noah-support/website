import Link from "next/link";

export const metadata = {
  title: "Book a call — Noah",
};

export default function BookPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
        Scheduling coming soon
      </p>
      <h1 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
        The booking page isn&apos;t live yet.
      </h1>
      <p className="max-w-md font-body text-noah-ink-dim">
        We&apos;re wiring this up to a scheduler. In the meantime, reach out
        directly and we&apos;ll find a time.
      </p>
      <Link
        href="/"
        className="glass glass-pill mt-4 flex h-12 items-center px-6 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
      >
        Back to home
      </Link>
    </main>
  );
}
