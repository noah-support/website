import { randomBytes } from "node:crypto";
import type { Prisma } from "@prisma/client";
import {
  assignEmptyFormTarget,
  blankBlocks,
  clearPageTargets,
  isFlowSlug,
  parseBlocks,
  pdfBlocks,
  slugify,
  starterBlocks,
  thankYouBlocks,
  withFormTarget,
  type Block,
} from "@/lib/blocks";
import { getPrisma } from "@/lib/db";
import { clearTshirtsFlow } from "@/lib/settings";

function randomPageSlug() {
  return randomBytes(8).toString("hex");
}

export function readBlocks(value: unknown) {
  const parsed = parseBlocks(value);
  return parsed.ok ? parsed.blocks : [];
}

function jsonBlocks(blocks: Block[]): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(blocks)) as Prisma.InputJsonValue;
}

export async function listFlows() {
  const prisma = getPrisma();
  if (!prisma) return null;
  return prisma.flow.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { pages: true, submissions: true } } },
  });
}

export async function getFlow(id: string) {
  const prisma = getPrisma();
  if (!prisma) return null;
  return prisma.flow.findUnique({
    where: { id },
    include: { pages: { orderBy: { position: "asc" } } },
  });
}

export async function getPublishedFlow(slug: string) {
  const prisma = getPrisma();
  if (!prisma) return null;
  return prisma.flow.findFirst({
    where: { slug, published: true },
    include: { pages: { orderBy: { position: "asc" } } },
  });
}

