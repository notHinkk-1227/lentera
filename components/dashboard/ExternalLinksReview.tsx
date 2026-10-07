import { ExternalLink } from "lucide-react";
import type { QueuedArticle } from "@/lib/types";

// Tautan yang diisi pengunggah, ditampilkan untuk admin sebelum karya diterbitkan. Admin
// membukanya langsung (bukan lewat /api/articles/[id]/download) supaya pemeriksaan tidak
// menambah hitungan unduhan.
export function ExternalLinksReview({
  links,
}: {
  links: Pick<QueuedArticle, "downloadUrl" | "scholarUrl" | "sintaUrl">;
}) {
  const rows = [
    { label: "Tautan unduh", url: links.downloadUrl, empty: "Tidak diisi (tombol Unduh tidak akan tampil)" },
    { label: "Google Scholar", url: links.scholarUrl, empty: "Tidak diisi (dibuat otomatis dari judul)" },
    { label: "SINTA", url: links.sintaUrl, empty: "Tidak diisi" },
  ];

  return (
    <dl className="divide-y divide-border rounded-lg border border-border bg-surface">
      {rows.map((row) => (
        <div key={row.label} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
          <dt className="w-36 shrink-0 text-sm text-ink-soft">{row.label}</dt>
          <dd className="min-w-0 flex-1 text-sm">
            {row.url ? (
              <a
                href={row.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex max-w-full items-center gap-1.5 text-ink underline-offset-2 hover:underline"
              >
                <span className="truncate">{row.url}</span>
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-soft" strokeWidth={1.75} />
              </a>
            ) : (
              <span className="text-ink-soft">{row.empty}</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
