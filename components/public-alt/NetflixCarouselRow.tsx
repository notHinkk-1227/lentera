import { NetflixArticleCard } from "@/components/public-alt/NetflixArticleCard";
import { NetflixRow } from "@/components/public-alt/NetflixRow";
import type { PublicArticle } from "@/lib/dummy-data";

export function NetflixCarouselRow({
  title,
  articles,
}: {
  title: string;
  articles: PublicArticle[];
}) {
  return (
    <NetflixRow title={title}>
      {articles.map((article) => (
        <NetflixArticleCard key={article.id} article={article} className="w-[175px] shrink-0" />
      ))}
    </NetflixRow>
  );
}
