# Rencana Implementasi LENTERA — 12 Minggu

**Periode:** Senin 28 September – Jumat 18 Desember 2026 (60 hari kerja)
**Acuan:** `PRD.md` v2.3 (ID seperti `FR-AUTH-03` merujuk ke sana)

## Asumsi dan cara pakai

- 1 developer, sekitar 6 jam kerja efektif per hari, Senin–Jumat. Angka `(2 j)` = estimasi jam.
- Hari libur nasional dan cuti bersama **belum dihitung**. Minggu 21 Des – 1 Jan sengaja dikosongkan sebagai cadangan dan pemantauan pasca-rilis.
- Centang `[ ]` di setiap tugas seiring pengerjaan. Baris **Selesai bila** adalah syarat hari itu dianggap beres.
- Bila satu hari meleset, geser sisa tugasnya ke Jumat minggu itu (tiap Jumat ada 2 jam cadangan). Bila meleset lebih dari 2 hari dalam satu minggu, lihat bagian "Kalau jadwal mepet".

**Aturan harian**

1. Awal hari: pilih tugas hari itu dari daftar. Akhir hari: commit, dorong, dan centang.
2. Satu cabang per fitur (`feature/<nama>`), pesan commit mengikuti `.gitmessage` (mis. `feat(api): tambah upload PDF`).
3. Jumat: demo kecil dan review minggu.
4. Definisi selesai untuk kode: jalan di lokal, `npm run lint` dan pengecekan tipe lulus, tidak menambah data dummy, dan tes untuk logika kritis (peran, visibilitas, statistik) lulus.

## Ringkasan

| Minggu | Tanggal | Fokus | Milestone |
|---|---|---|---|
| 1 | 28 Sep – 2 Okt | Persiapan, data, ganti nama | — |
| 2 | 5 – 9 Okt | Skema baru dan keamanan peran | — |
| 3 | 12 – 16 Okt | Unggah sungguhan | — |
| 4 | 19 – 23 Okt | Verifikasi dan dashboard | **MVP (23 Okt)** |
| 5 | 26 – 30 Okt | Halaman publik dari database | — |
| 6 | 2 – 6 Nov | Tautan Scholar/Scopus, akun, impor dosen | — |
| 7 | 9 – 13 Nov | MAESTRO | — |
| 8 | 16 – 20 Nov | Impor karya lama dan staging | **Beta (20 Nov)** |
| 9 | 23 – 27 Nov | Production, keamanan, cadangan | — |
| 10 | 30 Nov – 4 Des | Pengujian dan sisa fitur | — |
| 11 | 7 – 11 Des | UAT dan dokumentasi | — |
| 12 | 14 – 18 Des | Peluncuran | **Rilis v1.0 (18 Des)** |

## Tenggat keputusan (dari PRD bagian 11)

| Keputusan | Harus selesai | Alasan |
|---|---|---|
| 11.1 Homepage utama, 11.9 akun mahasiswa, 11.15 sumber data dosen | Jumat 2 Okt | Menentukan skema dan pekerjaan UI |
| 11.10 Kebijakan PDF penuh atau hanya tautan | Jumat 16 Okt | Menentukan form unggah dan akses berkas |
| 11.5 Hosting, 11.18 Privasi profil dosen | Jumat 6 Nov | Storage dibangun minggu 8, MAESTRO minggu 7 |

---

# BULAN 1 — MVP

## Minggu 1 (28 Sep – 2 Okt): Persiapan

#### Senin 28 Sep — Setup dan kondisi awal
- [ ] Siapkan project: `npm install`, PostgreSQL lokal, salin `.env.example` ke `.env` (2 j)
- [ ] `npx prisma generate`, `migrate dev`, jalankan `seed.ts` dan `seed-roadmap.ts` (harus 72 topik) (2 j)
- [ ] `npm run dev`, login dengan akun seed, buka semua halaman, catat bug ke daftar "kondisi awal" (1,5 j)
- [ ] Baca `node_modules/next/dist/docs/` bagian route handler, Server Action, `params` async, dan middleware/proxy, sesuai peringatan di `AGENTS.md` (0,5 j)

**Selesai bila:** aplikasi jalan lokal dengan database dan seed; daftar masalah awal tertulis.

#### Selasa 29 Sep — Data dan backlog
- [ ] Kirim permintaan ke Biro P2M: data dosen (nama, gelar depan/belakang, jabatan fungsional, NIDN, email, fakultas, prodi, ID Scopus/Scholar/ORCID, foto) dan karya lama (judul, abstrak, tahun, penulis, PDF, DOI) (2 j)
- [ ] Buat dua template CSV kosong (dosen, karya) agar format jelas sejak awal (1 j)
- [ ] Jadwalkan pertemuan keputusan 11.1, 11.9, 11.15 (0,5 j)
- [ ] Buat GitHub Project 12 minggu dan isi backlog dari file ini (2 j)
- [ ] Hitung kasar biaya bulanan cloud (database, storage, hosting) untuk 2–3 kandidat penyedia pada skala ±1000 karya dan trafik publik kampus, sebagai bahan keputusan 11.5 (0,5 j)

**Selesai bila:** permintaan data terkirim; backlog tersedia; ada angka biaya kasar untuk dibandingkan.

#### Rabu 30 Sep — Ganti nama ke LENTERA
- [ ] Ganti nama tampil di `app/layout.tsx` (metadata), `app/login/page.tsx`, `NetflixHeader`, `NetflixFooter` (isi "Universitas Widyatama"), dan sidebar (2 j)
- [ ] Ubah `name` di `package.json`, `README.md`, judul di `CLAUDE.md` (1 j)
- [ ] Tampilkan "LENTERA" beserta kepanjangannya di halaman login dan footer (1 j)
- [ ] Letakkan `PRD.md` dan folder `referensi/` berdampingan di repo; commit `chore: ganti nama ke LENTERA` (2 j)

