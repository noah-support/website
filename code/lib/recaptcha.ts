type RecaptchaVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

// Same testing switch as the n8n capture. False unless DISABLE_CAPTURES is "true".
export function captchaDisabled() {
  return process.env.DISABLE_CAPTURES?.trim().toLowerCase() === "true";
}

export async function verifyRecaptchaToken(token: string, expectedAction: string) {
  if (captchaDisabled()) return { ok: true as const, score: 1 };

  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV !== "production") {
      return { ok: true as const, score: 1 };
    }
    return { ok: false as const, error: "Captcha is not configured." };
  }

  if (!token) {
    return { ok: false as const, error: "Captcha failed. Refresh and try again." };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    return { ok: false as const, error: "Captcha failed. Try again." };
  }

  const result = (await response.json()) as RecaptchaVerifyResponse;
  const score = result.score ?? 0;

  if (
    !result.success ||
    result.action !== expectedAction ||
    score < 0.5
  ) {
    return { ok: false as const, error: "Captcha failed. Try again." };
  }

  return { ok: true as const, score };
}