async function uniqueSlug(name: string, ignoreId?: string) {
  const prisma = getPrisma();
  if (!prisma) return slugify(name);
  const base = slugify(name);
  let slug = base;
  let n = 2;
  while (true) {
    const existing = await prisma.flow.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${n++}`.slice(0, 60);
  }
}

export async function createFlow(name: string) {
  const prisma = getPrisma();
  const trimmed = name.trim().slice(0, 80);
  if (!prisma || !trimmed) return null;
  const slug = await uniqueSlug(trimmed);
  return prisma.flow.create({
    data: {
      name: trimmed,
      slug,
      pages: {
        create: {
          slug: randomPageSlug(),
          title: trimmed,
          position: 0,
          blocks: jsonBlocks(starterBlocks()),
        },
      },
    },
  });
}

// Copies every page as a draft. Buttons and forms point at the copied pages.
export async function duplicateFlow(id: string) {
  const prisma = getPrisma();
  if (!prisma) return null;
  const source = await prisma.flow.findUnique({
    where: { id },
    include: { pages: { orderBy: { position: "asc" } } },
  });
  if (!source) return null;
  const name = `${source.name} (copy)`.slice(0, 80);
  const slug = await uniqueSlug(name);
  return prisma.$transaction(async (tx) => {
    const flow = await tx.flow.create({ data: { name, slug, published: false } });
    const idMap = new Map<string, string>();
    const copies: { id: string; blocks: Block[] }[] = [];
    for (const page of source.pages) {
      const copy = await tx.page.create({
        data: {
          flowId: flow.id,
          slug: randomPageSlug(),
          title: page.title,
          position: page.position,
          blocks: jsonBlocks([]),
        },
      });
      idMap.set(page.id, copy.id);
      copies.push({ id: copy.id, blocks: readBlocks(page.blocks) });
    }
    for (const copy of copies) {
      const blocks = copy.blocks.map((block) =>
        (block.type === "button" || block.type === "form") && block.targetPageId
          ? { ...block, targetPageId: idMap.get(block.targetPageId) ?? "" }
          : block
      );
      await tx.page.update({ where: { id: copy.id }, data: { blocks: jsonBlocks(blocks) } });
    }
    return flow;
  });
}

export async function updateFlow(id: string, name: string, slug: string) {
  const prisma = getPrisma();
  const trimmed = name.trim().slice(0, 80);
  const nextSlug = slugify(slug);
  if (!prisma || !trimmed || !isFlowSlug(nextSlug)) return { ok: false as const, error: "Use a short name and a slug made of letters and numbers." };
  const taken = await prisma.flow.findUnique({ where: { slug: nextSlug } });
  if (taken && taken.id !== id) return { ok: false as const, error: "That address is already used." };
  await prisma.flow.update({ where: { id }, data: { name: trimmed, slug: nextSlug } });
  return { ok: true as const };
}

export async function setPublished(id: string, published: boolean) {
  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.flow.update({ where: { id }, data: { published } });
}

export async function addPage(flowId: string, kind: "blank" | "thanks" | "pdf") {
  const prisma = getPrisma();
  if (!prisma) return null;
  const flow = await prisma.flow.findUnique({
    where: { id: flowId },
    include: { pages: { orderBy: { position: "asc" } } },
  });
  if (!flow) return null;
  const blocks = kind === "thanks" ? thankYouBlocks() : kind === "pdf" ? pdfBlocks() : blankBlocks();
  const title = kind === "thanks" ? "Thank you" : kind === "pdf" ? "Document" : "New page";
  const page = await prisma.page.create({
    data: {
      flowId,
      slug: randomPageSlug(),
      title,
      position: flow.pages.length,
      blocks: jsonBlocks(blocks),
    },
  });

  if (kind !== "blank") {
    for (const existing of flow.pages) {
      const current = readBlocks(existing.blocks);
      const assigned = assignEmptyFormTarget(current, page.id);
      if (!assigned.changed) continue;
      await prisma.page.update({
        where: { id: existing.id },
        data: { blocks: jsonBlocks(assigned.blocks) },
      });
      break;
    }
  }
  return page;
}

export async function movePage(pageId: string, direction: -1 | 1) {
  const prisma = getPrisma();
  if (!prisma) return;
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) return;
  const sibling = await prisma.page.findFirst({
    where: { flowId: page.flowId, position: page.position + direction },
  });
  if (!sibling) return;
  await prisma.$transaction([
    prisma.page.update({ where: { id: page.id }, data: { position: sibling.position } }),
    prisma.page.update({ where: { id: sibling.id }, data: { position: page.position } }),
  ]);
}

export async function deleteFlow(id: string, confirmation: string) {
  const prisma = getPrisma();
  if (!prisma) return { ok: false as const, error: "Database is not configured." };
  const flow = await prisma.flow.findUnique({ where: { id }, select: { id: true, name: true } });
  if (!flow) return { ok: false as const, error: "That flow no longer exists." };
  if (confirmation !== flow.name) {
    return { ok: false as const, error: `Type “${flow.name}” to delete this flow.` };
  }
  await clearTshirtsFlow(flow.id);
  await prisma.flow.delete({ where: { id: flow.id } });
  return { ok: true as const };
}

export async function deletePage(pageId: string) {
  const prisma = getPrisma();
  if (!prisma) return;
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) return;
  const count = await prisma.page.count({ where: { flowId: page.flowId } });
  if (count <= 1) return;
  await prisma.page.delete({ where: { id: pageId } });
  const remaining = await prisma.page.findMany({
    where: { flowId: page.flowId },
    orderBy: { position: "asc" },
  });
  await prisma.$transaction(
    remaining.map((item, index) => {
      const blocks = clearPageTargets(readBlocks(item.blocks), pageId);
      return prisma.page.update({
        where: { id: item.id },
        data: { position: index, blocks: jsonBlocks(blocks) },
      });
    })
  );
}

export async function setFormTarget(pageId: string, targetPageId: string) {
  const prisma = getPrisma();
  if (!prisma) return;
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) return;
  if (targetPageId) {
    const target = await prisma.page.findFirst({ where: { id: targetPageId, flowId: page.flowId } });
    if (!target || target.id === page.id) return;
  }
  const blocks = withFormTarget(readBlocks(page.blocks), targetPageId);
  await prisma.page.update({ where: { id: pageId }, data: { blocks: jsonBlocks(blocks) } });
}

export async function savePage(pageId: string, title: string, blocks: Block[]) {
  const prisma = getPrisma();
  if (!prisma) return { ok: false as const, error: "Database is not configured." };
  const page = await prisma.page.findUnique({ where: { id: pageId } });
  if (!page) return { ok: false as const, error: "That page no longer exists." };
  const trimmed = title.trim().slice(0, 120);
  if (!trimmed) return { ok: false as const, error: "The page needs a title." };
  if (blocks.some((block) => (block.type === "button" || block.type === "form") && block.targetPageId)) {
    const ids = new Set(
      (await prisma.page.findMany({ where: { flowId: page.flowId }, select: { id: true } })).map((item) => item.id)
    );
    for (const block of blocks) {
      if ((block.type === "button" || block.type === "form") && block.targetPageId && !ids.has(block.targetPageId)) {
        return { ok: false as const, error: "Choose a page in this flow." };
      }
      if ((block.type === "button" || block.type === "form") && block.targetPageId === page.id) {
        return { ok: false as const, error: "A block cannot open the page it is on." };
      }
    }
  }
  await prisma.page.update({
    where: { id: pageId },
    data: { title: trimmed, blocks: jsonBlocks(blocks) },
  });
  return { ok: true as const };
}

export async function listSubmissions(flowId?: string) {
  const prisma = getPrisma();
  if (!prisma) return null;
  return prisma.submission.findMany({
    where: flowId ? { flowId } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { flow: { select: { name: true, slug: true } }, page: { select: { title: true } } },
  });
}

export async function pagesUsingAsset(assetId: string) {
  const prisma = getPrisma();
  if (!prisma) return [];
  return prisma.$queryRaw<Array<{ flowSlug: string; published: boolean; isEntry: boolean }>>`
    SELECT f.slug AS "flowSlug",
           f.published AS "published",
           (p.position = (SELECT MIN(p2.position) FROM pages p2 WHERE p2.flow_id = p.flow_id)) AS "isEntry"
    FROM pages p
    JOIN flows f ON f.id = p.flow_id
    WHERE strpos(p.blocks::text, ${assetId}) > 0
  `;
}
