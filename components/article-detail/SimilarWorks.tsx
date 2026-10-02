import Link from "next/link";
import { Compass } from "lucide-react";
import { WORK_TYPE_LABEL, type SimilarArticle } from "@/lib/dummy-article-detail";

// "Karya serupa". Berbeda dari referensi, tidak ada persentase kemiripan: yang ditampilkan
// adalah alasannya (topik roadmap, SDG, kata kunci, kategori).
export function SimilarWorks({ items }: { items: SimilarArticle[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#181818] p-5">
      <h2 className="flex items-center gap-2 text-base font-semibold text-white">
        <Compass className="h-4 w-4 text-[#E5493A]" strokeWidth={1.75} />
        Karya serupa
      </h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm text-white/50">Belum ada karya lain dengan topik, SDG, atau kata kunci yang sama.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2.5">
          {items.map(({ article, reasons }) => (
            <li key={article.id}>
              <Link
                href={`/articles/${article.id}`}
                className="block rounded-lg border border-white/10 bg-white/[0.02] p-3.5 transition-colors hover:border-white/25 hover:bg-white/[0.06] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              >
                <p className="line-clamp-2 text-sm font-medium leading-snug text-white">{article.title}</p>
                <p className="mt-1.5 text-xs text-white/50">
                  {article.categoryName} · {article.year} · {WORK_TYPE_LABEL[article.type]}
                </p>
                <p className="mt-2 text-[11px] leading-snug text-[#FF8A7D]">{reasons.join(" · ")}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
