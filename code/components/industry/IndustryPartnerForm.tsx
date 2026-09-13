"use client";

import Script from "next/script";
import { useState, type FormEvent, type ReactNode } from "react";
import GlassPane from "@/components/GlassPane";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";
import {
  PARTNER_APPLY,
  validatePartnerPayload,
  type PartnerFieldErrors,
} from "@/lib/partner";

type RecaptchaApi = {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
  }
}

type Fields = {
  firstName: string;
  lastName: string;
  workEmail: string;
  companyName: string;
  consultants: string;
  country: string;
  services: string;
  extra: string;
};

const EMPTY: Fields = {
  firstName: "",
  lastName: "",
  workEmail: "",
  companyName: "",
  consultants: "",
  country: "",
  services: "",
  extra: "",
};

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-sm text-noah-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="font-body text-sm text-noah-orange">
          {error}
        </p>
      ) : null}
    </div>
  );
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

export default function IndustryPartnerForm({
  recaptchaSiteKey,
}: {
  recaptchaSiteKey: string;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.28, "0px 0px -8% 0px");
  const reducedMotion = useReducedMotion();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<PartnerFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");

  function update(key: keyof Fields, value: string) {
    setFields((current) => ({ ...current, [key]: value }));
    if (key === "extra") return;
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;

    const form = event.currentTarget;
    const website = String(new FormData(form).get("website") ?? "");
    const found = validatePartnerPayload({
      ...fields,
      recaptchaToken: "",
      website,
    });
    setErrors(found);
    setFormError("");
    if (Object.keys(found).length > 0) return;

    setStatus("pending");
    try {
      let recaptchaToken = "dev-skip";
      if (recaptchaSiteKey) {
        const recaptcha = await waitForRecaptcha();
        recaptchaToken = await recaptcha.execute(recaptchaSiteKey, {
          action: "contact",
        });
      }

      const response = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          recaptchaToken,
          website,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        fieldErrors?: PartnerFieldErrors;
      };

      if (!response.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setFormError(result.error ?? "Something went wrong. Try again.");
        setStatus("idle");
        return;
      }

      setStatus("success");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Try again."
      );
      setStatus("idle");
    }
  }

  return (
    <section
      ref={ref}
      id="apply"
      className="industry-partner cta-stage relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-noah-ink/5 px-6 py-20 sm:px-16 sm:py-28"
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      {recaptchaSiteKey ? (
        <Script
          id="recaptcha-v3"
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      ) : null}

      <div
        className="cta-glow absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(235,92,28,0.16), transparent 65%)",
        }}
      />
      <div className="relative z-10 w-full max-w-3xl">
        <h2 className="industry-in font-display text-4xl tracking-tight sm:text-6xl">
          {PARTNER_APPLY.title}
        </h2>
        <p className="industry-in mt-5 max-w-[65ch] font-body text-noah-ink-dim sm:text-lg">
          {PARTNER_APPLY.body}
        </p>

        {status === "success" ? (
          <div className="industry-in mt-10">
            <GlassPane className="p-8 sm:p-10">
              <p className="font-display text-2xl tracking-tight">
                We will get back to you within one business day.
              </p>
            </GlassPane>
          </div>
        ) : (
          <div className="industry-in mt-10">
            <GlassPane className="p-6 sm:p-10">
            <form
              onSubmit={onSubmit}
              noValidate
              className="relative grid grid-cols-1 gap-5 sm:grid-cols-2"
              aria-describedby={formError ? "partner-form-error" : undefined}
            >
              <div className="contact-honeypot" aria-hidden="true">
                <label htmlFor="partner-website">Website</label>
                <input
                  id="partner-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {formError ? (
                <p
                  id="partner-form-error"
                  role="alert"
                  className="font-body text-sm text-noah-orange sm:col-span-2"
                >
                  {formError}
                </p>
              ) : null}

              <Field id="first-name" label="First Name" error={errors.firstName}>
                <input
                  id="first-name"
                  name="first_name"
                  type="text"
                  autoComplete="given-name"
                  required
                  aria-invalid={errors.firstName ? true : undefined}
                  aria-describedby={
                    errors.firstName ? "first-name-error" : undefined
                  }
                  placeholder="First Name"
                  className="contact-input"
                  value={fields.firstName}
                  onChange={(event) => update("firstName", event.target.value)}
                />
              </Field>
              <Field id="last-name" label="Last Name" error={errors.lastName}>
                <input
                  id="last-name"
                  name="last_name"
                  type="text"
                  autoComplete="family-name"
                  required
                  aria-invalid={errors.lastName ? true : undefined}
                  aria-describedby={
                    errors.lastName ? "last-name-error" : undefined
                  }
                  placeholder="Last Name"
                  className="contact-input"
                  value={fields.lastName}
                  onChange={(event) => update("lastName", event.target.value)}
                />
              </Field>
              <Field id="work-email" label="Work Email" error={errors.workEmail}>
                <input
                  id="work-email"
                  name="work_email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-invalid={errors.workEmail ? true : undefined}
                  aria-describedby={
                    errors.workEmail ? "work-email-error" : undefined
                  }
                  placeholder="Work Email"
                  className="contact-input"
                  value={fields.workEmail}
                  onChange={(event) => update("workEmail", event.target.value)}
                />
              </Field>
              <Field
                id="company-name"
                label="Company Name"
                error={errors.companyName}
              >
                <input
                  id="company-name"
                  name="company_name"
                  type="text"
                  autoComplete="organization"
                  required
                  aria-invalid={errors.companyName ? true : undefined}
                  aria-describedby={
                    errors.companyName ? "company-name-error" : undefined
                  }
                  placeholder="Company Name"
                  className="contact-input"
                  value={fields.companyName}
                  onChange={(event) => update("companyName", event.target.value)}
                />
              </Field>
              <Field
                id="consultants"
                label="Number of Consultants"
                error={errors.consultants}
              >
                <select
                  id="consultants"
                  name="number_consultants"
                  required
                  aria-invalid={errors.consultants ? true : undefined}
                  aria-describedby={
                    errors.consultants ? "consultants-error" : undefined
                  }
                  className="contact-input contact-select"
                  value={fields.consultants}
                  onChange={(event) => update("consultants", event.target.value)}
                >
                  <option value="">Select one</option>
                  {PARTNER_APPLY.consultantOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="country" label="Country" error={errors.country}>
                <input
                  id="country"
                  name="country"
                  type="text"
                  autoComplete="country-name"
                  required
                  aria-invalid={errors.country ? true : undefined}
                  aria-describedby={errors.country ? "country-error" : undefined}
                  placeholder="Country"
                  className="contact-input"
                  value={fields.country}
                  onChange={(event) => update("country", event.target.value)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  id="services"
                  label="What do you mainly help clients with?"
                  error={errors.services}
                >
                  <textarea
                    id="services"
                    name="services"
                    required
                    rows={4}
                    aria-invalid={errors.services ? true : undefined}
                    aria-describedby={
                      errors.services ? "services-error" : undefined
                    }
                    placeholder="e.g. AI strategy, digital transformation, ERP implementation..."
                    className="contact-input contact-textarea"
                    value={fields.services}
                    onChange={(event) => update("services", event.target.value)}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field id="extra" label="Anything else you want to share?">
                  <textarea
                    id="extra"
                    name="extra"
                    rows={4}
                    placeholder="Optional"
                    className="contact-input contact-textarea"
                    value={fields.extra}
                    onChange={(event) => update("extra", event.target.value)}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={status === "pending"}
                  className="glass glass-pill flex h-12 w-fit items-center px-7 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange disabled:opacity-60"
                >
                  {status === "pending" ? "Applying..." : PARTNER_APPLY.submit}
                </button>
                <p className="mt-4 font-body text-[11px] leading-relaxed text-noah-ink-faint">
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
              </div>
            </form>
          </GlassPane>
          </div>
        )}
      </div>
    </section>
  );
}
