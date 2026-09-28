import Link from "next/link";
import { Download, Heart, Eye } from "lucide-react";
import { NetflixArticleCover } from "@/components/public-alt/NetflixArticleCover";
import type { PublicArticle } from "@/lib/dummy-data";

function NetflixCoverCard({ article }: { article: PublicArticle }) {
  const badge = article.year >= 2026 ? "Baru" : article.downloadCount > 500 ? "Populer" : null;

  return (
    <div className="group relative w-[175px] shrink-0">
      <Link href={`/articles/${article.id}`} className="relative block">
        <NetflixArticleCover title={article.title} theme={article.coverTheme} />
        {badge ? (
          <span className="absolute left-1.5 top-1.5 rounded bg-[#D8432F] px-1.5 py-0.5 text-[10px] font-medium text-white">
            {badge}
          </span>
        ) : null}
      </Link>

      <div className="mt-2 flex items-center justify-between text-xs text-white/50">
        <span>{article.year}</span>
        <span className="flex items-center gap-1">
          <Download className="h-3 w-3" strokeWidth={1.75} />
          {article.downloadCount}
        </span>
      </div>

      {/* Hover card: muncul saat cursor di atas poster, murni CSS (group-hover) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex h-[215px] flex-col justify-end rounded-md bg-black/90 p-3 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
        <p className="line-clamp-2 text-xs font-medium leading-snug text-white">{article.title}</p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/55">{article.abstract}</p>
        <div className="mt-2 flex gap-1.5">
          <Link
            href={`/articles/${article.id}`}
            aria-label="Baca artikel"
            className="rounded bg-white p-1.5 text-black transition-opacity hover:opacity-90"
          >
            <Eye className="h-3.5 w-3.5" strokeWidth={2} />
          </Link>
          <button
            aria-label="Simpan artikel"
            className="rounded border border-white/25 p-1.5 text-white transition-colors hover:bg-white/10"
          >
            <Heart className="h-3.5 w-3.5" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function NetflixCarouselRow({
  title,
  articles,
}: {
  title: string;
  articles: PublicArticle[];
}) {
  return (
    <section>
      <h2 className="text-[17px] font-medium text-white">{title}</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2 pt-1">
        {articles.map((article) => (
          <NetflixCoverCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
