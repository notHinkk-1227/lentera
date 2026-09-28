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

export function NetflixArticleCover({
  title,
  theme,
  size = "row",
}: {
  title: string;
  theme: CoverThemeKey;
  size?: "row" | "hero";
}) {
  const config = NETFLIX_COVER_THEMES[theme];
  const Icon = ICONS[config.icon];
  const image = getCoverImage(theme, title);
  const heightClass = size === "hero" ? "h-[280px]" : "h-[215px]";

  return (
    <div
      className={`relative w-full overflow-hidden rounded-md transition-transform duration-300 ease-out hover:scale-105 ${heightClass}`}
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
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black/45 backdrop-blur-sm">
          <Icon className="h-4 w-4 text-white" strokeWidth={1.75} />
        </span>
        <p className="line-clamp-4 text-[13px] font-medium leading-snug text-white">{title}</p>
      </div>
    </div>
  );
}
