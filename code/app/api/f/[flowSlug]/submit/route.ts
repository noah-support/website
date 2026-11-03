import type { Prisma } from "@prisma/client";
import { after } from "next/server";
import { formBlock, validateAnswers } from "@/lib/blocks";
import { getPrisma } from "@/lib/db";
import { grantFlowAccess } from "@/lib/flowAccess";
import { getPublishedFlow, readBlocks } from "@/lib/flows";
import { verifyRecaptchaToken } from "@/lib/recaptcha";
import { submitLandingForm } from "@/lib/submitForm";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ flowSlug: string }> }
) {
  const { flowSlug } = await params;
  let raw: {
    pageId?: unknown;
    website?: unknown;
    recaptchaToken?: unknown;
    utm?: unknown;
    answers?: unknown;
  };
  try {
    raw = (await request.json()) as typeof raw;
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  if (String(raw.website ?? "").trim()) {
    return Response.json({ ok: true, next: `/f/${flowSlug}` });
  }

  const flow = await getPublishedFlow(flowSlug);
  const page = flow?.pages.find((item) => item.id === String(raw.pageId ?? ""));
  if (!flow || !page) return Response.json({ error: "This form is closed." }, { status: 404 });

  const form = formBlock(readBlocks(page.blocks));
  if (!form) return Response.json({ error: "This form is closed." }, { status: 404 });
  const target = flow.pages.find((item) => item.id === form.targetPageId);
  if (!target) return Response.json({ error: "This form is not connected to a next page yet." }, { status: 400 });

  const checked = validateAnswers(form, raw.answers);
  if (!checked.ok) {
    return Response.json({ error: checked.error, fieldErrors: checked.fieldErrors }, { status: 400 });
  }

  const captcha = await verifyRecaptchaToken(String(raw.recaptchaToken ?? ""), "landing");
  if (!captcha.ok) return Response.json({ error: captcha.error }, { status: 400 });

  const prisma = getPrisma();
  if (!prisma) return Response.json({ error: "We could not send that just now. Try again." }, { status: 500 });

  await prisma.submission.create({
    data: {
      flowId: flow.id,
      pageId: page.id,
      answers: checked.answers as unknown as Prisma.InputJsonValue,
    },
  });
  if (!form.skipWebhook) {
    after(() => submitLandingForm(flow.slug, checked.answers, raw.utm, form.formName));
  }
  await grantFlowAccess(flow.slug);

  return Response.json({ ok: true, next: `/f/${flow.slug}/${target.slug}` });
}
