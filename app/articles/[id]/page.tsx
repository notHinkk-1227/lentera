import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cache } from "react";
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
import { REGION_LABEL, WORK_TYPE_LABEL } from "@/lib/article-detail";
import { articleService } from "@/lib/services/articleService";

// generateMetadata dan halaman memanggil data yang sama; cache() membuatnya satu kali query per request.
const getDetail = cache((id: string) => articleService.getPublicArticleDetail(id));

// Meta tag untuk crawler Google Scholar (FR-EXT-05, NFR-SEO-01).
// `citation_pdf_url` tidak dipasang: tautan unduh ada di situs eksternal dan diakses lewat
// /api/articles/[id]/download yang menghitung klik.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const detail = await getDetail(id);
  if (!detail) return { title: "Karya tidak ditemukan" };
  const { article } = detail;

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

// Karya non-PUBLISHED menghasilkan 404 (FR-PUB-06). Tombol "Unduh" (hanya bila karya punya
// tautan unduh) memanggil /api/articles/[id]/download yang menambah downloadCount lalu
// mengarahkan ke situs eksternal (FR-PUB-05).
export const dynamic = "force-dynamic";

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const detail = await getDetail(id);

  if (!detail) {
    notFound();
  }

  const { article, similar } = detail;
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
                  {article.hasDownload ? (
                    <a
                      href={`/api/articles/${article.id}/download`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <Download className="h-4 w-4" strokeWidth={1.75} />
                      Unduh
                    </a>
                  ) : null}
                  <ExternalLinks article={article} />
                </div>
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
