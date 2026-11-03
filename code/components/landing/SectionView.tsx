import HeroKpi from "@/components/HeroKpi";
import LandingForm from "@/components/landing/LandingForm";
import { safeButtonHref, youtubeId, type FormBlock, type SectionBlock, type SectionItem } from "@/lib/blocks";

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function SlotImage({
  assetId,
  alt,
  preview,
  className,
}: {
  assetId: string;
  alt: string;
  preview: boolean;
  className: string;
}) {
  if (!assetId) {
    if (!preview) return null;
    return (
      <div className={`flex items-center justify-center rounded-3xl border border-dashed border-noah-ink-hairline text-sm text-noah-ink-dim ${className}`}>
        Image
      </div>
    );
  }
  return (
    // Files are served by our own asset route, not the image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/api/assets/${assetId}`} alt={alt} className={`w-full rounded-3xl object-cover ${className}`} />
  );
}

function OrangeButton({ label, href, preview }: { label: string; href: string; preview: boolean }) {
  if (!label) return null;
  const className = "glass glass-orange glass-pill inline-flex h-12 items-center px-7 text-sm font-medium text-white";
  const safe = safeButtonHref(href);
  if (!safe || preview) return <span className={className}>{label}</span>;
  const external = safe.startsWith("http");
  return (
    <a
      href={safe}
      className={className}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {label}
    </a>
  );
}

function Hero({
  block,
  preview,
  form,
  flowSlug,
  pageId,
  recaptchaSiteKey,
}: {
  block: SectionBlock;
  preview: boolean;
  form: FormBlock | null;
  flowSlug: string;
  pageId: string;
  recaptchaSiteKey: string;
}) {
  return (
    <section className="flex min-h-dvh flex-col justify-center px-6 py-16 sm:px-12">
      <div className="flex w-full flex-col items-start gap-12 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          {block.eyebrow ? (
            <p className="font-body text-xs uppercase tracking-[0.2em] text-noah-ink-dim">{block.eyebrow}</p>
          ) : null}
          <h2 className={`font-display text-4xl leading-[1.05] tracking-tight text-noah-ink sm:text-6xl ${block.eyebrow ? "mt-6" : ""}`}>{block.title}</h2>
          {block.body ? <p className="mt-6 max-w-md font-body text-base text-noah-ink-dim sm:text-lg">{block.body}</p> : null}
          {block.buttonLabel ? (
            <div className="mt-10">
              <OrangeButton label={block.buttonLabel} href={block.buttonHref} preview={preview} />
            </div>
          ) : null}
        </div>
        <div className={`w-full ${block.heroMedia === "pdf" ? "lg:max-w-xl" : "max-w-md"}`}>
          {block.heroMedia === "form" ? (
            form ? (
              <LandingForm
                flowSlug={flowSlug}
                pageId={pageId}
                form={form}
                recaptchaSiteKey={recaptchaSiteKey}
                preview={preview}
              />
            ) : preview ? (
              <div className="flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-noah-ink-hairline px-6 text-center text-sm text-noah-ink-dim">
                Add a form to show it here
              </div>
            ) : null
          ) : block.heroMedia === "pdf" ? (
            block.pdfAssetId ? (
              <iframe
                title="Document"
                src={`/api/assets/${block.pdfAssetId}`}
                className="h-[min(72dvh,40rem)] w-full rounded-3xl border border-noah-ink-hairline bg-white"
              />
            ) : preview ? (
              <div className="flex min-h-48 items-center justify-center rounded-3xl border border-dashed border-noah-ink-hairline px-6 text-center text-sm text-noah-ink-dim">
                Upload a PDF
              </div>
            ) : null
          ) : (
            <HeroKpi />
          )}
        </div>
      </div>
    </section>
  );
}

