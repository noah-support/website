"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/company";
import { updateFlowAction } from "@/lib/adminActions";

export default function FlowDetails({
  id,
  name,
  slug,
  published,
  error,
}: {
  id: string;
  name: string;
  slug: string;
  published: boolean;
  error?: string;
}) {
  const [nextName, setNextName] = useState(name);
  const [nextSlug, setNextSlug] = useState(slug);
  const dirty = nextName !== name || nextSlug !== slug;

  return (
    <form action={updateFlowAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={id} />
      <label className="flex flex-col gap-2 text-sm">
        Name
        <input
          name="name"
          value={nextName}
          onChange={(event) => setNextName(event.target.value)}
          required
          className="contact-input"
          maxLength={80}
        />
      </label>
      <label className="flex flex-col gap-2 text-sm">
        Address
        <input
          name="slug"
          value={nextSlug}
          onChange={(event) => setNextSlug(event.target.value)}
          required
          className="contact-input"
          maxLength={60}
        />
      </label>
      <p className="font-body text-sm text-noah-ink-dim">
        Save to apply a new name or address. Until then, the public link stays{" "}
        {published ? (
          <a href={`${SITE_URL}/f/${slug}`} className="underline underline-offset-2">
            {SITE_URL}/f/{slug}
          </a>
        ) : (
          <span>
            /f/{slug}, and the flow stays a draft
          </span>
        )}
        .
      </p>
      {dirty ? <p className="font-body text-sm text-noah-orange">The name or address has changed. Save details to keep it.</p> : null}
      {error ? <p className="font-body text-sm text-noah-orange">{error}</p> : null}
      <button type="submit" className="h-12 w-fit rounded-full border border-noah-ink px-5 text-sm">
        Save details
      </button>
    </form>
  );
}
