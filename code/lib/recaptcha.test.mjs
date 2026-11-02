import assert from "node:assert/strict";
import { test } from "node:test";
import { verifyRecaptchaToken } from "./recaptcha.ts";

test("DISABLE_CAPTURES skips captcha", async () => {
  const previous = process.env.DISABLE_CAPTURES;
  process.env.DISABLE_CAPTURES = "true";
  process.env.RECAPTCHA_SECRET_KEY = "secret";
  try {
    assert.deepEqual(await verifyRecaptchaToken("", "landing"), { ok: true, score: 1 });
  } finally {
    if (previous === undefined) delete process.env.DISABLE_CAPTURES;
    else process.env.DISABLE_CAPTURES = previous;
  }
});
