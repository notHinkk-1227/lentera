// Tipe view-model yang dipakai UI. Bentuknya sengaja datar dan mudah dikonsumsi komponen;
// pemetaan dari baris Prisma ke tipe ini ada di lib/mappers.ts.

export type ArticleStatus = "PENDING" | "PUBLISHED" | "REJECTED";

export type CoverThemeKey =
  | "teknik"
  | "ekonomi"
  | "kedokteran"
  | "pendidikan"
  | "hukum"
  | "komputer";

// Warna + ikon cover per bidang keilmuan. Nama warna merujuk ke token Tailwind kustom
// di app/globals.css. Tema ditentukan dari fakultas/kategori karya (lib/mappers.ts).
export const COVER_THEMES: Record<
  CoverThemeKey,
  { bgClass: string; fgClass: string; icon: string; label: string }
> = {
  teknik: { bgClass: "bg-cover-teknik", fgClass: "text-cover-teknik-fg", icon: "zap", label: "Teknik" },
  ekonomi: { bgClass: "bg-cover-ekonomi", fgClass: "text-cover-ekonomi-fg", icon: "trending-up", label: "Ekonomi" },
  kedokteran: { bgClass: "bg-cover-kedokteran", fgClass: "text-cover-kedokteran-fg", icon: "heart-pulse", label: "Kedokteran" },
  pendidikan: { bgClass: "bg-cover-pendidikan", fgClass: "text-cover-pendidikan-fg", icon: "brain", label: "Pendidikan" },
  hukum: { bgClass: "bg-cover-hukum", fgClass: "text-cover-hukum-fg", icon: "scale", label: "Hukum" },
  komputer: { bgClass: "bg-cover-komputer", fgClass: "text-cover-komputer-fg", icon: "cpu", label: "Ilmu Komputer" },
};

export type PublicArticle = {
  id: string;
  title: string;
  abstract: string;
  authorName: string;
  year: number;
  facultyName: string;
  categoryName: string;
  keywords: string[];
  downloadCount: number;
  publishedAt: string; // YYYY-MM-DD
  coverTheme: CoverThemeKey;
};

// Baris di dashboard dosen ("Karya saya").
export type DashboardArticle = {
  id: string;
  title: string;
  year: number;
  status: ArticleStatus;
  rejectedNote?: string;
  downloadCount: number;
  createdAt: string; // YYYY-MM-DD
};

// Karya yang menunggu verifikasi admin.
export type QueuedArticle = {
  id: string;
  title: string;
  abstract: string;
  authorName: string;
  facultyName: string;
  year: number;
  keywords: string[];
  submittedAt: string; // YYYY-MM-DD
  coverTheme: CoverThemeKey;
  /** Tautan eksternal yang diisi pengunggah; admin memeriksanya sebelum menerbitkan. */
  downloadUrl?: string;
  scholarUrl?: string;
  sintaUrl?: string;
};

export type NamedItem = { id: string; name: string };
