import Link from "next/link";
import { NetflixArticleCover } from "@/components/public-alt/NetflixArticleCover";
import type { PublicArticle } from "@/lib/dummy-data";

export function NetflixTopTenRow({ articles }: { articles: PublicArticle[] }) {
  const ranked = [...articles].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 6);

  return (
    <section>
      <h2 className="text-[17px] font-medium text-white">Top 6 paling banyak diunduh</h2>
      <div className="mt-4 flex gap-1 overflow-x-auto pb-2">
        {ranked.map((article, i) => (
          <div key={article.id} className="flex shrink-0 items-end">
            <span
              className="select-none pb-1 pr-1 text-[90px] font-medium leading-none text-white/10"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <Link href={`/articles/${article.id}`} className="w-[150px] shrink-0">
              <NetflixArticleCover title={article.title} theme={article.coverTheme} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
