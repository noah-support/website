import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FlowPageView from "@/components/landing/FlowPageView";
import { loadFlowPage } from "@/lib/publicFlow";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ flowSlug: string; pageSlug: string }>;
}): Promise<Metadata> {
  const { flowSlug, pageSlug } = await params;
  const found = await loadFlowPage(flowSlug, pageSlug);
  return {
    title: found ? `${found.page.title} — Noah` : "Noah",
    robots: { index: false, follow: false },
  };
}

export default async function FlowLaterPage({
  params,
}: {
  params: Promise<{ flowSlug: string; pageSlug: string }>;
}) {
  const { flowSlug, pageSlug } = await params;
  const found = await loadFlowPage(flowSlug, pageSlug);
  if (!found) notFound();
  return (
    <FlowPageView
      flowSlug={found.flow.slug}
      page={found.page}
      pages={found.flow.pages}
      locked={found.locked}
    />
  );
}
