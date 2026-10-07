// Pemetaan baris Prisma -> view-model UI (lib/types.ts, lib/article-detail.ts).
// Komponen tidak pernah menyentuh tipe Prisma langsung, jadi perubahan skema cukup
// diserap di file ini.
import type { ArticleDetailRow, ArticleListRow } from "@/lib/repositories/articleRepository";
import type { PublicArticleDetail } from "@/lib/article-detail";
import type {
  ArticleStatus,
  CoverThemeKey,
  DashboardArticle,
  PublicArticle,
  QueuedArticle,
} from "@/lib/types";

const toDate = (d: Date) => d.toISOString().slice(0, 10);

// Nama di database apa adanya ("Teknik"); di UI ditampilkan "Fakultas Teknik".
export function displayFacultyName(name: string): string {
  return /^fakultas\b/i.test(name) ? name : `Fakultas ${name}`;
}

// Tema cover (warna + gambar) diturunkan dari fakultas dan kategori, sehingga tidak perlu
// kolom tambahan di database. Kategori ilmu komputer didahulukan karena lintas fakultas.
export function resolveCoverTheme(facultyName: string, categoryNames: string[]): CoverThemeKey {
  if (categoryNames.some((c) => /komputer|informatika|data science|perangkat lunak/i.test(c))) {
    return "komputer";
  }
  const byFaculty = (text: string): CoverThemeKey | null => {
    if (/teknik|sains|teknologi/i.test(text)) return "teknik";
    if (/ekonomi|bisnis|manajemen|akuntansi/i.test(text)) return "ekonomi";
    if (/kedokteran|kesehatan|farmasi|keperawatan/i.test(text)) return "kedokteran";
    if (/hukum/i.test(text)) return "hukum";
    if (/pendidikan|keguruan|sosial|bahasa|seni|psikologi/i.test(text)) return "pendidikan";
    return null;
  };
  return byFaculty(facultyName) ?? byFaculty(categoryNames.join(" ")) ?? "pendidikan";
}

// Nama penulis berurutan. Cadangan ke pengunggah bila daftar penulis kosong (data lama / tak
// terduga), supaya kartu dan detail tidak pernah tampil tanpa nama.
function authorNamesOf(row: ArticleListRow): string[] {
  const names = row.authors.map((a) => a.author.name);
  return names.length > 0 ? names : [row.uploader.name];
}

// Ringkas untuk kartu: "Nama Pertama" atau "Nama Pertama dkk.".
function shortAuthorLine(row: ArticleListRow): string {
  const names = authorNamesOf(row);
  return names.length > 1 ? `${names[0]} dkk.` : names[0];
}

function categoryNamesOf(row: ArticleListRow): string[] {
  return row.categories.map((c) => c.category.name);
}

export function toPublicArticle(row: ArticleListRow): PublicArticle {
  const categories = categoryNamesOf(row);
  return {
    id: row.id,
    title: row.title,
    abstract: row.abstract,
    authorName: shortAuthorLine(row),
    year: row.year,
    facultyName: displayFacultyName(row.faculty.name),
    categoryName: categories[0] ?? "Umum",
    keywords: row.keywords,
    downloadCount: row.downloadCount,
    publishedAt: toDate(row.publishedAt ?? row.createdAt),
    coverTheme: resolveCoverTheme(row.faculty.name, categories),
  };
}

export function toDashboardArticle(row: ArticleListRow): DashboardArticle {
  return {
    id: row.id,
    title: row.title,
    year: row.year,
    status: row.status as ArticleStatus,
    rejectedNote: row.rejectedNote ?? undefined,
    downloadCount: row.downloadCount,
    createdAt: toDate(row.createdAt),
  };
}

export function toQueuedArticle(row: ArticleListRow): QueuedArticle {
  return {
    id: row.id,
    title: row.title,
    abstract: row.abstract,
    authorName: authorNamesOf(row).join(", "), // admin perlu melihat seluruh penulis
    facultyName: displayFacultyName(row.faculty.name),
    year: row.year,
    keywords: row.keywords,
    submittedAt: toDate(row.createdAt),
    coverTheme: resolveCoverTheme(row.faculty.name, categoryNamesOf(row)),
  };
}

export function toArticleDetail(row: ArticleDetailRow): PublicArticleDetail {
  const base = toPublicArticle(row);
  const names = (items: { name: string }[]) => items.map((i) => i.name).join(" dan ");

  const topic = row.roadmapTopic;
  const context: string[] = [];
  if (topic) {
    if (topic.stream) context.push(`Spesialisasi ${topic.stream.name}`);
    if (row.themes.length > 0) context.push(`Tema ${names(row.themes)}`);
    if (row.pkmFocusAreas.length > 0) context.push(`Bidang fokus ${names(row.pkmFocusAreas)}`);
  }

  return {
    ...base,
    type: row.type,
    authors:
      row.authors.length > 0
        ? row.authors.map((a) => ({
            name: a.author.name,
            type: a.author.type,
            affiliation: a.author.affiliation ?? undefined,
            corresponding: a.corresponding,
          }))
        : [{ name: row.uploader.name, type: "DOSEN", affiliation: base.facultyName, corresponding: true }],
    sdgs: row.sdgs.map((s) => s.sdgNumber).sort((a, b) => a - b),
    roadmapTopic: topic
      ? { year: topic.year, code: topic.code, title: topic.title, context }
      : undefined,
    doi: row.doi ?? undefined,
    scopusUrl: row.scopusUrl ?? undefined,
    scholarUrl: row.scholarUrl ?? undefined,
    region: row.region ?? undefined,
    partner: row.partner ?? undefined,
  };
}
