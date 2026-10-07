// Repository: satu-satunya tempat yang bicara langsung ke Prisma untuk tabel Article.
// Tidak ada business logic di sini; aturan (siapa boleh apa, status apa) ada di articleService.
import type { ArticleStatus, Prisma } from "@prisma/client";
import { db } from "@/lib/db";

// Select dipersempit sengaja: jangan pernah menarik `author: true` karena itu membawa
// passwordHash dan email pengguna ke lapisan yang bisa berujung di respons publik.
const listInclude = {
  // Pengunggah dipakai untuk otorisasi; penulis (tampilan) ada di `authors`, berurutan.
  uploader: { select: { id: true, name: true } },
  authors: {
    orderBy: { position: "asc" },
    include: { author: { select: { name: true, type: true, affiliation: true } } },
  },
  faculty: { select: { id: true, name: true } },
  categories: { include: { category: { select: { id: true, name: true } } } },
} satisfies Prisma.ArticleInclude;

const detailInclude = {
  ...listInclude,
  roadmapTopic: { include: { stream: { select: { name: true } } } },
  themes: { select: { name: true } },
  pkmFocusAreas: { select: { name: true } },
  sdgs: { select: { sdgNumber: true } },
} satisfies Prisma.ArticleInclude;

export type ArticleListRow = Prisma.ArticleGetPayload<{ include: typeof listInclude }>;
export type ArticleDetailRow = Prisma.ArticleGetPayload<{ include: typeof detailInclude }>;

export type PublicFilter = {
  query?: string;
  facultyId?: string;
  /** Pencocokan nama fakultas (tidak peka huruf besar/kecil), dipakai oleh chip filter di UI. */
  facultyName?: string;
  categoryId?: string;
};

export type PublicSort = "latest" | "downloads";

const ORDER: Record<PublicSort, Prisma.ArticleOrderByWithRelationInput[]> = {
  latest: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  downloads: [{ downloadCount: "desc" }, { publishedAt: "desc" }],
};

// Kata kunci disimpan sebagai String[], jadi hanya bisa dicocokkan persis per elemen.
// Variasi huruf ini menutup kasus paling umum; pencocokan sebagian butuh tabel kata kunci
// terpisah (lihat catatan di PRD 6.3).
function keywordVariants(q: string): string[] {
  const lower = q.toLowerCase();
  return [...new Set([q, lower, q.toUpperCase(), lower.charAt(0).toUpperCase() + lower.slice(1)])];
}

function publishedWhere(filter: PublicFilter): Prisma.ArticleWhereInput {
  const where: Prisma.ArticleWhereInput = { status: "PUBLISHED" };
  const query = filter.query?.trim();

  if (filter.facultyId) where.facultyId = filter.facultyId;
  if (filter.facultyName) {
    where.faculty = { name: { contains: filter.facultyName, mode: "insensitive" } };
  }
  if (filter.categoryId) where.categories = { some: { categoryId: filter.categoryId } };
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { authors: { some: { author: { name: { contains: query, mode: "insensitive" } } } } },
      { keywords: { hasSome: keywordVariants(query) } },
    ];
  }
  return where;
}

