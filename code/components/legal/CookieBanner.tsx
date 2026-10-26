"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {
  ALL_CONSENT,
  NO_CONSENT,
  onOpenCookieSettings,
  openCookieSettings,
  saveConsent,
  useConsent,
  type ConsentCategory,
  type ConsentChoices,
} from "@/lib/consent";

const POLICY_HREF = "/cookies";

const CATEGORIES: { id: ConsentCategory | "essential"; title: string; description: string }[] = [
  {
    id: "essential",
    title: "Essential",
    description:
      "Keep the site and its forms working. Includes spam protection by Google reCAPTCHA and remembering this choice.",
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "Google Analytics measures how pages are used. Snitcher recognises which companies visit.",
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "HubSpot recognises your browser across visits, so we can follow up on what you read.",
  },
  {
    id: "media",
    title: "External media",
    description:
      "YouTube videos and the HubSpot booking calendar. These providers can set their own cookies.",
  },
];

const noop = () => () => {};

/** False during server render and hydration, true after. Keeps the banner out of the HTML. */
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

/** Pads the page by the banner's height so the footer is never stuck behind it. */
function useReserveSpace(node: HTMLElement | null) {
  useEffect(() => {
    const root = document.documentElement;
    if (!node) return;
    const reserve = () =>
      root.style.setProperty("--consent-banner-space", `${node.offsetHeight + 16}px`);
    reserve();
    const observer = new ResizeObserver(reserve);
    observer.observe(node);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--consent-banner-space");
    };
  }, [node]);
}

function SettingsDialog({
  open,
  initial,
  onClose,
}: {
  open: boolean;
  initial: ConsentChoices;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [draft, setDraft] = useState<ConsentChoices>(initial);
  const titleId = useId();
  const introId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnFocusRef.current = document.activeElement as HTMLElement | null;
      setDraft(initial);
      // showModal makes the rest of the page inert and keeps focus inside.
      dialog.showModal();
      // Start on the first choice, not on the policy link in the intro.
      dialog.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initial]);

  const finish = (choices?: ConsentChoices) => {
    if (choices) saveConsent(choices);
    onClose();
    returnFocusRef.current?.focus?.();
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={introId}
      className="consent-dialog"
      onCancel={(event) => {
        event.preventDefault();
        finish();
      }}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === event.currentTarget) finish();
      }}
    >
      <form
        method="dialog"
        className="flex max-h-[inherit] flex-col"
        onSubmit={(event) => {
          event.preventDefault();
          finish(draft);
        }}
      >
        <div className="overflow-y-auto px-6 pb-2 pt-7 sm:px-8 sm:pt-8">
          <h2 id={titleId} className="font-display text-3xl tracking-tight">
            Cookie settings
          </h2>
          <p id={introId} className="mt-3 font-body text-sm leading-relaxed text-noah-ink-dim">
            Choose what may load. Change it any time from the footer.{" "}
            <Link href={POLICY_HREF} className="consent-link" onClick={() => finish()}>
              Cookie policy
            </Link>
          </p>

          <ul className="mt-6">
            {CATEGORIES.map((category) => {
              const essential = category.id === "essential";
              const inputId = `consent-${category.id}`;
              const checked = essential ? true : draft[category.id as ConsentCategory];
              return (
                <li
                  key={category.id}
                  className="flex items-start justify-between gap-6 border-t border-noah-ink-hairline py-5"
                >
                  <div>
                    <label htmlFor={inputId} className="font-body text-base font-semibold text-noah-ink">
                      {category.title}
                    </label>
                    <p
                      id={`${inputId}-description`}
                      className="mt-1 font-body text-sm leading-relaxed text-noah-ink-dim"
                    >
                      {category.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 pt-0.5">
                    <input
                      id={inputId}
                      type="checkbox"
                      role="switch"
                      className="consent-switch"
                      checked={checked}
                      disabled={essential}
                      aria-describedby={`${inputId}-description`}
                      onChange={(event) => {
                        if (essential) return;
                        const value = event.target.checked;
                        setDraft((current) => ({ ...current, [category.id]: value }));
                      }}
                    />
                    {essential ? (
                      <span className="font-body text-xs text-noah-ink-dim">Always on</span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-noah-ink-hairline px-6 py-5 sm:flex-row sm:px-8">
          <button type="button" className="consent-button" onClick={() => finish(NO_CONSENT)}>
            Reject all
          </button>
          <button type="button" className="consent-button" onClick={() => finish(ALL_CONSENT)}>
            Accept all
          </button>
          <button type="submit" className="consent-button">
            Save choices
          </button>
        </div>
      </form>
    </dialog>
  );
}

/**
 * The consent banner and the settings view. The banner shows until the
 * visitor chooses, and again when the choice expires or the service list
 * changes. The settings open from the banner or via openCookieSettings().
 */
export default function CookieBanner() {
  const mounted = useMounted();
  const consent = useConsent();
  const [settingsOpen, setSettingsOpen] = useState(false);
  // A callback ref, so the effect runs once the node really exists.
  const [banner, setBanner] = useState<HTMLElement | null>(null);
  const textId = useId();

  // Stays rendered under the open settings (the modal makes it inert), so
  // focus can return to "Customise" when the settings close without a choice.
  const showBanner = mounted && !consent;
  useReserveSpace(showBanner ? banner : null);

  useEffect(() => {
    window.noahCookieSettings = openCookieSettings;
    const off = onOpenCookieSettings(() => setSettingsOpen(true));
    return () => {
      off();
      delete window.noahCookieSettings;
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {showBanner ? (
        <section
          ref={setBanner}
          aria-label="Cookie consent"
          aria-describedby={textId}
          className="consent-banner glass"
        >
          <p id={textId} className="font-body text-[15px] leading-relaxed text-noah-ink">
            Analytics, marketing and embedded media stay off until you choose.{" "}
            <Link href={POLICY_HREF} className="consent-link">
              Cookie policy
            </Link>
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-0 sm:flex-nowrap">
            <button type="button" className="consent-button" onClick={() => saveConsent(NO_CONSENT)}>
              Reject all
            </button>
            <button type="button" className="consent-button" onClick={() => saveConsent(ALL_CONSENT)}>
              Accept all
            </button>
            <button
              type="button"
              className="consent-text-button"
              onClick={() => setSettingsOpen(true)}
            >
              Customise
            </button>
          </div>
        </section>
      ) : null}

      <SettingsDialog
        open={settingsOpen}
        initial={consent?.choices ?? NO_CONSENT}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
}
