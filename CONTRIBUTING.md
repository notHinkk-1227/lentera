# Panduan Kontribusi

Terima kasih sudah membantu! Baca `PRD.md` (kebutuhan produk) dan `CLAUDE.md` (arsitektur & aturan coding) sebelum mulai.

## Setup Lokal

1. `npm install`
2. Salin `.env.example` → `.env`, isi `DATABASE_URL` dan `AUTH_SECRET` (`openssl rand -base64 32`)
3. `npx prisma generate`
4. `npx prisma migrate dev`
5. `npx prisma db seed` (mengisi data contoh; password akun contoh HANYA untuk development lokal)
6. `npm run dev`

> Setiap orang memakai database sendiri (lokal atau project Neon/Supabase pribadi). Jangan berbagi `.env` lewat chat/commit.

## Alur Kerja Git

- Branch `main` selalu harus bisa jalan. **Jangan push langsung ke `main`**, semua lewat Pull Request.
- Buat branch dari `main` dengan format `feature/...`, `fix/...`, `docs/...`, `chore/...`, contoh:
  - `feature/homepage-netflix`
  - `fix/login-validation`
  - `docs/update-readme`
- Satu PR = satu tujuan. Usahakan kecil supaya mudah direview.
- Minimal 1 reviewer harus approve sebelum merge. Gunakan **Squash and merge**.
- Sebelum buka PR: `git pull --rebase origin main` agar tidak konflik.

## Format Commit

Aktifkan template commit sekali saja:

```bash
git config commit.template .gitmessage
```

Format: `tipe(scope): judul singkat` — contoh `feat(dosen): tambah form upload artikel`.
Daftar tipe & scope ada di `.gitmessage`.

## Aturan Kode (ringkasan dari CLAUDE.md)

- TypeScript, bukan JavaScript.
- Route handler (`app/api/**`) hanya urus request/response. Business logic di `lib/services/`, akses DB di `lib/repositories/`.
- Semua akses database lewat Prisma Client, tanpa raw SQL kecuali terpaksa.
- File upload lewat abstraksi `lib/storage/`, jangan tulis ke filesystem langsung.
- Artikel `PENDING`/`REJECTED` tidak boleh muncul di halaman/endpoint publik.
- Validasi input dengan `zod`.
- Jangan hardcode secret; semua lewat `.env`.

## Sebelum Membuka Pull Request

Pastikan semua ini lolos di lokal (CI menjalankan hal yang sama):

```bash
npm run lint
npm run typecheck
npm run build
```

## Perubahan Skema Database

- Ubah `prisma/schema.prisma`, lalu `npx prisma migrate dev --name deskripsi_singkat`.
- **Commit folder `prisma/migrations/`** bersama perubahan skema.
- Beri tahu tim di PR agar semua menjalankan `npx prisma migrate dev` setelah pull.
- Hindari dua orang mengubah skema bersamaan; koordinasi dulu.

## Pembagian Pekerjaan

Ambil task dari tab **Issues**. Beri komentar / assign diri sendiri sebelum mengerjakan agar tidak ada pekerjaan ganda.

## Catatan Saat Ini (Fase Dummy Data)

Sebagian besar halaman masih memakai `lib/dummy-data.ts`. Saat mengganti ke data asli:

- Panggil `articleService`, jangan Prisma/dummy langsung dari page atau server action.
- Hapus komentar `TODO` yang bersangkutan setelah selesai.
- Setiap server action (`"use server"`) dan route handler yang mengubah data **wajib** cek `auth()` dan role (`ADMIN`/`DOSEN`) sendiri. Jangan mengandalkan layout saja.
