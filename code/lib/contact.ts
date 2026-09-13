export const CONTACT_REGARDS = [
  { value: "question", label: "Question" },
  { value: "product", label: "Product" },
  { value: "partnership", label: "Partnership" },
  { value: "pricing", label: "Pricing" },
  { value: "press", label: "Press" },
  { value: "support", label: "Support" },
  { value: "other", label: "Other" },
] as const;

export type ContactRegard = (typeof CONTACT_REGARDS)[number]["value"];

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  regard: string;
  message: string;
  recaptchaToken: string;
  website?: string;
};

export type ContactFieldErrors = Partial<
  Record<"name" | "email" | "phone" | "regard" | "message", string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGARD_VALUES = new Set<string>(CONTACT_REGARDS.map((item) => item.value));

export function regardLabel(value: string) {
  return CONTACT_REGARDS.find((item) => item.value === value)?.label ?? value;
}

function oneLine(value: unknown) {
  return String(value ?? "")
    .replace(/[\r\n]+/g, " ")
    .trim();
}

export function parseContactPayload(input: unknown): ContactPayload {
  const data = (input ?? {}) as Record<string, unknown>;
  return {
    name: oneLine(data.name),
    email: oneLine(data.email).toLowerCase(),
    phone: oneLine(data.phone),
    regard: oneLine(data.regard),
    message: String(data.message ?? "").trim(),
    recaptchaToken: oneLine(data.recaptchaToken),
    website: oneLine(data.website),
  };
}

export function validateContactPayload(payload: ContactPayload): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const digits = payload.phone.replace(/\D/g, "");

  if (payload.name.length < 2) errors.name = "Enter your name.";
  else if (payload.name.length > 80) errors.name = "Keep this under 80 characters.";

  if (!EMAIL_RE.test(payload.email)) errors.email = "Enter a valid email.";

  if (digits.length < 7 || digits.length > 15) {
    errors.phone = "Enter a phone number with country code.";
  }

  if (!REGARD_VALUES.has(payload.regard)) {
    errors.regard = "Choose what this is about.";
  }

  if (payload.message.length < 10) errors.message = "Write a short message.";
  else if (payload.message.length > 4000) {
    errors.message = "Keep this under 4,000 characters.";
  }

  return errors;
}
