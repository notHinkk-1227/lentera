// Data roadmap Penelitian & PkM 2024–2028, disalin apa adanya dari file roadmap.
// Format topik: [tahun, kode, judul]

export type Topic = [year: number, code: string, title: string];

// ---- 10 tema penelitian unggulan (Tabel 2) ----
export const themes = [
  { slug: "humaniora", name: "Humaniora" },
  { slug: "budaya-dan-informasi", name: "Budaya dan Informasi" },
  { slug: "lingkungan-hidup", name: "Lingkungan Hidup" },
  { slug: "pangan", name: "Pangan" },
  { slug: "energi", name: "Energi" },
  { slug: "transportasi", name: "Transportasi" },
  { slug: "rekayasa-keteknikan", name: "Rekayasa Keteknikan" },
  { slug: "manajemen", name: "Manajemen" },
  { slug: "tata-kelola-keuangan", name: "Tata Kelola Keuangan" },
  { slug: "inovasi-berkelanjutan", name: "Inovasi Berkelanjutan" },
];

// ---- 4 spesialisasi riset + bidang fokusnya (=> slug tema) ----
export const streams = [
  {
    slug: "sustainability",
    name: "Sustainability",
    themes: ["lingkungan-hidup", "energi", "inovasi-berkelanjutan", "transportasi", "pangan"],
  },
  {
    slug: "inovasi-teknologi",
    name: "Inovasi Teknologi",
    themes: ["rekayasa-keteknikan", "tata-kelola-keuangan", "energi", "transportasi", "manajemen"],
  },
  {
    slug: "rich-content-and-value",
    name: "Rich Content and Value",
    themes: ["humaniora", "budaya-dan-informasi", "pangan", "manajemen"],
  },
  {
    slug: "kolaborasi-dan-kreativitas",
    name: "Kolaborasi dan Kreativitas",
    themes: ["humaniora", "budaya-dan-informasi", "manajemen", "transportasi"],
  },
];

// ---- 6 bidang fokus PkM ----
export const pkmFocusAreas = [
  { slug: "pemberdayaan-masyarakat-desa-binaan", name: "Pemberdayaan Masyarakat dan Desa Binaan" },
  { slug: "teknologi-tepat-guna-inovasi-digital", name: "Teknologi Tepat Guna dan Inovasi Digital" },
  { slug: "ekonomi-kreatif-kewirausahaan", name: "Pengembangan Ekonomi Kreatif dan Kewirausahaan" },
  { slug: "pendidikan-literasi-digital", name: "Pendidikan, Literasi Digital, dan Kecakapan Hidup" },
  { slug: "lingkungan-hidup-green-campus", name: "Lingkungan Hidup dan Green Campus" },
  { slug: "kolaborasi-internasional-pkm-global", name: "Kolaborasi Internasional dan Program PkM Global" },
];

// ---- Topik Besar PkM per tahun ----
export const years = [
  { year: 2024, pkmTheme: "Literasi Digital, Keberlanjutan UMKM, dan Kewirausahaan Inklusif" },
  { year: 2025, pkmTheme: "Tata Kelola Organisasi & Komunitas Berbasis Teknologi" },
  { year: 2026, pkmTheme: "Implementasi ESG (Environment, Social, Governance) di Masyarakat" },
  { year: 2027, pkmTheme: "Kolaborasi Komunitas & Pelestarian Budaya Digital" },
  { year: 2028, pkmTheme: "Evaluasi Dampak Ekonomi & Sosial Berbasis Teknologi AI" },
];

