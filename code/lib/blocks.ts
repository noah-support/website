export const FIELD_TYPES = ["text", "email", "phone", "textarea", "select", "checkbox"] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

// Where an answer lands in the webhook body. "" picks a target from the type and label.
export const FIELD_TARGETS = [
  { value: "", label: "Automatic" },
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "company_name", label: "Company name" },
  { value: "number_of_consultants", label: "Number of consultants" },
  { value: "country", label: "Country" },
  { value: "help_clients", label: "Help clients" },
  { value: "in_what_regard", label: "In what regard" },
  { value: "message", label: "Message" },
  { value: "other", label: "Other" },
] as const;
export type FieldTarget = (typeof FIELD_TARGETS)[number]["value"];
export type AnswerKey = Exclude<FieldTarget, "">;

export type FormField = {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  options: string[];
  // Text only: shows two inputs, first name and last name.
  split: boolean;
  mapTo: FieldTarget;
  // Email only: accept public domains such as gmail.com.
  allowPublicEmail: boolean;
};

export type FormStep = {
  id: string;
  title: string;
  fields: FormField[];
};

export type HeadingBlock = { id: string; type: "heading"; level: 1 | 2 | 3; text: string };
export type TextBlock = { id: string; type: "text"; text: string };
export type ImageBlock = { id: string; type: "image"; assetId: string; alt: string };
export type ButtonBlock = { id: string; type: "button"; label: string; targetPageId: string };
export type PdfBlock = { id: string; type: "pdf"; assetId: string };
export type SpacerBlock = { id: string; type: "spacer"; height: number };
export const SPACER_MIN = 8;
export const SPACER_MAX = 600;
// skipWebhook: answers are stored, but never sent to n8n.
export type FormBlock = {
  id: string;
  type: "form";
  steps: FormStep[];
  targetPageId: string;
  formName: string;
  skipWebhook: boolean;
};
export const SECTION_TEMPLATES = ["hero", "feature", "video", "compare", "process", "faq", "pricing", "proof", "cta"] as const;
export type SectionTemplate = (typeof SECTION_TEMPLATES)[number];
export type SectionItem = { id: string; title: string; body: string };
export type HeroMedia = "kpi" | "form" | "pdf";
export type TextSide = "left" | "right";
export type ImageFit = "fill" | "fit";
export type SectionBlock = {
  id: string;
  type: "section";
  template: SectionTemplate;
  eyebrow: string;
  title: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
  heroMedia: HeroMedia;
  pdfAssetId: string;
  imageAssetId: string;
  imageAlt: string;
  textSide: TextSide;
  imageFit: ImageFit;
  videoUrl: string;
  videoAssetId: string;
  items: SectionItem[];
};
export type Block = HeadingBlock | TextBlock | ImageBlock | ButtonBlock | PdfBlock | SpacerBlock | FormBlock | SectionBlock;

export type StoredAnswer = { fieldId: string; label: string; value: string; key?: AnswerKey };

const BLOCK_TYPES = ["heading", "text", "image", "button", "pdf", "spacer", "form", "section"] as const;
const MAX_BLOCKS = 40;
const MAX_SECTION_ITEMS = 8;
const MAX_STEPS = 8;
const MAX_FIELDS = 20;
const MAX_OPTIONS = 30;

export function newId() {
  return globalThis.crypto.randomUUID();
}

export function slugify(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return base || "flow";
}

export function isFlowSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 60;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown, max: number) {
  return String(value ?? "").replace(/\s+\n/g, "\n").trim().slice(0, max);
}

function field(type: FieldType, label: string, options: string[] = []): FormField {
  return {
    id: newId(),
    type,
    label,
    required: type !== "checkbox",
    options,
    split: false,
    mapTo: "",
    allowPublicEmail: false,
  };
}

export function nameField(): FormField {
  return { ...field("text", "Name"), split: true };
}

export function splitFieldIds(fieldId: string) {
  return { first: `${fieldId}:first`, last: `${fieldId}:last` };
}

