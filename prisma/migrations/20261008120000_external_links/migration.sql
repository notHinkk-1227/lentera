-- LENTERA tidak lagi menyimpan berkas PDF; karya hanya menaut ke situs eksternal.
-- fileUrl (wajib, menunjuk berkas lokal/cloud) diganti downloadUrl (opsional, tautan http(s)).
ALTER TABLE "articles" RENAME COLUMN "fileUrl" TO "downloadUrl";
ALTER TABLE "articles" ALTER COLUMN "downloadUrl" DROP NOT NULL;

-- Nilai lama yang bukan tautan http(s) (mis. "local:seed/placeholder.pdf") tidak berguna lagi.
UPDATE "articles" SET "downloadUrl" = NULL WHERE "downloadUrl" !~* '^https?://';

-- Tautan profil SINTA karya/penulis.
ALTER TABLE "articles" ADD COLUMN "sintaUrl" TEXT;
