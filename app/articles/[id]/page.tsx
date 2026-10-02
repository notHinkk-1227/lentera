import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Download, Handshake, MapPin } from "lucide-react";
import { NetflixHeader } from "@/components/public-alt/NetflixHeader";
import { NetflixFooter } from "@/components/public-alt/NetflixFooter";
import { NetflixArticleCover } from "@/components/public-alt/NetflixArticleCover";
import { stickerBackgroundStyle } from "@/components/public-alt/stickerBackground";
import { AuthorChips } from "@/components/article-detail/AuthorChips";
import { ExternalLinks } from "@/components/article-detail/ExternalLinks";
import { RoadmapTopic } from "@/components/article-detail/RoadmapTopic";
import { SdgAlignment } from "@/components/article-detail/SdgAlignment";
import { SectionHeading } from "@/components/article-detail/SectionHeading";
import { ShareButton } from "@/components/article-detail/ShareButton";
import { SimilarWorks } from "@/components/article-detail/SimilarWorks";
import {
  REGION_LABEL,
  WORK_TYPE_LABEL,
  getArticleDetail,
  getSimilarArticles,
} from "@/lib/dummy-article-detail";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Meta tag untuk crawler Google Scholar (FR-EXT-05, NFR-SEO-01).
// `citation_pdf_url` belum ada karena berkas PDF belum disajikan lewat URL publik.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = getArticleDetail(id);
  if (!article) return { title: "Karya tidak ditemukan" };

  return {
    title: article.title,
    description: article.abstract,
    other: {
      citation_title: article.title,
      citation_author: article.authors.map((author) => author.name),
      citation_publication_date: article.publishedAt.replaceAll("-", "/"),
      ...(article.doi ? { citation_doi: article.doi } : {}),
    },
  };
}

// TODO: ganti getArticleDetail/getSimilarArticles (dummy) dengan articleService.getArticleDetail(id)
// begitu database aktif. Karya non-PUBLISHED harus menghasilkan 404 (FR-PUB-06).
// Tombol "Unduh PDF" baru diaktifkan setelah endpoint unduh ada (menambah downloadCount, FR-PUB-05).
export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = getArticleDetail(id);

  if (!article) {
    notFound();
  }

  const similar = getSimilarArticles(article);
  const isPkm = article.type === "PKM";

  return (
    <div className="min-h-screen bg-[#141414] text-white" style={stickerBackgroundStyle}>
      <NetflixHeader />

      <main className="mx-auto max-w-6xl px-6 pb-8 pt-28 sm:px-10">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
            Kembali ke pencarian
          </Link>
          <ShareButton />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="flex flex-col gap-6">
            <article className="rounded-xl border border-white/10 bg-[#141414]/90 p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="w-[140px] shrink-0">
                  <NetflixArticleCover title={article.title} theme={article.coverTheme} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-[#D8432F] px-2 py-0.5 text-xs font-medium text-white">
                      {WORK_TYPE_LABEL[article.type]}
                    </span>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">
                      {article.categoryName}
                    </span>
                  </div>
                  <h1 className="mt-3 text-2xl font-semibold leading-snug text-white sm:text-3xl">
                    {article.title}
                  </h1>
                  <div className="mt-4">
                    <ExternalLinks article={article} />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-8">
                <section>
                  <SectionHeading>Abstrak</SectionHeading>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/80">{article.abstract}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {article.keywords.map((keyword) => (
                      <li
                        key={keyword}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/60"
                      >
                        {keyword}
                      </li>
                    ))}
                  </ul>
                </section>

                <AuthorChips authors={article.authors} />
                <SdgAlignment sdgs={article.sdgs} />
                <RoadmapTopic topic={article.roadmapTopic} />

                {isPkm && (article.region || article.partner) ? (
                  <section>
                    <SectionHeading>Pelaksanaan PkM</SectionHeading>
                    <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                      {article.region ? (
                        <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                          <MapPin className="mt-0.5 h-4 w-4 text-[#E5493A]" strokeWidth={1.75} />
                          <div>
                            <dt className="text-xs text-white/50">Cakupan wilayah</dt>
                            <dd className="mt-0.5 text-sm text-white">{REGION_LABEL[article.region]}</dd>
                          </div>
                        </div>
                      ) : null}
                      {article.partner ? (
                        <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                          <Handshake className="mt-0.5 h-4 w-4 text-[#E5493A]" strokeWidth={1.75} />
                          <div>
                            <dt className="text-xs text-white/50">Mitra / desa binaan</dt>
                            <dd className="mt-0.5 text-sm text-white">{article.partner}</dd>
                          </div>
                        </div>
                      ) : null}
                    </dl>
                  </section>
                ) : null}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-white/10 pt-5 text-xs">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 px-2.5 py-1 text-white/80">
                  <Calendar className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {article.year}
                </span>
                <span className="rounded-full border border-white/25 px-2.5 py-1 text-white/80">
                  {WORK_TYPE_LABEL[article.type]}
                </span>
                <span className="rounded-md bg-white/10 px-2.5 py-1 text-white/80">{article.facultyName}</span>
              </div>
            </article>

            <section className="rounded-xl border border-white/10 bg-[#141414]/90 p-6 sm:p-8">
              <SectionHeading>Statistik &amp; akses</SectionHeading>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="rounded-lg bg-white/[0.06] px-5 py-3">
                  <p className="flex items-center gap-2 text-2xl font-semibold text-white">
                    <Download className="h-5 w-5 text-[#E5493A]" strokeWidth={1.75} />
                    {article.downloadCount}
                  </p>
                  <p className="mt-0.5 text-xs text-white/50">Unduhan</p>
                </div>
                <div className="rounded-lg bg-white/[0.06] px-5 py-3">
                  <p className="text-sm font-medium text-white">{formatDate(article.publishedAt)}</p>
                  <p className="mt-0.5 text-xs text-white/50">Tanggal terbit</p>
                </div>

                {/* Belum berfungsi: endpoint unduh PDF belum ada. Tombol dinonaktifkan agar
                    tidak ada tombol yang tampil tetapi tidak bekerja (NFR-A11Y-01). */}
                <button
                  type="button"
                  disabled
                  className="ml-auto inline-flex items-center gap-2 rounded-md bg-[#D8432F] px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Download className="h-4 w-4" strokeWidth={1.75} />
                  Unduh PDF (segera hadir)
                </button>
              </div>
            </section>
          </div>

          <SimilarWorks items={similar} />
        </div>
      </main>

      <NetflixFooter />
    </div>
  );
}
