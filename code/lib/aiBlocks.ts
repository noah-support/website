import { blocksFromAi, type Block } from "@/lib/blocks";

const SYSTEM = `You write sections for a landing page builder. Reply with JSON only:
{"blocks":[{"type":"heading","level":2,"text":"..."},{"type":"text","text":"..."},{"type":"button","label":"...","targetPageId":""},{"type":"form","targetPageId":"","steps":[{"title":"Your details","fields":[{"type":"text","label":"Name","required":true,"split":true},{"type":"email","label":"Email","required":true}]}]}]}
Allowed block types: heading, text, button, form.
Allowed field types: text, email, phone, textarea, select, checkbox.
Select fields need an options array of strings.
For a person's name, use one text field with "split":true. It shows first and last name.
Do not invent images or PDFs.
Keep the copy short and specific to the request. At most 6 blocks.`;

export async function generateBlocks(prompt: string, pageTitles: string[]) {
  const key = process.env.AI_API_KEY?.trim();
  if (!key) {
    return { ok: false as const, error: "Set AI_API_KEY to an OpenRouter key to build a section with AI." };
  }
  const base = (process.env.AI_BASE_URL?.trim() || "https://openrouter.ai/api/v1").replace(/\/$/, "");
  const model = process.env.AI_MODEL?.trim() || "anthropic/claude-sonnet-5.5";
  const pages = pageTitles.length ? `Pages already in this flow: ${pageTitles.join(", ")}.` : "";
  const referer = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://noah.support";

  let response: Response;
  try {
    response = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        "HTTP-Referer": referer,
        "X-Title": "Noah",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4000,
        reasoning: { effort: "low", exclude: true },
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `${prompt}\n${pages}` },
        ],
      }),
      signal: AbortSignal.timeout(45000),
    });
  } catch (error) {
    console.error("[ai]", error);
    return { ok: false as const, error: "The model did not respond." };
  }

  if (!response.ok) {
    console.error("[ai] status", response.status);
    return { ok: false as const, error: "The model did not return a section." };
  }

  const body = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  const content = body.choices?.[0]?.message?.content;
  const parsed = blocksFromAi(content);
  if (!parsed.ok) return parsed;
  return { ok: true as const, blocks: parsed.blocks as Block[] };
}
