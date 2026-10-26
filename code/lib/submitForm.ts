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

// Never throws on webhook failure: the form flow must continue.
export async function submitForm(
  formName: FormName,
  rawFields: Record<string, unknown>,
  utm: unknown = {}
) {
  if (!isFormName(formName)) throw new Error(`Unknown form name: ${formName}`);
  const payload = buildPayload(formName, rawFields, utm);

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
