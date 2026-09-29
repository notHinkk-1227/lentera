# PRD — LENTERA: Layanan Eksplorasi Penelitian, Teknologi & Pengabdian

> **Versi:** 2.3 — Universitas Widyatama
> **Cara membaca tanda:**
> `[ASUMSI]` = ditulis berdasarkan kode/skema yang ada atau kesimpulan wajar, belum dikonfirmasi.
> `[PERLU KONFIRMASI]` = keputusan terbuka, lihat bagian 11.
> ID kebutuhan (mis. `FR-AUTH-03`) dipakai sebagai acuan di issue, commit, dan pengujian.

---

## 1. Ringkasan Produk

**LENTERA** (Layanan Eksplorasi Penelitian, Teknologi & Pengabdian) adalah platform untuk **menampilkan hasil penelitian dan pengabdian kepada masyarakat (PkM)** dari dosen dan mahasiswa/mahasiswi **Universitas Widyatama** (Bandung). Platform dikelola Biro P2M `[ASUMSI: Biro P2M tetap sebagai pengelola, sesuai branding di kode]`.

Setiap karya ditampilkan lengkap dengan cover, penulis, abstrak, kaitannya dengan **Sustainable Development Goals (SDG)**, dan topik pada roadmap penelitian/PkM kampus. Setiap karya juga terhubung ke **Google Scholar dan Scopus**.

Alur pengelolaan tetap: karya diunggah, diverifikasi admin, lalu tayang ke publik.

LENTERA memiliki menu tambahan **MAESTRO**, yaitu direktori dosen/peneliti Universitas Widyatama. Setiap profil menampilkan foto, nama dan gelar, fakultas, statistik penelitian dan PkM, SDG yang ditekuni, dan sebaran topik roadmap. Seluruh statistik dihitung dari karya yang tayang di LENTERA.

## 2. Tujuan dan Ukuran Keberhasilan

| Tujuan | Ukuran keberhasilan (fase 1) |
|---|---|
| Etalase terpusat hasil penelitian dan PkM Universitas Widyatama | Karya dosen dan mahasiswa yang disetujui dapat ditemukan dari satu tempat |
| Menunjukkan kontribusi ke SDG dan roadmap Renstra | Setiap karya terbit memiliki ≥1 SDG dan 1 topik roadmap; publik dapat memfilter berdasarkan keduanya |
| Terhubung dengan ekosistem indeks ilmiah | Halaman karya menyediakan tautan ke Google Scholar dan Scopus, serta metadata yang dapat dibaca crawler Scholar (lihat 5.8) |
| Mendukung kebutuhan administratif (akreditasi, SINTA, laporan) | Admin dapat merekap karya per tahun, tipe, fakultas, topik roadmap, dan SDG (`FR-ROAD-04`) |
| Menampilkan rekam jejak dosen/peneliti | Setiap dosen punya profil publik di MAESTRO dengan jumlah penelitian, jumlah PkM, SDG, dan sebaran topik roadmap yang selalu sesuai data terbit |
| Pengalaman menjelajah yang modern | Pengguna menemukan karya dari homepage tanpa mengetik, atau dari pencarian dalam ≤ 3 interaksi |

## 3. Pengguna dan Peran

| Peran | Kebutuhan utama | Batas akses |
|---|---|---|
| **Dosen** | Unggah karya (sebagai penulis atau pembimbing), pantau status verifikasi, revisi bila ditolak, lihat statistik karyanya, melengkapi profil MAESTRO miliknya | Karya yang ia unggah dan profilnya sendiri |
| **Mahasiswa/mahasiswi** | Karyanya tampil sebagai penulis; opsional mengunggah sendiri `[PERLU KONFIRMASI: 11.9]` | Sesuai keputusan 11.9 |
| **Admin/Pustakawan** | Verifikasi karya, kelola fakultas/kategori, kelola akun dan profil dosen, lihat rekap | Seluruh data |
| **Publik** | Cari, baca detail, dan unduh/akses karya yang sudah `PUBLISHED`; menelusuri profil dosen di MAESTRO | Tanpa login; hanya karya `PUBLISHED` |

## 4. Ruang Lingkup

### Dalam lingkup (Fase 1)
Autentikasi dan otorisasi per peran; unggah karya (PDF + metadata); **penulis lebih dari satu (dosen, mahasiswa, eksternal)**; **klasifikasi SDG**; klasifikasi roadmap Renstra; alur verifikasi dan revisi; pencarian dan filter; halaman detail; **tautan ke Google Scholar dan Scopus**; statistik unduhan; cover artikel; manajemen fakultas, kategori, dan akun; **menu MAESTRO (direktori dan profil dosen/peneliti dengan statistik)**.

### Di luar lingkup (fase lanjutan)
Sinkronisasi otomatis sitasi dari Scopus/Scholar (membutuhkan kunci API dan izin pihak ketiga); DOI otomatis; SINTA/Garuda; OAI-PMH; citation graph; metrik (H-index, jumlah sitasi, kuartil jurnal, Altmetric/PlumX); jaringan kolaborasi penulis; dosen serupa; kirim pesan ke dosen; papan peringkat (leaderboard) peneliti; profil mahasiswa di MAESTRO; aplikasi mobile; rekomendasi personal.

