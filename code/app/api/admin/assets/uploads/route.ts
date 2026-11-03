import { randomBytes } from "node:crypto";
import { isAdmin } from "@/lib/adminAuth";
import { getPrisma } from "@/lib/db";
import { startMultipart, UPLOAD_PART_BYTES } from "@/lib/storage";
import { MAX_VIDEO_BYTES, pendingUploadKey, VIDEO_TYPES } from "@/lib/videoUpload";

export const runtime = "nodejs";

// Starts a video upload. The browser then sends the file in parts of UPLOAD_PART_BYTES.
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Sign in again." }, { status: 401 });
  const prisma = getPrisma();
  if (!prisma) return Response.json({ error: "Database is not configured." }, { status: 500 });

  let raw: { filename?: unknown; mime?: unknown; size?: unknown };
  try {
    raw = (await request.json()) as typeof raw;
  } catch {
    return Response.json({ error: "Upload a file." }, { status: 400 });
  }
  const mime = String(raw.mime ?? "");
  const size = Number(raw.size);
  if (!VIDEO_TYPES.has(mime)) return Response.json({ error: "Use an MP4 or WebM video." }, { status: 400 });
  if (!Number.isFinite(size) || size <= 0 || size > MAX_VIDEO_BYTES) {
    return Response.json({ error: "Videos need to be under 300 MB." }, { status: 400 });
  }

  const filename = String(raw.filename ?? "").replace(/[^\w.\- ]+/g, "").slice(0, 120) || "video";
  const asset = await prisma.asset.create({
    data: { key: `pending:${randomBytes(12).toString("hex")}`, mime, filename },
  });
  try {
    const uploadId = await startMultipart(`assets/${asset.id}`, mime);
    await prisma.asset.update({ where: { id: asset.id }, data: { key: pendingUploadKey(uploadId) } });
  } catch (error) {
    console.error("[uploads]", error);
    await prisma.asset.delete({ where: { id: asset.id } }).catch(() => undefined);
    return Response.json({ error: "File storage is not configured." }, { status: 500 });
  }
  return Response.json({ id: asset.id, partSize: UPLOAD_PART_BYTES });
}
