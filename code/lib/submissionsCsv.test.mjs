import assert from "node:assert/strict";
import { test } from "node:test";
import { csvCell, csvFilename, submissionsCsv } from "./submissionsCsv.ts";

test("csv has one column per label across all submissions", () => {
  const csv = submissionsCsv([
    {
      createdAt: new Date("2026-11-01T10:00:00Z"),
      flowName: "Spring",
      pageTitle: "Start",
      answers: [
        { label: "First name", value: "Jane" },
        { label: "Email", value: "jane@acme.com" },
      ],
    },
    {
      createdAt: new Date("2026-11-02T10:00:00Z"),
      flowName: "Summer",
      pageTitle: "Start",
      answers: [{ label: "Company", value: 'Acme "Inc"' }],
    },
  ]);
  const lines = csv.replace(/^﻿/, "").trim().split("\r\n");
  assert.equal(lines[0], '"Submitted at","Flow","Page","First name","Email","Company"');
  assert.equal(lines[1], '"2026-11-01T10:00:00.000Z","Spring","Start","Jane","jane@acme.com",""');
  assert.equal(lines[2], '"2026-11-02T10:00:00.000Z","Summer","Start","","","Acme ""Inc"""');
});

test("cells that look like formulas are escaped", () => {
  assert.equal(csvCell("=HYPERLINK()"), `"'=HYPERLINK()"`);
  assert.equal(csvCell("+32 470"), `"'+32 470"`);
  assert.equal(csvCell("plain"), '"plain"');
});

test("filename names the flow or all", () => {
  const day = new Date("2026-11-03T00:00:00Z");
  assert.equal(csvFilename("spring", day), "submissions-spring-2026-11-03.csv");
  assert.equal(csvFilename("", day), "submissions-all-2026-11-03.csv");
});
