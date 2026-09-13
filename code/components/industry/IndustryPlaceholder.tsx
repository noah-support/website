import Link from "next/link";

export default function IndustryPlaceholder({ name }: { name: string }) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
        {name}
      </p>
      <h1 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
        This page isn&apos;t live yet.
      </h1>
      <p className="max-w-md font-body text-noah-ink-dim">
        We&apos;re still shaping how Noah shows up for agencies. The rest of
        the industries are ready to walk through.
      </p>
      <Link
        href="/industry"
        className="glass glass-pill mt-4 flex h-12 items-center px-6 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
      >
        Back to industries
      </Link>
    </main>
  );
}
