// Posts form submissions to the n8n webhook. n8n owns the HubSpot logic.
// Server only: the webhook URL never reaches the browser.

export const FORM_NAMES = [
  "form_contact",
  "demo_questions",
  "demo_interview",
  "hub_signup",
  "partner_application",
] as const;

export type FormName = (typeof FORM_NAMES)[number];

const SCHEMA_KEYS = [
  "name",
  "email",
  "phone",
  "company_name",
  "number_of_consultants",
  "country",
  "help_clients",
  "in_what_regard",
  "message",
  "other",
] as const;

type SchemaKey = (typeof SCHEMA_KEYS)[number];
type FieldRule = { to: Exclude<SchemaKey, "other"> } | { to: "other"; label: string } | "skip";

// One config per form in this app: raw field name -> schema key.
// Fields missing from a config land in `other` under their raw name.
const FORM_FIELDS: Partial<Record<FormName, Record<string, FieldRule>>> = {
  form_contact: {
    name: { to: "name" },
    email: { to: "email" },
    phone: { to: "phone" },
    regard: { to: "in_what_regard" },
    message: { to: "message" },
    recaptchaToken: "skip",
    website: "skip",
  },
  partner_application: {
    firstName: { to: "name" },
    lastName: { to: "name" },
    workEmail: { to: "email" },
    companyName: { to: "company_name" },
    consultants: { to: "number_of_consultants" },
    country: { to: "country" },
    services: { to: "help_clients" },
    extra: { to: "message" },
    recaptchaToken: "skip",
    website: "skip",
  },
};

const TIMEOUT_MS = 5000;
const UTM_KEY_LIMIT = 50;

// False unless DISABLE_CAPTURES is exactly "true". Capture stays on by default.
export function capturesDisabled() {
  return process.env.DISABLE_CAPTURES?.trim().toLowerCase() === "true";
}

export function formWebhookUrl() {
  const url = process.env.N8N_FORM_WEBHOOK_URL?.trim();
  if (!url) {
    throw new Error(
      "N8N_FORM_WEBHOOK_URL is not set. Form submissions cannot reach n8n."
    );
  }
  return url;
}

export function isFormName(value: string): value is FormName {
  return (FORM_NAMES as readonly string[]).includes(value);
}

export function cleanUtm(input: unknown): Record<string, string> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    return {};
  }
  const utm: Record<string, string> = {};
  for (const [key, value] of Object.entries(input)) {
    if (Object.keys(utm).length >= UTM_KEY_LIMIT) break;
    if (!key.startsWith("utm_") || typeof value !== "string") continue;
    utm[key.slice(0, 100)] = value.trim().slice(0, 500);
  }
  return utm;
}

export function mapFields(formName: FormName, rawFields: Record<string, unknown>) {
  const rules = FORM_FIELDS[formName];
  if (!rules) throw new Error(`Form "${formName}" has no field mapping in this app.`);

  const fields = Object.fromEntries(SCHEMA_KEYS.map((key) => [key, ""])) as Record<
    SchemaKey,
    string
  >;
  const nameParts: string[] = [];
  const otherLines: string[] = [];

  for (const [field, raw] of Object.entries(rawFields)) {
    const rule = rules[field] ?? { to: "other", label: field };
    const value = String(raw ?? "").trim();
    if (rule === "skip" || !value) continue;

    if (rule.to === "name") nameParts.push(value);
    else if (rule.to === "other") otherLines.push(`${rule.label}: ${value}`);
    else fields[rule.to] = fields[rule.to] ? `${fields[rule.to]}\n${value}` : value;
  }

  fields.name = nameParts.join(" ").replace(/\s+/g, " ").trim();
  fields.other = otherLines.join("\n");
  return fields;
}

export function buildPayload(
  formName: FormName,
  rawFields: Record<string, unknown>,
  utm: unknown,
  now = new Date()
) {
  return {
    fields: mapFields(formName, rawFields),
    form_name: formName,
    lead_source: "Inbound",
    high_intent_action: "Yes",
    latest_marketing_action: formName,
    ...(formName === "hub_signup"
      ? { hub_signup_date: now.toISOString().slice(0, 10) }
      : {}),
    utm: cleanUtm(utm),
  };
}

const LANDING_LABELS: Record<string, Exclude<SchemaKey, "other">> = {
  name: "name",
  "full name": "name",
  email: "email",
  "email address": "email",
  "work email": "email",
  phone: "phone",
  telephone: "phone",
  "phone number": "phone",
  company: "company_name",
  "company name": "company_name",
  country: "country",
  message: "message",
};

export function landingFormName(slug: string) {
  const cleaned = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);
  return `landing_${cleaned || "flow"}`;
}

export function mapLandingAnswers(answers: { label: string; value: string }[]) {
  const fields = Object.fromEntries(SCHEMA_KEYS.map((key) => [key, ""])) as Record<SchemaKey, string>;
  const nameParts: string[] = [];
  const otherLines: string[] = [];

  for (const answer of answers) {
    const value = answer.value.trim();
    if (!value) continue;
    const key = LANDING_LABELS[answer.label.trim().toLowerCase()];
    if (key === "name") nameParts.push(value);
    else if (key) fields[key] = fields[key] ? `${fields[key]}\n${value}` : value;
    else otherLines.push(`${answer.label}: ${value === "yes" ? "yes" : value}`);
  }

  fields.name = nameParts.join(" ").replace(/\s+/g, " ").trim();
  fields.other = otherLines.join("\n");
  return fields;
}

export function buildLandingPayload(
  slug: string,
  answers: { label: string; value: string }[],
  utm: unknown,
  formName = ""
) {
  const name = formName.trim() || landingFormName(slug);
  return {
    fields: mapLandingAnswers(answers),
    form_name: name,
    lead_source: "Inbound",
    high_intent_action: "Yes",
    latest_marketing_action: name,
    utm: cleanUtm(utm),
  };
}

// Landing forms use the flow slug as the form name. Webhook failure does not throw.
export async function submitLandingForm(
  slug: string,
  answers: { label: string; value: string }[],
  utm: unknown = {},
  formName = ""
) {
  const payload = buildLandingPayload(slug, answers, utm, formName);
  if (capturesDisabled()) {
    console.info(`[submitForm] ${payload.form_name} capture skipped`);
    return;
  }
  try {
    const response = await fetch(formWebhookUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(`[submitForm] ${payload.form_name} webhook failed:`, response.status);
    }
  } catch (error) {
    console.error(`[submitForm] ${payload.form_name} webhook failed:`, error);
  }
}

// Never throws on webhook failure: the form flow must continue.
export async function submitForm(
  formName: FormName,
  rawFields: Record<string, unknown>,
  utm: unknown = {}
) {
  if (!isFormName(formName)) throw new Error(`Unknown form name: ${formName}`);
  const payload = buildPayload(formName, rawFields, utm);
  if (capturesDisabled()) {
    console.info(`[submitForm] ${formName} capture skipped`);
    return;
  }

  try {
    const response = await fetch(formWebhookUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(`[submitForm] ${formName} webhook failed:`, response.status);
    }
  } catch (error) {
    console.error(`[submitForm] ${formName} webhook failed:`, error);
  }
}
