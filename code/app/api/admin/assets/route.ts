import { isAdmin } from "@/lib/adminAuth";
import { getPrisma } from "@/lib/db";
import { randomBytes } from "node:crypto";
import { putAsset } from "@/lib/storage";

export const runtime = "nodejs";

// Videos go through /api/admin/assets/uploads in parts.
const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);

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
    return Response.json({ error: "Use a JPEG, PNG, WebP, GIF, or PDF." }, { status: 400 });
  }
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return Response.json({ error: "Files need to be under 15 MB." }, { status: 400 });
  }

  const filename = file.name.replace(/[^\w.\- ]+/g, "").slice(0, 120) || "file";
  const asset = await prisma.asset.create({
    data: { key: `pending:${randomBytes(12).toString("hex")}`, mime: file.type, filename },
  });
  const key = `assets/${asset.id}`;
  try {
    await putAsset(key, Buffer.from(await file.arrayBuffer()), file.type);
    await prisma.asset.update({ where: { id: asset.id }, data: { key } });
  } catch (error) {
    console.error("[assets]", error);
    await prisma.asset.delete({ where: { id: asset.id } }).catch(() => undefined);
    return Response.json({ error: "File storage is not configured." }, { status: 500 });
  }
  return Response.json({ id: asset.id, filename, mime: file.type });
}
