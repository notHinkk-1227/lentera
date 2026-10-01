import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import { NETFLIX_COVER_THEMES } from "@/components/public-alt/NetflixCoverThemes";
import { getHeroImage } from "@/lib/cover-images";
import type { PublicArticle } from "@/lib/dummy-data";

// Satu komponen untuk dua banner homepage supaya struktur dan gayanya seragam:
// - "hero":    layar penuh di bawah header, menyatu ke latar halaman
// - "feature": banner berpinggir membulat di tengah halaman
// Isi keduanya sama: label, judul, penulis · fakultas · tahun, abstrak, tombol baca.
const VARIANTS = {
  hero: {
    box: "h-[360px] sm:h-[420px]",
    pad: "px-6 py-7 sm:px-10 sm:py-9",
    title: "text-2xl sm:text-[32px]",
    bottomFade: "rgba(20,20,20,1) 0%, rgba(20,20,20,0.75) 40%, rgba(20,20,20,0.25) 75%, rgba(20,20,20,0) 100%",
    sideFade: "rgba(20,20,20,0.7) 0%, rgba(20,20,20,0.3) 45%, rgba(20,20,20,0) 75%",
    sizes: "100vw",
  },
  feature: {
    box: "h-[300px] rounded-lg sm:h-[340px]",
    pad: "px-6 py-6 sm:px-8 sm:py-7",
    title: "text-xl sm:text-2xl",
    bottomFade: "rgba(20,20,20,0.95) 0%, rgba(20,20,20,0.6) 40%, rgba(20,20,20,0.15) 75%, rgba(20,20,20,0) 100%",
    sideFade: "rgba(20,20,20,0.6) 0%, rgba(20,20,20,0.25) 50%, rgba(20,20,20,0) 80%",
    sizes: "(max-width: 1152px) 100vw, 1152px",
  },
} as const;

export function NetflixBanner({
  article,
  eyebrow,
  variant,
}: {
  article: PublicArticle;
  eyebrow: string;
  variant: keyof typeof VARIANTS;
}) {
  const v = VARIANTS[variant];
  const backdrop = NETFLIX_COVER_THEMES[article.coverTheme].bg;
  const hero = getHeroImage(article.coverTheme);
  const Title = variant === "hero" ? "h1" : "h2";

  return (
    <div className={`relative overflow-hidden ${v.box}`} style={{ backgroundColor: backdrop }}>
      {/* Pixel art resolusi asli yang diperbesar; pixelated menjaga tepi piksel tetap tajam. */}
      <Image
        src={hero.src}
        alt=""
        fill
        sizes={v.sizes}
        unoptimized
        className="object-cover"
        style={{ imageRendering: "pixelated", objectPosition: hero.position }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to top, ${v.bottomFade})` }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to right, ${v.sideFade})` }}
      />

      {/* Seluruh banner adalah satu tautan ke detail (stretched link), jadi hanya ada satu
          tujuan klik dan satu perhentian keyboard. Teks di atasnya pointer-events-none
          supaya klik menembus ke tautan ini. */}
      <Link
        href={`/articles/${article.id}`}
        aria-label={`Buka artikel: ${article.title}`}
        className="absolute inset-0 z-10"
      />

      <div className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 ${v.pad}`}>
        <span className="inline-block rounded-md bg-[#D8432F]/20 px-3 py-1 text-xs text-[#F0997B]">
          {eyebrow}
        </span>
        <Title className={`mt-3 max-w-xl font-medium leading-snug text-white ${v.title}`}>
          {article.title}
        </Title>
        <p className="mt-2 text-sm text-white/60">
          {article.authorName} · {article.facultyName} · {article.year}
        </p>
        <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-relaxed text-white/60">
          {article.abstract}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-black">
          <FileText className="h-4 w-4" strokeWidth={2} />
          Baca artikel
        </span>
      </div>
    </div>
  );
}
