import { NetflixArticleCard } from "@/components/public-alt/NetflixArticleCard";
import { NetflixRow } from "@/components/public-alt/NetflixRow";
import type { PublicArticle } from "@/lib/dummy-data";

export function NetflixTopTenRow({ articles }: { articles: PublicArticle[] }) {
  const ranked = [...articles].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 6);

  return (
    <NetflixRow title="Top 6 paling banyak diunduh">
      {ranked.map((article, i) => (
        <div key={article.id} className="flex shrink-0 items-end">
          {/* mb-6 = tinggi baris info di bawah cover, supaya angka sejajar dengan dasar cover */}
          <span
            className="mb-6 select-none pr-2 text-[90px] font-medium leading-none text-white/10"
            style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <NetflixArticleCard article={article} className="w-[175px] shrink-0" />
        </div>
      ))}
    </NetflixRow>
  );
}
