import Link from "next/link";

export default function KnowledgePlaceholder({
  name,
  body,
  backHref,
  backLabel,
}: {
  name: string;
  body: string;
  backHref: string;
  backLabel: string;
}) {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
        {name}
      </p>
      <h1 className="max-w-2xl font-display text-4xl leading-tight sm:text-5xl">
        This page isn&apos;t live yet.
      </h1>
      <p className="max-w-md font-body text-noah-ink-dim">{body}</p>
      <Link
        href={backHref}
        className="glass glass-pill mt-4 flex h-12 items-center px-6 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
      >
        {backLabel}
      </Link>
    </main>
  );
}
