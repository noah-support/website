import { assetIsPublic } from "@/lib/assetAccess";
import { getPrisma } from "@/lib/db";
import { readAsset } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> }
) {
  const { assetId } = await params;
  if (!/^[a-z0-9]{8,40}$/i.test(assetId)) {
    return new Response("Not found", { status: 404 });
  }
  const prisma = getPrisma();
  if (!prisma) return new Response("Not found", { status: 404 });
  const asset = await prisma.asset.findUnique({ where: { id: assetId } });
  if (!asset || asset.key === "pending") return new Response("Not found", { status: 404 });
  if (!(await assetIsPublic(assetId))) return new Response("Not found", { status: 404 });

  try {
    const bytes = await readAsset(asset.key);
    if (!bytes) return new Response("Not found", { status: 404 });
    const filename = asset.filename.replace(/["\r\n]/g, "") || "file";
    return new Response(new Uint8Array(bytes), {
      headers: {
        "Content-Type": asset.mime,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[assets]", error);
    return new Response("Not found", { status: 404 });
  }
}