> **Perubahan dari v2.0:** Google Scholar dan Scopus pindah dari "fase lanjutan" ke fase 1, dalam bentuk tautan dan metadata (bukan sinkronisasi otomatis). Penulis majemuk pindah dari fase lanjutan ke fase 1, karena karya mahasiswa hampir selalu berpenulis lebih dari satu (mahasiswa + pembimbing).
>
> **Perubahan dari v2.1:** menu MAESTRO (direktori dan profil dosen/peneliti) ditambahkan ke fase 1, lengkap dengan statistik jumlah karya, SDG, dan persentase topik roadmap (bagian 5.9).

## 5. Kebutuhan Fungsional

Setiap kebutuhan memiliki kriteria penerimaan (KP) yang dapat diuji.

### 5.1 Autentikasi dan Otorisasi (`FR-AUTH`)

| ID | Kebutuhan | Kriteria penerimaan |
|---|---|---|
| FR-AUTH-01 | Login email + kata sandi untuk pengguna yang punya akun | Kredensial salah menampilkan pesan generik; sukses mengarahkan admin ke `/admin`, dosen ke `/dosen` |
| FR-AUTH-02 | Akun dibuat dan dinonaktifkan oleh admin, tanpa pendaftaran mandiri | Tidak ada halaman register publik; admin dapat membuat, mereset kata sandi, dan menonaktifkan akun |
| FR-AUTH-03 | **Otorisasi per peran di sisi server** | Dosen yang membuka `/admin/*` atau memanggil aksi admin ditolak (redirect/403); berlaku juga untuk Server Action dan route API, bukan hanya layout |
| FR-AUTH-04 | Sidebar dan header menampilkan identitas dari sesi | Nama dan peran sesuai user yang login; tombol "Unggah" hanya muncul untuk peran yang boleh mengunggah |

### 5.2 Manajemen Naskah (`FR-NASKAH`)

| ID | Kebutuhan | Kriteria penerimaan |
|---|---|---|
| FR-NASKAH-01 | Pengunggah mengisi metadata | Wajib: judul (≥5 karakter), abstrak (≥20), ≥1 kata kunci, tahun, tipe karya, ≥1 penulis, ≥1 SDG, 1 topik roadmap, PDF. Fakultas diambil dari profil pengunggah |
| FR-NASKAH-02 | Validasi berkas | Hanya PDF, maks. 20 MB; pelanggaran ditolak di server dengan pesan jelas |
| FR-NASKAH-03 | Field khusus PkM | Tipe `PKM`: `region` wajib; `partner` opsional; ≥1 bidang fokus PkM |
| FR-NASKAH-04 | Klasifikasi roadmap | Memilih 1 topik roadmap (tahun + kode) dan tema sesuai tipe karya (lihat 6.2). Untuk `RESEARCH`: tema penelitian + spesialisasi; untuk `PKM`: bidang fokus PkM |
| FR-NASKAH-05 | PkM sebagai tindak lanjut riset | PkM dapat menautkan ke satu karya riset `PUBLISHED`; halaman riset menampilkan PkM turunannya |
| FR-NASKAH-06 | Berkas tersimpan lewat abstraksi storage | Tidak ada path file lokal di kode production (lihat 8) |
| FR-NASKAH-07 | Pengunggah melihat daftar dan status karyanya | Halaman `/dosen/artikel` tersedia, dapat difilter per status |
| FR-NASKAH-08 | **Klasifikasi SDG** | Pengunggah memilih 1 atau lebih dari 17 SDG; admin dapat mengoreksi saat verifikasi `[ASUMSI]`; karya tanpa SDG tidak dapat dikirim |
| FR-NASKAH-09 | **Daftar penulis berurut** | Tiap penulis punya nama, tipe (`DOSEN`/`MAHASISWA`/`EKSTERNAL`), dan afiliasi (fakultas/prodi bila internal); urutan tampil sesuai input; penulis korespondensi dapat ditandai; pengunggah dosen otomatis dimasukkan bila ia penulis |
| FR-NASKAH-10 | Cover | Cover otomatis dari tema bidang keilmuan (lihat 9); dosen dapat mengunggah cover sendiri |

### 5.3 Verifikasi dan Revisi (`FR-VERIF`)

| ID | Kebutuhan | Kriteria penerimaan |
|---|---|---|
| FR-VERIF-01 | Karya baru berstatus `PENDING` | Muncul di antrean admin urut terlama dulu |
| FR-VERIF-02 | Admin menyetujui | Status `PUBLISHED`, `publishedAt` terisi, karya tampil publik |
| FR-VERIF-03 | Admin menolak dengan catatan wajib | Status `REJECTED`, catatan tersimpan dan terlihat oleh pengunggah; tidak tampil publik |
| FR-VERIF-04 | Pengunggah merevisi karya `REJECTED` dan mengirim ulang `[ASUMSI]` | Metadata dan berkas dapat diubah; status kembali `PENDING`; riwayat catatan tidak hilang |
| FR-VERIF-05 | Notifikasi hasil verifikasi | Fase 1: status dan catatan terlihat di dashboard. Email `[PERLU KONFIRMASI]` |

### 5.4 Halaman Publik (`FR-PUB`)

