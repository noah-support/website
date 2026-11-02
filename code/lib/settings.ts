import { getPrisma } from "@/lib/db";

const TSHIRTS = "tshirts_flow";

export async function tshirtsFlowId() {
  const prisma = getPrisma();
  if (!prisma) return "";
  const row = await prisma.setting.findUnique({ where: { key: TSHIRTS } });
  return row?.value ?? "";
}

export async function setTshirtsFlow(flowId: string) {
  const prisma = getPrisma();
  if (!prisma) return { ok: false as const, error: "Database is not configured." };
  if (!flowId) {
    await prisma.setting.deleteMany({ where: { key: TSHIRTS } });
    return { ok: true as const };
  }
  const flow = await prisma.flow.findUnique({ where: { id: flowId }, select: { id: true } });
  if (!flow) return { ok: false as const, error: "Choose a flow that still exists." };
  await prisma.setting.upsert({
    where: { key: TSHIRTS },
    create: { key: TSHIRTS, value: flow.id },
    update: { value: flow.id },
  });
  return { ok: true as const };
}

export async function clearTshirtsFlow(flowId: string) {
  const prisma = getPrisma();
  if (!prisma) return;
  await prisma.setting.deleteMany({ where: { key: TSHIRTS, value: flowId } });
}

export async function tshirtsDestination() {
  const prisma = getPrisma();
  if (!prisma) return null;
  const row = await prisma.setting.findUnique({ where: { key: TSHIRTS } });
  if (!row?.value) return null;
  const flow = await prisma.flow.findUnique({
    where: { id: row.value },
    select: { slug: true, published: true },
  });
  if (!flow?.published) return null;
  return `/f/${flow.slug}`;
}