**Selesai bila:** tidak ada lagi tulisan "Repositori Karya Ilmiah" di UI.

#### Kamis 1 Okt — CI dan kualitas dasar
- [ ] GitHub Actions: install, lint, pengecekan tipe (`tsc --noEmit`), build (2 j)
- [ ] Perbaiki temuan lint dan tipe (2 j)
- [ ] Pastikan `.env` di `.gitignore`; perbarui `.env.example` (AUTH_SECRET, DATABASE_URL, variabel storage) (0,5 j)
- [ ] Pastikan `prisma generate` berjalan di CI (README menyebut belum pernah diverifikasi) (1,5 j)

**Selesai bila:** CI hijau di `main`.

#### Jumat 2 Okt — Review dan keputusan
- [ ] Pertemuan keputusan 11.1, 11.9, 11.15; catat hasil di PRD (naikkan ke v2.4) (1,5 j)
- [ ] Gambar ERD final: `Article`, `Author`, `ArticleAuthor`, `Sdg`, `ArticleSdg`, `RoadmapTopic`, `ArticleReview` (2,5 j)
- [ ] Cadangan / rapikan hasil minggu ini (2 j)

**Selesai bila:** tiga keputusan tercatat; ERD siap dipakai minggu depan.

## Minggu 2 (5 – 9 Okt): Skema baru dan keamanan peran

#### Senin 5 Okt — Skema
- [ ] Tambah ke `schema.prisma`: `Sdg`, `ArticleSdg`, `Author` (slug, tipe, `photoUrl`, `titlePrefix`, `titleSuffix`, `academicRank`, `bio`, `isPublic`, `nidn`, `scopusAuthorId`, `scholarId`, `orcid`, fakultas, relasi opsional ke `User`), `ArticleAuthor` (urutan, korespondensi) (3 j)
- [ ] Ubah `Article`: `authorId` menjadi `uploaderId`; tambah `doi`, `scopusUrl`, `scholarUrl`; tambah `Role.MAHASISWA` hanya bila 11.9 menghendaki (1,5 j)
- [ ] Tambah `User.isActive` dan `User.mustChangePassword` (0,5 j)
- [ ] Tinjau ulang skema terhadap PRD bagian 6 (1 j)

**Selesai bila:** `prisma validate` lulus.

#### Selasa 6 Okt — Migrasi dan seed
- [ ] `prisma migrate dev --name sdg_author_links`; tulis skrip migrasi data (buat `Author` dari tiap `User` dosen, isi `uploaderId`) (2,5 j)
- [ ] Buat `seed-sdg.ts` (17 SDG: nomor, nama, slug) (1 j)
- [ ] Sesuaikan `seed.ts` ke skema baru; pecah gelar dari nama (mis. "Dr. Andi Wijaya" menjadi `titlePrefix` + nama) (1,5 j)
- [ ] Uji `prisma migrate reset` dari nol sampai seed selesai (1 j)

**Selesai bila:** database bersih terbentuk penuh dari migrasi + seed.

#### Rabu 7 Okt — Repository dan service
- [ ] Perbarui `articleRepository`: include penulis, SDG, topik roadmap, kategori (2 j)
- [ ] Buat repository baru: `authorRepository`, `sdgRepository`, `facultyRepository`, `categoryRepository`, `roadmapRepository` (daftar opsi untuk form) (2 j)
- [ ] Sesuaikan tipe di `articleService`; hapus asumsi satu penulis (2 j)

**Selesai bila:** semua query lewat repository, tanpa Prisma langsung di route atau komponen.

#### Kamis 8 Okt — Guard peran di server (`FR-AUTH-03`)
- [ ] Buat helper `requireRole()` (redirect/403) di `lib/` (1,5 j)
- [ ] Pasang di layout `/admin` (ADMIN) dan `/dosen` (DOSEN), di Server Action `approveArticleAction`/`rejectArticleAction`, dan di `POST /api/articles` (2,5 j)
- [ ] Cek dokumentasi Next untuk redirect awal lewat middleware/proxy (nama file berbeda antar versi) dan terapkan bila cocok (1 j)
- [ ] Uji manual: dosen membuka `/admin` dan memanggil aksi admin harus ditolak (1 j)

**Selesai bila:** dosen tidak bisa mencapai area admin lewat halaman maupun aksi.

#### Jumat 9 Okt — Identitas sesi dan tes pertama
- [ ] Sidebar dan header memakai data sesi, bukan `dummyCurrentDosen`/`dummyCurrentAdmin`; tombol Keluar; tombol "Unggah" hanya untuk yang berhak (`FR-AUTH-04`) (2 j)
- [ ] Pasang Vitest; tulis tes unit untuk `requireRole` (2 j)
- [ ] Demo kecil, review minggu, cadangan (2 j)

**Selesai bila:** tampilan mengikuti peran login; tes guard lulus di CI.

## Minggu 3 (12 – 16 Okt): Unggah sungguhan

#### Senin 12 Okt — Storage lokal
- [ ] Implementasi `LocalStorage.upload/delete`; tambahkan `read`/`getStream` pada interface `FileStorage` (2 j)
- [ ] Simpan berkas di folder privat (gitignored), **bukan** di `public/`, supaya karya non-terbit tidak dapat diakses langsung (`NFR-SEC-04`) (1,5 j)
- [ ] Buat route penyaji berkas `/api/files/[id]` yang mengecek status dan peran (2 j)
- [ ] Tes: berkas karya `PENDING` tidak bisa diambil publik (0,5 j)