| ID | Kebutuhan | Kriteria penerimaan |
|---|---|---|
| FR-PUB-01 | Homepage: hero unggulan, baris "Terbaru" dan "Paling banyak diunduh", search bar, filter | Data dari database, bukan dummy; hanya `PUBLISHED` |
| FR-PUB-02 | Pencarian teks | Cocok sebagian, tidak peka huruf besar/kecil, pada judul, nama penulis, dan kata kunci |
| FR-PUB-03 | Filter | Fakultas, tahun, kategori, tipe (`RESEARCH`/`PKM`), **SDG**, dan **topik roadmap**; dapat dikombinasikan; hasil terpaginasi |
| FR-PUB-04 | **Halaman detail** | Menampilkan seluruh data pada tabel 5.4.1 di bawah |
| FR-PUB-05 | Unduh PDF | Klik mengunduh berkas dan menambah `downloadCount` sebanyak 1 (berlaku bila full-text disediakan, lihat 11.10) |
| FR-PUB-06 | Karya `PENDING`/`REJECTED` tidak bocor | Akses langsung lewat halaman maupun API publik menghasilkan 404 |

#### 5.4.1 Isi halaman detail (`FR-PUB-04`)

| Kelompok | Data yang ditampilkan |
|---|---|
| Inti | Cover, judul, penulis (berurut, tampil sebagai chip; penulis internal diberi penanda dan menaut ke profil MAESTRO, penulis eksternal berupa teks biasa), abstrak |
| Klasifikasi | **SDG** (ikon dan nama tiap tujuan), **topik roadmap** (tahun + kode + judul topik, beserta spesialisasi/tema atau bidang fokus PkM), kategori, kata kunci |
| Detail lainnya | Tipe karya (Penelitian/PkM), tahun, fakultas/prodi, tanggal terbit, jumlah unduhan |
| Khusus PkM | Region (Lokal/Regional/Nasional/Internasional), mitra/desa binaan, tautan ke riset sumber |
| Khusus Riset | Daftar PkM turunan (bila ada) |
| Tautan eksternal | Google Scholar, Scopus, DOI (lihat 5.8) |
| Lanjutan | Karya serupa (dipilih dari kesamaan topik roadmap, SDG, dan kata kunci); tombol Bagikan (salin tautan) |

### 5.5 Statistik (`FR-STAT`)

| ID | Kebutuhan | Kriteria penerimaan |
|---|---|---|
| FR-STAT-01 | Pengunggah melihat total karya, per status, total unduhan | Angka sesuai data milik pengunggah |
| FR-STAT-02 | Admin melihat jumlah antrean dan total karya terbit | Angka sesuai basis data |

### 5.6 Roadmap Penelitian dan PkM (`FR-ROAD`)

| ID | Kebutuhan | Kriteria penerimaan |
|---|---|---|
| FR-ROAD-01 | Taksonomi roadmap tersedia lewat seed | Setelah seed: 72 topik, 10 tema, 4 spesialisasi, 6 bidang fokus PkM, 5 tahun |
| FR-ROAD-02 | Publik menjelajah karya per spesialisasi/tema/tahun | Halaman atau filter menampilkan karya `PUBLISHED` per kelompok roadmap |
| FR-ROAD-03 | Topik roadmap tidak dapat diubah pengunggah | Perubahan hanya lewat seed/admin `[PERLU KONFIRMASI: 11.8]` |
| FR-ROAD-04 | Rekap untuk laporan | Admin melihat dan mengekspor (CSV) jumlah karya per tahun × topik × fakultas × tipe × SDG |

### 5.7 Administrasi (`FR-ADM`)

| ID | Kebutuhan | Kriteria penerimaan |
|---|---|---|
| FR-ADM-01 | CRUD fakultas dan kategori | Dapat menambah dan mengubah; tidak dapat menghapus yang masih dipakai karya |
| FR-ADM-02 | Kelola akun | Lihat `FR-AUTH-02` |
| FR-ADM-03 | Data SDG | 17 SDG tersedia lewat seed (nomor, nama, ikon); tidak dapat diubah pengunggah |
| FR-ADM-04 | Kelola profil dosen MAESTRO | Admin dapat menambah, mengubah, mengimpor (CSV), menampilkan/menyembunyikan profil, dan menautkan profil ke akun dosen (`FR-MAE-10`) |

### 5.8 Tautan Google Scholar dan Scopus (`FR-EXT`)

Kedua layanan itu bukan sistem yang bisa "didorong data" dari LENTERA. Google Scholar tidak menyediakan API resmi dan menemukan halaman lewat crawling. Scopus hanya memuat karya dari sumber terpilih (jurnal/prosiding terindeks) dan API-nya memerlukan kunci dan izin dari Elsevier. Karena itu fase 1 memakai **tautan dan metadata**, bukan sinkronisasi `[ASUMSI]`.

| ID | Kebutuhan | Kriteria penerimaan |
|---|---|---|
| FR-EXT-01 | Tautan Scopus per karya (opsional) | Pengunggah dapat mengisi URL karya di Scopus; bila terisi, tombol "Lihat di Scopus" tampil di detail; URL divalidasi |
| FR-EXT-02 | Tautan Google Scholar per karya | Tombol "Cari di Google Scholar" selalu tampil, dibentuk otomatis dari judul; URL manual dapat mengganti bila ada |
| FR-EXT-03 | DOI per karya (opsional) | Bila terisi, ditampilkan sebagai tautan `doi.org` dan dipakai di metadata SEO |
| FR-EXT-04 | Tautan profil penulis | Penulis internal dapat menyimpan Scopus Author ID, Google Scholar ID, dan ORCID; nama penulis di halaman detail menaut ke profil bila ada |
| FR-EXT-05 | Metadata untuk crawler Scholar | Halaman detail memuat meta tag `citation_title`, `citation_author` (satu per penulis), `citation_publication_date`, `citation_pdf_url` (bila PDF publik), dan `citation_doi` bila ada |
| FR-EXT-06 | Karya tanpa tautan tetap valid | Tautan Scopus/DOI kosong tidak menghalangi verifikasi atau publikasi |

