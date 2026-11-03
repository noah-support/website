"use client";

import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BlockBody, type FlowPageLink } from "@/components/landing/BlockBody";
import {
  createBlock,
  createSection,
  FIELD_TARGETS,
  fieldTarget,
  formBlock,
  newId,
  pageWarnings,
  SECTION_CATALOG,
  sectionFields,
  sectionItemLabels,
  type Block,
  type FieldTarget,
  type FieldType,
  type FormField,
  type FormStep,
  type SectionBlock,
  type SectionTemplate,
  SPACER_MAX,
  SPACER_MIN,
  spacerHeight,
} from "@/lib/blocks";

const INSERTS: { type: Block["type"]; label: string }[] = [
  { type: "heading", label: "Heading" },
  { type: "text", label: "Text" },
  { type: "image", label: "Image" },
  { type: "button", label: "Button" },
  { type: "pdf", label: "PDF" },
  { type: "spacer", label: "Spacer" },
  { type: "form", label: "Form" },
];

export default function PageBuilder({
  flowId,
  pageId,
  flowSlug,
  pageSlug,
  isEntry,
  published,
  initialTitle,
  initialBlocks,
  pages,
}: {
  flowId: string;
  pageId: string;
  flowSlug: string;
  pageSlug: string;
  isEntry: boolean;
  published: boolean;
  initialTitle: string;
  initialBlocks: Block[];
  pages: FlowPageLink[];
}) {
  const [title, setTitle] = useState(initialTitle);
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedId, setSelectedId] = useState(initialBlocks[0]?.id ?? "");
  const [status, setStatus] = useState("");
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [addOpen, setAddOpen] = useState(true);
  const [editOpen, setEditOpen] = useState(true);
  const [dragReady, setDragReady] = useState(false);
  const [savedTick, setSavedTick] = useState(0);
  const selected = blocks.find((block) => block.id === selectedId) ?? null;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    setDragReady(true);
  }, []);

  useEffect(() => {
    function onLeave(event: BeforeUnloadEvent) {
      if (!dirty) return;
      event.preventDefault();
    }
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  function updateBlocks(next: Block[]) {
    setBlocks(next);
    setDirty(true);
    setStatus("");
  }

  function updateSelected(next: Block) {
    updateBlocks(blocks.map((block) => (block.id === next.id ? next : block)));
  }

  function addBlock(type: Block["type"]) {
    if (type === "form" && formBlock(blocks)) return;
    const block = createBlock(type);
    if (!block) return;
    updateBlocks([...blocks, block]);
    setSelectedId(block.id);
    setEditOpen(true);
  }

  function addSection(template: SectionTemplate) {
    const block = createSection(template);
    updateBlocks([...blocks, block]);
    setSelectedId(block.id);
    setEditOpen(true);
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = blocks.findIndex((block) => block.id === active.id);
    const to = blocks.findIndex((block) => block.id === over.id);
    if (from < 0 || to < 0) return;
    updateBlocks(arrayMove(blocks, from, to));
  }

  async function save(nextBlocks = blocks, nextTitle = title) {
    setBusy(true);
    setStatus("");
    const response = await fetch(`/api/admin/pages/${pageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: nextTitle, blocks: nextBlocks }),
    });
    const body = (await response.json()) as { error?: string };
    setBusy(false);
    if (!response.ok) {
      setStatus(body.error || "Could not save.");
      return false;
    }
    setDirty(false);
    setStatus("Saved");
    setSavedTick((tick) => tick + 1);
    return true;
  }

  async function askAi() {
    const text = prompt.trim();
    if (!text || busy) return;
    setBusy(true);
    setStatus("");
    const response = await fetch("/api/admin/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId, title, prompt: text, blocks }),
    });
    const body = (await response.json()) as { blocks?: Block[]; error?: string; notice?: string };
    setBusy(false);
    if (!response.ok || !body.blocks) {
      setStatus(body.error || "The model did not return a section.");
      return;
    }
    setBlocks(body.blocks);
    setDirty(false);
    setPrompt("");
    setStatus(body.notice || "Added to the page");
    const added = body.blocks[body.blocks.length - 1];
    if (added) setSelectedId(added.id);
  }

  const publicPath = isEntry ? `/f/${flowSlug}` : `/f/${flowSlug}/${pageSlug}`;
  const warnings = [...(dirty ? ["This page has unsaved changes."] : []), ...pageWarnings(blocks)];

  return (
    <div className="flex h-[calc(100dvh-4.5rem)] flex-col overflow-hidden lg:flex-row">
      <aside
        className={`flex min-h-0 shrink-0 flex-col border-b border-noah-ink-hairline bg-noah-cream lg:h-full lg:border-r lg:border-b-0 ${
          addOpen ? "max-h-[42%] lg:max-h-none lg:w-72" : "h-12 lg:h-full lg:w-12"
        }`}
      >
        <button
          type="button"
          onClick={() => setAddOpen((open) => !open)}
          aria-expanded={addOpen}
          className="flex h-12 shrink-0 items-center justify-between px-3 text-xs tracking-wide text-noah-ink-dim uppercase"
        >
          <span className={addOpen ? "" : "lg:[writing-mode:vertical-rl] lg:rotate-180"}>Add</span>
          <span aria-hidden>{addOpen ? "−" : "+"}</span>
        </button>
        {addOpen ? (
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
            <p className="mb-2 font-body text-xs text-noah-ink-dim">Elements</p>
            <div className="flex flex-col gap-2">
              {INSERTS.map((item) => {
                const disabled = item.type === "form" && Boolean(formBlock(blocks));
                return (
                  <button
                    key={item.type}
                    type="button"
                    disabled={disabled}
                    onClick={() => addBlock(item.type)}
                    className="rounded-2xl border border-noah-ink-hairline px-3 py-2 text-left text-sm text-noah-ink hover:border-noah-ink disabled:opacity-40"
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-6 mb-1 font-body text-xs text-noah-ink-dim">Sections</p>
            <p className="mb-3 font-body text-xs leading-relaxed text-noah-ink-dim">
              These keep the site style. Change the words and the image from the edit panel.
            </p>
            <div className="flex flex-col gap-2">
              {SECTION_CATALOG.map((item) => (
                <button
                  key={item.template}
                  type="button"
                  onClick={() => addSection(item.template)}
                  className="rounded-2xl border border-noah-ink-hairline px-3 py-3 text-left hover:border-noah-ink"
                >
                  <span className="block text-sm text-noah-ink">{item.name}</span>
                  <span className="mt-1 block font-body text-xs text-noah-ink-dim">{item.detail}</span>
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </aside>

      <section className="min-h-0 min-w-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col gap-4">
          <Link
            href={`/admin/flows/${flowId}`}
            onClick={(event) => {
              if (!dirty) return;
              if (!window.confirm("This page has unsaved changes. Leave without saving?")) event.preventDefault();
            }}
            className="w-fit font-body text-sm text-noah-ink-dim hover:text-noah-ink"
          >
            ← Back to flow
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setDirty(true);
                setStatus("");
              }}
              aria-label="Page title"
              className="min-w-0 flex-1 bg-transparent font-display text-3xl text-noah-ink outline-none"
            />
            <button
              type="button"
              onClick={() => save()}
              disabled={busy}
              className="relative h-10 min-w-24 overflow-hidden rounded-full bg-noah-ink px-4 text-sm text-noah-cream disabled:opacity-60"
            >
              <span key={savedTick} className={savedTick ? "save-confirm inline-flex items-center gap-2" : undefined}>
                {busy ? "Saving" : savedTick ? "Saved" : "Save"}
                {savedTick && !busy ? (
                  <span aria-hidden className="inline-block">
                    ✓
                  </span>
                ) : null}
              </span>
            </button>
          </div>
          {warnings.length ? (
            <ul className="flex flex-col gap-1 rounded-2xl border border-noah-orange/40 bg-noah-orange/10 px-4 py-3">
              {warnings.map((warning) => (
                <li key={warning} className="font-body text-sm text-noah-ink">
                  {warning}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="font-body text-xs text-noah-ink-dim">
            {published ? (
              <a href={publicPath} className="underline underline-offset-2">
                {publicPath}
              </a>
            ) : (
              "Publish the flow to open this page."
            )}
            {status ? <span className="ml-3 text-noah-ink">{status}</span> : null}
          </p>
          <div className="flex gap-2">
            <input
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask AI to build a section"
              className="contact-input"
              maxLength={2000}
            />
            <button
              type="button"
              onClick={askAi}
              disabled={busy || !prompt.trim()}
              className="h-12 shrink-0 rounded-full border border-noah-ink px-4 text-sm text-noah-ink disabled:opacity-40"
            >
              Build
            </button>
          </div>

          {dragReady ? (
            <DndContext id={`page-${pageId}`} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={blocks.map((block) => block.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-4">
                  {blocks.map((block) => (
                    <SortableBlock
                      key={block.id}
                      block={block}
                      selected={block.id === selectedId}
                      onSelect={() => setSelectedId(block.id)}
                      flowSlug={flowSlug}
                      pageId={pageId}
                      pages={pages}
                      form={formBlock(blocks)}
                      formEmbedded={
                        block.type === "form" &&
                        blocks.some((item) => item.type === "section" && item.template === "hero" && item.heroMedia === "form")
                      }
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="flex flex-col gap-4">
              {blocks.map((block) => (
                <BlockFrame
                  key={block.id}
                  selected={block.id === selectedId}
                  onSelect={() => setSelectedId(block.id)}
                >
                  <BlockBody
                    block={block}
                    flowSlug={flowSlug}
                    pageId={pageId}
                    pages={pages}
                    preview
                    recaptchaSiteKey=""
                    form={formBlock(blocks)}
                    formEmbedded={
                      block.type === "form" &&
                      blocks.some((item) => item.type === "section" && item.template === "hero" && item.heroMedia === "form")
                    }
                  />
                </BlockFrame>
              ))}
            </div>
          )}
        </div>
      </section>

      <aside
        className={`flex min-h-0 shrink-0 flex-col border-t border-noah-ink-hairline bg-noah-cream lg:h-full lg:border-t-0 lg:border-l ${
          editOpen ? "max-h-[46%] lg:max-h-none lg:w-80" : "h-12 lg:h-full lg:w-12"
        }`}
      >
        <button
          type="button"
          onClick={() => setEditOpen((open) => !open)}
          aria-expanded={editOpen}
          className="flex h-12 shrink-0 items-center justify-between px-3 text-xs tracking-wide text-noah-ink-dim uppercase"
        >
          <span className={editOpen ? "" : "lg:[writing-mode:vertical-rl] lg:rotate-180"}>Edit</span>
          <span aria-hidden>{editOpen ? "−" : "+"}</span>
        </button>
        {editOpen ? (
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {selected ? (
              <Inspector
                block={selected}
                pages={pages.filter((page) => page.id !== pageId)}
                onChange={updateSelected}
                onRemove={() => {
                  updateBlocks(blocks.filter((block) => block.id !== selected.id));
                  setSelectedId(blocks.find((block) => block.id !== selected.id)?.id ?? "");
                }}
              />
            ) : (
              <p className="font-body text-sm text-noah-ink-dim">Select a block to edit it.</p>
            )}
          </div>
        ) : null}
      </aside>
    </div>
  );
}

function BlockFrame({
  selected,
  onSelect,
  drag,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  drag?: {
    setNodeRef: (element: HTMLElement | null) => void;
    style?: { transform?: string; transition?: string };
    attributes: HTMLAttributes<HTMLButtonElement>;
    listeners?: HTMLAttributes<HTMLButtonElement>;
  };
  children: ReactNode;
}) {
  return (
    <div
      ref={drag?.setNodeRef}
      style={drag?.style}
      className={`rounded-3xl p-3 ${selected ? "ring-2 ring-noah-orange" : "ring-1 ring-transparent hover:ring-noah-ink-hairline"}`}
      onClick={onSelect}
    >
      <button
        type="button"
        className="mb-2 cursor-grab font-body text-xs text-noah-ink-dim"
        aria-label="Drag to reorder"
        {...drag?.attributes}
        {...drag?.listeners}
      >
        Drag
      </button>
      {children}
    </div>
  );
}

function SortableBlock({
  block,
  selected,
  onSelect,
  flowSlug,
  pageId,
  pages,
  form,
  formEmbedded,
}: {
  block: Block;
  selected: boolean;
  onSelect: () => void;
  flowSlug: string;
  pageId: string;
  pages: FlowPageLink[];
  form: ReturnType<typeof formBlock>;
  formEmbedded: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: block.id });
  return (
    <BlockFrame
      selected={selected}
      onSelect={onSelect}
      drag={{
        setNodeRef,
        style: { transform: CSS.Transform.toString(transform), transition },
        attributes,
        listeners,
      }}
    >
      <BlockBody
        block={block}
        flowSlug={flowSlug}
        pageId={pageId}
        pages={pages}
        preview
        recaptchaSiteKey=""
        form={form}
        formEmbedded={formEmbedded}
      />
    </BlockFrame>
  );
}

function Inspector({
  block,
  pages,
  onChange,
  onRemove,
}: {
  block: Block;
  pages: FlowPageLink[];
  onChange: (block: Block) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-body text-xs tracking-wide text-noah-ink-dim uppercase">
          {block.type === "section" ? (SECTION_CATALOG.find((item) => item.template === block.template)?.name ?? "Section") : block.type}
        </p>
        <button type="button" onClick={onRemove} className="text-sm text-noah-orange">
          Remove
        </button>
      </div>
      {block.type === "heading" ? (
        <>
          <label className="flex flex-col gap-2 text-sm">
            Size
            <select
              className="contact-input contact-select"
              value={block.level}
              onChange={(event) => onChange({ ...block, level: Number(event.target.value) as 1 | 2 | 3 })}
            >
              <option value={1}>Large</option>
              <option value={2}>Medium</option>
              <option value={3}>Small</option>
            </select>
          </label>
          <TextLabel label="Text" value={block.text} onChange={(text) => onChange({ ...block, text })} />
        </>
      ) : null}
      {block.type === "text" ? (
        <TextLabel label="Text" value={block.text} rows={8} onChange={(text) => onChange({ ...block, text })} />
      ) : null}
      {block.type === "image" ? (
        <>
          <FileField
            accept="image/jpeg,image/png,image/webp,image/gif"
            label={block.assetId ? "Replace image" : "Upload image"}
            onUploaded={(assetId) => onChange({ ...block, assetId })}
          />
          <TextLabel label="Alt text" value={block.alt} onChange={(alt) => onChange({ ...block, alt })} />
        </>
      ) : null}
      {block.type === "pdf" ? (
        <FileField
          accept="application/pdf"
          label={block.assetId ? "Replace PDF" : "Upload PDF"}
          onUploaded={(assetId) => onChange({ ...block, assetId })}
        />
      ) : null}
      {block.type === "spacer" ? (
        <label className="flex flex-col gap-2 text-sm">
          Height in pixels
          <input
            type="number"
            className="contact-input"
            min={SPACER_MIN}
            max={SPACER_MAX}
            step={8}
            value={block.height}
            onChange={(event) =>
              onChange({ ...block, height: Math.min(SPACER_MAX, Math.max(0, Math.round(Number(event.target.value) || 0))) })
            }
            onBlur={() => onChange({ ...block, height: spacerHeight(block.height) })}
          />
          <span className="font-body text-xs text-noah-ink-dim">
            Between {SPACER_MIN} and {SPACER_MAX}.
          </span>
        </label>
      ) : null}
      {block.type === "button" ? (
        <>
          <TextLabel label="Button text" value={block.label} onChange={(label) => onChange({ ...block, label })} />
          <PageSelect
            label="Opens"
            value={block.targetPageId}
            pages={pages}
            onChange={(targetPageId) => onChange({ ...block, targetPageId })}
          />
        </>
      ) : null}
      {block.type === "form" ? (
        <FormInspector block={block} pages={pages} onChange={onChange} />
      ) : null}
      {block.type === "section" ? <SectionInspector block={block} onChange={onChange} /> : null}
    </div>
  );
}

function SectionInspector({ block, onChange }: { block: SectionBlock; onChange: (block: Block) => void }) {
  const fields = sectionFields(block.template);
  const labels = sectionItemLabels(block.template);
  const name = SECTION_CATALOG.find((item) => item.template === block.template)?.name ?? "Section";

  function updateItem(id: string, next: SectionBlock["items"][number]) {
    onChange({ ...block, items: block.items.map((item) => (item.id === id ? next : item)) });
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-body text-sm text-noah-ink">{name}</p>
      <p className="font-body text-xs leading-relaxed text-noah-ink-dim">
        The layout stays as it is. A button keeps its place. You can change its words and its link.
      </p>
      {fields.eyebrow ? (
        <TextLabel label="Eyebrow" value={block.eyebrow} onChange={(eyebrow) => onChange({ ...block, eyebrow })} />
      ) : null}
      <TextLabel label="Heading" value={block.title} onChange={(title) => onChange({ ...block, title })} />
      {fields.body ? (
        <TextLabel label="Text" rows={5} value={block.body} onChange={(body) => onChange({ ...block, body })} />
      ) : null}
      {fields.heroChoice ? (
        <label className="flex flex-col gap-2 text-sm">
          Right side
          <select
            className="contact-input contact-select"
            value={block.heroMedia}
            onChange={(event) =>
              onChange({
                ...block,
                heroMedia: event.target.value === "form" || event.target.value === "pdf" ? event.target.value : "kpi",
              })
            }
          >
            <option value="kpi">KPI</option>
            <option value="form">Form</option>
            <option value="pdf">PDF</option>
          </select>
        </label>
      ) : null}
      {fields.heroChoice && block.heroMedia === "pdf" ? (
        <FileField
          accept="application/pdf"
          label={block.pdfAssetId ? "Replace PDF" : "Upload PDF"}
          onUploaded={(pdfAssetId) => onChange({ ...block, pdfAssetId })}
        />
      ) : null}
      {fields.button ? (
        <>
          <TextLabel label="Button text" value={block.buttonLabel} onChange={(buttonLabel) => onChange({ ...block, buttonLabel })} />
          <TextLabel
            label="Link"
            value={block.buttonHref}
            placeholder="/book or https://"
            onChange={(buttonHref) => onChange({ ...block, buttonHref })}
          />
        </>
      ) : null}
      {fields.image ? (
        <>
          <label className="flex flex-col gap-2 text-sm">
            Text side
            <select
              className="contact-input contact-select"
              value={block.textSide}
              onChange={(event) => onChange({ ...block, textSide: event.target.value === "right" ? "right" : "left" })}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </label>
          <FileField
            accept="image/jpeg,image/png,image/webp,image/gif"
            label={block.imageAssetId ? "Replace image" : "Upload image"}
            onUploaded={(imageAssetId) => onChange({ ...block, imageAssetId })}
          />
          <label className="flex flex-col gap-2 text-sm">
            Image display
            <select
              className="contact-input contact-select"
              value={block.imageFit}
              onChange={(event) => onChange({ ...block, imageFit: event.target.value === "fill" ? "fill" : "fit" })}
            >
              <option value="fit">Fit: the whole image, with space around it</option>
              <option value="fill">Fill: covers its half, edge to edge</option>
            </select>
          </label>
          <TextLabel label="Image description" value={block.imageAlt} onChange={(imageAlt) => onChange({ ...block, imageAlt })} />
        </>
      ) : null}
      {fields.video ? (
        <>
          <TextLabel
            label="YouTube link"
            value={block.videoUrl}
            placeholder="https://www.youtube.com/watch?v="
            onChange={(videoUrl) => onChange({ ...block, videoUrl })}
          />
          <p className="font-body text-xs leading-relaxed text-noah-ink-dim">Or upload a video. An uploaded file is used before the link.</p>
          <FileField
            accept="video/mp4,video/webm"
            label={block.videoAssetId ? "Replace video" : "Upload video"}
            onUploaded={(videoAssetId) => onChange({ ...block, videoAssetId })}
          />
          {block.videoAssetId ? (
            <button
              type="button"
              className="text-left text-sm text-noah-orange"
              onClick={() => onChange({ ...block, videoAssetId: "" })}
            >
              Remove uploaded video
            </button>
          ) : null}
        </>
      ) : null}
      {fields.items
        ? block.items.map((item, index) => (
            <fieldset key={item.id} className="flex flex-col gap-3 border-t border-noah-ink-hairline pt-4">
              <legend className="font-body text-sm">
                {labels.title} {index + 1}
              </legend>
              <TextLabel label={labels.title} value={item.title} onChange={(title) => updateItem(item.id, { ...item, title })} />
              <TextLabel label={labels.body} rows={4} value={item.body} onChange={(body) => updateItem(item.id, { ...item, body })} />
              {block.items.length > 1 ? (
                <button
                  type="button"
                  className="text-left text-sm text-noah-orange"
                  onClick={() => onChange({ ...block, items: block.items.filter((entry) => entry.id !== item.id) })}
                >
                  Remove
                </button>
              ) : null}
            </fieldset>
          ))
        : null}
      {fields.items && block.items.length < 8 ? (
        <button
          type="button"
          className="rounded-full border border-noah-ink-hairline px-4 py-2 text-sm"
          onClick={() => onChange({ ...block, items: [...block.items, { id: newId(), title: "", body: "" }] })}
        >
          Add {labels.title.toLowerCase()}
        </button>
      ) : null}
    </div>
  );
}

function FormInspector({
  block,
  pages,
  onChange,
}: {
  block: Extract<Block, { type: "form" }>;
  pages: FlowPageLink[];
  onChange: (block: Block) => void;
}) {
  function updateStep(stepId: string, next: FormStep) {
    onChange({ ...block, steps: block.steps.map((step) => (step.id === stepId ? next : step)) });
  }

  return (
    <div className="flex flex-col gap-5">
      <TextLabel
        label="HubSpot form name"
        value={block.formName}
        placeholder="Same name as in HubSpot"
        onChange={(formName) => onChange({ ...block, formName })}
      />
      <p className="font-body text-xs leading-relaxed text-noah-ink-dim">
        Every submission is sent to the webhook with this name. HubSpot accepts it only when the names match.
      </p>
      <PageSelect
        label="After submit, open"
        value={block.targetPageId}
        pages={pages}
        onChange={(targetPageId) => onChange({ ...block, targetPageId })}
      />
      {block.steps.map((step, index) => (
        <fieldset key={step.id} className="flex flex-col gap-3 border-t border-noah-ink-hairline pt-4">
          <legend className="font-body text-sm text-noah-ink">Step {index + 1}</legend>
          <TextLabel label="Step title" value={step.title} onChange={(title) => updateStep(step.id, { ...step, title })} />
          {step.fields.map((field) => (
            <FieldEditor
              key={field.id}
              field={field}
              onChange={(next) =>
                updateStep(step.id, { ...step, fields: step.fields.map((item) => (item.id === field.id ? next : item)) })
              }
              onRemove={
                step.fields.length > 1
                  ? () => updateStep(step.id, { ...step, fields: step.fields.filter((item) => item.id !== field.id) })
                  : undefined
              }
            />
          ))}
          <button
            type="button"
            className="text-left text-sm text-noah-ink"
            onClick={() =>
              updateStep(step.id, {
                ...step,
                fields: [...step.fields, { id: newId(), type: "text", label: "New field", required: false, options: [], split: false, mapTo: "" }],
              })
            }
          >
            Add field
          </button>
          {block.steps.length > 1 ? (
            <button
              type="button"
              className="text-left text-sm text-noah-orange"
              onClick={() => onChange({ ...block, steps: block.steps.filter((item) => item.id !== step.id) })}
            >
              Remove step
            </button>
          ) : null}
        </fieldset>
      ))}
      <button
        type="button"
        className="rounded-full border border-noah-ink-hairline px-4 py-2 text-sm"
        onClick={() =>
          onChange({
            ...block,
            steps: [
              ...block.steps,
              {
                id: newId(),
                title: `Step ${block.steps.length + 1}`,
                fields: [{ id: newId(), type: "text", label: "New field", required: false, options: [], split: false, mapTo: "" }],
              },
            ],
          })
        }
      >
        Add step
      </button>
    </div>
  );
}

function FieldEditor({
  field,
  onChange,
  onRemove,
}: {
  field: FormField;
  onChange: (field: FormField) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-white/40 p-3">
      <TextLabel label="Label" value={field.label} onChange={(label) => onChange({ ...field, label })} />
      <label className="flex flex-col gap-2 text-sm">
        Type
        <select
          className="contact-input contact-select"
          value={field.type}
          onChange={(event) => {
            const type = event.target.value as FieldType;
            onChange({
              ...field,
              type,
              split: type === "text" ? field.split : false,
              options: type === "select" && field.options.length === 0 ? ["Option 1", "Option 2"] : field.options,
            });
          }}
        >
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="textarea">Long text</option>
          <option value="select">Dropdown</option>
          <option value="checkbox">Checkbox</option>
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(event) => onChange({ ...field, required: event.target.checked })}
        />
        Required
      </label>
      {field.type === "text" ? (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={field.split}
            onChange={(event) => onChange({ ...field, split: event.target.checked, mapTo: "" })}
          />
          Separate name fields
        </label>
      ) : null}
      {field.split ? (
        <p className="font-body text-xs leading-relaxed text-noah-ink-dim">
          Shows First name and Last name. HubSpot gets both joined as the name.
        </p>
      ) : (
        <label className="flex flex-col gap-2 text-sm">
          Sends to HubSpot as
          <select
            className="contact-input contact-select"
            value={field.mapTo}
            onChange={(event) => onChange({ ...field, mapTo: event.target.value as FieldTarget })}
          >
            {FIELD_TARGETS.map((target) => (
              <option key={target.value} value={target.value}>
                {target.value
                  ? target.label
                  : `Automatic (${FIELD_TARGETS.find((item) => item.value === fieldTarget({ ...field, mapTo: "" }))?.label})`}
              </option>
            ))}
          </select>
        </label>
      )}
      {field.type === "select" ? (
        <TextLabel
          label="Options, one per line"
          rows={4}
          value={field.options.join("\n")}
          onChange={(value) => onChange({ ...field, options: value.split("\n").map((item) => item.trim()).filter(Boolean) })}
        />
      ) : null}
      {onRemove ? (
        <button type="button" onClick={onRemove} className="text-left text-sm text-noah-orange">
          Remove field
        </button>
      ) : null}
    </div>
  );
}

function PageSelect({
  label,
  value,
  pages,
  onChange,
}: {
  label: string;
  value: string;
  pages: FlowPageLink[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      {label}
      <select className="contact-input contact-select" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Choose a page</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.title}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextLabel({
  label,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      {label}
      {rows ? (
        <textarea className="contact-input contact-textarea" rows={rows} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input className="contact-input" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      )}
    </label>
  );
}

function FileField({
  accept,
  label,
  onUploaded,
}: {
  accept: string;
  label: string;
  onUploaded: (assetId: string) => void;
}) {
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  return (
    <label className="flex flex-col gap-2 text-sm">
      {label}
      <input
        type="file"
        accept={accept}
        disabled={uploading}
        className="text-sm"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          setUploading(true);
          setError("");
          const body = new FormData();
          body.set("file", file);
          const response = await fetch("/api/admin/assets", { method: "POST", body });
          const payload = (await response.json()) as { id?: string; error?: string };
          setUploading(false);
          if (!response.ok || !payload.id) {
            setError(payload.error || "Upload failed.");
            return;
          }
          onUploaded(payload.id);
        }}
      />
      {uploading ? <span className="text-xs text-noah-ink-dim">Uploading</span> : null}
      {error ? <span className="text-xs text-noah-orange">{error}</span> : null}
    </label>
  );
}