**Selesai bila:** berkas tersimpan dan hanya tersaji sesuai aturan status.

#### Selasa 13 Okt — Endpoint upload
- [ ] `/api/upload`: multipart, wajib login, validasi PDF (tipe MIME + tanda `%PDF`), maks 20 MB (2,5 j)
- [ ] Validasi foto/cover JPG/PNG maks 2 MB (1 j)
- [ ] Skema zod untuk tanggapan dan galat yang jelas (1 j)
- [ ] Tes unit validasi berkas (1,5 j)

**Selesai bila:** berkas yang salah ditolak di server dengan pesan jelas (`FR-NASKAH-02`).

#### Rabu 14 Okt — Cover
- [ ] Implementasi `TemplateCoverStrategy`: pilih cover dari `lib/cover-images` sesuai tema bidang keilmuan; hilangkan `throw` yang membuat submit gagal (2,5 j)
- [ ] Implementasi `ManualCoverStrategy` untuk cover unggahan dosen (1,5 j)
- [ ] Bila tidak ada padanan tema, pakai cover default (1 j)
- [ ] Tes: submit tanpa cover selalu mendapat cover (1 j)

**Selesai bila:** `submitArticle` tidak lagi melempar galat karena cover (`FR-NASKAH-10`).

#### Kamis 15 Okt — Form unggah bagian 1
- [ ] Muat opsi dari database: fakultas pengunggah, kategori, SDG, topik roadmap (tersaring menurut tipe dan tahun) (2 j)
- [ ] Pilihan tipe Penelitian/PkM yang membuka field kondisional: region, mitra, bidang fokus PkM (PkM); tema penelitian (Riset) (2 j)
- [ ] Pemilih SDG multi-pilih dan pemilih topik roadmap (2 j)

**Selesai bila:** form menampilkan semua field wajib `FR-NASKAH-01/03/04/08` dari database.

#### Jumat 16 Okt — Form unggah bagian 2
- [ ] Input penulis majemuk: tambah, urutkan, tipe (dosen/mahasiswa/eksternal), cari dosen internal, tandai korespondensi (`FR-NASKAH-09`) (2,5 j)
- [ ] Field DOI, URL Scopus, URL Scholar dengan validasi (1 j)
- [ ] Sesuaikan skema zod `POST /api/articles`; buat `submitArticle` transaksional (penulis, SDG, kategori dalam satu transaksi); ganti simulasi `setTimeout` di form dengan panggilan API sungguhan (2 j)
- [ ] Bila 11.10 menetapkan mode "hanya tautan": tambah field `accessMode` (0,5 j)

**Selesai bila:** dosen dapat mengirim karya lengkap dan tersimpan berstatus `PENDING` di database.

## Minggu 4 (19 – 23 Okt): Verifikasi dan dashboard

#### Senin 19 Okt — Riwayat verifikasi
- [ ] Tambah tabel `ArticleReview` (artikel, peninjau, keputusan, catatan, waktu) dan migrasi (2 j)
- [ ] Ubah `reviewArticle` agar mencatat riwayat dan tidak menghapus catatan lama (`FR-VERIF-04`) (2 j)
- [ ] Antrean admin dari `getPendingQueue()` menggantikan `dummyPendingQueue` (2 j)

**Selesai bila:** antrean menampilkan karya `PENDING` asli.

#### Selasa 20 Okt — Halaman review admin
- [ ] `/admin/[id]` dari database: penulis, SDG, topik roadmap, PDF melalui route penyaji berkas (2,5 j)
- [ ] Setujui/tolak lewat service; catatan penolakan wajib (`FR-VERIF-02/03`) (2 j)
- [ ] Admin dapat mengoreksi SDG sebelum menyetujui (`FR-NASKAH-08`) (1,5 j)

**Selesai bila:** karya yang disetujui mendapat `publishedAt` dan berstatus `PUBLISHED`.

#### Rabu 21 Okt — Dashboard dosen
- [ ] Statistik dosen dari database (`FR-STAT-01`) (2 j)
- [ ] Halaman `/dosen/artikel`: daftar, filter status, catatan penolakan terlihat (`FR-NASKAH-07`) (2,5 j)
- [ ] Hapus link mati di sidebar dan pastikan tiap menu punya halaman (1,5 j)

**Selesai bila:** dosen melihat status karyanya sendiri, bukan milik orang lain.

#### Kamis 22 Okt — Revisi dan kelola fakultas/kategori
- [ ] Halaman edit `/dosen/artikel/[id]/edit` untuk karya `REJECTED`; kirim ulang mengembalikan status ke `PENDING` (`FR-VERIF-04`) (3 j)
- [ ] Pastikan hanya pemilik yang dapat mengedit (uji) (1 j)
- [ ] Kelola fakultas dan kategori dari database (`FR-ADM-01`), tanpa hapus bila dipakai karya (2 j)

**Selesai bila:** siklus tolak → revisi → kirim ulang berjalan.

#### Jumat 23 Okt — Uji MVP dan demo
- [ ] Uji manual alur lengkap: unggah → tolak → revisi → setujui → tampil (2 j)
- [ ] Tulis tes service untuk transisi status dan pemilik karya (2 j)
- [ ] Perbaiki bug, beri tag `v0.1-mvp`, demo internal (2 j)

**Selesai bila:** **Milestone MVP** — alur inti berjalan di database sungguhan.

---

# BULAN 2 — Fitur utama dan integrasi data

## Minggu 5 (26 – 30 Okt): Halaman publik dari database

