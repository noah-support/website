export type IndustryOutlet = {
  name: string;
  href?: string;
};

export type IndustryCase = {
  rank: string;
  title: string;
  time: string;
  timeLabel: string;
  money: string;
  moneyLabel: string;
  explanation: string;
};

export type Industry = {
  slug: string;
  name: string;
  kind: "template" | "placeholder" | "partner";
  poster: string;
  video: string;
  eyebrow: string;
  title: string;
  body: string;
  moneyStart: number;
  hoursStart: number;
  alerts: string[];
  interviews: { title: string; subtitle: string };
  mapping: {
    title: string;
    subtitle: string;
    steps: { label: string }[];
  };
  casesTitle: string;
  casesBody: string;
  cases: IndustryCase[];
  featuredEyebrow: string;
  featured: IndustryOutlet[];
  cta: {
    eyebrow: string;
    title: string;
  };
};

export const INDUSTRIES: Industry[] = [
  {
    slug: "pharmaceutical",
    name: "Pharmaceutical",
    kind: "template",
    poster: "/industries/pharmaceutical.jpg",
    video: "/industries/pharmaceutical.avif",
    eyebrow: "Pharmaceutical",
    title: "See how a batch actually moves through the site.",
    body: "Noah interviews your departments, from quality assurance to the line operators.",
    moneyStart: 890000,
    hoursStart: 1960,
    alerts: [
      "QA hold flagged on Batch 441, packaging",
      "Handoff delay detected between production and release",
      "Duplicate check found in QC and batch record",
    ],
    interviews: {
      title: "Interviews",
      subtitle:
        "First, it interviews the site bottom-up in 24 hours, from the line to QA, and surfaces the operational insight only the people on the batch actually have.",
    },
    mapping: {
      title: "Mapping",
      subtitle:
        "Then it maps those conversations onto the batch path end to end, and marks exactly where release stalls.",
      steps: [
        { label: "Batch released" },
        { label: "QA hold" },
        { label: "Distribution" },
      ],
    },
    casesTitle: "Business cases, ready to implement.",
    casesBody:
      "Each one ranked, priced, and traced straight back to what the site told us.",
    cases: [
      {
        rank: "01",
        title: "Batch record close",
        time: "-45%",
        timeLabel: "release time",
        money: "€210k",
        moneyLabel: "saved per year",
        explanation:
          "Exceptions route themselves instead of sitting in a shared inbox until someone notices.",
      },
      {
        rank: "02",
        title: "QC sampling",
        time: "-30%",
        timeLabel: "lab cycle time",
        money: "€96k",
        moneyLabel: "saved per year",
        explanation:
          "Sample intake and result write-back sit on one path instead of two paper trails.",
      },
      {
        rank: "03",
        title: "Deviation intake",
        time: "-35%",
        timeLabel: "time to first action",
        money: "€74k",
        moneyLabel: "saved per year",
        explanation:
          "A deviation is typed once and routed, instead of copied into three systems.",
      },
    ],
    featuredEyebrow: "In this space",
    featured: [
      { name: "P95", href: "https://p-95.com/" },
      { name: "UCB", href: "https://www.ucb.com/" },
    ],
    cta: {
      eyebrow: "Ready when you are",
      title: "One site. Twenty-four hours. A cleaner release.",
    },
  },
  {
    slug: "industrials",
    name: "Industrials",
    kind: "template",
    poster: "/industries/manufacturing.jpg",
    video: "/industries/manufacturing.avif",
    eyebrow: "Industrials",
    title: "See the shop floor as it actually runs.",
    body: "Noah interviews the people on the line, maps where work stalls, and prices the fix first.",
    moneyStart: 610000,
    hoursStart: 1840,
    alerts: [
      "Changeover delay flagged on Line 3, second shift",
      "Scrap spike detected in quality hold, packing",
      "Duplicate inspection found between welding and paint",
    ],
    interviews: {
      title: "Interviews",
      subtitle:
        "First, it interviews a whole department bottom-up in 24 hours, surfacing the operational insight only the people doing the work actually have.",
    },
    mapping: {
      title: "Mapping",
      subtitle:
        "Then it maps those conversations onto your processes end to end, and marks exactly where they break down.",
      steps: [
        { label: "Order released" },
        { label: "Changeover" },
        { label: "Quality hold" },
      ],
    },
    casesTitle: "Business cases, ready to implement.",
    casesBody:
      "Each one ranked, priced, and traced straight back to what the line told us.",
    cases: [
      {
        rank: "01",
        title: "Changeovers",
        time: "-50%",
        timeLabel: "setup time",
        money: "€180k",
        moneyLabel: "saved per year",
        explanation:
          "The next job is staged while the current one still runs, instead of waiting for the line to go quiet.",
      },
      {
        rank: "02",
        title: "Invoice reconciliation",
        time: "-65%",
        timeLabel: "processing time",
        money: "€120k",
        moneyLabel: "saved per year",
        explanation:
          "Purchase orders are matched to invoices automatically instead of checked line by line.",
      },
      {
        rank: "03",
        title: "Scrap review",
        time: "-30%",
        timeLabel: "hold time",
        money: "€64k",
        moneyLabel: "saved per year",
        explanation:
          "Quality holds route to the right owner instead of sitting on a shared board.",
      },
    ],
    featuredEyebrow: "In this space",
    featured: [
      { name: "Vekoma", href: "https://www.vekoma.com/" },
      { name: "Sweco", href: "https://www.swecobelgium.be/en/" },
      { name: "ADB Safegate", href: "https://adbsafegate.com/" },
      { name: "Corialis", href: "https://www.corialis-group.com/home/" },
      { name: "DEME", href: "https://www.deme-group.com/" },
    ],
    cta: {
      eyebrow: "Ready when you are",
      title: "One plant. Twenty-four hours. A ranked list.",
    },
  },
  {
    slug: "insurance",
    name: "Insurance",
    kind: "template",
    poster: "/industries/insurance.jpg",
    video: "/industries/insurance.avif",
    eyebrow: "Insurance",
    title: "See how claims actually move through the book.",
    body: "Noah interviews handlers and ops, maps the stalls, and prices the work you should fix first.",
    moneyStart: 495000,
    hoursStart: 1480,
    alerts: [
      "Claims hold flagged in motor, mid-office queue",
      "Handoff delay detected between FNOL and assessors",
      "Duplicate KYC step found in onboarding and policy admin",
    ],
    interviews: {
      title: "Interviews",
      subtitle:
        "First, it interviews a whole department bottom-up in 24 hours, from FNOL to assessors, and surfaces what only the people on the file actually know.",
    },
    mapping: {
      title: "Mapping",
      subtitle:
        "Then it maps those conversations onto the claim path end to end, and marks exactly where the file stalls.",
      steps: [
        { label: "FNOL received" },
        { label: "Assessment" },
        { label: "Settlement" },
      ],
    },
    casesTitle: "Business cases, ready to implement.",
    casesBody:
      "Each one ranked, priced, and traced straight back to what handlers told us.",
    cases: [
      {
        rank: "01",
        title: "FNOL intake",
        time: "-40%",
        timeLabel: "time to first owner",
        money: "€110k",
        moneyLabel: "saved per year",
        explanation:
          "A claim is typed once and routed by intent, instead of copied into three queues.",
      },
      {
        rank: "02",
        title: "Assessment handoff",
        time: "-30%",
        timeLabel: "cycle time",
        money: "€84k",
        moneyLabel: "saved per year",
        explanation:
          "The file moves with the facts already attached, instead of waiting on a chase email.",
      },
      {
        rank: "03",
        title: "Policy onboarding",
        time: "-35%",
        timeLabel: "time to bind",
        money: "€61k",
        moneyLabel: "saved per year",
        explanation:
          "KYC is asked once and reused, instead of asked again in admin.",
      },
    ],
    featuredEyebrow: "In this space",
    featured: [
      { name: "Credendo", href: "https://credendo.com/en" },
      { name: "Concordia", href: "https://concordia.be/en/" },
    ],
    cta: {
      eyebrow: "Ready when you are",
      title: "One department. Twenty-four hours. A cleaner book.",
    },
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    kind: "template",
    poster: "/industries/finance.jpg",
    video: "/industries/finance.avif",
    eyebrow: "Financial Services",
    title: "See how a file actually moves through the firm.",
    body: "Noah interviews the people on the work, maps where a decision stalls, and prices what to fix first.",
    moneyStart: 540000,
    hoursStart: 1620,
    alerts: [
      "Approval hold flagged in credit, mid-office queue",
      "Handoff delay detected between onboarding and KYC",
      "Duplicate check found in compliance and operations",
    ],
    interviews: {
      title: "Interviews",
      subtitle:
        "First, it interviews a whole department bottom-up in 24 hours, from onboarding to credit, and surfaces what only the people on the file actually know.",
    },
    mapping: {
      title: "Mapping",
      subtitle:
        "Then it maps those conversations onto the file path end to end, and marks exactly where the decision stalls.",
      steps: [
        { label: "File opened" },
        { label: "KYC check" },
        { label: "Decision issued" },
      ],
    },
    casesTitle: "Business cases, ready to implement.",
    casesBody:
      "Each one ranked, priced, and traced straight back to what the team told us.",
    cases: [
      {
        rank: "01",
        title: "Credit intake",
        time: "-40%",
        timeLabel: "time to first owner",
        money: "€130k",
        moneyLabel: "saved per year",
        explanation:
          "A file is typed once and routed by intent, instead of copied into three queues.",
      },
      {
        rank: "02",
        title: "KYC reuse",
        time: "-35%",
        timeLabel: "time to decision",
        money: "€88k",
        moneyLabel: "saved per year",
        explanation:
          "The same check is asked once and carried forward, instead of redone in the next team.",
      },
      {
        rank: "03",
        title: "Payment ops",
        time: "-30%",
        timeLabel: "reconciliation time",
        money: "€64k",
        moneyLabel: "saved per year",
        explanation:
          "Breaks route to the owner already named on the file, instead of sitting on a shared list.",
      },
    ],
    featuredEyebrow: "In this space",
    featured: [
      {
        name: "Finance & invest.brussels",
        href: "https://finance.brussels/en/",
      },
      { name: "Noshaq", href: "https://noshaq.be/en/" },
    ],
    cta: {
      eyebrow: "Ready when you are",
      title: "One department. Twenty-four hours. A cleaner file.",
    },
  },
  {
    slug: "other",
    name: "Other industries",
    kind: "template",
    poster: "/industries/other.jpg",
    video: "/industries/other.avif",
    eyebrow: "Other industries",
    title: "See how the work actually moves, wherever it lives.",
    body: "Noah interviews the people doing the work, maps the stalls, and prices what to fix first.",
    moneyStart: 482000,
    hoursStart: 1240,
    alerts: [
      "New bottleneck flagged in Finance approvals queue",
      "Onboarding hand-off delay detected in Support, EU team",
      "Duplicate process found in Procurement and Legal",
    ],
    interviews: {
      title: "Interviews",
      subtitle:
        "First, it interviews a whole department bottom-up in 24 hours, surfacing the operational insight only the people doing the work actually have.",
    },
    mapping: {
      title: "Mapping",
      subtitle:
        "Then it maps those conversations onto your processes end to end, and marks exactly where they break down.",
      steps: [
        { label: "Invoice received" },
        { label: "Manual check" },
        { label: "Payment approved" },
      ],
    },
    casesTitle: "Business cases, ready to implement.",
    casesBody:
      "Each one ranked, priced, and traced straight back to what your team told us.",
    cases: [
      {
        rank: "01",
        title: "Invoice reconciliation",
        time: "-65%",
        timeLabel: "processing time",
        money: "€120k",
        moneyLabel: "saved per year",
        explanation:
          "Purchase orders are matched to invoices automatically instead of checked line by line.",
      },
      {
        rank: "02",
        title: "Customer onboarding",
        time: "-40%",
        timeLabel: "time to first value",
        money: "€85k",
        moneyLabel: "saved per year",
        explanation:
          "Six handoffs across four systems become one guided intake flow.",
      },
      {
        rank: "03",
        title: "Support ticket triage",
        time: "-30%",
        timeLabel: "resolution time",
        money: "€54k",
        moneyLabel: "saved per year",
        explanation:
          "Tickets route themselves by intent instead of waiting on a human dispatcher.",
      },
    ],
    featuredEyebrow: "In this space",
    featured: [
      { name: "Easyfairs", href: "https://www.easyfairs.com/" },
      { name: "Dakgroep Naessens", href: "https://www.dakwerken.com/" },
      { name: "Waterlink", href: "https://water-link.be/" },
      {
        name: "Corsendonk Hotels & Clubs",
        href: "https://corsendonkhotels.com/",
      },
      {
        name: "Delhaize",
        href: "https://www.delhaize.be/about-delhaize/company",
      },
    ],
    cta: {
      eyebrow: "Ready when you are",
      title: "One department. Twenty-four hours. No guesswork.",
    },
  },
  {
    slug: "agencies",
    name: "Agencies",
    kind: "partner",
    poster: "/industries/agencies.jpg",
    video: "/industries/agencies.avif",
    eyebrow: "Partner programme",
    title: "Deliver AI impact faster. For every client.",
    body: "",
    moneyStart: 0,
    hoursStart: 0,
    alerts: [],
    interviews: { title: "", subtitle: "" },
    mapping: { title: "", subtitle: "", steps: [] },
    casesTitle: "",
    casesBody: "",
    cases: [],
    featuredEyebrow: "",
    featured: [],
    cta: { eyebrow: "", title: "" },
  },
];

export function getIndustry(slug: string) {
  return INDUSTRIES.find((industry) => industry.slug === slug);
}
