import { NetflixHeader } from "@/components/public-alt/NetflixHeader";
import { NetflixBanner } from "@/components/public-alt/NetflixBanner";
import { NetflixSearchBar } from "@/components/public-alt/NetflixSearchBar";
import { NetflixCategoryPills } from "@/components/public-alt/NetflixCategoryPills";
import { NetflixCarouselRow } from "@/components/public-alt/NetflixCarouselRow";
import { NetflixTopTenRow } from "@/components/public-alt/NetflixTopTenRow";
import { NetflixBrowseGrid } from "@/components/public-alt/NetflixBrowseGrid";
import { NetflixFooter } from "@/components/public-alt/NetflixFooter";
import { stickerBackgroundStyle } from "@/components/public-alt/stickerBackground";
import {
  dummyFeaturedArticle,
  dummyLatestArticles,
  dummyMostDownloaded,
  dummyAllPublicArticles,
} from "@/lib/dummy-data";

// Homepage utama LENTERA (/), bertema gelap dengan pola interaksi ala Netflix:
// hero karya unggulan, pencarian, filter fakultas, carousel, dan baris Top 6.
// Header dan footer yang sama dipakai grup (public) lewat app/(public)/layout.tsx, supaya
// halaman publik lain (mis. /search) seragam dengan homepage ini.
// TODO: ganti data dummy dengan articleService.getHomepageSections() begitu database aktif.
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#141414]" style={stickerBackgroundStyle}>
      <NetflixHeader />
      <NetflixBanner variant="hero" eyebrow="Artikel unggulan" article={dummyFeaturedArticle} />

      <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-8 sm:px-10">
        <NetflixSearchBar />
        <NetflixCategoryPills />

        <NetflixCarouselRow title="Artikel terbaru" articles={dummyLatestArticles} />
        <NetflixTopTenRow articles={dummyAllPublicArticles} />
        <NetflixCarouselRow title="Paling banyak diunduh" articles={dummyMostDownloaded} />

        <NetflixBanner
          variant="feature"
          eyebrow={dummyMostDownloaded[0].categoryName}
          article={dummyMostDownloaded[0]}
        />

        <NetflixBrowseGrid articles={dummyAllPublicArticles} />
      </main>

      <NetflixFooter />
    </div>
  );
}
