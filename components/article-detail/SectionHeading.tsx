// Judul bagian di kolom utama. Pemisah antarbagian berupa garis tipis dari induknya
// (lihat app/articles/[id]/page.tsx), jadi judul cukup teks biasa tanpa dekorasi.
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-white">{children}</h2>;
}
