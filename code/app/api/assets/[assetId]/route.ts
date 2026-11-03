import { assetIsPublic } from "@/lib/assetAccess";
import { getPrisma } from "@/lib/db";
import { assetSize, streamAsset } from "@/lib/storage";

export const runtime = "nodejs";

// Video players ask for byte ranges; Safari will not play without them.
function byteRange(header: string | null, size: number) {
  const match = header?.match(/^bytes=(\d*)-(\d*)$/);
  if (!match || (!match[1] && !match[2])) return null;
  let start: number;
  let end: number;
  if (!match[1]) {
    start = Math.max(0, size - Number(match[2]));
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
  }
  if (start > end || start >= size) return "invalid" as const;
  return { start, end };
}

export async function GET(
  request: Request,
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
    const size = await assetSize(asset.key);
    if (size === null) return new Response("Not found", { status: 404 });
    const filename = asset.filename.replace(/["\r\n]/g, "") || "file";
    const headers = {
      "Content-Type": asset.mime,
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "Accept-Ranges": "bytes",
    };
    const range = byteRange(request.headers.get("range"), size);
    if (range === "invalid") {
      return new Response(null, { status: 416, headers: { ...headers, "Content-Range": `bytes */${size}` } });
    }
    const body = await streamAsset(asset.key, range ?? undefined);
    if (!body) return new Response("Not found", { status: 404 });
    if (range) {
      return new Response(body, {
        status: 206,
        headers: {
          ...headers,
          "Content-Range": `bytes ${range.start}-${range.end}/${size}`,
          "Content-Length": String(range.end - range.start + 1),
        },
      });
    }
    return new Response(body, { headers: { ...headers, "Content-Length": String(size) } });
  } catch (error) {
    console.error("[assets]", error);
    return new Response("Not found", { status: 404 });
  }
}
