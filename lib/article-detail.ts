// Tipe & helper untuk halaman detail karya (PRD 5.4.1). Data diisi dari database lewat
// articleService.getPublicArticleDetail (lib/services/articleService.ts).
//
// Catatan: SDG dan penulis majemuk belum punya tabel (PRD 6.3, rencana minggu 2). Sampai tabelnya
// ada, `sdgs` selalu kosong dan `authors` berisi pengunggah karya sebagai satu-satunya penulis.
import type { PublicArticle } from "@/lib/types";

export type WorkType = "RESEARCH" | "PKM";
export type AuthorType = "DOSEN" | "MAHASISWA" | "EKSTERNAL";
export type Region = "LOKAL" | "REGIONAL" | "NASIONAL" | "INTERNASIONAL";

export const WORK_TYPE_LABEL: Record<WorkType, string> = {
  RESEARCH: "Penelitian",
  PKM: "PkM",
};

export const REGION_LABEL: Record<Region, string> = {
  LOKAL: "Lokal",
  REGIONAL: "Regional",
  NASIONAL: "Nasional",
  INTERNASIONAL: "Internasional",
};

export const AUTHOR_TYPE_LABEL: Record<AuthorType, string> = {
  DOSEN: "Dosen",
  MAHASISWA: "Mahasiswa",
  EKSTERNAL: "Eksternal",
};

export type DetailAuthor = {
  name: string;
  type: AuthorType;
  /** Fakultas/prodi untuk penulis internal, instansi untuk penulis eksternal. */
  affiliation?: string;
  corresponding?: boolean;
};

export type DetailRoadmapTopic = {
  year: number;
  code: string;
  title: string;
  /** Konteks pengelompokan, mis. "Spesialisasi Sustainability" dan "Tema Manajemen". */
  context: string[];
};

export type ArticleDetailExtras = {
  type: WorkType;
  authors: DetailAuthor[];
  /** Nomor SDG (1–17). */
  sdgs: number[];
  roadmapTopic?: DetailRoadmapTopic;
  doi?: string;
  scopusUrl?: string;
  /** URL manual; bila kosong, tautan Google Scholar dibentuk dari judul (FR-EXT-02). */
  scholarUrl?: string;
  /** Hanya untuk PkM. */
  region?: Region;
  partner?: string;
};

export type PublicArticleDetail = PublicArticle & ArticleDetailExtras;

// Tautan "Cari di Google Scholar" selalu ada dan dibentuk dari judul (FR-EXT-02).
export function getScholarUrl(article: Pick<PublicArticleDetail, "title" | "scholarUrl">): string {
  return article.scholarUrl ?? `https://scholar.google.com/scholar?q=${encodeURIComponent(article.title)}`;
}

export function getDoiUrl(doi: string): string {
  return `https://doi.org/${doi}`;
}

export type SimilarArticle = {
  article: PublicArticleDetail;
  /** Alasan singkat kenapa karya ini dianggap serupa, mis. "Topik roadmap sama". */
  reasons: string[];
};
