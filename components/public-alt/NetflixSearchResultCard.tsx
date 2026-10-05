import Link from "next/link";
import { Download } from "lucide-react";
import { NetflixArticleCover } from "@/components/public-alt/NetflixArticleCover";
import type { PublicArticle } from "@/lib/dummy-data";

// Kartu hasil di /search. Cover-nya sama dengan kartu di homepage; `group` pada Link
// memicu efek hover cover.
export function NetflixSearchResultCard({ article }: { article: PublicArticle }) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="group flex gap-5 rounded-md bg-white/5 p-4 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
    >
      <div className="w-[120px] shrink-0 sm:w-[140px]">
        <NetflixArticleCover title={article.title} theme={article.coverTheme} />
      </div>

      <div className="min-w-0 flex-1 py-1">
        <span className="text-xs font-medium text-[#E5493A]">{article.categoryName}</span>
        <h3 className="mt-1.5 line-clamp-2 text-lg font-medium leading-snug text-white">
          {article.title}
        </h3>
        <p className="mt-1.5 text-sm text-white/60">
          {article.authorName} · {article.facultyName} · {article.year}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/50">
          {article.abstract}
        </p>
        <p className="mt-3 flex items-center gap-1 text-xs text-white/40">
          <Download className="h-3 w-3" strokeWidth={1.75} />
          {article.downloadCount}
        </p>
      </div>
    </Link>
  );
}
