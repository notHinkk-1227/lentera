const LINK_COLUMNS = [
  ["Tentang Kami", "Pusat Bantuan", "Kontak"],
  ["Panduan Unggah", "Kebijakan Privasi", "Syarat Penggunaan"],
  ["Fakultas & Prodi", "Indeks Kategori", "Pertanyaan Umum"],
];

export function NetflixFooter() {
  return (
    <footer className="mx-auto mt-16 max-w-6xl px-6 pb-12 pt-8 sm:px-10">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
        {LINK_COLUMNS.map((column) =>
          column.map((link) => (
            <span key={link} className="text-xs text-white/40">
              {link}
            </span>
          )),
        )}
      </div>

      <p className="mt-8 text-xs text-white/30">
        © {new Date().getFullYear()} Repositori Karya Ilmiah — Universitas.
      </p>
    </footer>
  );
}
