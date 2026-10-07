import { NetflixHeader } from "@/components/public-alt/NetflixHeader";
import { NetflixBanner } from "@/components/public-alt/NetflixBanner";
import { NetflixSearchBar } from "@/components/public-alt/NetflixSearchBar";
import { NetflixCategoryPills } from "@/components/public-alt/NetflixCategoryPills";
import { NetflixCarouselRow } from "@/components/public-alt/NetflixCarouselRow";
import { NetflixTopTenRow } from "@/components/public-alt/NetflixTopTenRow";
import { NetflixBrowseGrid } from "@/components/public-alt/NetflixBrowseGrid";
import { NetflixFooter } from "@/components/public-alt/NetflixFooter";
import { stickerBackgroundStyle } from "@/components/public-alt/stickerBackground";
import { articleService } from "@/lib/services/articleService";
import { taxonomyService } from "@/lib/services/taxonomyService";

// Homepage utama LENTERA (/): hero karya unggulan, pencarian, filter fakultas, carousel, dan
// baris Top 6. Data dibaca dari database pada setiap permintaan (karya baru langsung tampil
// setelah diverifikasi), sehingga halaman ini tidak boleh di-prerender saat build.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [sections, faculties] = await Promise.all([
    articleService.getHomepageSections(),
    taxonomyService.listFaculties(),
  ]);
  const { featured, secondary } = sections;

  return (
    <div className="min-h-screen bg-[#141414]" style={stickerBackgroundStyle}>
      <NetflixHeader />

      {featured ? (
        <NetflixBanner variant="hero" eyebrow="Artikel unggulan" article={featured} />
      ) : null}

      <main
        className={`mx-auto flex max-w-6xl flex-col gap-10 px-6 py-8 sm:px-10 ${featured ? "" : "pt-28"}`}
      >
        <NetflixSearchBar />
        <NetflixCategoryPills faculties={faculties} />

        {featured ? (
          <>
            <NetflixCarouselRow title="Artikel terbaru" articles={sections.latest} />
            <NetflixTopTenRow articles={sections.topRanked} />
            <NetflixCarouselRow title="Paling banyak diunduh" articles={sections.mostDownloaded} />

            {secondary ? (
              <NetflixBanner
                variant="feature"
                eyebrow={secondary.categoryName}
                article={secondary}
              />
            ) : null}

            <NetflixBrowseGrid articles={sections.browse} />
          </>
        ) : (
          <div className="rounded-md border border-dashed border-white/20 px-6 py-16 text-center">
            <p className="text-lg font-medium text-white">Belum ada karya yang dipublikasikan</p>
            <p className="mt-1 text-sm text-white/50">
              Karya akan muncul di sini setelah diunggah dosen dan diverifikasi admin.
            </p>
          </div>
        )}
      </main>

      <NetflixFooter />
    </div>
  );
}
