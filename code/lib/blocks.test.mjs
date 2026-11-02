import assert from "node:assert/strict";
import { test } from "node:test";
import { blocksFromAi, createBlock, createSection, emailFieldError, pageWarnings, parseBlocks, safeButtonHref, starterBlocks, validateAnswers } from "./blocks.ts";

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
  const email = form.steps[0].fields[0];
  const ok = validateAnswers(form, [{ fieldId: email.id, value: "a@b.co" }]);
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.answers[0].value, "a@b.co");
});

test("an email field only accepts a business address", () => {
  assert.equal(emailFieldError("ada@company.com"), "");
  assert.equal(emailFieldError("test@company.com").includes("test"), true);
  assert.equal(emailFieldError("ada@gmail.com").includes("public"), true);
  const form = createBlock("form");
  assert.ok(form && form.type === "form");
  if (!form || form.type !== "form") return;
  const email = form.steps[0].fields[0];
  const blocked = validateAnswers(form, [{ fieldId: email.id, value: "test@company.com" }]);
  assert.equal(blocked.ok, false);
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
