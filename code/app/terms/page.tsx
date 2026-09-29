import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Terms & conditions — Noah",
  description:
    "General terms and conditions for the Noah platform and related services. Version 4.2026.",
};

const CONTENTS = [
  ["parties", "Parties and acceptance"],
  ["definitions", "1. Definitions"],
  ["scope", "2. Scope of the agreement"],
  ["ip", "3. Intellectual property and customer data"],
  ["licence", "4. Licence grant"],
  ["accounts", "5. Accounts, users, security"],
  ["prohibited", "6. Prohibited use"],
  ["fees", "7. Fees and invoicing"],
  ["services", "8. Services, support, updates"],
  ["data", "9. Data protection"],
  ["warranties", "10. Warranties and disclaimers"],
  ["indemnity", "11. Indemnification"],
  ["complaints", "12. Complaints and invoice disputes"],
  ["payment", "13. Payment terms"],
  ["term", "14. Duration and termination"],
  ["confidentiality", "15. Confidentiality"],
  ["property", "16. Customer’s property rights"],
  ["notices", "17. Notices"],
  ["law", "18. Applicable law and disputes"],
  ["miscellaneous", "19. Miscellaneous"],
] as const;

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

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-28 pt-32 sm:px-10 sm:pt-40">
      <p className="font-body text-xs uppercase tracking-[0.14em] text-noah-ink-dim">
        Legal
      </p>
      <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
        General terms and conditions
      </h1>
      <p className="mt-5 font-body text-sm text-noah-ink-dim">
        noah. · Version 4.2026
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
        <Section id="parties" title="Parties and acceptance">
          <p>
            Noah BV, with registered office at Noorderlaan 139, 2030 Antwerp,
            Belgium, VAT/company no. BE 1013.196.672 (“Noah”, “we”, “us”,
            “our”) provides an online software platform and related services
            (the “Platform” or “Software”).
          </p>
          <p>
            These general terms and conditions (the “Terms”) govern all access
            to and use of the Software and all related services provided by
            Noah (the “Services”). By ordering, accessing or using the
            Software, the customer (the “Customer”, “you”, “your”) confirms
            acceptance of these Terms.
          </p>
          <p>The Customer’s general terms and conditions are expressly excluded.</p>
        </Section>

        <Section id="definitions" title="1. Definitions">
          <dl>
            <dt>Service</dt>
            <dd>
              A service provided by Noah or an Employee designated by it or a
              subcontractor designated in consultation with the Customer under
              this Agreement.
            </dd>
            <dt>Intellectual Property Rights</dt>
            <dd>
              All intellectual, industrial and other property rights (whether
              registered or unregistered), including but not limited to
              copyrights, neighbouring rights, trademarks, trade names, logos,
              drawings, models or applications for registration as a drawing or
              model, patents, patent applications, domain names, know-how, as
              well as rights to databases, computer programmes and
              semiconductors.
            </dd>
            <dt>Employee</dt>
            <dd>
              The employee, agent or subcontractor of Noah whom Noah calls upon
              to provide the Services.
            </dd>
            <dt>Agreement</dt>
            <dd>
              Noah’s quotation and the Customer’s order, together with these
              General Terms and Conditions and its appendices.
            </dd>
            <dt>Privacy legislation</dt>
            <dd>
              Regulation (EU) 2016/679 of the European Parliament and of the
              Council of 27 April 2016 on the protection of natural persons
              with regard to the processing of personal data and on the free
              movement of such data, and repealing Directive 95/46/EC (General
              Data Protection Regulation), as well as all related European and
              national rules on the protection of personal data.
            </dd>
            <dt>Software</dt>
            <dd>
              The Noah platform developed by Noah, possibly supplemented with
              additional options.
            </dd>
            <dt>Account</dt>
            <dd>
              The Customer’s administrative account enabling access to the
              Software.
            </dd>
            <dt>Permitted Users / Users</dt>
            <dd>
              Employees or contractors of the Customer authorised to access the
              Software.
            </dd>
            <dt>Customer Data</dt>
            <dd>
              All data, content, files and information uploaded to or processed
              via the Software by the Customer or Users.
            </dd>
            <dt>DPA</dt>
            <dd>
              The data processing agreement governing processing under GDPR.
            </dd>
          </dl>
        </Section>

        <Section id="scope" title="2. Scope of the agreement">
          <p>
            The agreement consists of Noah’s quotation or order confirmation,
            these Terms and any annexes (the “Agreement”).
          </p>
        </Section>

        <Section id="ip" title="3. Intellectual property and Customer Data">
          <p>
            All intellectual property rights in the Software, Services,
            documentation, updates, upgrades and improvements remain exclusively
            with Noah and/or its licensors. The Software is licensed, not sold.
          </p>
          <p>
            The Customer retains ownership of Customer Data. The Customer grants
            Noah a limited, non-exclusive right to host, process and use
            Customer Data solely to perform the Agreement and for purposes
            reasonably related thereto (including support and security).
          </p>
          <p>
            Analytics (anonymised or aggregated): Noah may generate and use
            anonymised and/or aggregated usage statistics and technical logs for
            platform security, quality improvement and product development,
            provided they do not identify the Customer or any individual.
          </p>
          <p>
            Feedback: any suggestions or feedback may be used by Noah without
            restriction and without obligation to compensate, provided it does
            not disclose Customer confidential information.
          </p>
        </Section>

        <Section id="licence" title="4. Licence grant">
          <p>
            Subject to payment of all due fees, Noah grants the Customer a
            limited, non-exclusive, non-transferable and non-sublicensable
            licence to access and use the Software for its internal business
            purposes during the Term, for the number of Interviews, Projects
            and Users ordered.
          </p>
          <p>
            The Customer may not provide the Software to third parties, make it
            available to third parties, or use it for the benefit of third
            parties without Noah’s prior written consent.
          </p>
        </Section>

        <Section id="accounts" title="5. Accounts, users, security">
          <p>
            The Customer is responsible for all activity under its Account and
            for compliance by its Users.
          </p>
          <p>
            The Customer must ensure Users keep credentials confidential and
            implement reasonable security, including strong passwords.
          </p>
        </Section>

        <Section id="prohibited" title="6. Prohibited use">
          <p>Except as expressly permitted, the Customer and Users may not:</p>
          <ol type="a">
            <li>
              copy, modify, translate, create derivative works, reverse
              engineer, decompile or attempt to discover source code or
              algorithms;
            </li>
            <li>disclose benchmarking or performance results to third parties;</li>
            <li>circumvent access controls, usage limits or security features;</li>
            <li>
              use bots, scrapers or automated systems without written consent;
            </li>
            <li>upload malware or unlawful content;</li>
            <li>
              use the Software unlawfully or in a manner that infringes
              third-party rights.
            </li>
          </ol>
          <p>Any breach of this clause constitutes a material breach.</p>
        </Section>

        <Section id="fees" title="7. Fees and invoicing">
          <p>Fees consist of:</p>
          <ol type="i">
            <li>an annual platform fee, and/or</li>
            <li>
              credits and/or additional services, as specified in the quotation
              or price list, or
            </li>
            <li>a one-time fee as a trial.</li>
          </ol>
          <p>
            Invoicing: the annual fee is invoiced in advance per contract year.
            Credits, services or a one-time trial receive a dedicated offer on
            the invoice.
          </p>
          <p>
            Prices exclude VAT and taxes unless stated otherwise. The Customer
            bears applicable taxes.
          </p>
          <p>
            Payments are due within 30 days of the invoice date. Late-payment
            interest and fixed compensation are set out in clause 13, subject
            to mandatory law.
          </p>
          <p>
            Suspension for non-payment: Noah may suspend access if undisputed
            amounts remain unpaid after notice and a reasonable cure period,
            without prejudice to other remedies.
          </p>
        </Section>

        <Section id="services" title="8. Services, support, updates">
          <p>
            Noah may modify, update and improve the Software from time to time.
            Noah will use reasonable efforts to maintain availability, but does
            not guarantee uninterrupted or error-free operation.
          </p>
          <p>
            The Customer may call on Noah to perform certain Services, including
            support and training. If an ordered service entails an additional
            fee, the Service will, unless otherwise agreed in writing, be
            provided on a cost-plus or subscription basis at the rate applicable
            at that time.
          </p>
          <p>
            The Customer may call on Noah’s helpdesk. The Customer shall provide
            Noah with all useful and necessary information to resolve the
            problem, and shall grant Noah access to their computer and/or their
            company if this is necessary to analyse or resolve a problem or
            incident arising from the Customer’s use of the Software. The
            helpdesk is available by telephone every working day between 8.30
            a.m. and 5.30 p.m. (except public holidays) on{" "}
            <a href="tel:+32473624394">+32 473 62 43 94</a>. The helpdesk can
            also be contacted by email at{" "}
            <a href="mailto:admin@noah.support">admin@noah.support</a>.
          </p>
          <p>
            The Customer shall not enter into any agreements with other ICT
            suppliers regarding support for the Software without Noah’s prior
            written approval. If, even after that consent, the Customer engages
            another ICT supplier, Noah shall not accept any liability with
            regard to (i) the work of this supplier, (ii) the integration of its
            work into the Software, and (iii) the continued proper functioning
            of the Software.
          </p>
          <p>
            At the Customer’s request, Noah may also develop upgrades to the
            Software. Noah will provide a price estimate in advance. Noah is
            not obliged to comply with the request.
          </p>
          <p>
            If the Customer has commissioned Noah to provide other services that
            require access to the Customer’s Software environment, Noah shall
            have administrator access to that environment at all times. No
            additional costs will be charged for this licence. Noah will not
            grant access to this environment to anyone other than its
            Employees, unless mutually agreed with the Customer. Noah will not
            abuse the trust placed in it. The Customer expressly grants Noah
            access to the information in its Noah environment for the purpose of
            performing the Services requested by the Customer.
          </p>
        </Section>

        <Section id="data" title="9. Data protection">
          <p>
            The Customer is controller. Noah is processor for personal data
            processed on the Customer’s behalf.
          </p>
          <p>
            Processing is governed by the applicable DPA, which forms an
            integral part of the Agreement.
          </p>
          <p>
            The Customer warrants it has a lawful basis to provide personal data
            to Noah and will not provide special categories of data or
            children’s data unless expressly agreed in writing and addressed in
            the DPA.
          </p>
          <p>
            Noah implements appropriate technical and organisational measures
            and ensures authorised personnel are bound by confidentiality.
          </p>
          <p>
            AI training and product improvement: Noah may not use Customer Data
            for product optimisation, including improving algorithms. Customer
            Data will not be used to train, fine-tune, or otherwise improve any
            third-party AI model or service, nor will such data be made
            accessible or visible to any other customer or external party.
            Noah may share Customer Data with third-party AI models, strictly
            limited to the extent necessary for processing by the models that
            power the service (for example OpenAI or Anthropic), provided that:
          </p>
          <ul>
            <li>
              Noah ensures such third parties are contractually bound by
              equivalent confidentiality and data-usage restrictions, including
              a prohibition on using Customer Data for training, fine-tuning, or
              otherwise improving their models;
            </li>
            <li>
              such third parties are in particular not permitted to make
              Customer Data accessible or visible to any other external party;
              and
            </li>
            <li>
              Noah ensures that any third-party AI model processing Customer
              Data complies with applicable data protection laws, including the
              GDPR, through appropriate contractual arrangements (such as data
              processing agreements) and technical and organisational measures.
            </li>
          </ul>
          <p>
            Noah undertakes to make every reasonable effort to deliver the
            ordered Software and Services in accordance with best practice, with
            the care and expertise that the Customer may expect from a
            professional supplier, and to keep the Software available to the
            maximum extent possible.
          </p>
          <p>
            Noah shall make every reasonable effort to prevent the Software from
            containing bugs, computer viruses and/or malware that could disrupt
            its operation. Noah cannot be held liable for such problems that,
            despite its efforts, may still be present in the Software delivered.
          </p>
          <p>
            Noah shall in no event be liable for any consequential damages such
            as loss of expected profits, decrease in turnover, increased
            operating costs, or loss of clientele, which the Customer or third
            parties may suffer as a result of any error or negligence on the
            part of Noah or an Employee.
          </p>
          <p>
            Noah shall not be liable for errors in the performance of the
            Agreement due to insufficient or incorrect input by the Customer.
          </p>
          <p>
            Noah accepts no liability whatsoever for any damage that the
            Customer may suffer as a result of unauthorised third parties
            gaining access to the Software due to inadequate security measures
            taken by the Customer, or other errors or negligence on the part of
            the Customer.
          </p>
          <p>
            If Noah is nevertheless liable, Noah’s total liability, however
            serious the error, whatever the cause, form or subject matter of the
            claim, shall never exceed the price paid by the Customer to Noah
            for the Service that gave rise to the damage during the 12 months
            preceding the damage, provided that this liability cap shall not
            fall below EUR 50,000.00 per claim.
          </p>
        </Section>

        <Section id="warranties" title="10. Warranties and disclaimers">
          <p>
            Except as expressly stated, the Software and Services are provided
            “as is” and “as available”, and Noah disclaims all warranties to
            the maximum extent permitted by law, including merchantability,
            fitness for purpose and non-infringement.
          </p>
          <p>
            The Customer remains responsible for decisions made based on outputs
            produced by the Software, particularly where those outputs are
            AI-assisted.
          </p>
        </Section>

        <Section id="indemnity" title="11. Indemnification">
          <p>
            The Customer shall defend, indemnify and hold harmless Noah against
            third-party claims arising from (i) Customer Data, (ii) unlawful use
            of the Software, (iii) breach of data protection obligations, or
            (iv) breach of these Terms.
          </p>
          <p>
            Noah shall defend, indemnify and hold harmless the Customer against
            third-party claims arising from (i) breach of data protection
            obligations, or (ii) breach of these Terms.
          </p>
        </Section>

        <Section id="complaints" title="12. Complaints and disputes regarding invoices">
          <p>
            Complaints regarding the Software and/or Services must be reported
            to Noah no later than 30 calendar days after delivery or provision.
            In the event of a timely protest, the Customer is obliged to
            cooperate fully with Noah’s investigation. If the complaint is
            correct, timely and justified, Noah has the right to remedy it at
            its own discretion.
          </p>
          <p>The following shall not be considered errors attributable to Noah:</p>
          <ul>
            <li>
              errors that occur as a result of changes made by the Customer or
              by third parties to the Software without Noah’s permission;
            </li>
            <li>
              errors caused by incorrect, improper or unauthorised use, as well
              as any damage caused by hardware or system failure, failure of
              interconnected hardware or other system components, or shortcomings
              in the Software that do not impede its use;
            </li>
            <li>
              errors in third-party software for which Noah or the Customer has
              a licence, which are the responsibility of the third-party
              licensor, to the extent (if Noah has the licence) Noah has
              indicated the third-party licensor to the Customer before the
              Agreement entered into force. The third-party tools are
              Northflank, ElevenLabs, Anthropic and OpenAI.
            </li>
          </ul>
          <p>
            Any objection to invoices must be reported to Noah within 14 days of
            the invoice date. In the absence of a timely protest, delivery of
            the Software or Services shall be deemed definitively accepted and
            the invoices shall be due and payable. Any objection must be
            substantiated, otherwise the right to defer payment of the invoices
            will lapse.
          </p>
        </Section>

        <Section id="payment" title="13. Payment terms">
          <p>
            The fee payable by the Customer may consist of a fixed annual
            platform fee and/or a variable fee based on credits purchased,
            services and actual costs incurred and/or a one-time fee considered
            as a pilot, as specified in the applicable price list or quotation.
          </p>
          <p>
            The fixed annual platform fee is invoiced at the start of each
            contract year. Unless otherwise agreed, the one-time fee for
            credits, a pilot and other services is invoiced ad hoc.
          </p>
          <p>
            All prices quoted by Noah are in euro and exclude VAT and costs,
            unless otherwise stated.
          </p>
          <p>
            Invoices must be paid within 30 days of the invoice date by bank
            transfer to the account number indicated on the invoice. Each
            payment is applied to the oldest overdue invoice and first to the
            interest and costs due. Any discounts granted lapse if the payment
            terms are not respected.
          </p>
          <p>
            In the event of late payment, Noah shall first send a payment
            reminder granting fourteen (14) days to settle the outstanding
            invoice. If payment is not received within this period, the
            Customer shall automatically and without further notice be liable
            for default interest of 6% per annum, with a minimum of EUR 125,
            without prejudice to Noah’s right to claim higher damages if
            applicable. The Customer shall also be liable for any reasonable
            collection, reminder and legal costs incurred in recovering the
            outstanding amounts. Any delay in payment renders all outstanding
            invoices and sums due immediately payable.
          </p>
          <p>
            If the Customer wishes to dispute an invoice, the dispute must be
            notified to Noah by registered letter within fourteen (14) days from
            the invoice date and must clearly state the reasons. In the absence
            of such notification, the invoice will be deemed accepted.
          </p>
          <p>
            In the event of a timely dispute, the payment obligation for the
            disputed portion is temporarily suspended, and both parties shall
            endeavour in good faith to reach a resolution within thirty (30)
            days from the dispute notification. Should the parties fail to reach
            a resolution within this period, Noah may issue a notice of
            default. The Customer will not withhold payment for any undisputed
            items included in the invoice.
          </p>
        </Section>

        <Section id="term" title="14. Duration of the Agreement and termination">
          <p>
            The term is 12 months unless stated otherwise. For pilots, the term
            is limited to the duration of the pilot. The term starts on
            signature or when access is granted, whichever occurs first.
          </p>
          <p>
            Renewal: the Agreement renews automatically for successive 12-month
            periods unless either party gives written notice at least 60 days
            before the end of the then-current term. No automatic renewal
            applies to pilots, including when a pilot is completed.
          </p>
          <p>
            Termination for cause: either party may terminate for a material
            breach not cured within a reasonable period after written notice,
            and may terminate immediately for insolvency or bankruptcy where
            permitted.
          </p>
          <p>
            Effect of termination: licences end, the Customer must stop using
            the Software, and the confidentiality, intellectual-property and
            liability provisions survive.
          </p>
          <p>
            Customer Data on termination: upon termination or expiry, Noah will,
            on the Customer’s written request made within 30 days after
            termination, make Customer Data available for export in a reasonably
            standard format. After that 30-day period, Noah will delete or
            irreversibly anonymise Customer Data within a reasonable time,
            unless retention is required by law or necessary for the
            establishment, exercise or defence of legal claims. Backups may be
            retained for a limited period in accordance with Noah’s backup
            policies and will not be used for any other purpose.
          </p>
          <p>The suspension right in clause 7 remains available.</p>
        </Section>

        <Section id="confidentiality" title="15. Confidentiality">
          <p>
            Each party undertakes to keep confidential, both during the term of
            the Agreement and thereafter, any confidential information of a
            commercial, technical, operational or financial nature relating to
            the other party or third parties that it learns during the term of
            this Agreement.
          </p>
          <p>
            Confidential information includes information designated as such by
            the other party, or which the other party can reasonably assume to
            be confidential. The parties shall impose the same confidentiality
            obligation on their employees and staff and on any third parties
            (such as suppliers) engaged to perform the Agreement and activities
            reasonably related thereto.
          </p>
        </Section>

        <Section id="property" title="16. Customer’s property rights">
          <p>
            All documents, data, files and information uploaded by the Customer
            to the Software and Services remain the property of the Customer at
            all times. Noah does not claim any ownership rights to these
            materials. The Customer retains full ownership and control over the
            uploaded information.
          </p>
        </Section>

        <Section id="notices" title="17. Notices">
          <p>
            All notices under this Agreement, including termination and
            non-renewal notices, must be in writing and will be deemed validly
            served if:
          </p>
          <ol type="a">
            <li>
              sent by email to the addresses set out below, with a delivery or
              read receipt or other evidence of sending; or
            </li>
            <li>sent by registered mail to the registered office address.</li>
          </ol>
          <p>
            Notices are deemed received (i) on the business day of sending if
            sent by email before 17:00 CET, otherwise the next business day, or
            (ii) on the first business day following delivery confirmation for
            registered mail.
          </p>
          <p>
            Notices to Noah:{" "}
            <a href="mailto:admin@noah.support">admin@noah.support</a>, or such
            other email as Noah may notify. Notices to the Customer: the email
            and address stated in the order or quotation, or as updated by the
            Customer by written notice.
          </p>
        </Section>

        <Section id="law" title="18. Applicable law and disputes">
          <p>
            The validity, interpretation and execution of this Agreement shall
            be governed by Belgian law. Any dispute relating to the conclusion,
            validity, execution and/or termination of this Agreement shall be
            settled by the competent court in Antwerp.
          </p>
          <p>
            Before resorting to the courts, the parties shall negotiate in good
            faith to settle their dispute amicably.
          </p>
        </Section>

        <Section id="miscellaneous" title="19. Miscellaneous">
          <p>
            For the term and 12 months thereafter, the Customer shall not (i)
            solicit to hire Noah employees involved in the Services, and (ii)
            use Noah confidential information to build a substantially similar
            competing product.
          </p>
          <p>
            Noah may assign the Agreement in a reorganisation, merger or
            acquisition, with notice to the Customer. The Customer may assign
            in a reorganisation, merger or acquisition, with notice to Noah.
          </p>
          <p>
            Following the successful completion of the pilot phase, Noah may use
            the Customer’s name and logo as a reference in its commercial and
            marketing materials, including presentations and this website. Such
            use is limited to a factual representation of the collaboration and
            will not disclose confidential information.
          </p>
          <p>
            This Agreement, including its annexes, constitutes the entire
            agreement between the parties concerning its subject matter. It
            supersedes and cancels any prior written or oral agreement, offer,
            correspondence or proposal concerning the use of the Software and/or
            the Services. Any amendment is binding only if made in writing and
            duly signed by both parties.
          </p>
          <p>
            If any provision of this Agreement, or the performance thereof,
            proves to be invalid or unenforceable, the remaining provisions
            remain in full force. The parties shall then draw up a new provision
            that achieves the objectives of the invalid or unenforceable
            provision, within the limits of applicable law, and include it in an
            appendix.
          </p>
          <p>
            The Customer may only transfer its rights or obligations under this
            Agreement to a third party with Noah’s prior written consent.
          </p>
          <p>
            Each party shall bear its own costs in connection with the
            conclusion and performance of this Agreement.
          </p>
          <p>
            A party shall not be held liable for any failure to fulfil its
            obligations if the failure is caused by circumstances beyond its
            reasonable control, such as fire, flood, strikes, labour unrest or
            other disruptions in economic life, accidents, embargoes, cyber
            incidents or major cloud outages, blockades, legal restrictions,
            riots, government measures, unavailability of means of
            communication, terrorist attacks, or war. Performance is then
            suspended until the force majeure ceases. If it lasts for more than
            3 months, both parties may terminate the Agreement immediately
            without the other party being entitled to compensation.
          </p>
          <p>
            Noah may amend these Terms from time to time. Changes shall be
            notified to the Customer at least thirty (30) days before they take
            effect. Continued use of the Software after the effective date
            constitutes acceptance of the updated Terms.
          </p>
          <p>
            Noah will use reasonable efforts to ensure that the Software is
            available with a minimum uptime of 95%, measured monthly, excluding
            scheduled maintenance and circumstances beyond Noah’s reasonable
            control. If the Software is unavailable beyond this commitment, the
            duration of the Agreement shall be extended by one (1) day for each
            full day of unavailability.
          </p>
        </Section>

        <p>
          noah. BV —{" "}
          <a href="https://www.noah.support">www.noah.support</a> — VAT BE
          1013.196.672 — Account no. BE88 7380 4410 7841
        </p>
      </article>
    </main>
  );
}
