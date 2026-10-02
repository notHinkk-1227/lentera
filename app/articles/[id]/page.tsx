import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Handshake, MapPin } from "lucide-react";
import { NetflixHeader } from "@/components/public-alt/NetflixHeader";
import { NetflixFooter } from "@/components/public-alt/NetflixFooter";
import { NetflixArticleCover } from "@/components/public-alt/NetflixArticleCover";
import { stickerBackgroundStyle } from "@/components/public-alt/stickerBackground";
import { AuthorChips } from "@/components/article-detail/AuthorChips";
import { ExternalLinks } from "@/components/article-detail/ExternalLinks";
import { InfoCard } from "@/components/article-detail/InfoCard";
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
  const authorLine = article.authors.map((author) => author.name).join(", ");

  return (
    <div className="min-h-screen bg-[#141414] text-white" style={stickerBackgroundStyle}>
      <NetflixHeader />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-28 sm:px-8">
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

        {/* Hero: cover, judul, penulis, tautan eksternal, dan tombol unduh */}
        <section className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#181818]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_90%_at_0%_0%,rgba(229,73,58,0.20),transparent_70%)]"
          />
          <div className="relative flex flex-col gap-8 p-6 sm:flex-row sm:p-10">
            <div className="mx-auto w-[180px] shrink-0 shadow-2xl shadow-black/60 sm:mx-0">
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
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">
                  {article.year}
                </span>
              </div>

              <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                {article.title}
              </h1>

              <p className="mt-3 text-sm text-white/60">
                {authorLine} <span className="text-white/30">·</span> {article.facultyName}
              </p>

              <div className="mt-5">
                <ExternalLinks article={article} />
              </div>

              {/* Belum berfungsi: endpoint unduh PDF belum ada. Tombol dinonaktifkan agar
                  tidak ada tombol yang tampil tetapi tidak bekerja (NFR-A11Y-01). */}
              <button
                type="button"
                disabled
                className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#D8432F] px-5 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download className="h-4 w-4" strokeWidth={1.75} />
                Unduh PDF (segera hadir)
              </button>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#181818] p-6 sm:p-8 [&>section]:py-8 [&>section:first-child]:pt-0 [&>section:last-child]:pb-0">
            <section>
              <SectionHeading>Abstrak</SectionHeading>
              <p className="mt-4 max-w-3xl text-base leading-8 text-white/85">{article.abstract}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
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
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {article.region ? (
                    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                      <MapPin className="mt-0.5 h-4 w-4 text-[#E5493A]" strokeWidth={1.75} />
                      <div>
                        <dt className="text-xs text-white/50">Cakupan wilayah</dt>
                        <dd className="mt-0.5 text-sm text-white">{REGION_LABEL[article.region]}</dd>
                      </div>
                    </div>
                  ) : null}
                  {article.partner ? (
                    <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4">
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
          </article>

          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <InfoCard article={article} />
            <SimilarWorks items={similar} />
          </div>
        </div>
      </main>

      <NetflixFooter />
    </div>
  );
}
