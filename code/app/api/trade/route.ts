import { sendTradeEmail } from "@/lib/sendContactEmail";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import {
  parseTradePayload,
  validateTradePayload,
} from "@/lib/trade";

export const runtime = "nodejs";

function mimeFor(file: File) {
  if (file.type) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".pptx")) {
    return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
  }
  if (name.endsWith(".ppt")) return "application/vnd.ms-powerpoint";
  return "application/octet-stream";
}

export async function POST(request: Request) {
  let form: FormData;

  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const payload = parseTradePayload({
    name: form.get("name"),
    email: form.get("email"),
    phone: form.get("phone"),
    company: form.get("company"),
    deckUrl: form.get("deckUrl"),
    note: form.get("note"),
    recaptchaToken: form.get("recaptchaToken"),
    website: form.get("website"),
  });

  if (payload.website) {
    return Response.json({ ok: true });
  }

  const rawFile = form.get("deck");
  const file = rawFile instanceof File && rawFile.size > 0 ? rawFile : null;
  const fieldErrors = validateTradePayload(payload, file);
  if (Object.keys(fieldErrors).length > 0) {
    return Response.json({ fieldErrors }, { status: 400 });
  }

  const captcha = await verifyRecaptchaToken(payload.recaptchaToken, "contact");
  if (!captcha.ok) {
    return Response.json({ error: captcha.error }, { status: 400 });
  }

  let attachment:
    | { content: string; filename: string; type: string }
    | undefined;
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    attachment = {
      content: buffer.toString("base64"),
      filename: file.name.replace(/[/\\]/g, "_").slice(0, 180) || "deck",
      type: mimeFor(file),
    };
  }

  const emailed = await sendTradeEmail(payload, attachment);
  if (!emailed.ok) {
    return Response.json(
      { error: "We could not send that just now. Try again." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
