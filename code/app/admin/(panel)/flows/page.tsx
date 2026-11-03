import Link from "next/link";
import DeleteFlow from "@/components/admin/DeleteFlow";
import { createFlowAction, duplicateFlowAction, setTshirtsAction } from "@/lib/adminActions";
import { listFlows } from "@/lib/flows";
import { tshirtsFlowId } from "@/lib/settings";

export const metadata = { title: "Flows" };

export default async function FlowsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const flows = await listFlows();
  const tshirtsId = flows ? await tshirtsFlowId() : "";
  const tshirts = flows?.find((flow) => flow.id === tshirtsId) ?? null;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-noah-ink">Flows</h1>
          <p className="mt-2 max-w-xl font-body text-sm text-noah-ink-dim">
            A flow is a sequence of pages. A form can open a thank-you page or a page that shows a PDF.
          </p>
        </div>
        <form action={createFlowAction} className="flex gap-2">
          <input name="name" required placeholder="Flow name" className="contact-input w-56" maxLength={80} />
          <button type="submit" className="h-12 rounded-full bg-noah-ink px-4 text-sm text-noah-cream">
            Create
          </button>
        </form>
      </div>
      {flows ? (
        <form action={setTshirtsAction} className="flex max-w-xl flex-col gap-4 rounded-3xl border border-noah-ink-hairline p-5">
          <div>
            <h2 className="font-display text-2xl text-noah-ink">/shirts</h2>
            <p className="mt-2 font-body text-sm text-noah-ink-dim">
              People who open /shirts are sent to the flow you choose. A draft does not open until you publish it.
            </p>
          </div>
          <label className="flex flex-col gap-2 text-sm">
            Send them to
            <select name="flowId" defaultValue={tshirts?.id ?? ""} className="contact-input contact-select">
              <option value="">Nowhere</option>
              {flows.map((flow) => (
                <option key={flow.id} value={flow.id}>
                  {flow.name}
                  {flow.published ? "" : " (draft)"}
                </option>
              ))}
            </select>
          </label>
          {tshirts?.published ? (
            <p className="font-body text-sm text-noah-ink-dim">/shirts opens /f/{tshirts.slug}.</p>
          ) : tshirts ? (
            <p className="font-body text-sm text-noah-orange">Publish {tshirts.name} for /shirts to open it.</p>
          ) : (
            <p className="font-body text-sm text-noah-ink-dim">/shirts does not open a flow yet.</p>
          )}
          <button type="submit" className="h-10 w-fit rounded-full border border-noah-ink px-4 text-sm">
            Save
          </button>
        </form>
      ) : null}
      {error === "database" ? (
        <p className="font-body text-sm text-noah-orange">Set DATABASE_URL before creating a flow.</p>
      ) : error ? (
        <p className="font-body text-sm text-noah-orange">{error}</p>
      ) : null}
      {flows === null ? (
        <p className="font-body text-sm text-noah-ink">Set DATABASE_URL to store flows.</p>
      ) : flows.length === 0 ? (
        <p className="font-body text-sm text-noah-ink-dim">No flows yet.</p>
      ) : (
        <ul className="flex flex-col">
          {flows.map((flow) => (
            <li key={flow.id} className="flex flex-wrap items-center justify-between gap-4 border-t border-noah-ink-hairline py-4">
              <div>
                <p className="font-display text-2xl text-noah-ink">{flow.name}</p>
                <p className="font-body text-sm text-noah-ink-dim">
                  /f/{flow.slug} · {flow._count.pages} pages · {flow._count.submissions} submissions
                  {" · "}
                  {flow.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-4">
                <DeleteFlow id={flow.id} name={flow.name} />
                <form action={duplicateFlowAction}>
                  <input type="hidden" name="id" value={flow.id} />
                  <button type="submit" className="h-10 rounded-full border border-noah-ink-hairline px-4 text-sm">
                    Duplicate
                  </button>
                </form>
                <Link
                  href={`/admin/flows/${flow.id}`}
                  className="inline-flex h-10 items-center rounded-full bg-noah-ink px-4 text-sm text-noah-cream"
                >
                  Open
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
