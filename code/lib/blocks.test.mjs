import assert from "node:assert/strict";
import { test } from "node:test";
import { spacerHeight, blocksFromAi, fieldTarget, youtubeId, createBlock, createSection, emailFieldError, pageWarnings, parseBlocks, safeButtonHref, starterBlocks, validateAnswers } from "./blocks.ts";

test("starter page has one form and parses", () => {
  const parsed = parseBlocks(starterBlocks());
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.blocks.filter((block) => block.type === "form").length, 1);
});

test("a page cannot have two forms", () => {
  const first = createBlock("form");
  const second = createBlock("form");
  const parsed = parseBlocks([first, second]);
  assert.equal(parsed.ok, false);
});

test("answers are checked against the form", () => {
  const form = createBlock("form");
  assert.ok(form && form.type === "form");
  if (!form || form.type !== "form") return;
  const missing = validateAnswers(form, []);
  assert.equal(missing.ok, false);
  const name = form.steps[0].fields[0];
  const email = form.steps[0].fields[1];
  const ok = validateAnswers(form, [
    { fieldId: `${name.id}:first`, value: "Ada" },
    { fieldId: `${name.id}:last`, value: "Lovelace" },
    { fieldId: email.id, value: "a@b.co" },
  ]);
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.answers[2].value, "a@b.co");
});

test("an email field only accepts a business address", () => {
  assert.equal(emailFieldError("ada@company.com"), "");
  assert.equal(emailFieldError("test@company.com").includes("test"), true);
  assert.equal(emailFieldError("ada@gmail.com").includes("public"), true);
  const form = createBlock("form");
  assert.ok(form && form.type === "form");
  if (!form || form.type !== "form") return;
  const email = form.steps[0].fields[1];
  const blocked = validateAnswers(form, [{ fieldId: email.id, value: "test@company.com" }]);
  assert.equal(blocked.ok, false);
  if (!blocked.ok) assert.ok(blocked.fieldErrors[email.id].includes("test"));
});

test("a hero can show a pdf and a form warns when HubSpot has no name", () => {
  const hero = createSection("hero");
  const parsed = parseBlocks([{ ...hero, heroMedia: "pdf", pdfAssetId: "" }]);
  assert.equal(parsed.ok, true);
  if (!parsed.ok || parsed.blocks[0].type !== "section") return;
  assert.equal(parsed.blocks[0].heroMedia, "pdf");
  const form = createBlock("form");
  assert.ok(form && form.type === "form");
  if (!form || form.type !== "form") return;
  assert.ok(pageWarnings([form]).some((warning) => warning.includes("HubSpot")));
});

test("a hero button keeps one label and one link", () => {
  const hero = createSection("hero");
  assert.equal(hero.buttonLabel, "Book a demo");
  assert.equal(hero.buttonHref, "/book");
  assert.equal(safeButtonHref("javascript:alert(1)"), "");
  assert.equal(safeButtonHref("https://noah.support/book"), "https://noah.support/book");
  const parsed = parseBlocks([{ ...hero, buttonLabel: "Talk to us", buttonHref: "/contact" }]);
  assert.equal(parsed.ok, true);
  if (!parsed.ok || parsed.blocks[0].type !== "section") return;
  assert.equal(parsed.blocks[0].buttonLabel, "Talk to us");
  assert.equal(parsed.blocks[0].buttonHref, "/contact");
});

test("a section template keeps its style slots and parses", () => {
  const section = createSection("feature");
  const parsed = parseBlocks([section]);
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.blocks[0].type, "section");
  if (parsed.blocks[0].type !== "section") return;
  assert.equal(parsed.blocks[0].template, "feature");
  assert.equal(parsed.blocks[0].title, section.title);
});

test("AI blocks get fresh ids and drop images", () => {
  const parsed = blocksFromAi({
    blocks: [
      { type: "heading", level: 2, text: "Hello" },
      { type: "image", assetId: "nope", alt: "x" },
      { type: "text", text: "Body" },
    ],
  });
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(
    parsed.blocks.map((block) => block.type),
    ["heading", "text"]
  );
  assert.ok(parsed.blocks.every((block) => block.id.length > 10));
});

test("fields pick a webhook key from type and label", () => {
  const base = { mapTo: "" };
  assert.equal(fieldTarget({ ...base, type: "text", label: "First Name" }), "name");
  assert.equal(fieldTarget({ ...base, type: "text", label: "Last Name" }), "name");
  assert.equal(fieldTarget({ ...base, type: "text", label: "Business email" }), "email");
  assert.equal(fieldTarget({ ...base, type: "email", label: "Where can we reach you" }), "email");
  assert.equal(fieldTarget({ ...base, type: "text", label: "Company" }), "company_name");
  assert.equal(fieldTarget({ ...base, type: "text", label: "Budget" }), "other");
  assert.equal(fieldTarget({ type: "text", label: "Budget", mapTo: "message" }), "message");
});

test("a split name field stores first and last name", () => {
  const form = createBlock("form");
  const name = form.steps[0].fields[0];
  const email = form.steps[0].fields[1];
  assert.equal(name.split, true);
  const missing = validateAnswers(form, [{ fieldId: `${name.id}:first`, value: "Jane" }]);
  assert.equal(missing.ok, false);
  const result = validateAnswers(form, [
    { fieldId: `${name.id}:first`, value: "Jane" },
    { fieldId: `${name.id}:last`, value: "Doe" },
    { fieldId: email.id, value: "jane@acme.com" },
  ]);
  assert.equal(result.ok, true);
  if (!result.ok) return;
  assert.deepEqual(
    result.answers.map((answer) => [answer.key, answer.value]),
    [["name", "Jane"], ["name", "Doe"], ["email", "jane@acme.com"]]
  );
});

test("youtube links become an id", () => {
  assert.equal(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("https://youtu.be/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ"), "dQw4w9WgXcQ");
  assert.equal(youtubeId("https://evil.com/watch?v=dQw4w9WgXcQ"), "");
});

test("a spacer keeps a height between 8 and 600", () => {
  const spacer = createBlock("spacer");
  const parsed = parseBlocks([{ ...spacer, height: 5000 }]);
  assert.equal(parsed.ok, true);
  if (parsed.ok) assert.equal(parsed.blocks[0].height, 600);
  assert.equal(spacerHeight("abc"), 64);
  assert.equal(spacerHeight(2), 8);
});

test("a form sends to the webhook unless told not to", () => {
  const form = createBlock("form");
  assert.equal(form.skipWebhook, false);
  const parsed = parseBlocks([{ ...form, skipWebhook: true }]);
  assert.equal(parsed.ok, true);
  if (parsed.ok) assert.equal(parsed.blocks[0].skipWebhook, true);
  const warnings = pageWarnings([{ ...form, formName: "", targetPageId: "x", skipWebhook: true }]);
  assert.equal(warnings.some((warning) => warning.includes("HubSpot")), false);
});
