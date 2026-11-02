import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FlowPageView from "@/components/landing/FlowPageView";
import { loadFlowPage } from "@/lib/publicFlow";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ flowSlug: string }>;
}): Promise<Metadata> {
  const { flowSlug } = await params;
  const flow = await loadFlowPage(flowSlug);
  const page = flow?.page;
  return {
    title: page ? `${page.title} — Noah` : "Noah",
    robots: { index: true, follow: true },
  };
}

export default async function FlowEntryPage({
  params,
}: {
  params: Promise<{ flowSlug: string }>;
}) {
  const { flowSlug } = await params;
  const found = await loadFlowPage(flowSlug);
  if (!found) notFound();
  return <FlowPageView flowSlug={found.flow.slug} page={found.page} pages={found.flow.pages} locked={false} />;
}
