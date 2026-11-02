import { hasFlowAccess } from "@/lib/flowAccess";
import { getPublishedFlow } from "@/lib/flows";

export async function loadFlowPage(flowSlug: string, pageSlug?: string) {
  const flow = await getPublishedFlow(flowSlug);
  if (!flow) return null;
  const page = pageSlug ? flow.pages.find((item) => item.slug === pageSlug) : flow.pages[0];
  if (!page) return null;
  const entry = flow.pages[0];
  const locked = page.id !== entry?.id && !(await hasFlowAccess(flow.slug));
  return { flow, page, locked };
}
