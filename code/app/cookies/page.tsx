import type { Metadata } from "next";
import CookieDeclaration from "@/components/legal/CookieDeclaration";

export const metadata: Metadata = {
  title: "Cookie Policy (EU) — Noah",
  description:
    "How noah.support uses cookies, and a live scan of the cookies stored in your browser.",
};

export default function CookiesPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32 sm:px-10 sm:pt-40">
      <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
        Legal
      </p>
      <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
        Cookie policy
      </h1>
      <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-noah-ink-dim">
        Last updated on 17 April 2026. This policy applies to citizens and
        legal permanent residents of the European Economic Area and
        Switzerland.
      </p>

      <article className="wp-content mt-12">
        <section id="introduction">
          <h2>1. Introduction</h2>
          <p>
            Our website,{" "}
            <a href="https://noah.support">https://noah.support</a>{" "}
            (“the website”), uses cookies and other related technologies. For
            convenience, all of these technologies are referred to as
            “cookies”. Cookies are also placed by third parties we have
            engaged. This policy explains how they are used.
          </p>
        </section>

        <section id="what-are-cookies">
          <h2>2. What are cookies?</h2>
          <p>
            A cookie is a small, simple file that is sent along with pages of
            this website and stored by your browser on the hard drive of your
            computer or another device. The information stored in it may be
            returned to our servers, or to the servers of the relevant third
            parties, during a later visit.
          </p>
        </section>

        <section id="scripts">
          <h2>3. What are scripts?</h2>
          <p>
            A script is a piece of program code that is used to make our
            website function properly and interactively. This code is executed
            on our server or on your device.
          </p>
        </section>

        <section id="beacons">
          <h2>4. What is a web beacon?</h2>
          <p>
            A web beacon, or a pixel tag, is a small, invisible piece of text
            or image on a website that is used to monitor traffic. In order to
            do this, various data about you is stored using web beacons.
          </p>
        </section>

        <section id="types">
          <h2>5. Cookies</h2>
          <h3>5.1 Technical or functional cookies</h3>
          <p>
            Some cookies make sure parts of the website work and that your
            preferences remain known. By placing functional cookies, we make
            the website easier to use, so you do not need to enter the same
            information on every visit. We may place these cookies without
            your consent.
          </p>
          <h3>5.2 Statistics cookies</h3>
          <p>
            Statistics cookies help us understand how the website is used, so
            we can improve it. Google Analytics does this through the Google
            tag on every page. Those cookies show up in the scan below when
            they are present in your browser.
          </p>
          <h3>5.3 Marketing and tracking cookies</h3>
          <p>
            Marketing and tracking cookies, and any other form of local
            storage used for the same purpose, create a profile of a visitor
            in order to show advertising or to follow that visitor on this
            website or across websites.
          </p>
          <h3>5.4 Embedded services</h3>
          <p>
            Some pages load a service from another company: Google Analytics
            and HubSpot tracking on every page, Google reCAPTCHA on our forms,
            a HubSpot calendar on the booking page, Snitcher to recognise
            visiting companies, and a YouTube video on the trade page. Those
            services can store and
            process information under their own policies. The list in the next
            section is built from the services this website loads, and from
            the cookies actually present in your browser. Read the privacy
            statement of each provider, linked from that list, to see what
            they do with the data.
          </p>
        </section>
      </article>

      <section id="placed-cookies" className="mt-14 scroll-mt-28">
        <h2 className="font-display text-3xl tracking-tight sm:text-[1.85rem]">
          6. Placed cookies
        </h2>
        <p className="mt-4 font-body text-base leading-relaxed text-noah-ink">
          This list is scanned in your browser. Each cookie name is matched
          against the Open Cookie Database, which describes who sets it, why,
          and how long it is kept. Services this website loads are listed even
          when their cookies sit on the provider’s own domain, where this page
          cannot read them. Anything else found in this browser is added
          automatically.
        </p>
        <div className="mt-8">
          <CookieDeclaration />
        </div>
      </section>

      <article className="wp-content mt-14">
        <section id="consent">
          <h2>7. Consent</h2>
          <p>
            Functional cookies that the website needs in order to work can be
            placed without a separate choice. Statistics and marketing cookies
            are placed by the embedded services above, and only on the pages
            that load them. You can refuse those cookies by blocking
            third-party cookies in your browser, or by not using the booking
            calendar and the embedded video.
          </p>
          <p>
            You can also delete cookies that are already stored. The scan in
            section 6 marks which of the listed cookies are in this browser
            right now. Scan again after you delete them and the status
            updates.
          </p>
        </section>

        <section id="browser">
          <h2>8. Enabling, disabling and deleting cookies</h2>
          <p>
            You can use your browser to delete cookies automatically or by
            hand. You can also block certain cookies, or ask the browser to
            tell you each time a cookie is placed. The instructions are in
            your browser’s help section.
          </p>
          <p>
            The website may not work properly if all cookies are disabled. If
            you delete cookies, they can be placed again when you visit a page
            that uses them.
          </p>
        </section>

        <section id="rights">
          <h2>9. Your rights with respect to personal data</h2>
          <p>You have the following rights with respect to your personal data:</p>
          <ul>
            <li>
              You have the right to know why your personal data is needed, what
              will happen to it, and how long it will be retained.
            </li>
            <li>
              Right of access: you have the right to access the personal data
              we hold about you.
            </li>
            <li>
              Right to rectification: you have the right to supplement, correct,
              delete or block your personal data.
            </li>
            <li>
              If you give us consent to process your data, you have the right
              to revoke that consent and to have your personal data deleted.
            </li>
            <li>
              Right to transfer your data: you have the right to request your
              personal data and transfer it to another controller.
            </li>
            <li>
              Right to object: you may object to the processing of your data.
              We comply, unless there are justified grounds for the processing.
            </li>
          </ul>
          <p>
            To exercise these rights, contact us using the details below. If
            you have a complaint about how we handle your data, we want to hear
            from you. You also have the right to lodge a complaint with the
            supervisory authority, the Belgian Data Protection Authority.
          </p>
        </section>

        <section id="contact">
          <h2>10. Contact details</h2>
          <p>
            For questions or comments about this cookie policy, contact:
          </p>
          <p>
            noah. bv
            <br />
            Noorderlaan 139, 2030 Antwerp
            <br />
            Belgium
            <br />
            Website: <a href="https://noah.support">https://noah.support</a>
            <br />
            Email: <a href="mailto:admin@noah.support">admin@noah.support</a>
          </p>
          <p>
            Cookie names and descriptions are matched to the{" "}
            <a href="https://cookiedatabase.org">Open Cookie Database</a>. The
            list itself is scanned in your browser each time you open this
            page.
          </p>
        </section>
      </article>
    </main>
  );
}
