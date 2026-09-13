import BookMeeting from "@/components/BookMeeting";

export const metadata = {
  title: "Book a call — Noah",
  description: "Pick a time to talk with Noah about your department.",
};

export default function BookPage() {
  return (
    <main className="min-h-[100dvh]">
      <section className="mx-auto flex max-w-4xl flex-col px-6 pb-24 pt-32 sm:px-10 lg:pt-36">
        <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
          Book a call
        </p>
        <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
          Pick a time that works.
        </h1>
        <p className="mt-5 max-w-md font-body text-noah-ink-dim sm:text-lg">
          Thirty minutes. We will look at one department and whether Noah
          fits.
        </p>
        <div className="mt-10 w-full">
          <BookMeeting />
        </div>
      </section>
    </main>
  );
}
