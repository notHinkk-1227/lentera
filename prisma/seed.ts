// Seed data awal — dibuat semirip mungkin dengan lib/dummy-data.ts supaya begitu
// halaman diganti dari dummy ke data asli, tampilannya tidak berubah drastis.
//
// Isi seed:
//   - taksonomi roadmap (72 topik, via seed-roadmap.ts)
//   - fakultas, kategori, 1 admin, 5 dosen
//   - 15 karya contoh: RESEARCH dan PKM, campuran status (10 PUBLISHED, 4 PENDING,
//     1 REJECTED), ditautkan ke topik roadmap, tema riset, bidang fokus PkM,
//     region dan mitra (PkM), serta riset sumber ("riset -> PkM")
//
// Aman dijalankan berulang: data yang sudah ada tidak diduplikasi, dan tautan
// taksonomi karya yang sudah ada diperbarui.
//
// Jalankan: npx prisma db seed   (otomatis juga setelah `npx prisma migrate reset`)
//
// PERINGATAN: password "password123" HANYA untuk development lokal.
// Jangan pernah dipakai di staging atau production.

import { PrismaClient, Role, ArticleStatus, WorkType, Region, AuthorType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { seedRoadmap } from "./seed-roadmap";
import { SDGS } from "../lib/sdg";

const prisma = new PrismaClient();

const DEV_PASSWORD = "password123";

// PDF contoh satu halaman, ditulis ke folder unggahan lokal (sama dengan LocalStorage di
// lib/storage) agar tombol "Unduh PDF" bisa dicoba tanpa berkas asli.
const SEED_PDF_KEY = "seed/placeholder.pdf";
const SEED_PDF_URL = `local:${SEED_PDF_KEY}`;

function writeSeedPdf() {
  const stream = "BT /F1 14 Tf 20 70 Td (Berkas contoh LENTERA) Tj ET";
  const pdf =
    "%PDF-1.4\n" +
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n" +
    `4 0 obj<</Length ${stream.length}>>stream\n${stream}\nendstream endobj\n` +
    "5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n" +
    "trailer<</Root 1 0 R>>\n%%EOF\n";
  const root = path.resolve(process.env.UPLOAD_DIR ?? path.join(process.cwd(), ".uploads"));
  const full = path.join(root, SEED_PDF_KEY);
  mkdirSync(path.dirname(full), { recursive: true });
  writeFileSync(full, pdf, "latin1");
}

interface ArticleSeed {
  title: string;
  abstract: string;
  keywords: string[];
  year: number;
  status: ArticleStatus;
  rejectedNote?: string;
  author: string; // nama dosen pengunggah (harus ada di dosenSeed); otomatis jadi penulis pertama
  coAuthors?: { name: string; type: AuthorType; affiliation?: string }[]; // penulis tambahan, berurutan
  sdgs?: number[]; // nomor SDG (1–17)
  faculty: string;
  categories: string[];
  downloadCount: number;
  type: WorkType;
  roadmapTopic?: string; // slug RoadmapTopic
  themes?: string[]; // slug ResearchTheme (RESEARCH)
  pkmFocusAreas?: string[]; // slug PkmFocusArea (PKM)
  region?: Region; // hanya PKM
  partner?: string; // hanya PKM
  sourceResearchTitle?: string; // judul riset sumber (hanya PKM)
}

const articlesSeed: ArticleSeed[] = [
  // ===== RISET — terbit =====
  {
    title: "Dampak Digitalisasi terhadap Produktivitas UMKM di Jawa Barat",
    sdgs: [8, 9],
    coAuthors: [{ name: "Rizky Pratama", type: AuthorType.MAHASISWA, affiliation: "Manajemen" }, { name: "Dewi Anggraeni", type: AuthorType.MAHASISWA, affiliation: "Manajemen" }],
    abstract:
      "Studi ini mengkaji korelasi antara adopsi platform digital dan pertumbuhan omzet pelaku UMKM, dengan sampel 240 responden di lima kabupaten.",
    keywords: ["digitalisasi", "UMKM", "produktivitas", "ekonomi digital"],
    year: 2026,
    status: ArticleStatus.PUBLISHED,
    author: "Dr. Farah Amelia",
    faculty: "Ekonomi",
    categories: ["Ekonomi Digital"],
    downloadCount: 512,
    type: WorkType.RESEARCH,
    roadmapTopic: "research-sustainability-2024-e", // UMKM
    themes: ["manajemen", "inovasi-berkelanjutan"],
  },
  {
    title: "Analisis Efisiensi Energi Terbarukan pada Sistem Panel Surya Terdistribusi",
    sdgs: [7, 13],
    coAuthors: [{ name: "Farhan Maulana", type: AuthorType.MAHASISWA, affiliation: "Teknik Elektro" }, { name: "Prof. Hiroshi Tanaka", type: AuthorType.EKSTERNAL, affiliation: "Kyushu University" }],
    abstract:
      "Mengkaji efisiensi konversi energi pada sistem panel surya terdistribusi di wilayah tropis.",
    keywords: ["energi terbarukan", "panel surya", "efisiensi"],
    year: 2025,
    status: ArticleStatus.PUBLISHED,
    author: "Dr. Andi Wijaya",
    faculty: "Teknik",
    categories: ["Teknik Elektro"],
    downloadCount: 342,
    type: WorkType.RESEARCH,
    roadmapTopic: "research-inovasi-teknologi-2024-a", // Energi Terbarukan, Game Inklusif
    themes: ["energi", "rekayasa-keteknikan"],
  },
  {
    title: "Penanganan Stunting di Daerah Pesisir: Studi Kasus Multisektor",
    sdgs: [2, 3],
    abstract:
      "Meninjau efektivitas intervensi multisektor dalam penanganan stunting di wilayah pesisir.",
    keywords: ["stunting", "kesehatan pesisir", "intervensi multisektor"],
    year: 2024,
    status: ArticleStatus.PUBLISHED,
    author: "dr. Bayu Prasetyo",
    faculty: "Kedokteran",
    categories: ["Kesehatan Masyarakat"],
    downloadCount: 276,
    type: WorkType.RESEARCH,
    // Roadmap Renstra belum punya topik kesehatan, jadi topik sengaja dikosongkan.
    themes: ["pangan"],
  },
  {
    title: "Kebijakan Hukum Lingkungan Pesisir dalam Perspektif Otonomi Daerah",
    sdgs: [14, 16],
    abstract:
      "Menganalisis efektivitas kebijakan hukum lingkungan pesisir pasca desentralisasi.",
    keywords: ["hukum lingkungan", "otonomi daerah", "pesisir"],
    year: 2024,
    status: ArticleStatus.PUBLISHED,
    author: "Prof. Lestari",
    faculty: "Hukum",
    categories: ["Hukum Lingkungan"],
    downloadCount: 845,
    type: WorkType.RESEARCH,
    themes: ["lingkungan-hidup"],
  },
  {
    title: "Penerapan Blockchain untuk Transparansi Akuntansi Publik di Pemerintah Daerah",
    sdgs: [9, 16],
    abstract:
      "Mengevaluasi kelayakan pencatatan transaksi berbasis blockchain untuk meningkatkan transparansi dan akuntabilitas pelaporan keuangan pemerintah daerah.",
    keywords: ["blockchain", "akuntansi publik", "transparansi", "tata kelola"],
    year: 2025,
    status: ArticleStatus.PUBLISHED,
    author: "Dr. Farah Amelia",
    faculty: "Ekonomi",
    categories: ["Ekonomi Digital"],
    downloadCount: 410,
    type: WorkType.RESEARCH,
    roadmapTopic: "research-inovasi-teknologi-2024-b", // Blockchain untuk Akuntansi Publik
    themes: ["tata-kelola-keuangan", "inovasi-berkelanjutan"],
  },
  {
    title: "Digitalisasi Budaya Lokal Sunda melalui Augmented Reality untuk Media Belajar",
    sdgs: [4, 11],
    abstract:
      "Merancang dan menguji media belajar berbasis augmented reality yang memperkenalkan aksara dan kesenian Sunda kepada siswa sekolah menengah.",
    keywords: ["augmented reality", "budaya Sunda", "media belajar", "digitalisasi budaya"],
    year: 2025,
    status: ArticleStatus.PUBLISHED,
    author: "Dr. Nadia Putri",
    faculty: "Pendidikan",
    categories: ["Teknologi Pendidikan"],
    downloadCount: 198,
    type: WorkType.RESEARCH,
    roadmapTopic: "research-rich-content-and-value-2025-a", // AR untuk Budaya
    themes: ["budaya-dan-informasi", "humaniora"],
  },
  {
    title: "Prediksi Beban Listrik Berbasis Pembelajaran Mesin untuk Jaringan Mikro",
    sdgs: [7, 9],
    abstract:
      "Membandingkan model pembelajaran mesin untuk memprediksi beban listrik jangka pendek pada jaringan mikro dengan pembangkit surya.",
    keywords: ["pembelajaran mesin", "beban listrik", "jaringan mikro"],
    year: 2026,
    status: ArticleStatus.PUBLISHED,
    author: "Dr. Andi Wijaya",
    faculty: "Teknik",
    categories: ["Ilmu Komputer", "Teknik Elektro"],
    downloadCount: 129,
    type: WorkType.RESEARCH,
    themes: ["energi", "rekayasa-keteknikan"],
  },
  {
    title: "Evaluasi Implementasi ESG pada Lembaga Keuangan Mikro",
    sdgs: [8, 12],
    abstract:
      "Menilai tingkat penerapan prinsip lingkungan, sosial, dan tata kelola pada lembaga keuangan mikro serta kaitannya dengan kinerja keberlanjutan.",
    keywords: ["ESG", "keuangan mikro", "keberlanjutan"],
    year: 2026,
    status: ArticleStatus.PUBLISHED,
    author: "Dr. Farah Amelia",
    faculty: "Ekonomi",
    categories: ["Ekonomi Moneter"],
    downloadCount: 87,
    type: WorkType.RESEARCH,
    roadmapTopic: "research-sustainability-2026-b", // ESG dalam Bisnis, Terkait Keuangan
    themes: ["tata-kelola-keuangan", "manajemen"],
  },

  // ===== PKM — terbit (kelanjutan dari riset di atas) =====
  {
    title: "Pelatihan Literasi Digital bagi Pelaku UMKM Desa Binaan di Kabupaten Bandung Barat",
    sdgs: [4, 8],
    abstract:
      "Program pelatihan pemasaran digital dan pencatatan usaha bagi 40 pelaku UMKM desa binaan, dilanjutkan pendampingan selama tiga bulan.",
    keywords: ["literasi digital", "UMKM", "pendampingan", "desa binaan"],
    year: 2025,
    status: ArticleStatus.PUBLISHED,
    author: "Dr. Farah Amelia",
    faculty: "Ekonomi",
    categories: ["Ekonomi Digital"],
    downloadCount: 164,
    type: WorkType.PKM,
    roadmapTopic: "pkm-2024-a", // Pelatihan Literasi Digital untuk UMKM
    pkmFocusAreas: ["pemberdayaan-masyarakat-desa-binaan", "ekonomi-kreatif-kewirausahaan"],
    region: Region.REGIONAL,
    partner: "Paguyuban UMKM Desa Binaan (contoh)",
    sourceResearchTitle: "Dampak Digitalisasi terhadap Produktivitas UMKM di Jawa Barat",
  },
  {
    title: "Edukasi Panel Surya Skala Rumah Tangga bagi Masyarakat Kelurahan Binaan",
    sdgs: [4, 7],
    abstract:
      "Penyuluhan dan demonstrasi pemasangan panel surya skala rumah tangga, termasuk simulasi penghematan biaya listrik bagi warga.",
    keywords: ["energi terbarukan", "panel surya", "edukasi masyarakat"],
    year: 2025,
    status: ArticleStatus.PUBLISHED,
    author: "Dr. Andi Wijaya",
    faculty: "Teknik",
    categories: ["Teknik Elektro"],
    downloadCount: 221,
    type: WorkType.PKM,
    roadmapTopic: "pkm-2024-c", // Edukasi Energi Terbarukan untuk Masyarakat Desa
    pkmFocusAreas: ["teknologi-tepat-guna-inovasi-digital", "lingkungan-hidup-green-campus"],
    region: Region.LOKAL,
    partner: "Karang Taruna Kelurahan Binaan (contoh)",
    sourceResearchTitle: "Analisis Efisiensi Energi Terbarukan pada Sistem Panel Surya Terdistribusi",
  },

  // ===== Menunggu verifikasi — untuk menguji halaman /admin =====
  {
    title: "Optimalisasi Jaringan Sensor Nirkabel untuk Pemantauan Kualitas Udara",
    sdgs: [11, 13],
    abstract:
      "Studi ini mengusulkan skema penempatan sensor nirkabel yang optimal untuk pemantauan kualitas udara perkotaan menggunakan algoritma optimasi berbasis graf.",
    keywords: ["sensor nirkabel", "kualitas udara", "IoT"],
    year: 2026,
    status: ArticleStatus.PENDING,
    author: "Dr. Andi Wijaya",
    faculty: "Teknik",
    categories: ["Ilmu Komputer"],
    downloadCount: 0,
    type: WorkType.RESEARCH,
    themes: ["lingkungan-hidup", "rekayasa-keteknikan"],
  },
  {
    title: "Pengaruh Literasi Keuangan terhadap Perilaku Menabung Generasi Z",
    sdgs: [4, 8],
    abstract:
      "Penelitian ini menganalisis hubungan antara tingkat literasi keuangan dan perilaku menabung pada generasi Z di perkotaan menggunakan pendekatan survei kuantitatif.",
    keywords: ["literasi keuangan", "generasi Z", "perilaku menabung"],
    year: 2026,
    status: ArticleStatus.PENDING,
    author: "Dr. Farah Amelia",
    faculty: "Ekonomi",
    categories: ["Ekonomi Moneter"],
    downloadCount: 0,
    type: WorkType.RESEARCH,
    roadmapTopic: "research-sustainability-2024-b", // Pengelolaan Keuangan Berbasis Teknologi
    themes: ["tata-kelola-keuangan"],
  },
  {
    title: "Implementasi Kurikulum Merdeka Belajar pada Sekolah Menengah Kejuruan",
    sdgs: [4, 8],
    abstract:
      "Penelitian ini mengevaluasi tantangan dan strategi implementasi Kurikulum Merdeka Belajar di sekolah menengah kejuruan berdasarkan perspektif guru dan siswa.",
    keywords: ["kurikulum merdeka", "SMK", "evaluasi pendidikan"],
    year: 2026,
    status: ArticleStatus.PENDING,
    author: "Dr. Nadia Putri",
    faculty: "Pendidikan",
    categories: ["Teknologi Pendidikan"],
    downloadCount: 0,
    type: WorkType.RESEARCH,
    themes: ["humaniora"],
  },
  {
    title: "Pendampingan Laporan Keuangan Digital bagi Koperasi Warga",
    sdgs: [1, 8],
    abstract:
      "Pendampingan penggunaan aplikasi pencatatan keuangan sederhana bagi pengurus koperasi warga, meliputi pelatihan dan evaluasi penggunaan selama dua bulan.",
    keywords: ["keuangan digital", "koperasi", "pendampingan"],
    year: 2026,
    status: ArticleStatus.PENDING,
    author: "Dr. Farah Amelia",
    faculty: "Ekonomi",
    categories: ["Ekonomi Digital"],
    downloadCount: 0,
    type: WorkType.PKM,
    roadmapTopic: "pkm-2024-b", // Pendampingan Pengelolaan Keuangan Digital
    pkmFocusAreas: ["ekonomi-kreatif-kewirausahaan"],
    region: Region.LOKAL,
    partner: "Koperasi Warga (contoh)",
  },

  // ===== Ditolak — untuk menguji tampilan REJECTED di dashboard dosen =====
  {
    title: "Evaluasi Ketahanan Material Komposit terhadap Beban Siklik",
    sdgs: [9, 12],
    abstract:
      "Studi eksperimental mengenai ketahanan material komposit serat karbon terhadap pembebanan siklik jangka panjang.",
    keywords: ["material komposit", "beban siklik", "serat karbon"],
    year: 2025,
    status: ArticleStatus.REJECTED,
    rejectedNote: "Mohon lampirkan data mentah hasil pengujian laboratorium sebagai lampiran.",
    author: "Dr. Andi Wijaya",
    faculty: "Teknik",
    categories: ["Teknik Sipil"],
    downloadCount: 0,
    type: WorkType.RESEARCH,
    themes: ["rekayasa-keteknikan"],
  },
];

const dosenSeed = [
  { name: "Dr. Andi Wijaya", email: "andi.wijaya@kampus.ac.id", faculty: "Teknik" },
  { name: "Dr. Farah Amelia", email: "farah.amelia@kampus.ac.id", faculty: "Ekonomi" },
  { name: "dr. Bayu Prasetyo", email: "bayu.prasetyo@kampus.ac.id", faculty: "Kedokteran" },
  { name: "Dr. Nadia Putri", email: "nadia.putri@kampus.ac.id", faculty: "Pendidikan" },
  { name: "Prof. Lestari", email: "lestari@kampus.ac.id", faculty: "Hukum" },
];

const categoryNames = [
  "Teknik Elektro",
  "Teknik Sipil",
  "Ilmu Komputer",
  "Ekonomi Digital",
  "Ekonomi Moneter",
  "Kesehatan Masyarakat",
  "Teknologi Pendidikan",
  "Hukum Lingkungan",
  "Metodologi Penelitian",
];

// Cari penulis non-akun (mahasiswa/eksternal) berdasarkan nama+tipe; buat bila belum ada.
async function findOrCreateAuthor(name: string, type: AuthorType, affiliation?: string) {
  const existing = await prisma.author.findFirst({ where: { name, type, userId: null } });
  return (
    existing ??
    prisma.author.create({ data: { name, type, affiliation: affiliation ?? null } })
  );
}

async function main() {
  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);
  writeSeedPdf();

  // --- Roadmap (harus lebih dulu: karya contoh menautkan ke topik roadmap) -----
  await seedRoadmap(prisma);

  // --- SDG (17 tujuan; migrasi juga mengisinya, upsert ini menjaga namanya tetap sinkron) --
  await Promise.all(
    SDGS.map((sdg) =>
      prisma.sdg.upsert({
        where: { number: sdg.number },
        update: { name: sdg.name, shortName: sdg.shortName },
        create: { number: sdg.number, name: sdg.name, shortName: sdg.shortName },
      }),
    ),
  );

  // --- Fakultas ----------------------------------------------------------------
  const faculties = await Promise.all(
    ["Teknik", "Ekonomi", "Kedokteran", "Pendidikan", "Hukum"].map((name) =>
      prisma.faculty.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );
  const facultyByName = Object.fromEntries(faculties.map((f) => [f.name, f]));

  // --- Kategori ----------------------------------------------------------------
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({ where: { name }, update: {}, create: { name } }),
    ),
  );
  const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  // --- Admin -------------------------------------------------------------------
  const admin = await prisma.user.upsert({
    where: { email: "rini.kartika@kampus.ac.id" },
    update: {},
    create: {
      name: "Rini Kartika",
      email: "rini.kartika@kampus.ac.id",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  // --- Dosen -------------------------------------------------------------------
  const dosenUsers = await Promise.all(
    dosenSeed.map((d) =>
      prisma.user.upsert({
        where: { email: d.email },
        update: {},
        create: {
          name: d.name,
          email: d.email,
          passwordHash,
          role: Role.DOSEN,
          facultyId: facultyByName[d.faculty].id,
        },
      }),
    ),
  );
  const dosenByName = Object.fromEntries(dosenUsers.map((u) => [u.name, u]));

  // Profil penulis tiap dosen (terhubung ke akun, afiliasi = fakultas).
  const authorByDosen = new Map<string, string>();
  for (const d of dosenSeed) {
    const user = dosenByName[d.name];
    const author = await prisma.author.upsert({
      where: { userId: user.id },
      update: { name: d.name, affiliation: d.faculty },
      create: { name: d.name, type: AuthorType.DOSEN, affiliation: d.faculty, userId: user.id },
    });
    authorByDosen.set(d.name, author.id);
  }

  // Daftar penulis berurutan sebuah karya: pengunggah dulu (korespondensi), lalu coAuthors.
  async function buildAuthorLinks(a: ArticleSeed) {
    const links = [{ authorId: authorByDosen.get(a.author)!, position: 1, corresponding: true }];
    for (const [i, co] of (a.coAuthors ?? []).entries()) {
      const author = await findOrCreateAuthor(co.name, co.type, co.affiliation);
      links.push({ authorId: author.id, position: i + 2, corresponding: false });
    }
    return links;
  }
  const sdgLinks = (a: ArticleSeed) => (a.sdgs ?? []).map((sdgNumber) => ({ sdgNumber }));

  // --- Karya -------------------------------------------------------------------
  // Slug roadmap dicek lebih dulu agar salah ketik langsung ketahuan dengan pesan jelas.
  const topicIdBySlug = new Map<string, string>();
  for (const slug of new Set(articlesSeed.flatMap((a) => (a.roadmapTopic ? [a.roadmapTopic] : [])))) {
    const topic = await prisma.roadmapTopic.findUnique({ where: { slug } });
    if (!topic) throw new Error(`Topik roadmap tidak ditemukan: "${slug}". Cek prisma/roadmap.ts.`);
    topicIdBySlug.set(slug, topic.id);
  }

  const articleIdByTitle = new Map<string, string>();
  let created = 0;
  let updated = 0;

  // Riset diproses lebih dulu agar PkM bisa menautkan riset sumbernya.
  const ordered = [...articlesSeed].sort(
    (a, b) => Number(a.type === WorkType.PKM) - Number(b.type === WorkType.PKM),
  );

  for (const [index, a] of ordered.entries()) {
    const sourceResearchId = a.sourceResearchTitle
      ? articleIdByTitle.get(a.sourceResearchTitle)
      : undefined;
    if (a.sourceResearchTitle && !sourceResearchId) {
      throw new Error(`Riset sumber tidak ditemukan: "${a.sourceResearchTitle}"`);
    }

    const taxonomy = {
      type: a.type,
      roadmapTopicId: a.roadmapTopic ? topicIdBySlug.get(a.roadmapTopic) : null,
      region: a.region ?? null,
      partner: a.partner ?? null,
      sourceResearchId: sourceResearchId ?? null,
    };
    const themeRefs = (a.themes ?? []).map((slug) => ({ slug }));
    const focusRefs = (a.pkmFocusAreas ?? []).map((slug) => ({ slug }));

    const existing = await prisma.article.findFirst({ where: { title: a.title } });

    if (existing) {
      // Hanya tautan taksonomi yang diperbarui; status/unduhan tidak ditimpa
      // supaya hasil uji verifikasi di lokal tidak hilang saat seed diulang.
      // fileUrl hanya diganti bila masih placeholder lama (example.com), bukan unggahan sungguhan.
      const isOldPlaceholder = existing.fileUrl.startsWith("https://example.com");
      await prisma.article.update({
        where: { id: existing.id },
        data: {
          ...(isOldPlaceholder ? { fileUrl: SEED_PDF_URL } : {}),
          ...taxonomy,
          themes: { set: themeRefs },
          pkmFocusAreas: { set: focusRefs },
        },
      });
      // SDG dan penulis disinkronkan ulang dari seed (tidak menyentuh unggahan sungguhan di
      // luar daftar seed karena pencocokan memakai judul).
      await prisma.articleSdg.deleteMany({ where: { articleId: existing.id } });
      await prisma.articleSdg.createMany({
        data: sdgLinks(a).map((l) => ({ articleId: existing.id, ...l })),
      });
      await prisma.articleAuthor.deleteMany({ where: { articleId: existing.id } });
      await prisma.articleAuthor.createMany({
        data: (await buildAuthorLinks(a)).map((l) => ({ articleId: existing.id, ...l })),
      });
      articleIdByTitle.set(a.title, existing.id);
      updated++;
      continue;
    }

    const row = await prisma.article.create({
      data: {
        title: a.title,
        abstract: a.abstract,
        keywords: a.keywords,
        year: a.year,
        status: a.status,
        rejectedNote: a.rejectedNote ?? null,
        fileUrl: SEED_PDF_URL,
        downloadCount: a.downloadCount,
        // Tanggal terbit berselang satu hari per karya agar urutan "Artikel terbaru" stabil.
        publishedAt:
          a.status === ArticleStatus.PUBLISHED
            ? new Date(Date.now() - index * 24 * 60 * 60 * 1000)
            : null,
        // Mode "checked" (karena ada uploader/faculty connect): relasi memakai nested connect,
        // bukan scalar FK roadmapTopicId/sourceResearchId.
        type: taxonomy.type,
        region: taxonomy.region,
        partner: taxonomy.partner,
        ...(taxonomy.roadmapTopicId
          ? { roadmapTopic: { connect: { id: taxonomy.roadmapTopicId } } }
          : {}),
        ...(taxonomy.sourceResearchId
          ? { sourceResearch: { connect: { id: taxonomy.sourceResearchId } } }
          : {}),
        uploader: { connect: { id: dosenByName[a.author].id } },
        authors: { create: await buildAuthorLinks(a) },
        sdgs: { create: sdgLinks(a) },
        faculty: { connect: { id: facultyByName[a.faculty].id } },
        categories: {
          create: a.categories.map((categoryName) => ({
            category: { connect: { id: categoryByName[categoryName].id } },
          })),
        },
        themes: { connect: themeRefs },
        pkmFocusAreas: { connect: focusRefs },
      },
    });
    articleIdByTitle.set(a.title, row.id);
    created++;
  }

  const countBy = (pred: (a: ArticleSeed) => boolean) => articlesSeed.filter(pred).length;
  console.log("Seed selesai.");
  console.log(`- ${faculties.length} fakultas, ${categories.length} kategori, ${SDGS.length} SDG`);
  console.log(`- ${dosenUsers.length} akun dosen + 1 akun admin (password: ${DEV_PASSWORD})`);
  console.log(
    `- ${articlesSeed.length} karya (${created} baru, ${updated} diperbarui): ` +
      `${countBy((a) => a.type === WorkType.RESEARCH)} riset, ${countBy((a) => a.type === WorkType.PKM)} PkM; ` +
      `${countBy((a) => a.status === ArticleStatus.PUBLISHED)} terbit, ` +
      `${countBy((a) => a.status === ArticleStatus.PENDING)} menunggu, ` +
      `${countBy((a) => a.status === ArticleStatus.REJECTED)} ditolak`,
  );
  console.log(`\nEmail admin: ${admin.email}`);
  dosenUsers.forEach((u) => console.log(`Email dosen: ${u.email}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
