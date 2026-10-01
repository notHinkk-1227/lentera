import Image from "next/image";
import { Zap, TrendingUp, HeartPulse, Brain, Scale, Cpu, type LucideIcon } from "lucide-react";
import { NETFLIX_COVER_THEMES } from "@/components/public-alt/NetflixCoverThemes";
import type { CoverThemeKey } from "@/lib/dummy-data";
import { getCoverImage } from "@/lib/cover-images";

const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  "trending-up": TrendingUp,
  "heart-pulse": HeartPulse,
  brain: Brain,
  scale: Scale,
  cpu: Cpu,
};

// Cover poster potret (3:4). Ukurannya mengikuti lebar induk, jadi semua baris
// (carousel, Top 6, grid) otomatis punya proporsi yang sama.
//
// Kalau `abstract` diberikan, cover menampilkan panel hover (judul + abstrak) yang
// MENGGANTIKAN judul di cover. Panel ada di dalam elemen ini, jadi ikut membesar bersama
// cover dan tepinya selalu sejajar. Efek hover dipicu oleh `group` pada induknya
// (NetflixArticleCard).
export function NetflixArticleCover({
  title,
  theme,
  badge,
  abstract,
}: {
  title: string;
  theme: CoverThemeKey;
  badge?: string | null;
  abstract?: string;
}) {
  const config = NETFLIX_COVER_THEMES[theme];
  const Icon = ICONS[config.icon];
  const image = getCoverImage(theme, title);

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-md transition-transform duration-300 ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03]"
      style={{ backgroundColor: config.bg }}
    >
      <Image
        src={image.src}
        alt=""
        fill
        sizes="(max-width: 640px) 45vw, 200px"
        unoptimized
        className="object-cover"
        style={{ objectPosition: image.position }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 38%, rgba(0,0,0,0) 65%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-between p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black/45 backdrop-blur-sm">
            <Icon className="h-4 w-4 text-white" strokeWidth={1.75} />
          </span>
          {badge ? (
            <span className="rounded bg-[#D8432F] px-1.5 py-0.5 text-[10px] font-medium text-white">
              {badge}
            </span>
          ) : null}
        </div>
        <p
          className={`line-clamp-4 text-[13px] font-medium leading-snug text-white ${
            abstract ? "transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0" : ""
          }`}
        >
          {title}
        </p>
      </div>

      {abstract ? (
        <div className="absolute inset-0 flex flex-col justify-end bg-black/95 p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <p className="line-clamp-2 text-[13px] font-medium leading-snug text-white">{title}</p>
          <p className="mt-1.5 line-clamp-4 text-[11px] leading-snug text-white/60">{abstract}</p>
        </div>
      ) : null}
    </div>
  );
}
