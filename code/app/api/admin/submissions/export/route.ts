import { isAdmin } from "@/lib/adminAuth";
import { getPrisma } from "@/lib/db";
import { csvFilename, submissionsCsv } from "@/lib/submissionsCsv";

export const runtime = "nodejs";

// GET ?flow=<id> exports that flow. Without it, every submission.
export async function GET(request: Request) {
  if (!(await isAdmin())) return new Response("Sign in again.", { status: 401 });
  const prisma = getPrisma();
  if (!prisma) return new Response("Database is not configured.", { status: 500 });

  const flowId = new URL(request.url).searchParams.get("flow")?.trim() ?? "";
  let flowSlug = "";
  if (flowId) {
    const flow = await prisma.flow.findUnique({ where: { id: flowId }, select: { slug: true } });
    if (!flow) return new Response("That flow no longer exists.", { status: 404 });
    flowSlug = flow.slug;
  }

  const submissions = await prisma.submission.findMany({
    where: flowId ? { flowId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { flow: { select: { name: true } }, page: { select: { title: true } } },
  });

  const csv = submissionsCsv(
    submissions.map((item) => ({
      createdAt: item.createdAt,
      flowName: item.flow.name,
      pageTitle: item.page.title,
      answers: item.answers,
    }))
  );
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${csvFilename(flowSlug)}"`,
      "Cache-Control": "no-store",
    },
  });
}
