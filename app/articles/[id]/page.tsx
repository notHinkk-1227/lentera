import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download, Handshake, MapPin } from "lucide-react";
import { NetflixHeader } from "@/components/public-alt/NetflixHeader";
import { NetflixFooter } from "@/components/public-alt/NetflixFooter";
import { NetflixArticleCover } from "@/components/public-alt/NetflixArticleCover";
import { stickerBackgroundStyle } from "@/components/public-alt/stickerBackground";
import { getCoverImage } from "@/lib/cover-images";
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
  const coverImage = getCoverImage(article.coverTheme, article.title);

  return (
    <div className="min-h-screen bg-[#141414] text-white" style={stickerBackgroundStyle}>
      <NetflixHeader />

      <main className="mx-auto max-w-6xl px-5 pb-20 pt-28 sm:px-8">
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

        {/* Satu panel utama: hero di atas, isi karya dan sidebar di bawahnya. */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#181818]">
          {/* Hero: latar cover yang di-blur memudar ke warna panel; cover, judul, penulis, tautan, unduh. */}
          <section className="relative isolate overflow-hidden">
            <Image
              src={coverImage.src}
              alt=""
              fill
              sizes="100vw"
              unoptimized
              aria-hidden
              className="-z-20 scale-125 object-cover opacity-40 blur-2xl"
            />
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-gradient-to-b from-[#181818]/30 via-[#181818]/70 to-[#181818]"
            />

            <div className="flex flex-col gap-7 px-6 pb-8 pt-10 sm:flex-row sm:items-end sm:gap-10 sm:px-10 sm:pb-10 sm:pt-14">
              <div className="w-[140px] shrink-0 shadow-2xl shadow-black/60 sm:w-[220px]">
                <NetflixArticleCover title={article.title} theme={article.coverTheme} hideTitle />
              </div>

              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-3 text-sm text-white/70">
                  <span className="rounded bg-[#D8432F] px-2 py-0.5 text-xs font-medium text-white">
                    {WORK_TYPE_LABEL[article.type]}
                  </span>
                  {article.year}
                </p>

                <h1 className="mt-3 text-balance text-2xl font-semibold leading-[1.2] tracking-tight text-white sm:text-4xl sm:leading-[1.15]">
                  {article.title}
                </h1>

                <p className="mt-4 text-[15px] leading-relaxed text-white/85">{authorLine}</p>
                <p className="mt-0.5 text-sm text-white/55">{article.facultyName}</p>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  {/* Belum berfungsi: endpoint unduh PDF belum ada (FR-PUB-05). Tombol dinonaktifkan
                      agar tidak ada tombol yang tampil tetapi tidak bekerja (NFR-A11Y-01). */}
                  <button
                    type="button"
                    disabled
                    aria-describedby="unduh-catatan"
                    className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white/40 disabled:cursor-not-allowed"
                  >
                    <Download className="h-4 w-4" strokeWidth={1.75} />
                    Unduh PDF
                  </button>
                  <ExternalLinks article={article} />
                </div>
                <p id="unduh-catatan" className="mt-2.5 text-xs text-white/40">
                  Unduhan PDF segera tersedia.
                </p>
              </div>
            </div>
          </section>

          <div className="grid border-t border-white/10 lg:grid-cols-[minmax(0,1fr)_300px]">
            <article className="flex flex-col gap-10 p-6 sm:p-10 [&>section+section]:border-t [&>section+section]:border-white/10 [&>section+section]:pt-10">
              <section>
                <SectionHeading>Abstrak</SectionHeading>
                <p className="mt-4 max-w-[65ch] font-serif text-[17px] leading-[1.85] text-white/85">
                  {article.abstract}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-sm text-white/50">Kata kunci</span>
                  <ul className="contents">
                    {article.keywords.map((keyword) => (
                      <li
                        key={keyword}
                        className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70"
                      >
                        {keyword}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <AuthorChips authors={article.authors} />
              <SdgAlignment sdgs={article.sdgs} />
              <RoadmapTopic topic={article.roadmapTopic} />

              {isPkm && (article.region || article.partner) ? (
                <section>
                  <SectionHeading>Pelaksanaan PkM</SectionHeading>
                  <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    {article.region ? (
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/40" strokeWidth={1.75} />
                        <div>
                          <dt className="text-xs text-white/50">Cakupan wilayah</dt>
                          <dd className="mt-0.5 text-sm text-white">{REGION_LABEL[article.region]}</dd>
                        </div>
                      </div>
                    ) : null}
                    {article.partner ? (
                      <div className="flex items-start gap-3">
                        <Handshake className="mt-0.5 h-4 w-4 shrink-0 text-white/40" strokeWidth={1.75} />
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

            <aside className="border-t border-white/10 p-6 sm:p-10 lg:border-l lg:border-t-0 lg:pl-8 lg:pr-8 lg:pt-10">
              <div className="flex flex-col gap-10 lg:sticky lg:top-24">
                <InfoCard article={article} />
                <SimilarWorks items={similar} />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <NetflixFooter />
    </div>
  );
}
