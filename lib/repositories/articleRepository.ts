// Repository layer: satu-satunya tempat query Prisma untuk entitas Article.
// Service layer memanggil fungsi di sini, tidak pernah memanggil Prisma langsung.
import { db } from "@/lib/db";
import type { ArticleStatus, Prisma } from "@prisma/client";

// Prisma belum mendukung pencarian sebagian/tanpa-huruf-besar pada kolom array (String[]).
// `hasSome` hanya cocok persis, jadi kita coba beberapa variasi huruf dari kata yang diketik
// agar "energi" tetap menemukan kata kunci "Energi". Pencarian sebagian pada kata kunci
// (mis. "ener" -> "Energi") baru bisa bila kata kunci dipindah ke tabel tersendiri.
function keywordVariants(query: string) {
  const trimmed = query.trim();
  const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  return Array.from(new Set([trimmed, trimmed.toLowerCase(), trimmed.toUpperCase(), capitalized]));
}

export const articleRepository = {
  findPublished(params: {
    query?: string;
    facultyId?: string;
    categoryId?: string;
    take?: number;
    skip?: number;
  }) {
    const { query, facultyId, categoryId, take = 20, skip = 0 } = params;

    const where: Prisma.ArticleWhereInput = {
      status: "PUBLISHED",
      ...(facultyId ? { facultyId } : {}),
      ...(categoryId
        ? { categories: { some: { categoryId } } }
        : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { keywords: { hasSome: keywordVariants(query) } },
              { author: { name: { contains: query, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    return db.article.findMany({
      where,
      include: { author: true, faculty: true, categories: { include: { category: true } } },
      orderBy: { publishedAt: "desc" },
      take,
      skip,
    });
  },

  findMostDownloaded(take = 10) {
    return db.article.findMany({
      where: { status: "PUBLISHED" },
      include: { author: true, faculty: true },
      orderBy: { downloadCount: "desc" },
      take,
    });
  },

  findById(id: string) {
    return db.article.findUnique({
      where: { id },
      include: { author: true, faculty: true, categories: { include: { category: true } } },
    });
  },

  findPendingForAdmin() {
    return db.article.findMany({
      where: { status: "PENDING" },
      include: { author: true, faculty: true },
      orderBy: { createdAt: "asc" },
    });
  },

  findByAuthor(authorId: string) {
    return db.article.findMany({
      where: { authorId },
      orderBy: { createdAt: "desc" },
    });
  },

  create(data: Prisma.ArticleCreateInput) {
    return db.article.create({ data });
  },

  updateStatus(id: string, status: ArticleStatus, rejectedNote?: string) {
    return db.article.update({
      where: { id },
      data: {
        status,
        rejectedNote: status === "REJECTED" ? rejectedNote : null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });
  },

  incrementDownloadCount(id: string) {
    return db.article.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
    });
  },
};
