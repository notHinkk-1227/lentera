-- Penulis majemuk, SDG, tautan eksternal, dan status akun.
--
-- DITULIS MANUAL (bukan hasil `migrate dev` mentah) karena Prisma membaca pergantian nama
-- `authorId` -> `uploaderId` sebagai "hapus kolom + tambah kolom", yang akan gagal / menghapus
-- data pada tabel berisi. Di sini kolomnya di-RENAME sehingga data lama tetap utuh, lalu data
-- lama di-backfill ke tabel penulis yang baru.

-- CreateEnum
CREATE TYPE "AuthorType" AS ENUM ('DOSEN', 'MAHASISWA', 'EKSTERNAL');

-- AlterTable: status akun
ALTER TABLE "users" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable: authorId -> uploaderId (rename, data tetap), tautan eksternal
ALTER TABLE "articles" RENAME COLUMN "authorId" TO "uploaderId";
ALTER TABLE "articles" RENAME CONSTRAINT "articles_authorId_fkey" TO "articles_uploaderId_fkey";
ALTER TABLE "articles"
  ADD COLUMN "doi" TEXT,
  ADD COLUMN "scopusUrl" TEXT,
  ADD COLUMN "scholarUrl" TEXT;

-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "AuthorType" NOT NULL DEFAULT 'DOSEN',
    "affiliation" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_authors" (
    "articleId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "corresponding" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "article_authors_pkey" PRIMARY KEY ("articleId","authorId")
);

-- CreateTable
CREATE TABLE "sdgs" (
    "number" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,

    CONSTRAINT "sdgs_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "article_sdgs" (
    "articleId" TEXT NOT NULL,
    "sdgNumber" INTEGER NOT NULL,

    CONSTRAINT "article_sdgs_pkey" PRIMARY KEY ("articleId","sdgNumber")
);

-- CreateIndex
CREATE UNIQUE INDEX "authors_userId_key" ON "authors"("userId");

-- CreateIndex
CREATE INDEX "authors_name_idx" ON "authors"("name");

-- CreateIndex
CREATE INDEX "article_authors_articleId_position_idx" ON "article_authors"("articleId", "position");

-- CreateIndex
CREATE INDEX "article_authors_authorId_idx" ON "article_authors"("authorId");

-- CreateIndex
CREATE INDEX "article_sdgs_sdgNumber_idx" ON "article_sdgs"("sdgNumber");

-- AddForeignKey
ALTER TABLE "authors" ADD CONSTRAINT "authors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_authors" ADD CONSTRAINT "article_authors_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_authors" ADD CONSTRAINT "article_authors_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_sdgs" ADD CONSTRAINT "article_sdgs_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_sdgs" ADD CONSTRAINT "article_sdgs_sdgNumber_fkey" FOREIGN KEY ("sdgNumber") REFERENCES "sdgs"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Data acuan: 17 SDG (sumber yang sama dengan lib/sdg.ts; seed juga meng-upsert-nya).
INSERT INTO "sdgs" ("number", "name", "shortName") VALUES
  (1, 'Tanpa Kemiskinan', 'Tanpa Kemiskinan'),
  (2, 'Tanpa Kelaparan', 'Tanpa Kelaparan'),
  (3, 'Kehidupan Sehat dan Sejahtera', 'Hidup Sehat'),
  (4, 'Pendidikan Berkualitas', 'Pendidikan'),
  (5, 'Kesetaraan Gender', 'Kesetaraan Gender'),
  (6, 'Air Bersih dan Sanitasi Layak', 'Air Bersih'),
  (7, 'Energi Bersih dan Terjangkau', 'Energi Bersih'),
  (8, 'Pekerjaan Layak dan Pertumbuhan Ekonomi', 'Pekerjaan Layak'),
  (9, 'Industri, Inovasi, dan Infrastruktur', 'Industri & Inovasi'),
  (10, 'Berkurangnya Kesenjangan', 'Kesenjangan'),
  (11, 'Kota dan Permukiman yang Berkelanjutan', 'Kota Berkelanjutan'),
  (12, 'Konsumsi dan Produksi yang Bertanggung Jawab', 'Konsumsi & Produksi'),
  (13, 'Penanganan Perubahan Iklim', 'Perubahan Iklim'),
  (14, 'Ekosistem Lautan', 'Ekosistem Laut'),
  (15, 'Ekosistem Daratan', 'Ekosistem Darat'),
  (16, 'Perdamaian, Keadilan, dan Kelembagaan yang Tangguh', 'Keadilan & Kelembagaan'),
  (17, 'Kemitraan untuk Mencapai Tujuan', 'Kemitraan');

-- Backfill 1/2: setiap akun yang pernah mengunggah karya mendapat satu profil penulis
-- (tipe DOSEN, afiliasi = nama fakultasnya). Id deterministik agar mudah dilacak.
INSERT INTO "authors" ("id", "name", "type", "affiliation", "userId")
SELECT 'aut_' || u."id", u."name", 'DOSEN'::"AuthorType", f."name", u."id"
FROM "users" u
LEFT JOIN "faculties" f ON f."id" = u."facultyId"
WHERE EXISTS (SELECT 1 FROM "articles" a WHERE a."uploaderId" = u."id");

-- Backfill 2/2: pengunggah lama dijadikan satu-satunya penulis (urutan 1, korespondensi),
-- sama seperti perilaku tampilan sebelum tabel ini ada.
INSERT INTO "article_authors" ("articleId", "authorId", "position", "corresponding")
SELECT a."id", 'aut_' || a."uploaderId", 1, true
FROM "articles" a;