### 5.9 MAESTRO — Direktori Dosen/Peneliti (`FR-MAE`)

MAESTRO adalah menu tambahan LENTERA berisi profil dosen/peneliti Universitas Widyatama. Statistiknya dihitung dari karya terbit, sehingga baru bermakna setelah data penulis, SDG, dan roadmap terisi (lihat milestone M2 dan M4).

| ID | Kebutuhan | Kriteria penerimaan |
|---|---|---|
| FR-MAE-01 | Menu MAESTRO | Navigasi utama memuat Beranda, Penelitian, PkM (keduanya mengarah ke pencarian dengan filter tipe), dan MAESTRO (`/maestro`), tampil di kedua homepage dan halaman publik lain `[ASUMSI: mengikuti pola ITB Scholar]` |
| FR-MAE-02 | Daftar dosen | Kartu berisi foto, nama dengan gelar, fakultas, serta jumlah penelitian dan PkM; pencarian nama; filter fakultas (dan prodi bila 11.7 disetujui), SDG, dan tipe karya; urut default abjad dengan opsi urut jumlah karya; terpaginasi |
| FR-MAE-03 | Halaman detail dosen `/maestro/[slug]` | Menampilkan seluruh data pada tabel 5.9.1 |
| FR-MAE-04 | Statistik jumlah karya | Dihitung dari karya `PUBLISHED` tempat dosen tercatat sebagai penulis (posisi mana pun), dipisah `RESEARCH` dan `PKM`; karya `PENDING`/`REJECTED` tidak dihitung; angka di daftar dan di detail selalu sama |
| FR-MAE-05 | SDG yang ditekuni | Daftar SDG unik dari karya terbitnya, masing-masing dengan jumlah karya, urut dari terbanyak; SDG dengan 0 karya tidak ditampilkan. Satu karya dapat memiliki beberapa SDG, sehingga jumlah antar-SDG tidak dijumlahkan menjadi total karya |
| FR-MAE-06 | Persentase topik roadmap | Dua tampilan terpisah: Penelitian dan PkM. Persentase = jumlah karya pada suatu topik ÷ jumlah karya tipe itu milik dosen. Karena tiap karya memiliki tepat 1 topik roadmap (`FR-NASKAH-04`), total tiap tampilan 100%. Ditampilkan sebagai persentase **dan** jumlah karya dalam bentuk teks, tidak hanya warna. Granularitas mengikuti 11.17 |
| FR-MAE-07 | Daftar karya dosen | Di bawah statistik, daftar karya terbitnya dengan kartu yang sama seperti halaman lain, dapat difilter per tipe, menaut ke halaman detail karya |
| FR-MAE-08 | Tautan ilmiah dosen | Tautan Scopus, Google Scholar, dan ORCID dari `scopusAuthorId`/`scholarId`/`orcid` bila terisi (`FR-EXT-04`) |
| FR-MAE-09 | Keadaan kosong | Dosen tanpa karya terbit tetap tampil dengan angka 0 dan pesan yang jelas; bagian SDG dan grafik disembunyikan; bila foto kosong dipakai avatar inisial |
| FR-MAE-10 | Pengelolaan profil | Admin menambah, mengubah, dan mengimpor (CSV) profil serta mengatur tampil/sembunyi; dosen yang login dapat mengubah foto dan bio profilnya sendiri `[ASUMSI]`; foto JPG/PNG maks. 2 MB, disimpan lewat abstraksi storage |
| FR-MAE-11 | Kaitan dengan halaman karya | Nama penulis dosen di halaman detail karya menaut ke profil MAESTRO bila profilnya publik |
| FR-MAE-12 | Privasi | Halaman publik hanya menampilkan data pada tabel 5.9.1. Profil dengan `isPublic = false` menghasilkan 404 dan tidak muncul di daftar maupun pencarian, sementara karyanya tetap tampil dengan nama penulis tanpa tautan |
| FR-MAE-13 | Tren per tahun | Kartu angka penelitian dan PkM menampilkan grafik mini jumlah karya per tahun; bila data kurang dari 2 tahun, grafik disembunyikan `[ASUMSI: opsional, terinspirasi ITB Scholar]` |

#### 5.9.1 Isi halaman detail dosen (`FR-MAE-03`)

| Kelompok | Data yang ditampilkan |
|---|---|
| Foto | Foto dosen; avatar inisial bila kosong |
| Identitas | Nama, gelar depan dan belakang, jabatan fungsional, fakultas (dan prodi bila ada) |
| Statistik | Jumlah penelitian, jumlah PkM, total karya, dengan grafik mini per tahun |
| SDG | Ikon, nama, dan jumlah karya per SDG yang pernah diambil |
| Roadmap | Persentase topik penelitian dan persentase topik PkM berdasarkan roadmap |
| Tautan | Scopus, Google Scholar, ORCID |
| Karya | Daftar penelitian dan PkM terbit |
| Opsional | Bio singkat |

> **Catatan angka:** statistik MAESTRO mencerminkan karya yang **tercatat di LENTERA**, bukan seluruh rekam jejak dosen. Karya lama yang belum diunggah tidak terhitung. Halaman menampilkan keterangan "Berdasarkan karya yang tercatat di LENTERA" agar angka tidak disalahartikan sebagai produktivitas total.

## 6. Model Data

### 6.1 Entitas inti
`User` (role, terhubung ke `Faculty`), `Article`, `Faculty`, `Category` (many-to-many ke `Article`).

