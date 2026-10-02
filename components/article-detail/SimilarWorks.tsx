import Link from "next/link";
import { WORK_TYPE_LABEL, type SimilarArticle } from "@/lib/dummy-article-detail";

// "Karya serupa". Berbeda dari referensi, tidak ada persentase kemiripan: yang ditampilkan
// adalah alasannya (topik roadmap, SDG, kata kunci, kategori).
export function SimilarWorks({ items }: { items: SimilarArticle[] }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-white">Karya serupa</h2>

      {items.length === 0 ? (
        <p className="mt-4 text-sm leading-relaxed text-white/50">
          Belum ada karya lain dengan topik, SDG, atau kata kunci yang sama.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
          {items.map(({ article, reasons }) => (
            <li key={article.id}>
              <Link
                href={`/articles/${article.id}`}
                className="group block py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
              >
                <p className="line-clamp-2 text-sm font-medium leading-snug text-white group-hover:underline group-hover:underline-offset-4">
                  {article.title}
                </p>
                <p className="mt-1.5 text-xs text-white/50">
                  {article.categoryName}, {article.year}, {WORK_TYPE_LABEL[article.type]}
                </p>
                <p className="mt-1 text-xs text-[#FF8A7D]">{reasons.join(", ")}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
