import { BookOpen } from "lucide-react";
import { InfiniteCoverColumn } from "@/components/auth/InfiniteCoverColumn";
import { articleService } from "@/lib/services/articleService";
import type { PublicArticle } from "@/lib/types";

// Showcase murni visual (TIDAK ada link/navigasi apa pun) — halaman login
// sengaja fokus hanya ke aksi login, tidak boleh ada elemen yang memindahkan
// user ke halaman lain. "Hidup"-nya didapat dari animasi scroll vertikal
// tanpa henti, tiap kolom bergerak berlawanan arah dengan kolom sebelahnya.
//
// Panel ini hiasan: kegagalan database tidak boleh membuat halaman login ikut gagal, jadi
// error query ditelan dan panel tampil tanpa cover.
async function loadShowcase(): Promise<{
  articles: PublicArticle[];
  stats: { articles: number; faculties: number };
}> {
  try {
    const [articles, stats] = await Promise.all([
      articleService.getShowcaseArticles(12),
      articleService.getPublicStats(),
    ]);
    return { articles, stats };
  } catch (error) {
    console.error("LoginShowcasePanel: gagal memuat data", error);
    return { articles: [], stats: { articles: 0, faculties: 0 } };
  }
}

export async function LoginShowcasePanel() {
  const { articles, stats } = await loadShowcase();

  // Bagi artikel ke 3 kolom secara berselang-seling (interleaved)
  // supaya tiap kolom variasinya beragam, bukan berurutan mentah.
  // InfiniteCoverColumn mengulang daftar sampai cukup tinggi, jadi daftar kosong TIDAK boleh
  // diteruskan (perulangannya tidak akan pernah selesai); kolom kosong dilewati.
  const columns = [0, 1, 2].map((offset) => articles.filter((_, i) => i % 3 === offset));

  return (
    <div className="relative hidden h-full overflow-hidden bg-ink lg:block">
      <div className="grid h-full grid-cols-3 gap-4 p-8">
        {columns[0].length > 0 ? (
          <InfiniteCoverColumn articles={columns[0]} direction="up" speedPxPerSecond={16} />
        ) : null}
        {columns[1].length > 0 ? (
          <InfiniteCoverColumn articles={columns[1]} direction="down" speedPxPerSecond={13} />
        ) : null}
        {columns[2].length > 0 ? (
          <InfiniteCoverColumn articles={columns[2]} direction="up" speedPxPerSecond={19} />
        ) : null}
      </div>

      {/* Scrim atas & bawah supaya cover yang masuk/keluar terlihat memudar, bukan terpotong tegas */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(28,43,57,0.95) 0%, rgba(28,43,57,0.55) 30%, rgba(28,43,57,0) 50%, rgba(28,43,57,0.55) 70%, rgba(28,43,57,0.95) 100%)",
        }}
      />

      {/* Badge statistik — murni informatif, tidak bisa diklik */}
      {stats.articles > 0 ? (
        <div className="absolute right-8 top-8 flex items-center gap-2.5 rounded-lg bg-surface/95 px-4 py-3 shadow-lg backdrop-blur-sm">
          <BookOpen className="h-4 w-4 text-brass" strokeWidth={1.75} />
          <div>
            <p className="text-sm font-semibold leading-none text-ink">
              {stats.articles.toLocaleString("id-ID")} artikel
            </p>
            <p className="mt-1 text-xs leading-none text-ink-soft">
              dari {stats.faculties.toLocaleString("id-ID")} fakultas
            </p>
          </div>
        </div>
      ) : null}

      <div className="absolute inset-x-0 bottom-0 p-10">
        <p className="font-serif text-2xl leading-snug text-paper">
          Satu tempat untuk seluruh karya ilmiah kampus
        </p>
        <p className="mt-3 max-w-sm text-sm text-paper/80">
          Diakses, disimpan, dan dibagikan oleh dosen dari setiap fakultas —
          tersedia untuk dibaca publik setelah diverifikasi pustakawan.
        </p>
      </div>
    </div>
  );
}