### 6.2 Entitas roadmap
`ResearchStream` (4 spesialisasi), `ResearchTheme` (10 tema), `PkmFocusArea` (6 bidang fokus), `RoadmapYear` (topik besar PkM per tahun), `RoadmapTopic` (72 topik; kode "2024-A" hanya unik bersama `slug`). Aturan: `RESEARCH` mengisi tema dan topik bersama spesialisasi; `PKM` mengisi bidang fokus PkM dan topik PkM.

### 6.3 Entitas baru yang dibutuhkan `[ASUMSI]`

| Entitas / field | Isi | Alasan |
|---|---|---|
| `Sdg` | nomor (1–17), nama, slug; relasi many-to-many ke `Article` | Poin SDG; belum ada di skema |
| `Author` | nama, tipe (`DOSEN`/`MAHASISWA`/`EKSTERNAL`), fakultas/prodi opsional, `scopusAuthorId`, `scholarId`, `orcid`, relasi opsional ke `User` | Karya mahasiswa dan multi-penulis; penulis tidak harus punya akun |
| `ArticleAuthor` | artikel, penulis, urutan, penanda korespondensi | Urutan penulis |
| `Article.uploaderId` | pengganti `authorId` yang sekarang menunjuk `User` | Pembeda antara pengunggah dan penulis |
| `Article.doi`, `scopusUrl`, `scholarUrl` | teks opsional | Tautan eksternal |
| `Role.MAHASISWA` | hanya bila keputusan 11.9 memberi mahasiswa akun | Belum ada di enum |
| `Author` (perluasan untuk MAESTRO) | `slug` unik, `photoUrl`, `titlePrefix` dan `titleSuffix` (gelar depan/belakang), `academicRank` (jabatan fungsional, mis. Guru Besar, Lektor), `bio` opsional, `isPublic`, `nidn` (tidak ditampilkan), fakultas/prodi | Profil MAESTRO; penulis bertipe `DOSEN` menjadi profil publik. Saat ini gelar masih menyatu di `User.name` (mis. "Dr. Andi Wijaya") sehingga tidak bisa dipisah |
| Statistik MAESTRO | **Tidak disimpan**; dihitung dari `ArticleAuthor` + `Article` berstatus `PUBLISHED` (jumlah per tipe, jumlah per SDG, sebaran per topik roadmap) lewat `authorRepository`/`statsService` | Selalu sinkron dengan data terbit; skala ±1000 karya tidak butuh cache |

### 6.4 Peran tiap taksonomi

| Taksonomi | Peran |
|---|---|
| `Category` | Bidang keilmuan untuk penjelajahan publik dan tema cover |
| `Sdg` | Kontribusi karya terhadap tujuan pembangunan berkelanjutan |
| `ResearchTheme` / `PkmFocusArea` | Pemetaan ke Renstra untuk pelaporan |
| `RoadmapTopic` | Penautan ke topik roadmap tahunan |

## 7. Kebutuhan Non-Fungsional

| ID | Kebutuhan | Kriteria |
|---|---|---|
| NFR-SEC-01 | Kata sandi | Disimpan dengan bcrypt; kata sandi contoh seed tidak boleh ada di production |
| NFR-SEC-02 | Rahasia dan konfigurasi | Tidak ada kredensial di kode; seluruhnya lewat environment variable |
| NFR-SEC-03 | Validasi input | Semua input API divalidasi server-side (zod); tipe dan ukuran berkas diperiksa di server |
| NFR-SEC-04 | Akses berkas | Berkas karya non-`PUBLISHED` tidak dapat diakses lewat URL langsung |
| NFR-PRIV-01 | Data pribadi dosen | Yang tampil publik hanya foto, nama, gelar, fakultas/prodi, dan tautan profil ilmiah; NIDN, email, dan telepon tidak tampil kecuali disetujui dosen; kesesuaian dengan UU Pelindungan Data Pribadi dikonfirmasi dengan bagian hukum/IT kampus `[PERLU KONFIRMASI]` |
| NFR-SEO-01 | Indeks mesin pencari dan Scholar | Halaman detail dirender di server dengan meta tag standar dan meta tag `citation_*` (`FR-EXT-05`); tidak ada jaminan waktu masuk indeks Scholar |
| NFR-INT-01 | Ketahanan tautan eksternal | Fase 1 tidak bergantung pada API pihak ketiga; tautan eksternal tidak boleh membuat halaman gagal dimuat |
| NFR-PERF-01 | Performa | Halaman publik ≤ 2,5 detik LCP pada koneksi 4G untuk ±1000 artikel |
| NFR-A11Y-01 | Aksesibilitas | Kontras teks memenuhi WCAG AA, elemen interaktif dapat dijangkau keyboard, setiap tombol yang tampil berfungsi atau disembunyikan |
| NFR-DATA-01 | Cadangan | Basis data dan berkas dicadangkan berkala `[PERLU KONFIRMASI: kebijakan kampus]` |
| NFR-MNT-01 | Arsitektur | Berlapis: route handler → service → repository → storage; Strategy untuk storage dan cover |

## 8. Tech Stack dan Deployment

| Bagian | Pilihan |
|---|---|
| Frontend + backend | Next.js (App Router), TypeScript, Tailwind CSS |
| Database + ORM | PostgreSQL + Prisma |
| Auth | NextAuth.js (Auth.js), Credentials + JWT |
| Storage | `LocalStorage` (dev) dan `CloudStorage` (Vercel Blob/Cloudflare R2) lewat interface `FileStorage` |
| Cover | `CoverGenerator` dengan `TemplateCoverStrategy` (default) dan `ManualCoverStrategy` (upload) |

