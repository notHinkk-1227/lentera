"use client";

import { useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import type { NamedItem } from "@/lib/types";

export type { NamedItem };

type ActionResult = { error?: string };

// Daftar mengikuti `items` dari server: setelah action selesai, halaman di-revalidate dan
// props baru masuk, jadi tidak ada salinan state lokal yang bisa menyimpang dari database.
export function ManageListPanel({
  title,
  items,
  addPlaceholder,
  emptyLabel,
  onAdd,
  onRemove,
}: {
  title: string;
  items: NamedItem[];
  addPlaceholder: string;
  emptyLabel: string;
  onAdd: (name: string) => Promise<ActionResult>;
  onRemove: (id: string) => Promise<ActionResult>;
}) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    setError(null);
    startTransition(async () => {
      const result = await onAdd(trimmed);
      if (result.error) setError(result.error);
      else setDraft("");
    });
  }

  function handleRemove(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await onRemove(id);
      if (result.error) setError(result.error);
    });
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className="font-serif text-lg text-ink">{title}</h2>

      <form onSubmit={handleAdd} className="mt-4 flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={addPlaceholder}
          className="flex-1 rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-ink px-3.5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Tambah
        </button>
      </form>

      {error ? (
        <p role="alert" className="mt-3 rounded-md bg-status-rejected-soft px-3 py-2 text-sm text-status-rejected">
          {error}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="mt-5 text-sm text-ink-soft">{emptyLabel}</p>
      ) : (
        <ul className="mt-5 flex flex-col gap-1.5">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-ink hover:bg-paper"
            >
              {item.name}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                disabled={isPending}
                aria-label={`Hapus ${item.name}`}
                className="text-ink-soft hover:text-status-rejected"
              >
                <X className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