#### Senin 26 Okt — Pencarian dan filter (repository)
- [ ] Tambah kolom `searchText` (judul, abstrak, kata kunci, nama penulis) yang diisi service, karena Prisma tidak bisa mencocokkan sebagian pada kolom `String[]` tanpa raw SQL (2 j)
- [ ] `findPublished`: pencarian sebagian tak peka huruf besar-kecil; filter tahun, fakultas, kategori, tipe, SDG, topik roadmap; hitung total untuk paginasi (`FR-PUB-02/03`) (3 j)
- [ ] Tes: hanya `PUBLISHED` yang muncul (1 j)

**Selesai bila:** mengetik "energi" menemukan kata kunci "energi terbarukan".

#### Selasa 27 Okt — Halaman pencarian
- [ ] `/search` dari database dengan filter di URL dan paginasi (3 j)
- [ ] `SearchResultCard`: tampilkan penulis dan lencana SDG (1,5 j)
- [ ] Keadaan kosong dan galat (1,5 j)

**Selesai bila:** semua filter bisa dikombinasikan dan dibagikan lewat URL.

#### Rabu 28 Okt — Homepage
- [ ] Tambah `Article.isFeatured` (admin menyalakan di halaman review) (1 j)
- [ ] Homepage varian terpilih (11.1) memakai `getHomepageSections()` (3 j)
- [ ] Buat pemeta dari model Prisma ke tipe tampilan; arsipkan varian yang tidak dipilih (2 j)

**Selesai bila:** homepage tidak lagi memakai `dummyFeaturedArticle`/`dummyLatestArticles`.

#### Kamis 29 Okt — Detail karya
- [ ] `/articles/[id]` lengkap sesuai PRD tabel 5.4.1: penulis sebagai chip, topik roadmap, kategori, data PkM, riset sumber dan PkM turunan (3 j)
- [ ] Komponen `SdgBadge` (nomor, warna, nama); periksa pedoman ikon SDG dari PBB sebelum memakai ikon resmi (1,5 j)
- [ ] Karya non-terbit menghasilkan 404; `generateMetadata` dasar (1,5 j)

**Selesai bila:** semua kelompok data di 5.4.1 tampil.

#### Jumat 30 Okt — Unduh dan tes visibilitas
- [ ] Route unduh: hanya `PUBLISHED`, menambah `downloadCount` lewat `registerDownload`, mendukung mode "hanya tautan" (2,5 j)
- [ ] Tes: `PENDING`/`REJECTED` mendapat 404 di halaman **dan** API publik (`FR-PUB-06`) (1,5 j)
- [ ] Cari sisa impor `dummy-data` di halaman publik; demo dan review (2 j)

**Selesai bila:** unduhan menambah hitungan; tidak ada kebocoran karya non-terbit.

## Minggu 6 (2 – 6 Nov): Tautan eksternal, akun, impor dosen

#### Senin 2 Nov — Tautan Scholar/Scopus/DOI
- [ ] Komponen tautan: DOI ke `doi.org`, tombol "Lihat di Scopus" bila terisi, "Cari di Google Scholar" dibentuk dari judul (`FR-EXT-01..03`) (2,5 j)
- [ ] Validasi URL dan penanganan bila kosong (`FR-EXT-06`) (1,5 j)
- [ ] Tautan profil penulis internal (Scopus/Scholar/ORCID) (2 j)

**Selesai bila:** karya tanpa tautan tetap tampil tanpa galat.

#### Selasa 3 Nov — Metadata untuk crawler
- [ ] Meta tag `citation_title`, `citation_author` (satu per penulis), `citation_publication_date`, `citation_doi`, dan `citation_pdf_url` (hanya bila PDF publik) lewat `generateMetadata` (3 j)
- [ ] `sitemap.xml` dan `robots.txt` berisi karya terbit (2 j)
- [ ] Periksa hasil di "view source" untuk 3 karya contoh (1 j)

**Selesai bila:** tag muncul benar di HTML yang dirender server (`FR-EXT-05`).

#### Rabu 4 Nov — Karya serupa dan Bagikan
- [ ] Query "karya serupa" berdasarkan kesamaan topik roadmap, SDG, dan kata kunci (3 j)
- [ ] Tombol Bagikan (salin tautan) (1 j)
- [ ] Nama penulis dosen menaut ke `/maestro/[slug]` (halaman menyusul minggu depan) (2 j)

**Selesai bila:** detail karya menampilkan karya serupa yang masuk akal.

#### Kamis 5 Nov — Skrip impor dosen dan privasi
- [ ] Skrip impor CSV dosen dengan validasi zod dan mode uji (dry-run) yang melaporkan galat per baris (2,5 j)
- [ ] Upsert `Author` (dan `User` bila 11.15 menghendaki), gelar depan/belakang terpisah (1,5 j)
- [ ] Tes dengan CSV contoh (0,5 j)
- [ ] Ajukan draf kebijakan privasi dan `NFR-PRIV-01` (data yang tampil publik, data yang disembunyikan) ke bagian hukum/IT kampus untuk ditinjau; minta **persetujuan tertulis**, bukan sekadar diskusi lisan (1,5 j)

**Selesai bila:** CSV contoh terimpor tanpa duplikat saat dijalankan dua kali; draf privasi sudah terkirim untuk ditinjau.