const LABEL_TARGETS: [RegExp, AnswerKey][] = [
  // First and last name both land in `name`, joined in form order.
  [/\b(first|given|fore|last|family|sur)\s*name\b|^(your |full )?name$|^surname$|^(voor|achter)?naam$|^(pr[eé])?nom$/, "name"],
  [/e-?mail/, "email"],
  [/phone|mobile|telephone|tel\b/, "phone"],
  [/company|organi[sz]ation|business name|employer/, "company_name"],
  [/consultants/, "number_of_consultants"],
  [/country/, "country"],
  [/regard|topic|subject/, "in_what_regard"],
  [/message|comment|question|anything else/, "message"],
];

// The webhook key for a field: the chosen target, else the type, else the label.
export function fieldTarget(item: Pick<FormField, "type" | "label" | "mapTo">): AnswerKey {
  if (item.mapTo) return item.mapTo;
  if (item.type === "email") return "email";
  if (item.type === "phone") return "phone";
  if (item.type === "checkbox") return "other";
  const label = item.label.trim().toLowerCase();
  for (const [pattern, key] of LABEL_TARGETS) {
    if (pattern.test(label)) return key;
  }
  return "other";
}

export function starterBlocks(): Block[] {
  return [
    { id: newId(), type: "heading", level: 1, text: "Start here" },
    {
      id: newId(),
      type: "form",
      formName: "",
      targetPageId: "",
      skipWebhook: false,
      steps: [
        {
          id: newId(),
          title: "Your details",
          fields: [nameField(), field("email", "Email")],
        },
      ],
    },
    {
      id: newId(),
      type: "text",
      text: "Explain what the reader gets, and what happens after they send the form.",
    },
  ];
}

export function thankYouBlocks(): Block[] {
  return [
    { id: newId(), type: "heading", level: 1, text: "Thank you" },
    { id: newId(), type: "text", text: "We have what we need. We'll be in touch." },
  ];
}

export function pdfBlocks(): Block[] {
  return [
    { id: newId(), type: "heading", level: 1, text: "Your document" },
    { id: newId(), type: "pdf", assetId: "" },
  ];
}

export function blankBlocks(): Block[] {
  return [
    { id: newId(), type: "heading", level: 2, text: "New page" },
    { id: newId(), type: "text", text: "" },
  ];
}

function item(title: string, body: string): SectionItem {
  return { id: newId(), title, body };
}

export function safeButtonHref(value: string) {
  const href = value.trim().slice(0, 500);
  if (!href) return "";
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const url = new URL(href);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    return "";
  }
  return "";
}