Skala data ±1000 record; aman di free tier layanan cloud.

**Deployment:** database ke cloud → deploy ke Vercel dari GitHub → set environment variable → `prisma migrate deploy` → seed roadmap dan SDG → setup storage produksi → domain kampus (opsional).
**Keputusan terbuka:** hosting Vercel vs server internal kampus (11.5).

## 9. Konsep Desain UI

Identitas: **LENTERA** dengan sub-judul "Layanan Eksplorasi Penelitian, Teknologi & Pengabdian", logo lentera, dan penanda Biro P2M.

Prinsip: terinspirasi pola interaksi Netflix (hero, baris horizontal, kartu bercover), tetap kredibel dan informatif. Search bar selalu menjadi elemen utama.

Dua varian homepage saat ini di kode:

| Varian | Rute | Ciri |
|---|---|---|
| Formal-akademik | `/` | Latar kertas hangat, aksen brass, tipografi serif |
| LENTERA gelap | `/homepage-netflix` | Latar gelap, aksen merah, hero gambar, Top 10, hover card |

`[PERLU KONFIRMASI 11.1]` Varian utama. Sampai diputuskan, keduanya dipertahankan dan **fungsinya harus sama** (`FR-PUB-01..06`).

**Cover:** gambar pixel art per bidang keilmuan, dipilih deterministik dari hash judul, dengan ikon dan judul di atasnya; dosen dapat mengunggah cover sendiri.

**SDG di UI:** tampil sebagai deretan ikon/lencana kecil di kartu dan halaman detail, dengan nama tujuan saat di-hover. Periksa pedoman penggunaan logo dan ikon SDG dari PBB sebelum dipakai `[PERLU KONFIRMASI]`.

**MAESTRO di UI:** menu muncul di navigasi kedua homepage. Halaman daftar memakai kartu dosen (foto potret, nama dengan gelar, fakultas, dua angka: penelitian dan PkM). Halaman detail berisi header profil, dua kartu angka, deretan SDG dengan jumlah, dan dua grafik batang horizontal untuk persentase topik roadmap (Penelitian dan PkM). Nilai persentase dan jumlah selalu ditulis sebagai teks di samping batang, tidak hanya warna. Bahasa visualnya mengikuti varian homepage yang dipilih (11.1).

**Referensi utama:** ITB Scholar (scholar.itb.ac.id) untuk halaman detail karya dan profil peneliti, lihat 13.1. **Referensi pembanding:** Google Scholar, ResearchGate, Semantic Scholar.

## 10. Rencana Fase dan Milestone

| Fase | Isi | Selesai bila |
|---|---|---|
| **M1 — Fondasi aman** | `FR-AUTH-01..04`, storage lokal, migrasi + seed (roadmap dan SDG) berjalan, rename LENTERA | Dosen tidak bisa mengakses area admin; login memakai data seed |
| **M2 — Alur inti** | `FR-NASKAH-01..10`, `FR-VERIF-01..04` | Karya dengan penulis, SDG, dan topik roadmap diunggah, diverifikasi, dan tayang end-to-end tanpa dummy |
| **M3 — Publik dan tautan** | `FR-PUB-01..06`, `FR-EXT-01..06`, `FR-STAT` | Detail memuat seluruh tabel 5.4.1; tautan Scholar/Scopus dan meta tag berfungsi |
| **M4 — MAESTRO** | `FR-MAE-01..12`, `FR-ADM-04`; bergantung pada M1 (storage foto) dan M2 (penulis, SDG, roadmap terisi) | Profil dosen tampil dengan foto, gelar, statistik, SDG, dan persentase roadmap yang sesuai data terbit |
| **M5 — Roadmap dan laporan** | `FR-ROAD-02..04`, `FR-ADM-01..03` | Rekap CSV untuk laporan Biro P2M |
| **M6 — Produksi** | Storage cloud, deployment, cadangan | Situs berjalan di domain final |

## 11. Keputusan Terbuka

