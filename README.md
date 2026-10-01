# LENTERA

**Layanan Eksplorasi Penelitian, Teknologi & Pengabdian** — Universitas Widyatama

LENTERA adalah etalase hasil **penelitian** dan **pengabdian kepada masyarakat (PkM)** dosen Universitas Widyatama, yang dikelola Biro P2M. Dosen mengunggah karya, admin memverifikasi, lalu karya tayang ke publik. Setiap karya dikaitkan dengan topik roadmap Renstra 2024–2028 dan, sesuai rencana, dengan SDG serta tautan Google Scholar/Scopus.

> **Status:** dalam pengembangan aktif (target rilis v1.0: 18 Desember 2026). Antarmuka sudah ada, tetapi sebagian besar halaman masih memakai data dummy. Rinciannya ada di bagian [Status Pengembangan](#status-pengembangan).

## Fitur

| Untuk | Fitur |
| --- | --- |
| **Publik** (tanpa login) | Homepage bertema gelap ala Netflix (hero karya unggulan, pencarian, filter kategori, carousel "Artikel terbaru" dan "Paling banyak diunduh", baris Top 10), pencarian, halaman detail karya |
| **Dosen** | Dashboard ringkasan, daftar karya beserta status verifikasi, formulir unggah karya (PDF + metadata) |
| **Admin / Pustakawan** | Antrean verifikasi (setujui atau tolak dengan catatan), kelola fakultas dan kategori |
| **Taksonomi roadmap** | 4 spesialisasi riset, 10 tema, 6 bidang fokus PkM, 72 topik (50 riset + 22 PkM) untuk 2024–2028 |

Alur karya: `PENDING` → admin menyetujui (`PUBLISHED`) atau menolak dengan catatan (`REJECTED`). Hanya karya `PUBLISHED` yang boleh tampil di halaman dan API publik.

Direncanakan untuk fase 1 (lihat [`PRD.md`](PRD.md)): klasifikasi SDG, penulis majemuk (dosen/mahasiswa/eksternal), tautan Google Scholar/Scopus, dan **MAESTRO** (direktori profil dosen/peneliti beserta statistiknya).

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript · PostgreSQL · Prisma 6 · NextAuth v5 (Credentials, session JWT) · Tailwind CSS 4 · Zod

> **Perhatian:** versi Next.js yang dipakai punya perubahan dibanding yang umum diketahui (misalnya `middleware` kini bernama `proxy`). Sebelum menulis kode, baca dokumentasi yang ikut terpasang di `node_modules/next/dist/docs/` setelah `npm install`. Lihat juga [`AGENTS.md`](AGENTS.md).

## Memulai

**Prasyarat:** Node.js 20+ (disarankan 22) dan PostgreSQL lokal, atau database cloud (Neon/Supabase).

```bash
npm install
cp .env.example .env          # isi DATABASE_URL dan AUTH_SECRET
npx prisma migrate dev        # membuat tabel
npx prisma db seed            # akun, fakultas, kategori, dan karya contoh
npm run db:seed:roadmap       # taksonomi roadmap (harus menghasilkan 72 topik)
npm run dev
```

Buka http://localhost:3000. `npm install` otomatis menjalankan `prisma generate`.

Buat `AUTH_SECRET` dengan `openssl rand -base64 32`. Jangan commit file `.env`.

### Akun contoh (khusus development lokal)

`prisma db seed` membuat akun berikut, semuanya memakai kata sandi `password123`:

| Peran | Email |
| --- | --- |
| Admin | `rini.kartika@kampus.ac.id` |
| Dosen | `andi.wijaya@kampus.ac.id` (dan beberapa dosen lain, lihat `prisma/seed.ts`) |

Kata sandi ini hanya untuk database lokal. Jangan pernah dipakai di staging atau production.

### Variabel lingkungan

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `DATABASE_URL` | Ya | Connection string PostgreSQL |
| `AUTH_SECRET` | Ya | Secret NextAuth |
| `AUTH_URL` | Production | URL publik aplikasi |
| `BLOB_READ_WRITE_TOKEN` | Opsional | Hanya bila memakai Vercel Blob untuk storage production |

## Script

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Build dan jalankan production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Cek tipe TypeScript (jalankan setelah `npm run build` atau `npm run dev` pertama, karena tipe rute dibuat oleh Next.js) |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:seed` | Seed akun, fakultas, kategori, dan karya contoh |
| `npm run db:seed:roadmap` | Seed taksonomi roadmap (aman dijalankan berulang) |

## Struktur Proyek

```
app/
  page.tsx             homepage utama (/), bertema gelap, memakai header dan footer sendiri
  (public)/            pencarian (/search) dan detail karya (/articles/[id]), memakai PublicHeader terang
  (dashboard)/
    admin/             antrean verifikasi, review karya, kelola fakultas & kategori
    dosen/             ringkasan, karya saya, unggah karya
  login/               halaman login
  api/
    articles/          GET (pencarian publik), POST (unggah, hanya DOSEN)
    auth/              handler NextAuth
components/            auth, dashboard, layout, public (search/detail), public-alt (homepage)
lib/
  auth.ts              konfigurasi NextAuth
  authz.ts             requireRole(): otorisasi per peran di server
  db.ts                Prisma Client
  repositories/        akses data lewat Prisma
  services/            business logic (artikel, cover)
  storage/             abstraksi penyimpanan file (lokal vs cloud)
  dummy-data.ts        data sementara untuk UI (akan dihapus)
prisma/                schema, migrasi, seed, data roadmap
types/                 augmentasi tipe NextAuth (id, role)
```

## Arsitektur

Alur data berlapis: **route handler / Server Action → service → repository → Prisma**.

- Route handler hanya mengurus request dan response; logika bisnis ada di `lib/services/`; query database hanya di `lib/repositories/`.
- Penyimpanan file memakai interface `FileStorage` (`LocalStorage` untuk dev, `CloudStorage` untuk production), sehingga mudah diganti tanpa mengubah service.
- Cover karya dibuat lewat `CoverGenerator` (saat ini `TemplateCoverStrategy`).
- **Otorisasi:** panggil `requireRole("ADMIN" | "DOSEN")` dari `lib/authz.ts` di setiap halaman dashboard, Server Action, dan route handler yang dibatasi peran. Jangan hanya mengandalkan layout: layout tidak dirender ulang saat navigasi dan Server Action dapat dipanggil langsung.

Model data inti: `User` (ADMIN/DOSEN), `Faculty`, `Category`, `Article` (status, tipe RESEARCH/PKM, region dan mitra untuk PkM, tautan PkM ke riset sumber), serta taksonomi roadmap (`ResearchStream`, `ResearchTheme`, `PkmFocusArea`, `RoadmapYear`, `RoadmapTopic`). Skema lengkap ada di `prisma/schema.prisma`.

## Status Pengembangan

Diperbarui 2 Oktober 2026. Untuk status terhadap tiap kebutuhan produk, lihat bagian 12 di [`PRD.md`](PRD.md).

**Sudah ada**
- [x] Setup proyek, skema database dengan 2 migrasi, seed akun/contoh/roadmap
- [x] Login (Credentials) dengan session berisi `id` dan `role`
- [x] Otorisasi per peran di server untuk halaman dan Server Action dashboard (`requireRole`)
- [x] Homepage utama bertema gelap (`/`), UI pencarian, detail karya, dashboard dosen, dan dashboard admin
- [x] `GET /api/articles` (hanya karya `PUBLISHED`) dan `POST /api/articles` (hanya `DOSEN`, validasi Zod)
- [x] Nama LENTERA di antarmuka dan metadata

**Masih dummy / belum selesai**
- [ ] Halaman masih membaca `lib/dummy-data.ts`, belum `articleService`
- [ ] Server Action verifikasi admin belum tersambung ke database
- [ ] `LocalStorage` / `CloudStorage` dan `TemplateCoverStrategy` belum diimplementasikan, sehingga unggah karya belum berfungsi
- [ ] Endpoint unduh PDF (menambah `downloadCount`)
- [ ] Skema belum punya SDG, penulis majemuk, dan field DOI/Scopus/Scholar
- [ ] MAESTRO, kelola akun, rekap CSV, filter roadmap
- [ ] Pencarian kata kunci: baru cocok penuh (huruf besar/kecil diabaikan), belum cocok sebagian
- [ ] `/search` dan `/articles/[id]` masih bertema terang, belum seragam dengan homepage gelap

## Jadwal

Rencana 12 minggu oleh satu developer (28 September – 18 Desember 2026), rincian harian di [`RENCANA-IMPLEMENTASI.md`](RENCANA-IMPLEMENTASI.md).

| Milestone | Tanggal |
| --- | --- |
| MVP: skema baru, guard peran, unggah, verifikasi | 23 Oktober |
| Beta: halaman publik dari database, MAESTRO, staging | 20 November |
| Rilis v1.0 | 18 Desember |

## Dokumen

| File | Isi |
| --- | --- |
| [`PRD.md`](PRD.md) | Kebutuhan produk, model data, keputusan terbuka |
| [`RENCANA-IMPLEMENTASI.md`](RENCANA-IMPLEMENTASI.md) | Jadwal dan tugas harian 12 minggu |
| [`CLAUDE.md`](CLAUDE.md) | Arsitektur dan aturan coding (juga acuan untuk Claude Code) |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Alur kerja tim, branch, commit, dan PR |
| [`AGENTS.md`](AGENTS.md) | Catatan khusus versi Next.js yang dipakai |

## Kontribusi

Lihat [`CONTRIBUTING.md`](CONTRIBUTING.md). Singkatnya: jangan push langsung ke `main`, satu PR satu tujuan, dan pastikan `npm run lint`, `npm run build`, dan `npm run typecheck` lulus sebelum membuka PR.
