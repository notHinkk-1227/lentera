# Repositori Karya Ilmiah Dosen

Website institutional repository untuk menghimpun karya ilmiah dosen. Dosen mengunggah karya, admin memverifikasi, publik dapat mencari dan mengunduh karya yang sudah dipublikasikan.

**Stack:** Next.js (App Router) · TypeScript · PostgreSQL · Prisma · NextAuth (Auth.js) · Tailwind CSS

## Dokumen Penting

| File | Isi |
| --- | --- |
| [`PRD.md`](PRD.md) | Kebutuhan produk |
| [`CLAUDE.md`](CLAUDE.md) | Arsitektur & aturan coding |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Alur kerja tim, branch, commit, PR |

## Prasyarat

- Node.js 20+ (disarankan 22)
- PostgreSQL lokal, atau database cloud (Neon/Supabase)

## Menjalankan Project

```bash
npm install
cp .env.example .env        # lalu isi DATABASE_URL dan AUTH_SECRET
npx prisma generate
npx prisma migrate dev
npx prisma db seed          # opsional, data awal
npm run dev
```

Buka http://localhost:3000.

## Script

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Build & jalankan production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Cek tipe TypeScript |

## Struktur Folder

```
app/
  (public)/        halaman publik: homepage, detail artikel, pencarian
  homepage-netflix/ versi alternatif homepage (tema gelap)
  (dashboard)/     halaman dosen & admin (perlu login)
  api/             route handler (articles, auth, upload)
prisma/            schema.prisma, migrasi, seed
lib/
  db.ts            Prisma Client
  auth.ts          konfigurasi NextAuth
  services/        business logic
  repositories/    akses data via Prisma
  storage/         abstraksi file storage (lokal vs cloud)
components/        komponen UI (auth, dashboard, layout, public, public-alt)
types/             augmentasi tipe NextAuth
```

Alur data: `route handler → service → repository → Prisma`.

## Status Pengembangan

<!-- Perbarui bagian ini tiap ada progres. Detail task ada di tab Issues. -->

Sudah ada:
- [x] Setup project (Next.js, TypeScript, Tailwind, Prisma)
- [x] Skema database + 2 migrasi (`init`, `roadmap`) + seed
- [x] Login (NextAuth Credentials, JWT berisi `id` & `role`)
- [x] UI halaman publik (homepage formal, pencarian, detail artikel)
- [x] UI alternatif homepage bertema Netflix (`/homepage-netflix`)
- [x] UI dashboard dosen (unggah) & admin (antrean verifikasi, kelola)

Masih berupa dummy / TODO:
- [ ] Halaman masih memakai `lib/dummy-data.ts`, belum `articleService`
- [ ] Server action verifikasi admin belum terhubung ke database
- [ ] Cek role (ADMIN vs DOSEN) per halaman & per action
- [ ] `LocalStorage` / `CloudStorage` (upload file & cover)
- [ ] `TemplateCoverStrategy` (generate cover otomatis)
- [ ] Endpoint download (increment counter)
- [ ] Putuskan: homepage formal atau Netflix yang jadi utama

## Kontribusi

Lihat [`CONTRIBUTING.md`](CONTRIBUTING.md).
