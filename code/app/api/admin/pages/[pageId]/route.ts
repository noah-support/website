import { isAdmin } from "@/lib/adminAuth";
import { parseBlocks } from "@/lib/blocks";
import { savePage } from "@/lib/flows";

export const runtime = "nodejs";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pageId: string }> }
) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Sign in again." }, { status: 401 });
  }
  const { pageId } = await params;
  let body: { title?: unknown; blocks?: unknown };
  try {
    body = (await request.json()) as { title?: unknown; blocks?: unknown };
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const parsed = parseBlocks(body.blocks);
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });
  const saved = await savePage(pageId, String(body.title ?? ""), parsed.blocks);
  if (!saved.ok) return Response.json({ error: saved.error }, { status: 400 });
  return Response.json({ ok: true, blocks: parsed.blocks });
}
