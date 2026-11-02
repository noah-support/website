"use client";

import Script from "next/script";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { emailFieldError, type FormBlock } from "@/lib/blocks";
import { readUtm } from "@/lib/utm";

type RecaptchaApi = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

function recaptchaApi() {
  return (window as Window & { grecaptcha?: RecaptchaApi }).grecaptcha;
}

async function waitForRecaptcha() {
  const started = Date.now();
  while (!recaptchaApi()?.ready) {
    if (Date.now() - started > 8000) throw new Error("Captcha could not load. Refresh and try again.");
    await new Promise((resolve) => window.setTimeout(resolve, 80));
  }
  return new Promise<RecaptchaApi>((resolve) => {
    recaptchaApi()!.ready(() => resolve(recaptchaApi()!));
  });
}

export default function LandingForm({
  flowSlug,
  pageId,
  form,
  recaptchaSiteKey,
  preview = false,
}: {
  flowSlug: string;
  pageId: string;
  form: FormBlock;
  recaptchaSiteKey: string;
  preview?: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [sending, setSending] = useState(false);
  const current = form.steps[step] ?? form.steps[0];
  const last = step >= form.steps.length - 1;

  function setValue(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
    setFieldErrors((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  function currentErrors() {
    const errors: Record<string, string> = {};
    for (const field of current.fields) {
      const value = values[field.id] ?? "";
      if (field.required && (field.type === "checkbox" ? value !== "yes" : !value.trim())) {
        errors[field.id] = "This is required.";
      } else if (field.type === "email" && value.trim()) {
        const message = emailFieldError(value);
        if (message) errors[field.id] = message;
      }
    }
    return errors;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const errors = currentErrors();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    if (!last) {
      setStep((value) => value + 1);
      return;
    }
    if (preview) {
      setFormError("This is a preview. Publish the flow to collect answers.");
      return;
    }

    const formElement = event.currentTarget;
    setSending(true);
    setFormError("");
    try {
      let recaptchaToken = "";
      if (recaptchaSiteKey) {
        const recaptcha = await waitForRecaptcha();
        recaptchaToken = await recaptcha.execute(recaptchaSiteKey, { action: "landing" });
      }
      const data = new FormData(formElement);
      const response = await fetch(`/api/f/${flowSlug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId,
          website: String(data.get("website") ?? ""),
          recaptchaToken,
          utm: readUtm(),
          answers: form.steps.flatMap((item) =>
            item.fields.map((field) => ({ fieldId: field.id, value: values[field.id] ?? "" }))
          ),
        }),
      });
      const body = (await response.json()) as {
        next?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (!response.ok || !body.next) {
        if (body.fieldErrors) {
          setFieldErrors(body.fieldErrors);
          const stepIndex = form.steps.findIndex((item) =>
            item.fields.some((field) => body.fieldErrors?.[field.id])
          );
          if (stepIndex >= 0) setStep(stepIndex);
        }
        setFormError(body.error || "We could not send that. Try again.");
        setSending(false);
        return;
      }
      router.push(body.next);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "We could not send that. Try again.");
      setSending(false);
    }
  }

  if (!current) return null;

  return (
    <div>
      {recaptchaSiteKey && !preview ? (
        <Script id="landing-recaptcha" src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`} strategy="afterInteractive" />
      ) : null}
      <form onSubmit={onSubmit} noValidate className="relative flex flex-col gap-5 rounded-3xl border border-noah-ink-hairline bg-white/40 p-6 sm:p-8">
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor={`${form.id}-website`}>Website</label>
          <input id={`${form.id}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl text-noah-ink">{current.title}</h2>
          {form.steps.length > 1 ? (
            <p className="font-body text-xs text-noah-ink-dim">
              Step {step + 1} of {form.steps.length}
            </p>
          ) : null}
        </div>
        {formError ? (
          <p role="alert" className="font-body text-sm text-noah-orange">
            {formError}
          </p>
        ) : null}
        {current.fields.map((field) => {
          const inputId = `${form.id}-${field.id}`;
          const error = fieldErrors[field.id];
          return (
            <div key={field.id} className="flex flex-col gap-2">
              {field.type === "checkbox" ? (
                <label htmlFor={inputId} className="flex items-start gap-3 font-body text-sm text-noah-ink">
                  <input
                    id={inputId}
                    type="checkbox"
                    className="mt-1"
                    checked={values[field.id] === "yes"}
                    onChange={(event) => setValue(field.id, event.target.checked ? "yes" : "")}
                  />
                  <span>
                    {field.label}
                    {field.required ? " *" : ""}
                  </span>
                </label>
              ) : (
                <>
                  <label htmlFor={inputId} className="font-body text-sm text-noah-ink">
                    {field.label}
                    {field.required ? " *" : ""}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={inputId}
                      className="contact-input contact-textarea"
                      value={values[field.id] ?? ""}
                      onChange={(event) => setValue(field.id, event.target.value)}
                      aria-invalid={Boolean(error)}
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={inputId}
                      className="contact-input contact-select"
                      value={values[field.id] ?? ""}
                      onChange={(event) => setValue(field.id, event.target.value)}
                      aria-invalid={Boolean(error)}
                    >
                      <option value="">Select one</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={inputId}
                      className="contact-input"
                      type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
                      value={values[field.id] ?? ""}
                      onChange={(event) => setValue(field.id, event.target.value)}
                      aria-invalid={Boolean(error)}
                    />
                  )}
                </>
              )}
              {error ? (
                <p className="font-body text-xs text-noah-orange" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
          );
        })}
        <div className="flex gap-3">
          {step > 0 ? (
            <button
              type="button"
              className="h-12 flex-1 rounded-full border border-noah-ink-hairline text-sm text-noah-ink"
              onClick={() => setStep((value) => value - 1)}
            >
              Back
            </button>
          ) : null}
          <button
            type="submit"
            disabled={sending}
            className="contact-submit glass glass-pill glass-orange flex h-12 flex-1 items-center justify-center text-sm font-medium text-noah-cream disabled:opacity-60"
          >
            {sending ? "Sending" : last ? "Continue" : "Next"}
          </button>
        </div>
        {recaptchaSiteKey && !preview ? (
          <p className="font-body text-[11px] leading-relaxed text-noah-ink-faint">
            This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.
          </p>
        ) : null}
      </form>
    </div>
  );
}
