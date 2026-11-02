import { isAdmin } from "@/lib/adminAuth";
import { generateBlocks } from "@/lib/aiBlocks";
import { formBlock, parseBlocks, type Block } from "@/lib/blocks";
import { getPrisma } from "@/lib/db";
import { savePage } from "@/lib/flows";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Sign in again." }, { status: 401 });
  }
  let body: { pageId?: unknown; title?: unknown; prompt?: unknown; blocks?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }
  const pageId = String(body.pageId ?? "");
  const prompt = String(body.prompt ?? "").trim().slice(0, 2000);
  if (!pageId || !prompt) return Response.json({ error: "Describe the section you want." }, { status: 400 });

  const current = parseBlocks(body.blocks);
  if (!current.ok) return Response.json({ error: current.error }, { status: 400 });

  const prisma = getPrisma();
  if (!prisma) return Response.json({ error: "Database is not configured." }, { status: 500 });
  const page = await prisma.page.findUnique({
    where: { id: pageId },
    include: { flow: { include: { pages: true } } },
  });
  if (!page) return Response.json({ error: "That page no longer exists." }, { status: 404 });

  const generated = await generateBlocks(
    prompt,
    page.flow.pages.map((item) => item.title)
  );
  if (!generated.ok) return Response.json({ error: generated.error }, { status: 502 });

  let notice = "";
  let additions: Block[] = generated.blocks;
  if (formBlock(current.blocks) && formBlock(additions)) {
    additions = additions.filter((block) => block.type !== "form");
    notice = "This page already has a form, so the new form was left out.";
  }
  if (additions.length === 0) {
    return Response.json({ error: "Nothing new could be added to this page." }, { status: 400 });
  }

  const blocks = [...current.blocks, ...additions];
  const saved = await savePage(pageId, String(body.title ?? page.title), blocks);
  if (!saved.ok) return Response.json({ error: saved.error }, { status: 400 });
  return Response.json({ blocks, notice });
}