function Feature({ block, preview }: { block: SectionBlock; preview: boolean }) {
  const textRight = block.textSide === "right";
  const fill = block.imageFit === "fill";
  return (
    <section className="grid grid-cols-1 border-y border-noah-ink-hairline lg:grid-cols-2">
      <div
        className={`flex items-center px-6 py-16 sm:px-12 lg:border-noah-ink-hairline ${
          textRight ? "lg:order-2 lg:border-l" : "lg:border-r"
        }`}
      >
        <div className="max-w-lg">
          {block.eyebrow ? (
            <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">{block.eyebrow}</p>
          ) : null}
          <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-noah-ink sm:text-5xl">{block.title}</h2>
          {block.body ? <p className="mt-5 font-body text-noah-ink-dim sm:text-lg">{block.body}</p> : null}
        </div>
      </div>
      {fill && block.imageAssetId ? (
        <div
          role={block.imageAlt ? "img" : undefined}
          aria-label={block.imageAlt || undefined}
          aria-hidden={block.imageAlt ? undefined : true}
          className={`min-h-72 bg-cover bg-center lg:min-h-0 ${textRight ? "lg:order-1" : ""}`}
          style={{ backgroundImage: `url(/api/assets/${block.imageAssetId})` }}
        />
      ) : (
        <div className={`flex items-center px-6 py-10 sm:px-12 ${textRight ? "lg:order-1" : ""}`}>
          <SlotImage assetId={block.imageAssetId} alt={block.imageAlt} preview={preview} className="min-h-64" />
        </div>
      )}
    </section>
  );
}

