// Run with: npm test (Node 24 strips the TypeScript types on import).
import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPayload, mapFields, submitForm } from "./submitForm.ts";

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
];

test("form_contact maps every field and skips technical ones", () => {
  const fields = mapFields("form_contact", {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+32 470 00 00 00",
    regard: "Pricing",
    message: "Hello",
    recaptchaToken: "token",
    website: "",
  });
  assert.deepEqual(Object.keys(fields), SCHEMA_KEYS);
  assert.equal(fields.name, "Jane Doe");
  assert.equal(fields.in_what_regard, "Pricing");
  assert.equal(fields.message, "Hello");
  assert.equal(fields.other, "");
  assert.ok(!JSON.stringify(fields).includes("token"));
});

test("partner_application joins first and last name", () => {
  const fields = mapFields("partner_application", {
    firstName: "  Jane ",
    lastName: "Doe  ",
    workEmail: "jane@acme.com",
    companyName: "Acme",
    consultants: "50 to 150",
    country: "Belgium",
    services: "AI strategy",
    extra: "Call me",
  });
  assert.equal(fields.name, "Jane Doe");
  assert.equal(fields.number_of_consultants, "50 to 150");
  assert.equal(fields.help_clients, "AI strategy");
  assert.equal(fields.message, "Call me");
});

test("unknown fields land in other, never dropped", () => {
  const fields = mapFields("form_contact", { name: "Jane", budget: "10k", team: "5" });
  assert.equal(fields.other, "budget: 10k\nteam: 5");
});

test("payload has fixed values, all utm_ keys, no hub_signup_date", () => {
  const payload = buildPayload(
    "form_contact",
    { name: "Jane" },
    { utm_source: "linkedin", utm_custom: "x", ref: "drop" }
  );
  assert.equal(payload.form_name, "form_contact");
  assert.equal(payload.lead_source, "Inbound");
  assert.equal(payload.high_intent_action, "Yes");
  assert.equal(payload.latest_marketing_action, "form_contact");
  assert.ok(!("hub_signup_date" in payload));
  assert.ok(!("lead_source_detail" in payload));
  assert.deepEqual(payload.utm, { utm_source: "linkedin", utm_custom: "x" });
  assert.deepEqual(buildPayload("form_contact", {}, undefined).utm, {});
});

test("unknown form names throw", async () => {
  await assert.rejects(submitForm("newsletter", {}), /Unknown form name/);
});

test("webhook failure does not throw", async () => {
  process.env.N8N_FORM_WEBHOOK_URL = "http://127.0.0.1:9/unreachable";
  const original = console.error;
  console.error = () => {};
  try {
    await submitForm("form_contact", { name: "Jane" });
  } finally {
    console.error = original;
  }
});
