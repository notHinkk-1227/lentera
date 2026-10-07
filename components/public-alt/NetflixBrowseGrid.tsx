import { NetflixArticleCard } from "@/components/public-alt/NetflixArticleCard";
import type { PublicArticle } from "@/lib/types";

// Sort pill di sini masih visual saja (belum benar-benar mengubah urutan).
// TODO: sambungkan ke articleService begitu database aktif.
const SORT_OPTIONS = ["Terbaru", "Tahun", "A-Z"];

export function NetflixBrowseGrid({ articles }: { articles: PublicArticle[] }) {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[17px] font-medium text-white">Jelajahi semua</h2>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((option, i) => (
            <span
              key={option}
              className={`rounded-full px-3 py-1 text-xs ${
                i === 0 ? "bg-[#D8432F] text-white" : "bg-white/8 text-white/50"
              }`}
            >
              {option}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {articles.map((article) => (
          <NetflixArticleCard key={article.id} article={article} className="w-full" />
        ))}
      </div>
    </section>
  );
}
