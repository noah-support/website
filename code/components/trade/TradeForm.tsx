"use client";

import Script from "next/script";
import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import GlassPane from "@/components/GlassPane";
import {
  TRADE_APPLY,
  TRADE_DECK_ACCEPT,
  deckFileError,
  parseTradePayload,
  validateTradeDeck,
  validateTradePayload,
  type TradeFieldErrors,
} from "@/lib/trade";
import { useInView } from "@/lib/useInView";
import { useReducedMotion } from "@/lib/useReducedMotion";

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
        <p id={errorId} className="font-body text-sm text-noah-orange" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return (
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
      .filter(Boolean)
      .join(" ") || undefined
  );
}

function assignFile(input: HTMLInputElement | null, file: File | null) {
  if (!input) return;
  const transfer = new DataTransfer();
  if (file) transfer.items.add(file);
  input.files = transfer.files;
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

function RecaptchaScript({ siteKey }: { siteKey: string }) {
  if (!siteKey) return null;
  return (
    <Script
      id="recaptcha-v3"
      src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
      strategy="afterInteractive"
    />
  );
}

function TradeFormFields({
  recaptchaSiteKey,
  compact = false,
  idPrefix = "trade",
}: {
  recaptchaSiteKey: string;
  compact?: boolean;
  idPrefix?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragDepth = useRef(0);
  const [step, setStep] = useState<1 | 2>(1);
  const [deckFile, setDeckFile] = useState<File | null>(null);
  const [deckUrl, setDeckUrl] = useState("");
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<TradeFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success">("idle");

  useEffect(() => {
    if (step === 1) assignFile(fileInputRef.current, deckFile);
  }, [step, deckFile]);

  function takeFile(file: File | null) {
    if (!file) {
      assignFile(fileInputRef.current, null);
      setDeckFile(null);
      return;
    }
    const invalid = deckFileError(file);
    setErrors((current) => ({ ...current, deck: invalid }));
    if (invalid) return;
    assignFile(fileInputRef.current, file);
    setDeckFile(file);
  }

  function onDragEnter(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    dragDepth.current += 1;
    if (event.dataTransfer.types.includes("Files")) setDragging(true);
  }

  function onDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setDragging(false);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    const file = event.dataTransfer.files[0] ?? null;
    takeFile(file);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "pending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const fileFromInput = data.get("deck");
    const file =
      deckFile && deckFile.size > 0
        ? deckFile
        : fileFromInput instanceof File && fileFromInput.size > 0
          ? fileFromInput
          : null;
    const payload = parseTradePayload({
      email: data.get("email"),
      phone: data.get("phone"),
      deckUrl: data.get("deckUrl"),
      note: data.get("note"),
      recaptchaToken: "",
      website: data.get("website"),
    });

    if (step === 1) {
      const found = validateTradeDeck(payload, file);
      setErrors(found);
      setFormError("");
      if (Object.keys(found).length > 0) return;
      setStep(2);
      return;
    }

    const found = validateTradePayload(payload, file);
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

      data.set("recaptchaToken", recaptchaToken);
      if (file) data.set("deck", file);
      else data.delete("deck");

      const response = await fetch("/api/trade", {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as {
        error?: string;
        fieldErrors?: TradeFieldErrors;
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

  const emailId = `${idPrefix}-email`;
  const phoneId = `${idPrefix}-phone`;
  const deckId = `${idPrefix}-deck`;
  const deckUrlId = `${idPrefix}-deck-url`;
  const noteId = `${idPrefix}-note`;
  const websiteId = `${idPrefix}-website`;
  const errorId = `${idPrefix}-form-error`;

  if (status === "success") {
    return (
      <GlassPane
        tilt={!compact}
        className={`trade-form-shell justify-center ${compact ? "p-5 sm:p-6" : "p-6 sm:p-10"}`}
      >
        <p className="font-display text-2xl tracking-tight">
          {TRADE_APPLY.success}
        </p>
      </GlassPane>
    );
  }

  return (
    <GlassPane tilt={!compact} className={compact ? "p-5 sm:p-6" : "p-6 sm:p-10"}>
      <form
        onSubmit={onSubmit}
        noValidate
        className="trade-form-shell relative gap-4"
        aria-describedby={formError ? errorId : undefined}
      >
        <div className="contact-honeypot" aria-hidden="true">
          <label htmlFor={websiteId}>Website</label>
          <input
            id={websiteId}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <p className="font-body text-[11px] uppercase tracking-[0.16em] text-noah-ink-faint">
          Step {step} of 2
        </p>

        {formError ? (
          <p id={errorId} role="alert" className="font-body text-sm text-noah-orange">
            {formError}
          </p>
        ) : null}

        {step === 1 ? (
          <div key="step-1" className="flex min-h-0 flex-1 flex-col gap-4">
            <label
              className="trade-drop"
              data-active={dragging ? "" : undefined}
              data-filled={deckFile ? "" : undefined}
              aria-invalid={Boolean(errors.deck)}
              onDragEnter={onDragEnter}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <span className="trade-drop-glow" aria-hidden />
              <span className="trade-drop-ring" aria-hidden />
              <span className="trade-drop-copy">
                <span className="trade-drop-mark" aria-hidden>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 16V4M12 4l-4.5 4.5M12 4l4.5 4.5M5 16.5V19a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="font-display text-xl tracking-tight sm:text-2xl">
                  {dragging
                    ? TRADE_APPLY.dropActive
                    : deckFile
                      ? TRADE_APPLY.dropFilled
                      : TRADE_APPLY.dropIdle}
                </span>
                <span className="max-w-[28ch] font-body text-sm text-noah-ink-dim">
                  {deckFile ? deckFile.name : TRADE_APPLY.dropBrowse}
                </span>
              </span>
              <input
                ref={fileInputRef}
                id={deckId}
                name="deck"
                type="file"
                accept={TRADE_DECK_ACCEPT}
                aria-invalid={Boolean(errors.deck)}
                aria-describedby={describedBy(
                  deckId,
                  errors.deck,
                  TRADE_APPLY.fileHint
                )}
                className="sr-only"
                onChange={(event) => {
                  takeFile(event.target.files?.[0] ?? null);
                }}
              />
            </label>
            {errors.deck ? (
              <p
                id={`${deckId}-error`}
                className="font-body text-sm text-noah-orange"
                role="alert"
              >
                {errors.deck}
              </p>
            ) : (
              <p id={`${deckId}-hint`} className="font-body text-xs text-noah-ink-dim">
                {TRADE_APPLY.fileHint}
              </p>
            )}

            <Field id={deckUrlId} label="Or paste a link" error={errors.deckUrl}>
              <input
                id={deckUrlId}
                name="deckUrl"
                type="url"
                inputMode="url"
                placeholder="https://"
                value={deckUrl}
                onChange={(event) => setDeckUrl(event.target.value)}
                aria-invalid={Boolean(errors.deckUrl)}
                aria-describedby={describedBy(deckUrlId, errors.deckUrl)}
                className="contact-input"
              />
            </Field>
          </div>
        ) : (
          <div key="step-2" className="flex min-h-0 flex-1 flex-col gap-4">
            <input type="hidden" name="deckUrl" value={deckUrl} />
            <Field id={emailId} label="Email" error={errors.email}>
              <input
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                maxLength={120}
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={describedBy(emailId, errors.email)}
                className="contact-input"
              />
            </Field>
            <Field
              id={phoneId}
              label="Phone"
              error={errors.phone}
              hint="Optional. Include a country code."
            >
              <input
                id={phoneId}
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                maxLength={24}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={describedBy(
                  phoneId,
                  errors.phone,
                  "Optional. Include a country code."
                )}
                className="contact-input"
              />
            </Field>
            <Field id={noteId} label="Anything else?" error={errors.note}>
              <textarea
                id={noteId}
                name="note"
                rows={compact ? 5 : 6}
                maxLength={4000}
                placeholder="Optional"
                aria-invalid={Boolean(errors.note)}
                aria-describedby={describedBy(noteId, errors.note)}
                className="contact-input contact-textarea min-h-[8rem] flex-1"
              />
            </Field>
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-2">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => {
                setFormError("");
                setErrors({});
                setStep(1);
              }}
              className="glass glass-pill flex h-12 w-fit items-center px-7 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange"
            >
              {TRADE_APPLY.back}
            </button>
          ) : null}
          <button
            type="submit"
            disabled={status === "pending"}
            className="glass glass-pill flex h-12 w-fit items-center px-7 text-sm font-medium text-noah-ink transition-colors hover:text-noah-orange disabled:opacity-60"
          >
            {status === "pending"
              ? "Sending"
              : step === 1
                ? TRADE_APPLY.next
                : TRADE_APPLY.submit}
          </button>
        </div>
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
  );
}

export function TradeHeroForm({
  recaptchaSiteKey,
}: {
  recaptchaSiteKey: string;
}) {
  return (
    <div id="bury" className="w-full">
      <RecaptchaScript siteKey={recaptchaSiteKey} />
      <TradeFormFields
        recaptchaSiteKey={recaptchaSiteKey}
        compact
        idPrefix="trade-hero"
      />
    </div>
  );
}

export default function TradeForm({
  recaptchaSiteKey,
}: {
  recaptchaSiteKey: string;
}) {
  const { ref, inView } = useInView<HTMLElement>(0.28, "0px 0px -8% 0px");
  const reducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="industry-partner cta-stage relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden bg-noah-ink/5 px-6 py-20 sm:px-16 sm:py-28"
      data-visible={inView || reducedMotion ? "" : undefined}
    >
      <RecaptchaScript siteKey={recaptchaSiteKey} />

      <div
        className="cta-glow absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(235,92,28,0.16), transparent 65%)",
        }}
      />
      <div className="relative z-10 w-full max-w-3xl">
        <h2 className="industry-in font-display text-4xl tracking-tight sm:text-6xl">
          {TRADE_APPLY.title}
        </h2>
        <p className="industry-in mt-5 max-w-[65ch] font-body text-noah-ink-dim sm:text-lg">
          {TRADE_APPLY.body}
        </p>

        <div className="industry-in mt-10">
          <TradeFormFields recaptchaSiteKey={recaptchaSiteKey} idPrefix="trade" />
        </div>
      </div>
    </section>
  );
}
