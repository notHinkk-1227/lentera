import { NetflixHeader } from "@/components/public-alt/NetflixHeader";
import { NetflixHero } from "@/components/public-alt/NetflixHero";
import { NetflixSearchBar } from "@/components/public-alt/NetflixSearchBar";
import { NetflixCategoryPills } from "@/components/public-alt/NetflixCategoryPills";
import { NetflixCarouselRow } from "@/components/public-alt/NetflixCarouselRow";
import { NetflixTopTenRow } from "@/components/public-alt/NetflixTopTenRow";
import { NetflixSecondaryBanner } from "@/components/public-alt/NetflixSecondaryBanner";
import { NetflixBrowseGrid } from "@/components/public-alt/NetflixBrowseGrid";
import { NetflixFooter } from "@/components/public-alt/NetflixFooter";
import { stickerBackgroundStyle } from "@/components/public-alt/stickerBackground";
import {
  dummyFeaturedArticle,
  dummyLatestArticles,
  dummyMostDownloaded,
  dummyAllPublicArticles,
} from "@/lib/dummy-data";

// Versi ALTERNATIF homepage (arah "Netflix", tema gelap). Referensi:
// 1) UI kit portrait-poster (Bundle 26 Asylab) — hover card, filter pill
// 2) Screenshot Netflix asli — row "Top 10", badge label, footer
// Tidak menggantikan homepage formal di app/(public)/page.tsx — keduanya
// bisa diakses bersamaan:
//   /                  → versi formal-akademik
//   /homepage-netflix  → versi ini
export default function HomepageNetflixPage() {
  return (
    <div className="min-h-screen bg-[#141414]" style={stickerBackgroundStyle}>
      <NetflixHeader />
      <NetflixHero article={dummyFeaturedArticle} />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-8 sm:px-10">
        <NetflixSearchBar />
        <NetflixCategoryPills />

        <NetflixCarouselRow title="Artikel terbaru" articles={dummyLatestArticles} />
        <NetflixTopTenRow articles={dummyAllPublicArticles} />
        <NetflixCarouselRow title="Paling banyak diunduh" articles={dummyMostDownloaded} />

        <NetflixSecondaryBanner article={dummyMostDownloaded[0]} />

        <NetflixBrowseGrid articles={dummyAllPublicArticles} />
      </main>

      <NetflixFooter />
    </div>
  );
}
