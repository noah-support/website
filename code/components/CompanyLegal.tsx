import { COMPANY } from "@/lib/company";

export default function CompanyLegal({
  showContact = false,
  className = "mt-5",
}: {
  showContact?: boolean;
  className?: string;
}) {
  return (
    <address
      className={`not-italic font-body text-sm leading-relaxed text-noah-ink-dim ${className}`}
    >
      <p>{COMPANY.address}</p>
      <p>VAT: {COMPANY.number}</p>
      {showContact ? (
        <p className="mt-3">
          <a
            href={COMPANY.phoneHref}
            className="transition-colors hover:text-noah-orange"
          >
            {COMPANY.phone}
          </a>
          {" / "}
          <a
            href={COMPANY.emailHref}
            className="transition-colors hover:text-noah-orange"
          >
            {COMPANY.email}
          </a>
        </p>
      ) : null}
    </address>
  );
}
