"use client";

import { useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const QUESTIONS = [
  {
    q: "How is this different from hiring a consultant?",
    a: "A consultant sells you a slide deck and a subjective read of your business. We interview your team directly, map what we hear, and hand you priced business cases — no deck, no retainer.",
  },
  {
    q: "What does the first 24 hours actually look like?",
    a: "We interview a whole department bottom-up in a single day. By the end of it, we already have enough to start mapping how the department actually works.",
  },
  {
    q: "Do you build the fix, or just tell us what to build?",
    a: "We map the process, price the fix, and rank it against the alternatives. What you do with it — build it yourselves, or bring us back to help — is up to you.",
  },
  {
    q: "What if we only want to fix one department?",
    a: "That's the point. You start with one department, see the result, and decide from there whether to bring us into the next one.",
  },
  {
    q: "How much does it cost?",
    a: "Less than a consultancy engagement, and scoped to a single department first. We'll give you an exact number on the call.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <div className="border-t border-noah-ink-hairline py-6">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between gap-6 text-left font-display text-xl tracking-tight sm:text-2xl"
      >
        {q}
        <span className="relative h-4 w-4 shrink-0 text-noah-orange" aria-hidden>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-[1.5px] w-4 bg-current" />
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center ${
              reducedMotion ? "" : "transition-transform duration-200"
            }`}
            style={{
              transitionTimingFunction: "var(--ease-out)",
              transform: open ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            <span className="h-4 w-[1.5px] bg-current" />
          </span>
        </span>
      </button>
      <div className="faq-answer" data-open={open ? "" : undefined}>
        <div className="faq-answer-inner">
          <p className="pt-4 max-w-2xl font-body text-noah-ink-dim sm:text-lg">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="px-6 py-28 sm:px-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-center font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">
          FAQ
        </p>
        <h2 className="mt-4 text-center font-display text-4xl tracking-tight sm:text-5xl">
          Questions worth asking.
        </h2>

        <div className="mt-16 flex flex-col border-b border-noah-ink-hairline">
          {QUESTIONS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
