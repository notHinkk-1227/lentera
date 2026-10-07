// Service layer: business logic ada di sini, bukan di route handler / halaman.
// Semua keluaran berupa view-model (lib/types.ts), bukan baris Prisma, supaya data internal
// (mis. hash kata sandi penulis, fileUrl) tidak ikut terbawa ke UI atau respons API.
import { randomUUID } from "node:crypto";
import { ServiceError } from "@/lib/errors";
import {
  toArticleDetail,
  toDashboardArticle,
  toPublicArticle,
  toQueuedArticle,
} from "@/lib/mappers";
import {
  articleRepository,
  type ArticleDetailRow,
  type PublicFilter,
} from "@/lib/repositories/articleRepository";
import { authorRepository } from "@/lib/repositories/authorRepository";
import { categoryRepository, facultyRepository } from "@/lib/repositories/taxonomyRepository";
import { userRepository } from "@/lib/repositories/userRepository";
import { generateCover } from "@/lib/services/coverService";
import { storage } from "@/lib/storage";
import { looksLikePdf, MAX_PDF_BYTES } from "@/lib/validation/article";
import type { SimilarArticle } from "@/lib/article-detail";

export const SEARCH_PAGE_SIZE = 12;

// Skor "karya serupa": topik roadmap sama (3), tiap kata kunci sama (1), kategori sama (1).
function scoreSimilar(current: ArticleDetailRow, other: ArticleDetailRow) {
  const reasons: string[] = [];
  let score = 0;

  if (current.roadmapTopicId && current.roadmapTopicId === other.roadmapTopicId) {
    score += 3;
    reasons.push("Topik roadmap sama");
  }

  const mine = new Set(current.keywords.map((k) => k.toLowerCase()));
  const sharedKeywords = other.keywords.filter((k) => mine.has(k.toLowerCase()));
  if (sharedKeywords.length > 0) {
    score += sharedKeywords.length;
    reasons.push(`Kata kunci: ${sharedKeywords.join(", ")}`);
  }

  const mySdgs = new Set(current.sdgs.map((s) => s.sdgNumber));
  const sharedSdgs = other.sdgs.map((s) => s.sdgNumber).filter((n) => mySdgs.has(n));
  if (sharedSdgs.length > 0) {
    score += sharedSdgs.length * 2;
    reasons.push(`SDG ${sharedSdgs.sort((a, b) => a - b).join(", ")}`);
  }

  const myCategories = new Set(current.categories.map((c) => c.categoryId));
  if (other.categories.some((c) => myCategories.has(c.categoryId))) {
    score += 1;
    reasons.push("Kategori sama");
  }

  return { reasons, score };
}

