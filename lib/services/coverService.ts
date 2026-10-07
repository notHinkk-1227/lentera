// Cover generator: Strategy pattern.
// Saat ini hanya ada TemplateCoverStrategy. Jika nanti perlu strategi lain (mis. generate dari
// halaman pertama PDF), tinggal tambah class baru yang implement interface CoverGenerator ini —
// tidak perlu ubah kode yang memanggilnya.

export interface CoverGenerator {
  /** Mengembalikan URL cover, atau null bila cover dirender dari template saat ditampilkan. */
  generate(input: { title: string; facultyId: string }): Promise<string | null>;
}

// Cover berbasis template dirender saat halaman ditampilkan (lib/cover-images.ts memilih gambar
// pixel-art per tema dan judul), jadi tidak ada berkas yang perlu dibuat atau disimpan.
// Article.coverUrl dibiarkan kosong; kolom itu disediakan untuk cover unggahan manual.
export class TemplateCoverStrategy implements CoverGenerator {
  async generate(): Promise<string | null> {
    return null;
  }
}

const defaultStrategy: CoverGenerator = new TemplateCoverStrategy();

export async function generateCover(input: {
  title: string;
  facultyId: string;
}): Promise<string | null> {
  return defaultStrategy.generate(input);
}