function Video({ block, preview }: { block: SectionBlock; preview: boolean }) {
  const youtube = youtubeId(block.videoUrl);
  return (
    <section className="px-6 py-24 sm:px-12 sm:py-32">
      {block.eyebrow || block.title || block.body ? (
        <div className="mx-auto max-w-3xl text-center">
          {block.eyebrow ? (
            <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">{block.eyebrow}</p>
          ) : null}
          {block.title ? (
            <h2 className="mt-4 font-display text-4xl leading-tight tracking-tight text-noah-ink sm:text-5xl">{block.title}</h2>
          ) : null}
          {block.body ? <p className="mx-auto mt-5 max-w-xl font-body text-noah-ink-dim sm:text-lg">{block.body}</p> : null}
        </div>
      ) : null}
      <div className="glass mx-auto mt-12 w-full max-w-5xl p-2 sm:p-3" style={{ borderRadius: "2rem" }}>
        <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-noah-ink">
          {block.videoAssetId ? (
            <video
              src={`/api/assets/${block.videoAssetId}`}
              controls
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : youtube ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${youtube}?rel=0`}
              title={block.title || "Video"}
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : preview ? (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-noah-cream/70">
              Add a YouTube link or upload a video
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Compare({ block }: { block: SectionBlock }) {
  return (
    <section className="px-6 py-20 sm:px-12">
      <h2 className="mx-auto max-w-4xl text-center font-display text-3xl leading-[1.08] tracking-tight text-noah-ink sm:text-5xl">
        {block.title}
      </h2>
      <div className="mx-auto mt-10 grid w-full max-w-5xl gap-4 sm:grid-cols-2 sm:gap-8">
        {block.items.map((item) => (
          <article key={item.id} className="glass h-full rounded-[1.75rem] p-6 text-left sm:p-10">
            <p className="font-display text-2xl tracking-tight sm:text-3xl">{item.title}</p>
            <ul className="mt-5 flex flex-col gap-3">
              {lines(item.body).map((line, lineIndex) => (
                <li key={`${item.id}-${lineIndex}`} className="flex items-start gap-3 font-body text-sm text-noah-ink-dim sm:text-base">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-noah-orange" />
                  {line}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function Process({ block }: { block: SectionBlock }) {
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
        <div>
          {block.eyebrow ? (
            <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">{block.eyebrow}</p>
          ) : null}
          <h2 className="mt-4 font-display text-4xl tracking-tight text-noah-ink sm:text-5xl">{block.title}</h2>
          {block.body ? <p className="mt-4 font-body text-noah-ink-dim sm:text-lg">{block.body}</p> : null}
        </div>
        <ol className="flex flex-col">
          {block.items.map((item, index) => (
            <li key={item.id} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-noah-ink-hairline py-5">
              <span className="font-display text-xl text-noah-orange">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-display text-2xl tracking-tight">{item.title}</p>
                {item.body ? <p className="mt-2 font-body text-sm text-noah-ink-dim">{item.body}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq({ block }: { block: SectionBlock }) {
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-3xl">
        {block.eyebrow ? (
          <p className="text-center font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">{block.eyebrow}</p>
        ) : null}
        <h2 className="mt-4 text-center font-display text-4xl tracking-tight text-noah-ink sm:text-5xl">{block.title}</h2>
        <div className="mt-10">
          {block.items.map((item) => (
            <details key={item.id} className="group border-t border-noah-ink-hairline py-5">
              <summary className="cursor-pointer list-none font-display text-xl tracking-tight sm:text-2xl [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-6">
                  {item.title}
                  <span className="text-noah-orange group-open:hidden">+</span>
                  <span className="hidden text-noah-orange group-open:inline">−</span>
                </span>
              </summary>
              {item.body ? <p className="mt-4 max-w-2xl font-body text-noah-ink-dim sm:text-lg">{item.body}</p> : null}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function planParts(item: SectionItem) {
  const [price = "", audience = "", ...features] = lines(item.body);
  return { price, audience, features };
}

function Pricing({ block }: { block: SectionBlock }) {
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl text-center">
        {block.eyebrow ? (
          <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">{block.eyebrow}</p>
        ) : null}
        <h2 className="mt-4 font-display text-4xl tracking-tight text-noah-ink sm:text-5xl">{block.title}</h2>
        <div className="mt-10 grid gap-4 text-left md:grid-cols-2">
          {block.items.map((item, index) => {
            const parts = planParts(item);
            return (
            <article
              key={item.id}
              className={`glass h-full rounded-[1.75rem] p-6 sm:p-8 ${index === 1 ? "ring-1 ring-noah-orange" : ""}`}
            >
              <p className="font-display text-2xl tracking-tight">{item.title}</p>
              <p className="mt-3 font-display text-3xl">{parts.price}</p>
              {parts.audience ? <p className="mt-2 font-body text-sm text-noah-ink-dim">{parts.audience}</p> : null}
              <ul className="mt-6 flex flex-col gap-2">
                {parts.features.map((feature, featureIndex) => (
                  <li key={`${item.id}-${featureIndex}`} className="flex items-start gap-3 font-body text-sm text-noah-ink-dim">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-noah-orange" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function proofParts(item: SectionItem) {
  const [figure = "", label = "", ...quote] = lines(item.body);
  return { figure, label, quote: quote.join(" ") };
}

function Proof({ block }: { block: SectionBlock }) {
  return (
    <section className="px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-5xl">
        {block.eyebrow ? (
          <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">{block.eyebrow}</p>
        ) : null}
        <h2 className="mt-4 font-display text-4xl tracking-tight text-noah-ink sm:text-5xl">{block.title}</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {block.items.map((item) => {
            const parts = proofParts(item);
            return (
              <article key={item.id} className="glass flex h-full flex-col rounded-[1.75rem] p-6 sm:p-8">
                <p className="font-display text-4xl tracking-tight text-noah-ink">{parts.figure}</p>
                <p className="mt-2 font-body text-sm text-noah-ink-dim">{parts.label}</p>
                <p className="mt-6 font-display text-2xl tracking-tight">{item.title}</p>
                {parts.quote ? <p className="mt-3 font-body text-sm leading-relaxed text-noah-ink-dim">{parts.quote}</p> : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Cta({ block, preview }: { block: SectionBlock; preview: boolean }) {
  return (
    <section className="px-6 py-24 text-center sm:px-12 sm:py-32">
      {block.eyebrow ? (
        <p className="font-body text-xs uppercase tracking-[0.18em] text-noah-ink-dim">{block.eyebrow}</p>
      ) : null}
      <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl tracking-tight text-noah-ink sm:text-6xl">{block.title}</h2>
      {block.body ? <p className="mx-auto mt-5 max-w-md font-body text-noah-ink-dim sm:text-lg">{block.body}</p> : null}
      {block.buttonLabel ? (
        <div className="mt-10">
          <OrangeButton label={block.buttonLabel} href={block.buttonHref} preview={preview} />
        </div>
      ) : null}
    </section>
  );
}

export default function SectionView({
  block,
  preview,
  form = null,
  flowSlug = "",
  pageId = "",
  recaptchaSiteKey = "",
}: {
  block: SectionBlock;
  preview: boolean;
  form?: FormBlock | null;
  flowSlug?: string;
  pageId?: string;
  recaptchaSiteKey?: string;
}) {
  if (block.template === "hero") {
    return (
      <Hero
        block={block}
        preview={preview}
        form={form}
        flowSlug={flowSlug}
        pageId={pageId}
        recaptchaSiteKey={recaptchaSiteKey}
      />
    );
  }
  if (block.template === "feature") return <Feature block={block} preview={preview} />;
  if (block.template === "video") return <Video block={block} preview={preview} />;
  if (block.template === "compare") return <Compare block={block} />;
  if (block.template === "process") return <Process block={block} />;
  if (block.template === "faq") return <Faq block={block} />;
  if (block.template === "pricing") return <Pricing block={block} />;
  if (block.template === "proof") return <Proof block={block} />;
  return <Cta block={block} preview={preview} />;
}