export function createSection(template: SectionTemplate): SectionBlock {
  const base = {
    id: newId(),
    type: "section" as const,
    template,
    eyebrow: "",
    title: "",
    body: "",
    buttonLabel: "",
    buttonHref: "",
    heroMedia: "kpi" as const,
    pdfAssetId: "",
    imageAssetId: "",
    imageAlt: "",
    textSide: "left" as const,
    imageFit: "fit" as const,
    videoUrl: "",
    videoAssetId: "",
    items: [] as SectionItem[],
  };
  if (template === "hero") {
    return {
      ...base,
      eyebrow: "Process intelligence, within 24 hours.",
      title: "Noah, the right hand of every transformation manager.",
      body: "Noah interviews your teams to identify pain points, suggests tailored solutions, and guides you towards implementation.",
      buttonLabel: "Book a demo",
      buttonHref: "/book",
    };
  }
  if (template === "feature") {
    return {
      ...base,
      eyebrow: "AI-based interviews",
      title: "Grounded in reality",
      body: "Every recommendation traces back to something a real person on your team said. Not a generic template.",
    };
  }
  if (template === "video") {
    return {
      ...base,
      eyebrow: "See it",
      title: "Noah in two minutes.",
      body: "",
    };
  }
  if (template === "compare") {
    return {
      ...base,
      title: "Big organisations only have two options for transformation.",
      items: [
        item("In-house", "Manual interviews that take weeks\nNo data to prove a problem matters\nMonths go by with nothing shipped"),
        item("Consultants", "Static advice that is outdated on arrival\nGeneric frameworks sold as custom work\nA large invoice and a slide deck"),
      ],
    };
  }
  if (template === "process") {
    return {
      ...base,
      eyebrow: "A third option",
      title: "Introducing Noah.",
      body: "Noah interviews the team, maps the work, and hands back a priced roadmap.",
      items: [
        item("Interview", "The team talks through how the work actually happens."),
        item("Map", "Pain points and workarounds land on one picture."),
        item("Roadmap", "Each fix comes back with time, money, and a rank."),
      ],
    };
  }
  if (template === "faq") {
    return {
      ...base,
      eyebrow: "FAQ",
      title: "Questions, answered.",
      items: [
        item("How is this different from hiring a consultant?", "We interview the team directly and hand back priced cases. No deck, no retainer."),
        item("What does the first day look like?", "A department is interviewed in a day. By the end, the map of how it works has started."),
        item("Do you build the fix?", "We map it, price it, and rank it. You decide who builds it."),
      ],
    };
  }
  if (template === "pricing") {
    return {
      ...base,
      eyebrow: "Pricing",
      title: "Start with one department.",
      items: [
        item("One-time", "Single fee\nFor a single department\nResults within 24 hours\nUp to 20 interviews"),
        item("Enterprise", "Custom pricing\nFor an organisation going all in\nContinuously updated opportunities\nUnlimited interviews"),
      ],
    };
  }
  if (template === "proof") {
    return {
      ...base,
      eyebrow: "Teams",
      title: "What came back.",
      items: [
        item("UCB", "€250k+\nconsulting saved\nThe QA team found its top opportunities in a week, instead of months with an outside firm."),
        item("Vekoma", "€350k+\nconsulting saved\nTwenty interviews in a day. A clear roadmap the next morning."),
      ],
    };
  }
  return {
    ...base,
    title: "See it on your own process.",
    body: "One department. A day of interviews. A priced roadmap the next morning.",
    buttonLabel: "Book a demo",
    buttonHref: "/book",
  };
}

export function createBlock(type: Block["type"]): Block | null {
  switch (type) {
    case "heading":
      return { id: newId(), type, level: 2, text: "Heading" };
    case "text":
      return { id: newId(), type, text: "" };
    case "image":
      return { id: newId(), type, assetId: "", alt: "" };
    case "button":
      return { id: newId(), type, label: "Continue", targetPageId: "" };
    case "pdf":
      return { id: newId(), type, assetId: "" };
    case "spacer":
      return { id: newId(), type, height: 64 };
    case "form":
      return {
        id: newId(),
        type,
        formName: "",
        targetPageId: "",
        skipWebhook: false,
        steps: [{ id: newId(), title: "Your details", fields: [nameField(), field("email", "Email")] }],
      };
    default:
      return null;
  }
}

export function sectionFields(template: SectionTemplate) {
  return {
    eyebrow: template !== "compare",
    body: template === "hero" || template === "feature" || template === "process" || template === "cta" || template === "video",
    button: template === "hero" || template === "cta",
    heroChoice: template === "hero",
    image: template === "feature",
    video: template === "video",
    items: template === "compare" || template === "process" || template === "faq" || template === "pricing" || template === "proof",
  };
}

export function sectionItemLabels(template: SectionTemplate) {
  if (template === "faq") return { title: "Question", body: "Answer" };
  if (template === "pricing") return { title: "Plan", body: "Price on the first line, then one point per line" };
  if (template === "proof") return { title: "Company", body: "Figure, then the label, then the quote" };
  if (template === "compare") return { title: "Option", body: "Points, one per line" };
  return { title: "Step", body: "Detail" };
}

