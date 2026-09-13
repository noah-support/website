import CompanyLegal from "@/components/CompanyLegal";
import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact — Noah",
  description: "Questions, product, partnerships, pricing, press, or support.",
};

export default function ContactPage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";

  return (
    <main className="min-h-[100dvh]">
      <section className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 pt-32 sm:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-20 lg:pt-36">
        <div className="lg:sticky lg:top-32">
          <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
            Contact
          </p>
          <h1 className="mt-4 max-w-xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
            Tell us what this is about.
          </h1>
          <p className="mt-5 max-w-md font-body text-noah-ink-dim sm:text-lg">
            We read every message and reply within one working day.
          </p>
          <CompanyLegal showContact className="mt-8" />
        </div>

        <ContactForm recaptchaSiteKey={recaptchaSiteKey} />
      </section>
    </main>
  );
}
