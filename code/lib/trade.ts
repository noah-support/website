export const TRADE_META = {
  title: "Slide Deck Graveyard — Noah",
  description:
    "Your AI strategy deck cost €50k and never left the drive. Trade it for a live pilot inside your own organisation — and see what the deck missed.",
};

export const TRADE_HERO = {
  eyebrow: "Slide Deck Graveyard",
  title: "Bring Out Your Dead",
  lede: "Your AI strategy deck cost €50k and never left the drive. The workshop ended. The slides got filed. Nothing changed. So we built somewhere to bury it properly.",
  body: "The Graveyard trades your shelved strategy for a live pilot inside your own organisation. It listens to your people. It maps what's really happening. It shows you what the deck missed.",
  offerValue: "€15.000",
  offerLabel: "Free pilot",
  offerBody:
    "Upload the unused workshop deck you paid too much for. Get a free pilot normally worth €15.000.",
  primary: "Bury your deck",
  secondary: "See what you get",
};

export const TRADE_COMPARE = {
  eyebrow: "The verdict",
  title: "One of these actually moves.",
  body: "A deck tells you what AI could do. Noah shows you where it will actually work, and proves it inside your own organisation.",
  options: [
    {
      id: "slide",
      winner: false,
      kicker: "Slide deck",
      title: "Limited Value",
      tag: "Filed away",
      desc: "A polished presentation that explains what AI could do, but rarely tells you what to do next.",
      pros: [
        "Looks professional in board meetings",
        "Provides a high-level overview",
        "Pretty animations (maybe)",
      ],
      cons: [
        "Based on assumptions, not employee reality",
        "Outdated the moment it's delivered",
        "No prioritisation based on your company context",
        "Often ends up as a PDF nobody opens again",
      ],
    },
    {
      id: "noah",
      winner: true,
      kicker: "Noah",
      title: "High Value",
      tag: "Live pilot",
      desc: "The transformation OS that shows you exactly where AI will have the biggest impact.",
      pros: [
        "Built on real employee input, not management assumptions",
        "Prioritised by impact, feasibility, ROI and effort",
        "Continuously updated as your company evolves",
        "Learns from thousands of real-world AI implementations",
        "Available 24/7 instead of once-a-year workshops",
        "Gets smarter as more employees participate",
      ],
      cons: [
        "Requires companies to confront operational inefficiencies",
        "Less room for expensive consultants to sell generic reports",
        "Makes it harder to justify decisions based on gut feeling",
      ],
    },
  ],
};

export const TRADE_HOW = {
  eyebrow: "The process",
  title: "What you can expect.",
  body: "Four steps from dead deck to live pilot.",
  steps: [
    {
      rank: "01",
      title: "We set up your project",
      body: "We turn your dead deck into a live project. Your account gets created, your company context gets loaded, and we agree together on the scope of the pilot. Nothing for you to configure.",
    },
    {
      rank: "02",
      title: "We interview your people",
      body: "Up to 10 employees answer in their own time, roughly 10 to 20 minutes each. Think of a Teams call with the cameras off. No prep, no meeting to schedule, no calendar tetris.",
    },
    {
      rank: "03",
      title: "We process the results",
      body: "Every interview gets mapped against your company context and thousands of real-world AI implementations. Opportunities get scored on impact, feasibility, ROI and effort.",
    },
    {
      rank: "04",
      title: "You get insights within 48 hours",
      body: "Within 48 hours of processing starting, you receive a dynamic report full of business cases built on what your employees actually struggle with, including estimated KPIs and how the market already solved it.",
    },
  ],
};

export const TRADE_PROOF = [
  { name: "Easyfairs" },
  { name: "Dakgroep Naessens" },
  { name: "Noshaq" },
  { name: "Sweco" },
  { name: "UCB" },
];

export const TRADE_PROOF_EYEBROW =
  "Join 30+ who said goodbye to outdated slide decks";

export const TRADE_DEMO = {
  eyebrow: "See it work",
  title: "A live look at Noah.",
  youtubeId: "Y38uxbXmoa4",
};

export const TRADE_APPLY = {
  title: "Bury that useless deck now.",
  body: "Get what you actually wanted here.",
  submit: "Bury your deck",
  next: "Continue",
  back: "Back",
  success: "We will get back to you within one business day.",
  dropIdle: "Drop your unused deck",
  dropActive: "Release to bury it",
  dropBrowse: "or choose a file",
  dropFilled: "Deck ready",
  fileHint:
    "PDF, PPT, or PPTX, up to 4 MB. Larger files: paste a Drive or Dropbox link instead.",
};

export const TRADE_DECK_MAX_BYTES = 4 * 1024 * 1024;
export const TRADE_DECK_ACCEPT = ".pdf,.ppt,.pptx,application/pdf";
export const TRADE_DECK_EXTS = [".pdf", ".ppt", ".pptx"] as const;
export const TRADE_DECK_MIMES = new Set([
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/octet-stream",
]);

export type TradePayload = {
  name: string;
  email: string;
  phone: string;
  company: string;
  deckUrl: string;
  note: string;
  recaptchaToken: string;
  website?: string;
};

export type TradeFieldErrors = Partial<
  Record<"name" | "email" | "phone" | "company" | "deck" | "deckUrl" | "note", string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function oneLine(value: unknown) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

export function parseTradePayload(input: unknown): TradePayload {
  const data = (input ?? {}) as Record<string, unknown>;
  return {
    name: oneLine(data.name),
    email: oneLine(data.email).toLowerCase(),
    phone: oneLine(data.phone),
    company: oneLine(data.company),
    deckUrl: oneLine(data.deckUrl),
    note: String(data.note ?? "").trim(),
    recaptchaToken: oneLine(data.recaptchaToken),
    website: oneLine(data.website),
  };
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function deckFileError(file: File | null | undefined): string | undefined {
  if (!file || file.size === 0) return undefined;
  if (file.size > TRADE_DECK_MAX_BYTES) {
    return "Keep the file under 4 MB, or paste a link.";
  }
  const name = file.name.toLowerCase();
  const extOk = TRADE_DECK_EXTS.some((ext) => name.endsWith(ext));
  if (!extOk) return "Upload a PDF, PPT, or PPTX.";
  if (file.type && !TRADE_DECK_MIMES.has(file.type)) {
    return "Upload a PDF, PPT, or PPTX.";
  }
  return undefined;
}

export function validateTradeDeck(
  payload: Pick<TradePayload, "deckUrl">,
  file?: File | null
): TradeFieldErrors {
  const errors: TradeFieldErrors = {};
  const hasFile = Boolean(file && file.size > 0);
  const fileError = deckFileError(file);
  if (fileError) errors.deck = fileError;

  if (payload.deckUrl && !isHttpUrl(payload.deckUrl)) {
    errors.deckUrl = "Paste a valid http or https link.";
  }

  if (!hasFile && !payload.deckUrl) {
    errors.deck = "Upload a deck or paste a link.";
  }

  return errors;
}

export function validateTradePayload(
  payload: TradePayload,
  file?: File | null
): TradeFieldErrors {
  const errors = validateTradeDeck(payload, file);
  const digits = payload.phone.replace(/\D/g, "");

  if (!EMAIL_RE.test(payload.email)) errors.email = "Enter a valid email.";

  if (payload.phone && (digits.length < 7 || digits.length > 15)) {
    errors.phone = "Enter a phone number with country code.";
  }

  if (payload.note.length > 4000) {
    errors.note = "Keep this under 4,000 characters.";
  }

  return errors;
}
