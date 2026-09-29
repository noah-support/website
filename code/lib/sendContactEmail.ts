import { regardLabel, type ContactPayload } from "./contact";
import type { PartnerPayload } from "./partner";
import type { TradePayload } from "./trade";

const FORM_FROM_EMAIL = "contact@noah.support";
const FORM_FROM_NAME = "Noah";

type InboundAttachment = {
  content: string;
  filename: string;
  type: string;
};

async function sendInboundEmail({
  log,
  replyToEmail,
  replyToName,
  subject,
  text,
  attachments,
}: {
  log: string;
  replyToEmail: string;
  replyToName: string;
  subject: string;
  text: string;
  attachments?: InboundAttachment[];
}) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!apiKey || !to) {
    console.warn(
      `[${log}] Email is not configured. Message from ${replyToEmail} was not sent.`
    );
    return { ok: true as const, delivered: false };
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FORM_FROM_EMAIL, name: FORM_FROM_NAME },
      reply_to: { email: replyToEmail, name: replyToName },
      subject,
      content: [{ type: "text/plain", value: text }],
      ...(attachments?.length
        ? {
            attachments: attachments.map((file) => ({
              content: file.content,
              filename: file.filename,
              type: file.type,
              disposition: "attachment",
            })),
          }
        : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error(`[${log}] SendGrid failed:`, response.status, detail);
    return { ok: false as const, delivered: false };
  }

  return { ok: true as const, delivered: true };
}

export async function sendContactEmail(payload: ContactPayload) {
  return sendInboundEmail({
    log: "contact",
    replyToEmail: payload.email,
    replyToName: payload.name,
    subject: `${regardLabel(payload.regard)} from ${payload.name}`,
    text: [
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Regard: ${regardLabel(payload.regard)}`,
      "",
      payload.message,
    ].join("\n"),
  });
}

export async function sendPartnerEmail(payload: PartnerPayload) {
  const name = `${payload.firstName} ${payload.lastName}`;
  return sendInboundEmail({
    log: "partner",
    replyToEmail: payload.workEmail,
    replyToName: name,
    subject: `Partnership from ${name}`,
    text: [
      `Name: ${name}`,
      `Email: ${payload.workEmail}`,
      `Company: ${payload.companyName}`,
      `Consultants: ${payload.consultants}`,
      `Country: ${payload.country}`,
      "",
      "What they help clients with:",
      payload.services,
      payload.extra ? `\nAnything else:\n${payload.extra}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });
}

export async function sendTradeEmail(
  payload: TradePayload,
  attachment?: InboundAttachment
) {
  return sendInboundEmail({
    log: "trade",
    replyToEmail: payload.email,
    replyToName: payload.name || payload.email,
    subject: `Slide deck from ${payload.name || payload.email}`,
    text: [
      payload.name ? `Name: ${payload.name}` : "",
      `Email: ${payload.email}`,
      payload.phone ? `Phone: ${payload.phone}` : "",
      payload.company ? `Company: ${payload.company}` : "",
      payload.deckUrl ? `Deck link: ${payload.deckUrl}` : "Deck link: —",
      attachment ? `Attachment: ${attachment.filename}` : "Attachment: —",
      payload.note ? `\nNote:\n${payload.note}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    attachments: attachment ? [attachment] : undefined,
  });
}
