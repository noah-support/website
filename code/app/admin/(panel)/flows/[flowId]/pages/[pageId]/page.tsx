import { notFound } from "next/navigation";
import PageBuilder from "@/components/builder/PageBuilder";
import { parseBlocks } from "@/lib/blocks";
import { getFlow } from "@/lib/flows";

export const metadata = { title: "Edit page" };

export default async function PageEditor({
  params,
}: {
  params: Promise<{ flowId: string; pageId: string }>;
}) {
  const { flowId, pageId } = await params;
  const flow = await getFlow(flowId);
  const page = flow?.pages.find((item) => item.id === pageId);
  if (!flow || !page) notFound();
  const parsed = parseBlocks(page.blocks);
  const entry = flow.pages[0];

  return (
    <PageBuilder
      flowId={flow.id}
      pageId={page.id}
      flowSlug={flow.slug}
      pageSlug={page.slug}
      isEntry={page.id === entry?.id}
      published={flow.published}
      initialTitle={page.title}
      initialBlocks={parsed.ok ? parsed.blocks : []}
      pages={flow.pages.map((item) => ({ id: item.id, slug: item.slug, title: item.title }))}
    />
  );
}