| # | Pertanyaan | Rekomendasi |
|---|---|---|
| 11.1 | Homepage utama: formal atau LENTERA gelap? | Pilih satu sebagai `/`, arsipkan yang lain |
| 11.2 | Setelah `REJECTED`, revisi atau unggah baru? | Revisi + kirim ulang (`FR-VERIF-04`) |
| 11.5 | Hosting Vercel vs server kampus | Cek kebijakan PUSKOM/IT Widyatama |
| 11.6 | Notifikasi email hasil verifikasi | Tunda ke fase lanjutan |
| 11.7 | Prodi | Karena mahasiswa punya prodi, tambahkan entitas `Prodi` di bawah `Faculty` bila filter per prodi dibutuhkan |
| 11.8 | Siapa yang mengelola taksonomi roadmap | Seed dulu, UI admin bila sering berubah |
| **11.9** | Apakah mahasiswa punya akun dan mengunggah sendiri? | Fase 1: mahasiswa **tidak** punya akun; dicantumkan sebagai penulis oleh dosen pembimbing. Alasan: menghindari kelola akun ribuan mahasiswa dan menjaga verifikasi tetap di dosen. Alternatif: login SSO kampus bila tersedia |
| **11.10** | Apakah PDF penuh boleh ditampilkan/diunduh? | Karya yang terbit di jurnal Scopus sering terikat hak cipta penerbit. Sediakan mode per karya: "PDF penuh" atau "hanya tautan ke penerbit/Scopus". Perlu kebijakan dari Biro P2M |
| **11.11** | Siapa yang menentukan SDG | Pengunggah memilih, admin memvalidasi saat verifikasi |
| **11.12** | Arti "terhubung dengan Google Scholar dan Scopus" | Diasumsikan tautan dan metadata (5.8). Sinkronisasi sitasi menjadi fase lanjutan. Opsi termurah: OpenAlex, data terbuka (CC0) yang sejak Februari 2026 API-nya mewajibkan kunci gratis dengan jatah pemakaian harian; pencarian satu karya lewat DOI tidak dibatasi, cukup untuk ±1000 karya yang punya DOI. Scopus API memerlukan kunci dan izin Elsevier. Syarat kedua layanan perlu dicek ulang saat implementasi |
| **11.13** | Apakah `Category` masih diperlukan berdampingan dengan SDG, tema, dan fakultas | Pertahankan untuk filter dan tema cover; tinjau ulang bila membingungkan pengguna |
| **11.14** | Kepanjangan "MAESTRO" | Belum ada; ditulis "MAESTRO" saja. Tambahkan bila ada kepanjangan resmi |
| **11.15** | Sumber data profil dosen (nama, gelar, fakultas, foto) | Admin mengimpor CSV dari data SDM/kepegawaian kampus; dosen melengkapi foto dan bio setelah login. Perlu dipastikan sumber data resminya |
| **11.16** | Apakah MAESTRO mencakup peneliti non-dosen (staf riset, tenaga kependidikan) | Fase 1 hanya dosen; tipe internal lain menyusul bila dibutuhkan |
| **11.17** | Granularitas persentase roadmap | Roadmap punya 50 topik riset dan 22 topik PkM. Riset: tampilkan per spesialisasi (4) dengan rincian per topik saat dibuka. PkM: langsung per topik (22) |
| **11.18** | Privasi dan persetujuan tampil | Profil tampil hanya bila `isPublic`; admin dan dosen dapat menyembunyikan. Konfirmasi ke bagian hukum/IT sesuai `NFR-PRIV-01` |
| **11.19** | Urutan berdasarkan jumlah karya | Boleh sebagai opsi urutan; papan peringkat resmi di luar fase 1 |
| **11.20** | Metrik seperti H-index, jumlah sitasi, dan kuartil jurnal (ditampilkan ITB Scholar) | Tidak di fase 1; butuh sumber data (OpenAlex/Scopus) dan kebijakan kampus soal menampilkannya di profil dosen |
| **11.21** | Unit riset/pusat studi (ITB Scholar memisahkan "Research Units" dan menampilkannya di profil) | Tanyakan apakah Widyatama punya pusat studi atau kelompok riset yang perlu tampil; bila ada, jadikan fase lanjutan |

## 12. Status Implementasi Terhadap PRD (per 28 September 2026)

| Area | Status |
|---|---|
| Skema DB, migrasi, seed | Ada, **belum ada SDG, penulis majemuk, dan field tautan eksternal**; enum `Role` hanya `ADMIN`/`DOSEN` |
| Login, session dengan role | Ada |
| Otorisasi per peran (`FR-AUTH-03`) | **Belum**, hanya cek login |
| `GET /api/articles` | Ada; pencarian kata kunci masih persis |
| `POST /api/articles`, upload, cover otomatis | **Belum berfungsi** (storage dan cover melempar error) |
| Halaman publik dan dashboard | UI ada, **masih memakai data dummy** |
| SDG, daftar penulis, tautan Scholar/Scopus, meta tag `citation_*` | **Belum ada** di skema, form, maupun UI |
| MAESTRO (`/maestro`, profil dosen, statistik) | **Belum ada**: tidak ada rute, model profil, maupun query statistik. Data dosen hanya `User` (nama dengan gelar menyatu, email, fakultas), tanpa foto |
| Nama LENTERA | Sebagian: header Netflix sudah "LENTERA"; header formal, halaman login, footer, metadata `layout.tsx`, dan `package.json` masih "Repositori Karya Ilmiah"/`repo-jurnal-dosen`; footer masih "Universitas" generik |
| `/dosen/artikel`, kelola akun, rekap CSV | Belum ada |

## 13. Referensi

### 13.1 Referensi utama antarmuka: ITB Scholar

- Tautan: https://scholar.itb.ac.id/ — indeks penemuan riset Institut Teknologi Bandung yang memuat profil peneliti, publikasi, paten, proyek, tesis, program pengabdian, dan unit riset (sesuai deskripsi situsnya).
- Tangkapan layar diambil pada 28 September 2026 untuk keperluan perancangan internal.

![Halaman detail publikasi ITB Scholar](referensi/itb-scholar-detail-publikasi.png)
*Detail publikasi: judul, jurnal, tautan DOI dan Scopus, abstrak, penulis, SDG, topik, kuartil dan sitasi, metrik, serta publikasi serupa.*

![Halaman profil peneliti ITB Scholar](referensi/itb-scholar-profil-peneliti.png)
*Profil peneliti: foto, jabatan, tautan ORCID/Scopus/OpenAlex, afiliasi, kartu statistik dengan grafik mini per tahun, SDG, topik, jaringan kolaborasi, dan peneliti serupa.*

> **Catatan penggunaan:** dipakai hanya sebagai rujukan tata letak dan fitur. Jangan menyalin merek, teks, ikon, atau data milik ITB. Tangkapan layar memuat nama dan foto orang lain; bila repositori kode ini publik, pertimbangkan tidak meng-commit gambar dan cukup menautkan ke halaman aslinya.

