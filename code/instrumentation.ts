import { capturesDisabled, formWebhookUrl } from "@/lib/submitForm";

export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (!capturesDisabled()) formWebhookUrl();
  const { ensureBucket } = await import("@/lib/storage");
  await ensureBucket();
}
