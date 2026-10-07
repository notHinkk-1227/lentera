# CLAUDE.md

Panduan kerja untuk Claude (via Claude Code) saat membantu pengembangan project **LENTERA** (Layanan Eksplorasi Penelitian, Teknologi & Pengabdian, Universitas Widyatama). Lihat `PRD.md` untuk detail lengkap kebutuhan produk.

## Ringkasan Project

Website institutional repository untuk menghimpun karya ilmiah dosen suatu universitas. Dosen mengunggah karya secara mandiri, admin memverifikasi sebelum publikasi, publik dapat mencari dan mengunduh karya yang telah dipublikasikan.

## Tech Stack (Wajib Diikuti)

- **Frontend & Backend**: Next.js (App Router), pendekatan full-stack — backend berupa API Routes di `app/api/`
- **Bahasa**: TypeScript, bukan JavaScript biasa
- **Database**: PostgreSQL
- **ORM**: Prisma — semua akses database wajib lewat Prisma Client, jangan raw SQL kecuali benar-benar diperlukan
- **Auth**: NextAuth.js (Auth.js)
- **File Storage**: lokal untuk development; Vercel Blob atau Cloudflare R2 untuk production — jangan asumsikan file system persisten di production
- **Styling**: gunakan pendekatan utility-first (Tailwind CSS) kecuali diarahkan lain

## Struktur Folder yang Diharapkan

```
app/
  (public)/            # halaman publik: homepage, detail artikel, hasil pencarian
  (dashboard)/          # halaman dosen & admin (perlu auth)
  api/
    articles/            # endpoint CRUD artikel
    auth/                 # endpoint auth (NextAuth)
    upload/               # endpoint upload file & cover
prisma/
  schema.prisma          # skema database
lib/
  db.ts                   # instance Prisma Client
  auth.ts                  # konfigurasi NextAuth
components/               # komponen UI reusable
```

## Model Data Inti (Acuan Awal)

Entitas utama yang harus ada di `schema.prisma`:
- **User** — punya role (`ADMIN`, `DOSEN`), terhubung ke fakultas
- **Article** — judul, abstrak, kata kunci, tahun, status (`PENDING`, `PUBLISHED`, `REJECTED`), fileUrl, coverUrl, jumlah unduhan
- **Faculty** — nama fakultas/prodi
- **Category** — kategori/bidang keilmuan

Relasi: satu User (dosen) punya banyak Article; satu Article terhubung ke satu Faculty dan satu/banyak Category.

Sesuaikan dan detailkan skema ini bersama user sebelum implementasi — jangan asumsikan field final tanpa konfirmasi.

## Alur Kerja Utama yang Harus Didukung

1. **Dosen upload artikel** → status default `PENDING`, admin dapat melihatnya di antrean verifikasi
2. **Admin verifikasi** → ubah status jadi `PUBLISHED` atau `REJECTED` (dengan catatan)
3. **Publik mengakses homepage** → melihat hero artikel unggulan, carousel "Artikel Terbaru" & "Paling Banyak Diunduh", search bar, filter fakultas/kategori
4. **Publik cari & buka artikel** → hanya artikel berstatus `PUBLISHED` yang muncul di pencarian publik
5. **Publik klik "Unduh"** → increment counter unduhan, lalu diarahkan ke tautan unduh di situs eksternal

## Prinsip Desain UI

- Terinspirasi pola interaksi Netflix (hero banner, carousel horizontal per kategori, card dengan cover) tapi **tetap formal/akademik** — bukan meniru visual entertainment.
- Cover artikel adalah **cover ter-generate dari template** (judul + penulis + warna/ikon sesuai fakultas), bukan foto bebas. Dosen bisa override dengan upload cover sendiri (opsional).
- Search bar selalu jadi elemen utama di bagian atas halaman publik — pengguna repository datang dengan tujuan pencarian spesifik, bukan sekadar browsing santai.
- Referensi tone visual: Google Scholar, ResearchGate, Semantic Scholar — bukan platform hiburan.