#### Jumat 6 Nov — Kelola akun, pilot dosen, dan halaman kebijakan
- [ ] Admin: buat, reset kata sandi, dan nonaktifkan akun; `authorize` menolak akun nonaktif; wajib ganti kata sandi saat login pertama (`FR-AUTH-02`) (2,5 j)
- [ ] Impor data pilot (±20 dosen dari Biro P2M) (1 j)
- [ ] Buat halaman `/kebijakan-privasi` dan `/syarat-penggunaan` (boleh draf awal, disempurnakan setelah persetujuan hukum/IT turun); tautkan dari footer (1,5 j)
- [ ] **Tenggat 11.5 (hosting) dan 11.18 (privasi)**; review minggu (1 j)

**Selesai bila:** akun dosen dapat dibuat dan dinonaktifkan tanpa menyentuh database manual; halaman kebijakan privasi dapat diakses publik; persetujuan hukum/IT dalam proses atau sudah didapat.

## Minggu 7 (9 – 13 Nov): MAESTRO

#### Senin 9 Nov — Statistik dosen
- [ ] `statsService` + `authorRepository`: jumlah penelitian dan PkM per dosen dari karya `PUBLISHED` (penulis di posisi mana pun) (2 j)
- [ ] Jumlah karya per SDG dan sebaran topik roadmap (persen dan jumlah; riset per spesialisasi dengan rincian topik, PkM per topik). Agregasi dilakukan di TypeScript dari karya milik dosen itu, karena `groupBy` Prisma tidak menjangkau relasi bertingkat dan raw SQL dihindari (`FR-MAE-04..06`) (3 j)
- [ ] Tes: persentase tiap tampilan berjumlah 100%; karya `PENDING` tidak dihitung (1 j)

**Selesai bila:** angka statistik benar untuk data fixture.

#### Selasa 10 Nov — Daftar MAESTRO
- [ ] `/maestro`: kartu dosen (foto atau avatar inisial, nama + gelar, fakultas, jumlah penelitian dan PkM) (2,5 j)
- [ ] Pencarian nama, filter fakultas/SDG/tipe, urut abjad atau jumlah karya, paginasi; profil `isPublic = false` tidak muncul (`FR-MAE-02`, `FR-MAE-12`) (2,5 j)
- [ ] Tambah menu MAESTRO, Penelitian, PkM di navigasi kedua header (`FR-MAE-01`) (1 j)

**Selesai bila:** daftar dosen tampil dan dapat disaring.

#### Rabu 11 Nov — Detail dosen bagian 1
- [ ] `/maestro/[slug]`: foto, nama, gelar, jabatan, fakultas, bio (2 j)
- [ ] Kartu angka penelitian, PkM, total; tautan Scopus/Scholar/ORCID (2 j)
- [ ] Keterangan "Berdasarkan karya yang tercatat di LENTERA", keadaan kosong, 404 untuk profil tidak publik (2 j)

**Selesai bila:** profil tampil untuk dosen dengan dan tanpa karya.

#### Kamis 12 Nov — Detail dosen bagian 2
- [ ] Bagian SDG: ikon, nama, jumlah karya, urut terbanyak, SDG 0 disembunyikan (`FR-MAE-05`) (2 j)
- [ ] Grafik persentase roadmap (Penelitian dan PkM) dengan CSS/SVG tanpa pustaka baru; nilai persen dan jumlah tertulis sebagai teks (`FR-MAE-06`) (2,5 j)
- [ ] Daftar karya dosen dengan filter tipe (`FR-MAE-07`) (1,5 j)

**Selesai bila:** halaman detail memuat seluruh tabel 5.9.1 kecuali grafik mini.

#### Jumat 13 Nov — Kelola profil
- [ ] Admin `/admin/maestro`: daftar, ubah, tampil/sembunyi (`FR-ADM-04`) (2 j)
- [ ] Dosen `/dosen/profil`: ubah foto dan bio; unggah foto lewat storage (`FR-MAE-10`) (2 j)
- [ ] Grafik mini per tahun (`FR-MAE-13`) bila waktu ada; bila tidak, pindahkan ke backlog; review minggu (2 j)

**Selesai bila:** dosen dapat memperbarui foto sendiri; admin dapat menyembunyikan profil.

## Minggu 8 (16 – 20 Nov): Impor karya lama dan staging

#### Senin 16 Nov — Template dan validator impor karya
- [ ] Finalisasi template CSV karya: judul, abstrak, tahun, tipe, penulis (dipisah `;`), tipe penulis, fakultas, kategori, nomor SDG, kode topik roadmap (mis. `sustainability-2024-a`), kata kunci, DOI, URL Scopus, nama berkas PDF, region, mitra, riset sumber (2 j)
- [ ] Validator dry-run: laporan galat per baris (SDG tak dikenal, topik tak ada, penulis tak cocok) (4 j)

**Selesai bila:** CSV contoh menghasilkan laporan galat yang bisa ditindaklanjuti.

#### Selasa 17 Nov — Skrip impor karya
- [ ] Pencocokan penulis ke `Author` lewat NIDN/email/nama yang dinormalisasi; sisanya ditandai untuk ditinjau (3 j)
- [ ] Impor idempoten (lewati bila DOI atau judul+tahun sudah ada); PDF diambil dari folder (2 j)
- [ ] Hasil impor berstatus `PENDING` agar melewati verifikasi admin (1 j)

**Selesai bila:** menjalankan impor dua kali tidak menggandakan karya.

#### Rabu 18 Nov — Staging cloud
- [ ] Pilih penyedia sesuai 11.5; siapkan database cloud dan `prisma migrate deploy` (2 j)
- [ ] Implementasi `CloudStorage` (Vercel Blob atau Cloudflare R2), pemilihan strategi lewat environment (3 j)
- [ ] Deploy staging pertama; atur variabel lingkungan (`AUTH_SECRET`, `AUTH_TRUST_HOST` bila di luar Vercel) (1 j)

