import Link from "next/link";
import { Download } from "lucide-react";
import { NetflixArticleCover } from "@/components/public-alt/NetflixArticleCover";
import type { PublicArticle } from "@/lib/dummy-data";

function getBadge(article: PublicArticle) {
  if (article.year >= 2026) return "Baru";
  if (article.downloadCount > 500) return "Populer";
  return null;
}

// Kartu karya yang dipakai SEMUA baris homepage (carousel, Top 6, jelajahi semua),
// supaya ukuran, badge, hover, dan baris info-nya seragam. Seluruh kartu adalah satu
// Link: klik di mana pun pada cover membuka halaman detail.
// Lebar diatur oleh pemakai lewat `className` (mis. "w-[175px] shrink-0" atau "w-full").
export function NetflixArticleCard({
  article,
  className = "",
}: {
  article: PublicArticle;
  className?: string;
}) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className={`group block rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60 ${className}`}
    >
      <NetflixArticleCover
        title={article.title}
        theme={article.coverTheme}
        badge={getBadge(article)}
        abstract={article.abstract}
      />
      <div className="mt-2 flex items-center justify-between text-xs text-white/50">
        <span>{article.year}</span>
        <span className="flex items-center gap-1">
          <Download className="h-3 w-3" strokeWidth={1.75} />
          {article.downloadCount}
        </span>
      </div>
    </Link>
  );
}
