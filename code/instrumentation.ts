import { formWebhookUrl } from "@/lib/submitForm";

export function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  formWebhookUrl();
}