**Selesai bila:** staging dapat diakses; unggah dan unduh berkas bekerja di cloud.

#### Kamis 19 Nov — Batch pertama dan alat penandaan
- [ ] Halaman "antrean penandaan" untuk admin: saring karya tanpa SDG atau tanpa topik, ubah cepat, setujui massal (3 j)
- [ ] Impor batch pertama (±50 karya) ke staging; admin mulai menandai SDG dan topik (2 j)
- [ ] Catat masalah data (penulis tak cocok, PDF hilang) (1 j)

**Selesai bila:** admin dapat menandai puluhan karya tanpa membuka satu per satu.

#### Jumat 20 Nov — Beta
- [ ] Hapus `lib/dummy-data.ts` dan seluruh impor dummy (cek dengan pencarian teks) (2 j)
- [ ] Beri tag `v0.2-beta`; demo ke Biro P2M dan kumpulkan umpan balik terstruktur (2 j)
- [ ] Cadangan / rapikan (2 j)

**Selesai bila:** **Milestone Beta** — Biro P2M memakai staging dengan data nyata.

---

# BULAN 3 — Siap pakai

## Minggu 9 (23 – 27 Nov): Production, keamanan, cadangan

#### Senin 23 Nov — Triase umpan balik Beta dan review kode
- [ ] Kelompokkan umpan balik menjadi P1 (menghalangi rilis), P2 (mengganggu), P3 (nanti) (1,5 j)
- [ ] Perbaiki semua P1 (3,5 j)
- [ ] Bila memungkinkan, minta rekan/mentor Magang P2M meninjau titik paling kritis: guard peran (`FR-AUTH-03`), transaksi upload, dan visibilitas karya non-terbit; kalau tidak ada peninjau lain, lakukan tinjauan mandiri dengan jeda sehari dari saat kode ditulis (1 j)

**Selesai bila:** daftar P1 kosong; titik kritis sudah ditinjau minimal sekali oleh selain penulis kodenya sendiri.

#### Selasa 24 Nov — Lingkungan production
- [ ] Buat database dan storage production terpisah dari staging (2 j)
- [ ] Variabel lingkungan production, `AUTH_SECRET` baru, `prisma migrate deploy` (2 j)
- [ ] Seed production: 17 SDG, roadmap, satu admin awal dengan kata sandi kuat; **tanpa `password123`** (`NFR-SEC-01`) (2 j)

**Selesai bila:** production hidup dengan data referensi dan satu admin.

#### Rabu 25 Nov — Keamanan
- [ ] Batas percobaan login dan penguncian sementara (1,5 j)
- [ ] Header keamanan di `next.config.ts`; pastikan berkas non-terbit tak bisa diakses lewat URL langsung di cloud (`NFR-SEC-04`) (1,5 j)
- [ ] Batas laju (rate limit) dasar pada `/api/articles`, `/api/upload`, pencarian, dan login, agar tidak mudah disalahgunakan untuk spam atau pengambilan data massal (2 j)
- [ ] `npm audit`, tinjau dependensi, pastikan tidak ada rahasia di repo (1 j)

**Selesai bila:** daftar cek keamanan dasar lulus; endpoint publik utama punya batas laju.

#### Kamis 26 Nov — Cadangan
- [ ] Jadwalkan pencadangan database (bawaan penyedia atau `pg_dump` terjadwal) dan pencadangan storage (2,5 j)
- [ ] **Uji pemulihan** ke database kosong dan catat langkahnya (2,5 j)
- [ ] Tulis prosedur di runbook (1 j)

**Selesai bila:** pemulihan terbukti berhasil (`NFR-DATA-01`).

#### Jumat 27 Nov — Batch kedua dan pemantauan
- [ ] Impor batch kedua (±50 karya) dan penandaan (2,5 j)
- [ ] Pemantauan dasar: pelacak galat tingkat gratis dan log platform (2 j)
- [ ] Review minggu, cadangan (1,5 j)

**Selesai bila:** galat production tercatat dan dapat dilihat.

## Minggu 10 (30 Nov – 4 Des): Pengujian dan sisa fitur

#### Senin 30 Nov — Tes otomatis
- [ ] Lengkapi tes service: visibilitas publik, peran, statistik MAESTRO, filter pencarian (4 j)
- [ ] Jalankan di CI (2 j)

**Selesai bila:** tes logika kritis lulus di CI.

#### Selasa 1 Des — Tes alur utama
- [ ] Pasang Playwright; skenario: login per peran, unggah → verifikasi → tayang, unduh menambah hitungan, karya non-terbit 404 (5 j)
- [ ] Perbaiki temuan (1 j)

**Selesai bila:** tiga skenario utama lulus otomatis.

#### Rabu 2 Des — Rekap dan roadmap
- [ ] Rekap CSV admin: karya per tahun × topik × fakultas × tipe × SDG (`FR-ROAD-04`) (3 j)
- [ ] Jelajah roadmap publik per spesialisasi/tema/tahun (`FR-ROAD-02`) (3 j)

**Selesai bila:** Biro P2M dapat mengunduh rekap untuk laporan. Bila mepet, potong bagian jelajah roadmap dulu.

#### Kamis 3 Des — Aksesibilitas, performa, dan kompatibilitas
- [ ] Sembunyikan atau fungsikan tombol tanpa aksi (Info, Simpan, Cari di komponen Netflix) (`NFR-A11Y-01`) (1,5 j)
- [ ] Periksa kontras dan navigasi keyboard di halaman utama (1,5 j)
- [ ] Ukur performa (LCP) di halaman publik; rapikan gambar cover yang saat ini memakai `unoptimized` bila perlu (1,5 j)
- [ ] Cek tampilan dan fungsi di Chrome, Safari (termasuk iOS), Firefox, dan Android; perbaiki perbedaan yang mengganggu (mis. input file, layout Tailwind) (1,5 j)

