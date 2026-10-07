import Link from "next/link";
import { SearchX } from "lucide-react";
import { NetflixSearchBar } from "@/components/public-alt/NetflixSearchBar";
import { NetflixCategoryPills } from "@/components/public-alt/NetflixCategoryPills";
import { NetflixSearchResultCard } from "@/components/public-alt/NetflixSearchResultCard";
import { articleService } from "@/lib/services/articleService";
import { taxonomyService } from "@/lib/services/taxonomyService";

function buildHref(params: { query?: string; faculty?: string; page: number }) {
  const qs = new URLSearchParams();
  if (params.query) qs.set("query", params.query);
  if (params.faculty) qs.set("faculty", params.faculty);
  if (params.page > 1) qs.set("page", String(params.page));
  const text = qs.toString();
  return text ? `/search?${text}` : "/search";
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; faculty?: string; page?: string }>;
}) {
  const { query, faculty, page: pageParam } = await searchParams;

  // `page` dari URL bisa berupa apa saja; paksa jadi bilangan bulat >= 1.
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const requestedPage = Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const [result, faculties] = await Promise.all([
    articleService.searchPublicArticles({ query, facultyName: faculty, page: requestedPage }),
    taxonomyService.listFaculties(),
  ]);
  const { items: results, total, page, totalPages } = result;

  // pt-28: header homepage berposisi fixed, jadi konten diberi ruang di bawahnya.
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 pb-8 pt-28 sm:px-10">
      <NetflixSearchBar key={query ?? ""} defaultValue={query} />

      <div className="mt-4">
        <NetflixCategoryPills faculties={faculties} query={query} activeFaculty={faculty} />
      </div>

      <p className="mt-6 text-sm text-white/60">
        {total > 0
          ? `${total} artikel ditemukan${query ? ` untuk "${query}"` : ""}`
          : "Tidak ada artikel yang cocok"}
      </p>

      {results.length > 0 ? (
        <>
          <div className="mt-4 flex flex-col gap-4">
            {results.map((article) => (
              <NetflixSearchResultCard key={article.id} article={article} />
            ))}
          </div>

          {totalPages > 1 ? (
            <nav aria-label="Halaman hasil" className="mt-8 flex items-center justify-between text-sm">
              {page > 1 ? (
                <Link
                  href={buildHref({ query, faculty, page: page - 1 })}
                  className="rounded-md border border-white/15 px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Sebelumnya
                </Link>
              ) : (
                <span />
              )}
              <span className="text-white/50">
                Halaman {page} dari {totalPages}
              </span>
              {page < totalPages ? (
                <Link
                  href={buildHref({ query, faculty, page: page + 1 })}
                  className="rounded-md border border-white/15 px-4 py-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  Berikutnya
                </Link>
              ) : (
                <span />
              )}
            </nav>
          ) : null}
        </>
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
