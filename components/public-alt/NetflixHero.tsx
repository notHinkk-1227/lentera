import Image from "next/image";
import { FileText, Info } from "lucide-react";
import { NETFLIX_COVER_THEMES } from "@/components/public-alt/NetflixCoverThemes";
import { getHeroImage } from "@/lib/cover-images";
import type { PublicArticle } from "@/lib/dummy-data";

function formatYear(iso: string) {
  return new Date(iso).getFullYear();
}

export function NetflixHero({ article }: { article: PublicArticle }) {
  const backdrop = NETFLIX_COVER_THEMES[article.coverTheme].bg;
  const hero = getHeroImage(article.coverTheme);

  return (
    <div
      className="relative h-[360px] overflow-hidden sm:h-[420px]"
      style={{ backgroundColor: backdrop }}
    >
      {/* Gambar pixel art resolusi asli (kecil) yang diperbesar — pixelated menjaga
          tepi piksel tetap tajam, bukan blur. Warna tema jadi latar cadangan. */}
      <Image
        src={hero.src}
        alt=""
        fill
        sizes="100vw"
        unoptimized
        className="object-cover"
        style={{ imageRendering: "pixelated", objectPosition: hero.position }}
      />

      {/* Gradasi bawah: menyambung mulus ke latar halaman (#141414). */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.75) 40%, rgba(20,20,20,0.25) 75%, rgba(20,20,20,0) 100%)`,
        }}
      />
      {/* Gradasi kiri: teks judul ada di kiri-bawah, ini menjaga kontrasnya di atas gambar yang ramai. */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, rgba(20,20,20,0.7) 0%, rgba(20,20,20,0.3) 45%, rgba(20,20,20,0) 75%)`,
        }}
      />

      <div className="absolute inset-x-0 bottom-0 px-6 py-7 sm:px-10 sm:py-9">
        <span className="inline-block rounded-md bg-[#D8432F]/20 px-3 py-1 text-xs text-[#F0997B]">
          Artikel unggulan
        </span>
        <h1 className="mt-3 max-w-xl text-2xl font-medium leading-snug text-white sm:text-[32px]">
          {article.title}
        </h1>
        <p className="mt-3 text-sm text-white/60">
          {article.authorName} · {article.facultyName} · {formatYear(article.publishedAt)}
        </p>

        <div className="mt-5 flex gap-3">
          <a
            href={`/articles/${article.id}`}
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-black transition-opacity hover:opacity-90"
          >
            <FileText className="h-4 w-4" strokeWidth={2} />
            Baca artikel
          </a>
          <button className="inline-flex items-center gap-2 rounded-md bg-white/15 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/25">
            <Info className="h-4 w-4" strokeWidth={2} />
            Info
          </button>
        </div>
      </div>
    </div>
  );
}
