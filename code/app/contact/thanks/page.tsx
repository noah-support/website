import Link from "next/link";

export const metadata = {
  title: "Thank you — Noah",
  robots: { index: false, follow: false },
};

export default function ContactThanksPage() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 py-28 text-center">
      <p className="alert-fade-in font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
        Message received
      </p>
      <h1 className="alert-fade-in mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
        Thank you.
      </h1>
      <p className="alert-fade-in mt-5 max-w-md font-body text-noah-ink-dim sm:text-lg">
        We&apos;ll get back to you within one working day.
      </p>
      <Link
        href="/"
        className="glass glass-pill mt-10 flex h-12 items-center px-6 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
      >
        Back to home
      </Link>
    </main>
  );
}
