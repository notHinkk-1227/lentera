import Image from "next/image";
import { Zap, TrendingUp, HeartPulse, Brain, Scale, Cpu, type LucideIcon } from "lucide-react";
import { COVER_THEMES, type CoverThemeKey } from "@/lib/types";
import { getCoverImage } from "@/lib/cover-images";

const ICONS: Record<string, LucideIcon> = {
  zap: Zap,
  "trending-up": TrendingUp,
  "heart-pulse": HeartPulse,
  brain: Brain,
  scale: Scale,
  cpu: Cpu,
};

// Cover artikel: gambar pixel art sesuai bidang keilmuan + ikon + judul.
// Warna tema (bgClass) tetap dipakai sebagai latar cadangan selama gambar dimuat.
// Belum ada cover asli (upload dosen / render dari sharp) — lihat CLAUDE.md.
export function ArticleCover({
  title,
  theme,
  size = "md",
}: {
  title: string;
  theme: CoverThemeKey;
  size?: "sm" | "md" | "lg";
}) {
  const config = COVER_THEMES[theme];
  const Icon = ICONS[config.icon];
  const image = getCoverImage(theme, title);

  const sizeClass = {
    sm: "h-[180px]",
    md: "h-[200px]",
    lg: "h-[220px] w-[150px]",
  }[size];

  return (
    <div className={`relative w-full overflow-hidden rounded-lg ${config.bgClass} ${sizeClass}`}>
      <Image
        src={image.src}
        alt=""
        fill
        sizes="(max-width: 640px) 45vw, 200px"
        unoptimized
        className="object-cover"
        style={{ objectPosition: image.position }}
      />

      {/* Scrim gelap di bagian bawah supaya judul tetap terbaca di atas gambar apa pun */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 38%, rgba(0,0,0,0) 65%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-between p-3.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black/45 backdrop-blur-sm">
          <Icon className="h-4 w-4 text-white" strokeWidth={1.75} />
        </span>
        <p className="line-clamp-4 text-[13px] font-medium leading-snug text-white">{title}</p>
      </div>
    </div>
  );
}
