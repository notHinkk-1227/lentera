"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeywordTagInput } from "@/components/dashboard/KeywordTagInput";
import type { NamedItem } from "@/lib/types";

// Dikirim sebagai JSON ke POST /api/articles. Tidak ada unggah berkas: karya hanya menaut ke
// situs eksternal (unduh, Google Scholar, SINTA). Server memvalidasi ulang semuanya (termasuk
// skema URL) dan mengambil fakultas dari profil pengunggah, jadi `facultyName` di bawah murni
// informasi tampilan.
export function UploadArticleForm({
  facultyName,
  categories,
}: {
  facultyName: string | null;
  categories: NamedItem[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [keywords, setKeywords] = useState<string[]>([]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [scholarUrl, setScholarUrl] = useState("");
  const [sintaUrl, setSintaUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleCategory(id: string) {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !abstract.trim() || keywords.length === 0 || categoryIds.length === 0) {
      setError("Judul, abstrak, minimal 1 kata kunci, dan minimal 1 kategori wajib diisi.");
      return;
    }

    const body = {
      title: title.trim(),
      abstract: abstract.trim(),
      year,
      keywords,
      categoryIds,
      downloadUrl: downloadUrl.trim(),
      scholarUrl: scholarUrl.trim(),
      sintaUrl: sintaUrl.trim(),
    };

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "Karya gagal dikirim. Coba lagi.");
        setIsSubmitting(false);
        return;
      }
    } catch {
      setError("Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.");
      setIsSubmitting(false);
      return;
    }

    // Berhasil: kembali ke dashboard dengan status "menunggu verifikasi".
    router.push("/dosen?submitted=1");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error ? (
        <p className="rounded-md bg-status-rejected-soft px-3 py-2 text-sm text-status-rejected">
          {error}
        </p>
      ) : null}

      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="font-serif text-lg text-ink">Informasi artikel</h2>

        <div className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-ink">
              Judul artikel
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul lengkap karya ilmiah"
              className="mt-1.5 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="abstract" className="block text-sm font-medium text-ink">
              Abstrak
            </label>
            <textarea
              id="abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={5}
              placeholder="Ringkasan singkat isi artikel"
              className="mt-1.5 w-full resize-none rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-ink">
                Tahun
              </label>
              <input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="mt-1.5 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-ink focus:outline-none"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-ink">Fakultas</span>
              <p className="mt-1.5 rounded-md border border-border bg-paper px-3.5 py-2.5 text-sm text-ink-soft">
                {facultyName ?? "Belum terhubung ke fakultas"}
              </p>
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-ink">Kata kunci</span>
            <div className="mt-1.5">
              <KeywordTagInput value={keywords} onChange={setKeywords} />
            </div>
          </div>

          <div>
            <span className="block text-sm font-medium text-ink">Kategori</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.length === 0 ? (
                <p className="text-sm text-ink-soft">
                  Belum ada kategori. Hubungi admin untuk menambahkannya.
                </p>
              ) : null}
              {categories.map((category) => {
                const isActive = categoryIds.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                      isActive
                        ? "bg-brass-soft text-brass"
                        : "border border-border text-ink-soft hover:bg-paper"
                    }`}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="font-serif text-lg text-ink">Tautan eksternal</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Semua opsional. LENTERA tidak menyimpan berkas PDF, hanya mengarahkan pembaca ke situs
          lain. Cover dibuat otomatis sesuai fakultas.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {[
            {
              id: "downloadUrl",
              label: "Tautan unduh",
              hint: "Alamat berkas di repositori atau situs jurnal. Tombol Unduh hanya muncul bila diisi.",
              placeholder: "https://...",
              value: downloadUrl,
              onChange: setDownloadUrl,
            },
            {
              id: "scholarUrl",
              label: "Tautan Google Scholar",
              hint: "Bila kosong, tautan pencarian Google Scholar dibuat otomatis dari judul.",
              placeholder: "https://scholar.google.com/...",
              value: scholarUrl,
              onChange: setScholarUrl,
            },
            {
              id: "sintaUrl",
              label: "Tautan SINTA",
              hint: "Halaman karya atau profil di SINTA.",
              placeholder: "https://sinta.kemdiktisaintek.go.id/...",
              value: sintaUrl,
              onChange: setSintaUrl,
            },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-sm font-medium text-ink">
                {field.label}
              </label>
              <input
                id={field.id}
                type="url"
                inputMode="url"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder}
                className="mt-1.5 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:border-ink focus:outline-none"
              />
              <p className="mt-1.5 text-xs text-ink-soft">{field.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/dosen")}
          className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {isSubmitting ? "Mengirim..." : "Kirim untuk verifikasi"}
        </button>
      </div>
    </form>
  );
}
