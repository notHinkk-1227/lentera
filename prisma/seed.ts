// Seed data awal — isinya sengaja dibuat semirip mungkin dengan dummy data
// yang dipakai di lib/dummy-data.ts, supaya begitu halaman-halaman diganti
// dari dummy ke data asli, tampilannya tidak berubah drastis (memudahkan
// verifikasi visual).
//
// Jalankan dengan: npx prisma db seed
// (perintah ini otomatis dipanggil juga setelah `npx prisma migrate reset`)
//
// PERINGATAN: password di bawah ("password123") HANYA untuk development
// lokal. Jangan pernah pakai password contoh seperti ini di database
// production sungguhan.

import { PrismaClient, Role, ArticleStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEV_PASSWORD = "password123";

async function main() {
  const passwordHash = await bcrypt.hash(DEV_PASSWORD, 10);

  // --- Fakultas -----------------------------------------------------------
  const faculties = await Promise.all(
    ["Teknik", "Ekonomi", "Kedokteran", "Pendidikan", "Hukum"].map((name) =>
      prisma.faculty.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
  const facultyByName = Object.fromEntries(faculties.map((f) => [f.name, f]));

  // --- Kategori -------------------------------------------------------------
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
  const categories = await Promise.all(
    categoryNames.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
  const categoryByName = Object.fromEntries(categories.map((c) => [c.name, c]));

  // --- Admin ----------------------------------------------------------------
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

  // --- Dosen ------------------------------------------------------------------
  const dosenSeed = [
    { name: "Dr. Andi Wijaya", email: "andi.wijaya@kampus.ac.id", faculty: "Teknik" },
    { name: "Dr. Farah Amelia", email: "farah.amelia@kampus.ac.id", faculty: "Ekonomi" },
    { name: "dr. Bayu Prasetyo", email: "bayu.prasetyo@kampus.ac.id", faculty: "Kedokteran" },
    { name: "Dr. Nadia Putri", email: "nadia.putri@kampus.ac.id", faculty: "Pendidikan" },
    { name: "Prof. Lestari", email: "lestari@kampus.ac.id", faculty: "Hukum" },
  ];

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

  // --- Artikel (campuran status, mengikuti pola dummy data) -------------------
  const articlesSeed = [
    {
      title: "Dampak Digitalisasi terhadap Produktivitas UMKM di Jawa Barat",
      abstract:
        "Studi ini mengkaji korelasi antara adopsi platform digital dan pertumbuhan omzet pelaku UMKM, dengan sampel 240 responden di lima kabupaten.",
      keywords: ["digitalisasi", "UMKM", "produktivitas", "ekonomi digital"],
      year: 2026,
      status: ArticleStatus.PUBLISHED,
      author: "Dr. Farah Amelia",
      faculty: "Ekonomi",
      categories: ["Ekonomi Digital"],
      downloadCount: 512,
    },
    {
      title: "Analisis Efisiensi Energi Terbarukan pada Sistem Panel Surya Terdistribusi",
      abstract:
        "Mengkaji efisiensi konversi energi pada sistem panel surya terdistribusi di wilayah tropis.",
      keywords: ["energi terbarukan", "panel surya", "efisiensi"],
      year: 2025,
      status: ArticleStatus.PUBLISHED,
      author: "Dr. Andi Wijaya",
      faculty: "Teknik",
      categories: ["Teknik Elektro"],
      downloadCount: 342,
    },
    {
      title: "Penanganan Stunting di Daerah Pesisir: Studi Kasus Multisektor",
      abstract:
        "Meninjau efektivitas intervensi multisektor dalam penanganan stunting di wilayah pesisir.",
      keywords: ["stunting", "kesehatan pesisir", "intervensi multisektor"],
      year: 2024,
      status: ArticleStatus.PUBLISHED,
      author: "dr. Bayu Prasetyo",
      faculty: "Kedokteran",
      categories: ["Kesehatan Masyarakat"],
      downloadCount: 276,
    },
    {
      title: "Kebijakan Hukum Lingkungan Pesisir dalam Perspektif Otonomi Daerah",
      abstract:
        "Menganalisis efektivitas kebijakan hukum lingkungan pesisir pasca desentralisasi.",
      keywords: ["hukum lingkungan", "otonomi daerah", "pesisir"],
      year: 2024,
      status: ArticleStatus.PUBLISHED,
      author: "Prof. Lestari",
      faculty: "Hukum",
      categories: ["Hukum Lingkungan"],
      downloadCount: 845,
    },
    // Menunggu verifikasi — untuk menguji halaman /admin
    {
      title: "Optimalisasi Jaringan Sensor Nirkabel untuk Pemantauan Kualitas Udara",
      abstract:
        "Studi ini mengusulkan skema penempatan sensor nirkabel yang optimal untuk pemantauan kualitas udara perkotaan menggunakan algoritma optimasi berbasis graf.",
      keywords: ["sensor nirkabel", "kualitas udara", "IoT"],
      year: 2026,
      status: ArticleStatus.PENDING,
      author: "Dr. Andi Wijaya",
      faculty: "Teknik",
      categories: ["Ilmu Komputer"],
      downloadCount: 0,
    },
    {
      title: "Pengaruh Literasi Keuangan terhadap Perilaku Menabung Generasi Z",
      abstract:
        "Penelitian ini menganalisis hubungan antara tingkat literasi keuangan dan perilaku menabung pada generasi Z di perkotaan menggunakan pendekatan survei kuantitatif.",
      keywords: ["literasi keuangan", "generasi Z", "perilaku menabung"],
      year: 2026,
      status: ArticleStatus.PENDING,
      author: "Dr. Farah Amelia",
      faculty: "Ekonomi",
      categories: ["Ekonomi Moneter"],
      downloadCount: 0,
    },
    {
      title: "Implementasi Kurikulum Merdeka Belajar pada Sekolah Menengah Kejuruan",
      abstract:
        "Penelitian ini mengevaluasi tantangan dan strategi implementasi Kurikulum Merdeka Belajar di sekolah menengah kejuruan berdasarkan perspektif guru dan siswa.",
      keywords: ["kurikulum merdeka", "SMK", "evaluasi pendidikan"],
      year: 2026,
      status: ArticleStatus.PENDING,
      author: "Dr. Nadia Putri",
      faculty: "Pendidikan",
      categories: ["Teknologi Pendidikan"],
      downloadCount: 0,
    },
    // Ditolak — untuk menguji tampilan status REJECTED di dashboard dosen
    {
      title: "Evaluasi Ketahanan Material Komposit terhadap Beban Siklik",
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
    },
  ];

  for (const a of articlesSeed) {
    const existing = await prisma.article.findFirst({ where: { title: a.title } });
    if (existing) continue;

    await prisma.article.create({
      data: {
        title: a.title,
        abstract: a.abstract,
        keywords: a.keywords,
        year: a.year,
        status: a.status,
        rejectedNote: "rejectedNote" in a ? a.rejectedNote : null,
        fileUrl: "https://example.com/placeholder.pdf", // TODO: ganti begitu storage aktif
        downloadCount: a.downloadCount,
        publishedAt: a.status === ArticleStatus.PUBLISHED ? new Date() : null,
        author: { connect: { id: dosenByName[a.author].id } },
        faculty: { connect: { id: facultyByName[a.faculty].id } },
        categories: {
          create: a.categories.map((categoryName) => ({
            category: { connect: { id: categoryByName[categoryName].id } },
          })),
        },
      },
    });
  }

  console.log("Seed selesai.");
  console.log(`- ${faculties.length} fakultas`);
  console.log(`- ${categories.length} kategori`);
  console.log(`- ${dosenUsers.length} akun dosen + 1 akun admin (password: ${DEV_PASSWORD})`);
  console.log(`- ${articlesSeed.length} artikel (campuran status)`);
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
