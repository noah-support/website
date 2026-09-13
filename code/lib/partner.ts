import type { IndustryOutlet } from "@/lib/industries";

export const PARTNER_HERO_DEMO = {
  interviewsStart: 64,
  casesStart: 11,
  interviewsLabel: "Employee interviews this week",
  casesLabel: "Business cases ready to present",
  alerts: [
    "Hospitality engagement — interviews complete, cases generating overnight",
    "Insurer workshop — ranked cases ready to present in the room",
    "Logistics scan — Noah interviewing the floor. You stay with the client.",
  ],
};

export const PARTNER_PROOF: IndustryOutlet[] = [
  { name: "Used by a Big Four consultancy" },
  { name: "20+ enterprise clients" },
  { name: "Forbes", href: "https://www.forbes.com" },
  {
    name: "Belgium Startup Awards",
    href: "https://www.startupawards.be/",
  },
  { name: "Start-it @KBC", href: "https://startit.be" },
  { name: "Tectonic", href: "https://www.tectonicconf.eu/" },
  { name: "9,000+ curated AI use cases" },
];

export const PARTNER_REASONS = [
  {
    rank: "01",
    title: "Practice what you preach.",
    body: "You tell clients AI creates efficiency. Show them you use it yourself. Consultancies that run noah-powered discovery walk into pitches with data, not slides. That alone changes the conversation.",
    footer: "Credibility you can demonstrate",
  },
  {
    rank: "02",
    title: "Move fast or lose the mandate.",
    body: "AI roadmap requests go to whoever delivers answers first. Not the most experienced firm. The fastest one. noah gets you to a prioritised business case in 24 hours. That is the difference between winning and watching.",
    footer: "24 hours from kickoff to business cases",
  },
  {
    rank: "03",
    title: "Be the objective voice in the room.",
    body: "Clients are tired of advisors pushing their own stack. noah is fully independent. No implementation agenda. No preferred vendors. Just data matched to what your client actually needs. You become the advisor with nothing to hide.",
    footer: "Independent. No vendor bias",
  },
];

export const PARTNER_FIT = {
  title: "Built for consultancies that move fast.",
  body: "noah's partner programme is designed for firms already helping companies adopt digital and AI solutions, and who want a sharper, faster way to do discovery.",
  fitTitle: "You are a good fit if...",
  fit: [
    "Your firm has 20 or more consultants",
    "You deliver digital transformation, AI roadmaps, or efficiency programmes",
    "Your clients are mid-size to large enterprises",
    "You want a faster, more objective way to build business cases",
    "You want to differentiate without building new tooling yourself",
  ],
  getTitle: "What you get",
  get: [
    "Full access to noah's platform for your client engagements",
    "White-label options available on request",
    "Revenue share on clients you bring in",
    "Dedicated onboarding and support from our team",
    "Early access to new features and use case database updates",
  ],
};

export const PARTNER_HOW = {
  title: "From kickoff to business cases in days.",
  body: "You stay in front of the client. We power the discovery behind the scenes.",
  steps: [
    {
      rank: "1",
      title: "Define the scope",
      body: "Together we decide which department or challenge to scan first. One short call is all it takes.",
    },
    {
      rank: "2",
      title: "noah interviews employees",
      body: "Noah interviews the client's employees. You stay in front of the client.",
    },
    {
      rank: "3",
      title: "Business cases are generated",
      body: "Prioritised business cases are generated in 24 hours.",
    },
    {
      rank: "4",
      title: "You deliver the strategy",
      body: "You deliver the strategy. We power the discovery behind the scenes.",
    },
  ],
};

export const PARTNER_APPLY = {
  title: "Let's talk.",
  body: "Fill in the form and we will get back to you within one business day.",
  submit: "Apply to partner",
  consultantOptions: ["less than 50", "50 to 150", "151 to 500", "500+"],
};

export type PartnerPayload = {
  firstName: string;
  lastName: string;
  workEmail: string;
  companyName: string;
  consultants: string;
  country: string;
  services: string;
  extra: string;
  recaptchaToken: string;
  website?: string;
};

export type PartnerFieldErrors = Partial<
  Record<
    | "firstName"
    | "lastName"
    | "workEmail"
    | "companyName"
    | "consultants"
    | "country"
    | "services",
    string
  >
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CONSULTANT_OPTIONS = new Set(PARTNER_APPLY.consultantOptions);

function oneLine(value: unknown) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

export function parsePartnerPayload(input: unknown): PartnerPayload {
  const data = (input ?? {}) as Record<string, unknown>;
  return {
    firstName: oneLine(data.firstName),
    lastName: oneLine(data.lastName),
    workEmail: oneLine(data.workEmail).toLowerCase(),
    companyName: oneLine(data.companyName),
    consultants: oneLine(data.consultants),
    country: oneLine(data.country),
    services: String(data.services ?? "").trim(),
    extra: String(data.extra ?? "").trim(),
    recaptchaToken: oneLine(data.recaptchaToken),
    website: oneLine(data.website),
  };
}

export function validatePartnerPayload(
  payload: PartnerPayload
): PartnerFieldErrors {
  const errors: PartnerFieldErrors = {};

  if (payload.firstName.length < 2) errors.firstName = "Enter your first name.";
  if (payload.lastName.length < 2) errors.lastName = "Enter your last name.";
  if (!EMAIL_RE.test(payload.workEmail)) {
    errors.workEmail = "Enter a valid work email.";
  }
  if (payload.companyName.length < 2) {
    errors.companyName = "Enter your company name.";
  }
  if (!CONSULTANT_OPTIONS.has(payload.consultants)) {
    errors.consultants = "Select the number of consultants.";
  }
  if (payload.country.length < 2) errors.country = "Enter your country.";
  if (payload.services.length < 8) {
    errors.services = "Tell us what you mainly help clients with.";
  } else if (payload.services.length > 4000) {
    errors.services = "Keep this under 4,000 characters.";
  }

  return errors;
}
