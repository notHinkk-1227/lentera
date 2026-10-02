// Data tambahan untuk halaman detail karya (PRD 5.4.1): penulis berurut, SDG, topik roadmap,
// tipe karya, dan tautan eksternal. Field-field ini BELUM ada di skema Prisma (lihat PRD 6.3),
// jadi sementara disimpan terpisah dari `PublicArticle` di lib/dummy-data.ts.
//
// TODO (minggu 2 rencana implementasi): setelah skema `Author`, `ArticleAuthor`, `Sdg`, dan
// field `doi/scopusUrl/scholarUrl` ada, hapus file ini dan ambil semuanya lewat
// articleService.getArticleDetail(id). Bentuk tipe di bawah sengaja mengikuti PRD supaya
// komponen di components/article-detail/ tidak perlu diubah.
import { dummyAllPublicArticles, type PublicArticle } from "@/lib/dummy-data";

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

const EXTRAS: Record<string, ArticleDetailExtras> = {
  art_pub_1: {
    type: "RESEARCH",
    authors: [
      { name: "Prof. Dr. Maria Kusuma", type: "DOSEN", affiliation: "Fakultas Ekonomi dan Bisnis", corresponding: true },
      { name: "Rizky Pratama", type: "MAHASISWA", affiliation: "Manajemen" },
      { name: "Dewi Anggraeni", type: "MAHASISWA", affiliation: "Manajemen" },
    ],
    sdgs: [8, 9],
    roadmapTopic: {
      year: 2024,
      code: "E",
      title: "UMKM",
      context: ["Spesialisasi Sustainability", "Tema Manajemen"],
    },
    // DOI dan URL Scopus di bawah hanya contoh agar tampilan terlihat; bukan tautan sungguhan.
    doi: "10.0000/lentera.contoh.2026.001",
    scopusUrl: "https://www.scopus.com/",
  },
  art_pub_2: {
    type: "RESEARCH",
    authors: [
      { name: "Dr. Andi Wijaya", type: "DOSEN", affiliation: "Fakultas Teknik", corresponding: true },
      { name: "Farhan Maulana", type: "MAHASISWA", affiliation: "Teknik Elektro" },
      { name: "Prof. Hiroshi Tanaka", type: "EKSTERNAL", affiliation: "Kyushu University" },
    ],
    sdgs: [7, 13],
    roadmapTopic: {
      year: 2024,
      code: "A",
      title: "Energi Terbarukan, Game Inklusif",
      context: ["Spesialisasi Inovasi Teknologi", "Tema Energi"],
    },
  },
  art_pub_3: {
    type: "RESEARCH",
    authors: [
      { name: "Dr. Siti Rahma", type: "DOSEN", affiliation: "Fakultas Ekonomi", corresponding: true },
      { name: "Bagus Setiawan", type: "MAHASISWA", affiliation: "Ekonomi Pembangunan" },
    ],
    sdgs: [8, 10],
    roadmapTopic: {
      year: 2025,
      code: "A",
      title: "Blockchain untuk Keuangan, Fintech",
      context: ["Spesialisasi Inovasi Teknologi", "Tema Tata Kelola Keuangan"],
    },
  },
  art_pub_4: {
    type: "PKM",
    authors: [
      { name: "Prof. Budi Santoso", type: "DOSEN", affiliation: "Fakultas Kedokteran", corresponding: true },
      { name: "Dr. Lina Marlina", type: "DOSEN", affiliation: "Fakultas Kedokteran" },
      { name: "Puskesmas Pesisir Utara", type: "EKSTERNAL", affiliation: "Dinas Kesehatan" },
    ],
    sdgs: [2, 3],
    roadmapTopic: {
      year: 2028,
      code: "E",
      title: "Program Kolaborasi Lintas Komunitas Berbasis Teknologi untuk Ketahanan Pangan & Sosial",
      context: ["Bidang fokus PkM: Pemberdayaan Masyarakat dan Desa Binaan"],
    },
    region: "REGIONAL",
    partner: "Desa binaan wilayah pesisir",
  },
  art_pub_5: {
    type: "RESEARCH",
    authors: [
      { name: "Dr. Nadia Putri", type: "DOSEN", affiliation: "Fakultas Pendidikan", corresponding: true },
      { name: "Salsabila Nur", type: "MAHASISWA", affiliation: "Pendidikan Teknologi Informasi" },
    ],
    sdgs: [4, 16],
    roadmapTopic: {
      year: 2026,
      code: "B",
      title: "Integrasi Teknologi Digital untuk Mendukung Inovasi dan Adaptasi Perubahan dalam Manajemen",
      context: ["Spesialisasi Kolaborasi dan Kreativitas", "Tema Manajemen"],
    },
  },
  art_pub_6: {
    type: "RESEARCH",
    authors: [
      { name: "Prof. Lestari", type: "DOSEN", affiliation: "Fakultas Hukum", corresponding: true },
      { name: "Yoga Aditya", type: "MAHASISWA", affiliation: "Ilmu Hukum" },
    ],
    sdgs: [14, 13, 16],
    roadmapTopic: {
      year: 2025,
      code: "A",
      title: "Mitigasi Perubahan Iklim, Distribusi Media Digital",
      context: ["Spesialisasi Sustainability", "Tema Lingkungan Hidup"],
    },
  },
  art_pub_7: {
    type: "RESEARCH",
    authors: [{ name: "Prof. Hendra", type: "DOSEN", affiliation: "Fakultas Ilmu Sosial", corresponding: true }],
    sdgs: [4],
    roadmapTopic: {
      year: 2025,
      code: "B",
      title: "Desain Konten Interaktif, Perpustakaan Digital",
      context: ["Spesialisasi Rich Content and Value", "Tema Humaniora"],
    },
  },
  art_pub_8: {
    type: "RESEARCH",
    authors: [
      { name: "Dr. Rian Saputra", type: "DOSEN", affiliation: "Fakultas Teknik", corresponding: true },
      { name: "Kevin Hartono", type: "MAHASISWA", affiliation: "Informatika" },
    ],
    sdgs: [4, 9],
    roadmapTopic: {
      year: 2027,
      code: "A",
      title: "AI untuk Risiko Keuangan, Platform Edukasi Berbasis Komunitas",
      context: ["Spesialisasi Inovasi Teknologi", "Tema Rekayasa Keteknikan"],
    },
  },
  art_pub_9: {
    type: "RESEARCH",
    authors: [
      { name: "Prof. Lestari", type: "DOSEN", affiliation: "Fakultas Hukum", corresponding: true },
      { name: "Dr. Rudi Hartanto", type: "EKSTERNAL", affiliation: "Kementerian Lingkungan Hidup" },
    ],
    sdgs: [13, 16],
    roadmapTopic: {
      year: 2026,
      code: "A",
      title: "ESG dalam Bisnis, E-learning Berbasis Budaya",
      context: ["Spesialisasi Sustainability", "Tema Lingkungan Hidup"],
    },
  },
};

