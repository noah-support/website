import FlowSelect from "@/components/admin/FlowSelect";
import { listFlows, listSubmissions } from "@/lib/flows";

export const metadata = { title: "Submissions" };

function answersOf(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (typeof item !== "object" || item === null) return [];
    const record = item as { label?: unknown; value?: unknown };
    const label = String(record.label ?? "");
    const answer = String(record.value ?? "");
    if (!label || !answer) return [];
    return [{ label, answer }];
  });
}

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ flow?: string }>;
}) {
  const { flow } = await searchParams;
  const flows = await listFlows();
  const submissions = await listSubmissions(flow);

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl text-noah-ink">Submissions</h1>
        {flows && flows.length > 0 ? <FlowSelect flows={flows.map((item) => ({ id: item.id, name: item.name }))} value={flow ?? ""} /> : null}
      </div>
      {submissions === null ? (
        <p className="font-body text-sm">Set DATABASE_URL to store submissions.</p>
      ) : submissions.length === 0 ? (
        <p className="font-body text-sm text-noah-ink-dim">No submissions yet.</p>
      ) : (
        <ul className="flex flex-col">
          {submissions.map((submission) => (
            <li key={submission.id} className="border-t border-noah-ink-hairline py-4">
              <p className="font-body text-sm text-noah-ink-dim">
                {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(submission.createdAt)}
                {" · "}
                {submission.flow.name}
                {" · "}
                {submission.page.title}
              </p>
              <dl className="mt-2 grid gap-1">
                {answersOf(submission.answers).map((answer) => (
                  <div key={answer.label} className="grid gap-1 sm:grid-cols-[10rem_1fr]">
                    <dt className="text-sm text-noah-ink-dim">{answer.label}</dt>
                    <dd className="text-sm whitespace-pre-wrap">{answer.answer}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
