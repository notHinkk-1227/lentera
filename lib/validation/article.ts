import { z } from "zod";

// Tautan eksternal bersifat opsional. String kosong dianggap "tidak diisi". Hanya http(s) yang
// diterima: URL ini dipakai di atribut href dan redirect, jadi skema lain (javascript:, data:)
// harus ditolak di server.
const MAX_URL_LENGTH = 2000;

export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

const optionalUrl = (label: string) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    z
      .string()
      .trim()
      .max(MAX_URL_LENGTH, `Tautan ${label} terlalu panjang.`)
      .refine(isHttpUrl, `Tautan ${label} harus berupa URL http(s) yang valid.`)
      .optional(),
  );

// Field pada form unggah karya. Tidak ada berkas: karya hanya menaut ke situs eksternal.
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
  downloadUrl: optionalUrl("unduh"),
  scholarUrl: optionalUrl("Google Scholar"),
  sintaUrl: optionalUrl("SINTA"),
});

export const rejectNoteSchema = z.string().trim().min(1, "Alasan penolakan wajib diisi.").max(1000);

export const taxonomyNameSchema = z
  .string()
  .trim()
  .min(2, "Nama minimal 2 karakter.")
  .max(100, "Nama maksimal 100 karakter.");