// Bila sebuah karya belum punya data tambahan, tampilkan apa adanya: satu penulis dari
// `authorName`, tanpa SDG dan tanpa roadmap. Bagian yang kosong disembunyikan di UI.
function withExtras(article: PublicArticle): PublicArticleDetail {
  const extras = EXTRAS[article.id] ?? {
    type: "RESEARCH" as const,
    authors: [{ name: article.authorName, type: "DOSEN" as const, affiliation: article.facultyName, corresponding: true }],
    sdgs: [],
  };
  return { ...article, ...extras };
}

export function getArticleDetail(id: string): PublicArticleDetail | undefined {
  const article = dummyAllPublicArticles.find((a) => a.id === id);
  return article ? withExtras(article) : undefined;
}

// Tautan "Cari di Google Scholar" selalu ada dan dibentuk dari judul (FR-EXT-02).
export function getScholarUrl(article: Pick<PublicArticleDetail, "title" | "scholarUrl">): string {
  return article.scholarUrl ?? `https://scholar.google.com/scholar?q=${encodeURIComponent(article.title)}`;
}

export function getDoiUrl(doi: string): string {
  return `https://doi.org/${doi}`;
}

export type SimilarArticle = {
  article: PublicArticleDetail;
  /** Alasan singkat kenapa karya ini dianggap serupa, mis. "SDG 8" atau "Topik roadmap sama". */
  reasons: string[];
};

// "Karya serupa" (PRD 5.4.1): kesamaan topik roadmap, SDG, dan kata kunci. Tanpa persentase,
// jadi yang ditampilkan adalah alasannya. Karya dengan skor 0 tidak ditampilkan.
export function getSimilarArticles(current: PublicArticleDetail, take = 5): SimilarArticle[] {
  const currentKeywords = new Set(current.keywords.map((k) => k.toLowerCase()));

  return dummyAllPublicArticles
    .filter((other) => other.id !== current.id)
    .map(withExtras)
    .map((other) => {
      const reasons: string[] = [];
      let score = 0;

      const sameTopic =
        current.roadmapTopic &&
        other.roadmapTopic &&
        current.roadmapTopic.year === other.roadmapTopic.year &&
        current.roadmapTopic.code === other.roadmapTopic.code &&
        current.roadmapTopic.title === other.roadmapTopic.title;
      if (sameTopic) {
        score += 3;
        reasons.push("Topik roadmap sama");
      }

      const sharedSdgs = other.sdgs.filter((n) => current.sdgs.includes(n));
      if (sharedSdgs.length > 0) {
        score += sharedSdgs.length * 2;
        reasons.push(`SDG ${sharedSdgs.join(", ")}`);
      }

      const sharedKeywords = other.keywords.filter((k) => currentKeywords.has(k.toLowerCase()));
      if (sharedKeywords.length > 0) {
        score += sharedKeywords.length;
        reasons.push(`Kata kunci: ${sharedKeywords.join(", ")}`);
      }

      if (other.categoryName === current.categoryName) {
        score += 1;
        reasons.push("Kategori sama");
      }

      return { article: other, reasons, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, take)
    .map(({ article, reasons }) => ({ article, reasons }));
}
