import { z } from "zod";

export const MAX_PDF_BYTES = 20 * 1024 * 1024; // 20 MB (FR-NASKAH-02)

// Field teks pada form unggah. Berkas PDF divalidasi terpisah (ukuran + tanda tangan berkas).
export const submitArticleFieldsSchema = z.object({
  title: z.string().trim().min(5, "Judul minimal 5 karakter."),
  abstract: z.string().trim().min(20, "Abstrak minimal 20 karakter."),
  keywords: z
    .array(z.string().trim().min(1))
    .min(1, "Minimal 1 kata kunci."),
  year: z.coerce
    .number({ message: "Tahun tidak valid." })
    .int("Tahun tidak valid.")
    .min(1990, "Tahun tidak valid.")
    .max(new Date().getFullYear() + 1, "Tahun tidak valid."),
  categoryIds: z.array(z.string().min(1)).min(1, "Pilih minimal 1 kategori."),
});

export const rejectNoteSchema = z.string().trim().min(1, "Alasan penolakan wajib diisi.").max(1000);

export const taxonomyNameSchema = z
  .string()
  .trim()
  .min(2, "Nama minimal 2 karakter.")
  .max(100, "Nama maksimal 100 karakter.");

// Berkas PDF selalu diawali "%PDF-". Pemeriksaan ini mencegah berkas lain yang hanya
// diberi nama .pdf lolos (NFR-SEC-03).
export function looksLikePdf(data: Buffer): boolean {
  return data.length >= 5 && data.subarray(0, 5).toString("latin1") === "%PDF-";
}