**Selesai bila:** tidak ada tombol yang tampil tetapi tidak berfungsi; alur unggah dan pencarian tetap jalan di Safari dan Android.

#### Jumat 4 Des — Batch akhir dan validasi data
- [ ] Impor sisa karya (2 j)
- [ ] Kueri pemeriksaan konsistensi: karya tanpa SDG/topik, penulis ganda, PDF hilang (2 j)
- [ ] Cocokkan manual angka MAESTRO untuk 5 dosen terhadap datanya; review minggu (2 j)

**Selesai bila:** data lolos pemeriksaan konsistensi.

## Minggu 11 (7 – 11 Des): UAT dan dokumentasi

#### Senin 7 Des — Persiapan UAT
- [ ] Skrip skenario per peran (dosen, admin, publik) dan formulir umpan balik (2,5 j)
- [ ] Siapkan akun uji dan undang 10–20 pengguna (1,5 j)
- [ ] Pelatihan singkat 1 untuk admin (2 j)

**Selesai bila:** peserta UAT terjadwal dan punya akun.

#### Selasa 8 Des — UAT hari 1
- [ ] Sesi pendampingan admin + 5 dosen; catat semua temuan (6 j)

**Selesai bila:** temuan tercatat dengan tingkat keparahan.

#### Rabu 9 Des — UAT hari 2 dan perbaikan
- [ ] Sesi dosen lain dan pengguna publik (3 j)
- [ ] Triase dan perbaiki semua P1 (3 j)

**Selesai bila:** tidak ada P1 terbuka.

#### Kamis 10 Des — Perbaikan dan panduan
- [ ] Perbaiki temuan P2 (3 j)
- [ ] Panduan pengguna: dosen (unggah, revisi, profil) dan admin (verifikasi, impor, kelola akun dan profil), dengan tangkapan layar (3 j)

**Selesai bila:** panduan dapat diikuti pengguna baru tanpa bantuan.

#### Jumat 11 Des — Dokumentasi dan persetujuan
- [ ] Sinkronkan `README.md`, `CLAUDE.md`, `PRD.md` (naikkan versi, perbarui bagian status) (1,5 j)
- [ ] Runbook operasional: deploy, cadangan dan pemulihan, reset kata sandi, menambah dosen (1,5 j)
- [ ] Ajukan domain ke bagian IT kampus; minta persetujuan hasil UAT (1,5 j)
- [ ] Sepakati dengan Biro P2M: siapa yang menangani bug dan permintaan setelah masa pemantauan 2 minggu selesai (developer tetap, tim internal kampus, atau kontrak lanjutan magang) (1,5 j)

**Selesai bila:** UAT disetujui; permintaan domain terkirim; kejelasan penanggung jawab pasca-pemantauan tertulis.

## Minggu 12 (14 – 18 Des): Peluncuran

#### Senin 14 Des — Domain dan uji asap
- [ ] Hubungkan domain, HTTPS, sesuaikan `AUTH_URL`/`AUTH_TRUST_HOST` dan URL di sitemap (3 j)
- [ ] Uji asap production: login tiap peran, unggah, verifikasi, unduh, pencarian, MAESTRO (2,5 j)
- [ ] Catat versi/tag yang sedang berjalan sebelum lanjut ke tahap berikutnya, sebagai titik kembali bila rollback (Selasa) diperlukan (0,5 j)

**Selesai bila:** semua alur inti lulus di domain final.

#### Selasa 15 Des — Bekukan, regresi, dan rencana rollback
- [ ] Bekukan fitur (hanya perbaikan bug sesudah ini) (0,5 j)
- [ ] Regresi penuh dengan daftar cek (2 j)
- [ ] Verifikasi pemulihan cadangan sekali lagi dan impor data final (1,5 j)
- [ ] Buat akun dosen tahap pertama (1 j)
- [ ] Tulis rencana rollback singkat: tag rilis sebelumnya yang bisa di-deploy ulang, cara mengembalikan database ke titik sebelum migrasi terakhir, dan siapa yang mengambil keputusan bila uji asap besok gagal (1 j)

**Selesai bila:** daftar cek regresi bersih; ada langkah tertulis untuk membatalkan rilis bila diperlukan.

#### Rabu 16 Des — Peluncuran bertahap
- [ ] Buka untuk admin + ±10 dosen pertama; kirim kredensial dan panduan (2 j)
- [ ] Pantau galat dan log sepanjang hari; perbaiki cepat (3 j)
- [ ] Pelatihan singkat 2 untuk dosen (rekaman atau sesi) (1 j)

**Selesai bila:** pengguna pertama berhasil unggah tanpa bantuan.

#### Kamis 17 Des — Peluncuran umum
- [ ] Umumkan lewat Biro P2M; buka akun dosen sisanya secara bertahap (2 j)
- [ ] Pantau galat, kinerja, dan pertanyaan; siapkan jalur bantuan cepat (4 j)

**Selesai bila:** publik dapat mengakses; tidak ada galat kritis terbuka.

#### Jumat 18 Des — Serah terima dan retrospektif
- [ ] Beri tag `v1.0`, arsipkan varian homepage yang tidak dipakai (1 j)
- [ ] Retrospektif dan serah terima dokumentasi (2 j)
- [ ] Backlog fase lanjutan: sinkronisasi sitasi (OpenAlex/Scopus), H-index dan kuartil, dosen serupa, jaringan kolaborasi, notifikasi email, `Prodi`, unit riset (2 j)
- [ ] Rencana 2 minggu pemantauan pasca-rilis (1 j)

