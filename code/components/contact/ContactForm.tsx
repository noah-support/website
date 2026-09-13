"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState, type FormEvent, type ReactNode } from "react";
import GlassPane from "@/components/GlassPane";
import {
  CONTACT_REGARDS,
  parseContactPayload,
  validateContactPayload,
  type ContactFieldErrors,
} from "@/lib/contact";

type RecaptchaApi = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
  }
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-sm text-noah-ink">
        {label}
      </label>
      {children}
      {hint ? (
        <p id={hintId} className="font-body text-xs text-noah-ink-dim">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="font-body text-xs text-noah-orange" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ") || undefined;
}

async function waitForRecaptcha() {
  const started = Date.now();
  while (!window.grecaptcha?.ready) {
    if (Date.now() - started > 8000) {
      throw new Error("Captcha could not load. Refresh and try again.");
    }
    await new Promise((resolve) => window.setTimeout(resolve, 80));
  }
  return new Promise<RecaptchaApi>((resolve) => {
    window.grecaptcha!.ready(() => resolve(window.grecaptcha!));
  });
}

export default function ContactForm({
  recaptchaSiteKey,
}: {
  recaptchaSiteKey: string;
}) {
  const router = useRouter();
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = parseContactPayload({
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      regard: data.get("regard"),
      message: data.get("message"),
      recaptchaToken: "",
      website: data.get("website"),
    });

    const nextErrors = validateContactPayload(payload);
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    try {
      let recaptchaToken = "dev-skip";
      if (recaptchaSiteKey) {
        const recaptcha = await waitForRecaptcha();
        recaptchaToken = await recaptcha.execute(recaptchaSiteKey, {
          action: "contact",
        });
      }

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, recaptchaToken }),
      });
      const result = (await response.json()) as {
        error?: string;
        fieldErrors?: ContactFieldErrors;
      };

      if (!response.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setFormError(result.error ?? "Something went wrong. Try again.");
        return;
      }

      router.push("/contact/thanks");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Try again."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      {recaptchaSiteKey ? (
        <Script
          id="recaptcha-v3"
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      ) : null}

      <GlassPane className="p-6 sm:p-9">
        <form
          onSubmit={onSubmit}
          noValidate
          className="relative flex flex-col gap-5"
          aria-describedby={formError ? "contact-form-error" : undefined}
        >
          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {formError ? (
            <p
              id="contact-form-error"
              role="alert"
              className="font-body text-sm text-noah-orange"
            >
              {formError}
            </p>
          ) : null}

          <Field id="contact-name" label="Name" error={errors.name}>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={80}
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={describedBy("contact-name", errors.name)}
              className="contact-input"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="contact-email" label="Email" error={errors.email}>
              <input
                id="contact-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                maxLength={120}
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy("contact-email", errors.email)}
                className="contact-input"
              />
            </Field>
            <Field
              id="contact-phone"
              label="Phone"
              error={errors.phone}
              hint="Include a country code."
            >
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                maxLength={24}
                required
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy(
                  "contact-phone",
                  errors.phone,
                  "Include a country code."
                )}
                className="contact-input"
              />
            </Field>
          </div>

          <Field
            id="contact-regard"
            label="In what regard"
            error={errors.regard}
          >
            <select
              id="contact-regard"
              name="regard"
              required
              defaultValue=""
              aria-invalid={Boolean(errors.regard)}
              aria-describedby={describedBy("contact-regard", errors.regard)}
              className="contact-input contact-select"
            >
              <option value="" disabled>
                Select one
              </option>
              {CONTACT_REGARDS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>

          <Field id="contact-message" label="Message" error={errors.message}>
            <textarea
              id="contact-message"
              name="message"
              rows={6}
              maxLength={4000}
              required
              aria-invalid={Boolean(errors.message)}
              aria-describedby={describedBy("contact-message", errors.message)}
              className="contact-input contact-textarea"
            />
          </Field>

          <button
            type="submit"
            disabled={sending}
            className="contact-submit glass glass-pill glass-orange mt-2 flex h-14 w-full items-center justify-center text-sm font-medium tracking-[0.01em] text-noah-cream disabled:opacity-60"
          >
            {sending ? "Sending" : "Send message"}
          </button>

          <p className="font-body text-[11px] leading-relaxed text-noah-ink-faint">
            This site is protected by reCAPTCHA and the Google{" "}
            <a
              href="https://policies.google.com/privacy"
              className="underline decoration-noah-ink-hairline underline-offset-2 transition-colors hover:text-noah-ink"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://policies.google.com/terms"
              className="underline decoration-noah-ink-hairline underline-offset-2 transition-colors hover:text-noah-ink"
            >
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </form>
      </GlassPane>
    </div>
  );
}
