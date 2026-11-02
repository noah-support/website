"use client";

import { useState } from "react";
import { deleteFlowAction } from "@/lib/adminActions";

export default function DeleteFlow({ id, name, from }: { id: string; name: string; from?: "editor" }) {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const matches = typed === name;

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm text-noah-orange">
        Delete
      </button>
    );
  }

  return (
    <form action={deleteFlowAction} className="flex w-full max-w-sm flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      {from ? <input type="hidden" name="from" value={from} /> : null}
      <p className="font-body text-sm text-noah-ink-dim">
        Type <span className="text-noah-ink">{name}</span> to delete this flow, its pages, and its submissions.
      </p>
      <input
        name="confirmation"
        value={typed}
        onChange={(event) => setTyped(event.target.value)}
        autoComplete="off"
        className="contact-input"
        aria-label={`Type ${name} to confirm`}
      />
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!matches}
          className="h-10 rounded-full bg-noah-orange px-4 text-sm text-noah-cream disabled:opacity-40"
        >
          Delete flow
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setTyped("");
          }}
          className="text-sm text-noah-ink-dim"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