**Hasil pengamatan dan keputusan untuk LENTERA:**

| Yang terlihat di ITB Scholar | Keputusan untuk LENTERA |
|---|---|
| Detail: judul, nama jurnal, tautan DOI, tombol Scopus | Diadopsi (`FR-EXT-01`, `FR-EXT-03`) |
| Detail: abstrak | Diadopsi |
| Detail: penulis sebagai chip, penulis internal disorot dan menaut ke profil | Diadopsi (`FR-PUB-04`, `FR-MAE-11`) |
| Detail dan profil: "SDG Alignment" berupa ikon SDG | Diadopsi (`FR-NASKAH-08`, `FR-MAE-05`) |
| Detail: "Topics" dengan indikator lingkaran; tampak seperti klasifikasi topik otomatis | Bentuk daftar topik diadopsi, tetapi topik LENTERA dipilih manual dari roadmap Renstra dan tanpa skor (`FR-NASKAH-04`) |
| Detail: chip tahun, tipe (journal), kuartil (Q1), jumlah sitasi | Tahun dan tipe diadopsi; kuartil dan sitasi ditunda (11.12, 11.20) |
| Detail: Altmetric, Dimensions, PlumX, scite | Tidak di fase 1 (11.20) |
| Detail: "Similar Publications" dengan persentase kemiripan | Diadopsi sebagai "Karya serupa" tanpa persentase (`FR-PUB-04`) |
| Profil: foto, nama, jabatan (mis. Professor/Guru Besar) | Diadopsi, ditambah field `academicRank` (5.9.1) |
| Profil: tautan ORCID, Scopus, OpenAlex | ORCID, Scopus, dan Google Scholar diadopsi; OpenAlex tidak (`FR-MAE-08`) |
| Profil: afiliasi fakultas dan pusat penelitian | Fakultas diadopsi; pusat penelitian ditanyakan di 11.21 |
| Profil: H-Index | Ditunda (11.20) |
| Profil: kartu statistik Publications, Projects, IP, Outreach, Theses, dengan grafik mini per tahun | Hanya Penelitian dan PkM, ditambah grafik mini (`FR-MAE-13`); paten (IP) dan tugas akhir di luar lingkup |
| Profil: SDG yang ditampilkan hanya yang relevan bagi peneliti itu | Diadopsi (`FR-MAE-05`) |
| Profil: daftar topik dengan "Show N more" | Diadopsi sebagai persentase topik roadmap dengan rincian dibuka bertahap (`FR-MAE-06`, 11.17) |
| Profil: Collaboration Network dan Similar Researchers | Fase lanjutan (bagian 4) |
| Profil: tombol Send Message | Tidak diadopsi, demi privasi (`NFR-PRIV-01`) |
| Profil dan detail: tombol Share | Diadopsi sebagai tombol Bagikan (salin tautan) |
| Profil peneliti tanpa foto memakai ikon generik | Diadopsi sebagai avatar inisial (`FR-MAE-09`) |
| Navigasi: Home, Researchers, Research Units, Publications, Projects, IP, Outreach, Theses | Disederhanakan menjadi Beranda, Penelitian, PkM, MAESTRO (`FR-MAE-01`) |

### 13.2 Referensi repositori sejenis

- Repository Universitas Indonesia — http://repository.ui.ac.id/
- Portal Karya Ilmiah UII — https://library.uii.ac.id/e-resources/
- Repository Universitas Surabaya — http://elib.ubaya.ac.id/lib/f-a-q/f-a-q-repository/
- Perangkat lunak sejenis: DSpace, Open Journal Systems (OJS)

## 14. Riwayat Perubahan

| Versi | Perubahan |
|---|---|
| 2.3 | Tambah ITB Scholar sebagai referensi utama antarmuka (13.1, dengan tautan, dua tangkapan layar, dan tabel keputusan adopsi); tambah `orcid` dan `academicRank` pada `Author`; navigasi Beranda/Penelitian/PkM/MAESTRO; grafik mini per tahun di profil (`FR-MAE-13`); karya serupa dan tombol Bagikan; metrik, jaringan kolaborasi, dan dosen serupa dicatat sebagai fase lanjutan; catatan OpenAlex pada 11.12; keputusan terbuka 11.20–11.21 |
| 2.2 | Tambah menu MAESTRO: direktori dan profil dosen/peneliti dengan foto, gelar, fakultas, statistik penelitian dan PkM, SDG, dan persentase topik roadmap (5.9); perluasan entitas `Author`; kebutuhan privasi `NFR-PRIV-01`; milestone M4 khusus MAESTRO; keputusan terbuka 11.14–11.19 |
| 2.1 | Ganti nama menjadi LENTERA (Layanan Eksplorasi Penelitian, Teknologi & Pengabdian) untuk Universitas Widyatama; fokus pada etalase hasil penelitian dan PkM dosen dan mahasiswa; tambah SDG, penulis majemuk (dosen/mahasiswa/eksternal), rincian isi halaman detail, dan tautan Google Scholar/Scopus (fase 1, berupa tautan dan metadata); tambah keputusan terbuka 11.9–11.13 |
| 2.0 | Tambah roadmap Renstra dan tipe RESEARCH/PKM; ID kebutuhan dan kriteria penerimaan; kebutuhan non-fungsional, milestone, status implementasi |
| 1.0 | Versi awal |