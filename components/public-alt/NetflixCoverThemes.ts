import type { CoverThemeKey } from "@/lib/dummy-data";

// Palet TERPISAH dari COVER_THEMES di components/public/ArticleCover.tsx.
// Sengaja lebih jenuh/vivid (bukan muted-akademik) untuk arah "poster film"
// yang diminta klien. Tidak memengaruhi desain formal yang sudah ada.
export const NETFLIX_COVER_THEMES: Record<
  CoverThemeKey,
  { bg: string; fg: string; icon: string }
> = {
  teknik: { bg: "#2563EB", fg: "#EAF1FB", icon: "zap" },
  ekonomi: { bg: "#16A34A", fg: "#EAF6EE", icon: "trending-up" },
  kedokteran: { bg: "#DB2777", fg: "#FBEAF1", icon: "heart-pulse" },
  pendidikan: { bg: "#D97706", fg: "#FDF1E1", icon: "brain" },
  hukum: { bg: "#7C3AED", fg: "#F1EAFD", icon: "scale" },
  komputer: { bg: "#0D9488", fg: "#E5F7F5", icon: "cpu" },
};
