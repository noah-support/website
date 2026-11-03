import { isAdmin } from "@/lib/adminAuth";
import { getPrisma } from "@/lib/db";
import { putAsset } from "@/lib/storage";

export const runtime = "nodejs";

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_VIDEO_BYTES = 300 * 1024 * 1024;
const VIDEO = new Set(["video/mp4", "video/webm"]);
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf", ...VIDEO]);

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Sign in again." }, { status: 401 });
  }
  const prisma = getPrisma();
  if (!prisma) return Response.json({ error: "Database is not configured." }, { status: 500 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Upload a file." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Upload a file." }, { status: 400 });
  if (!ALLOWED.has(file.type)) {
    return Response.json({ error: "Use a JPEG, PNG, WebP, GIF, PDF, MP4, or WebM." }, { status: 400 });
  }
  const video = VIDEO.has(file.type);
  if (file.size <= 0 || file.size > (video ? MAX_VIDEO_BYTES : MAX_BYTES)) {
    return Response.json({ error: video ? "Videos need to be under 300 MB." : "Files need to be under 15 MB." }, { status: 400 });
  }

  const filename = file.name.replace(/[^\w.\- ]+/g, "").slice(0, 120) || "file";
  const asset = await prisma.asset.create({
    data: { key: "pending", mime: file.type, filename },
  });
  const key = `assets/${asset.id}`;
  try {
    await putAsset(key, file);
    await prisma.asset.update({ where: { id: asset.id }, data: { key } });
  } catch (error) {
    console.error("[assets]", error);
    await prisma.asset.delete({ where: { id: asset.id } }).catch(() => undefined);
    return Response.json({ error: "File storage is not configured." }, { status: 500 });
  }
  return Response.json({ id: asset.id, filename, mime: file.type });
}
