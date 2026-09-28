// Pemetaan tema (bidang keilmuan) -> gambar cover & hero (pixel art).
// File gambar ada di public/images/covers dan public/images/heroes.
//
// Cara kerja:
// - Satu tema boleh punya lebih dari satu gambar cover. Pilihan gambar ditentukan
//   dari hash judul artikel, jadi artikel yang sama SELALU dapat gambar yang sama
//   (aman untuk SSR/hydration), tapi artikel satu tema tidak semuanya identik.
// - Menambah variasi baru: taruh PNG di public/images/covers lalu tambahkan
//   satu baris di COVERS di bawah. Tidak ada kode lain yang perlu diubah.
// - Cover: rasio ~3:4 (potret), sudah diskalakan 2x dari resolusi pixel-art asli.
// - Hero: rasio ~12:5 (lebar), resolusi pixel-art asli — di-render dengan
//   image-rendering: pixelated supaya tetap tajam saat diperbesar.
import type { CoverThemeKey } from "@/lib/dummy-data";

export type CoverImage = {
  src: string;
  /** Nilai CSS object-position, dipakai saat gambar dipotong oleh object-cover. */
  position: string;
};

const COVERS: Record<CoverThemeKey, CoverImage[]> = {
  teknik: [
    { src: "/images/covers/robot.png", position: "center 20%" },
    { src: "/images/covers/city.png", position: "center" },
  ],
  komputer: [
    { src: "/images/covers/monolith.png", position: "center 60%" },
    { src: "/images/covers/forest.png", position: "center 45%" },
  ],
  ekonomi: [{ src: "/images/covers/shop.png", position: "center 35%" }],
  kedokteran: [{ src: "/images/covers/meadow.png", position: "center" }],
  pendidikan: [
    { src: "/images/covers/balloon.png", position: "center 50%" },
    { src: "/images/covers/sunset.png", position: "center 30%" },
  ],
  hukum: [
    { src: "/images/covers/night.png", position: "center 30%" },
    { src: "/images/covers/door.png", position: "center" },
  ],
};

// Hero butuh gambar lebar, jadi tiap tema hanya punya satu.
const HEROES: Record<CoverThemeKey, CoverImage> = {
  teknik: { src: "/images/heroes/city.png", position: "center 70%" },
  komputer: { src: "/images/heroes/monolith.png", position: "center 70%" },
  ekonomi: { src: "/images/heroes/shop.png", position: "center 45%" },
  kedokteran: { src: "/images/heroes/meadow.png", position: "center 70%" },
  pendidikan: { src: "/images/heroes/sunset.png", position: "center 25%" },
  hukum: { src: "/images/heroes/night.png", position: "center 20%" },
};

// Hash string sederhana (djb2) — cukup untuk memilih varian, bukan untuk keamanan.
function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getCoverImage(theme: CoverThemeKey, seed: string): CoverImage {
  const variants = COVERS[theme];
  return variants[hashString(seed) % variants.length];
}

export function getHeroImage(theme: CoverThemeKey): CoverImage {
  return HEROES[theme];
}