## Batasan & Hal yang Harus Dihindari

- Jangan menyimpan berkas PDF di LENTERA. Karya hanya menaut ke situs eksternal (tautan unduh, Google Scholar, SINTA). Semua URL eksternal wajib divalidasi hanya http(s) di server sebelum disimpan atau dipakai untuk redirect.
- Jangan tampilkan artikel berstatus `PENDING`/`REJECTED` di halaman/endpoint publik.
- Jangan hardcode kredensial atau connection string — selalu lewat environment variables (`.env`).
- Jangan lakukan raw query SQL kecuali Prisma tidak bisa mengakomodasi kasusnya, dan jelaskan alasannya saat itu terjadi.

## Prinsip Coding & Design Pattern

Kode wajib mengikuti struktur berlapis berikut, jangan campur semua logic di dalam route handler:

```
app/api/articles/route.ts   → hanya urus request/response (parsing input, panggil service, kembalikan response)
lib/services/                → business logic (mis. articleService.ts, coverService.ts, statsService.ts)
lib/repositories/            → akses data via Prisma (mis. articleRepository.ts)
```

### Penerapan SOLID (secukupnya, sesuai konteks Next.js/TypeScript — bukan OOP murni)

- **Single Responsibility** — route handler hanya urus HTTP request/response; logic bisnis (verifikasi artikel, generate cover, hitung statistik) ditaruh di service layer; akses database ditaruh di repository layer.
- **Open/Closed** — modul yang kemungkinan besar berkembang (generator cover) dibuat lewat interface, sehingga menambah varian baru tidak perlu mengubah kode yang sudah ada.
- **Liskov Substitution** — implementasi apa pun dari sebuah interface (misal generator cover) harus bisa saling menggantikan tanpa mengubah perilaku pemanggilnya.
- **Interface Segregation** — buat interface yang kecil dan spesifik (mis. `CoverGenerator`, `FileStorage`) daripada satu interface besar yang menangani banyak hal sekaligus.
- **Dependency Inversion** — service layer bergantung pada interface (mis. `FileStorage`), bukan implementasi konkret (`LocalStorage`/`CloudStorage`) secara langsung, supaya gampang di-swap antara development dan production.

### Design Pattern yang Direkomendasikan

- **Repository pattern** — semua query Prisma dibungkus di `lib/repositories/`, tidak dipanggil langsung dari route handler atau komponen.
- **Service layer pattern** — logic seperti verifikasi artikel, generate cover, dan penghitungan statistik unduhan ditaruh di `lib/services/`.
- **Strategy pattern** — dipakai untuk:
  - Storage file: `LocalStorage` (development) vs `CloudStorage` (Vercel Blob/Cloudflare R2), keduanya mengimplementasikan interface `FileStorage` yang sama
  - Sumber cover: `TemplateCoverStrategy` (default, ter-generate otomatis) vs `ManualCoverStrategy` (upload dosen), keduanya mengimplementasikan interface `CoverGenerator`
- **Factory pattern** — dipakai untuk membuat cover otomatis berdasarkan kategori/fakultas (memilih warna dan ikon yang sesuai).

### Catatan Penerapan

Jangan terapkan pattern secara berlebihan (over-engineering) untuk skala project ini (±1000 data, tim kecil). Prioritaskan **Single Responsibility** dan **Repository/Service layer** sebagai fondasi wajib. Strategy dan Factory pattern cukup diterapkan di bagian yang memang disebutkan (cover) karena di situlah kemungkinan perubahan/ekspansi paling besar.

## Skala & Performa

Estimasi data awal ±1000 artikel — skala kecil. Tidak perlu optimasi prematur (caching kompleks, sharding, dsb) di fase awal. Prioritaskan kebenaran fungsional dan kejelasan kode.

## Referensi

Detail lengkap kebutuhan produk, alasan pemilihan stack, rencana deployment, dan referensi kompetitor ada di `PRD.md` pada root project — baca dokumen tersebut sebelum mengambil keputusan arsitektural yang belum tercakup di file ini.
