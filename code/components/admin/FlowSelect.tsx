"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function FlowSelect({
  flows,
  value,
}: {
  flows: { id: string; name: string }[];
  value: string;
}) {
  const router = useRouter();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const options = useMemo(() => {
    const all = [{ id: "", name: "All flows" }, ...flows];
    const needle = query.trim().toLowerCase();
    if (!needle) return all;
    return all.filter((flow) => flow.name.toLowerCase().includes(needle));
  }, [flows, query]);
  const current = flows.find((flow) => flow.id === value)?.name ?? "All flows";

  useEffect(() => {
    function onPointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, []);

  function choose(id: string) {
    setOpen(false);
    setQuery("");
    const href = id ? `/admin/submissions?flow=${id}` : "/admin/submissions";
    router.push(href);
  }

  return (
    <div ref={rootRef} className="relative w-full max-w-xs">
      <label className="mb-2 block font-body text-xs tracking-wide text-noah-ink-dim uppercase" htmlFor={`${listId}-input`}>
        Flow
      </label>
      <input
        id={`${listId}-input`}
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        value={open ? query : current}
        placeholder="Search flows"
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "Enter" && options[0]) {
            event.preventDefault();
            choose(options[0].id);
          }
        }}
        className="contact-input"
      />
      {open ? (
        <ul id={listId} role="listbox" className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-noah-ink-hairline bg-noah-cream py-1 shadow-lg">
          {options.length === 0 ? (
            <li className="px-3 py-2 font-body text-sm text-noah-ink-dim">No matching flow</li>
          ) : (
            options.map((flow) => {
              const selected = flow.id === value;
              return (
                <li key={flow.id || "all"} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => choose(flow.id)}
                    className={`w-full px-3 py-2 text-left text-sm ${selected ? "text-noah-ink" : "text-noah-ink-dim hover:text-noah-ink"}`}
                  >
                    {flow.name}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}
    </div>
  );
}
