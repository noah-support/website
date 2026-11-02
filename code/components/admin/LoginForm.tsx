"use client";

import { useActionState } from "react";
import { login } from "@/lib/adminActions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });

  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-5">
      <h1 className="font-display text-4xl text-noah-ink">Admin</h1>
      {state.error ? (
        <p role="alert" className="font-body text-sm text-noah-orange">
          {state.error}
        </p>
      ) : null}
      <label className="flex flex-col gap-2 font-body text-sm text-noah-ink">
        Password
        <input name="password" type="password" autoComplete="current-password" required className="contact-input" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="contact-submit glass glass-pill glass-orange flex h-12 items-center justify-center text-sm font-medium text-noah-cream disabled:opacity-60"
      >
        {pending ? "Checking" : "Continue"}
      </button>
    </form>
  );
}
