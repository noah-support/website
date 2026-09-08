import Link from "next/link";

export const metadata = {
  title: "Industries — Noah",
};

export default function IndustriesPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
        Industries
      </p>
      <h1 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
        The industries page isn&apos;t live yet.
      </h1>
      <Link
        href="/"
        className="glass glass-pill mt-4 flex h-12 items-center px-6 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
      >
        Back to home
      </Link>
    </main>
  );
}
