"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeywordTagInput } from "@/components/dashboard/KeywordTagInput";
import { FileDropField } from "@/components/dashboard/FileDropField";
import type { NamedItem } from "@/lib/types";

const MAX_PDF_BYTES = 20 * 1024 * 1024; // sama dengan batas di server (lib/validation/article.ts)

// Dikirim sebagai multipart/form-data ke POST /api/articles. Server memvalidasi ulang semuanya
// (ukuran, tanda tangan PDF, kategori) dan mengambil fakultas dari profil pengunggah, jadi
// `facultyName` di bawah murni informasi tampilan.
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
  const [pdfFile, setPdfFile] = useState<File | null>(null);

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
    if (!pdfFile) {
      setError("File PDF artikel wajib diunggah.");
      return;
    }
    if (pdfFile.size > MAX_PDF_BYTES) {
      setError("Ukuran PDF melebihi 20 MB.");
      return;
    }

    const body = new FormData();
    body.set("title", title.trim());
    body.set("abstract", abstract.trim());
    body.set("year", String(year));
    keywords.forEach((keyword) => body.append("keywords", keyword));
    categoryIds.forEach((id) => body.append("categoryIds", id));
    body.set("pdf", pdfFile);

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/articles", { method: "POST", body });
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
        <h2 className="font-serif text-lg text-ink">Berkas</h2>

        <div className="mt-4">
          <FileDropField
            label="File PDF artikel"
            helperText="Wajib. Maks. 20MB, format PDF. Cover dibuat otomatis sesuai fakultas."
            accept="application/pdf"
            onFileSelected={setPdfFile}
          />
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
