import { ArticleCover } from "@/components/public/ArticleCover";
import type { PublicArticle } from "@/lib/types";

// Ukuran cover di komponen ini pakai size="sm" (lihat ArticleCover) — tinggi
// tetap 180px, ditambah gap-4 (16px) antar tile. Dipakai untuk mengestimasi
// tinggi konten supaya kecepatan animasi konsisten (px/detik), bukan durasi
// tetap yang akan terasa berubah-ubah kecepatannya kalau jumlah tile berubah.
const TILE_HEIGHT_PX = 180;
const GAP_PX = 16;

// Supaya loop-nya benar-benar tanpa celah, tinggi SATU set konten (sebelum
// digandakan untuk animasi) harus lebih tinggi dari tinggi panel yang
// ditampilkan. Kalau tidak, saat animasi mencapai titik pergantian, bagian
// bawah panel akan sempat kosong sesaat. Makanya daftar artikel di-ulang
// beberapa kali dulu (bukan cuma sekali) sebelum digandakan untuk animasi.
const MIN_TILES_PER_SET = 14;

function buildTallEnoughSet(articles: PublicArticle[]): PublicArticle[] {
  const result: PublicArticle[] = [];
  while (result.length < MIN_TILES_PER_SET) {
    result.push(...articles);
  }
  return result;
}

export function InfiniteCoverColumn({
  articles,
  direction,
  speedPxPerSecond,
}: {
  articles: PublicArticle[];
  direction: "up" | "down";
  /** Kecepatan gerak, bukan durasi — supaya tetap konsisten walau jumlah tile berubah. */
  speedPxPerSecond: number;
}) {
  const singleSet = buildTallEnoughSet(articles);
  const doubled = [...singleSet, ...singleSet];
  const animationDirection = direction === "down" ? "reverse" : "normal";

  const singleSetHeightPx = singleSet.length * TILE_HEIGHT_PX + (singleSet.length - 1) * GAP_PX;
  const durationSeconds = singleSetHeightPx / speedPxPerSecond;

  return (
    <div className="h-full overflow-hidden">
      <div
        className="flex flex-col gap-4"
        style={{
          animation: `scroll-vertical ${durationSeconds}s linear infinite ${animationDirection}`,
        }}
      >
        {doubled.map((article, i) => (
          <div key={`${article.id}-${i}`} className="shrink-0">
            <ArticleCover title={article.title} theme={article.coverTheme} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
