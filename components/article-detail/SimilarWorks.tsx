import Link from "next/link";
import { Compass } from "lucide-react";
import { WORK_TYPE_LABEL, type SimilarArticle } from "@/lib/dummy-article-detail";

// Sidebar "Karya serupa". Berbeda dari referensi, tidak ada persentase kemiripan: yang
// ditampilkan adalah alasannya (topik roadmap, SDG, kata kunci, kategori).
export function SimilarWorks({ items }: { items: SimilarArticle[] }) {
  return (
    <aside className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
        <Compass className="h-4 w-4 text-[#E5493A]" strokeWidth={1.75} />
        Karya serupa
      </h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-white/50">Belum ada karya lain dengan topik, SDG, atau kata kunci yang sama.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {items.map(({ article, reasons }) => (
            <li key={article.id}>
              <Link
                href={`/articles/${article.id}`}
                className="block rounded-lg border border-white/10 p-3.5 transition-colors hover:border-white/25 hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              >
                <p className="line-clamp-2 text-sm font-medium leading-snug text-white">{article.title}</p>
                <p className="mt-1 text-xs text-white/50">{article.categoryName}</p>
                <p className="mt-0.5 text-xs text-white/40">
                  {article.year} · {WORK_TYPE_LABEL[article.type]}
                </p>
                <p className="mt-2 text-[11px] leading-snug text-[#E5493A]">{reasons.join(" · ")}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
