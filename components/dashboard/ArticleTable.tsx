import { StatusBadge } from "@/components/dashboard/StatusBadge";
import type { DashboardArticle } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function ArticleTable({ articles }: { articles: DashboardArticle[] }) {
  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border px-6 py-14 text-center">
        <p className="font-serif text-lg text-ink">Belum ada artikel</p>
        <p className="mt-1 text-sm text-ink-soft">
          Artikel yang kamu unggah akan muncul di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-ink-soft">
            <th className="px-5 py-3 font-medium">Judul</th>
            <th className="px-5 py-3 font-medium">Tahun</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Diunggah</th>
            <th className="px-5 py-3 font-medium">Unduhan</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b border-border last:border-0">
              <td className="max-w-sm px-5 py-4">
                <p className="line-clamp-2 font-medium text-ink">{article.title}</p>
                {article.status === "REJECTED" && article.rejectedNote ? (
                  <p className="mt-1 text-xs text-status-rejected">
                    Catatan: {article.rejectedNote}
                  </p>
                ) : null}
              </td>
              <td className="px-5 py-4 text-ink-soft">{article.year}</td>
              <td className="px-5 py-4">
                <StatusBadge status={article.status} />
              </td>
              <td className="px-5 py-4 text-ink-soft">{formatDate(article.createdAt)}</td>
              <td className="px-5 py-4 text-ink-soft">
                {article.status === "PUBLISHED" ? article.downloadCount : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
