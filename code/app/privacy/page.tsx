import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Privacy policy — Noah",
  description:
    "How noah. bv handles the personal data of people who contact us, request information, book a call or fill in one of our forms.",
};

const LAST_UPDATED = "16 November 2026";

const CONTENTS = [
  ["who", "1. Who we are"],
  ["data", "2. What personal data we collect"],
  ["sources", "3. Where your data comes from"],
  ["purposes", "4. Why we use your data and on what legal basis"],
  ["sharing", "5. Who we share your data with"],
  ["transfers", "6. Transfers outside the EEA"],
  ["retention", "7. How long we keep your data"],
  ["rights", "8. Your rights"],
  ["complaints", "9. Complaints"],
  ["security", "10. How we protect your data"],
  ["changes", "11. Changes to this policy"],
  ["contact", "12. Contact"],
] as const;

const PURPOSES: [ReactNode, ReactNode][] = [
  [
    "Answering your request, following up on a form you submitted, and scheduling and holding the call you booked",
    "Steps taken at your request before a possible contract (art. 6.1.b), or our legitimate interest in answering business enquiries (art. 6.1.f)",
  ],
  [
    "Contacting you about noah’s services after you showed interest, for example after a LinkedIn form, a demo or an event",
    "Our legitimate interest in developing business relationships (art. 6.1.f)",
  ],
  [
    "Contacting you for the first time with a personal LinkedIn message or email about noah, when your role suggests noah may be relevant for your work. We may use an AI tool to write a personal first line based on your public professional information. You can opt out in every message.",
    "Our legitimate interest in business-to-business prospecting (art. 6.1.f)",
  ],
  [
    "Sending you newsletters or marketing emails",
    "Only with your consent (art. 6.1.a). You can unsubscribe in every email.",
  ],
  [
    "Keeping a record of our contacts in our CRM so the right colleague can help you, and so we never contact you twice or after you opted out",
    "Our legitimate interest in organising our sales and customer contacts (art. 6.1.f)",
  ],
  [
    "Measuring which ads, forms and pages work, so we can improve our marketing",
    "Our legitimate interest (art. 6.1.f), and your consent for analytics and marketing cookies (art. 6.1.a)",
  ],
  [
    "Meeting legal obligations, such as accounting and tax rules if you become a customer",
    "Legal obligation (art. 6.1.c)",
  ],
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32 sm:px-10 sm:pt-40">
      <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
        Legal
      </p>
      <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
        Privacy policy
      </h1>
      <p className="mt-5 font-body text-sm text-noah-ink-dim">
        noah. · Last updated on {LAST_UPDATED}
      </p>

      <nav aria-label="Contents" className="mt-10 border-t border-noah-ink-hairline pt-6">
        <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
          Contents
        </p>
        <ol className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {CONTENTS.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="font-body text-sm text-noah-ink transition-colors hover:text-noah-orange"
              >
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="wp-content mt-12">
        <p>
          This policy explains how noah. bv handles the personal data of people
          who contact us, request information, book a call or fill in one of
          our forms, including forms on LinkedIn.
        </p>
        <p>
          This policy does not cover data that our customers process in the
          noah platform. For that data, our customer is the controller and noah
          acts as processor under our{" "}
          <Link href="/terms">General terms and conditions</Link> and the data
          processing agreement. How our website uses cookies is explained in
          our <Link href="/cookies">Cookie policy</Link>.
        </p>

        <Section id="who" title="1. Who we are">
          <p>
            noah. bv (“noah”, “we”, “us”) is responsible for the personal data
            described in this policy. We are the controller under the General
            Data Protection Regulation (GDPR).
          </p>
          <p>
            noah. bv
            <br />
            Noorderlaan 139, 2030 Antwerp, Belgium
            <br />
            VAT/company no. BE 1013.196.672
            <br />
            Email: <a href="mailto:admin@noah.support">admin@noah.support</a>
          </p>
        </Section>

        <Section id="data" title="2. What personal data we collect">
          <p>
            We only collect business contact data and the information you
            choose to give us:
          </p>
          <ul>
            <li>
              <strong>Contact and professional details:</strong> first name,
              last name, work email address, phone number (if you give it),
              company name and job title.
            </li>
            <li>
              <strong>Your request:</strong> the message you send us, the topic
              of your request, and the date and time of a call you book.
            </li>
            <li>
              <strong>Our contact history:</strong> emails, meetings and notes
              of conversations between you and noah.
            </li>
            <li>
              <strong>Campaign information:</strong> which ad, form or page you
              came from (for example a LinkedIn ad or a link with campaign
              parameters).
            </li>
            <li>
              <strong>Website data:</strong> if you allow analytics or
              marketing cookies, data about your visits to noah.support, as
              described in our <Link href="/cookies">Cookie policy</Link>.
            </li>
          </ul>
          <p>
            We do not ask for sensitive data, such as health data, and we ask
            you not to send it to us.
          </p>
        </Section>

        <Section id="sources" title="3. Where your data comes from">
          <ul>
            <li>
              From you, when you fill in a form on noah.support (contact,
              partner or trade form), book a call through our booking page,
              email us, or talk to us at an event.
            </li>
            <li>
              From LinkedIn Lead Gen Forms, when you submit a form in one of
              our LinkedIn ads. LinkedIn then shares the details shown in the
              form with us, such as your name, work email, company and job
              title.
            </li>
            <li>
              From LinkedIn Sales Navigator and email-finding services, when we
              look for people who may be interested in noah. We collect your
              name, job title, company and public LinkedIn profile URL from
              LinkedIn Sales Navigator (through Vayne), and look up your work
              email address through LeadMagic or Prospeo.
            </li>
            <li>
              From our website, if you allow analytics cookies: Snitcher tells
              us which company visited noah.support. This is about companies,
              not individual visitors.
            </li>
            <li>
              From your company, when a colleague introduces you to us or your
              company becomes our customer.
            </li>
            <li>
              From public professional sources, such as your company’s website
              or your public LinkedIn profile, to complete or correct your
              business contact details.
            </li>
          </ul>
        </Section>

        <Section id="purposes" title="4. Why we use your data and on what legal basis">
          <table>
            <thead>
              <tr>
                <th scope="col">Purpose</th>
                <th scope="col">Legal basis (GDPR art. 6)</th>
              </tr>
            </thead>
            <tbody>
              {PURPOSES.map(([purpose, basis], i) => (
                <tr key={i}>
                  <td className="align-top">{purpose}</td>
                  <td className="align-top">{basis}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            Where we rely on our legitimate interest, we have weighed it
            against your rights. You can object at any time (see{" "}
            <a href="#rights">section 8</a>). We do not sell your data, and we
            do not use it for automated decisions that have legal or similarly
            significant effects on you.
          </p>
        </Section>

        <Section id="sharing" title="5. Who we share your data with">
          <p>
            We only share your data with service providers that help us run
            noah, and only as far as they need it. They process your data on
            our instructions under a data processing agreement:
          </p>
          <ul>
            <li>
              <strong>HubSpot</strong> (CRM, email and booking calendar), where
              we store contact details, requests and contact history.
            </li>
            <li>
              <strong>LinkedIn</strong> (advertising, Lead Gen Forms and Sales
              Navigator). LinkedIn’s own use of your data is covered by
              LinkedIn’s privacy policy.
            </li>
            <li>
              <strong>Vayne</strong> (collects public professional details from
              LinkedIn Sales Navigator searches).
            </li>
            <li>
              <strong>LeadMagic</strong> and <strong>Prospeo</strong> (find
              work email addresses).
            </li>
            <li>
              <strong>HeyReach</strong> (sends our LinkedIn messages) and{" "}
              <strong>Instantly</strong> (sends our emails).
            </li>
            <li>
              <strong>n8n</strong> (automation software that connects these
              tools, run on a server we rent from Hostinger).
            </li>
            <li>
              <strong>Anthropic</strong> (the Claude AI model, which writes
              personal first lines for our messages and sorts replies).
            </li>
            <li>
              <strong>Slack</strong> (internal alerts to our team when you
              reply).
            </li>
            <li>
              <strong>Google</strong> (Google Analytics, and reCAPTCHA spam
              protection on our forms).
            </li>
            <li>
              <strong>Snitcher</strong> (identifies which companies visit our
              website, only if you allow analytics cookies).
            </li>
          </ul>
          <p>
            We may also share data with our accountants and legal advisers
            where needed, or with authorities when the law requires it. If noah
            is reorganised, merged or acquired, your data may pass to the new
            owner, who must respect this policy.
          </p>
        </Section>

        <Section id="transfers" title="6. Transfers outside the European Economic Area">
          <p>
            Our CRM, HubSpot, stores our data in its data centre in the United
            States. Several other service providers listed above, such as
            LinkedIn, Google, Anthropic and Slack, are also based in or give
            access from the United States. When your data leaves the European
            Economic Area (EEA), we rely on safeguards that are part of our
            providers’ data processing agreements, such as the EU–US Data
            Privacy Framework and the European Commission’s Standard
            Contractual Clauses. You can ask us for more information about
            these safeguards.
          </p>
        </Section>

        <Section id="retention" title="7. How long we keep your data">
          <ul>
            <li>
              <strong>Leads and prospects:</strong> we keep your contact
              details and contact history for 36 months after our last contact
              with you, unless you become a customer or ask us to delete them
              earlier.
            </li>
            <li>
              <strong>If you opt out:</strong> we keep only your name and email
              address on a do-not-contact list, so we don’t contact you again.
            </li>
            <li>
              <strong>Customers:</strong> we keep contact data for as long as
              the customer relationship lasts, and then as long as needed to
              handle any claims.
            </li>
            <li>
              <strong>Invoices and accounting records:</strong> for the period
              required by Belgian law (currently 10 years).
            </li>
            <li>
              <strong>Marketing emails:</strong> until you unsubscribe or
              withdraw your consent. We keep a record of your unsubscribe so we
              don’t email you again.
            </li>
            <li>
              <strong>Cookies:</strong> as listed in our{" "}
              <Link href="/cookies">Cookie policy</Link>.
            </li>
          </ul>
          <p>After these periods we delete your data or make it anonymous.</p>
        </Section>

        <Section id="rights" title="8. Your rights">
          <p>Under the GDPR you have the right to:</p>
          <ul>
            <li>
              <strong>Access</strong> the personal data we hold about you and
              receive a copy.
            </li>
            <li>
              <strong>Correct</strong> data that is wrong or incomplete.
            </li>
            <li>
              <strong>Delete</strong> your data, unless we must keep it by law.
            </li>
            <li>
              <strong>Restrict</strong> how we use your data in certain cases.
            </li>
            <li>
              <strong>Object</strong> to our use of your data based on
              legitimate interest, and at any time to direct marketing.
            </li>
            <li>
              <strong>Withdraw your consent</strong> at any time, without
              affecting what we did before.
            </li>
            <li>
              <strong>Receive your data</strong> in a structured, commonly used
              format and have it sent to another organisation (data
              portability).
            </li>
          </ul>
          <p>
            To use any of these rights, email{" "}
            <a href="mailto:admin@noah.support">admin@noah.support</a>. We may
            ask you to confirm your identity. We answer within one month.
          </p>
        </Section>

        <Section id="complaints" title="9. Complaints">
          <p>
            If you are unhappy with how we handle your data, please tell us
            first at <a href="mailto:admin@noah.support">admin@noah.support</a>.
            You also have the right to lodge a complaint with the Belgian Data
            Protection Authority (Gegevensbeschermingsautoriteit / Autorité de
            protection des données), Drukpersstraat 35, 1000 Brussels,{" "}
            <a
              href="https://www.dataprotectionauthority.be"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.dataprotectionauthority.be
            </a>
            .
          </p>
        </Section>

        <Section id="security" title="10. How we protect your data">
          <p>
            We use appropriate technical and organisational measures to protect
            your data, such as access limited to the colleagues who need it,
            secure logins and service providers that meet recognised security
            standards.
          </p>
        </Section>

        <Section id="changes" title="11. Changes to this policy">
          <p>
            We may update this policy when our services or the law change. The
            date at the top shows the latest version. If a change is important,
            we will tell you, for example by email or on our website.
          </p>
        </Section>

        <Section id="contact" title="12. Contact">
          <p>
            noah. bv
            <br />
            Noorderlaan 139, 2030 Antwerp, Belgium
            <br />
            Email: <a href="mailto:admin@noah.support">admin@noah.support</a>
            <br />
            Website: <a href="https://noah.support">https://noah.support</a>
          </p>
        </Section>
      </article>
    </main>
  );
}
