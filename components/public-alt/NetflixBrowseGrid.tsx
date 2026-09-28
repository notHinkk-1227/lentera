import Link from "next/link";
import { Download } from "lucide-react";
import { NetflixArticleCover } from "@/components/public-alt/NetflixArticleCover";
import type { PublicArticle } from "@/lib/dummy-data";

// Sort pill di sini masih visual saja (belum benar-benar mengubah urutan) —
// cukup untuk perbandingan arah desain dengan klien. Kalau tema ini
// disetujui, sort sungguhan bisa disambungkan ke articleService nanti.
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

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.id}`}>
            <NetflixArticleCover title={article.title} theme={article.coverTheme} />
            <div className="mt-2 flex items-center justify-between text-xs text-white/50">
              <span>{article.year}</span>
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" strokeWidth={1.75} />
                {article.downloadCount}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
