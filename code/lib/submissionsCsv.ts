// Builds a CSV of form submissions. One row per submission, one column per question label.

export type CsvSubmission = {
  createdAt: Date;
  flowName: string;
  pageTitle: string;
  answers: unknown;
};

function answerPairs(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const record = item as { label?: unknown; value?: unknown };
    const label = String(record.label ?? "").trim();
    if (!label) return [];
    return [{ label, value: String(record.value ?? "") }];
  });
}

// Quotes every cell. A leading = + - @ is escaped so spreadsheets do not run it as a formula.
export function csvCell(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function submissionsCsv(submissions: CsvSubmission[]) {
  const labels: string[] = [];
  const rows = submissions.map((submission) => {
    const answers = new Map<string, string>();
    for (const pair of answerPairs(submission.answers)) {
      if (!labels.includes(pair.label)) labels.push(pair.label);
      const previous = answers.get(pair.label);
      answers.set(pair.label, previous ? `${previous}; ${pair.value}` : pair.value);
    }
    return { submission, answers };
  });

  const header = ["Submitted at", "Flow", "Page", ...labels];
  const lines = [header.map(csvCell).join(",")];
  for (const { submission, answers } of rows) {
    const cells = [
      submission.createdAt.toISOString(),
      submission.flowName,
      submission.pageTitle,
      ...labels.map((label) => answers.get(label) ?? ""),
    ];
    lines.push(cells.map(csvCell).join(","));
  }
  // The byte order mark makes Excel read the file as UTF-8.
  return `﻿${lines.join("\r\n")}\r\n`;
}

export function csvFilename(flowSlug: string, now = new Date()) {
  const day = now.toISOString().slice(0, 10);
  return `submissions-${flowSlug || "all"}-${day}.csv`;
}