export const SECTION_CATALOG: { template: SectionTemplate; name: string; detail: string }[] = [
  { template: "hero", name: "Hero", detail: "Full-screen opening, one button, and a KPI, form, or PDF." },
  { template: "feature", name: "Feature", detail: "Text beside an image, on either side." },
  { template: "video", name: "Video", detail: "A YouTube video or a file in a glass screen." },
  { template: "compare", name: "Two options", detail: "A heading and two glass cards." },
  { template: "process", name: "Process", detail: "Numbered steps under a heading." },
  { template: "faq", name: "FAQ", detail: "Questions that open to an answer." },
  { template: "pricing", name: "Pricing", detail: "Plan cards with a price and a list." },
  { template: "proof", name: "Proof", detail: "A company, a figure, and a quote." },
  { template: "cta", name: "Closing", detail: "A last heading and a button." },
];

export function formBlock(blocks: Block[]) {
  return blocks.find((block): block is FormBlock => block.type === "form") ?? null;
}

export function pageWarnings(blocks: Block[]) {
  const warnings: string[] = [];
  const form = formBlock(blocks);
  if (form && !form.skipWebhook && !form.formName.trim()) {
    warnings.push("Add the HubSpot form name. The webhook sends that exact name, and HubSpot must use the same one.");
  }
  if (form && !form.targetPageId) {
    warnings.push("Choose the page that opens after this form is submitted.");
  }
  for (const block of blocks) {
    if (block.type === "section" && block.template === "hero" && block.heroMedia === "form" && !form) {
      warnings.push("The hero shows a form, but this page has no form.");
    }
    if (block.type === "section" && block.template === "hero" && block.heroMedia === "pdf" && !block.pdfAssetId) {
      warnings.push("The hero shows a PDF, but no file is uploaded.");
    }
    if (
      block.type === "section" &&
      (block.template === "hero" || block.template === "cta") &&
      block.buttonLabel &&
      !safeButtonHref(block.buttonHref)
    ) {
      warnings.push("A button has words but no working link.");
    }
    if (block.type === "section" && block.template === "video" && !block.videoAssetId && !youtubeId(block.videoUrl)) {
      warnings.push("The video section needs a YouTube link or an uploaded video.");
    }
    if (block.type === "button" && block.label && !block.targetPageId) {
      warnings.push("A button has no page to open.");
    }
  }
  return [...new Set(warnings)];
}

export function clearPageTargets(blocks: Block[], pageId: string): Block[] {
  return blocks.map((block) => {
    if ((block.type === "button" || block.type === "form") && block.targetPageId === pageId) {
      return { ...block, targetPageId: "" };
    }
    return block;
  });
}

export function withFormTarget(blocks: Block[], targetPageId: string): Block[] {
  return blocks.map((block) => (block.type === "form" ? { ...block, targetPageId } : block));
}

export function assignEmptyFormTarget(blocks: Block[], targetPageId: string) {
  let changed = false;
  const next = blocks.map((block) => {
    if (!changed && block.type === "form" && !block.targetPageId) {
      changed = true;
      return { ...block, targetPageId };
    }
    return block;
  });
  return { blocks: next, changed };
}

