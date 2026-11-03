import { isAdmin } from "@/lib/adminAuth";
import { getPrisma } from "@/lib/db";
import {
  abortMultipart,
  assetSize,
  completeMultipart,
  deleteObject,
  UPLOAD_PART_BYTES,
  uploadPart,
} from "@/lib/storage";
import { MAX_PARTS, MAX_VIDEO_BYTES, uploadIdFromKey } from "@/lib/videoUpload";

export const runtime = "nodejs";

type Params = { params: Promise<{ assetId: string }> };

async function pendingUpload(params: Params["params"]) {
  if (!(await isAdmin())) return { error: Response.json({ error: "Sign in again." }, { status: 401 }) };
  const prisma = getPrisma();
  if (!prisma) return { error: Response.json({ error: "Database is not configured." }, { status: 500 }) };
  const { assetId } = await params;
  const asset = await prisma.asset.findUnique({ where: { id: assetId } });
  const uploadId = asset ? uploadIdFromKey(asset.key) : "";
  if (!asset || !uploadId) return { error: Response.json({ error: "That upload has ended." }, { status: 404 }) };
  return { prisma, asset, uploadId, key: `assets/${asset.id}` };
}

// PUT ?part=n with the raw bytes of one part.
export async function PUT(request: Request, { params }: Params) {
  const found = await pendingUpload(params);
  if ("error" in found) return found.error;
  const part = Number(new URL(request.url).searchParams.get("part"));
  if (!Number.isInteger(part) || part < 1 || part > MAX_PARTS) {
    return Response.json({ error: "That part is out of range." }, { status: 400 });
  }
  const declared = Number(request.headers.get("content-length") ?? "0");
  if (declared > UPLOAD_PART_BYTES) return Response.json({ error: "That part is too large." }, { status: 413 });
  const body = Buffer.from(await request.arrayBuffer());
  if (body.length === 0 || body.length > UPLOAD_PART_BYTES) {
    return Response.json({ error: "That part is too large." }, { status: 413 });
  }
  try {
    const etag = await uploadPart(found.key, found.uploadId, part, body);
    return Response.json({ etag });
  } catch (error) {
    console.error("[uploads]", error);
    return Response.json({ error: "That part did not upload. Try again." }, { status: 502 });
  }
}

// POST { parts: [{ partNumber, etag }] } finishes the upload.
export async function POST(request: Request, { params }: Params) {
  const found = await pendingUpload(params);
  if ("error" in found) return found.error;
  let raw: { parts?: unknown };
  try {
    raw = (await request.json()) as typeof raw;
  } catch {
    return Response.json({ error: "Upload a file." }, { status: 400 });
  }
  const parts = Array.isArray(raw.parts)
    ? raw.parts.flatMap((item) => {
        const record = item as { partNumber?: unknown; etag?: unknown };
        const partNumber = Number(record?.partNumber);
        const etag = String(record?.etag ?? "");
        return Number.isInteger(partNumber) && partNumber >= 1 && etag ? [{ partNumber, etag }] : [];
      })
    : [];
  if (parts.length === 0 || parts.length > MAX_PARTS) {
    return Response.json({ error: "The upload is incomplete." }, { status: 400 });
  }
  parts.sort((a, b) => a.partNumber - b.partNumber);

  try {
    await completeMultipart(found.key, found.uploadId, parts);
    const size = await assetSize(found.key);
    if (!size || size > MAX_VIDEO_BYTES) {
      await deleteObject(found.key).catch(() => undefined);
      await found.prisma.asset.delete({ where: { id: found.asset.id } });
      return Response.json({ error: "Videos need to be under 300 MB." }, { status: 400 });
    }
    await found.prisma.asset.update({ where: { id: found.asset.id }, data: { key: found.key } });
    return Response.json({ id: found.asset.id, filename: found.asset.filename, mime: found.asset.mime });
  } catch (error) {
    console.error("[uploads]", error);
    return Response.json({ error: "The video could not be saved. Try again." }, { status: 502 });
  }
}

// DELETE cancels the upload and frees the parts already stored.
export async function DELETE(_request: Request, { params }: Params) {
  const found = await pendingUpload(params);
  if ("error" in found) return found.error;
  await abortMultipart(found.key, found.uploadId).catch((error) => console.error("[uploads]", error));
  await found.prisma.asset.delete({ where: { id: found.asset.id } });
  return Response.json({ ok: true });
}
