import Link from "next/link";
import LandingForm from "@/components/landing/LandingForm";
import SectionView from "@/components/landing/SectionView";
import { type Block, type FormBlock } from "@/lib/blocks";

export type FlowPageLink = { id: string; slug: string; title: string };

export function BlockBody({
  block,
  flowSlug,
  pageId,
  pages,
  preview,
  recaptchaSiteKey,
  form = null,
  formEmbedded = false,
}: {
  block: Block;
  flowSlug: string;
  pageId: string;
  pages: FlowPageLink[];
  preview: boolean;
  recaptchaSiteKey: string;
  form?: FormBlock | null;
  formEmbedded?: boolean;
}) {
  if (block.type === "section") {
    return (
      <SectionView
        block={block}
        preview={preview}
        form={form}
        flowSlug={flowSlug}
        pageId={pageId}
        recaptchaSiteKey={recaptchaSiteKey}
      />
    );
  }

  if (block.type === "form" && formEmbedded) {
    return (
      <p className="font-body text-sm text-noah-ink-dim">
        This form is shown in the hero. Select this block to edit its fields.
      </p>
    );
  }

  if (block.type === "spacer") {
    return preview ? (
      <div
        style={{ height: block.height }}
        className="flex items-center justify-center rounded-2xl border border-dashed border-noah-ink-hairline font-body text-xs text-noah-ink-dim"
      >
        Space · {block.height}px
      </div>
    ) : (
      <div aria-hidden style={{ height: block.height }} />
    );
  }

  if (block.type === "heading") {
    if (!block.text && !preview) return null;
    const className =
      block.level === 1
        ? "font-display text-4xl leading-tight text-noah-ink sm:text-5xl"
        : block.level === 2
          ? "font-display text-3xl leading-tight text-noah-ink"
          : "font-display text-2xl leading-tight text-noah-ink";
    const Tag = `h${block.level}` as "h1" | "h2" | "h3";
    return <Tag className={className}>{block.text || "Heading"}</Tag>;
  }

  if (block.type === "text") {
    if (!block.text && !preview) return null;
    return (
      <p className="whitespace-pre-wrap font-body text-base leading-relaxed text-noah-ink-dim">
        {block.text || "Text"}
      </p>
    );
  }

  if (block.type === "image") {
    if (!block.assetId) {
      return preview ? (
        <div className="flex h-48 items-center justify-center rounded-3xl border border-dashed border-noah-ink-hairline text-sm text-noah-ink-dim">
          Add an image
        </div>
      ) : null;
    }
    return (
      // Files are served by our own asset route, not the image optimizer.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`/api/assets/${block.assetId}`} alt={block.alt} className="w-full rounded-3xl" />
    );
  }

  if (block.type === "pdf") {
    if (!block.assetId) {
      return preview ? (
        <div className="flex h-48 items-center justify-center rounded-3xl border border-dashed border-noah-ink-hairline text-sm text-noah-ink-dim">
          Add a PDF
        </div>
      ) : null;
    }
    return (
      <iframe
        title="Document"
        src={`/api/assets/${block.assetId}`}
        className="h-[75vh] w-full rounded-3xl border border-noah-ink-hairline bg-white"
      />
    );
  }

  if (block.type === "button") {
    const target = pages.find((page) => page.id === block.targetPageId);
    if (!target || !block.label) {
      return preview ? (
        <span className="inline-flex h-12 items-center rounded-full bg-noah-ink/10 px-6 text-sm text-noah-ink-dim">
          {block.label || "Button"}
        </span>
      ) : null;
    }
    const href = `/f/${flowSlug}/${target.slug}`;
    if (preview) {
      return (
        <span className="contact-submit glass glass-pill glass-orange inline-flex h-12 items-center px-6 text-sm font-medium text-noah-cream">
          {block.label}
        </span>
      );
    }
    return (
      <Link
        href={href}
        className="contact-submit glass glass-pill glass-orange inline-flex h-12 items-center px-6 text-sm font-medium text-noah-cream"
      >
        {block.label}
      </Link>
    );
  }

  return (
    <LandingForm
      flowSlug={flowSlug}
      pageId={pageId}
      form={block}
      recaptchaSiteKey={recaptchaSiteKey}
      preview={preview}
    />
  );
}