export function parseBlocks(input: unknown): { ok: true; blocks: Block[] } | { ok: false; error: string } {
  if (!Array.isArray(input)) return { ok: false, error: "Page content must be a list of blocks." };
  if (input.length > MAX_BLOCKS) return { ok: false, error: "A page can have at most 40 blocks." };

  const blocks: Block[] = [];
  const ids = new Set<string>();
  let forms = 0;

  for (const raw of input) {
    if (!isRecord(raw) || typeof raw.type !== "string") {
      return { ok: false, error: "A block is missing its type." };
    }
    if (!BLOCK_TYPES.includes(raw.type as (typeof BLOCK_TYPES)[number])) {
      return { ok: false, error: "That block type is not supported." };
    }
    const id = typeof raw.id === "string" && raw.id.length > 0 && raw.id.length <= 80 ? raw.id : "";
    if (!id || ids.has(id)) return { ok: false, error: "Each block needs its own id." };
    ids.add(id);

    if (raw.type === "heading") {
      const level = Number(raw.level);
      if (level !== 1 && level !== 2 && level !== 3) {
        return { ok: false, error: "A heading needs a level from 1 to 3." };
      }
      blocks.push({ id, type: "heading", level, text: cleanText(raw.text, 200) });
      continue;
    }
    if (raw.type === "text") {
      blocks.push({ id, type: "text", text: cleanText(raw.text, 5000) });
      continue;
    }
    if (raw.type === "image") {
      blocks.push({
        id,
        type: "image",
        assetId: cleanText(raw.assetId, 80),
        alt: cleanText(raw.alt, 180),
      });
      continue;
    }
    if (raw.type === "button") {
      blocks.push({
        id,
        type: "button",
        label: cleanText(raw.label, 80),
        targetPageId: cleanText(raw.targetPageId, 80),
      });
      continue;
    }
    if (raw.type === "spacer") {
      blocks.push({ id, type: "spacer", height: spacerHeight(raw.height) });
      continue;
    }
    if (raw.type === "pdf") {
      blocks.push({ id, type: "pdf", assetId: cleanText(raw.assetId, 80) });
      continue;
    }
    if (raw.type === "section") {
      const parsed = parseSection(raw, ids);
      if (!parsed.ok) return parsed;
      blocks.push(parsed.block);
      continue;
    }

    forms += 1;
    if (forms > 1) return { ok: false, error: "A page can have one form." };
    const parsed = parseForm(raw, ids);
    if (!parsed.ok) return parsed;
    blocks.push({
      id,
      type: "form",
      formName: cleanText(raw.formName, 120),
      targetPageId: cleanText(raw.targetPageId, 80),
      skipWebhook: raw.skipWebhook === true,
      steps: parsed.steps,
    });
  }

  return { ok: true, blocks };
}

export function spacerHeight(value: unknown) {
  const height = Math.round(Number(value));
  if (!Number.isFinite(height)) return 64;
  return Math.min(SPACER_MAX, Math.max(SPACER_MIN, height));
}

function parseSection(
  raw: Record<string, unknown>,
  ids: Set<string>
): { ok: true; block: SectionBlock } | { ok: false; error: string } {
  if (!SECTION_TEMPLATES.includes(raw.template as SectionTemplate)) {
    return { ok: false, error: "That section template is not supported." };
  }
  if (!Array.isArray(raw.items)) return { ok: false, error: "A section is missing its items." };
  if (raw.items.length > MAX_SECTION_ITEMS) {
    return { ok: false, error: "A section can have at most 8 items." };
  }
  const items: SectionItem[] = [];
  for (const itemRaw of raw.items) {
    if (!isRecord(itemRaw)) return { ok: false, error: "A section item is incomplete." };
    const id = typeof itemRaw.id === "string" ? itemRaw.id : "";
    if (!id || id.length > 80 || ids.has(id)) return { ok: false, error: "Each section item needs its own id." };
    ids.add(id);
    items.push({ id, title: cleanText(itemRaw.title, 160), body: cleanText(itemRaw.body, 2000) });
  }
  const id = typeof raw.id === "string" ? raw.id : "";
  return {
    ok: true,
    block: {
      id,
      type: "section",
      template: raw.template as SectionTemplate,
      eyebrow: cleanText(raw.eyebrow, 160),
      title: cleanText(raw.title, 240),
      body: cleanText(raw.body, 2000),
      buttonLabel: cleanText(raw.buttonLabel, 80),
      buttonHref: cleanText(raw.buttonHref, 500),
      heroMedia: raw.heroMedia === "form" || raw.heroMedia === "pdf" ? raw.heroMedia : "kpi",
      pdfAssetId: cleanText(raw.pdfAssetId, 80),
      imageAssetId: cleanText(raw.imageAssetId, 80),
      imageAlt: cleanText(raw.imageAlt, 180),
      textSide: raw.textSide === "right" ? "right" : "left",
      imageFit: raw.imageFit === "fill" ? "fill" : "fit",
      videoUrl: cleanText(raw.videoUrl, 500),
      videoAssetId: cleanText(raw.videoAssetId, 80),
      items,
    },
  };
}

