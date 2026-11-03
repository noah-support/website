import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteFlow from "@/components/admin/DeleteFlow";
import FlowDetails from "@/components/admin/FlowDetails";
import {
  addPageAction,
  deletePageAction,
  duplicateFlowAction,
  movePageAction,
  publishFlowAction,
  setFormTargetAction,
} from "@/lib/adminActions";
import { formBlock, pageWarnings, type Block } from "@/lib/blocks";
import { getFlow, readBlocks } from "@/lib/flows";

export const metadata = { title: "Flow" };

export default async function FlowEditorPage({
  params,
  searchParams,
}: {
  params: Promise<{ flowId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { flowId } = await params;
  const { error } = await searchParams;
  const flow = await getFlow(flowId);
  if (!flow) notFound();

  const pages = flow.pages.map((page) => ({ ...page, blocks: readBlocks(page.blocks) }));
  const warnings = [
    ...(flow.published ? [] : ["This flow is a draft. Visitors cannot open it until you publish."]),
    ...pages.flatMap((page) => pageWarnings(page.blocks).map((warning) => `${page.title}: ${warning}`)),
  ];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-5 py-10">
      <Link href="/admin/flows" className="w-fit font-body text-sm text-noah-ink-dim hover:text-noah-ink">
        ← Back to flows
      </Link>
      <FlowDetails id={flow.id} name={flow.name} slug={flow.slug} published={flow.published} error={error} />

      {warnings.length ? (
        <ul className="flex flex-col gap-1 rounded-2xl border border-noah-orange/40 bg-noah-orange/10 px-4 py-3">
          {warnings.map((warning) => (
            <li key={warning} className="font-body text-sm text-noah-ink">
              {warning}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <form action={publishFlowAction}>
          <input type="hidden" name="id" value={flow.id} />
          <input type="hidden" name="published" value={flow.published ? "false" : "true"} />
          <button type="submit" className="h-12 rounded-full bg-noah-ink px-5 text-sm text-noah-cream">
            {flow.published ? "Unpublish" : "Publish"}
          </button>
        </form>
        <form action={duplicateFlowAction}>
          <input type="hidden" name="id" value={flow.id} />
          <button type="submit" className="h-12 rounded-full border border-noah-ink-hairline px-5 text-sm">
            Duplicate flow
          </button>
        </form>
      </div>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="font-display text-3xl text-noah-ink">Path</h2>
          <p className="mt-2 max-w-xl font-body text-sm text-noah-ink-dim">
            Pages stay in this order. An arrow is the moment a visitor moves: after they submit the form, or when they use a button.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AddButton flowId={flow.id} kind="blank" label="Add page" />
          <AddButton flowId={flow.id} kind="thanks" label="Add thank-you page" />
          <AddButton flowId={flow.id} kind="pdf" label="Add PDF page" />
        </div>
        <ol className="flex flex-col">
          {pages.map((page, index) => (
            <FlowNode
              key={page.id}
              flowId={flow.id}
              page={page}
              index={index}
              pages={pages}
              canDelete={pages.length > 1}
              last={index === pages.length - 1}
            />
          ))}
        </ol>
      </section>

      <section className="rounded-3xl border border-noah-ink-hairline p-5">
        <h2 className="font-display text-2xl">Delete this flow</h2>
        <div className="mt-3">
          <DeleteFlow id={flow.id} name={flow.name} from="editor" />
        </div>
      </section>
    </main>
  );
}

function buttonEdges(blocks: Block[], pages: { id: string; title: string }[]) {
  return blocks.flatMap((block) => {
    if (block.type !== "button" || !block.targetPageId) return [];
    const target = pages.find((page) => page.id === block.targetPageId);
    if (!target) return [];
    return [{ id: block.id, label: block.label || "Button", title: target.title }];
  });
}

function FlowNode({
  flowId,
  page,
  index,
  pages,
  canDelete,
  last,
}: {
  flowId: string;
  page: { id: string; title: string; blocks: Block[] };
  index: number;
  pages: { id: string; title: string }[];
  canDelete: boolean;
  last: boolean;
}) {
  const form = formBlock(page.blocks);
  const buttons = buttonEdges(page.blocks, pages);
  const others = pages.filter((item) => item.id !== page.id);

  return (
    <li className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4">
      <div className="flex flex-col items-center">
        <span className="mt-6 h-3 w-3 shrink-0 rounded-full bg-noah-orange" />
        {last ? null : <span className="w-px flex-1 bg-noah-ink-hairline" />}
      </div>
      <div className="pb-8">
        <article className="rounded-3xl border border-noah-ink-hairline p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-body text-xs text-noah-ink-dim">{index === 0 ? "Opens first" : `Page ${index + 1}`}</p>
              <h3 className="font-display text-2xl">{page.title}</h3>
            </div>
            <Link
              href={`/admin/flows/${flowId}/pages/${page.id}`}
              className="inline-flex h-10 items-center rounded-full bg-noah-ink px-4 text-sm text-noah-cream"
            >
              Edit
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <MoveButton flowId={flowId} pageId={page.id} direction="up" label="Move up" />
            <MoveButton flowId={flowId} pageId={page.id} direction="down" label="Move down" />
            {canDelete ? (
              <form action={deletePageAction}>
                <input type="hidden" name="flowId" value={flowId} />
                <input type="hidden" name="pageId" value={page.id} />
                <button type="submit" className="text-noah-orange">
                  Delete
                </button>
              </form>
            ) : null}
          </div>
        </article>
        {form ? (
          <form action={setFormTargetAction} className="mt-3 flex flex-wrap items-center gap-3 pl-2 text-sm">
            <input type="hidden" name="flowId" value={flowId} />
            <input type="hidden" name="pageId" value={page.id} />
            <span className="h-px w-8 bg-noah-orange" />
            <span className="text-noah-ink-dim">After the form is submitted</span>
            <span aria-hidden className="text-noah-orange">
              →
            </span>
            <select name="targetPageId" defaultValue={form.targetPageId} className="contact-input contact-select max-w-xs">
              <option value="">Choose a page</option>
              {others.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </select>
            <button type="submit" className="underline underline-offset-2">
              Save
            </button>
          </form>
        ) : null}
        {buttons.map((button) => (
          <p key={button.id} className="mt-3 flex flex-wrap items-center gap-3 pl-2 text-sm">
            <span className="h-px w-8 bg-noah-orange" />
            <span className="text-noah-ink-dim">Button “{button.label}”</span>
            <span aria-hidden className="text-noah-orange">
              →
            </span>
            <span>{button.title}</span>
          </p>
        ))}
      </div>
    </li>
  );
}

function AddButton({ flowId, kind, label }: { flowId: string; kind: string; label: string }) {
  return (
    <form action={addPageAction}>
      <input type="hidden" name="flowId" value={flowId} />
      <input type="hidden" name="kind" value={kind} />
      <button type="submit" className="h-10 rounded-full border border-noah-ink-hairline px-4 text-sm">
        {label}
      </button>
    </form>
  );
}

function MoveButton({
  flowId,
  pageId,
  direction,
  label,
}: {
  flowId: string;
  pageId: string;
  direction: "up" | "down";
  label: string;
}) {
  return (
    <form action={movePageAction}>
      <input type="hidden" name="flowId" value={flowId} />
      <input type="hidden" name="pageId" value={pageId} />
      <input type="hidden" name="direction" value={direction} />
      <button type="submit">{label}</button>
    </form>
  );
}
