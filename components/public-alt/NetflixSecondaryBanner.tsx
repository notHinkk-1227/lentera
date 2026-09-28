import Image from "next/image";
import { FileText, Bookmark } from "lucide-react";
import { NETFLIX_COVER_THEMES } from "@/components/public-alt/NetflixCoverThemes";
import { getHeroImage } from "@/lib/cover-images";
import type { PublicArticle } from "@/lib/dummy-data";

export function NetflixSecondaryBanner({ article }: { article: PublicArticle }) {
  const backdrop = NETFLIX_COVER_THEMES[article.coverTheme].bg;
  const hero = getHeroImage(article.coverTheme);

  return (
    <div
      className="relative h-[300px] overflow-hidden rounded-lg sm:h-[340px]"
      style={{ backgroundColor: backdrop }}
    >
      <Image
        src={hero.src}
        alt=""
        fill
        sizes="(max-width: 1152px) 100vw, 1152px"
        unoptimized
        className="object-cover"
        style={{ imageRendering: "pixelated", objectPosition: hero.position }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.6) 40%, rgba(20,20,20,0.15) 75%, rgba(20,20,20,0) 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, rgba(20,20,20,0.6) 0%, rgba(20,20,20,0.25) 50%, rgba(20,20,20,0) 80%)`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 px-6 py-6 sm:px-8 sm:py-7">
        <span className="inline-block rounded-md bg-white/10 px-2.5 py-1 text-xs text-white/70">
          {article.categoryName} · {article.year}
        </span>
        <h3 className="mt-3 max-w-lg text-xl font-medium leading-snug text-white sm:text-2xl">
          {article.title}
        </h3>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/60 line-clamp-2">
          {article.abstract}
        </p>

        <div className="mt-4 flex gap-3">
          <a
            href={`/articles/${article.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            <FileText className="h-4 w-4" strokeWidth={2} />
            Baca artikel
          </a>
          <button className="inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25">
            <Bookmark className="h-4 w-4" strokeWidth={1.75} />
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