function parseForm(
  raw: Record<string, unknown>,
  ids: Set<string>
): { ok: true; steps: FormStep[] } | { ok: false; error: string } {
  if (!Array.isArray(raw.steps) || raw.steps.length === 0) {
    return { ok: false, error: "A form needs at least one step." };
  }
  if (raw.steps.length > MAX_STEPS) return { ok: false, error: "A form can have at most 8 steps." };

  const steps: FormStep[] = [];
  for (const stepRaw of raw.steps) {
    if (!isRecord(stepRaw)) return { ok: false, error: "A form step is incomplete." };
    const id = typeof stepRaw.id === "string" ? stepRaw.id : "";
    if (!id || id.length > 80 || ids.has(id)) return { ok: false, error: "Each form step needs its own id." };
    ids.add(id);
    if (!Array.isArray(stepRaw.fields) || stepRaw.fields.length === 0) {
      return { ok: false, error: "Each form step needs a field." };
    }
    if (stepRaw.fields.length > MAX_FIELDS) {
      return { ok: false, error: "A form step can have at most 20 fields." };
    }
    const fields: FormField[] = [];
    for (const fieldRaw of stepRaw.fields) {
      const parsed = parseField(fieldRaw, ids);
      if (!parsed.ok) return parsed;
      fields.push(parsed.field);
    }
    steps.push({ id, title: cleanText(stepRaw.title, 120) || "Step", fields });
  }
  return { ok: true, steps };
}

function parseField(
  raw: unknown,
  ids: Set<string>
): { ok: true; field: FormField } | { ok: false; error: string } {
  if (!isRecord(raw)) return { ok: false, error: "A form field is incomplete." };
  const id = typeof raw.id === "string" ? raw.id : "";
  if (!id || id.length > 80 || ids.has(id)) return { ok: false, error: "Each form field needs its own id." };
  ids.add(id);
  if (!FIELD_TYPES.includes(raw.type as FieldType)) {
    return { ok: false, error: "That field type is not supported." };
  }
  const type = raw.type as FieldType;
  const label = cleanText(raw.label, 120);
  if (!label) return { ok: false, error: "Every field needs a label." };
  let options: string[] = [];
  if (type === "select") {
    if (!Array.isArray(raw.options)) return { ok: false, error: "A dropdown needs options." };
    options = raw.options.map((option) => cleanText(option, 80)).filter(Boolean);
    if (options.length === 0 || options.length > MAX_OPTIONS) {
      return { ok: false, error: "A dropdown needs between 1 and 30 options." };
    }
  }
  const mapTo = FIELD_TARGETS.some((target) => target.value === raw.mapTo) ? (raw.mapTo as FieldTarget) : "";
  const split = type === "text" && raw.split === true;
  const allowPublicEmail = type === "email" && raw.allowPublicEmail === true;
  return {
    ok: true,
    field: {
      id,
      type,
      label,
      required: raw.required === true,
      options,
      split,
      mapTo: split ? "" : mapTo,
      allowPublicEmail,
    },
  };
}

export function blocksFromAi(input: unknown): { ok: true; blocks: Block[] } | { ok: false; error: string } {
  let raw = input;
  if (typeof raw === "string") {
    const trimmed = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
    try {
      raw = JSON.parse(trimmed);
    } catch {
      return { ok: false, error: "The model did not return blocks." };
    }
  }
  const list = Array.isArray(raw) ? raw : isRecord(raw) && Array.isArray(raw.blocks) ? raw.blocks : null;
  if (!list) return { ok: false, error: "The model did not return blocks." };

  const prepared = list.slice(0, 8).flatMap((item) => {
    if (!isRecord(item) || typeof item.type !== "string") return [];
    if (item.type === "image" || item.type === "pdf" || item.type === "section" || item.type === "spacer") return [];
    if (!BLOCK_TYPES.includes(item.type as (typeof BLOCK_TYPES)[number])) return [];
    return [stampIds(item)];
  });
  if (prepared.length === 0) {
    return { ok: false, error: "Ask for headings, text, a button, or a form. Images and PDFs are added from the insert panel." };
  }
  return parseBlocks(prepared);
}