// ---- Topik roadmap penelitian per spesialisasi (50 baris) ----
export const researchTopics: Record<string, Topic[]> = {
  sustainability: [
    [2024, "A", "Strategi Bisnis Berkelanjutan"],
    [2024, "B", "Pengelolaan Keuangan Berbasis Teknologi"],
    [2024, "C", "Keberlanjutan Organisasi dengan Teknologi AI"],
    [2024, "D", "Kewirausahaan"],
    [2024, "E", "UMKM"],
    [2025, "A", "Mitigasi Perubahan Iklim, Distribusi Media Digital"],
    [2025, "B", "Mitigasi Risiko Keuangan Berbasis Teknologi"],
    [2025, "C", "Blockchain untuk Tata Kelola Perusahaan, Rekrutmen Berbasis Teknologi AI"],
    [2026, "A", "ESG dalam Bisnis, E-learning Berbasis Budaya"],
    [2026, "B", "ESG dalam Bisnis, Terkait dengan Keuangan"],
    [2026, "C", "Evaluasi ESG dalam Manajemen, Manajemen Kinerja Berbasis Data"],
    [2027, "A", "ESG Berbasis Teknologi"],
    [2027, "B", "Strategi Inovasi Organisasi Berbasis AI, Pengelolaan Perubahan Digital"],
    [2028, "A", "Evaluasi Dampak Ekonomi dari Inovasi Berbasis Teknologi"],
    [2028, "B", "Teknologi Manajemen Perubahan Berbasis AI"],
  ],
  "inovasi-teknologi": [
    [2024, "A", "Energi Terbarukan, Game Inklusif"],
    [2024, "B", "Implementasi Blockchain untuk Akuntansi Publik"],
    [2024, "C", "Tata Kelola Berbasis Blockchain, Manajemen Risiko Berbasis Data"],
    [2025, "A", "Blockchain untuk Keuangan, Fintech"],
    [2025, "B", "Transparansi Keuangan Berbasis AI, Sistem Manajemen Keuangan Digital"],
    [2025, "C", "Sistem Pelaporan Keuangan Berbasis AI, Pengelolaan Keberlanjutan Organisasi"],
    [2026, "A", "Mobile Banking, Teknologi Perpustakaan Inklusif"],
    [2026, "B", "Mobile Banking untuk Akuntansi Mikro, Akuntansi Keberlanjutan"],
    [2026, "C", "Strategi Tata Kelola Perusahaan Berbasis ESG"],
    [2027, "A", "AI untuk Risiko Keuangan, Platform Edukasi Berbasis Komunitas"],
    [2027, "B", "Sistem Akuntansi Berbasis Komunitas"],
    [2027, "C", "Pengembangan Platform CSR Berbasis Teknologi"],
    [2028, "A", "AI untuk Risiko Keuangan, Platform Edukasi Berbasis Komunitas"],
    [2028, "B", "Evaluasi Dampak Sistem Pembayaran Digital"],
    [2028, "C", "Evaluasi Teknologi Pelaporan Keberlanjutan"],
  ],
  "rich-content-and-value": [
    [2024, "A", "Energi Terbarukan, Digitalisasi Budaya Lokal, Eksplorasi Elemen Visual"],
    [2024, "B", "Desain Konten Edukasi Visual yang Inklusif"],
    [2025, "A", "AR untuk Budaya, Desain Visual Branding"],
    [2025, "B", "Desain Konten Interaktif, Perpustakaan Digital"],
    [2026, "A", "Blockchain untuk Data Budaya, Transformasi Seni Visual"],
    [2026, "B", "Evaluasi Ilustrasi untuk Edukasi, Media Sosial"],
    [2027, "A", "AI untuk Analisis Data Budaya, Pelestarian Warisan Budaya"],
    [2027, "B", "Evaluasi Layanan Perpustakaan, Platform Edukasi Lokal"],
    [2028, "A", "AI untuk Analisis Data Budaya, Pelestarian Warisan Budaya"],
    [2028, "B", "Evaluasi Layanan Perpustakaan, Platform Edukasi Lokal"],
  ],
  "kolaborasi-dan-kreativitas": [
    [2024, "A", "Produksi Film Budaya, Narasi untuk Disabilitas"],
    [2024, "B", "Digitalisasi HR, CSR Digital, Literasi Teknologi dalam Bisnis"],
    [2025, "A", "Pelatihan Komunitas Kreatif"],
    [2025, "B", "Digitalisasi HR, CSR Digital, Literasi Teknologi dalam Bisnis"],
    [2026, "A", "Penggunaan Data Digital untuk Komunitas Budaya"],
    [2026, "B", "Integrasi Teknologi Digital untuk Mendukung Inovasi dan Adaptasi Perubahan dalam Manajemen"],
    [2027, "A", "Kolaborasi Seniman dengan Teknologi"],
    [2027, "B", "Integrasi Teknologi Digital untuk Mendukung Inovasi dan Adaptasi Perubahan dalam Manajemen"],
    [2028, "A", "Kolaborasi Seniman dengan Teknologi"],
    [2028, "B", "Integrasi Teknologi Digital untuk Mendukung Inovasi dan Adaptasi Perubahan dalam Manajemen"],
  ],
};

// ---- Topik roadmap PkM (22 baris, linear per tahun) ----
export const pkmTopics: Topic[] = [
  [2024, "A", "Pelatihan Literasi Digital untuk UMKM"],
  [2024, "B", "Pendampingan Pengelolaan Keuangan Digital Berbasis Aplikasi Sederhana"],
  [2024, "C", "Edukasi Energi Terbarukan untuk Masyarakat Desa"],
  [2024, "D", "Produksi Konten Budaya Lokal untuk Edukasi Masyarakat"],
  [2025, "A", "Pelatihan Komunitas Kreatif: Branding Digital, AR/VR Sederhana untuk Budaya Lokal"],
  [2025, "B", "Workshop Mitigasi Risiko Keuangan Berbasis Teknologi AI bagi Koperasi/UMKM"],
  [2025, "C", "Literasi Blockchain untuk Tata Kelola Usaha Kecil & Organisasi Sosial"],
  [2025, "D", "Desain Konten Interaktif Perpustakaan Digital Desa"],
  [2026, "A", "Edukasi ESG dalam Bisnis Kecil & Lembaga Keuangan Mikro"],
  [2026, "B", "E-learning Berbasis Budaya untuk Pendidikan Komunitas"],
  [2026, "C", "Evaluasi Sistem Manajemen Kinerja Komunitas Berbasis Data"],
  [2026, "D", "Edukasi Mobile Banking & Keuangan Inklusif untuk Masyarakat Rentan"],
  [2026, "E", "Pendampingan Komunitas dalam Pemanfaatan Blockchain untuk Transformasi Visual Budaya"],
  [2027, "A", "Pendampingan Komunitas Budaya Menggunakan AI untuk Pelestarian Warisan Budaya"],
  [2027, "B", "Pengembangan Platform CSR Berbasis Teknologi untuk Perusahaan Lokal"],
  [2027, "C", "Pelatihan Pengelolaan Organisasi Berbasis AI dan Platform Digital"],
  [2027, "D", "Program Kolaborasi Seniman dengan Teknologi"],
  [2028, "A", "Evaluasi Dampak Ekonomi dari Inovasi Teknologi bagi UMKM & Komunitas"],
  [2028, "B", "Penerapan AI untuk Manajemen Perubahan dalam Organisasi Sosial"],
  [2028, "C", "Evaluasi Sistem Pelaporan Keberlanjutan Masyarakat"],
  [2028, "D", "Edukasi Analisis Data Berbasis AI untuk Pelestarian Budaya dan Pengelolaan Lingkungan"],
  [2028, "E", "Program Kolaborasi Lintas Komunitas Berbasis Teknologi untuk Ketahanan Pangan & Sosial"],
];