**Selesai bila:** **Rilis v1.0** dan backlog fase berikutnya tersusun.

---

## Risiko utama

| Risiko | Dampak | Pencegahan |
|---|---|---|
| Data dosen dan karya lama datang terlambat | Minggu 6–10 tertunda | Diminta di 29 Sep; pilot 20 dosen sudah cukup untuk mulai |
| Penandaan SDG dan topik roadmap manual makan waktu | Impor melambat lebih dari coding | Alat penandaan di 19 Nov; jadwalkan admin per batch, bukan sekaligus |
| Keputusan menggantung | Pekerjaan diulang | Tabel tenggat keputusan di atas |
| Next.js 16 dan NextAuth v5 (beta) berbeda dari kebiasaan | Waktu debugging tak terduga | Baca dokumentasi di `node_modules` (28 Sep dan 8 Okt); sisakan cadangan Jumat |
| Kapasitas satu orang | Semua jalur terhenti | Jangan menambah fitur di luar PRD sebelum 30 Nov |

## Kalau jadwal mepet, potong dalam urutan ini

1. Grafik mini per tahun di MAESTRO (`FR-MAE-13`)
2. Karya serupa dan tombol Bagikan (`FR-PUB-04` bagian lanjutan)
3. Jelajah roadmap publik (`FR-ROAD-02`) dan rekap CSV (`FR-ROAD-04`)
4. Salah satu varian homepage (arsipkan yang tidak dipilih)

**Tidak boleh dipotong:** guard peran, alur verifikasi, SDG dan topik roadmap pada karya, MAESTRO dasar, cadangan, dan UAT.

## Daftar cek rilis (Selasa 15 Des)

- [ ] Semua fitur wajib berjalan tanpa data dummy; `lib/dummy-data.ts` sudah dihapus
- [ ] Dosen tidak dapat mengakses area admin (halaman, Server Action, API)
- [ ] Karya `PENDING`/`REJECTED` tidak bocor lewat halaman, API, maupun URL berkas
- [ ] Tidak ada akun atau kata sandi contoh di production
- [ ] Sekitar 100 karya terbit dan 30 profil dosen (angka usulan; sesuaikan dengan Biro P2M)
- [ ] Cadangan terjadwal dan pemulihan pernah diuji
- [ ] Tes otomatis lulus di CI; UAT disetujui
- [ ] Domain dan HTTPS aktif; `sitemap.xml` dan meta `citation_*` benar
- [ ] Panduan pengguna dan runbook tersedia
- [ ] Endpoint publik utama (login, pencarian, upload) punya batas laju dasar
- [ ] Alur unggah dan pencarian sudah dicek di Safari dan Android, bukan hanya Chrome desktop
- [ ] Halaman kebijakan privasi dan syarat penggunaan dapat diakses; persetujuan tertulis hukum/IT sudah ada atau sedang diproses secara resmi
- [ ] Rencana rollback tertulis dan diketahui siapa pengambil keputusan bila uji asap gagal
- [ ] Penanggung jawab pasca-pemantauan 2 minggu sudah disepakati dengan Biro P2M

## Hal di luar coding yang perlu dipantau

Delapan poin ini tersebar ke jadwal di atas, dikumpulkan di sini agar tidak terlewat karena dampaknya baru terasa menjelang atau setelah peluncuran.

| # | Poin | Minggu ditambahkan | Kenapa penting |
|---|---|---|---|
| 1 | Kebijakan Privasi dan Syarat Penggunaan di situs | 6 | Situs menyimpan data pribadi dosen dan mahasiswa; tanpa halaman ini publikasi profil MAESTRO rawan disorot dari sisi hukum |
| 2 | Persetujuan tertulis hukum/IT untuk `NFR-PRIV-01` | 6 | Sebelumnya hanya tercatat sebagai "keputusan", belum ada tugas konkret untuk memperolehnya |
| 3 | Estimasi biaya cloud | 1 | Rencana memilih penyedia (11.5) tanpa menghitung biaya bulanan setelah data bertambah |
| 4 | Uji kompatibilitas browser/perangkat | 10 | Publik mengakses dari berbagai perangkat; sebelumnya hanya diuji fungsional lewat Playwright |
| 5 | Perlindungan API dasar (rate limit, anti-bot) | 9 | `NFR-SEC-*` sebelumnya fokus ke password dan akses berkas, belum ke spam/scraping |
| 6 | Rencana rollback | 12 | Sebelumnya tidak ada langkah tertulis untuk membatalkan rilis bila uji asap gagal di hari-H |
| 7 | Review kode oleh selain penulisnya | 9 | Rencana ini 1 developer; tanpa tinjauan sejawat, risiko bug di titik kritis (guard peran, transaksi upload) lebih tinggi |
| 8 | Kesepakatan dukungan pasca-rilis | 11 | Rencana sebelumnya berhenti di retrospektif minggu 12, tanpa kejelasan siapa menangani bug setelah 2 minggu pemantauan |

## Riwayat Perubahan

| Versi | Perubahan |
|---|---|
| 1.1 | Tambah 8 poin di luar coding: estimasi biaya cloud (minggu 1), halaman kebijakan privasi dan persetujuan tertulis hukum/IT (minggu 6), review kode dan perlindungan API/rate limit (minggu 9), uji kompatibilitas browser/perangkat (minggu 10), kesepakatan dukungan pasca-rilis (minggu 11), rencana rollback (minggu 12); perbarui daftar cek rilis |
| 1.0 | Versi awal, 12 minggu dengan rincian tugas harian |