function stampIds(block: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = { ...block, id: newId() };
  if (block.type !== "form" || !Array.isArray(block.steps)) return next;
  next.steps = block.steps.map((step) => {
    if (!isRecord(step)) return step;
    const fields = Array.isArray(step.fields) ? step.fields : [];
    return {
      ...step,
      id: newId(),
      fields: fields.map((item) => (isRecord(item) ? { ...item, id: newId() } : item)),
    };
  });
  return next;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PUBLIC_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "yahoo.fr",
  "ymail.com",
  "hotmail.com",
  "hotmail.co.uk",
  "outlook.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "gmx.com",
  "gmx.net",
  "mail.com",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
  "qq.com",
  "163.com",
  "fastmail.com",
  "tutanota.com",
  "tuta.com",
  "hey.com",
  "duck.com",
]);

export function emailFieldError(value: string, options: { allowPublic?: boolean } = {}) {
  const email = value.trim().toLowerCase();
  if (!email) return "";
  if (!EMAIL.test(email)) return "Enter a valid email.";
  if (email.includes("test")) return "Use a business email. A test address cannot continue.";
  const domain = email.slice(email.lastIndexOf("@") + 1);
  if (!options.allowPublic && PUBLIC_EMAIL_DOMAINS.has(domain)) return "Use a business email, not a public one.";
  return "";
}

export function validateAnswers(
  form: FormBlock,
  input: unknown
): { ok: true; answers: StoredAnswer[] } | { ok: false; error: string; fieldErrors: Record<string, string> } {
  const provided = new Map<string, string>();
  if (Array.isArray(input)) {
    for (const item of input) {
      if (!isRecord(item) || typeof item.fieldId !== "string") continue;
      provided.set(item.fieldId, cleanText(item.value, 4000));
    }
  }

  const fieldErrors: Record<string, string> = {};
  const answers: StoredAnswer[] = [];

  for (const step of form.steps) {
    for (const item of step.fields) {
      if (item.split) {
        const ids = splitFieldIds(item.id);
        const first = provided.get(ids.first) ?? "";
        const last = provided.get(ids.last) ?? "";
        if (item.required && (!first || !last)) fieldErrors[item.id] = "Enter your first and last name.";
        answers.push({ fieldId: ids.first, label: "First name", value: first, key: "name" });
        answers.push({ fieldId: ids.last, label: "Last name", value: last, key: "name" });
        continue;
      }
      const key = fieldTarget(item);
      const value = provided.get(item.id) ?? "";
      if (item.type === "checkbox") {
        const checked = value === "yes";
        if (item.required && !checked) fieldErrors[item.id] = "This is required.";
        answers.push({ fieldId: item.id, label: item.label, value: checked ? "yes" : "", key });
        continue;
      }
      if (item.required && !value) {
        fieldErrors[item.id] = "This is required.";
      } else if (value && item.type === "email") {
        const message = emailFieldError(value, { allowPublic: item.allowPublicEmail });
        if (message) fieldErrors[item.id] = message;
      } else if (value && item.type === "phone" && value.replace(/\D/g, "").length < 6) {
        fieldErrors[item.id] = "Enter a phone number.";
      } else if (value && item.type === "select" && !item.options.includes(value)) {
        fieldErrors[item.id] = "Choose one of the options.";
      }
      answers.push({ fieldId: item.id, label: item.label, value, key });
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "Check the highlighted fields.", fieldErrors };
  }
  return { ok: true, answers };
}

// Accepts youtube.com/watch, youtu.be, /embed, /shorts and /live links.
export function youtubeId(value: string) {
  const text = value.trim();
  if (!text) return "";
  let url: URL;
  try {
    url = new URL(text);
  } catch {
    return "";
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");
  let id = "";
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0] ?? "";
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v") ?? "";
    else {
      const match = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/);
      id = match?.[1] ?? "";
    }
  }
  return /^[\w-]{6,20}$/.test(id) ? id : "";
}