export const articleService = {
  // ---- Publik -----------------------------------------------------------------

  async searchPublicArticles(params: PublicFilter & { page?: number }) {
    const { page: requestedPage, ...filter } = params;
    const page = Math.max(1, requestedPage ?? 1);
    const { items, total } = await articleRepository.findPublished({
      ...filter,
      take: SEARCH_PAGE_SIZE,
      skip: (page - 1) * SEARCH_PAGE_SIZE,
    });
    return {
      items: items.map(toPublicArticle),
      total,
      page,
      pageSize: SEARCH_PAGE_SIZE,
      totalPages: Math.max(1, Math.ceil(total / SEARCH_PAGE_SIZE)),
    };
  },

  async getHomepageSections() {
    const [latestRows, topRows] = await Promise.all([
      articleRepository.findPublished({ take: 24, sort: "latest" }),
      articleRepository.findMostDownloaded(10),
    ]);
    const all = latestRows.items.map(toPublicArticle);
    const top = topRows.map(toPublicArticle);

    return {
      featured: top[0] ?? null,
      secondary: top[1] ?? top[0] ?? null,
      latest: all.slice(0, 8),
      mostDownloaded: top.slice(0, 8),
      topRanked: top,
      browse: all,
    };
  },

  // Hanya karya PUBLISHED; selain itu null (halaman memanggil notFound(), FR-PUB-06).
  async getPublicArticleDetail(id: string) {
    const row = await articleRepository.findPublishedById(id);
    if (!row) return null;

    const candidates = await articleRepository.findSimilarCandidates(row);
    const similar: SimilarArticle[] = candidates
      .map((candidate) => ({ candidate, ...scoreSimilar(row, candidate) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(({ candidate, reasons }) => ({ article: toArticleDetail(candidate), reasons }));

    return { article: toArticleDetail(row), similar };
  },

  async getPublicStats() {
    const [articles, faculties] = await Promise.all([
      articleRepository.countPublished(),
      facultyRepository.count(),
    ]);
    return { articles, faculties };
  },

  async getShowcaseArticles(take = 12) {
    const { items } = await articleRepository.findPublished({ take });
    return items.map(toPublicArticle);
  },

  // ---- Dosen ------------------------------------------------------------------

  // Karya yang diunggah akun ini (dashboard "Karya saya").
  async getArticlesByUploader(uploaderId: string) {
    const rows = await articleRepository.findByUploader(uploaderId);
    const articles = rows.map(toDashboardArticle);
    const published = articles.filter((a) => a.status === "PUBLISHED");
    return {
      articles,
      stats: {
        total: articles.length,
        published: published.length,
        pending: articles.filter((a) => a.status === "PENDING").length,
        totalDownloads: published.reduce((sum, a) => sum + a.downloadCount, 0),
      },
    };
  },

  async getUploadFormOptions(userId: string) {
    const [profile, categories] = await Promise.all([
      userRepository.findFaculty(userId),
      categoryRepository.findAll(),
    ]);
    return { facultyName: profile?.faculty?.name ?? null, categories };
  },

  async submitArticle(input: {
    uploaderId: string;
    title: string;
    abstract: string;
    keywords: string[];
    year: number;
    categoryIds: string[];
    pdf: Buffer;
  }) {
    if (input.pdf.length === 0) throw new ServiceError("File PDF wajib diunggah.", 400);
    if (input.pdf.length > MAX_PDF_BYTES) {
      throw new ServiceError("Ukuran PDF melebihi 20 MB.", 413);
    }
    if (!looksLikePdf(input.pdf)) {
      throw new ServiceError("Berkas harus berupa PDF yang valid.", 400);
    }

    // Fakultas karya selalu diambil dari profil pengunggah, bukan dari input klien.
    const profile = await userRepository.findFaculty(input.uploaderId);
    if (!profile?.facultyId) {
      throw new ServiceError("Akun kamu belum terhubung ke fakultas. Hubungi admin.", 422);
    }

    const categoryIds = [...new Set(input.categoryIds)];
    const found = await categoryRepository.findManyByIds(categoryIds);
    if (found.length !== categoryIds.length) {
      throw new ServiceError("Kategori yang dipilih tidak valid.", 400);
    }

    const author = await authorRepository.ensureForUser(input.uploaderId);

    const key = `articles/${randomUUID()}.pdf`;
    const { url } = await storage.upload(input.pdf, key);
    const coverUrl = await generateCover({ title: input.title, facultyId: profile.facultyId });

    try {
      return await articleRepository.create({
        title: input.title,
        abstract: input.abstract,
        keywords: input.keywords,
        year: input.year,
        fileUrl: url,
        coverUrl,
        uploaderId: input.uploaderId,
        authorId: author.id,
        facultyId: profile.facultyId,
        categoryIds,
      });
    } catch (error) {
      // Jangan tinggalkan berkas yatim bila karya gagal disimpan.
      await storage.delete(key).catch(() => undefined);
      throw error;
    }
  },

  // ---- Admin ------------------------------------------------------------------

  async getPendingQueue() {
    const rows = await articleRepository.findPending();
    return rows.map(toQueuedArticle);
  },

  // Hanya karya yang masih PENDING yang bisa ditinjau di halaman verifikasi.
  async getArticleForReview(id: string) {
    const row = await articleRepository.findById(id);
    return row && row.status === "PENDING" ? toQueuedArticle(row) : null;
  },

  /** true bila status berubah; false bila karya sudah ditinjau / tidak ada. */
  reviewArticle(id: string, decision: "PUBLISHED" | "REJECTED", note?: string) {
    if (decision === "REJECTED" && !note?.trim()) {
      throw new ServiceError("Alasan penolakan wajib diisi.", 400);
    }
    return articleRepository.reviewIfPending(id, decision, note?.trim());
  },

  // ---- Unduh ------------------------------------------------------------------

  /**
   * Cari berkas untuk diunduh. PUBLISHED: siapa saja (dan unduhan dihitung). Selain itu hanya
   * admin atau pengunggahnya (untuk tinjauan/pratinjau), tanpa menambah hitungan unduhan.
   */
  async getDownload(id: string, viewer: { id: string; role: "ADMIN" | "DOSEN" } | null) {
    const file = await articleRepository.findFileInfo(id);
    if (!file) return null;

    const isPublished = file.status === "PUBLISHED";
    const mayView = viewer && (viewer.role === "ADMIN" || viewer.id === file.uploaderId);
    if (!isPublished && !mayView) return null;

    return { title: file.title, fileUrl: file.fileUrl, countable: isPublished };
  },

  registerDownload(id: string) {
    return articleRepository.incrementDownloadCount(id);
  },
};
