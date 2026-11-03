import { BlockBody } from "@/components/landing/BlockBody";
import { formBlock } from "@/lib/blocks";
import { readBlocks } from "@/lib/flows";
import { captchaDisabled } from "@/lib/recaptcha";
import type { Page } from "@prisma/client";

export default function FlowPageView({
  flowSlug,
  page,
  pages,
  locked,
}: {
  flowSlug: string;
  page: Page;
  pages: Page[];
  locked: boolean;
}) {
  const links = pages.map((item) => ({ id: item.id, slug: item.slug, title: item.title }));
  const siteKey = captchaDisabled()
    ? ""
    : process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || "";

  const blocks = readBlocks(page.blocks);
  const form = formBlock(blocks);
  const formInHero = blocks.some(
    (block) => block.type === "section" && block.template === "hero" && block.heroMedia === "form"
  );

  return (
    <main className="flex min-h-dvh w-full flex-col">
      {locked ? (
        <div className="mx-auto flex w-full flex-col gap-4 px-6 py-16 min-[1400px]:w-[80%]">
          <h1 className="font-display text-4xl text-noah-ink">Submit the form to continue</h1>
          <a href={`/f/${flowSlug}`} className="text-sm text-noah-ink underline underline-offset-4">
            Back to the start
          </a>
        </div>
      ) : (
        blocks.map((block) => {
          if (block.type === "form" && formInHero) return null;
          return block.type === "section" || block.type === "spacer" ? (
            <BlockBody
              key={block.id}
              block={block}
              flowSlug={flowSlug}
              pageId={page.id}
              pages={links}
              preview={false}
              recaptchaSiteKey={siteKey}
              form={form}
            />
          ) : (
            <div key={block.id} className="mx-auto w-full px-6 py-4 first:pt-16 last:pb-16 min-[1400px]:w-[80%]">
              <BlockBody
                block={block}
                flowSlug={flowSlug}
                pageId={page.id}
                pages={links}
                preview={false}
                recaptchaSiteKey={siteKey}
                form={form}
              />
            </div>
          );
        })
      )}
    </main>
  );
}
