import Link from "next/link";
import { ArticleCover } from "@/components/public/ArticleCover";
import type { QueuedArticle } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Aksi setujui/tolak sengaja HANYA ada di halaman detail (/admin/[id]),
// supaya tidak ada dua tempat berbeda yang bisa memicu aksi yang sama —
// list ini murni untuk overview & triase cepat.
export function VerificationQueueItem({ article }: { article: QueuedArticle }) {
  return (
    <Link
      href={`/admin/${article.id}`}
      className="flex gap-5 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-ink"
    >
      <div className="w-[150px] shrink-0">
        <ArticleCover title={article.title} theme={article.coverTheme} size="sm" />
      </div>

      <div className="min-w-0 flex-1 py-1">
        <h3 className="font-serif text-lg leading-snug text-ink">{article.title}</h3>
        <p className="mt-1.5 text-sm text-ink-soft">
          {article.authorName} · {article.facultyName} · {article.year}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">
          {article.abstract}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {article.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-ink-soft"
            >
              {keyword}
            </span>
          ))}
        </div>

        <p className="mt-3 text-xs text-ink-soft">Diajukan {formatDate(article.submittedAt)}</p>
      </div>
    </Link>
  );
}
