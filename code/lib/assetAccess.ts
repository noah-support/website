import { isAdmin } from "@/lib/adminAuth";
import { hasFlowAccess } from "@/lib/flowAccess";
import { pagesUsingAsset } from "@/lib/flows";

export async function assetIsPublic(assetId: string) {
  if (await isAdmin()) return true;
  const uses = await pagesUsingAsset(assetId);
  for (const use of uses) {
    if (use.published && use.isEntry) return true;
    if (use.published && (await hasFlowAccess(use.flowSlug))) return true;
  }
  return false;
}
