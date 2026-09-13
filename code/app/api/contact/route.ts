import {
  parseContactPayload,
  validateContactPayload,
} from "@/lib/contact";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { sendContactEmail } from "@/lib/sendContactEmail";

export async function POST(request: Request) {
  let raw: unknown;

  try {
    raw = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const payload = parseContactPayload(raw);

  if (payload.website) {
    return Response.json({ ok: true });
  }

  const fieldErrors = validateContactPayload(payload);
  if (Object.keys(fieldErrors).length > 0) {
    return Response.json({ fieldErrors }, { status: 400 });
  }

  const captcha = await verifyRecaptchaToken(payload.recaptchaToken, "contact");
  if (!captcha.ok) {
    return Response.json({ error: captcha.error }, { status: 400 });
  }

  const emailed = await sendContactEmail(payload);
  if (!emailed.ok) {
    return Response.json(
      { error: "We could not send that just now. Try again." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