export const articleRepository = {
  async findPublished(
    filter: PublicFilter & { take: number; skip?: number; sort?: PublicSort },
  ): Promise<{ items: ArticleListRow[]; total: number }> {
    const where = publishedWhere(filter);
    const [items, total] = await db.$transaction([
      db.article.findMany({
        where,
        include: listInclude,
        orderBy: ORDER[filter.sort ?? "latest"],
        take: filter.take,
        skip: filter.skip ?? 0,
      }),
      db.article.count({ where }),
    ]);
    return { items, total };
  },

  findMostDownloaded(take: number): Promise<ArticleListRow[]> {
    return db.article.findMany({
      where: { status: "PUBLISHED" },
      include: listInclude,
      orderBy: ORDER.downloads,
      take,
    });
  },

  countPublished(): Promise<number> {
    return db.article.count({ where: { status: "PUBLISHED" } });
  },

  // Hanya karya PUBLISHED: karya lain harus 404 di halaman publik (FR-PUB-06).
  findPublishedById(id: string): Promise<ArticleDetailRow | null> {
    return db.article.findFirst({ where: { id, status: "PUBLISHED" }, include: detailInclude });
  },

  // Kandidat "karya serupa": topik roadmap sama, kata kunci beririsan, atau kategori sama.
  findSimilarCandidates(current: ArticleDetailRow, take = 30): Promise<ArticleDetailRow[]> {
    const or: Prisma.ArticleWhereInput[] = [];
    if (current.roadmapTopicId) or.push({ roadmapTopicId: current.roadmapTopicId });
    if (current.keywords.length > 0) or.push({ keywords: { hasSome: current.keywords } });
    const sdgNumbers = current.sdgs.map((s) => s.sdgNumber);
    if (sdgNumbers.length > 0) or.push({ sdgs: { some: { sdgNumber: { in: sdgNumbers } } } });
    const categoryIds = current.categories.map((c) => c.categoryId);
    if (categoryIds.length > 0) or.push({ categories: { some: { categoryId: { in: categoryIds } } } });
    if (or.length === 0) return Promise.resolve([]);

    return db.article.findMany({
      where: { status: "PUBLISHED", id: { not: current.id }, OR: or },
      include: detailInclude,
      orderBy: ORDER.downloads,
      take,
    });
  },

  // Tanpa filter status: dipakai admin untuk meninjau karya yang belum terbit.
  findById(id: string): Promise<ArticleListRow | null> {
    return db.article.findUnique({ where: { id }, include: listInclude });
  },

  findPending(): Promise<ArticleListRow[]> {
    return db.article.findMany({
      where: { status: "PENDING" },
      include: listInclude,
      orderBy: { createdAt: "asc" }, // yang paling lama menunggu di atas
    });
  },

  // Karya yang DIUNGGAH akun ini (dashboard "Karya saya"), bukan karya yang ia tulis.
  findByUploader(uploaderId: string): Promise<ArticleListRow[]> {
    return db.article.findMany({
      where: { uploaderId },
      include: listInclude,
      orderBy: { createdAt: "desc" },
    });
  },

  findDownloadInfo(id: string) {
    return db.article.findUnique({
      where: { id },
      select: { id: true, title: true, status: true, downloadUrl: true, uploaderId: true },
    });
  },

  incrementDownloadCount(id: string) {
    return db.article.update({
      where: { id },
      data: { downloadCount: { increment: 1 } },
      select: { id: true },
    });
  },

  create(data: {
    title: string;
    abstract: string;
    keywords: string[];
    year: number;
    downloadUrl?: string;
    scholarUrl?: string;
    sintaUrl?: string;
    coverUrl: string | null;
    uploaderId: string;
    /** Profil penulis pengunggah; menjadi penulis pertama (korespondensi). */
    authorId: string;
    facultyId: string;
    categoryIds: string[];
  }) {
    const { categoryIds, authorId, ...rest } = data;
    return db.article.create({
      data: {
        ...rest,
        status: "PENDING",
        authors: { create: [{ authorId, position: 1, corresponding: true }] },
        categories: {
          create: categoryIds.map((categoryId) => ({ category: { connect: { id: categoryId } } })),
        },
      },
      select: { id: true },
    });
  },

  // Atomik: hanya karya yang MASIH PENDING yang berubah, jadi dua admin yang menekan tombol
  // bersamaan tidak saling menimpa. Mengembalikan false bila karya sudah ditinjau / tidak ada.
  async reviewIfPending(
    id: string,
    status: Extract<ArticleStatus, "PUBLISHED" | "REJECTED">,
    note?: string,
  ): Promise<boolean> {
    const result = await db.article.updateMany({
      where: { id, status: "PENDING" },
      data: {
        status,
        rejectedNote: status === "REJECTED" ? (note ?? null) : null,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });
    return result.count > 0;
  },
};
