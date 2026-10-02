// 17 Tujuan Pembangunan Berkelanjutan (SDG) untuk klasifikasi karya (FR-NASKAH-08, FR-ADM-03).
//
// Data ini sementara hidup di kode. Nanti dipindah ke tabel `Sdg` lewat seed (lihat PRD 6.3).
// Warna mengikuti palet resmi SDG PBB dan dipakai untuk grafik (mis. MAESTRO nanti).
// Ikon resmi ada di public/images/sdg/sdg-NN.png; lihat components/article-detail/SdgAlignment.tsx.
export type Sdg = {
  number: number;
  name: string;
  /** Nama pendek untuk lencana kecil. */
  shortName: string;
  color: string;
  /** Warna teks di atas `color` supaya kontras tetap terbaca (mis. kuning butuh teks gelap). */
  textColor: string;
};

export const SDGS: Sdg[] = [
  { number: 1, name: "Tanpa Kemiskinan", shortName: "Tanpa Kemiskinan", color: "#E5243B", textColor: "#FFFFFF" },
  { number: 2, name: "Tanpa Kelaparan", shortName: "Tanpa Kelaparan", color: "#DDA63A", textColor: "#1A1A1A" },
  { number: 3, name: "Kehidupan Sehat dan Sejahtera", shortName: "Hidup Sehat", color: "#4C9F38", textColor: "#FFFFFF" },
  { number: 4, name: "Pendidikan Berkualitas", shortName: "Pendidikan", color: "#C5192D", textColor: "#FFFFFF" },
  { number: 5, name: "Kesetaraan Gender", shortName: "Kesetaraan Gender", color: "#FF3A21", textColor: "#FFFFFF" },
  { number: 6, name: "Air Bersih dan Sanitasi Layak", shortName: "Air Bersih", color: "#26BDE2", textColor: "#1A1A1A" },
  { number: 7, name: "Energi Bersih dan Terjangkau", shortName: "Energi Bersih", color: "#FCC30B", textColor: "#1A1A1A" },
  { number: 8, name: "Pekerjaan Layak dan Pertumbuhan Ekonomi", shortName: "Pekerjaan Layak", color: "#A21942", textColor: "#FFFFFF" },
  { number: 9, name: "Industri, Inovasi, dan Infrastruktur", shortName: "Industri & Inovasi", color: "#FD6925", textColor: "#1A1A1A" },
  { number: 10, name: "Berkurangnya Kesenjangan", shortName: "Kesenjangan", color: "#DD1367", textColor: "#FFFFFF" },
  { number: 11, name: "Kota dan Permukiman yang Berkelanjutan", shortName: "Kota Berkelanjutan", color: "#FD9D24", textColor: "#1A1A1A" },
  { number: 12, name: "Konsumsi dan Produksi yang Bertanggung Jawab", shortName: "Konsumsi & Produksi", color: "#BF8B2E", textColor: "#FFFFFF" },
  { number: 13, name: "Penanganan Perubahan Iklim", shortName: "Perubahan Iklim", color: "#3F7E44", textColor: "#FFFFFF" },
  { number: 14, name: "Ekosistem Lautan", shortName: "Ekosistem Laut", color: "#0A97D9", textColor: "#FFFFFF" },
  { number: 15, name: "Ekosistem Daratan", shortName: "Ekosistem Darat", color: "#56C02B", textColor: "#1A1A1A" },
  { number: 16, name: "Perdamaian, Keadilan, dan Kelembagaan yang Tangguh", shortName: "Keadilan & Kelembagaan", color: "#00689D", textColor: "#FFFFFF" },
  { number: 17, name: "Kemitraan untuk Mencapai Tujuan", shortName: "Kemitraan", color: "#19486A", textColor: "#FFFFFF" },
];

export function getSdg(number: number): Sdg | undefined {
  return SDGS.find((sdg) => sdg.number === number);
}
