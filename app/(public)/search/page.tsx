import { SearchX } from "lucide-react";
import { NetflixSearchBar } from "@/components/public-alt/NetflixSearchBar";
import { NetflixCategoryPills } from "@/components/public-alt/NetflixCategoryPills";
import { NetflixSearchResultCard } from "@/components/public-alt/NetflixSearchResultCard";
import { searchPublicArticles } from "@/lib/dummy-data";

// TODO: ganti searchPublicArticles(dummy) dengan articleService.searchPublicArticles(...)
// begitu backend & database aktif — lihat lib/services/articleService.ts.
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; faculty?: string }>;
}) {
  const { query, faculty } = await searchParams;
  const results = searchPublicArticles({ query, facultyName: faculty });

  // pt-28: header homepage berposisi fixed, jadi konten diberi ruang di bawahnya.
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-8 pt-28 sm:px-10">
      <NetflixSearchBar key={query ?? ""} defaultValue={query} />

      <div className="mt-4">
        <NetflixCategoryPills query={query} activeFaculty={faculty} />
      </div>

      <p className="mt-6 text-sm text-white/60">
        {results.length > 0
          ? `${results.length} artikel ditemukan${query ? ` untuk "${query}"` : ""}`
          : "Tidak ada artikel yang cocok"}
      </p>

      {results.length > 0 ? (
        <div className="mt-4 flex flex-col gap-4">
          {results.map((article) => (
            <NetflixSearchResultCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center rounded-md border border-dashed border-white/20 px-6 py-16 text-center">
          <SearchX className="h-8 w-8 text-white/50" strokeWidth={1.5} />
          <p className="mt-3 text-lg font-medium text-white">Tidak ditemukan</p>
          <p className="mt-1 text-sm text-white/50">
            Coba kata kunci lain atau ubah filter fakultas yang dipilih.
          </p>
        </div>
      )}
    </main>
  );
}
